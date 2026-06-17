import 'package:flutter/material.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/theme/app_spacing.dart';
import 'package:pinesphere_erp/core/widgets/app_card.dart';
import 'package:pinesphere_erp/core/widgets/app_scaffold.dart';

class AssessmentsScreen extends StatelessWidget {
  const AssessmentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      appBar: AppBar(
        title: const Text('Assessments'),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(AppSpacing.s16),
        itemCount: 5,
        separatorBuilder: (context, index) => const SizedBox(height: AppSpacing.s12),
        itemBuilder: (context, index) {
          return AppCard(
            padding: const EdgeInsets.all(AppSpacing.s16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        'Assessment ${index + 1}: ${index % 2 == 0 ? 'Technical Skills' : 'Soft Skills'}',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.s12,
                        vertical: AppSpacing.s4,
                      ),
                      decoration: BoxDecoration(
                        color: index < 3
                            ? AppColors.successLight
                            : AppColors.warningLight,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        index < 3 ? 'Completed' : 'Upcoming',
                        style: TextStyle(
                          color: index < 3
                              ? AppColors.successDark
                              : AppColors.warningDark,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.s12),
                Text(
                  'Date: ${DateTime.now().subtract(Duration(days: index * 7)).day}/${DateTime.now().month}/${DateTime.now().year}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                if (index < 3) ...[
                  const SizedBox(height: AppSpacing.s8),
                  Row(
                    children: [
                      const Text('Score: '),
                      Text(
                        '${90 - index * 5}/100',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: AppColors.success,
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          );
        },
      ),
    );
  }
}
