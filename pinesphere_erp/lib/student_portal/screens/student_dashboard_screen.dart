import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/features/auth/providers/auth_provider.dart';
import 'package:pinesphere_erp/student_portal/providers/attendance_provider.dart';
import 'package:pinesphere_erp/student_portal/providers/financials_provider.dart';
import 'package:pinesphere_erp/student_portal/providers/kpi_provider.dart';
import 'package:pinesphere_erp/student_portal/providers/lms_provider.dart';
import 'package:pinesphere_erp/student_portal/providers/profile_provider.dart';
import 'package:pinesphere_erp/student_portal/providers/tasks_provider.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';
import 'package:pinesphere_erp/student_portal/widgets/agenda_tile.dart';
import 'package:pinesphere_erp/student_portal/widgets/announcement_card.dart';
import 'package:pinesphere_erp/student_portal/widgets/metric_card.dart';
import 'package:pinesphere_erp/student_portal/widgets/progress_circle.dart';
import 'package:pinesphere_erp/core/utils/premium_animations.dart';

// Screens
import 'package:pinesphere_erp/student_portal/screens/assessment_screen.dart';
import 'package:pinesphere_erp/student_portal/screens/attendance_screen.dart';
import 'package:pinesphere_erp/student_portal/screens/capstone_screen.dart';
import 'package:pinesphere_erp/student_portal/screens/chat_screen.dart';
import 'package:pinesphere_erp/student_portal/screens/documents_screen.dart';
import 'package:pinesphere_erp/student_portal/screens/financials_screen.dart';
import 'package:pinesphere_erp/student_portal/screens/kpi_screen.dart';
import 'package:pinesphere_erp/student_portal/screens/lms_screen.dart';
import 'package:pinesphere_erp/student_portal/screens/profile_screen.dart';
import 'package:pinesphere_erp/student_portal/screens/tasks_screen.dart';

class StudentDashboardScreen extends ConsumerWidget {
  const StudentDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentUser = ref.watch(currentUserProvider);
    final profile = ref.watch(profileProvider);
    ref.watch(attendanceProvider);
    final lms = ref.watch(lmsProvider);
    final financials = ref.watch(financialsProvider);
    final kpi = ref.watch(kpiProvider);
    ref.watch(tasksProvider);

    // Use real user name from JWT, fallback to profile mock
    final studentName = currentUser?.displayName ?? profile.personal.fullName;

    // Mock Announcements
    final announcements = [
      {"date": "June 16, 2026", "title": "Sprint 3 Code Review & Core Audit Schedule", "content": "All capstone repositories must be synced with the main branch by June 19, 2026 for review by the architectural board."},
      {"date": "June 14, 2026", "title": "Guest Lecture: Hydration Patterns at Scale", "content": "Technical presentation by the core engineering group of pinesphere.com on June 18 at 04:00 PM IST."},
      {"date": "June 10, 2026", "title": "Attendance Policy Enforcement", "content": "A minimum threshold of 85% attendance is required for program certificate eligibility. Check your status weekly."},
    ];

