import 'package:flutter/material.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class HRProgramsScreen extends StatelessWidget {
  const HRProgramsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final mockPrograms = [
      {"name": "Full Stack Dev", "students": 45, "status": "Active", "progress": 0.6},
      {"name": "UI/UX Design", "students": 32, "status": "Active", "progress": 0.4},
      {"name": "Data Science", "students": 28, "status": "Starting Soon", "progress": 0.0},
      {"name": "Cloud Architect", "students": 19, "status": "Closing", "progress": 0.9},
    ];

    return Scaffold(
      backgroundColor: PortalTheme.backgroundSlate(context),
      appBar: AppBar(
        title: const Text('Programs'),
        backgroundColor: PortalTheme.cardSurface(context),
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Active Curriculums",
                  style: TextStyle(
                    color: PortalTheme.textColor(context),
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.add, size: 16),
                  label: const Text("New Program"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: PortalTheme.primaryBlue(context),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: mockPrograms.length,
              itemBuilder: (context, index) {
                final program = mockPrograms[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: PortalTheme.cardSurface(context),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: PortalTheme.borderLight(context)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.02),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            program["name"] as String,
                            style: TextStyle(
                              color: PortalTheme.textColor(context),
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: PortalTheme.accentBlue(context).withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              program["status"] as String,
                              style: TextStyle(
                                color: PortalTheme.accentBlue(context),
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        "${program["students"]} Students Enrolled",
                        style: TextStyle(
                          color: PortalTheme.textSecondary(context),
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 16),
                      LinearProgressIndicator(
                        value: program["progress"] as double,
                        backgroundColor: PortalTheme.borderLight(context),
                        valueColor: AlwaysStoppedAnimation<Color>(PortalTheme.primaryBlue(context)),
                        borderRadius: BorderRadius.circular(4),
                        minHeight: 6,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        "Curriculum Progress: ${(program["progress"] as double) * 100}%",
                        style: TextStyle(
                          color: PortalTheme.textMuted(context),
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
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
