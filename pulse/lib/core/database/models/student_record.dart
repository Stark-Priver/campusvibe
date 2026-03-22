import 'package:isar/isar.dart';

part 'student_record.g.dart';

@collection
class StudentRecord {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String studentId;

  late String fullName;
  late String course;
  late int year;
  late bool isEligible;

  String? photoUrl;

  DateTime? syncedAt;

  Map<String, dynamic> toJson() => {
        'student_id': studentId,
        'full_name': fullName,
        'course': course,
        'year': year,
        'is_eligible': isEligible,
        'photo_url': photoUrl,
        'synced_at': syncedAt?.toIso8601String(),
      };

  static StudentRecord fromJson(Map<String, dynamic> json) {
    final record = StudentRecord()
      ..studentId = json['student_id'] as String
      ..fullName = json['full_name'] as String
      ..course = json['course'] as String
      ..year = (json['year'] as num).toInt()
      ..isEligible = json['is_eligible'] as bool
      ..photoUrl = json['photo_url'] as String?
      ..syncedAt = json['synced_at'] != null
          ? DateTime.tryParse(json['synced_at'] as String)
          : null;
    return record;
  }

  static StudentRecord fromExcelRow({
    required String studentId,
    required String fullName,
    required String course,
    required int year,
    required bool isEligible,
    String? photoUrl,
  }) {
    return StudentRecord()
      ..studentId = studentId
      ..fullName = fullName
      ..course = course
      ..year = year
      ..isEligible = isEligible
      ..photoUrl = photoUrl;
  }
}
