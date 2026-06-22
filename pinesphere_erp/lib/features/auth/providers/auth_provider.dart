import 'package:flutter_riverpod/flutter_riverpod.dart';

enum UserRole { student, hr }

enum AuthState { initial, loading, authenticated, unauthenticated, error }

class AuthNotifier extends StateNotifier<AuthState> {
  UserRole? _userRole;

  UserRole? get userRole => _userRole;

  AuthNotifier() : super(AuthState.initial);

  Future<void> login(String email, String password) async {
    state = AuthState.loading;
    await Future.delayed(const Duration(seconds: 1));
    if (email == 'student@pinesphere.com') {
      _userRole = UserRole.student;
      state = AuthState.authenticated;
    } else if (email == 'hr@pinesphere.com') {
      _userRole = UserRole.hr;
      state = AuthState.authenticated;
    } else {
      state = AuthState.error;
    }
  }

  Future<void> logout() async {
    _userRole = null;
    state = AuthState.unauthenticated;
  }

  Future<void> checkAuth() async {
    state = AuthState.unauthenticated;
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});

final userRoleProvider = Provider<UserRole?>((ref) {
  return ref.watch(authProvider.notifier).userRole;
});
