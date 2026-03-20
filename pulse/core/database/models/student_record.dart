import 'package:isar/isar.dart';

part 'student_record.g.dart';

@collection
class StudentRecord {
  Id id = Isar.autoIncrement;

  @Index(unique: true)
  late String studentId;

  late String fullName;
  late String course;
  late int year;
  late bool isEligible;
  DateTime? syncedAt;
}
