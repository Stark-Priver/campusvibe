import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/database/isar_service.dart';
import '../../../core/database/models/attendance_log.dart';
import '../../../core/sync/sync_service.dart';

class DashboardStats {
  final int totalStudents;
  final int eligibleStudents;
  final int totalLogs;
  final int unsyncedLogs;

  const DashboardStats({
    required this.totalStudents,
    required this.eligibleStudents,
    required this.totalLogs,
    required this.unsyncedLogs,
  });

  static const empty = DashboardStats(
    totalStudents: 0,
    eligibleStudents: 0,
    totalLogs: 0,
    unsyncedLogs: 0,
  );
}

class DashboardNotifier extends StateNotifier<AsyncValue<DashboardStats>> {
  DashboardNotifier() : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final total = await IsarService.getStudentCount();
      final eligible = await IsarService.getEligibleStudentCount();
      final logs = await IsarService.getAllLogs();
      final unsynced = await IsarService.getUnsyncedLogs();

      state = AsyncValue.data(DashboardStats(
        totalStudents: total,
        eligibleStudents: eligible,
        totalLogs: logs.length,
        unsyncedLogs: unsynced.length,
      ));
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final dashboardStatsProvider =
    StateNotifierProvider<DashboardNotifier, AsyncValue<DashboardStats>>((ref) {
  return DashboardNotifier();
});

final recentLogsProvider = FutureProvider<List<AttendanceLog>>((ref) async {
  return IsarService.getRecentLogs(limit: 8);
});

/// Trigger a manual sync and refresh dashboard
final dashboardSyncProvider = Provider<Future<void> Function()>((ref) {
  return () async {
    await ref.read(syncServiceProvider.notifier).sync();
    ref.read(dashboardStatsProvider.notifier).load();
    ref.invalidate(recentLogsProvider);
  };
});
