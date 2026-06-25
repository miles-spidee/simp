import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/features/auth/providers/auth_provider.dart';

/// SplashScreen — shown on cold start.
///
/// Checks SecureStorage for a valid token. If found and not expired,
/// routes user directly to their portal without requiring re-login.
class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _fadeController;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();

    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeAnim = CurvedAnimation(parent: _fadeController, curve: Curves.easeIn);
    _fadeController.forward();

    // Minimum display time for branding, then check auth
    Future.delayed(const Duration(milliseconds: 1800), _checkAuth);
  }

  Future<void> _checkAuth() async {
    if (!mounted) return;
    // Trigger token validation in the auth provider
    await ref.read(authProvider.notifier).checkAuth();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Listen to auth state changes and navigate accordingly
    ref.listen<AuthState>(authProvider, (previous, next) {
      if (!mounted) return;
      switch (next.status) {
        case AuthStatus.authenticated:
          context.go(next.targetRoute ?? '/hr');
          break;
        case AuthStatus.unauthenticated:
        case AuthStatus.error:
          context.go('/login');
          break;
        default:
          break;
      }
    });

    return Scaffold(
      backgroundColor: Colors.white,
      body: FadeTransition(
        opacity: _fadeAnim,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(
                'assets/images/image.png',
                height: 100,
                fit: BoxFit.contain,
              ),
              const SizedBox(height: 28),
              const Text(
                'Pinesphere ERP',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: AppColors.slate900,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Enterprise Resource Platform',
                style: TextStyle(
                  fontSize: 13,
                  color: AppColors.slate400,
                  letterSpacing: 0.2,
                ),
              ),
              const SizedBox(height: 56),
              SizedBox(
                width: 28,
                height: 28,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    AppColors.primaryBlue.withValues(alpha: 0.7),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
