import 'package:pinesphere_erp/shared/services/admin_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/widgets/error_state_widget.dart';
import 'package:pinesphere_erp/shared/services/mentor_service.dart';

class AdminMentorAssignmentScreen extends ConsumerStatefulWidget {
  const AdminMentorAssignmentScreen({super.key});

  @override
  ConsumerState<AdminMentorAssignmentScreen> createState() =>
      _AdminMentorAssignmentScreenState();
}

class _AdminMentorAssignmentScreenState
    extends ConsumerState<AdminMentorAssignmentScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchTerm = '';
  String _statusFilter = 'all';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final assignmentsAsync = ref.watch(mentorAssignmentsProvider);
    final profilesAsync = ref.watch(mentorProfilesProvider);

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
              'Mentor Assignments',
              style: TextStyle(
                color: Color(0xFF0F172A),
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            Text(
              'Assign and track mentors assigned to students',
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
      body: assignmentsAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primaryBlue),
        ),
        error: (err, stack) => ErrorStateWidget(
          title: 'Unable to fetch assignments',
          error: err,
          onRetry: () => ref.invalidate(mentorAssignmentsProvider),
        ),
        data: (assignments) {
          return profilesAsync.when(
            loading: () => const Center(
              child: CircularProgressIndicator(color: AppColors.primaryBlue),
            ),
            error: (err, stack) => ErrorStateWidget(
              title: 'Unable to fetch mentor profiles',
              error: err,
              onRetry: () => ref.invalidate(mentorProfilesProvider),
            ),
            data: (profiles) {
              // Stats
              final total = assignments.length;
              final active = assignments.where((a) => a.status == 'Active').length;
              final uniqueMentors =
                  assignments.map((a) => a.mentorProfileId).toSet().length;

              final filtered = assignments.where((a) {
                final q = _searchTerm.toLowerCase();
                final matchesSearch = a.studentName.toLowerCase().contains(q) ||
                    a.mentorName.toLowerCase().contains(q) ||
                    a.internId.toLowerCase().contains(q) ||
                    a.batchName.toLowerCase().contains(q);
                final matchesStatus =
                    _statusFilter == 'all' || a.status == _statusFilter;
                return matchesSearch && matchesStatus;
              }).toList();

              return RefreshIndicator(
                onRefresh: () async {
                  ref.read(mentorAssignmentsProvider.notifier).load();
                  ref.read(mentorProfilesProvider.notifier).load();
                },
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // ── Stats Summary Row ──────────────────────────────────
                      Row(
                        children: [
                          Expanded(
                            child: _buildSmallStatCard(
                              title: 'Total',
                              value: '$total',
                              icon: Icons.assignment_ind_outlined,
                              color: Colors.blue,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _buildSmallStatCard(
                              title: 'Active',
                              value: '$active',
                              icon: Icons.check_circle_outline_rounded,
                              color: const Color(0xFF10B981),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: _buildSmallStatCard(
                              title: 'Mentors',
                              value: '$uniqueMentors',
                              icon: Icons.supervised_user_circle_outlined,
                              color: Colors.purple,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // ── Search & Filter Controls ───────────────────────────
                      Container(
                        color: Colors.white,
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          children: [
                            TextField(
                              controller: _searchController,
                              onChanged: (val) {
                                setState(() {
                                  _searchTerm = val;
                                });
                              },
                              decoration: InputDecoration(
                                hintText: 'Search student, mentor, batch...',
                                hintStyle: const TextStyle(
                                    color: Color(0xFF94A3B8), fontSize: 13),
                                prefixIcon: const Icon(Icons.search,
                                    color: Color(0xFF94A3B8), size: 18),
                                contentPadding:
                                    const EdgeInsets.symmetric(vertical: 8),
                                fillColor: const Color(0xFFF1F5F9),
                                filled: true,
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(8),
                                  borderSide: BorderSide.none,
                                ),
                              ),
                            ),
                            const SizedBox(height: 10),
                            Row(
                              children: [
                                const Text(
                                  'Status:',
                                  style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xFF475569)),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 10),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF1F5F9),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: DropdownButtonHideUnderline(
                                      child: DropdownButton<String>(
                                        value: _statusFilter,
                                        isExpanded: true,
                                        style: const TextStyle(
                                            color: Color(0xFF334155),
                                            fontSize: 13,
                                            fontWeight: FontWeight.w600),
                                        onChanged: (val) {
                                          if (val != null) {
                                            setState(() {
                                              _statusFilter = val;
                                            });
                                          }
                                        },
                                        items: const [
                                          DropdownMenuItem(
                                            value: 'all',
                                            child: Text('All Statuses'),
                                          ),
                                          DropdownMenuItem(
                                            value: 'Active',
                                            child: Text('Active'),
                                          ),
                                          DropdownMenuItem(
                                            value: 'Completed',
                                            child: Text('Completed'),
                                          ),
                                          DropdownMenuItem(
                                            value: 'Transferred',
                                            child: Text('Transferred'),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // ── Assignments Cards ──────────────────────────────────
                      const Text(
                        'ASSIGNMENTS LIST',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF64748B),
                          letterSpacing: 1.1,
                        ),
                      ),
                      const SizedBox(height: 10),
                      if (filtered.isEmpty)
                        const Center(
                          child: Padding(
                            padding: EdgeInsets.symmetric(vertical: 24),
                            child: Text(
                              'No assignments found.',
                              style: TextStyle(color: Color(0xFF64748B)),
                            ),
                          ),
                        )
                      else
                        ...filtered.map((a) => Card(
                              margin: const EdgeInsets.only(bottom: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                                side: const BorderSide(
                                    color: Color(0xFFE2E8F0)),
                              ),
                              elevation: 0,
                              color: Colors.white,
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          a.studentName,
                                          style: const TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF0F172A),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: a.status == 'Active'
                                                ? const Color(0xFFECFDF5)
                                                : a.status == 'Completed'
                                                    ? const Color(0xFFF1F5F9)
                                                    : const Color(0xFFFFFBEB),
                                            borderRadius:
                                                BorderRadius.circular(6),
                                          ),
                                          child: Text(
                                            a.status,
                                            style: TextStyle(
                                              color: a.status == 'Active'
                                                  ? const Color(0xFF047857)
                                                  : a.status == 'Completed'
                                                      ? const Color(
                                                          0xFF475569)
                                                      : const Color(
                                                          0xFFD97706),
                                              fontWeight: FontWeight.bold,
                                              fontSize: 10,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      'Intern ID: ${a.internId}',
                                      style: const TextStyle(
                                        fontSize: 11,
                                        color: Color(0xFF64748B),
                                        fontFamily: 'monospace',
                                      ),
                                    ),
                                    const Divider(
                                        height: 24,
                                        color: Color(0xFFF1F5F9)),
                                    Row(
                                      children: [
                                        const Icon(
                                            Icons.person_pin_rounded,
                                            size: 16,
                                            color: AppColors.primaryBlue),
                                        const SizedBox(width: 6),
                                        Text(
                                          'Mentor: ${a.mentorName}',
                                          style: const TextStyle(
                                            fontSize: 13,
                                            fontWeight: FontWeight.w600,
                                            color: Color(0xFF334155),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Row(
                                      children: [
                                        const Icon(Icons.school_outlined,
                                            size: 16,
                                            color: Color(0xFF64748B)),
                                        const SizedBox(width: 6),
                                        Expanded(
                                          child: Text(
                                            'Batch: ${a.batchName}',
                                            style: const TextStyle(
                                              fontSize: 12,
                                              color: Color(0xFF64748B),
                                            ),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Row(
                                      children: [
                                        const Icon(
                                            Icons.calendar_today_outlined,
                                            size: 14,
                                            color: Color(0xFF64748B)),
                                        const SizedBox(width: 6),
                                        Text(
                                          'Assigned: ${a.assignedDate}',
                                          style: const TextStyle(
                                            fontSize: 11,
                                            color: Color(0xFF64748B),
                                          ),
                                        ),
                                        const Spacer(),
                                        Text(
                                          'By: ${a.assignedBy}',
                                          style: const TextStyle(
                                            fontSize: 11,
                                            color: Color(0xFF94A3B8),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            )),

                      const SizedBox(height: 24),

                      // ── Mentor Capacity Check Card ─────────────────────────
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
                            const Text(
                              'MENTOR CAPACITY CHECK',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF475569),
                                letterSpacing: 1.1,
                              ),
                            ),
                            const SizedBox(height: 6),
                            const Text(
                              'Validate assignments against max student capacity before assigning new students.',
                              style: TextStyle(
                                fontSize: 11,
                                color: Color(0xFF64748B),
                              ),
                            ),
                            const SizedBox(height: 16),
                            ...profiles.map((m) {
                              final atLimit = m.currentStudentCount >=
                                  m.maxStudentCapacity;
                              return Container(
                                margin: const EdgeInsets.only(bottom: 8),
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: atLimit
                                      ? const Color(0xFFFEF2F2)
                                      : const Color(0xFFF8FAFC),
                                  border: Border.all(
                                      color: atLimit
                                          ? const Color(0xFFFCA5A5)
                                          : const Color(0xFFE2E8F0)),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          m.employeeName,
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 13,
                                            color: Color(0xFF1E293B),
                                          ),
                                        ),
                                        Text(
                                          '${m.currentStudentCount} / ${m.maxStudentCapacity}',
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 13,
                                            color: Color(0xFF475569),
                                          ),
                                        ),
                                      ],
                                    ),
                                    if (atLimit)
                                      const Padding(
                                        padding: EdgeInsets.only(top: 4),
                                        child: Text(
                                          'At capacity — cannot accept new assignments',
                                          style: TextStyle(
                                            color: Colors.red,
                                            fontSize: 10,
                                            fontWeight: FontWeight.w600,
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
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildSmallStatCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, color: color, size: 16),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: Color(0xFF0F172A),
            ),
          ),
          Text(
            title,
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              color: Color(0xFF64748B),
            ),
          ),
        ],
      ),
    );
  }
}
