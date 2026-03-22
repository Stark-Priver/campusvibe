import 'package:isar/isar.dart';

part 'session_model.g.dart';

@collection
class SessionModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  String? remoteId;

  late String name;

  /// Type can be: 'exam', 'class', 'gate', 'library'
  late String type;

  late bool isActive;
  late bool isSynced;

  double? latitude;
  double? longitude;
  double? radius; // in meters

  DateTime? createdAt;

  Map<String, dynamic> toJson() => {
        'id': remoteId,
        'name': name,
        'session_type': type,
        'is_active': isActive,
      };

  static SessionModel fromJson(Map<String, dynamic> json) {
    return SessionModel()
      ..remoteId = json['id'] as String?
      ..name = json['name'] as String
      ..type = json['session_type'] as String
      ..isActive = json['is_active'] as bool? ?? true
      ..isSynced = true;
  }
}
