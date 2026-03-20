import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/isar_provider.dart';
import '../providers/supabase_provider.dart';
import '../providers/attendance_log_provider.dart';
import '../database/models/attendance_log.dart';
import '../database/models/student_record.dart';

class SyncService {
  final Ref ref;
  SyncService(this.ref);

  Future<void> syncIfConnected() async {
    final connectivity = await Connectivity().checkConnectivity();
    if (connectivity.contains(ConnectivityResult.none)) return;
    await _syncAttendanceLogs();
    await _syncStudentRecords();
  }

  Future<void> _syncAttendanceLogs() async {
    final isarRepo = ref.read(isarRepositoryProvider);
    final supabaseRepo = ref.read(supabaseRepositoryProvider);
    final unsynced = await isarRepo.getUnsyncedLogs();
    if (unsynced.isEmpty) return;
    await supabaseRepo.uploadAttendanceLogs(unsynced);
    await isarRepo.markLogsSynced(unsynced.map((e) => e.id).toList());
  }

  Future<void> _syncStudentRecords() async {
    final isarRepo = ref.read(isarRepositoryProvider);
    final supabaseRepo = ref.read(supabaseRepositoryProvider);
    final students = await supabaseRepo.fetchAllStudents();
    await isarRepo.upsertStudents(students);
  }
}
