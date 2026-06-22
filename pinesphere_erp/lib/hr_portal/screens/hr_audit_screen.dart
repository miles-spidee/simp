import 'package:flutter/material.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class HRAuditScreen extends StatelessWidget {
  const HRAuditScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final mockLogs = [
      {"action": "System Update", "user": "System", "time": "10:23 AM", "status": "Success"},
      {"action": "Role Change", "user": "Admin HR", "time": "09:15 AM", "status": "Success"},
      {"action": "Data Export", "user": "Admin HR", "time": "Yesterday", "status": "Warning"},
      {"action": "Failed Login", "user": "Unknown", "time": "Yesterday", "status": "Error"},
    ];

    return Scaffold(
      backgroundColor: PortalTheme.backgroundSlate(context),
      appBar: AppBar(
        title: const Text('Audit Logs'),
        backgroundColor: PortalTheme.cardSurface(context),
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [PortalTheme.warningAmber(context), const Color(0xFFF59E0B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: PortalTheme.warningAmber(context).withValues(alpha: 0.3),
                    blurRadius: 16,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Row(
                children: [
                  const Icon(Icons.security, color: Colors.white, size: 40),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "System Security is Optimal",
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          "Last full system scan was 2 hours ago.",
                          style: TextStyle(color: Colors.white.withValues(alpha: 0.8), fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Text(
              "Recent Activity",
              style: TextStyle(
                color: PortalTheme.textColor(context),
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: mockLogs.length,
              itemBuilder: (context, index) {
                final log = mockLogs[index];
                final iconColor = log["status"] == "Success"
                    ? PortalTheme.successGreen(context)
                    : log["status"] == "Warning"
                        ? PortalTheme.warningAmber(context)
                        : PortalTheme.errorRed(context);

                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: PortalTheme.cardSurface(context),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: PortalTheme.borderLight(context)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: iconColor.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(Icons.history, color: iconColor, size: 20),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              log["action"] as String,
                              style: TextStyle(
                                color: PortalTheme.textColor(context),
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                            Text(
                              "By: ${log["user"]}",
                              style: TextStyle(
                                color: PortalTheme.textSecondary(context),
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Text(
                        log["time"] as String,
                        style: TextStyle(
                          color: PortalTheme.textMuted(context),
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
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
