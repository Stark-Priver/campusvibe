import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:isar/isar.dart';
import '../database/repository/isar_repository.dart';

final isarProvider = Provider<Isar>((ref) => throw UnimplementedError());
final isarRepositoryProvider = Provider<IsarRepository>((ref) {
  final isar = ref.watch(isarProvider);
  return IsarRepository(isar);
});
