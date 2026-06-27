import 'package:pinesphere_erp/shared/services/admin_service.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';

/// Admin Users screen — mirrors frontend /admin/users page.
/// Shows user management interface. Backend /users endpoint integration
/// follows the same pattern as students.
class AdminUsersScreen extends ConsumerWidget {
  const AdminUsersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Builder(
          builder: (ctx) => IconButton(
            icon: const Icon(Icons.menu_rounded, color: AppColors.slate800),
            onPressed: () => ref.read(adminScaffoldKeyProvider).currentState?.openDrawer(),
          ),
        ),
        title: const Text(
          'User Management',
          style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 17,
              color: AppColors.slate800),
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF8B5CF6).withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.manage_accounts_rounded,
                size: 48,
                color: Color(0xFF8B5CF6),
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'User Management',
              style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  color: AppColors.slate800),
            ),
            const SizedBox(height: 8),
            const Text(
              'Manage platform users, assign roles,\nand control access permissions.',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppColors.slate400, fontSize: 13),
            ),
          ],
        ),
      ),
    );
  }
}
