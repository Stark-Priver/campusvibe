import 'package:isar/isar.dart';

part 'attendance_log.g.dart';

@collection
class AttendanceLog {
  Id id = Isar.autoIncrement;

  @Index()
  late String studentId;

  late String sessionId;
  late String sessionType; // 'exam' or 'class'
  late DateTime timestamp;
  late bool isSynced;
}
