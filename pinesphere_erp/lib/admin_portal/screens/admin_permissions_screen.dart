import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/widgets/error_state_widget.dart';
import 'package:pinesphere_erp/shared/services/admin_service.dart';

class AdminPermissionsScreen extends ConsumerStatefulWidget {
  const AdminPermissionsScreen({super.key});

  @override
  ConsumerState<AdminPermissionsScreen> createState() =>
      _AdminPermissionsScreenState();
}

class _AdminPermissionsScreenState extends ConsumerState<AdminPermissionsScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchTerm = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  // hardcoded permission assignment mapping for the matrix visualization matching mock-super-admin.ts
  final Map<String, List<String>> _roleMappings = {
    'identity.view': ['Super Admin', 'Mentor', 'HR'],
    'identity.manage_users': ['Super Admin'],
    'identity.manage_roles': ['Super Admin'],
    'employee.view': ['Super Admin', 'HR'],
    'employee.create': ['Super Admin', 'HR'],
    'employee.edit': ['Super Admin', 'HR'],
    'organization.view': ['Super Admin', 'HR'],
    'organization.create': ['Super Admin'],
    'program.view': ['Super Admin', 'HR', 'Mentor', 'Student'],
    'program.create': ['Super Admin', 'HR'],
    'mentor.view': ['Super Admin', 'HR'],
    'mentor.assign': ['Super Admin', 'HR'],
    'task.view': ['Super Admin', 'Mentor', 'Student'],
    'task.submit': ['Super Admin', 'Student'],
  };

  @override
  Widget build(BuildContext context) {
    final permissionsAsync = ref.watch(adminPermissionsProvider);

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
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Permissions Matrix',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: AppColors.slate800,
              ),
            ),
            Text(
              'Access controls across all modules',
              style: TextStyle(
                color: Color(0xFF64748B),
                fontSize: 11,
              ),
            ),
          ],
        ),
        shape: const Border(
          bottom: BorderSide(color: Color(0xFFE2E8F0), width: 1),
        ),
      ),
      body: Column(
        children: [
          // ── Search matrix ──────────────────────────────────────────────────
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: TextField(
              controller: _searchController,
              onChanged: (val) {
                setState(() {
                  _searchTerm = val;
                });
              },
              decoration: InputDecoration(
                hintText: 'Search permissions, modules...',
                hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                prefixIcon: const Icon(Icons.search, color: Color(0xFF94A3B8), size: 18),
                contentPadding: const EdgeInsets.symmetric(vertical: 8),
                fillColor: const Color(0xFFF1F5F9),
                filled: true,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
          const Divider(height: 1, color: Color(0xFFE2E8F0)),

          // ── Permissions List ───────────────────────────────────────────────
          Expanded(
            child: permissionsAsync.when(
              loading: () => const Center(
                child: CircularProgressIndicator(color: AppColors.primaryBlue),
              ),
              error: (err, stack) => ErrorStateWidget(
                title: 'Unable to fetch permissions',
                error: err,
                onRetry: () => ref.invalidate(adminPermissionsProvider),
              ),
              data: (permissions) {
                final filtered = permissions.where((p) {
                  final q = _searchTerm.toLowerCase();
                  return p.label.toLowerCase().contains(q) ||
                      p.module.toLowerCase().contains(q) ||
                      p.id.toLowerCase().contains(q);
                }).toList();

                if (filtered.isEmpty) {
                  return const Center(
                    child: Text(
                      'No permissions found.',
                      style: TextStyle(color: Color(0xFF64748B)),
                    ),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final perm = filtered[index];
                    final mappedRoles = _roleMappings[perm.id] ?? ['Super Admin'];

                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: const BorderSide(color: Color(0xFFE2E8F0)),
                      ),
                      elevation: 0,
                      color: Colors.white,
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    const Icon(Icons.vpn_key_rounded,
                                        size: 16, color: AppColors.primaryBlue),
                                    const SizedBox(width: 8),
                                    Text(
                                      perm.label,
                                      style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF0F172A),
                                      ),
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF1F5F9),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    perm.module,
                                    style: const TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xFF475569),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              perm.id,
                              style: const TextStyle(
                                fontSize: 11,
                                color: Color(0xFF64748B),
                                fontFamily: 'monospace',
                              ),
                            ),
                            const Divider(height: 24, color: Color(0xFFF1F5F9)),
                            const Text(
                              'ASSIGNED ROLES',
                              style: TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF94A3B8),
                                letterSpacing: 0.8,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Wrap(
                              spacing: 6,
                              runSpacing: 6,
                              children: [
                                'Super Admin',
                                'Mentor',
                                'HR',
                                'Student',
                                'College Coordinator'
                              ].map((role) {
                                final isAssigned = mappedRoles.contains(role);
                                return Opacity(
                                  opacity: isAssigned ? 1.0 : 0.4,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: isAssigned
                                          ? AppColors.primaryBlue.withValues(alpha: 0.08)
                                          : const Color(0xFFF1F5F9),
                                      borderRadius: BorderRadius.circular(6),
                                      border: Border.all(
                                        color: isAssigned
                                            ? AppColors.primaryBlue.withValues(alpha: 0.2)
                                            : const Color(0xFFE2E8F0),
                                      ),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Icon(
                                          isAssigned
                                              ? Icons.check_circle_rounded
                                              : Icons.radio_button_unchecked_rounded,
                                          size: 12,
                                          color: isAssigned
                                              ? AppColors.primaryBlue
                                              : const Color(0xFF94A3B8),
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          role,
                                          style: TextStyle(
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                            color: isAssigned
                                                ? AppColors.primaryBlue
                                                : const Color(0xFF64748B),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              }).toList(),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
