import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/widgets/error_state_widget.dart';
import 'package:pinesphere_erp/shared/models/admin_models.dart';
import 'package:pinesphere_erp/shared/services/admin_service.dart';

class AdminOrganizationScreen extends ConsumerStatefulWidget {
  const AdminOrganizationScreen({super.key});

  @override
  ConsumerState<AdminOrganizationScreen> createState() =>
      _AdminOrganizationScreenState();
}

class _AdminOrganizationScreenState
    extends ConsumerState<AdminOrganizationScreen> with SingleTickerProviderStateMixin {
  late TabController _viewTabController;
  final TextEditingController _searchController = TextEditingController();
  
  // Filtering states
  String _searchTerm = '';
  String _statusFilter = 'all';
  String _typeFilter = 'all';
  String _accreditationFilter = 'all';
  
  // Leaderboard Metric Selection
  String _leaderboardMetric = 'students'; // 'students' | 'internships' | 'placement' | 'completion'
  
  // Bulk selection IDs
  final List<String> _selectedIds = [];
  bool _isBulkSelecting = false;

  @override
  void initState() {
    super.initState();
    _viewTabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _viewTabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final orgsAsync = ref.watch(adminOrganizationsProvider);

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
              'Organizations Hub',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: AppColors.slate800,
              ),
            ),
            Text(
              'Partner Institutional Node Directory',
              style: TextStyle(
                color: Color(0xFF64748B),
                fontSize: 11,
              ),
            ),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            alignment: Alignment.centerLeft,
            child: Container(
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(8),
              ),
              child: TabBar(
                controller: _viewTabController,
                indicatorSize: TabBarIndicatorSize.tab,
                dividerColor: Colors.transparent,
                indicator: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(6),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                labelColor: AppColors.primaryBlue,
                unselectedLabelColor: const Color(0xFF64748B),
                labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.normal, fontSize: 13),
                tabs: const [
                  Tab(text: 'Analytics Dashboard'),
                  Tab(text: 'Directory View'),
                ],
              ),
            ),
          ),
        ),
        shape: const Border(
          bottom: BorderSide(color: Color(0xFFE2E8F0), width: 1),
        ),
      ),
      body: orgsAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primaryBlue),
        ),
        error: (err, stack) => ErrorStateWidget(
          title: 'Unable to fetch organizations',
          error: err,
          onRetry: () => ref.invalidate(adminOrganizationsProvider),
        ),
        data: (orgs) {
          return TabBarView(
            controller: _viewTabController,
            children: [
              // View 1: Dashboard
              _buildDashboardView(orgs),
              // View 2: Directory List
              _buildDirectoryView(orgs),
            ],
          );
        },
      ),
    );
  }

  // ── DASHBOARD VIEW ─────────────────────────────────────────────────────────
  Widget _buildDashboardView(List<OrganizationModel> orgs) {
    final total = orgs.length;
    final active = orgs.where((o) => o.partnershipStatus == 'Active').length;
    final totalDepts = orgs.fold<int>(0, (sum, o) => sum + o.departments.length);
    final totalStudents = orgs.fold<int>(0, (sum, o) => sum + o.headcount);

    // Get aggregated timeline activities across all institutions
    final allEvents = <Map<String, dynamic>>[];
    for (var org in orgs) {
      for (var ev in org.timeline) {
        allEvents.add({
          'college': org.name,
          'date': ev.date,
          'title': ev.title,
          'description': ev.description,
          'type': ev.type,
        });
      }
    }
    allEvents.sort((a, b) => b['date'].toString().compareTo(a['date'].toString()));

    return RefreshIndicator(
      onRefresh: () async {
        ref.read(adminOrganizationsProvider.notifier).load();
      },
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // KPI Grid
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              childAspectRatio: 1.5,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              children: [
                _buildSmallStatCard(
                  title: 'Partner Institutions',
                  value: '$total',
                  icon: Icons.business_rounded,
                  color: Colors.blue,
                ),
                _buildSmallStatCard(
                  title: 'Active Partnerships',
                  value: '$active',
                  icon: Icons.handshake_outlined,
                  color: const Color(0xFF10B981),
                ),
                _buildSmallStatCard(
                  title: 'Mapped Departments',
                  value: '$totalDepts',
                  icon: Icons.layers_outlined,
                  color: Colors.orange,
                ),
                _buildSmallStatCard(
                  title: 'Total Enrolled Students',
                  value: '$totalStudents',
                  icon: Icons.people_outline_rounded,
                  color: Colors.purple,
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Leaderboard Widget
            _buildLeaderboardWidget(orgs),
            const SizedBox(height: 20),

            // Combined System Activities Timeline
            const Text(
              'RECENT PLATFORM ACTIVITIES',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: Color(0xFF64748B),
                letterSpacing: 1.1,
              ),
            ),
            const SizedBox(height: 10),
            if (allEvents.isEmpty)
              const Card(
                elevation: 0,
                color: Colors.white,
                shape: RoundedRectangleBorder(
                  side: BorderSide(color: Color(0xFFE2E8F0)),
                ),
                child: Padding(
                  padding: EdgeInsets.all(24),
                  child: Center(child: Text('No timeline logs verified.', style: TextStyle(color: Color(0xFF64748B)))),
                ),
              )
            else
              Card(
                elevation: 0,
                color: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: allEvents.length > 5 ? 5 : allEvents.length,
                    separatorBuilder: (context, index) => const Divider(height: 20, color: Color(0xFFF1F5F9)),
                    itemBuilder: (context, idx) {
                      final ev = allEvents[idx];
                      IconData icon = Icons.info_outline;
                      Color c = Colors.blue;
                      if (ev['type'] == 'added') {
                        icon = Icons.add_circle_outline_rounded;
                        c = Colors.blue;
                      } else if (ev['type'] == 'mou') {
                        icon = Icons.assignment_outlined;
                        c = Colors.green;
                      } else if (ev['type'] == 'coordinator') {
                        icon = Icons.person_add_alt_1_outlined;
                        c = Colors.purple;
                      }

                      return Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              color: c.withValues(alpha: 0.1),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(icon, size: 16, color: c),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        ev['title'],
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                                      ),
                                    ),
                                    Text(
                                      ev['date'],
                                      style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  ev['description'],
                                  style: const TextStyle(fontSize: 12, color: Color(0xFF475569)),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '@ ${ev['college']}',
                                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: c),
                                ),
                              ],
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildLeaderboardWidget(List<OrganizationModel> orgs) {
    // Sort and calculate values based on chosen metric
    List<Map<String, dynamic>> leaderboardData = orgs.map((org) {
      double metricValue = 0;
      String displayValue = '';

      if (_leaderboardMetric == 'students') {
        metricValue = org.headcount.toDouble();
        displayValue = '${org.headcount} Students';
      } else if (_leaderboardMetric == 'internships') {
        final sum = org.departments.fold<int>(0, (s, d) => s + d.internshipsCount);
        metricValue = sum.toDouble();
        displayValue = '$sum Interns';
      } else if (_leaderboardMetric == 'placement') {
        final sum = org.departments.fold<int>(0, (s, d) => s + d.placementRate);
        metricValue = org.departments.isEmpty ? 0 : sum / org.departments.length;
        displayValue = '${metricValue.toStringAsFixed(1)}% Rate';
      } else if (_leaderboardMetric == 'completion') {
        final sum = org.programs.fold<int>(0, (s, p) => s + p.completionRate);
        metricValue = org.programs.isEmpty ? 0 : sum / org.programs.length;
        displayValue = '${metricValue.toStringAsFixed(1)}% LMS';
      }

      return {
        'org': org,
        'value': metricValue,
        'display': displayValue,
      };
    }).toList();

    leaderboardData.sort((a, b) => (b['value'] as double).compareTo(a['value'] as double));
    final double maxVal = leaderboardData.isEmpty ? 1 : (leaderboardData.first['value'] as double).clamp(1.0, 99999.0);

    return Card(
      elevation: 0,
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'INSTITUTIONAL PERFORMANCE RANKING',
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF64748B), letterSpacing: 1.1),
            ),
            const SizedBox(height: 12),
            // Metric selector pills
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildMetricPill('students', 'Headcount'),
                  const SizedBox(width: 8),
                  _buildMetricPill('internships', 'Internships'),
                  const SizedBox(width: 8),
                  _buildMetricPill('placement', 'Placement %'),
                  const SizedBox(width: 8),
                  _buildMetricPill('completion', 'LMS Completion'),
                ],
              ),
            ),
            const SizedBox(height: 16),
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: leaderboardData.length > 5 ? 5 : leaderboardData.length,
              separatorBuilder: (context, index) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final item = leaderboardData[index];
                final OrganizationModel org = item['org'];
                final double currentVal = item['value'];
                final String display = item['display'];
                final double pct = currentVal / maxVal;

                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${index + 1}. ${org.name}',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E293B)),
                        ),
                        Text(
                          display,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.primaryBlue),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: pct.isNaN ? 0.0 : pct,
                        backgroundColor: const Color(0xFFF1F5F9),
                        valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primaryBlue),
                        minHeight: 6,
                      ),
                    ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricPill(String id, String label) {
    final active = _leaderboardMetric == id;
    return ChoiceChip(
      label: Text(label),
      selected: active,
      labelStyle: TextStyle(
        color: active ? Colors.white : const Color(0xFF475569),
        fontSize: 12,
        fontWeight: FontWeight.bold,
      ),
      selectedColor: AppColors.primaryBlue,
      backgroundColor: const Color(0xFFF1F5F9),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      side: BorderSide.none,
      onSelected: (sel) {
        if (sel) {
          setState(() {
            _leaderboardMetric = id;
          });
        }
      },
    );
  }

  // ── DIRECTORY VIEW ─────────────────────────────────────────────────────────
  Widget _buildDirectoryView(List<OrganizationModel> orgs) {
    // Filter logic
    final filtered = orgs.where((o) {
      final q = _searchTerm.toLowerCase();
      final matchesSearch = o.name.toLowerCase().contains(q) ||
          o.code.toLowerCase().contains(q) ||
          o.location.toLowerCase().contains(q) ||
          o.departments.any((d) => d.name.toLowerCase().contains(q));
      
      final matchesStatus = _statusFilter == 'all' || o.partnershipStatus == _statusFilter;
      final matchesType = _typeFilter == 'all' || o.type == _typeFilter;
      final matchesAccreditation = _accreditationFilter == 'all' || o.nbaStatus == _accreditationFilter;

      return matchesSearch && matchesStatus && matchesType && matchesAccreditation;
    }).toList();

    return Stack(
      children: [
        RefreshIndicator(
          onRefresh: () async {
            ref.read(adminOrganizationsProvider.notifier).load();
          },
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Search field
              TextField(
                controller: _searchController,
                onChanged: (val) {
                  setState(() {
                    _searchTerm = val;
                  });
                },
                decoration: InputDecoration(
                  hintText: 'Search by name, code, location, departments...',
                  hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                  prefixIcon: const Icon(Icons.search, color: Color(0xFF94A3B8), size: 18),
                  suffixIcon: _searchTerm.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.close, size: 18, color: Color(0xFF64748B)),
                          onPressed: () {
                            _searchController.clear();
                            setState(() {
                              _searchTerm = '';
                            });
                          },
                        )
                      : null,
                  fillColor: Colors.white,
                  filled: true,
                  contentPadding: const EdgeInsets.symmetric(vertical: 8),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: AppColors.primaryBlue),
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Horizontal Advanced Filters row
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildFilterDropdown(
                      label: 'Status',
                      value: _statusFilter,
                      items: const {
                        'all': 'All Statuses',
                        'Active': 'Active Only',
                        'Inactive': 'Inactive Only',
                        'Pending Verification': 'Pending Verify',
                        'Partnership Expired': 'Expired MoU'
                      },
                      onChanged: (val) => setState(() => _statusFilter = val),
                    ),
                    const SizedBox(width: 8),
                    _buildFilterDropdown(
                      label: 'Type',
                      value: _typeFilter,
                      items: const {
                        'all': 'All Types',
                        'Engineering': 'Engineering',
                        'Science': 'Science',
                        'Management': 'Management',
                        'Arts & Science': 'Arts & Science',
                      },
                      onChanged: (val) => setState(() => _typeFilter = val),
                    ),
                    const SizedBox(width: 8),
                    _buildFilterDropdown(
                      label: 'NBA Accreditation',
                      value: _accreditationFilter,
                      items: const {
                        'all': 'All Accreditation',
                        'Accredited': 'Accredited',
                        'Applied': 'Applied Only',
                        'Not Accredited': 'Not Accredited',
                      },
                      onChanged: (val) => setState(() => _accreditationFilter = val),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Count header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${filtered.length} INSTITUTIONS MATCHED',
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF64748B),
                      letterSpacing: 1.1,
                    ),
                  ),
                  if (_isBulkSelecting)
                    TextButton.icon(
                      onPressed: () {
                        setState(() {
                          _selectedIds.clear();
                          _isBulkSelecting = false;
                        });
                      },
                      icon: const Icon(Icons.close_rounded, size: 14),
                      label: const Text('Cancel Bulk', style: TextStyle(fontSize: 11)),
                    )
                  else
                    IconButton(
                      icon: const Icon(Icons.checklist_rtl_rounded, size: 18, color: Color(0xFF64748B)),
                      onPressed: () {
                        setState(() {
                          _isBulkSelecting = true;
                        });
                      },
                    )
                ],
              ),
              const SizedBox(height: 10),

              if (filtered.isEmpty)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.symmetric(vertical: 40),
                    child: Text('No institutions matching filter criteria.', style: TextStyle(color: Color(0xFF64748B))),
                  ),
                )
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final org = filtered[index];
                    final isSelected = _selectedIds.contains(org.id);

                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(
                          color: isSelected ? AppColors.primaryBlue : const Color(0xFFE2E8F0),
                          width: isSelected ? 2 : 1,
                        ),
                      ),
                      elevation: 0,
                      color: Colors.white,
                      child: InkWell(
                        onLongPress: () {
                          if (!_isBulkSelecting) {
                            setState(() {
                              _isBulkSelecting = true;
                              _selectedIds.add(org.id);
                            });
                          }
                        },
                        onTap: () {
                          if (_isBulkSelecting) {
                            setState(() {
                              if (isSelected) {
                                _selectedIds.remove(org.id);
                                if (_selectedIds.isEmpty) _isBulkSelecting = false;
                              } else {
                                _selectedIds.add(org.id);
                              }
                            });
                          } else {
                            _showOrgDetails(context, org);
                          }
                        },
                        borderRadius: BorderRadius.circular(12),
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
                                      if (_isBulkSelecting) ...[
                                        Checkbox(
                                          value: isSelected,
                                          activeColor: AppColors.primaryBlue,
                                          onChanged: (val) {
                                            setState(() {
                                              if (val == true) {
                                                _selectedIds.add(org.id);
                                              } else {
                                                _selectedIds.remove(org.id);
                                                if (_selectedIds.isEmpty) _isBulkSelecting = false;
                                              }
                                            });
                                          },
                                        ),
                                        const SizedBox(width: 4),
                                      ],
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFF8FAFC),
                                          border: Border.all(color: const Color(0xFFE2E8F0)),
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: Text(
                                          org.code,
                                          style: const TextStyle(
                                            fontSize: 10,
                                            fontFamily: 'monospace',
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF64748B),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  _buildPartnershipBadge(org.partnershipStatus),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Text(
                                org.name,
                                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  const Icon(Icons.location_on_outlined, size: 13, color: Color(0xFF64748B)),
                                  const SizedBox(width: 4),
                                  Text(
                                    org.location,
                                    style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                                  ),
                                ],
                              ),
                              const Divider(height: 24, color: Color(0xFFF1F5F9)),
                              Row(
                                children: [
                                  _buildBadge(label: 'NAAC: ${org.naacGrade}', color: Colors.blue),
                                  const SizedBox(width: 6),
                                  _buildBadge(label: org.autonomousStatus, color: Colors.orange),
                                  const Spacer(),
                                  Text(
                                    'Students: ${org.headcount}',
                                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF475569)),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
              const SizedBox(height: 80), // spacer for FAB
            ],
          ),
        ),

        // Bulk Actions Ribbon at bottom
        if (_selectedIds.isNotEmpty)
          Positioned(
            bottom: 16,
            left: 16,
            right: 16,
            child: Card(
              color: AppColors.slate800,
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${_selectedIds.length} Selected',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    Row(
                      children: [
                        TextButton.icon(
                          onPressed: () => _handleBulkStatus(),
                          icon: const Icon(Icons.swap_horiz, size: 16, color: Colors.white),
                          label: const Text('Toggle Status', style: TextStyle(color: Colors.white, fontSize: 12)),
                        ),
                        TextButton.icon(
                          onPressed: () => _handleBulkNotify(),
                          icon: const Icon(Icons.send_rounded, size: 16, color: Colors.white),
                          label: const Text('Notify', style: TextStyle(color: Colors.white, fontSize: 12)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

        // Onboard FAB (only visible when not bulk selecting)
        if (_selectedIds.isEmpty)
          Positioned(
            bottom: 24,
            right: 24,
            child: FloatingActionButton(
              onPressed: () => _showOnboardDialog(context),
              backgroundColor: AppColors.primaryBlue,
              foregroundColor: Colors.white,
              child: const Icon(Icons.add),
            ),
          ),
      ],
    );
  }

  Widget _buildFilterDropdown({
    required String label,
    required String value,
    required Map<String, String> items,
    required Function(String) onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: value,
          style: const TextStyle(color: Color(0xFF334155), fontSize: 12, fontWeight: FontWeight.w600),
          onChanged: (val) {
            if (val != null) onChanged(val);
          },
          items: items.entries.map((e) {
            return DropdownMenuItem(
              value: e.key,
              child: Text(e.value),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildPartnershipBadge(String status) {
    Color bg = const Color(0xFFECFDF5);
    Color fg = const Color(0xFF047857);

    if (status == 'Inactive') {
      bg = const Color(0xFFFEF2F2);
      fg = const Color(0xFFB91C1C);
    } else if (status == 'Pending Verification' || status == 'Pending') {
      bg = const Color(0xFFFFFBEB);
      fg = const Color(0xFFD97706);
    } else if (status == 'Partnership Expired') {
      bg = const Color(0xFFF1F5F9);
      fg = const Color(0xFF475569);
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        status,
        style: TextStyle(
          color: fg,
          fontWeight: FontWeight.bold,
          fontSize: 10,
        ),
      ),
    );
  }

  Widget _buildBadge({required String label, required Color color}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.bold,
          color: color,
        ),
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
          Icon(icon, color: color, size: 16),
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
              fontSize: 9,
              fontWeight: FontWeight.w600,
              color: Color(0xFF64748B),
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  void _showOrgDetails(BuildContext context, OrganizationModel org) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return _OrgDetailSheet(org: org);
      },
    );
  }

  // ── ONBOARD INSTITUTION DIALOG ─────────────────────────────────────────────
  void _showOnboardDialog(BuildContext context) {
    final formKey = GlobalKey<FormState>();
    final nameCtrl = TextEditingController();
    final codeCtrl = TextEditingController();
    final locationCtrl = TextEditingController();
    final univCtrl = TextEditingController();
    final websiteCtrl = TextEditingController();
    final emailCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final addressCtrl = TextEditingController();
    final rankingCtrl = TextEditingController(text: '50');
    final establishmentCtrl = TextEditingController(text: '2000');
    
    String selectedType = 'Engineering';
    String selectedGrade = 'A+';
    String selectedAutonomous = 'Autonomous';
    String selectedNBA = 'Accredited';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Container(
              height: MediaQuery.of(context).size.height * 0.85,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              padding: EdgeInsets.only(
                top: 16,
                left: 20,
                right: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: Form(
                key: formKey,
                child: Column(
                  children: [
                    Center(
                      child: Container(
                        width: 38,
                        height: 4,
                        decoration: BoxDecoration(
                          color: const Color(0xFFCBD5E1),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Row(
                      children: [
                        Icon(Icons.add_business_rounded, color: AppColors.primaryBlue),
                        SizedBox(width: 8),
                        Text(
                          'Onboard Partner Institution',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Expanded(
                      child: ListView(
                        children: [
                          _buildTextField(label: 'Institution Name *', controller: nameCtrl, validator: (v) => v!.isEmpty ? 'Required' : null),
                          Row(
                            children: [
                              Expanded(child: _buildTextField(label: 'College Code *', controller: codeCtrl, validator: (v) => v!.isEmpty ? 'Required' : null)),
                              const SizedBox(width: 12),
                              Expanded(
                                child: _buildDropdownField(
                                  label: 'Institution Type',
                                  value: selectedType,
                                  items: ['Engineering', 'Science', 'Management', 'Arts & Science'],
                                  onChanged: (val) => setSheetState(() => selectedType = val!),
                                ),
                              ),
                            ],
                          ),
                          _buildTextField(label: 'Location / State *', controller: locationCtrl, validator: (v) => v!.isEmpty ? 'Required' : null),
                          _buildTextField(label: 'Affiliated University', controller: univCtrl),
                          Row(
                            children: [
                              Expanded(child: _buildTextField(label: 'Email Address', controller: emailCtrl, keyboardType: TextInputType.emailAddress)),
                              const SizedBox(width: 12),
                              Expanded(child: _buildTextField(label: 'Contact Phone', controller: phoneCtrl, keyboardType: TextInputType.phone)),
                            ],
                          ),
                          _buildTextField(label: 'Physical Address', controller: addressCtrl),
                          _buildTextField(label: 'Official Website URL', controller: websiteCtrl),
                          
                          const Divider(height: 30),
                          const Text('Accreditation & Rankings', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF475569))),
                          const SizedBox(height: 10),

                          Row(
                            children: [
                              Expanded(
                                child: _buildDropdownField(
                                  label: 'NAAC Grade',
                                  value: selectedGrade,
                                  items: ['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C'],
                                  onChanged: (val) => setSheetState(() => selectedGrade = val!),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: _buildDropdownField(
                                  label: 'Autonomous Status',
                                  value: selectedAutonomous,
                                  items: ['Autonomous', 'Affiliated'],
                                  onChanged: (val) => setSheetState(() => selectedAutonomous = val!),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Row(
                            children: [
                              Expanded(
                                child: _buildDropdownField(
                                  label: 'NBA Status',
                                  value: selectedNBA,
                                  items: ['Accredited', 'Not Accredited', 'Applied'],
                                  onChanged: (val) => setSheetState(() => selectedNBA = val!),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(child: _buildTextField(label: 'National Ranking (NIRF)', controller: rankingCtrl, keyboardType: TextInputType.number)),
                            ],
                          ),
                          _buildTextField(label: 'Establishment Year', controller: establishmentCtrl, keyboardType: TextInputType.number),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text('Cancel'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primaryBlue,
                              foregroundColor: Colors.white,
                            ),
                            onPressed: () {
                              if (formKey.currentState!.validate()) {
                                ref.read(adminOrganizationsProvider.notifier).create({
                                  'name': nameCtrl.text,
                                  'code': codeCtrl.text,
                                  'type': selectedType,
                                  'location': locationCtrl.text,
                                  'university': univCtrl.text,
                                  'email': emailCtrl.text,
                                  'phone': phoneCtrl.text,
                                  'address': addressCtrl.text,
                                  'website': websiteCtrl.text,
                                  'naacGrade': selectedGrade,
                                  'autonomousStatus': selectedAutonomous,
                                  'nbaStatus': selectedNBA,
                                  'nationalRanking': int.tryParse(rankingCtrl.text) ?? 50,
                                  'establishmentYear': int.tryParse(establishmentCtrl.text) ?? 2000,
                                });
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Onboarded institution successfully.')),
                                );
                              }
                            },
                            child: const Text('Save Details'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  // Helper form builders
  Widget _buildTextField({
    required String label,
    required TextEditingController controller,
    String? Function(String?)? validator,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextFormField(
        controller: controller,
        validator: validator,
        keyboardType: keyboardType,
        decoration: InputDecoration(
          labelText: label,
          labelStyle: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: AppColors.primaryBlue),
          ),
        ),
      ),
    );
  }

  Widget _buildDropdownField({
    required String label,
    required String value,
    required List<String> items,
    required void Function(String?) onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: DropdownButtonFormField<String>(
        initialValue: value,
        onChanged: onChanged,
        decoration: InputDecoration(
          labelText: label,
          labelStyle: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
        ),
        items: items.map((item) {
          return DropdownMenuItem(
            value: item,
            child: Text(item, style: const TextStyle(fontSize: 13)),
          );
        }).toList(),
      ),
    );
  }

  // Bulk operation handlers
  void _handleBulkStatus() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Bulk Status Toggle'),
          content: Text('Do you want to toggle status to Active/Inactive for these ${_selectedIds.length} institutions?'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () async {
                final navigator = Navigator.of(context);
                final scaffoldMessenger = ScaffoldMessenger.of(context);
                for (var id in _selectedIds) {
                  // toggle each status
                  final orgs = ref.read(adminOrganizationsProvider).value ?? [];
                  final idx = orgs.indexWhere((o) => o.id == id);
                  if (idx != -1) {
                    final current = orgs[idx].partnershipStatus;
                    final target = current == 'Active' ? 'Inactive' : 'Active';
                    await ref.read(adminOrganizationsProvider.notifier).updateStatus(id, target);
                  }
                }
                setState(() {
                  _selectedIds.clear();
                  _isBulkSelecting = false;
                });
                navigator.pop();
                scaffoldMessenger.showSnackBar(
                  const SnackBar(content: Text('Bulk status updated.')),
                );
              },
              child: const Text('Toggle'),
            ),
          ],
        );
      },
    );
  }

  void _handleBulkNotify() {
    final msgCtrl = TextEditingController();
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Bulk Dispatch Notifications'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Dispatching system-wide announcement to ${_selectedIds.length} campuses:'),
              const SizedBox(height: 12),
              TextField(
                controller: msgCtrl,
                maxLines: 3,
                decoration: const InputDecoration(
                  hintText: 'Enter notification content...',
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _selectedIds.clear();
                  _isBulkSelecting = false;
                });
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Announcement successfully queued.')),
                );
              },
              child: const Text('Dispatch'),
            ),
          ],
        );
      },
    );
  }
}

// ── RICH DETAIL BOTTOM SHEET WITH 6 TABS ─────────────────────────────────────
class _OrgDetailSheet extends ConsumerStatefulWidget {
  final OrganizationModel org;
  const _OrgDetailSheet({required this.org});

  @override
  ConsumerState<_OrgDetailSheet> createState() => _OrgDetailSheetState();
}

class _OrgDetailSheetState extends ConsumerState<_OrgDetailSheet> {
  late String _partnershipStatus;
  late OrganizationModel _currentOrg;

  @override
  void initState() {
    super.initState();
    _partnershipStatus = widget.org.partnershipStatus;
    _currentOrg = widget.org;
  }

  @override
  Widget build(BuildContext context) {
    final isCurrentlyActive = _partnershipStatus == 'Active';

    return DefaultTabController(
      length: 6,
      child: Container(
        height: MediaQuery.of(context).size.height * 0.85,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: Column(
          children: [
            const SizedBox(height: 10),
            Container(
              width: 38,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFCBD5E1),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 12),
            
            // College Header Block
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: const Color(0xFFEFF6FF),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      _currentOrg.logo.isNotEmpty ? _currentOrg.logo : 'SU',
                      style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primaryBlue, fontSize: 13),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _currentOrg.name,
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Code: ${_currentOrg.code} · NAAC Grade: ${_currentOrg.naacGrade}',
                          style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Tab navigation
            const TabBar(
              isScrollable: true,
              tabAlignment: TabAlignment.start,
              labelColor: AppColors.primaryBlue,
              unselectedLabelColor: Color(0xFF64748B),
              indicatorColor: AppColors.primaryBlue,
              labelStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
              unselectedLabelStyle: TextStyle(fontWeight: FontWeight.normal, fontSize: 12),
              tabs: [
                Tab(text: 'Overview'),
                Tab(text: 'Departments'),
                Tab(text: 'Coordinators'),
                Tab(text: 'Students'),
                Tab(text: 'Programs'),
                Tab(text: 'Timeline & Docs'),
              ],
            ),
            
            // Tab Contents
            Expanded(
              child: TabBarView(
                children: [
                  _buildOverviewTab(isCurrentlyActive),
                  _buildDepartmentsTab(),
                  _buildCoordinatorsTab(),
                  _buildStudentsTab(),
                  _buildProgramsTab(),
                  _buildTimelineDocsTab(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 1. OVERVIEW TAB
  Widget _buildOverviewTab(bool isCurrentlyActive) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildInfoRow(label: 'Affiliated University', value: _currentOrg.university),
        _buildInfoRow(label: 'Location', value: _currentOrg.location),
        _buildInfoRow(label: 'National Ranking (NIRF)', value: '#${_currentOrg.nationalRanking}'),
        _buildInfoRow(label: 'Autonomous Status', value: _currentOrg.autonomousStatus),
        _buildInfoRow(label: 'NBA Status', value: _currentOrg.nbaStatus),
        _buildInfoRow(label: 'Partnership Since', value: _currentOrg.partnershipSince.split('T')[0]),
        _buildInfoRow(label: 'Official Website', value: _currentOrg.website),
        _buildInfoRow(label: 'Contact Email', value: _currentOrg.email),
        _buildInfoRow(label: 'Contact Phone', value: _currentOrg.phone),
        _buildInfoRow(label: 'Physical Address', value: _currentOrg.address),
        
        const SizedBox(height: 20),
        SizedBox(
          width: double.infinity,
          height: 44,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: isCurrentlyActive ? const Color(0xFFFEE2E2) : const Color(0xFFD1FAE5),
              foregroundColor: isCurrentlyActive ? const Color(0xFF991B1B) : const Color(0xFF065F46),
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () async {
              final newStatus = isCurrentlyActive ? 'Inactive' : 'Active';
              setState(() {
                _partnershipStatus = newStatus;
                _currentOrg = _currentOrg.copyWith(partnershipStatus: newStatus);
              });
              await ref.read(adminOrganizationsProvider.notifier).updateStatus(_currentOrg.id, newStatus);
            },
            child: Text(
              isCurrentlyActive ? 'Deactivate Partnership' : 'Activate Partnership',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
            ),
          ),
        ),
      ],
    );
  }

  // 2. DEPARTMENTS TAB
  Widget _buildDepartmentsTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'ACADEMIC DEPARTMENTS',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xFF64748B), letterSpacing: 1.1),
            ),
            TextButton.icon(
              onPressed: () => _showAddDepartmentDialog(),
              icon: const Icon(Icons.add_circle_outline_rounded, size: 14),
              label: const Text('Add Department', style: TextStyle(fontSize: 11)),
            ),
          ],
        ),
        const SizedBox(height: 10),
        if (_currentOrg.departments.isEmpty)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 24),
            child: Center(child: Text('No departments configured.', style: TextStyle(color: Color(0xFF64748B), fontSize: 12))),
          )
        else
          ..._currentOrg.departments.map((d) {
            return Card(
              margin: const EdgeInsets.only(bottom: 10),
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
                side: const BorderSide(color: Color(0xFFE2E8F0)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(d.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: d.status == 'Active' ? const Color(0xFFECFDF5) : const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            d.status,
                            style: TextStyle(
                              color: d.status == 'Active' ? const Color(0xFF059669) : const Color(0xFF64748B),
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('HOD / Leader', style: TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
                            Text(d.hod, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF475569))),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text('Students & Faculty', style: TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
                            Text('${d.studentsCount} Stu · ${d.facultyCount} Fac', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF475569))),
                          ],
                        ),
                      ],
                    ),
                    const Divider(height: 20, color: Color(0xFFF1F5F9)),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Internships: ${d.internshipsCount}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                        Text('Placement Rate: ${d.placementRate}%', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.green)),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }),
      ],
    );
  }

  void _showAddDepartmentDialog() {
    final formKey = GlobalKey<FormState>();
    final nameCtrl = TextEditingController();
    final hodCtrl = TextEditingController();
    final countCtrl = TextEditingController(text: '120');
    final facCtrl = TextEditingController(text: '15');
    final internCtrl = TextEditingController(text: '80');
    final rateCtrl = TextEditingController(text: '92');

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Create Department Node'),
          content: SingleChildScrollView(
            child: Form(
              key: formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextFormField(controller: nameCtrl, validator: (v) => v!.isEmpty ? 'Required' : null, decoration: const InputDecoration(labelText: 'Department Name')),
                  TextFormField(controller: hodCtrl, validator: (v) => v!.isEmpty ? 'Required' : null, decoration: const InputDecoration(labelText: 'Head of Department')),
                  TextFormField(controller: countCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Total Enrolled Students')),
                  TextFormField(controller: facCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Faculty Members')),
                  TextFormField(controller: internCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Active Interns')),
                  TextFormField(controller: rateCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Placement Success Rate (%)')),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () async {
                if (formKey.currentState!.validate()) {
                  final newDept = OrganizationDepartment(
                    name: nameCtrl.text,
                    hod: hodCtrl.text,
                    studentsCount: int.tryParse(countCtrl.text) ?? 100,
                    facultyCount: int.tryParse(facCtrl.text) ?? 10,
                    internshipsCount: int.tryParse(internCtrl.text) ?? 50,
                    placementRate: int.tryParse(rateCtrl.text) ?? 90,
                    status: 'Active',
                  );

                  final updated = [..._currentOrg.departments, newDept];
                  
                  // timeline addition
                  final updatedTimeline = [
                    ..._currentOrg.timeline,
                    OrganizationTimelineEvent(
                      date: DateTime.now().toIso8601String().split('T')[0],
                      title: 'Department Added',
                      description: 'Academic department node ${nameCtrl.text} was configured.',
                      type: 'dept',
                    )
                  ];

                  setState(() {
                    _currentOrg = _currentOrg.copyWith(
                      departments: updated,
                      timeline: updatedTimeline,
                    );
                  });

                  final navigator = Navigator.of(context);
                  final scaffoldMessenger = ScaffoldMessenger.of(context);
                  
                  await ref.read(adminOrganizationsProvider.notifier).updateOrganizationDetails(
                    _currentOrg.id,
                    {
                      'departments': updated,
                      'timeline': updatedTimeline,
                    },
                  );

                  navigator.pop();
                  scaffoldMessenger.showSnackBar(
                    const SnackBar(content: Text('Department registered successfully.')),
                  );
                }
              },
              child: const Text('Create'),
            ),
          ],
        );
      },
    );
  }

  // 3. COORDINATORS TAB
  Widget _buildCoordinatorsTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'MAPPED COORDINATORS',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xFF64748B), letterSpacing: 1.1),
            ),
            TextButton.icon(
              onPressed: () => _showMapLiaisonDialog(),
              icon: const Icon(Icons.add_moderator_rounded, size: 14),
              label: const Text('Map Liaison', style: TextStyle(fontSize: 11)),
            ),
          ],
        ),
        const SizedBox(height: 10),
        if (_currentOrg.coordinators.isEmpty)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 24),
            child: Center(child: Text('No coordinator liaisons mapped.', style: TextStyle(color: Color(0xFF64748B), fontSize: 12))),
          )
        else
          ..._currentOrg.coordinators.map((c) {
            return Card(
              margin: const EdgeInsets.only(bottom: 10),
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
                side: const BorderSide(color: Color(0xFFE2E8F0)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(c.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: c.status == 'Active' ? const Color(0xFFECFDF5) : const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            c.status,
                            style: TextStyle(
                              color: c.status == 'Active' ? const Color(0xFF059669) : const Color(0xFF64748B),
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(c.department, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                    const Divider(height: 16),
                    Row(
                      children: [
                        const Icon(Icons.mail_outline_rounded, size: 13, color: Color(0xFF64748B)),
                        const SizedBox(width: 6),
                        Text(c.email, style: const TextStyle(fontSize: 11, color: Color(0xFF475569))),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.phone_outlined, size: 13, color: Color(0xFF64748B)),
                        const SizedBox(width: 6),
                        Text(c.phone, style: const TextStyle(fontSize: 11, color: Color(0xFF475569))),
                      ],
                    ),
                    const Divider(height: 16),
                    // KPI stats row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildKpiItem('Processed', '${c.applicationsProcessed}'),
                        _buildKpiItem('Approvals', '${c.attendanceApprovals}'),
                        _buildKpiItem('Completed', '${c.internshipCompletions}'),
                        _buildKpiItem('Placement %', '${c.placementSuccess}%'),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }),
      ],
    );
  }

  Widget _buildKpiItem(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF1E293B))),
        Text(label, style: const TextStyle(fontSize: 9, color: Color(0xFF94A3B8))),
      ],
    );
  }

  void _showMapLiaisonDialog() {
    final formKey = GlobalKey<FormState>();
    final nameCtrl = TextEditingController();
    final emailCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    
    // Choose department from current list
    final List<String> deptNames = _currentOrg.departments.map((d) => d.name).toList();
    if (deptNames.isEmpty) deptNames.add('General Administration');
    String selectedDept = deptNames.first;

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return AlertDialog(
              title: const Text('Map Coordinator Liaison'),
              content: Form(
                key: formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextFormField(controller: nameCtrl, validator: (v) => v!.isEmpty ? 'Required' : null, decoration: const InputDecoration(labelText: 'Liaison Name')),
                    TextFormField(controller: emailCtrl, validator: (v) => v!.isEmpty ? 'Required' : null, decoration: const InputDecoration(labelText: 'Email Address')),
                    TextFormField(controller: phoneCtrl, decoration: const InputDecoration(labelText: 'Phone Number')),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      initialValue: selectedDept,
                      onChanged: (val) => setSheetState(() => selectedDept = val!),
                      decoration: const InputDecoration(labelText: 'Assigned Department'),
                      items: deptNames.map((d) => DropdownMenuItem(value: d, child: Text(d, style: const TextStyle(fontSize: 12)))).toList(),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
                ElevatedButton(
                  onPressed: () async {
                    if (formKey.currentState!.validate()) {
                      final newCoord = OrganizationCoordinator(
                        id: 'coord-${_currentOrg.coordinators.length + 10}',
                        name: nameCtrl.text,
                        email: emailCtrl.text,
                        phone: phoneCtrl.text,
                        department: selectedDept,
                        studentsManaged: 250,
                        programsManaged: 1,
                        status: 'Active',
                        applicationsProcessed: 10,
                        attendanceApprovals: 50,
                        internshipCompletions: 8,
                        placementSuccess: 95,
                      );

                      final updated = [..._currentOrg.coordinators, newCoord];
                      
                      final updatedTimeline = [
                        ..._currentOrg.timeline,
                        OrganizationTimelineEvent(
                          date: DateTime.now().toIso8601String().split('T')[0],
                          title: 'Coordinator Mapped',
                          description: 'Liaison coordinator ${nameCtrl.text} registered.',
                          type: 'coordinator',
                        )
                      ];

                      setState(() {
                        _currentOrg = _currentOrg.copyWith(
                          coordinators: updated,
                          timeline: updatedTimeline,
                        );
                      });

                      final navigator = Navigator.of(context);
                      final scaffoldMessenger = ScaffoldMessenger.of(context);

                      await ref.read(adminOrganizationsProvider.notifier).updateOrganizationDetails(
                        _currentOrg.id,
                        {
                          'coordinators': updated,
                          'timeline': updatedTimeline,
                        },
                      );

                      navigator.pop();
                      scaffoldMessenger.showSnackBar(
                        const SnackBar(content: Text('Liaison coordinator mapped.')),
                      );
                    }
                  },
                  child: const Text('Map'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  // 4. STUDENTS TAB
  Widget _buildStudentsTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'ENROLLED STUDENTS',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xFF64748B), letterSpacing: 1.1),
        ),
        const SizedBox(height: 10),
        if (_currentOrg.students.isEmpty)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 24),
            child: Center(child: Text('No student records mapped.', style: TextStyle(color: Color(0xFF64748B), fontSize: 12))),
          )
        else
          ..._currentOrg.students.map((s) {
            Color statusColor = Colors.blue;
            if (s.status == 'Placed') {
              statusColor = Colors.green;
            } else if (s.status == 'Placement Ready') {
              statusColor = Colors.orange;
            }

            return Card(
              margin: const EdgeInsets.only(bottom: 8),
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
                side: const BorderSide(color: Color(0xFFE2E8F0)),
              ),
              child: ListTile(
                title: Text(s.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E293B))),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Roll: ${s.id} · Year: ${s.year}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                    Text('Program: ${s.program}', style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
                  ],
                ),
                trailing: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: statusColor.withValues(alpha: 0.2)),
                  ),
                  child: Text(
                    s.status,
                    style: TextStyle(color: statusColor, fontSize: 9, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            );
          }),
      ],
    );
  }

  // 5. PROGRAMS TAB
  Widget _buildProgramsTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'ACTIVE INTERNSHIP PROGRAMS',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xFF64748B), letterSpacing: 1.1),
        ),
        const SizedBox(height: 10),
        if (_currentOrg.programs.isEmpty)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 24),
            child: Center(child: Text('No active programs mapped.', style: TextStyle(color: Color(0xFF64748B), fontSize: 12))),
          )
        else
          ..._currentOrg.programs.map((p) {
            return Card(
              margin: const EdgeInsets.only(bottom: 10),
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
                side: const BorderSide(color: Color(0xFFE2E8F0)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(p.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E293B))),
                        Text(p.duration, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text('Liaison: ${p.coordinatorName} · Enrolled: ${p.enrolledCount}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                    const Divider(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildProgramMetric('Completion', '${p.completionRate}%'),
                        _buildProgramMetric('Attendance', '${p.attendanceRate}%'),
                        _buildProgramMetric('Placement', '${p.placementRate}%'),
                        _buildProgramMetric('Satisfaction', '${p.satisfactionScore}/5'),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }),
      ],
    );
  }

  Widget _buildProgramMetric(String label, String val) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(val, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF475569))),
        Text(label, style: const TextStyle(fontSize: 9, color: Color(0xFF94A3B8))),
      ],
    );
  }

  // 6. TIMELINE & DOCUMENTS TAB
  Widget _buildTimelineDocsTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'INSTITUTIONAL DOCUMENTS',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xFF64748B), letterSpacing: 1.1),
        ),
        const SizedBox(height: 10),
        if (_currentOrg.documents.isEmpty)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 12),
            child: Text('No verified documents uploaded.', style: TextStyle(color: Color(0xFF64748B), fontSize: 12)),
          )
        else
          ..._currentOrg.documents.map((d) {
            return Card(
              margin: const EdgeInsets.only(bottom: 8),
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
                side: const BorderSide(color: Color(0xFFE2E8F0)),
              ),
              child: ListTile(
                leading: const Icon(Icons.picture_as_pdf_outlined, color: Colors.red),
                title: Text(d.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0F172A))),
                subtitle: Text('Type: ${d.type} · v${d.version}', style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
                trailing: TextButton(
                  onPressed: () => _showDocPreview(d),
                  child: const Text('View', style: TextStyle(fontSize: 12)),
                ),
              ),
            );
          }),
        
        const SizedBox(height: 16),
        const Text(
          'PARTNERSHIP TIMELINE ACTIVITIES',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xFF64748B), letterSpacing: 1.1),
        ),
        const SizedBox(height: 10),
        if (_currentOrg.timeline.isEmpty)
          const Text('No timeline trails logged.', style: TextStyle(color: Color(0xFF64748B), fontSize: 12))
        else
          ..._currentOrg.timeline.map((t) {
            return Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(color: AppColors.primaryBlue, shape: BoxShape.circle),
                    ),
                    Container(width: 2, height: 36, color: const Color(0xFFCBD5E1)),
                  ],
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(t.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF1E293B))),
                          Text(t.date, style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(t.description, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                      const SizedBox(height: 10),
                    ],
                  ),
                ),
              ],
            );
          }),
      ],
    );
  }

  void _showDocPreview(OrganizationDocument d) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(d.name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Document Type: ${d.type}'),
              Text('Version: ${d.version}'),
              Text('Verification Status: ${d.status}'),
              if (d.verifiedBy.isNotEmpty) Text('Verified By: ${d.verifiedBy}'),
              const Divider(height: 20),
              const Text('Preview Content Summary:', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              Text(
                d.previewContent.isNotEmpty ? d.previewContent : 'No content preview available.',
                style: const TextStyle(fontSize: 12, fontStyle: FontStyle.italic),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Close')),
          ],
        );
      },
    );
  }

  Widget _buildInfoRow({required String label, required String value}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Color(0xFF64748B),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            flex: 3,
            child: Text(
              value.isNotEmpty ? value : 'N/A',
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1E293B),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
