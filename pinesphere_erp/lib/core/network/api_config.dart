enum Environment { development, staging, production }

class ApiConfig {
  static Environment currentEnvironment = Environment.development;

  static String get baseUrl {
    switch (currentEnvironment) {
      case Environment.development:
        return 'https://dev-api.pinesphere.com';
      case Environment.staging:
        return 'https://staging-api.pinesphere.com';
      case Environment.production:
        return 'https://api.pinesphere.com';
    }
  }

  static const int connectTimeout = 30000;
  static const int receiveTimeout = 30000;
}
