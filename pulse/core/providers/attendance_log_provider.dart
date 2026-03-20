import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/models/attendance_log.dart';
import 'isar_provider.dart';

final attendanceLogsProvider = FutureProvider<List<AttendanceLog>>((ref) async {
  final repo = ref.watch(isarRepositoryProvider);
  return repo.getAllLogs();
});

final unsyncedLogsProvider = FutureProvider<List<AttendanceLog>>((ref) async {
  final repo = ref.watch(isarRepositoryProvider);
  return repo.getUnsyncedLogs();
});
