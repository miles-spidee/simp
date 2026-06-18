import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/providers/attendance_provider.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class AttendanceScreen extends ConsumerWidget {
  AttendanceScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(attendanceProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text("Workstation Attendance"),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Checked In Banner
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    PortalTheme.primaryBlue(context).withOpacity(0.8),
                    PortalTheme.accentBlue(context).withOpacity(0.8),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              padding: EdgeInsets.all(20),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                color: PortalTheme.successGreen(context),
                                shape: BoxShape.circle,
                              ),
                            ),
                            SizedBox(width: 8),
                            Text(
                              "SYSTEM SYNCHRONIZED",
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 9,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 8),
                        Text(
                          "Active Workstation Session",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 6),
                        Text(
                          "Clocked in today at: ${state.clockInTime ?? '09:00 AM'}",
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.7),
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text("Active session is managed automatically by the workstation."),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white.withOpacity(0.15),
                      foregroundColor: Colors.white,
                      elevation: 0,
                    ),
                    child: Text("Auto Sync"),
                  ),
                ],
              ),
            ),
            SizedBox(height: 24),

            // Statistics row
            Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: PortalTheme.cardSurface(context),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: PortalTheme.borderLight(context)),
                    ),
                    padding: EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "CURRENT ATTENDANCE",
                          style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 8),
                        Text(
                          "88%",
                          style: TextStyle(color: PortalTheme.textColor(context), fontSize: 28, fontWeight: FontWeight.w900),
                        ),
                        SizedBox(height: 4),
                        Text(
                          "Min target is 85%",
                          style: TextStyle(color: PortalTheme.successGreen(context), fontSize: 10, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: PortalTheme.cardSurface(context),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: PortalTheme.borderLight(context)),
                    ),
                    padding: EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "ACCUMULATED HOURS",
                          style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 8),
                        Text(
                          "44h 50m",
                          style: TextStyle(color: PortalTheme.textColor(context), fontSize: 28, fontWeight: FontWeight.w900),
                        ),
                        SizedBox(height: 4),
                        Text(
                          "Across last 5 syncs",
                          style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 10),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 28),

            Text(
              "Attendance Logs",
              style: TextStyle(
                color: PortalTheme.textColor(context),
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 12),

            // Scrollable logs
            ListView.builder(
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              itemCount: state.logs.length,
              itemBuilder: (context, index) {
                final log = state.logs[index];
                final isCurrent = log.status == 'Checked In';

                return Padding(
                  padding: EdgeInsets.only(bottom: 10),
                  child: Container(
                    decoration: BoxDecoration(
                      color: PortalTheme.cardSurface(context),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isCurrent
                            ? PortalTheme.accentBlue(context).withOpacity(0.3)
                            : PortalTheme.borderLight(context),
                      ),
                    ),
                    padding: EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              log.date,
                              style: TextStyle(
                                color: PortalTheme.textColor(context),
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              "In: ${log.clockIn} | Out: ${log.clockOut}",
                              style: TextStyle(
                                color: PortalTheme.textSecondary(context),
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Container(
                              decoration: BoxDecoration(
                                color: isCurrent
                                    ? PortalTheme.accentBlue(context).withOpacity(0.1)
                                    : PortalTheme.successGreen(context).withOpacity(0.1),
                                border: Border.all(
                                  color: isCurrent
                                      ? PortalTheme.accentBlue(context)
                                      : PortalTheme.successGreen(context),
                                ),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              child: Text(
                                log.status,
                                style: TextStyle(
                                  color: isCurrent
                                      ? PortalTheme.accentBlue(context)
                                      : PortalTheme.successGreen(context),
                                  fontSize: 9,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            SizedBox(height: 6),
                            if (!isCurrent)
                              Text(
                                "Duration: ${log.duration}",
                                style: TextStyle(
                                  color: PortalTheme.textSecondary(context),
                                  fontSize: 10,
                                ),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
