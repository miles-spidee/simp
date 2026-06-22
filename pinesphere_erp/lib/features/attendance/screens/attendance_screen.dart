import 'package:flutter/material.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/theme/app_spacing.dart';
import 'package:pinesphere_erp/core/widgets/app_card.dart';
import 'package:pinesphere_erp/core/widgets/app_scaffold.dart';

class AttendanceScreen extends StatelessWidget {
  const AttendanceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      appBar: AppBar(
        title: const Text('Attendance'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.s16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AppCard(
              child: Column(
                children: [
                  Text(
                    'This Week',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: AppSpacing.s24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _AttendanceDay(
                        day: 'Mon',
                        status: 'Present',
                        color: AppColors.success,
                      ),
                      _AttendanceDay(
                        day: 'Tue',
                        status: 'Present',
                        color: AppColors.success,
                      ),
                      _AttendanceDay(
                        day: 'Wed',
                        status: 'Present',
                        color: AppColors.success,
                      ),
                      _AttendanceDay(
                        day: 'Thu',
                        status: 'Late',
                        color: AppColors.warning,
                      ),
                      _AttendanceDay(
                        day: 'Fri',
                        status: 'Absent',
                        color: AppColors.error,
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.s16),
            Text(
              'Attendance History',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: AppSpacing.s16),
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: 10,
              separatorBuilder: (context, index) =>
                  const SizedBox(height: AppSpacing.s12),
              itemBuilder: (context, index) {
                final date = DateTime.now().subtract(Duration(days: index));
                return AppCard(
                  padding: const EdgeInsets.all(AppSpacing.s12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${date.day}/${date.month}/${date.year}',
                            style: Theme.of(context).textTheme.titleSmall,
                          ),
                          const SizedBox(height: AppSpacing.s4),
                          Text(
                            index % 3 == 0 ? '09:00 AM - 06:00 PM' : '09:15 AM - 06:00 PM',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.s12,
                          vertical: AppSpacing.s4,
                        ),
                        decoration: BoxDecoration(
                          color: index % 3 == 0
                              ? AppColors.successLight
                              : index % 3 == 1
                                  ? AppColors.warningLight
                                  : AppColors.errorLight,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          index % 3 == 0
                              ? 'Present'
                              : index % 3 == 1
                                  ? 'Late'
                                  : 'Absent',
                          style: TextStyle(
                            color: index % 3 == 0
                                ? AppColors.successDark
                                : index % 3 == 1
                                    ? AppColors.warningDark
                                    : AppColors.errorDark,
                            fontWeight: FontWeight.w500,
                          ),
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

class _AttendanceDay extends StatelessWidget {
  final String day;
  final String status;
  final Color color;

  const _AttendanceDay({
    required this.day,
    required this.status,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          day,
          style: Theme.of(context).textTheme.titleSmall,
        ),
        const SizedBox(height: AppSpacing.s8),
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.2),
            shape: BoxShape.circle,
            border: Border.all(color: color, width: 2),
          ),
          child: Icon(
            Icons.check,
            color: color,
          ),
        ),
        const SizedBox(height: AppSpacing.s8),
        Text(
          status,
          style: TextStyle(
            fontSize: 12,
            color: color,
          ),
        ),
      ],
    );
  }
}
