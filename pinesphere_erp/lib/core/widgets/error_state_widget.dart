import 'package:flutter/material.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/theme/app_spacing.dart';

class ErrorStateWidget extends StatelessWidget {
  final String? title;
  final dynamic error;
  final VoidCallback? onRetry;
  final IconData? icon;

  const ErrorStateWidget({
    super.key,
    this.title,
    required this.error,
    this.onRetry,
    this.icon,
  });

  String _getFriendlyMessage(dynamic err) {
    final str = err.toString();
    if (str.contains('500') || str.contains('bad response') || str.contains('internal server error')) {
      return 'Server encountered an error. Please try again later.';
    }
    if (str.contains('403') || str.contains('401') || str.contains('permission') || str.contains('denied')) {
      return 'Access denied. You do not have permission to view this resource.';
    }
    if (str.contains('404') || str.contains('not found')) {
      return 'The requested resource was not found.';
    }
    if (str.contains('SocketException') || str.contains('Network') || str.contains('connection') || str.contains('Failed host lookup')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }
    if (str.contains('timeout')) {
      return 'Connection timed out. Please try again.';
    }
    return 'Something went wrong. Please check your connection and try again.';
  }

  @override
  Widget build(BuildContext context) {
    final friendlyMessage = _getFriendlyMessage(error);

    return Center(
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(AppSpacing.s32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.error.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon ?? Icons.error_outline_rounded,
                size: 64,
                color: AppColors.error,
              ),
            ),
            const SizedBox(height: AppSpacing.s24),
            Text(
              title ?? 'Failed to load details',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
                color: AppColors.slate800,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.s8),
            Text(
              friendlyMessage,
              style: const TextStyle(
                color: Color(0xFF64748B),
                fontSize: 13,
                height: 1.4,
              ),
              textAlign: TextAlign.center,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: AppSpacing.s24),
              SizedBox(
                width: 140,
                height: 40,
                child: ElevatedButton.icon(
                  onPressed: onRetry,
                  icon: const Icon(Icons.refresh_rounded, size: 16),
                  label: const Text('Retry'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryBlue,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
