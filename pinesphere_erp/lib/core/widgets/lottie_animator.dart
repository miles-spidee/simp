import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';

enum LottieAnimationType {
  loading,
  empty,
  success,
  error,
  offline,
  welcome
}

class LottieAnimator extends StatelessWidget {
  final LottieAnimationType type;
  final double size;
  final bool loop;

  const LottieAnimator({
    super.key,
    required this.type,
    this.size = 180,
    this.loop = true,
  });

  String get _localPath {
    return switch (type) {
      LottieAnimationType.loading => 'assets/animations/loading.json',
      LottieAnimationType.empty => 'assets/animations/empty.json',
      LottieAnimationType.success => 'assets/animations/success.json',
      LottieAnimationType.error => 'assets/animations/error.json',
      LottieAnimationType.offline => 'assets/animations/offline.json',
      LottieAnimationType.welcome => 'assets/animations/welcome.json',
    };
  }

  String get _networkUrl {
    return switch (type) {
      LottieAnimationType.loading => 'https://lottie.host/af8f5f26-7303-4e8f-935d-43692169553a/wKEg1Qd03G.json',
      LottieAnimationType.empty => 'https://assets5.lottiefiles.com/packages/lf20_yzn8t3zp.json',
      LottieAnimationType.success => 'https://assets5.lottiefiles.com/packages/lf20_s2lryxtd.json',
      LottieAnimationType.error => 'https://assets5.lottiefiles.com/packages/lf20_dd9za56x.json',
      LottieAnimationType.offline => 'https://assets5.lottiefiles.com/packages/lf20_o7154xxh.json',
      LottieAnimationType.welcome => 'https://assets5.lottiefiles.com/packages/lf20_zprbspu4.json',
    };
  }

  Widget _buildFallback(BuildContext context) {
    final theme = Theme.of(context);
    return switch (type) {
      LottieAnimationType.loading => SizedBox(
          width: size * 0.4,
          height: size * 0.4,
          child: const CircularProgressIndicator(
            color: AppColors.primaryBlue,
            strokeWidth: 3,
          ),
        ),
      LottieAnimationType.empty => Icon(
          Icons.inbox_outlined,
          size: size * 0.6,
          color: theme.colorScheme.onSurfaceVariant.withValues(alpha: 0.5),
        ),
      LottieAnimationType.success => Icon(
          Icons.check_circle_outline_rounded,
          size: size * 0.6,
          color: const Color(0xFF10B981),
        ),
      LottieAnimationType.error => Icon(
          Icons.error_outline_rounded,
          size: size * 0.6,
          color: AppColors.error,
        ),
      LottieAnimationType.offline => Icon(
          Icons.wifi_off_rounded,
          size: size * 0.6,
          color: AppColors.slate400,
        ),
      LottieAnimationType.welcome => Icon(
          Icons.waving_hand_outlined,
          size: size * 0.6,
          color: AppColors.primaryBlue,
        ),
    };
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SizedBox(
        width: size,
        height: size,
        child: Lottie.asset(
          _localPath,
          repeat: loop,
          fit: BoxFit.contain,
          errorBuilder: (context, error, stackTrace) {
            // Local file is empty skeleton structure, fall back to stable CDN or beautiful native widget
            return Lottie.network(
              _networkUrl,
              repeat: loop,
              fit: BoxFit.contain,
              errorBuilder: (context, error, stackTrace) {
                return _buildFallback(context);
              },
              frameBuilder: (context, child, composition) {
                if (composition != null) return child;
                return _buildFallback(context);
              },
            );
          },
        ),
      ),
    );
  }
}
