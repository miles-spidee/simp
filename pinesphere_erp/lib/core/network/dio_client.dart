import 'package:dio/dio.dart';
import 'package:pinesphere_erp/core/storage/secure_storage.dart';
import 'api_config.dart';

/// Dio HTTP client singleton with JWT interceptor.
///
/// Mirrors the request/response interceptor logic from frontend api.client.ts:
/// - Attaches 'Authorization: Bearer <token>' to every outgoing request
/// - On 401: clears stored token (redirect is handled by GoRouter redirect)
class DioClient {
  static final DioClient _instance = DioClient._internal();
  late final Dio dio;

  factory DioClient() => _instance;

  DioClient._internal() {
    dio = Dio(BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: const Duration(milliseconds: ApiConfig.connectTimeout),
      receiveTimeout: const Duration(milliseconds: ApiConfig.receiveTimeout),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Attach JWT token from secure storage (mirrors localStorage in frontend)
          final token = await SecureStorage.instance.getAccessToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onResponse: (response, handler) {
          return handler.next(response);
        },
        onError: (DioException error, handler) async {
          if (error.response?.statusCode == 401) {
            // Token expired / invalid — clear stored credentials
            // GoRouter redirect will pick this up on next navigation
            await SecureStorage.instance.clearAll();
          }
          return handler.next(error);
        },
      ),
    );
  }
}
