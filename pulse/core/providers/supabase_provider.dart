import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../database/repository/supabase_repository.dart';

final supabaseClientProvider = Provider<SupabaseClient>((ref) => Supabase.instance.client);
final supabaseRepositoryProvider = Provider<SupabaseRepository>((ref) {
  final client = ref.watch(supabaseClientProvider);
  return SupabaseRepository(client);
});
