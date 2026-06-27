import 'package:pinesphere_erp/shared/services/admin_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/widgets/error_state_widget.dart';
import 'package:pinesphere_erp/shared/services/mentor_service.dart';

class AdminMentorDashboardScreen extends ConsumerWidget {
  const AdminMentorDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profilesAsync = ref.watch(mentorProfilesProvider);
    final assignmentsAsync = ref.watch(mentorAssignmentsProvider);
    final mappingsAsync = ref.watch(mentorMappingsProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC), // slate-50
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.menu, color: Color(0xFF1E293B)),
          onPressed: () {
            ref.read(adminScaffoldKeyProvider).currentState?.openDrawer();
          },
        ),
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Mentor Dashboard',
              style: TextStyle(
                color: Color(0xFF0F172A),
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            Text(
              'Overview of the mentor ecosystem',
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
      body: profilesAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primaryBlue),
        ),
        error: (err, stack) => ErrorStateWidget(
          title: 'Unable to load mentor dashboard',
          error: err,
          onRetry: () => ref.invalidate(mentorProfilesProvider),
        ),
        data: (profiles) {
          return assignmentsAsync.when(
            loading: () => const Center(
              child: CircularProgressIndicator(color: AppColors.primaryBlue),
            ),
            error: (err, stack) => ErrorStateWidget(
              title: 'Unable to load assignments',
              error: err,
              onRetry: () => ref.invalidate(mentorAssignmentsProvider),
            ),
            data: (assignments) {
              return mappingsAsync.when(
                loading: () => const Center(
                  child: CircularProgressIndicator(color: AppColors.primaryBlue),
                ),
                error: (err, stack) => ErrorStateWidget(
                  title: 'Unable to load mappings',
                  error: err,
                  onRetry: () => ref.invalidate(mentorMappingsProvider),
                ),
                data: (mappings) {
                  // Statistics
                  final totalMentors = profiles.length;
                  final availableMentors =
                      profiles.where((p) => p.isAvailable).length;
                  final activeAssignments =
                      assignments.where((a) => a.status == 'Active').length;
                  final activeMappings =
                      mappings.where((m) => m.status == 'Active').length;

                  final totalStudents = profiles.fold<int>(
                      0, (sum, m) => sum + m.currentStudentCount);
                  final totalCapacity = profiles.fold<int>(
                      0, (sum, m) => sum + m.maxStudentCapacity);
                  final utilization = totalCapacity > 0
                      ? ((totalStudents / totalCapacity) * 100).round()
                      : 0;

                  final atCapacity = profiles
                      .where((m) => m.currentStudentCount >= m.maxStudentCapacity)
                      .toList();

                  return RefreshIndicator(
                    onRefresh: () async {
                      ref.invalidate(mentorProfilesProvider);
                      ref.invalidate(mentorAssignmentsProvider);
                      ref.invalidate(mentorMappingsProvider);
                    },
                    child: SingleChildScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // ── Top Stats Grid ─────────────────────────────────
                          GridView.count(
                            crossAxisCount: 2,
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            mainAxisSpacing: 12,
                            crossAxisSpacing: 12,
                            childAspectRatio: 1.4,
                            children: [
                              _buildStatCard(
                                title: 'Total Mentors',
                                value: '$totalMentors',
                                icon: Icons.people_rounded,
                                color: Colors.blue,
                                bg: const Color(0xFFEFF6FF),
                              ),
                              _buildStatCard(
                                title: 'Available Mentors',
                                value: '$availableMentors',
                                icon: Icons.person_add_alt_1_rounded,
                                color: const Color(0xFF10B981),
                                bg: const Color(0xFFECFDF5),
                              ),
                              _buildStatCard(
                                title: 'Active Assignments',
                                value: '$activeAssignments',
                                icon: Icons.assignment_turned_in_rounded,
                                color: Colors.purple,
                                bg: const Color(0xFFFAF5FF),
                              ),
                              _buildStatCard(
                                title: 'Capacity Util.',
                                value: '$utilization%',
                                icon: Icons.insights_rounded,
                                color: Colors.amber,
                                bg: const Color(0xFFFFFBEB),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),

                          // ── Workload Card ──────────────────────────────────
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                            ),
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'MENTOR WORKLOAD',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF475569),
                                    letterSpacing: 1.1,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                ...profiles.map((p) {
                                  final pct = p.maxStudentCapacity > 0
                                      ? p.currentStudentCount / p.maxStudentCapacity
                                      : 0.0;
                                  final isOverloaded = p.currentStudentCount >=
                                      p.maxStudentCapacity;

                                  return Padding(
                                    padding: const EdgeInsets.only(bottom: 12),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(
                                              p.employeeName,
                                              style: const TextStyle(
                                                fontSize: 13,
                                                fontWeight: FontWeight.w600,
                                                color: Color(0xFF1E293B),
                                              ),
                                            ),
                                            Text(
                                              '${p.currentStudentCount} / ${p.maxStudentCapacity}',
                                              style: const TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.w700,
                                                color: Color(0xFF475569),
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 6),
                                        ClipRRect(
                                          borderRadius:
                                              BorderRadius.circular(4),
                                          child: LinearProgressIndicator(
                                            value: pct,
                                            minHeight: 8,
                                            backgroundColor:
                                                const Color(0xFFF1F5F9),
                                            valueColor:
                                                AlwaysStoppedAnimation<Color>(
                                              isOverloaded
                                                  ? Colors.red
                                                  : AppColors.primaryBlue,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  );
                                }),
                              ],
                            ),
                          ),
                          const SizedBox(height: 20),

                          // ── Capacity Alerts ────────────────────────────────
                          Container(
                            width: double.infinity,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                            ),
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    const Icon(Icons.warning_amber_rounded,
                                        color: Colors.amber, size: 18),
                                    const SizedBox(width: 6),
                                    const Text(
                                      'CAPACITY ALERTS',
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF475569),
                                        letterSpacing: 1.1,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                if (atCapacity.isNotEmpty)
                                  ...atCapacity.map((p) => Container(
                                        margin:
                                            const EdgeInsets.only(bottom: 8),
                                        padding: const EdgeInsets.all(10),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFFEF3C7),
                                          border: Border.all(
                                              color: const Color(0xFFFDE68A)),
                                          borderRadius:
                                              BorderRadius.circular(8),
                                        ),
                                        child: Text(
                                          '${p.employeeName} has reached max capacity (${p.maxStudentCapacity} students).',
                                          style: const TextStyle(
                                            fontSize: 11,
                                            color: Color(0xFF92400E),
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ))
                                else
                                  const Text(
                                    'All mentors are within capacity limits.',
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: Color(0xFF64748B),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 20),

                          // ── Navigation Quick Links ─────────────────────────
                          _buildLinkTile(
                            context: context,
                            title: 'Active Batch Mappings',
                            subtitle: '$activeMappings Active Mappings',
                            icon: Icons.layers_outlined,
                            onTap: () {
                              // We know Batch Mappings is at index 9
                              final shell = StatefulNavigationShell.of(context);
                              shell.goBranch(9);
                            },
                          ),
                          const SizedBox(height: 10),
                          _buildLinkTile(
                            context: context,
                            title: 'Student Assignments',
                            subtitle: '$activeAssignments Active Assignments',
                            icon: Icons.assignment_ind_outlined,
                            onTap: () {
                              // Student Assignments is at index 8
                              final shell = StatefulNavigationShell.of(context);
                              shell.goBranch(8);
                            },
                          ),
                        ],
                      ),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
    required Color bg,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: bg,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: color, size: 18),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF64748B),
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLinkTile({
    required BuildContext context,
    required String title,
    required String subtitle,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: AppColors.primaryBlue, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E293B),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 11,
                      color: Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios_rounded,
                color: Color(0xFF94A3B8), size: 14),
          ],
        ),
      ),
    );
  }
}
