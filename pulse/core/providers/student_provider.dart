import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/models/student_record.dart';
import 'isar_provider.dart';

final studentsProvider = FutureProvider<List<StudentRecord>>((ref) async {
  final repo = ref.watch(isarRepositoryProvider);
  return repo.getAllStudents();
});
