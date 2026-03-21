import 'package:isar/isar.dart';

part 'sync_queue_item.g.dart';

@collection
class SyncQueueItem {
  Id id = Isar.autoIncrement;

  late String recordType;
  late int recordId;
  late String action;
  late DateTime createdAt;
  late int retryCount;
  String? lastError;

  static SyncQueueItem create({
    required String recordType,
    required int recordId,
    required String action,
  }) {
    return SyncQueueItem()
      ..recordType = recordType
      ..recordId = recordId
      ..action = action
      ..createdAt = DateTime.now()
      ..retryCount = 0;
  }
}
