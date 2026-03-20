import 'package:isar/isar.dart';

part 'sync_queue_item.g.dart';

@collection
class SyncQueueItem {
  Id id = Isar.autoIncrement;

  late String recordType;
  late int recordId;
  late String action; // 'insert' or 'update'
  late DateTime createdAt;
}
