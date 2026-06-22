import 'package:flutter/material.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class HRStudentsScreen extends StatelessWidget {
  const HRStudentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final mockStudents = [
      {"name": "Anish Kumar", "id": "STU2026-001", "course": "Full Stack Dev", "status": "Active", "score": 92},
      {"name": "Sarah Jenkins", "id": "STU2026-002", "course": "UI/UX Design", "status": "Active", "score": 88},
      {"name": "Michael Chen", "id": "STU2026-003", "course": "Data Science", "status": "On Leave", "score": 75},
      {"name": "Priya Patel", "id": "STU2026-004", "course": "Cloud Architect", "status": "Active", "score": 95},
      {"name": "David Wilson", "id": "STU2026-005", "course": "Full Stack Dev", "status": "Warning", "score": 62},
    ];

    return Scaffold(
      backgroundColor: PortalTheme.backgroundSlate(context),
      appBar: AppBar(
        title: const Text('Student Directory'),
        backgroundColor: PortalTheme.cardSurface(context),
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: PortalTheme.cardSurface(context),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: PortalTheme.borderLight(context)),
              ),
              child: const TextField(
                decoration: InputDecoration(
                  icon: Icon(Icons.search),
                  hintText: 'Search students by name or ID...',
                  border: InputBorder.none,
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              "All Students",
              style: TextStyle(
                color: PortalTheme.textColor(context),
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: mockStudents.length,
              itemBuilder: (context, index) {
                final student = mockStudents[index];
                final statusColor = student["status"] == "Active"
                    ? PortalTheme.successGreen(context)
                    : student["status"] == "Warning"
                        ? PortalTheme.errorRed(context)
                        : PortalTheme.warningAmber(context);

                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: PortalTheme.cardSurface(context),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: PortalTheme.borderLight(context)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.02),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: PortalTheme.primaryBlue(context).withValues(alpha: 0.1),
                        child: Text(
                          (student["name"] as String).substring(0, 1),
                          style: TextStyle(
                            color: PortalTheme.primaryBlue(context),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              student["name"] as String,
                              style: TextStyle(
                                color: PortalTheme.textColor(context),
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                            Text(
                              "${student["id"]} • ${student["course"]}",
                              style: TextStyle(
                                color: PortalTheme.textSecondary(context),
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: statusColor.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              student["status"] as String,
                              style: TextStyle(
                                color: statusColor,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "KPI: ${student["score"]}%",
                            style: TextStyle(
                              color: PortalTheme.textMuted(context),
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }
}
