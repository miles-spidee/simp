import 'package:flutter/material.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/theme/app_spacing.dart';
class RecruiterTile extends StatelessWidget {
  final String companyName;
  final String abbreviation;
  final int hireCount;
  final Color? avatarColor;
  const RecruiterTile({
    super.key,
    required this.companyName,
    required this.abbreviation,
    required this.hireCount,
    this.avatarColor,
  });
  @override
  Widget build(BuildContext context) {
    final color = avatarColor ?? _getColorForCompany(companyName);
    return Padding(
      padding: const EdgeInsets.symmetric(
        vertical: AppSpacing.s8,
        horizontal: AppSpacing.s4,
      ),
      child: Row(
        children: [
          // Company abbreviation avatar
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Center(
              child: Text(
                abbreviation,
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: color,
                      fontWeight: FontWeight.w700,
                      fontSize: 11,
                    ),
              ),
            ),
          ),
          const SizedBox(width: AppSpacing.s12),
          // Company name
          Expanded(
            child: Text(
              companyName,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
            ),
          ),
          // Hire count badge
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.s12,
              vertical: AppSpacing.s4,
            ),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.08),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              '$hireCount hires',
              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                    fontSize: 11,
                  ),
            ),
          ),
        ],
      ),
    );
  }
  Color _getColorForCompany(String name) {
    final colors = [
      const Color(0xFF2563EB), // Blue
      const Color(0xFF059669), // Green
      const Color(0xFFDC2626), // Red
      const Color(0xFFD97706), // Amber
      const Color(0xFF7C3AED), // Purple
      const Color(0xFF0891B2), // Cyan
    ];
    return colors[name.hashCode.abs() % colors.length];
  }
}
