import 'package:pinesphere_erp/shared/services/admin_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/widgets/error_state_widget.dart';
import 'package:pinesphere_erp/shared/services/mentor_service.dart';

class AdminMentorBatchMappingScreen extends ConsumerStatefulWidget {
  const AdminMentorBatchMappingScreen({super.key});

  @override
  ConsumerState<AdminMentorBatchMappingScreen> createState() =>
      _AdminMentorBatchMappingScreenState();
}

class _AdminMentorBatchMappingScreenState
    extends ConsumerState<AdminMentorBatchMappingScreen> {
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
              'Mentor Batch Mappings',
              style: TextStyle(
                color: Color(0xFF0F172A),
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            Text(
              'Lead mentor mappings to cohort batches',
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
      body: mappingsAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primaryBlue),
        ),
        error: (err, stack) => ErrorStateWidget(
          title: 'Unable to fetch batch mappings',
          error: err,
          onRetry: () => ref.invalidate(mentorMappingsProvider),
        ),
        data: (mappings) {
          final total = mappings.length;
          final active = mappings.where((m) => m.status == 'Active').length;
          final uniqueMentors =
              mappings.map((m) => m.mentorProfileId).toSet().length;

          final filtered = mappings.where((m) {
            final q = _searchTerm.toLowerCase();
            final matchesSearch = m.mentorName.toLowerCase().contains(q) ||
                m.batchName.toLowerCase().contains(q) ||
                m.batchCode.toLowerCase().contains(q) ||
                m.programName.toLowerCase().contains(q);
            final matchesStatus =
                _statusFilter == 'all' || m.status == _statusFilter;
            return matchesSearch && matchesStatus;
          }).toList();

          return RefreshIndicator(
            onRefresh: () async {
              ref.read(mentorMappingsProvider.notifier).load();
            },
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Stats Summary Row ──────────────────────────────────────
                  Row(
                    children: [
                      Expanded(
                        child: _buildSmallStatCard(
                          title: 'Total Mappings',
                          value: '$total',
                          icon: Icons.link_rounded,
                          color: Colors.blue,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildSmallStatCard(
                          title: 'Active Batches',
                          value: '$active',
                          icon: Icons.unarchive_outlined,
                          color: const Color(0xFF10B981),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildSmallStatCard(
                          title: 'Unique Mentors',
                          value: '$uniqueMentors',
                          icon: Icons.supervisor_account_outlined,
                          color: Colors.purple,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // ── Search & Filter Controls ───────────────────────────────
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
                            hintText: 'Search batch, mentor, program...',
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
                                        value: 'Upcoming',
                                        child: Text('Upcoming'),
                                      ),
                                      DropdownMenuItem(
                                        value: 'Completed',
                                        child: Text('Completed'),
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

                  // ── Batch Mappings List ────────────────────────────────────
                  const Text(
                    'BATCH MAPPINGS LIST',
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
                          'No mappings found.',
                          style: TextStyle(color: Color(0xFF64748B)),
                        ),
                      ),
                    )
                  else
                    ...filtered.map((m) {
                      final utilPct = m.batchCapacity > 0
                          ? (m.studentCount / m.batchCapacity)
                          : 0.0;
                      final utilPctInt = (utilPct * 100).round();

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
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 8, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF8FAFC),
                                      border: Border.all(
                                          color: const Color(0xFFE2E8F0)),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Text(
                                      m.batchCode,
                                      style: const TextStyle(
                                        fontSize: 10,
                                        fontFamily: 'monospace',
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF64748B),
                                      ),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: m.status == 'Active'
                                          ? const Color(0xFFECFDF5)
                                          : m.status == 'Upcoming'
                                              ? const Color(0xFFEFF6FF)
                                              : const Color(0xFFF1F5F9),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      m.status,
                                      style: TextStyle(
                                        color: m.status == 'Active'
                                            ? const Color(0xFF047857)
                                            : m.status == 'Upcoming'
                                                ? const Color(0xFF1D4ED8)
                                                : const Color(0xFF475569),
                                        fontWeight: FontWeight.bold,
                                        fontSize: 10,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Text(
                                m.batchName,
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                m.programName,
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Color(0xFF64748B),
                                ),
                              ),
                              const Divider(
                                  height: 24, color: Color(0xFFF1F5F9)),
                              Row(
                                children: [
                                  Container(
                                    width: 32,
                                    height: 32,
                                    decoration: const BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: Color(0xFFEFF6FF),
                                    ),
                                    alignment: Alignment.center,
                                    child: Text(
                                      m.mentorName[0].toUpperCase(),
                                      style: const TextStyle(
                                        color: AppColors.primaryBlue,
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text(
                                          'LEAD MENTOR',
                                          style: TextStyle(
                                            fontSize: 9,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF94A3B8),
                                            letterSpacing: 0.8,
                                          ),
                                        ),
                                        Text(
                                          m.mentorName,
                                          style: const TextStyle(
                                            fontSize: 13,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF334155),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'STUDENTS',
                                        style: TextStyle(
                                            fontSize: 9,
                                            color: Color(0xFF94A3B8),
                                            fontWeight: FontWeight.bold),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        '${m.studentCount} / ${m.batchCapacity}',
                                        style: const TextStyle(
                                            fontSize: 13,
                                            fontWeight: FontWeight.w800,
                                            color: Color(0xFF0F172A)),
                                      ),
                                    ],
                                  ),
                                  Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.end,
                                    children: [
                                      const Text(
                                        'MAPPED ON',
                                        style: TextStyle(
                                            fontSize: 9,
                                            color: Color(0xFF94A3B8),
                                            fontWeight: FontWeight.bold),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        m.mappedDate,
                                        style: const TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w600,
                                            color: Color(0xFF334155)),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    'Batch Occupancy',
                                    style: TextStyle(
                                        fontSize: 10,
                                        color: Color(0xFF94A3B8)),
                                  ),
                                  Text(
                                    '$utilPctInt%',
                                    style: const TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF475569)),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              ClipRRect(
                                borderRadius: BorderRadius.circular(3),
                                child: LinearProgressIndicator(
                                  value: utilPct,
                                  minHeight: 6,
                                  backgroundColor: const Color(0xFFF1F5F9),
                                  valueColor:
                                      const AlwaysStoppedAnimation<Color>(
                                          AppColors.primaryBlue),
                                ),
                              ),
                              const SizedBox(height: 12),
                              Text(
                                'Mapped by: ${m.mappedBy}',
                                style: const TextStyle(
                                  fontSize: 10,
                                  color: Color(0xFF94A3B8),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                ],
              ),
            ),
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
