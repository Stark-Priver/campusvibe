import 'package:isar/isar.dart';

part 'attendance_log.g.dart';

@collection
class AttendanceLog {
  Id id = Isar.autoIncrement;

  @Index()
  late String studentId;

  late String studentName;
  late String sessionId;
  late String sessionName;
  late String sessionType;
  late DateTime timestamp;
  late bool isEligible;
  late bool isSynced;

  // Local UUID for deduplication when syncing
  @Index(unique: true, replace: true)
  late String localId;

  Map<String, dynamic> toJson() => {
        'student_id': studentId,
        'session_id': sessionId,
        'session_type': sessionType,
        'scanned_at': timestamp.toIso8601String(),
        'device_log_id': localId,
      };

  static AttendanceLog create({
    required String studentId,
    required String studentName,
    required String sessionId,
    required String sessionName,
    required String sessionType,
    required bool isEligible,
    required String localId,
  }) {
    return AttendanceLog()
      ..studentId = studentId
      ..studentName = studentName
      ..sessionId = sessionId
      ..sessionName = sessionName
      ..sessionType = sessionType
      ..timestamp = DateTime.now()
      ..isEligible = isEligible
      ..isSynced = false
      ..localId = localId;
  }
}
