import 'package:isar/isar.dart';
import 'package:path_provider/path_provider.dart';
import 'models/student_record.dart';
import 'models/attendance_log.dart';
import 'models/sync_queue_item.dart';
import 'models/session_model.dart';
import 'models/app_user.dart';
import 'models/booklet_log.dart';

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
        SessionModelSchema,
        AppUserSchema,
        BookletLogSchema,
      ],
      directory: dir.path,
      name: 'pulse_db',
    );
  }

  static Future<void> close() async {
    await _isar?.close();
    _isar = null;
  }

  // ─── Student Operations ────────────────────────────────────────────────────
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

  // ─── Attendance Log Operations ─────────────────────────────────────────────
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

  // ─── Session Operations ────────────────────────────────────────────────────
  static Future<List<SessionModel>> getAllSessions() async {
    return instance.sessionModels.where().findAll();
  }

  static Future<List<SessionModel>> getActiveSessions() async {
    return instance.sessionModels.filter().isActiveEqualTo(true).findAll();
  }

  static Future<SessionModel?> getSessionByRemoteId(String remoteId) async {
    return instance.sessionModels
        .where()
        .remoteIdEqualTo(remoteId)
        .findFirst();
  }

  static Future<void> upsertSession(SessionModel session) async {
    await instance.writeTxn(() async {
      await instance.sessionModels.put(session);
    });
  }

  static Future<void> upsertSessions(List<SessionModel> sessions) async {
    await instance.writeTxn(() async {
      await instance.sessionModels.putAll(sessions);
    });
  }

  static Future<void> deleteSession(int id) async {
    await instance.writeTxn(() async {
      await instance.sessionModels.delete(id);
    });
  }

  static Future<List<SessionModel>> getUnsyncedSessions() async {
    return instance.sessionModels.filter().isSyncedEqualTo(false).findAll();
  }

  static Future<void> markSessionSynced(int id) async {
    await instance.writeTxn(() async {
      final session = await instance.sessionModels.get(id);
      if (session != null) {
        session.isSynced = true;
        await instance.sessionModels.put(session);
      }
    });
  }

  // ─── AppUser Operations ────────────────────────────────────────────────────
  static Future<List<AppUser>> getAllUsers() async {
    return instance.appUsers.where().findAll();
  }

  static Future<AppUser?> getUserByAuthUid(String authUid) async {
    return instance.appUsers
        .where()
        .authUidEqualTo(authUid)
        .findFirst();
  }

  static Future<void> upsertUser(AppUser user) async {
    await instance.writeTxn(() async {
      await instance.appUsers.put(user);
    });
  }

  static Future<void> upsertUsers(List<AppUser> users) async {
    await instance.writeTxn(() async {
      await instance.appUsers.putAll(users);
    });
  }

  static Future<void> deleteUser(int id) async {
    await instance.writeTxn(() async {
      await instance.appUsers.delete(id);
    });
  }

  // ─── BookletLog Operations ─────────────────────────────────────────────────
  static Future<void> saveBookletLog(BookletLog log) async {
    await instance.writeTxn(() async {
      await instance.bookletLogs.put(log);
    });
  }

  static Future<List<BookletLog>> getAllBookletLogs() async {
    return instance.bookletLogs.where().findAll();
  }

  static Future<List<BookletLog>> getUnsyncedBookletLogs() async {
    return instance.bookletLogs.filter().isSyncedEqualTo(false).findAll();
  }

  static Future<BookletLog?> getBookletLogByStudentId(
      String studentId) async {
    return instance.bookletLogs
        .filter()
        .studentIdEqualTo(studentId)
        .findFirst();
  }

  static Future<void> markBookletLogSynced(int id) async {
    await instance.writeTxn(() async {
      final log = await instance.bookletLogs.get(id);
      if (log != null) {
        log.isSynced = true;
        await instance.bookletLogs.put(log);
      }
    });
  }

  // ─── Sync Queue Operations ─────────────────────────────────────────────────
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
