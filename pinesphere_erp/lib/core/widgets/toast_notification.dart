import 'dart:async';
import 'package:flutter/material.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';

enum ToastType { success, error, warning, info }

class PinesphereToast extends StatefulWidget {
  final String title;
  final String message;
  final ToastType type;
  final VoidCallback onClose;

  const PinesphereToast({
    super.key,
    required this.title,
    required this.message,
    this.type = ToastType.error,
    required this.onClose,
  });

  static OverlayEntry? _currentOverlayEntry;
  static Timer? _autoCloseTimer;
  static AnimationController? _animationController;

  static void show(
    BuildContext context, {
    required String title,
    required String message,
    ToastType type = ToastType.error,
  }) {
    // Dismiss any existing toast
    dismiss();

    final overlayState = Overlay.of(context);
    final entry = OverlayEntry(
      builder: (context) => Positioned(
        bottom: 32,
        left: 16,
        right: 16,
        child: SafeArea(
          child: Material(
            color: Colors.transparent,
            child: PinesphereToast(
              title: title,
              message: message,
              type: type,
              onClose: () => dismiss(),
            ),
          ),
        ),
      ),
    );

    _currentOverlayEntry = entry;
    overlayState.insert(entry);

    _autoCloseTimer = Timer(const Duration(seconds: 4), () {
      dismiss();
    });
  }

  static void dismiss() {
    _autoCloseTimer?.cancel();
    _autoCloseTimer = null;
    if (_animationController != null && _currentOverlayEntry != null) {
      _animationController!.reverse().then((_) {
        _currentOverlayEntry?.remove();
        _currentOverlayEntry = null;
        _animationController = null;
      });
    } else {
      _currentOverlayEntry?.remove();
      _currentOverlayEntry = null;
      _animationController = null;
    }
  }

  @override
  State<PinesphereToast> createState() => _PinesphereToastState();
}

class _PinesphereToastState extends State<PinesphereToast> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    PinesphereToast._animationController = _animationController;

    _fadeAnimation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeIn,
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.4),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeOutQuad,
    ));

    _animationController.forward();
  }

  @override
  void dispose() {
    if (PinesphereToast._animationController == _animationController) {
      PinesphereToast._animationController = null;
    }
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isSuccess = widget.type == ToastType.success;
    final isWarning = widget.type == ToastType.warning;
    final isInfo = widget.type == ToastType.info;

    final stripeColor = isSuccess
        ? AppColors.emerald500
        : isWarning
            ? AppColors.amber500
            : isInfo
                ? AppColors.primaryBlue
                : AppColors.red500;

    final iconColor = stripeColor;

    IconData iconData;
    if (isSuccess) {
      iconData = Icons.check_circle_outline;
    } else if (isWarning) {
      iconData = Icons.warning_amber_rounded;
    } else if (isInfo) {
      iconData = Icons.info_outline;
    } else {
      iconData = Icons.error_outline_outlined;
    }

    return FadeTransition(
      opacity: _fadeAnimation,
      child: SlideTransition(
        position: _slideAnimation,
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.slate100),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.08),
                blurRadius: 16,
                offset: const Offset(0, 8),
              ),
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Left stripe
                  Container(
                    width: 6,
                    color: stripeColor,
                  ),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(
                            iconData,
                            color: iconColor,
                            size: 24,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  widget.title,
                                  style: const TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.slate900,
                                  ),
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  widget.message,
                                  style: const TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 12,
                                    color: AppColors.slate500,
                                    height: 1.35,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          GestureDetector(
                            onTap: () {
                              _animationController.reverse().then((_) {
                                widget.onClose();
                              });
                            },
                            child: const Icon(
                              Icons.close,
                              color: AppColors.slate400,
                              size: 18,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
