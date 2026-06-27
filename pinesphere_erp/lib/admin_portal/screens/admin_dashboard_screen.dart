import 'package:pinesphere_erp/shared/services/admin_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/features/auth/providers/auth_provider.dart';
import 'package:pinesphere_erp/hr_portal/services/hr_api_service.dart';

/// Admin Dashboard — mirrors the SuperAdminDashboard component from frontend.
/// Shows real counts from the backend and a greeting with the authenticated user name.
class AdminDashboardScreen extends ConsumerWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentUser = ref.watch(currentUserProvider);
    final statsAsync = ref.watch(hrDashboardStatsProvider);

    final greeting = _greeting();
    final displayName = currentUser?.displayName ?? 'Admin';

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Builder(
          builder: (ctx) => IconButton(
            icon: const Icon(Icons.menu_rounded,
                color: AppColors.slate800),
            onPressed: () => ref.read(adminScaffoldKeyProvider).currentState?.openDrawer(),
          ),
        ),
        title: const Text(
          'Admin Console',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 17,
            color: AppColors.slate800,
          ),
        ),
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined,
                color: AppColors.slate500),
            onPressed: () {},
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.refresh(hrStudentsProvider);
          ref.refresh(hrProgramsProvider);
        },
        color: AppColors.primaryBlue,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Welcome banner ──────────────────────────────────────
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppColors.primaryBlue, Color(0xFF6366F1)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color:
                          AppColors.primaryBlue.withValues(alpha: 0.3),
                      blurRadius: 16,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '$greeting,',
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.85),
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      displayName,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Full system access — Pinesphere ERP',
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.7),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // ── Stats ───────────────────────────────────────────────
              const Text(
                'Platform Overview',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: AppColors.slate800,
                ),
              ),
              const SizedBox(height: 14),

              statsAsync.when(
                loading: () => const Center(
                  child: Padding(
                    padding: EdgeInsets.all(32),
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: AppColors.primaryBlue,
                    ),
                  ),
                ),
                error: (_, __) => _buildStatsGrid(
                    students: 0,
                    programs: 0,
                    active: 0,
                    completed: 0),
                data: (stats) => _buildStatsGrid(
                  students: stats.totalStudents,
                  programs: stats.totalPrograms,
                  active: stats.activeStudents,
                  completed: stats.completedStudents,
                ),
              ),

              const SizedBox(height: 28),

              // ── Quick actions ────────────────────────────────────────
              const Text(
                'Quick Actions',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: AppColors.slate800,
                ),
              ),
              const SizedBox(height: 14),

              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 2.0,
                children: const [
                  _QuickAction(
                    icon: Icons.person_add_rounded,
                    label: 'Add Student',
                    color: AppColors.primaryBlue,
                  ),
                  _QuickAction(
                    icon: Icons.add_business_rounded,
                    label: 'Add Program',
                    color: AppColors.success,
                  ),
                  _QuickAction(
                    icon: Icons.group_add_rounded,
                    label: 'Manage Users',
                    color: Color(0xFF8B5CF6),
                  ),
                  _QuickAction(
                    icon: Icons.shield_outlined,
                    label: 'Manage Roles',
                    color: AppColors.warning,
                  ),
                ],
              ),

              const SizedBox(height: 28),

              // ── Module grid ──────────────────────────────────────────
              const Text(
                'Modules',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: AppColors.slate800,
                ),
              ),
              const SizedBox(height: 14),

              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 3,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 0.9,
                children: const [
                  _ModuleTile(icon: Icons.people_rounded, label: 'Students', color: AppColors.primaryBlue),
                  _ModuleTile(icon: Icons.badge_rounded, label: 'Employees', color: Color(0xFF8B5CF6)),
                  _ModuleTile(icon: Icons.business_rounded, label: 'Org', color: Color(0xFF0891B2)),
                  _ModuleTile(icon: Icons.school_rounded, label: 'Programs', color: AppColors.success),
                  _ModuleTile(icon: Icons.groups_rounded, label: 'Batches', color: AppColors.warning),
                  _ModuleTile(icon: Icons.swap_horiz_rounded, label: 'Alloc', color: Color(0xFFEC4899)),
                  _ModuleTile(icon: Icons.assignment_rounded, label: 'Tasks', color: Color(0xFFF97316)),
                  _ModuleTile(icon: Icons.quiz_rounded, label: 'Assess', color: AppColors.error),
                  _ModuleTile(icon: Icons.check_box_rounded, label: 'Attend', color: Color(0xFF14B8A6)),
                ],
              ),

              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatsGrid({
    required int students,
    required int programs,
    required int active,
    required int completed,
  }) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.4,
      children: [
        _StatCard(
            icon: Icons.people_rounded,
            label: 'Students',
            value: students.toString(),
            color: AppColors.primaryBlue),
        _StatCard(
            icon: Icons.school_rounded,
            label: 'Programs',
            value: programs.toString(),
            color: AppColors.success),
        _StatCard(
            icon: Icons.check_circle_rounded,
            label: 'Active',
            value: active.toString(),
            color: AppColors.warning),
        _StatCard(
            icon: Icons.task_alt_rounded,
            label: 'Completed',
            value: completed.toString(),
            color: Colors.indigoAccent),
      ],
    );
  }

  String _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;
  const _StatCard(
      {required this.icon,
      required this.label,
      required this.value,
      required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.slate100),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 8,
              offset: const Offset(0, 3)),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1), shape: BoxShape.circle),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 8),
          Text(value,
              style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 22,
                  color: AppColors.slate800)),
          const SizedBox(height: 2),
          Text(label,
              style: const TextStyle(
                  color: AppColors.slate400, fontSize: 11, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _QuickAction(
      {required this.icon, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {},
      child: Container(
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withValues(alpha: 0.2)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 18),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.w700,
                  fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}

class _ModuleTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _ModuleTile(
      {required this.icon, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.slate100),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 6,
              offset: const Offset(0, 2))
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: const TextStyle(
                color: Color(0xFF475569), // slate600
                fontSize: 11,
                fontWeight: FontWeight.w600),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}


