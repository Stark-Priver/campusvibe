import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/models/app_user.dart';
import '../database/isar_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthState {
  final AppUser? user;
  final bool isLoading;

  AuthState({this.user, this.isLoading = false});
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(AuthState(isLoading: true)) {
    _loadUser();
  }

  Future<void> _loadUser() async {
    final prefs = await SharedPreferences.getInstance();
    final uid = prefs.getString('auth_uid');
    if (uid != null) {
      final user = await IsarService.getUserByAuthUid(uid);
      state = AuthState(user: user, isLoading: false);
    } else {
      state = AuthState(user: null, isLoading: false);
    }
  }

  Future<bool> login(String email, String password) async {
    state = AuthState(user: state.user, isLoading: true);

    // Mock login logic - in production use Supabase Auth
    // We'll search for a user with this email or create a mock one for demo

    // For now, let's assume if email contains 'admin', 'watchman', 'invigilator', 'librarian', or 'student', we assign that role.
    String role = 'student';
    if (email.contains('admin')) role = 'admin';
    else if (email.contains('watchman')) role = 'watchman';
    else if (email.contains('invigilator')) role = 'invigilator';
    else if (email.contains('librarian')) role = 'librarian';

    final mockUser = AppUser()
      ..authUid = 'mock_uid_${email.hashCode}'
      ..email = email
      ..fullName = email.split('@')[0].toUpperCase()
      ..role = role;

    await IsarService.upsertUser(mockUser);

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_uid', mockUser.authUid);

    state = AuthState(user: mockUser, isLoading: false);
    return true;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_uid');
    state = AuthState(user: null, isLoading: false);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
