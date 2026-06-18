import 'dart:async';

class MockDiagnosticsService {
  static Stream<String> runDiagnostics() async* {
    yield "Initializing TypeScript typecheck compiler...";
    await Future.delayed(Duration(milliseconds: 800));
    yield "Analyzing 24 source files in app/dashboard/...";
    await Future.delayed(Duration(milliseconds: 800));
    yield "✓ No critical compilation errors.";
    await Future.delayed(Duration(milliseconds: 400));
    yield "ESLint: Passed with 2 minor warnings (unused imports).";
    await Future.delayed(Duration(milliseconds: 400));
    yield "Vercel Deployment Preview is synced successfully.";
  }
}
