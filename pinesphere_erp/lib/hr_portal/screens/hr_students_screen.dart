import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/hr_portal/services/hr_api_service.dart';
import 'package:pinesphere_erp/shared/models/student_model.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class HRStudentsScreen extends ConsumerStatefulWidget {
  const HRStudentsScreen({super.key});

  @override
  ConsumerState<HRStudentsScreen> createState() => _HRStudentsScreenState();
}

class _HRStudentsScreenState extends ConsumerState<HRStudentsScreen> {
  String _searchQuery = '';
  String _statusFilter = 'All';
  static const _statuses = ['All', 'Active', 'Completed', 'Pending', 'Inactive'];

  @override
  Widget build(BuildContext context) {
    final studentsAsync = ref.watch(hrStudentsProvider);

    return Scaffold(
      backgroundColor: PortalTheme.backgroundSlate(context),
      appBar: AppBar(
        title: const Text(
          'Students',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        backgroundColor: PortalTheme.cardSurface(context),
        elevation: 0,
        centerTitle: false,
        actions: [
          // Refresh
          IconButton(
            icon: Icon(Icons.refresh_rounded,
                color: PortalTheme.primaryBlue(context)),
            onPressed: () => ref.refresh(hrStudentsProvider),
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: Column(
        children: [
          // ── Search + Filter bar ────────────────────────────────────────
          Container(
            color: PortalTheme.cardSurface(context),
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
            child: Column(
              children: [
                // Search bar
                TextField(
                  onChanged: (v) => setState(() => _searchQuery = v),
                  decoration: InputDecoration(
                    hintText: 'Search by intern ID...',
                    hintStyle: TextStyle(
                        color: PortalTheme.textSecondary(context), fontSize: 13),
                    prefixIcon: Icon(Icons.search_rounded,
                        color: PortalTheme.textSecondary(context), size: 20),
                    filled: true,
                    fillColor: PortalTheme.backgroundSlate(context),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
                const SizedBox(height: 10),
                // Status filter chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: _statuses.map((status) {
                      final isSelected = _statusFilter == status;
                      return GestureDetector(
                        onTap: () =>
                            setState(() => _statusFilter = status),
                        child: Container(
                          margin: const EdgeInsets.only(right: 8),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 14, vertical: 6),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? AppColors.primaryBlue
                                : PortalTheme.backgroundSlate(context),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isSelected
                                  ? AppColors.primaryBlue
                                  : PortalTheme.borderLight(context),
                            ),
                          ),
                          child: Text(
                            status,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: isSelected
                                  ? Colors.white
                                  : PortalTheme.textSecondary(context),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),

          // ── Student list ───────────────────────────────────────────────
          Expanded(
            child: studentsAsync.when(
              loading: () => const Center(
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: AppColors.primaryBlue,
                ),
              ),
              error: (err, _) => _buildError(err.toString()),
              data: (students) {
                final filtered = _applyFilters(students);
                if (filtered.isEmpty) {
                  return _buildEmptyState();
                }
                return RefreshIndicator(
                  onRefresh: () async =>
                      ref.refresh(hrStudentsProvider),
                  color: AppColors.primaryBlue,
                  child: ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 12, 16, 100),
                    itemCount: filtered.length,
                    itemBuilder: (context, index) =>
                        _StudentCard(student: filtered[index]),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  List<StudentModel> _applyFilters(List<StudentModel> students) {
    return students.where((s) {
      final matchesSearch = _searchQuery.isEmpty ||
          s.displayName
              .toLowerCase()
              .contains(_searchQuery.toLowerCase()) ||
          (s.internId ?? '')
              .toLowerCase()
              .contains(_searchQuery.toLowerCase());
      final matchesStatus = _statusFilter == 'All' ||
          s.studentStatus.toLowerCase() ==
              _statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    }).toList();
  }

  Widget _buildError(String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline,
                size: 48, color: AppColors.error),
            const SizedBox(height: 16),
            const Text(
              'Failed to load students',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: AppColors.slate700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  color: AppColors.slate400, fontSize: 13),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () => ref.refresh(hrStudentsProvider),
              icon: const Icon(Icons.refresh_rounded, size: 18),
              label: const Text('Retry'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryBlue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.people_outline, size: 56, color: AppColors.slate300),
          const SizedBox(height: 16),
          const Text(
            'No students found',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
              color: AppColors.slate700,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Try adjusting your search or filters',
            style: TextStyle(color: AppColors.slate400, fontSize: 13),
          ),
        ],
      ),
    );
  }
}

// ── Student Card ──────────────────────────────────────────────────────────────

class _StudentCard extends StatelessWidget {
  final StudentModel student;

  const _StudentCard({required this.student});

  @override
  Widget build(BuildContext context) {
    final statusColor = _statusColor(student.studentStatus);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
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
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            // Avatar
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: AppColors.primaryBlue.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              alignment: Alignment.center,
              child: Text(
                student.displayName.isNotEmpty
                    ? student.displayName[0].toUpperCase()
                    : '?',
                style: const TextStyle(
                  color: AppColors.primaryBlue,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
            const SizedBox(width: 14),

            // Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    student.displayName,
                    style: TextStyle(
                      color: PortalTheme.textColor(context),
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                    ),
                  ),
                  const SizedBox(height: 2),
                  if (student.internId != null &&
                      student.internId!.isNotEmpty)
                    Text(
                      'Intern ID: ${student.internId}',
                      style: TextStyle(
                        color: PortalTheme.textSecondary(context),
                        fontSize: 12,
                      ),
                    ),
                  const SizedBox(height: 2),
                  Text(
                    _joinedText(),
                    style: TextStyle(
                      color: PortalTheme.textSecondary(context),
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),

            // Status badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: statusColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                student.studentStatus,
                style: TextStyle(
                  color: statusColor,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _joinedText() {
    final date = student.joinedAt ?? student.createdAt;
    if (date.isEmpty) return 'Not started';
    try {
      final d = DateTime.parse(date);
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      return 'Joined ${d.day} ${months[d.month - 1]} ${d.year}';
    } catch (_) {
      return 'Joined $date';
    }
  }

  Color _statusColor(String status) {
    switch (status.toLowerCase()) {
      case 'active':
        return AppColors.success;
      case 'completed':
        return AppColors.primaryBlue;
      case 'inactive':
        return AppColors.error;
      default:
        return AppColors.warning;
    }
  }
}
