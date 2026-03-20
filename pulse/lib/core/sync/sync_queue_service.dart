import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/models/sync_queue_item.dart';
import '../providers/isar_provider.dart';

class SyncQueueService {
  final Ref ref;
  SyncQueueService(this.ref);

  Future<void> addToQueue(SyncQueueItem item) async {
    final repo = ref.read(isarRepositoryProvider);
    await repo.addSyncQueueItem(item);
  }

  Future<void> clearQueue() async {
    final repo = ref.read(isarRepositoryProvider);
    await repo.clearSyncQueue();
  }
}
