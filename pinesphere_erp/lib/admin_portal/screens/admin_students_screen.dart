import 'package:pinesphere_erp/shared/services/admin_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/hr_portal/services/hr_api_service.dart';
import 'package:pinesphere_erp/shared/models/student_model.dart';

/// Admin Students screen — reuses HR student service, same backend endpoint.
/// Mirrors frontend /admin/student page.
class AdminStudentsScreen extends ConsumerStatefulWidget {
  const AdminStudentsScreen({super.key});

  @override
  ConsumerState<AdminStudentsScreen> createState() =>
      _AdminStudentsScreenState();
}

class _AdminStudentsScreenState
    extends ConsumerState<AdminStudentsScreen> {
  String _searchQuery = '';
  String _statusFilter = 'All';
  static const _statuses = [
    'All', 'Active', 'Completed', 'Pending', 'Inactive'
  ];

  @override
  Widget build(BuildContext context) {
    final studentsAsync = ref.watch(hrStudentsProvider);

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
          'Students',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 17,
            color: AppColors.slate800,
          ),
        ),
        actions: [
          studentsAsync.when(
            data: (students) => Center(
              child: Padding(
                padding: const EdgeInsets.only(right: 16),
                child: Text(
                  '${students.length} total',
                  style: const TextStyle(
                    color: AppColors.slate400,
                    fontSize: 13,
                  ),
                ),
              ),
            ),
            loading: () => const SizedBox.shrink(),
            error: (_, __) => const SizedBox.shrink(),
          ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded,
                color: AppColors.primaryBlue),
            onPressed: () => ref.refresh(hrStudentsProvider),
          ),
        ],
      ),
      body: Column(
        children: [
          // ── Search + filter ──────────────────────────────────────────
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: Column(
              children: [
                TextField(
                  onChanged: (v) => setState(() => _searchQuery = v),
                  decoration: InputDecoration(
                    hintText: 'Search students...',
                    hintStyle: const TextStyle(
                        color: AppColors.slate400, fontSize: 13),
                    prefixIcon: const Icon(Icons.search_rounded,
                        color: AppColors.slate400, size: 20),
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding:
                        const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
                const SizedBox(height: 10),
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
                                : const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isSelected
                                  ? AppColors.primaryBlue
                                  : AppColors.slate200,
                            ),
                          ),
                          child: Text(
                            status,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: isSelected
                                  ? Colors.white
                                  : AppColors.slate500,
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

          // ── List ──────────────────────────────────────────────────────
          Expanded(
            child: studentsAsync.when(
              loading: () => const Center(
                child: CircularProgressIndicator(
                    strokeWidth: 2, color: AppColors.primaryBlue),
              ),
              error: (err, _) => _buildError(err.toString()),
              data: (students) {
                final filtered = _applyFilters(students);
                if (filtered.isEmpty) return _buildEmpty();
                return RefreshIndicator(
                  onRefresh: () async =>
                      ref.refresh(hrStudentsProvider),
                  color: AppColors.primaryBlue,
                  child: ListView.builder(
                    padding:
                        const EdgeInsets.fromLTRB(16, 12, 16, 100),
                    itemCount: filtered.length,
                    itemBuilder: (ctx, i) =>
                        _AdminStudentCard(student: filtered[i]),
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
      final matchSearch = _searchQuery.isEmpty ||
          s.displayName
              .toLowerCase()
              .contains(_searchQuery.toLowerCase()) ||
          (s.internId ?? '')
              .toLowerCase()
              .contains(_searchQuery.toLowerCase());
      final matchStatus = _statusFilter == 'All' ||
          s.studentStatus.toLowerCase() ==
              _statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    }).toList();
  }

  Widget _buildError(String msg) {
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
                  color: AppColors.slate700),
            ),
            const SizedBox(height: 8),
            Text(msg,
                textAlign: TextAlign.center,
                style: const TextStyle(
                    color: AppColors.slate400, fontSize: 12)),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () => ref.refresh(hrStudentsProvider),
              icon: const Icon(Icons.refresh_rounded, size: 16),
              label: const Text('Retry'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryBlue,
                foregroundColor: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmpty() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.people_outline,
              size: 56, color: AppColors.slate300),
          const SizedBox(height: 16),
          const Text(
            'No students found',
            style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: AppColors.slate700),
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

class _AdminStudentCard extends StatelessWidget {
  final StudentModel student;
  const _AdminStudentCard({required this.student});

  @override
  Widget build(BuildContext context) {
    final statusColor = _statusColor(student.studentStatus);
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.slate100),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 6,
              offset: const Offset(0, 2)),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
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
                  fontSize: 14),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  student.displayName,
                  style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                      color: AppColors.slate800),
                ),
                if (student.internId != null &&
                    student.internId!.isNotEmpty)
                  Text(
                    'Intern ID: ${student.internId}',
                    style: const TextStyle(
                        color: AppColors.slate400, fontSize: 11),
                  ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(
                horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: statusColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              student.studentStatus,
              style: TextStyle(
                  color: statusColor,
                  fontSize: 11,
                  fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
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
