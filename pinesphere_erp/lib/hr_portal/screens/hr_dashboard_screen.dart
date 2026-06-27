import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/features/auth/providers/auth_provider.dart';
import 'package:pinesphere_erp/hr_portal/services/hr_api_service.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';
import 'package:pinesphere_erp/core/utils/premium_animations.dart';

class HRDashboardScreen extends ConsumerWidget {
  const HRDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentUser = ref.watch(currentUserProvider);
    final statsAsync = ref.watch(hrDashboardStatsProvider);
    final studentsAsync = ref.watch(hrStudentsProvider);

    final greeting = _greeting();
    final displayName = currentUser?.displayName ?? 'Admin';

    return Scaffold(
      backgroundColor: PortalTheme.backgroundSlate(context),
      body: CustomScrollView(
        slivers: [
          // ── App Bar ──────────────────────────────────────────────────────
          SliverAppBar(
            expandedHeight: 160,
            floating: false,
            pinned: true,
            backgroundColor: PortalTheme.cardSurface(context),
            elevation: 0,
            flexibleSpace: FlexibleSpaceBar(
              collapseMode: CollapseMode.parallax,
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      PortalTheme.primaryBlue(context),
                      PortalTheme.accentBlue(context),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(24, 16, 24, 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '$greeting,',
                                    style: TextStyle(
                                      color:
                                          Colors.white.withValues(alpha: 0.85),
                                      fontSize: 14,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    displayName,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 22,
                                      fontWeight: FontWeight.bold,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Here is the status of the organization today.',
                                    style: TextStyle(
                                      color:
                                          Colors.white.withValues(alpha: 0.7),
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            // Notification + logout
                            Column(
                              children: [
                                GestureDetector(
                                  onTap: () {},
                                  child: Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color:
                                          Colors.white.withValues(alpha: 0.15),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: const Icon(
                                      Icons.notifications_outlined,
                                      color: Colors.white,
                                      size: 20,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                GestureDetector(
                                  onTap: () async {
                                    await ref
                                        .read(authProvider.notifier)
                                        .logout();
                                    if (context.mounted) {
                                      context.go('/login');
                                    }
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color:
                                          Colors.white.withValues(alpha: 0.15),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: const Icon(
                                      Icons.logout_rounded,
                                      color: Colors.white,
                                      size: 20,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),

          // ── Content ──────────────────────────────────────────────────────
          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Stats grid
                SlideUpFadeTransition(
                  delay: Duration.zero,
                  child: statsAsync.when(
                    loading: () => _buildLoadingStats(),
                    error: (e, _) => _buildStatsGrid(context,
                        students: 0,
                        programs: 0,
                        active: 0,
                        completed: 0),
                    data: (stats) => _buildStatsGrid(context,
                        students: stats.totalStudents,
                        programs: stats.totalPrograms,
                        active: stats.activeStudents,
                        completed: stats.completedStudents),
                  ),
                ),

                const SizedBox(height: 24),

                // Recent students section
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Recent Students',
                      style: TextStyle(
                        color: PortalTheme.textColor(context),
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    TextButton(
                      onPressed: () => context.go('/hr/students'),
                      child: const Text(
                        'View All',
                        style: TextStyle(
                          color: AppColors.primaryBlue,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                SlideUpFadeTransition(
                  delay: const Duration(milliseconds: 150),
                  child: studentsAsync.when(
                    loading: () => _buildStudentListLoader(),
                    error: (e, _) => _buildStudentListError(ref, e),
                    data: (students) {
                      if (students.isEmpty) {
                        return _buildStudentListEmpty();
                      }
                      final recent = students.take(5).toList();
                      return Column(
                        children: recent
                            .map((s) => _buildStudentTile(context, s.displayName,
                                s.studentStatus, s.createdAt))
                            .toList(),
                      );
                    },
                  ),
                ),

                const SizedBox(height: 100),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  String _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  Widget _buildLoadingStats() {
    return Container(
      height: 160,
      alignment: Alignment.center,
      child: const CircularProgressIndicator(
        strokeWidth: 2,
        color: AppColors.primaryBlue,
      ),
    );
  }

  Widget _buildStatsGrid(
    BuildContext context, {
    required int students,
    required int programs,
    required int active,
    required int completed,
  }) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      mainAxisSpacing: 14,
      crossAxisSpacing: 14,
      childAspectRatio: 1.3,
      children: [
        _StatCard(
          icon: Icons.people_rounded,
          label: 'Total Students',
          value: students.toString(),
          color: AppColors.primaryBlue,
        ),
        _StatCard(
          icon: Icons.school_rounded,
          label: 'Programs',
          value: programs.toString(),
          color: AppColors.success,
        ),
        _StatCard(
          icon: Icons.check_circle_rounded,
          label: 'Active',
          value: active.toString(),
          color: AppColors.warning,
        ),
        _StatCard(
          icon: Icons.task_alt_rounded,
          label: 'Completed',
          value: completed.toString(),
          color: Colors.indigoAccent,
        ),
      ],
    );
  }

  Widget _buildStudentListLoader() {
    return Column(
      children: List.generate(
        3,
        (i) => Container(
          margin: const EdgeInsets.only(bottom: 10),
          height: 60,
          decoration: BoxDecoration(
            color: AppColors.slate100,
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }

  Widget _buildStudentListError(WidgetRef ref, dynamic err) {
    final str = err.toString();
    String friendlyMsg = 'Failed to load students';
    if (str.contains('500') || str.contains('bad response') || str.contains('server error')) {
      friendlyMsg = 'Server error fetching students';
    } else if (str.contains('SocketException') || str.contains('Network') || str.contains('connection')) {
      friendlyMsg = 'Network connection issue';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.errorLight,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.error.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          const Icon(Icons.error_outline, color: AppColors.error, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              friendlyMsg,
              style: const TextStyle(
                  color: AppColors.error, fontSize: 13),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: AppColors.error, size: 18),
            onPressed: () => ref.refresh(hrStudentsProvider),
          ),
        ],
      ),
    );
  }

  Widget _buildStudentListEmpty() {
    return Container(
      padding: const EdgeInsets.all(24),
      alignment: Alignment.center,
      child: Column(
        children: [
          Icon(Icons.people_outline, size: 40,
              color: AppColors.slate300),
          const SizedBox(height: 12),
          const Text(
            'No students yet',
            style: TextStyle(color: AppColors.slate400, fontSize: 14),
          ),
        ],
      ),
    );
  }

  Widget _buildStudentTile(
      BuildContext context, String name, String status, String date) {
    Color statusColor;
    switch (status.toLowerCase()) {
      case 'active':
        statusColor = AppColors.success;
        break;
      case 'completed':
        statusColor = AppColors.primaryBlue;
        break;
      default:
        statusColor = AppColors.warning;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: PortalTheme.cardSurface(context),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: PortalTheme.borderLight(context)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppColors.primaryBlue.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            alignment: Alignment.center,
            child: Text(
              name.isNotEmpty ? name[0].toUpperCase() : '?',
              style: const TextStyle(
                color: AppColors.primaryBlue,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: TextStyle(
                    color: PortalTheme.textColor(context),
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  date.isNotEmpty
                      ? 'Joined ${_formatDate(date)}'
                      : 'Recently joined',
                  style: TextStyle(
                    color: PortalTheme.textSecondary(context),
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: statusColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              status,
              style: TextStyle(
                color: statusColor,
                fontSize: 11,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(String iso) {
    try {
      final d = DateTime.parse(iso);
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      return '${d.day} ${months[d.month - 1]} ${d.year}';
    } catch (_) {
      return iso;
    }
  }
}

// ── Stat Card Widget ──────────────────────────────────────────────────────────

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: PortalTheme.cardSurface(context),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: PortalTheme.borderLight(context)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(height: 8),
          CounterText(
            value: int.tryParse(value) ?? 0,
            style: TextStyle(
              color: PortalTheme.textColor(context),
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              color: PortalTheme.textSecondary(context),
              fontSize: 11,
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}