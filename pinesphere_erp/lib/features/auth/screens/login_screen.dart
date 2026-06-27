import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/widgets/premium_components.dart';
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
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    final authState = ref.read(authProvider);
    if (authState.isLoading) return;

    if (_formKey.currentState?.validate() ?? false) {
      final username = _usernameController.text.trim();
      final password = _passwordController.text;
      await ref.read(authProvider.notifier).login(username, password);
    }
  }

  Future<void> _handleDevelopmentLogin(DevelopmentDemoUser demoUser) async {
    await ref.read(authProvider.notifier).loginAsDevelopmentUser(demoUser);
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    // Listen and react to auth state changes
    ref.listen<AuthState>(authProvider, (previous, next) {
      if (!mounted) return;

      if (next.status == AuthStatus.authenticated) {
        PinesphereToast.show(
          context,
          title: 'Login Successful',
          message: 'Welcome back, ${next.user?.displayName ?? 'User'}!',
          type: ToastType.success,
        );
        // Route to the correct portal based on JWT role
        context.go(next.targetRoute ?? '/hr');
      } else if (next.status == AuthStatus.error) {
        PinesphereToast.show(
          context,
          title: 'Authentication Failed',
          message: next.errorMessage ?? 'Invalid username or password.',
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
                      // Logo
                      Center(
                        child: Image.asset(
                          'assets/images/image.png',
                          height: 72,
                          fit: BoxFit.contain,
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Heading
                      const Text(
                        'Welcome Back',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 26,
                          fontWeight: FontWeight.w800,
                          color: AppColors.slate900,
                          letterSpacing: -0.6,
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Sign in to continue to your workspace',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14,
                          color: AppColors.slate500,
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Card container
                      PremiumCard(
                        padding: const EdgeInsets.all(24),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              // Username field — matches backend LoginRequest.username
                              AuthTextField(
                                label: 'Username',
                                hintText: 'Enter your username',
                                controller: _usernameController,
                                keyboardType: TextInputType.text,
                                validator: (value) {
                                  if (value == null || value.trim().isEmpty) {
                                    return 'Please enter your username';
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 20),

                              // Password field
                              AuthTextField(
                                label: 'Password',
                                hintText: '••••••••',
                                controller: _passwordController,
                                obscureText: !_isPasswordVisible,
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Please enter your password';
                                  }
                                  if (value.length < 4) {
                                    return 'Password is too short';
                                  }
                                  return null;
                                },
                                headerAction: GestureDetector(
                                  onTap: () {
                                    PinesphereToast.show(
                                      context,
                                      title: 'Info',
                                      message:
                                          'Contact your administrator to reset your password.',
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

                              // Remember Me
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
                                        borderRadius: BorderRadius.all(
                                          Radius.circular(4),
                                        ),
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

                              // Sign In button
                              SizedBox(
                                width: double.infinity,
                                height: 48,
                                child: ElevatedButton(
                                  onPressed: authState.isLoading
                                      ? null
                                      : _handleLogin,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppColors.primaryBlue,
                                    foregroundColor: Colors.white,
                                    disabledBackgroundColor: AppColors
                                        .primaryBlue
                                        .withValues(alpha: 0.6),
                                    elevation: 0,
                                    shadowColor: AppColors.primaryBlue
                                        .withValues(alpha: 0.32),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 0,
                                    ),
                                  ),
                                  child: authState.isLoading
                                      ? const SizedBox(
                                          width: 20,
                                          height: 20,
                                          child: CircularProgressIndicator(
                                            color: Colors.white,
                                            strokeWidth: 2,
                                          ),
                                        )
                                      : const Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
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
                              if (kDebugMode) ...[
                                const SizedBox(height: 18),
                                _DevelopmentLoginSection(
                                  isLoading: authState.isLoading,
                                  onSelect: _handleDevelopmentLogin,
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 48),

                      // Footer
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
        style: TextStyle(fontSize: 12, color: AppColors.slate300),
      ),
    );
  }
}

class _DevelopmentLoginSection extends StatelessWidget {
  final bool isLoading;
  final ValueChanged<DevelopmentDemoUser> onSelect;

  const _DevelopmentLoginSection({
    required this.isLoading,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 240),
      curve: Curves.easeOutCubic,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.warningLight,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.warning.withValues(alpha: 0.22)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              const StatusChip(
                label: 'Development Mode',
                color: AppColors.warningDark,
                icon: Icons.bug_report_outlined,
              ),
              const Spacer(),
              Text(
                'DEBUG ONLY',
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: AppColors.warningDark,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            'Use pre-filled mock users for local testing. This panel is compiled out of release builds.',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: AppColors.slate700,
              height: 1.35,
            ),
          ),
          const SizedBox(height: 12),
          for (final demoUser in developmentDemoUsers) ...[
            PressableScale(
              onTap: isLoading ? null : () => onSelect(demoUser),
              borderRadius: BorderRadius.circular(16),
              child: Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.86),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: AppColors.warning.withValues(alpha: 0.18),
                  ),
                ),
                child: Row(
                  children: [
                    Hero(
                      tag: 'dev-login-${demoUser.user.userId}',
                      child: Container(
                        width: 36,
                        height: 36,
                        decoration: const BoxDecoration(
                          gradient: AppColors.brandGradient,
                          shape: BoxShape.circle,
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          demoUser.user.displayName.isNotEmpty
                              ? demoUser.user.displayName.substring(0, 1)
                              : 'D',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            demoUser.label,
                            style: const TextStyle(
                              color: AppColors.slate900,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          Text(
                            '${demoUser.user.role} → ${demoUser.destination}',
                            style: const TextStyle(
                              color: AppColors.slate500,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Icon(
                      Icons.arrow_forward_rounded,
                      color: AppColors.primaryBlue,
                      size: 18,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
