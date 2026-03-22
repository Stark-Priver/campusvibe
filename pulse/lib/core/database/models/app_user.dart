import 'package:isar/isar.dart';

part 'app_user.g.dart';

@collection
class AppUser {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String authUid;

  late String email;
  late String fullName;

  /// Roles can be: 'admin', 'watchman', 'invigilator', 'librarian', 'student'
  late String role;

  DateTime? lastLogin;

  Map<String, dynamic> toJson() => {
        'auth_uid': authUid,
        'email': email,
        'full_name': fullName,
        'role': role,
      };

  static AppUser fromJson(Map<String, dynamic> json) {
    return AppUser()
      ..authUid = json['auth_uid'] as String
      ..email = json['email'] as String
      ..fullName = json['full_name'] as String
      ..role = json['role'] as String? ?? 'staff';
  }
}
