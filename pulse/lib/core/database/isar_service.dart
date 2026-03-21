import 'package:isar/isar.dart';
import 'package:path_provider/path_provider.dart';
import 'models/student_record.dart';
import 'models/attendance_log.dart';
import 'models/sync_queue_item.dart';

class IsarService {
  IsarService._();

  static Isar? _isar;

  static Isar get instance {
    assert(_isar != null, 'IsarService must be initialized before use.');
    return _isar!;
  }

  static bool get isInitialized => _isar != null;

  static Future<void> initialize() async {
    if (_isar != null && _isar!.isOpen) return;

    final dir = await getApplicationDocumentsDirectory();

    _isar = await Isar.open(
      [
        StudentRecordSchema,
        AttendanceLogSchema,
        SyncQueueItemSchema,
      ],
      directory: dir.path,
      name: 'pulse_db',
    );
  }

  static Future<void> close() async {
    await _isar?.close();
    _isar = null;
  }

  // ─── Student Operations ────────────────────────────────────
  static Future<StudentRecord?> getStudentById(String studentId) async {
    return instance.studentRecords
        .where()
        .studentIdEqualTo(studentId)
        .findFirst();
  }

  static Future<List<StudentRecord>> getAllStudents() async {
    return instance.studentRecords.where().findAll();
  }

  static Future<int> getStudentCount() async {
    return instance.studentRecords.count();
  }

  static Future<int> getEligibleStudentCount() async {
    return instance.studentRecords
        .filter()
        .isEligibleEqualTo(true)
        .count();
  }

  static Future<void> upsertStudents(List<StudentRecord> students) async {
    await instance.writeTxn(() async {
      await instance.studentRecords.putAll(students);
    });
  }

  static Future<void> upsertStudent(StudentRecord student) async {
    await instance.writeTxn(() async {
      await instance.studentRecords.put(student);
    });
  }

  // ─── Attendance Log Operations ─────────────────────────────
  static Future<void> saveAttendanceLog(AttendanceLog log) async {
    await instance.writeTxn(() async {
      await instance.attendanceLogs.put(log);
    });
  }

  static Future<List<AttendanceLog>> getAllLogs() async {
    return instance.attendanceLogs
        .where()
        .sortByTimestampDesc()
        .findAll();
  }

  static Future<List<AttendanceLog>> getUnsyncedLogs() async {
    return instance.attendanceLogs
        .filter()
        .isSyncedEqualTo(false)
        .findAll();
  }

  static Future<List<AttendanceLog>> getRecentLogs({int limit = 10}) async {
    return instance.attendanceLogs
        .where()
        .sortByTimestampDesc()
        .limit(limit)
        .findAll();
  }

  static Future<void> markLogSynced(int logId) async {
    await instance.writeTxn(() async {
      final log = await instance.attendanceLogs.get(logId);
      if (log != null) {
        log.isSynced = true;
        await instance.attendanceLogs.put(log);
      }
    });
  }

  static Future<void> markLogsSynced(List<int> logIds) async {
    await instance.writeTxn(() async {
      for (final id in logIds) {
        final log = await instance.attendanceLogs.get(id);
        if (log != null) {
          log.isSynced = true;
          await instance.attendanceLogs.put(log);
        }
      }
    });
  }

  static Future<List<AttendanceLog>> searchLogs(String query) async {
    final lower = query.toLowerCase();
    final all = await getAllLogs();
    return all.where((log) {
      return log.studentName.toLowerCase().contains(lower) ||
          log.studentId.toLowerCase().contains(lower) ||
          log.sessionName.toLowerCase().contains(lower);
    }).toList();
  }

  // ─── Sync Queue Operations ─────────────────────────────────
  static Future<void> addToSyncQueue(SyncQueueItem item) async {
    await instance.writeTxn(() async {
      await instance.syncQueueItems.put(item);
    });
  }

  static Future<List<SyncQueueItem>> getPendingSyncItems() async {
    return instance.syncQueueItems.where().findAll();
  }

  static Future<void> removeSyncQueueItem(int id) async {
    await instance.writeTxn(() async {
      await instance.syncQueueItems.delete(id);
    });
  }

  static Future<void> incrementSyncRetry(int id, String error) async {
    await instance.writeTxn(() async {
      final item = await instance.syncQueueItems.get(id);
      if (item != null) {
        item.retryCount += 1;
        item.lastError = error;
        await instance.syncQueueItems.put(item);
      }
    });
  }
}
