import 'package:flutter/material.dart';

class PortalTheme {
  static Color backgroundSlate(BuildContext context) => Theme.of(context).scaffoldBackgroundColor;
  static Color primaryBlue(BuildContext context) => Theme.of(context).colorScheme.primary;
  static Color accentBlue(BuildContext context) => Theme.of(context).colorScheme.secondary;
  static Color cardSurface(BuildContext context) => Theme.of(context).cardColor;
  static Color successGreen(BuildContext context) => const Color(0xFF22C55E); // Standard success color matching AppColors.success
  static Color warningAmber(BuildContext context) => const Color(0xFFD97706); // Standard warning color matching AppColors.warningDark
  static Color errorRed(BuildContext context) => Theme.of(context).colorScheme.error;

  // Derive all normal body and label colors directly from the active theme
  static Color textColor(BuildContext context) => Theme.of(context).textTheme.bodyLarge?.color ?? Theme.of(context).colorScheme.onSurface;
  static Color textSecondary(BuildContext context) => Theme.of(context).textTheme.bodyMedium?.color ?? Theme.of(context).colorScheme.onSurfaceVariant;
  static Color textMuted(BuildContext context) => Theme.of(context).textTheme.bodySmall?.color ?? Theme.of(context).colorScheme.outline;
  static Color textTertiary(BuildContext context) => Theme.of(context).textTheme.bodySmall?.color ?? Theme.of(context).colorScheme.outline;
  
  static Color border(BuildContext context) => Theme.of(context).colorScheme.outline;
  static Color borderLight(BuildContext context) => Theme.of(context).colorScheme.outline.withOpacity(0.12);
  static Color divider(BuildContext context) => Theme.of(context).dividerColor;
}
