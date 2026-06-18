import 'package:flutter/material.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/theme/app_spacing.dart';
enum PlacementStatus {
  placed,
  offer,
  inProcess,
}
class TrackingCard extends StatelessWidget {
  final String studentName;
  final String department;
  final String company;
  final String role;
  final String package;
  final PlacementStatus status;
  const TrackingCard({
    super.key,
    required this.studentName,
    required this.department,
    required this.company,
    required this.role,
    required this.package,
    required this.status,
  });
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.s16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 6,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Student info row
          Row(
            children: [
              // Student avatar
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Center(
                  child: Text(
                    _getInitials(studentName),
                    style: Theme.of(context).textTheme.labelMedium?.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.s12),
              // Name & department
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      studentName,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      department,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.textTertiary,
                            fontSize: 12,
                          ),
                    ),
                  ],
                ),
              ),
              // Status badge
              _buildStatusBadge(context),
            ],
          ),
          const SizedBox(height: AppSpacing.s12),
          // Divider
          Container(
            height: 1,
            color: AppColors.borderLight.withOpacity(0.6),
          ),
          const SizedBox(height: AppSpacing.s12),
          // Details row
          Row(
            children: [
              _buildDetailItem(
                context,
                Icons.business_outlined,
                'Company',
                company,
              ),
              const SizedBox(width: AppSpacing.s16),
              _buildDetailItem(
                context,
                Icons.work_outline,
                'Role',
                role,
              ),
              const SizedBox(width: AppSpacing.s16),
              _buildDetailItem(
                context,
                Icons.currency_rupee,
                'Package',
                package,
              ),
            ],
          ),
        ],
      ),
    );
  }
  Widget _buildStatusBadge(BuildContext context) {
    Color bgColor;
    Color textColor;
    String label;
    IconData? icon;
    switch (status) {
      case PlacementStatus.placed:
        bgColor = AppColors.successLight;
        textColor = AppColors.successDark;
        label = 'PLACED';
        icon = Icons.check_circle;
        break;
      case PlacementStatus.offer:
        bgColor = AppColors.warningLight;
        textColor = AppColors.warning;
        label = 'OFFER';
        icon = null;
        break;
      case PlacementStatus.inProcess:
        bgColor = AppColors.primary.withOpacity(0.1);
        textColor = AppColors.primary;
        label = 'IN PROCESS';
        icon = null;
        break;
    }
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.s8,
        vertical: AppSpacing.s4,
      ),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 12, color: textColor),
            const SizedBox(width: 3),
          ],
          Text(
            label,
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: textColor,
                  fontWeight: FontWeight.w700,
                  fontSize: 10,
                  letterSpacing: 0.5,
                ),
          ),
        ],
      ),
    );
  }
  Widget _buildDetailItem(
    BuildContext context,
    IconData icon,
    String label,
    String value,
  ) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 12, color: AppColors.textTertiary),
              const SizedBox(width: 3),
              Text(
                label,
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      fontSize: 10,
                      color: AppColors.textTertiary,
                      fontWeight: FontWeight.w500,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 3),
          Text(
            value,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                  fontSize: 12,
                ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
  String _getInitials(String name) {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }
}
