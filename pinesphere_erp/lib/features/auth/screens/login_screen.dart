import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pinesphere_erp/core/routes/app_routes.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/widgets/toast_notification.dart';
import 'package:pinesphere_erp/features/auth/providers/auth_provider.dart';
import 'package:pinesphere_erp/features/auth/widgets/ambient_background.dart';
import 'package:pinesphere_erp/features/auth/widgets/auth_text_field.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  bool _rememberMe = false;
  bool _isPasswordVisible = false;
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin(AuthNotifier authNotifier, AuthState authState) async {
    if (authState == AuthState.loading) return;

    if (_formKey.currentState?.validate() ?? false) {
      final username = _emailController.text.trim();
      final password = _passwordController.text;

      await authNotifier.login(username, password);
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final authNotifier = ref.read(authProvider.notifier);

    ref.listen<AuthState>(authProvider, (previous, next) {
      if (!mounted) return;
      if (next == AuthState.authenticated) {
        PinesphereToast.show(
          context,
          title: 'Login Successful',
          message: 'Redirecting to your workspace...',
          type: ToastType.success,
        );
        
        final userRole = ref.read(userRoleProvider);
        if (userRole == UserRole.student) {
          context.go(AppRoutes.studentDashboard);
        } else if (userRole == UserRole.hr) {
          context.go(AppRoutes.hrDashboard);
        }
      } else if (next == AuthState.error) {
        PinesphereToast.show(
          context,
          title: 'Authentication Failed',
          message: 'Invalid username or password. Please try again.',
          type: ToastType.error,
        );
      }
    });

    return Scaffold(
      body: AmbientBackground(
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              physics: const ClampingScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 420),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Centered App Logo
                      Center(
                        child: Image.asset(
                          'assets/images/image.png',
                          height: 72,
                          fit: BoxFit.contain,
                        ),
                      ),
                      const SizedBox(height: 24),
                      // Welcome Typography Hierarchy
                      Text(
                        'Welcome Back',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 26,
                          fontWeight: FontWeight.w800,
                          color: AppColors.slate900,
                          letterSpacing: -0.6,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Sign in to continue to your workspace',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14,
                          color: AppColors.slate500,
                        ),
                      ),
                      const SizedBox(height: 32),

                          // Login Card Container
                          Container(
                            padding: const EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              border: Border.all(color: AppColors.slate100),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.02),
                                  blurRadius: 4,
                                  offset: const Offset(0, 2),
                                ),
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.05),
                                  blurRadius: 16,
                                  offset: const Offset(0, 8),
                                ),
                              ],
                            ),
                            child: Form(
                              key: _formKey,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  // Username Field
                                  AuthTextField(
                                    label: 'Username',
                                    hintText: 'student@pinesphere.com or hr@pinesphere.com',
                                    controller: _emailController,
                                    keyboardType: TextInputType.emailAddress,
                                    validator: (value) {
                                      if (value == null || value.trim().isEmpty) {
                                        return 'Please enter your username';
                                      }
                                      return null;
                                    },
                                  ),
                                  const SizedBox(height: 20),

                                  // Password Field
                                  AuthTextField(
                                    label: 'Password',
                                    hintText: '••••••••',
                                    controller: _passwordController,
                                    obscureText: !_isPasswordVisible,
                                    validator: (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Please enter your password';
                                      }
                                      return null;
                                    },
                                    headerAction: GestureDetector(
                                      onTap: () {
                                        PinesphereToast.show(
                                          context,
                                          title: 'Info',
                                          message: 'Password reset instructions will be sent.',
                                          type: ToastType.info,
                                        );
                                      },
                                      child: const Text(
                                        'Forgot Password?',
                                        style: TextStyle(
                                          fontFamily: 'Inter',
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                          color: AppColors.primaryBlue,
                                        ),
                                      ),
                                    ),
                                    suffixIcon: IconButton(
                                      onPressed: () {
                                        setState(() {
                                          _isPasswordVisible = !_isPasswordVisible;
                                        });
                                      },
                                      icon: Icon(
                                        _isPasswordVisible
                                            ? Icons.visibility_outlined
                                            : Icons.visibility_off_outlined,
                                        size: 20,
                                        color: AppColors.slate400,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 20),

                                  // Remember Me Row
                                  Row(
                                    children: [
                                      SizedBox(
                                        width: 18,
                                        height: 18,
                                        child: Checkbox(
                                          value: _rememberMe,
                                          onChanged: (value) {
                                            setState(() {
                                              _rememberMe = value ?? false;
                                            });
                                          },
                                          shape: const RoundedRectangleBorder(
                                            borderRadius: BorderRadius.zero,
                                          ),
                                          side: const BorderSide(
                                            color: AppColors.slate300,
                                            width: 1.5,
                                          ),
                                          activeColor: AppColors.primaryBlue,
                                          checkColor: Colors.white,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      GestureDetector(
                                        onTap: () {
                                          setState(() {
                                            _rememberMe = !_rememberMe;
                                          });
                                        },
                                        child: const Text(
                                          'Remember Me',
                                          style: TextStyle(
                                            fontFamily: 'Inter',
                                            fontSize: 13,
                                            fontWeight: FontWeight.w600,
                                            color: AppColors.slate700,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 24),

                                  // Submit Button
                                  SizedBox(
                                    width: double.infinity,
                                    height: 48,
                                    child: ElevatedButton(
                                      onPressed: authState == AuthState.loading
                                          ? null
                                          : () => _handleLogin(authNotifier, authState),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: AppColors.primaryBlue,
                                        foregroundColor: Colors.white,
                                        disabledBackgroundColor: AppColors.primaryBlue.withValues(alpha: 0.6),
                                        elevation: 0,
                                        shape: const RoundedRectangleBorder(
                                          borderRadius: BorderRadius.zero,
                                        ),
                                        padding: const EdgeInsets.symmetric(vertical: 0),
                                      ),
                                      child: authState == AuthState.loading
                                          ? const SizedBox(
                                              width: 20,
                                              height: 20,
                                              child: CircularProgressIndicator(
                                                color: Colors.white,
                                                strokeWidth: 2,
                                              ),
                                            )
                                          : const Row(
                                              mainAxisAlignment: MainAxisAlignment.center,
                                              children: [
                                                Text(
                                                  'Sign In',
                                                  style: TextStyle(
                                                    fontFamily: 'Inter',
                                                    fontSize: 14,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                                SizedBox(width: 8),
                                                Icon(
                                                  Icons.arrow_forward_rounded,
                                                  size: 16,
                                                ),
                                              ],
                                            ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 48),
                          
                          // Brand Footer
                          _buildFooter(),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
  }



  Widget _buildFooter() {
    return Column(
      children: [
        Text(
          '© ${DateTime.now().year} Pinesphere Enterprise',
          style: const TextStyle(
            fontFamily: 'Inter',
            fontSize: 12,
            color: AppColors.slate400,
          ),
        ),
        const SizedBox(height: 8),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildFooterLink('Privacy Policy'),
            _buildFooterDivider(),
            _buildFooterLink('Terms'),
            _buildFooterDivider(),
            _buildFooterLink('Support'),
          ],
        ),
      ],
    );
  }

  Widget _buildFooterLink(String label) {
    return GestureDetector(
      onTap: () {},
      child: Text(
        label,
        style: const TextStyle(
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: AppColors.slate700,
          decoration: TextDecoration.underline,
        ),
      ),
    );
  }

  Widget _buildFooterDivider() {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: 8),
      child: Text(
        '|',
        style: TextStyle(
          fontSize: 12,
          color: AppColors.slate300,
        ),
      ),
    );
  }
}
