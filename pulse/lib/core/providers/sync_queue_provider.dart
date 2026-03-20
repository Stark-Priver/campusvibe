import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/models/sync_queue_item.dart';
import 'isar_provider.dart';

final syncQueueProvider = FutureProvider<List<SyncQueueItem>>((ref) async {
  final repo = ref.watch(isarRepositoryProvider);
  return repo.getAllSyncQueueItems();
});
