import 'package:flutter/material.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/theme/app_spacing.dart';
import 'package:pinesphere_erp/core/widgets/app_card.dart';
import 'package:pinesphere_erp/core/widgets/app_scaffold.dart';

class TasksScreen extends StatelessWidget {
  const TasksScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      appBar: AppBar(
        title: const Text('Tasks'),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(AppSpacing.s16),
        itemCount: 10,
        separatorBuilder: (context, index) => const SizedBox(height: AppSpacing.s12),
        itemBuilder: (context, index) {
          return AppCard(
            padding: const EdgeInsets.all(AppSpacing.s16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 4,
                      height: 40,
                      decoration: BoxDecoration(
                        color: index % 3 == 0
                            ? AppColors.primary
                            : index % 3 == 1
                                ? AppColors.success
                                : AppColors.warning,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.s12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Task ${index + 1}: ${index % 3 == 0 ? 'Complete the project' : index % 3 == 1 ? 'Review the code' : 'Write documentation'}',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: AppSpacing.s4),
                          Text(
                            'Due: ${DateTime.now().add(Duration(days: index + 1)).day}/${DateTime.now().month}/${DateTime.now().year}',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                    Checkbox(
                      value: index < 3,
                      onChanged: (value) {},
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.s12),
                Text(
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
