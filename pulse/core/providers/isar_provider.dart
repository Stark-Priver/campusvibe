import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:isar/isar.dart';
import '../database/models/student_record.dart';
import '../database/models/attendance_log.dart';
import '../database/models/sync_queue_item.dart';
import '../database/repository/isar_repository.dart';

final isarProvider = Provider<Isar>((ref) => throw UnimplementedError());
final isarRepositoryProvider = Provider<IsarRepository>((ref) {
  final isar = ref.watch(isarProvider);
  return IsarRepository(isar);
});
