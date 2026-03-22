import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../database/models/app_user.dart';
import '../database/isar_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthState {
  final AppUser? user;
  final bool isLoading;

  AuthState({this.user, this.isLoading = false});
}

class AuthNotifier extends StateNotifier<AuthState> {
  final SupabaseClient _supabase = Supabase.instance.client;

  AuthNotifier() : super(AuthState(isLoading: true)) {
    _init();
  }

  Future<void> _init() async {
    // Listen to auth changes
    _supabase.auth.onAuthStateChange.listen((data) async {
      final user = data.session?.user;
      if (user != null) {
        final appUser = await _getOrCreateAppUser(user);
        state = AuthState(user: appUser, isLoading: false);
      } else {
        state = AuthState(user: null, isLoading: false);
      }
    });

    final session = _supabase.auth.currentSession;
    if (session != null) {
      final appUser = await _getOrCreateAppUser(session.user);
      state = AuthState(user: appUser, isLoading: false);
    } else {
      state = AuthState(user: null, isLoading: false);
    }
  }

  Future<AppUser> _getOrCreateAppUser(User user) async {
    final existing = await IsarService.getUserByAuthUid(user.id);
    if (existing != null) return existing;

    // Determine role from metadata or mock it for now based on email as requested
    String role = 'student';
    final email = user.email ?? '';
    if (email.contains('admin')) role = 'admin';
    else if (email.contains('watchman')) role = 'watchman';
    else if (email.contains('invigilator')) role = 'invigilator';
    else if (email.contains('librarian')) role = 'librarian';

    final newUser = AppUser()
      ..authUid = user.id
      ..email = email
      ..fullName = user.userMetadata?['full_name'] ?? email.split('@')[0].toUpperCase()
      ..role = role;

    await IsarService.upsertUser(newUser);
    return newUser;
  }

  Future<bool> login(String email, String password) async {
    state = AuthState(user: state.user, isLoading: true);
    try {
      await _supabase.auth.signInWithPassword(email: email, password: password);
      return true;
    } catch (e) {
      state = AuthState(user: null, isLoading: false);
      return false;
    }
  }

  Future<void> logout() async {
    await _supabase.auth.signOut();
    state = AuthState(user: null, isLoading: false);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
