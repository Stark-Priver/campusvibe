import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../constants/app_strings.dart';
import '../database/isar_service.dart';
import '../database/models/student_record.dart';
import '../database/models/sync_queue_item.dart';

enum SyncState { idle, syncing, success, failed, offline }

class SyncStatus {
  final SyncState state;
  final int pendingCount;
  final DateTime? lastSyncAt;
  final String? errorMessage;

  const SyncStatus({
    required this.state,
    required this.pendingCount,
    this.lastSyncAt,
    this.errorMessage,
  });

  SyncStatus copyWith({
    SyncState? state,
    int? pendingCount,
    DateTime? lastSyncAt,
    String? errorMessage,
  }) {
    return SyncStatus(
      state: state ?? this.state,
      pendingCount: pendingCount ?? this.pendingCount,
      lastSyncAt: lastSyncAt ?? this.lastSyncAt,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  bool get isOnline =>
      state != SyncState.offline && state != SyncState.failed;
}

class SyncService extends StateNotifier<SyncStatus> {
  SyncService()
      : super(const SyncStatus(
          state: SyncState.idle,
          pendingCount: 0,
        )) {
    _init();
  }

  late final SupabaseClient _supabase;
  bool _supabaseAvailable = false;

  void _init() {
    try {
      _supabase = Supabase.instance.client;
      _supabaseAvailable = true;
    } catch (_) {
      _supabaseAvailable = false;
    }

    _loadLastSync();
    _startConnectivityListener();
  }

  Future<void> _loadLastSync() async {
    final prefs = await SharedPreferences.getInstance();
    final ts = prefs.getString(AppStrings.prefLastSync);
    if (ts != null) {
      final dt = DateTime.tryParse(ts);
      if (dt != null) {
        state = state.copyWith(lastSyncAt: dt);
      }
    }
    await _updatePendingCount();
  }

  Future<void> _updatePendingCount() async {
    final unsynced = await IsarService.getUnsyncedLogs();
    state = state.copyWith(pendingCount: unsynced.length);
  }

  void _startConnectivityListener() {
    Connectivity().onConnectivityChanged.listen((result) {
      if (result != ConnectivityResult.none) {
        sync();
      } else {
        state = state.copyWith(state: SyncState.offline);
      }
    });
  }

  Future<bool> _isConnected() async {
    final result = await Connectivity().checkConnectivity();
    return result != ConnectivityResult.none;
  }

  Future<void> sync() async {
    if (state.state == SyncState.syncing) return;
    if (!_supabaseAvailable) {
      state = state.copyWith(
        state: SyncState.failed,
        errorMessage: AppStrings.errorSupabaseConfig,
      );
      return;
    }

    if (!await _isConnected()) {
      state = state.copyWith(state: SyncState.offline);
      return;
    }

    state = state.copyWith(state: SyncState.syncing);

    try {
      await _pushAttendanceLogs();
      await _pullStudentRecords();

      final now = DateTime.now();
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(
          AppStrings.prefLastSync, now.toIso8601String());

      await _updatePendingCount();

      state = state.copyWith(
        state: SyncState.success,
        lastSyncAt: now,
        errorMessage: null,
      );
    } catch (e) {
      await _updatePendingCount();
      state = state.copyWith(
        state: SyncState.failed,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> _pushAttendanceLogs() async {
    final unsyncedLogs = await IsarService.getUnsyncedLogs();
    if (unsyncedLogs.isEmpty) return;

    const batchSize = 50;
    final syncedIds = <int>[];

    for (var i = 0; i < unsyncedLogs.length; i += batchSize) {
      final batch = unsyncedLogs.skip(i).take(batchSize).toList();
      final payload = batch.map((log) => log.toJson()).toList();

      try {
        await _supabase
            .from(AppStrings.tableAttendanceLogs)
            .upsert(payload, onConflict: 'device_log_id');

        syncedIds.addAll(batch.map((l) => l.id));
      } catch (e) {
        for (final log in batch) {
          final queueItem = SyncQueueItem.create(
            recordType: 'attendance_log',
            recordId: log.id,
            action: 'insert',
          );
          await IsarService.addToSyncQueue(queueItem);
        }
        rethrow;
      }
    }

    if (syncedIds.isNotEmpty) {
      await IsarService.markLogsSynced(syncedIds);
    }
  }

  Future<void> _pullStudentRecords() async {
    final response = await _supabase
        .from(AppStrings.tableStudents)
        .select()
        .order('updated_at', ascending: false);

    final List<dynamic> data = response as List<dynamic>;
    if (data.isEmpty) return;

    final students = data
        .map((json) =>
            StudentRecord.fromJson(json as Map<String, dynamic>))
        .toList();

    await IsarService.upsertStudents(students);
  }

  Future<void> retryFailedSyncItems() async {
    if (!await _isConnected()) return;

    final items = await IsarService.getPendingSyncItems();
    for (final item in items) {
      try {
        if (item.recordType == 'attendance_log') {
          final logs = await IsarService.getUnsyncedLogs();
          final log = logs
              .where((l) => l.id == item.recordId)
              .firstOrNull;
          if (log != null) {
            await _supabase
                .from(AppStrings.tableAttendanceLogs)
                .upsert(log.toJson(), onConflict: 'device_log_id');
            await IsarService.markLogSynced(log.id);
            await IsarService.removeSyncQueueItem(item.id);
          }
        }
      } catch (e) {
        await IsarService.incrementSyncRetry(item.id, e.toString());
      }
    }
  }
}

final syncServiceProvider =
    StateNotifierProvider<SyncService, SyncStatus>((ref) {
  return SyncService();
});
