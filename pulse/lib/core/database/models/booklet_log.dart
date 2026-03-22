import 'package:isar/isar.dart';

part 'booklet_log.g.dart';

@collection
class BookletLog {
  Id id = Isar.autoIncrement;

  @Index()
  late String studentId;

  @Index()
  late String sessionId;

  late String bookletNumber;
  late DateTime timestamp;
  late bool isSynced;

  Map<String, dynamic> toJson() => {
        'student_id': studentId,
        'session_id': sessionId,
        'booklet_number': bookletNumber,
        'scanned_at': timestamp.toIso8601String(),
      };

  static BookletLog create({
    required String studentId,
    required String sessionId,
    required String bookletNumber,
  }) {
    return BookletLog()
      ..studentId = studentId
      ..sessionId = sessionId
      ..bookletNumber = bookletNumber
      ..timestamp = DateTime.now()
      ..isSynced = false;
  }
}
