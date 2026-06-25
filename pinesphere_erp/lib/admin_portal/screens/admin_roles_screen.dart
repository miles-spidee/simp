import 'package:flutter/material.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';

/// Admin Roles screen — mirrors frontend /admin/roles page.
/// Shows role management with RBAC details.
class AdminRolesScreen extends StatelessWidget {
  const AdminRolesScreen({super.key});

  // Mirror of MOCK_ROLES from frontend mock-roles.ts
  static const _mockRoles = [
    _RoleData(
        name: 'Student',
        code: 'ROLE_STUDENT',
        desc: 'Can access LMS and submit tasks.',
        modules: 5,
        users: 245,
        color: Color(0xFF10B981)),
    _RoleData(
        name: 'Mentor',
        code: 'ROLE_MENTOR',
        desc: 'Can evaluate tasks and mentor students.',
        modules: 6,
        users: 34,
        color: Color(0xFFF59E0B)),
    _RoleData(
        name: 'HR',
        code: 'ROLE_HR',
        desc: 'Can manage employees and track performance.',
        modules: 4,
        users: 12,
        color: Color(0xFFEF4444)),
    _RoleData(
        name: 'College Coordinator',
        code: 'ROLE_CC',
        desc: 'Can track student progress and view reports.',
        modules: 4,
        users: 28,
        color: Color(0xFF8B5CF6)),
    _RoleData(
        name: 'Super Admin',
        code: 'ROLE_ADMIN',
        desc: 'Full system access.',
        modules: 20,
        users: 3,
        color: AppColors.primaryBlue),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Builder(
          builder: (ctx) => IconButton(
            icon: const Icon(Icons.menu_rounded, color: AppColors.slate800),
            onPressed: () => Scaffold.of(ctx).openDrawer(),
          ),
        ),
        title: const Text(
          'Roles',
          style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 17,
              color: AppColors.slate800),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: TextButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.add_rounded, size: 16),
              label: const Text('Add Role'),
              style: TextButton.styleFrom(
                foregroundColor: AppColors.primaryBlue,
                textStyle: const TextStyle(
                    fontSize: 13, fontWeight: FontWeight.w600),
              ),
            ),
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
        itemCount: _mockRoles.length,
        itemBuilder: (ctx, i) => _RoleCard(role: _mockRoles[i]),
      ),
    );
  }
}

class _RoleData {
  final String name;
  final String code;
  final String desc;
  final int modules;
  final int users;
  final Color color;
  const _RoleData({
    required this.name,
    required this.code,
    required this.desc,
    required this.modules,
    required this.users,
    required this.color,
  });
}

class _RoleCard extends StatelessWidget {
  final _RoleData role;
  const _RoleCard({required this.role});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.slate100),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 8,
              offset: const Offset(0, 3)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: role.color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  role.name,
                  style: TextStyle(
                    color: role.color,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
              ),
              const Spacer(),
              Text(
                role.code,
                style: const TextStyle(
                    color: AppColors.slate400,
                    fontSize: 11,
                    fontFamily: 'monospace'),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            role.desc,
            style: const TextStyle(
                color: AppColors.slate500, fontSize: 13),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _RoleStat(
                icon: Icons.view_module_rounded,
                label: '${role.modules} Modules',
                color: AppColors.primaryBlue,
              ),
              const SizedBox(width: 16),
              _RoleStat(
                icon: Icons.people_rounded,
                label: '${role.users} Users',
                color: AppColors.success,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _RoleStat extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _RoleStat(
      {required this.icon, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 14, color: color),
        const SizedBox(width: 4),
        Text(
          label,
          style: TextStyle(
              color: color, fontSize: 12, fontWeight: FontWeight.w600),
        ),
      ],
    );
  }
}
