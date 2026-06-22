import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:pinesphere_erp/core/routes/app_routes.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/theme/app_spacing.dart';
import 'package:pinesphere_erp/core/widgets/app_card.dart';
import 'package:pinesphere_erp/core/widgets/app_scaffold.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              context.push(AppRoutes.notifications);
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.s16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Good Morning, Intern!',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: AppSpacing.s24),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              mainAxisSpacing: AppSpacing.s16,
              crossAxisSpacing: AppSpacing.s16,
              children: [
                AppCard(
                  onTap: () {
                    context.push(AppRoutes.attendance);
                  },
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.check_circle,
                        size: 48,
                        color: AppColors.success,
                      ),
                      const SizedBox(height: AppSpacing.s12),
                      Text(
                        'Attendance',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: AppSpacing.s4),
                      Text(
                        '95%',
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                    ],
                  ),
                ),
                AppCard(
                  onTap: () {
                    context.push(AppRoutes.tasks);
                  },
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.list_alt,
                        size: 48,
                        color: AppColors.primary,
                      ),
                      const SizedBox(height: AppSpacing.s12),
                      Text(
                        'Tasks',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: AppSpacing.s4),
                      Text(
                        '5',
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                    ],
                  ),
                ),
                AppCard(
                  onTap: () {
                    context.push(AppRoutes.assessments);
                  },
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.assessment,
                        size: 48,
                        color: AppColors.primaryDark,
                      ),
                      const SizedBox(height: AppSpacing.s12),
                      Text(
                        'Assessments',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: AppSpacing.s4),
                      Text(
                        '2',
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                    ],
                  ),
                ),
                AppCard(
                  onTap: () {
                    context.push(AppRoutes.certificates);
                  },
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.workspace_premium,
                        size: 48,
                        color: AppColors.warning,
                      ),
                      const SizedBox(height: AppSpacing.s12),
                      Text(
                        'Certificates',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: AppSpacing.s4),
                      Text(
                        '3',
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.s24),
            Text(
              'Recent Activity',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: AppSpacing.s16),
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: 5,
              separatorBuilder: (context, index) =>
                  const SizedBox(height: AppSpacing.s12),
              itemBuilder: (context, index) {
                return AppCard(
                  padding: const EdgeInsets.all(AppSpacing.s12),
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: AppColors.primary.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.event,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(width: AppSpacing.s12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Completed Task ${index + 1}',
                              style: Theme.of(context).textTheme.titleSmall,
                            ),
                            const SizedBox(height: AppSpacing.s4),
                            Text(
                              'Today, ${(index + 1) * 2} hours ago',
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
          ],
        ),
      ),
    );
  }
}
