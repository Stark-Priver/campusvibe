import 'package:isar/isar.dart';
import '../models/student_record.dart';
import '../models/attendance_log.dart';
import '../models/sync_queue_item.dart';

class IsarRepository {
  final Isar isar;
  IsarRepository(this.isar);

  // StudentRecord
  Future<List<StudentRecord>> getAllStudents() =>
      isar.studentRecords.where().findAll();
  Future<StudentRecord?> getStudentById(String studentId) async {
    final records = await isar.studentRecords.where().findAll();
    try {
      return records.firstWhere((r) => r.studentId == studentId);
    } catch (e) {
      return null;
    }
  }
  Future<void> upsertStudent(StudentRecord student) async {
    await isar.writeTxn(() async {
      await isar.studentRecords.put(student);
    });
  }

  Future<void> upsertStudents(List<StudentRecord> students) async {
    await isar.writeTxn(() async {
      await isar.studentRecords.putAll(students);
    });
  }

  // AttendanceLog
  Future<List<AttendanceLog>> getAllLogs() =>
      isar.attendanceLogs.where().findAll();
  Future<List<AttendanceLog>> getUnsyncedLogs() =>
      isar.attendanceLogs.filter().isSyncedEqualTo(false).findAll();
  Future<void> addAttendanceLog(AttendanceLog log) async {
    await isar.writeTxn(() async {
      await isar.attendanceLogs.put(log);
    });
  }

  Future<void> markLogsSynced(List<int> ids) async {
    await isar.writeTxn(() async {
      for (final id in ids) {
        final log = await isar.attendanceLogs.get(id);
        if (log != null) {
          log.isSynced = true;
          await isar.attendanceLogs.put(log);
        }
      }
    });
  }

  // SyncQueueItem
  Future<void> addSyncQueueItem(SyncQueueItem item) async {
    await isar.writeTxn(() async {
      await isar.syncQueueItems.put(item);
    });
  }

  Future<List<SyncQueueItem>> getAllSyncQueueItems() =>
      isar.syncQueueItems.where().findAll();
  Future<void> clearSyncQueue() async {
    await isar.writeTxn(() async {
      await isar.syncQueueItems.clear();
    });
  }
}
