import 'package:flutter/material.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/theme/app_spacing.dart';
import 'package:pinesphere_erp/core/widgets/app_card.dart';
import 'package:pinesphere_erp/core/widgets/app_scaffold.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(AppSpacing.s16),
        itemCount: 10,
        separatorBuilder: (context, index) => const SizedBox(height: AppSpacing.s12),
        itemBuilder: (context, index) {
          return AppCard(
            padding: const EdgeInsets.all(AppSpacing.s16),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: index % 3 == 0
                        ? AppColors.primary.withOpacity(0.1)
                        : index % 3 == 1
                            ? AppColors.success.withOpacity(0.1)
                            : AppColors.warning.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    index % 3 == 0
                        ? Icons.notifications
                        : index % 3 == 1
                            ? Icons.check_circle
                            : Icons.warning,
                    color: index % 3 == 0
                        ? AppColors.primary
                        : index % 3 == 1
                            ? AppColors.success
                            : AppColors.warning,
                  ),
                ),
                const SizedBox(width: AppSpacing.s12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Notification ${index + 1}',
                        style: Theme.of(context).textTheme.titleSmall,
                      ),
                      const SizedBox(height: AppSpacing.s4),
                      Text(
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      const SizedBox(height: AppSpacing.s4),
                      Text(
                        '${index + 1} ${index == 0 ? 'hour' : 'hours'} ago',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
