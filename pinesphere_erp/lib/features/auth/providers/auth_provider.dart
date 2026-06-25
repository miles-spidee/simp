import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:pinesphere_erp/core/network/api_config.dart';
import 'package:pinesphere_erp/core/network/dio_client.dart';
import 'package:pinesphere_erp/core/storage/secure_storage.dart';
import 'package:pinesphere_erp/shared/models/auth_response_model.dart';
import 'package:pinesphere_erp/shared/models/user_model.dart';

// ── Auth State ────────────────────────────────────────────────────────────────

enum AuthStatus { initial, loading, authenticated, unauthenticated, error }

class AuthState {
  final AuthStatus status;
  final UserModel? user;
  final String? errorMessage;

  const AuthState({
    required this.status,
    this.user,
    this.errorMessage,
  });

  factory AuthState.initial() => const AuthState(status: AuthStatus.initial);
  factory AuthState.loading() => const AuthState(status: AuthStatus.loading);
  factory AuthState.authenticated(UserModel user) =>
      AuthState(status: AuthStatus.authenticated, user: user);
  factory AuthState.unauthenticated() =>
      const AuthState(status: AuthStatus.unauthenticated);
  factory AuthState.error(String message) =>
      AuthState(status: AuthStatus.error, errorMessage: message);

  bool get isAuthenticated => status == AuthStatus.authenticated;
  bool get isLoading => status == AuthStatus.loading;
  bool get hasError => status == AuthStatus.error;

  // Portal routing helper — used by GoRouter redirect and login screen
  String? get targetRoute {
    if (user == null) return null;
    switch (user!.portalKey) {
      case 'student':
        return '/student';
      case 'admin':
        return '/admin';
      default:
        return '/hr';
    }
  }
}

// ── Auth Notifier ─────────────────────────────────────────────────────────────

class AuthNotifier extends StateNotifier<AuthState> {
  final Dio _dio;

  AuthNotifier(this._dio) : super(AuthState.initial());

  /// Decode JWT payload and construct UserModel.
  UserModel? _decodeUser(String token) {
    try {
      final payload = JwtDecoder.decode(token);
      return UserModel.fromJwtPayload(payload);
    } catch (_) {
      return null;
    }
  }

  /// Called from SplashScreen — checks for an existing stored token.
  Future<void> checkAuth() async {
    state = AuthState.loading();
    final token = await SecureStorage.instance.getAccessToken();
    if (token == null || token.isEmpty) {
      state = AuthState.unauthenticated();
      return;
    }

    // Validate token is not expired
    try {
      if (JwtDecoder.isExpired(token)) {
        await SecureStorage.instance.clearAll();
        state = AuthState.unauthenticated();
        return;
      }
    } catch (_) {
      await SecureStorage.instance.clearAll();
      state = AuthState.unauthenticated();
      return;
    }

    final user = _decodeUser(token);
    if (user != null) {
      state = AuthState.authenticated(user);
    } else {
      await SecureStorage.instance.clearAll();
      state = AuthState.unauthenticated();
    }
  }

  /// Sign in — mirrors authService.login() from frontend auth.service.ts
  /// Endpoint: POST /api/v1/auth/login  body: { username, password }
  Future<void> login(String username, String password) async {
    if (state.isLoading) return;
    state = AuthState.loading();

    try {
      final response = await _dio.post(
        ApiConfig.login,
        data: {
          'username': username,
          'password': password,
        },
      );

      final authResponse = AuthResponseModel.fromJson(
        response.data as Map<String, dynamic>,
      );

      // Persist tokens — matches localStorage.setItem in frontend
      await SecureStorage.instance.saveTokens(
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken,
      );

      final user = _decodeUser(authResponse.accessToken);
      if (user != null) {
        state = AuthState.authenticated(user);
      } else {
        // Token received but not decodable — store and treat as generic HR user
        state = AuthState.authenticated(
          UserModel(
            userId: '',
            username: username,
            email: '',
            role: '',
            displayName: username,
          ),
        );
      }
    } on DioException catch (e) {
      final statusCode = e.response?.statusCode;
      if (statusCode == 401 || statusCode == 403) {
        state = AuthState.error('Invalid username or password. Please try again.');
      } else if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.connectionError) {
        state = AuthState.error('Unable to reach the server. Check your connection.');
      } else {
        final msg = e.response?.data?['detail'] ??
            e.response?.data?['message'] ??
            'Login failed. Please try again.';
        state = AuthState.error(msg.toString());
      }
    } catch (e) {
      state = AuthState.error('An unexpected error occurred.');
    }
  }

  /// Sign out — mirrors authService.logout() from frontend
  Future<void> logout() async {
    await SecureStorage.instance.clearAll();
    state = AuthState.unauthenticated();
  }
}

// ── Providers ─────────────────────────────────────────────────────────────────

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(DioClient().dio);
});

/// Convenience provider for current user model
final currentUserProvider = Provider<UserModel?>((ref) {
  return ref.watch(authProvider).user;
});

// ── Legacy compatibility types (used by existing screens) ─────────────────────
// These allow existing code that imports auth_provider.dart to continue working

/// @deprecated Use AuthState directly
@Deprecated('Use AuthStatus instead')
typedef AuthStateEnum = AuthStatus;
