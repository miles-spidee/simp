import 'package:flutter/material.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/theme/app_spacing.dart';
class FunnelStep {
  final String label;
  final int count;
  final String? percentage;
  const FunnelStep({
    required this.label,
    required this.count,
    this.percentage,
  });
}
class FunnelBar extends StatelessWidget {
  final List<FunnelStep> steps;
  const FunnelBar({super.key, required this.steps});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.s16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.filter_alt_outlined,
                  size: 18, color: AppColors.textTertiary),
              const SizedBox(width: AppSpacing.s8),
              Text(
                'PLACEMENT FUNNEL',
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textTertiary,
                      letterSpacing: 0.8,
                    ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.s20),
          // Funnel progress bar
          _buildFunnelProgressBar(context),
          const SizedBox(height: AppSpacing.s20),
          // Step details
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: List.generate(steps.length, (index) {
                return Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _buildStepItem(context, steps[index]),
                    if (index < steps.length - 1)
                      Padding(
                        padding:
                            const EdgeInsets.symmetric(horizontal: AppSpacing.s4),
                        child: Icon(
                          Icons.chevron_right,
                          size: 16,
                          color: AppColors.borderLight,
                        ),
                      ),
                  ],
                );
              }),
            ),
          ),
        ],
      ),
    );
  }
  Widget _buildFunnelProgressBar(BuildContext context) {
    if (steps.isEmpty) return const SizedBox.shrink();
    final maxCount = steps.first.count.toDouble();
    return ClipRRect(
      borderRadius: BorderRadius.circular(6),
      child: SizedBox(
        height: 10,
        child: Row(
          children: List.generate(steps.length, (index) {
            final fraction = maxCount > 0
                ? (steps[index].count / maxCount)
                : (1 / steps.length);
            final colors = [
              AppColors.primary,
              const Color(0xFF3B82F6),
              const Color(0xFF60A5FA),
              const Color(0xFF93C5FD),
              AppColors.success,
            ];
            return Expanded(
              flex: (fraction * 100).round().clamp(1, 100),
              child: Container(
                color: colors[index % colors.length],
              ),
            );
          }),
        ),
      ),
    );
  }
  Widget _buildStepItem(BuildContext context, FunnelStep step) {
    return SizedBox(
      width: 62,
      child: Column(
        children: [
          Text(
            '${step.count}',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                  fontSize: 18,
                ),
          ),
          const SizedBox(height: 2),
          Text(
            step.label.toUpperCase(),
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  fontSize: 9,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textTertiary,
                  letterSpacing: 0.5,
                ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          if (step.percentage != null) ...[
            const SizedBox(height: 2),
            Text(
              step.percentage!,
              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
            ),
          ],
        ],
      ),
    );
  }
}
