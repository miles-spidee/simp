/// API configuration — mirrors frontend api.client.ts
///
/// Base URL matches: process.env.NEXT_PUBLIC_API_URL || 'http://13.60.249.106:8000'
enum Environment { development, staging, production }

class ApiConfig {
  static Environment currentEnvironment = Environment.development;

  static String get baseUrl {
    switch (currentEnvironment) {
      case Environment.development:
        return 'http://13.60.249.106:8000';
      case Environment.staging:
        return 'https://staging-api.pinesphere.com';
      case Environment.production:
        return 'https://api.pinesphere.com';
    }
  }

  // ── Endpoints (mirrored from frontend API modules) ────────────────────────

  // Auth — auth.api.ts
  static const String login = '/api/v1/auth/login';
  static const String register = '/api/v1/auth/register';
  static const String assignRole = '/api/v1/auth/assign-role';

  // Students — student.api.ts
  static const String students = '/students/';

  // Programs — program.api.ts
  static const String programs = '/programs';
  static const String internshipTypes = '/programs/internship-types';

  // Batches
  static const String batches = '/batches/';

  // Employees
  static const String employees = '/employees/';

  // Organizations
  static const String organizations = '/organizations/';

  // Opportunities
  static const String opportunities = '/opportunities/';

  // Attendance
  static const String attendance = '/attendance/';

  // Allocations
  static const String allocations = '/allocations/';

  // ── Timeouts ──────────────────────────────────────────────────────────────

  static const int connectTimeout = 30000;
  static const int receiveTimeout = 30000;
}
