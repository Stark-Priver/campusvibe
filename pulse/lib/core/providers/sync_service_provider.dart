import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../sync/sync_service.dart';

final syncServiceProvider = Provider<SyncService>((ref) => SyncService(ref));