    // Mock Agenda
    final agendaList = [
      {"id": 1, "task": "Sprint Planning & Scrum Sync", "time": "09:00 AM", "completed": true},
      {"id": 2, "task": "Advanced Hydration Architecture Learning", "time": "11:30 AM", "completed": true},
      {"id": 3, "task": "Staging Deployment & Diagnostics Dry Run", "time": "03:00 PM", "completed": false},
      {"id": 4, "task": "Technical Sync with Guide", "time": "05:00 PM", "completed": false},
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text('Hello, ${studentName.split(' ').first}!', style: const TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => ProfileScreen()),
              );
            },
            icon: CircleAvatar(
              radius: 14,
              backgroundColor: PortalTheme.primaryBlue(context),
              backgroundImage: profile.profilePicUrl != null ? NetworkImage(profile.profilePicUrl!) : null,
              child: profile.profilePicUrl == null
                  ? Text(
                      "${profile.personal.firstName[0]}${profile.personal.lastName[0]}",
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onPrimary,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    )
                  : null,
            ),
          ),
          SizedBox(width: 8),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          // Pull to refresh mock
          await Future.delayed(Duration(milliseconds: 800));
        },
        child: SingleChildScrollView(
          physics: AlwaysScrollableScrollPhysics(),
          padding: EdgeInsets.only(left: 16.0, right: 16.0, top: 16.0, bottom: 100.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Banner
              SlideUpFadeTransition(
                delay: Duration.zero,
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        PortalTheme.primaryBlue(context),
                        PortalTheme.accentBlue(context),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
                  ),
                  padding: EdgeInsets.all(20),
                  width: double.infinity,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Welcome Back, ${profile.personal.firstName}!",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      SizedBox(height: 6),
                      Text(
                        "Track your performance scorecards, attend lecture paths, submit project code assignments, and keep tabs on payments from one workspace.",
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.7),
                          fontSize: 12,
                          height: 1.4,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(height: 24),

              // KPI Metric Cards Grid
              SlideUpFadeTransition(
                delay: const Duration(milliseconds: 100),
                child: GridView(
                  shrinkWrap: true,
                  physics: NeverScrollableScrollPhysics(),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 1.15,
                  ),
                  children: [
                    MetricCard(
                      title: "Attendance Target",
                      value: "88%",
                      desc: "Threshold is 85%",
                      status: "Normal",
                      leftBorderColor: PortalTheme.successGreen(context),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => AttendanceScreen()),
                        );
                      },
                    ),
                    MetricCard(
                      title: "LMS Progress",
                      value: "${lms.courses.isEmpty ? 0 : lms.courses[0].progress}%",
                      desc: "React/Next course",
                      status: "Ahead",
                      leftBorderColor: PortalTheme.accentBlue(context),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => LMSScreen()),
                        );
                      },
                    ),
                    MetricCard(
                      title: "Pending Dues",
                      value: financials.fees.total == 0 ? "Free" : "₹${financials.fees.balance.toStringAsFixed(0)}",
                      desc: financials.fees.total == 0 ? "Free Scholarship" : "Due by June 30",
                      status: financials.fees.total == 0 ? "Cleared" : "Pending",
                      leftBorderColor: financials.fees.total == 0 ? PortalTheme.successGreen(context) : PortalTheme.warningAmber(context),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => FinancialsScreen()),
                        );
                      },
                    ),
                    MetricCard(
                      title: "Current KPI",
                      value: "${kpi.stats.averageScore.toStringAsFixed(1)}/100",
                      desc: "Updated weekly",
                      status: "Excellent",
                      leftBorderColor: Colors.indigoAccent,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => KPIScreen()),
                        );
                      },
                    ),
                  ],
                ),
              ),
              SizedBox(height: 28),

              // Timeline & Progress Circle (Internship Timeline)
              SlideUpFadeTransition(
                delay: const Duration(milliseconds: 200),
                child: Container(
                decoration: BoxDecoration(
                  color: PortalTheme.cardSurface(context),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: PortalTheme.borderLight(context)),
                ),
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "INTERNSHIP TIMELINE",
                      style: TextStyle(
                        color: PortalTheme.textMuted(context),
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.2,
                      ),
                    ),
                    SizedBox(height: 16),
                    Row(
                      children: [
                        ProgressCircle(
                          progress: 0.50,
                          centerHeader: "Week 6",
                          centerSub: "of 12 weeks",
                          strokeColor: PortalTheme.accentBlue(context),
                          size: 90,
                        ),
                        SizedBox(width: 24),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Timeline: 50% Complete",
                                style: TextStyle(
                                  color: PortalTheme.textColor(context),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                "Enrolled: May 05, 2026",
                                style: TextStyle(color: PortalTheme.textSecondary(context), fontSize: 11),
                              ),
                              SizedBox(height: 2),
                              Text(
                                "Graduation: July 28, 2026",
                                style: TextStyle(color: PortalTheme.textSecondary(context), fontSize: 11),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),),
              SizedBox(height: 28),

              // Today's Agenda list
              Text(
                "Today's Agenda",
                style: TextStyle(
                  color: PortalTheme.textColor(context),
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              ListView.builder(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                itemCount: agendaList.length,
                itemBuilder: (context, index) {
                  final item = agendaList[index];
                  return Padding(
                    padding: EdgeInsets.only(bottom: 8),
                    child: AgendaTile(
                      task: item["task"] as String,
                      time: item["time"] as String,
                      completed: item["completed"] as bool,
                      onChanged: (val) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              "Agenda item marked as ${val == true ? 'completed' : 'pending'}",
                            ),
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
              SizedBox(height: 28),

              // Module Shortcut grid layout
              Text(
                "Portal Shortcuts",
                style: TextStyle(
                  color: PortalTheme.textColor(context),
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              SlideUpFadeTransition(
                delay: const Duration(milliseconds: 300),
                child: GridView(
                  shrinkWrap: true,
                  physics: NeverScrollableScrollPhysics(),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 10,
                    mainAxisSpacing: 10,
                    childAspectRatio: 1,
                  ),
                  children: [
                    _buildShortcutCard(context, Icons.video_library, "LMS", LMSScreen()),
                    _buildShortcutCard(context, Icons.assignment, "Tasks", TasksScreen()),
                    _buildShortcutCard(context, Icons.assignment_turned_in, "Assessments", AssessmentScreen()),
                    _buildShortcutCard(context, Icons.account_tree, "Capstone", CapstoneScreen()),
                    _buildShortcutCard(context, Icons.calendar_month, "Attendance", AttendanceScreen()),
                    _buildShortcutCard(context, Icons.workspace_premium, "Certificates", DocumentsScreen()),
                    _buildShortcutCard(context, Icons.credit_card, "Financials", FinancialsScreen()),
                    _buildShortcutCard(context, Icons.bar_chart, "KPI Score", KPIScreen()),
                    _buildShortcutCard(context, Icons.chat, "Chat Guide", ChatScreen()),
                  ],
                ),
              ),
              SizedBox(height: 28),

              // Announcements
              Text(
                "Announcements",
                style: TextStyle(
                  color: PortalTheme.textColor(context),
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              SlideUpFadeTransition(
                delay: const Duration(milliseconds: 400),
                child: ListView.builder(
                  shrinkWrap: true,
                  physics: NeverScrollableScrollPhysics(),
                  itemCount: announcements.length,
                  itemBuilder: (context, index) {
                    final ann = announcements[index];
                    return Padding(
                      padding: EdgeInsets.only(bottom: 12),
                      child: AnnouncementCard(
                        date: ann["date"]!,
                        title: ann["title"]!,
                        content: ann["content"]!,
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildShortcutCard(BuildContext context, IconData icon, String label, Widget targetScreen) {
    return BouncingPressable(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => targetScreen),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: PortalTheme.cardSurface(context),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: PortalTheme.borderLight(context)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: PortalTheme.accentBlue(context), size: 24),
            SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                color: PortalTheme.textSecondary(context),
                fontSize: 10,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
