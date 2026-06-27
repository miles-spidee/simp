import 'package:flutter/material.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/widgets/premium_components.dart';

class AppCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double? width;
  final double? height;
  final VoidCallback? onTap;
  final Color? color;
  final List<BoxShadow>? boxShadow;

  const AppCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.margin,
    this.width,
    this.height,
    this.onTap,
    this.color,
    this.boxShadow,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final card = Container(
      margin: margin,
      width: width,
      height: height,
      padding: padding,
      decoration: BoxDecoration(
        color: color ?? (isDark ? AppColors.surfaceDarkElevated : Colors.white),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: (isDark ? AppColors.borderDark : AppColors.border).withValues(
            alpha: 0.76,
          ),
        ),
        boxShadow:
            boxShadow ??
            [
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.24 : 0.055),
                blurRadius: 30,
                offset: const Offset(0, 16),
              ),
            ],
      ),
      child: child,
    );

    return onTap != null
        ? PressableScale(
            onTap: onTap,
            borderRadius: BorderRadius.circular(22),
            child: card,
          )
        : card;
  }
}
