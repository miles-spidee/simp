import 'package:flutter_riverpod/flutter_riverpod.dart';

enum AuthState { initial, loading, authenticated, unauthenticated, error }

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(AuthState.initial);

  Future<void> login(String email, String password) async {
    // TODO: Implement login logic
  }

  Future<void> logout() async {
    // TODO: Implement logout logic
  }

  Future<void> checkAuth() async {
    // TODO: Implement auth check logic
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
