import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:pinesphere_erp/core/routes/app_routes.dart';
import 'package:pinesphere_erp/core/theme/app_spacing.dart';
import 'package:pinesphere_erp/core/widgets/app_card.dart';
import 'package:pinesphere_erp/core/widgets/app_scaffold.dart';

class MoreScreen extends StatelessWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      appBar: AppBar(
        title: const Text('More'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.s16),
        children: [
          AppCard(
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.school_outlined),
                  title: const Text('Student Portal'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    context.push('/student');
                  },
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.workspace_premium_outlined),
                  title: const Text('Certificates'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    context.push('/dashboard/certificates');
                  },
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.assessment_outlined),
                  title: const Text('Assessments'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    context.push('/dashboard/assessments');
                  },
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.business_center_outlined),
                  title: const Text('Placements'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    context.push('/dashboard/placement');
                  },
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.notifications_outlined),
                  title: const Text('Notifications'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    context.push('/dashboard/notifications');
                  },
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.settings_outlined),
                  title: const Text('Settings'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    context.push('/dashboard/settings');
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
