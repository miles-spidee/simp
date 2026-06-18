import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/providers/kpi_provider.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';
import 'package:pinesphere_erp/student_portal/widgets/custom_line_chart.dart';
import 'package:pinesphere_erp/student_portal/widgets/kpi_card.dart';

class KPIScreen extends ConsumerWidget {
  KPIScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(kpiProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text("Performance Metrics (KPI)"),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // KPI Summary metrics row
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
                          "AVERAGE KPI SCORE",
                          style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 8),
                        Text(
                          state.stats.averageScore.toStringAsFixed(1),
                          style: TextStyle(color: PortalTheme.textColor(context), fontSize: 32, fontWeight: FontWeight.w900),
                        ),
                        SizedBox(height: 4),
                        Text(
                          "Excellent Standing",
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
                      border: Border.all(color: Colors.white.withOpacity(0.05)),
                    ),
                    padding: EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "CONSISTENCY INDEX",
                          style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 8),
                        Text(
                          "${state.consistencyIndex.toStringAsFixed(1)}%",
                          style: TextStyle(color: PortalTheme.textColor(context), fontSize: 32, fontWeight: FontWeight.w900),
                        ),
                        SizedBox(height: 4),
                        Text(
                          "+${state.growthVelocity.toStringAsFixed(1)}% Growth velocity",
                          style: TextStyle(color: PortalTheme.accentBlue(context), fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 28),

            Text(
              "Weekly Performance Trends",
              style: TextStyle(color: PortalTheme.textColor(context), fontSize: 15, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 12),

            // Custom Painted Line Chart Graph
            CustomLineChart(
              values: state.weeklyTrend,
              xAxisLabels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
              height: 220,
            ),
            SizedBox(height: 28),

            Text(
              "Multi-Dimensional Scorecard",
              style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 12),

            // Scorecard Grid
            GridView(
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 2.2,
              ),
              children: [
                KpiCard(title: "Technical Skill", score: state.stats.technical, icon: Icons.computer, color: PortalTheme.accentBlue(context)),
                KpiCard(title: "Delivery Sync", score: state.stats.delivery, icon: Icons.playlist_add_check, color: PortalTheme.successGreen(context)),
                KpiCard(title: "Communication", score: state.stats.communication, icon: Icons.forum, color: PortalTheme.warningAmber(context)),
                KpiCard(title: "ERP Attendance", score: state.stats.attendance, icon: Icons.today, color: Colors.indigoAccent),
                KpiCard(title: "Collaboration", score: state.stats.collaboration, icon: Icons.groups, color: Colors.purpleAccent),
              ],
            ),
            SizedBox(height: 28),

            // Strengths and Growth Areas
            Container(
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
                    "Qualitative Review",
                    style: TextStyle(color: PortalTheme.textColor(context), fontSize: 14, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 16),
                  Text(
                    "KEY STRENGTHS",
                    style: TextStyle(color: PortalTheme.successGreen(context), fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                  ),
                  SizedBox(height: 8),
                  ...state.strengths.map((str) => Padding(
                        padding: EdgeInsets.only(bottom: 6),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(Icons.check_circle_outline, color: PortalTheme.successGreen(context), size: 14),
                            SizedBox(width: 8),
                            Expanded(child: Text(str, style: TextStyle(color: PortalTheme.textSecondary(context), fontSize: 11, height: 1.4))),
                          ],
                        ),
                      )),
                  SizedBox(height: 16),
                  Text(
                    "GROWTH DEVELOPMENT AREAS",
                    style: TextStyle(color: PortalTheme.warningAmber(context), fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                  ),
                  SizedBox(height: 8),
                  ...state.growthAreas.map((gr) => Padding(
                        padding: EdgeInsets.only(bottom: 6),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(Icons.arrow_circle_up, color: PortalTheme.warningAmber(context), size: 14),
                            SizedBox(width: 8),
                            Expanded(child: Text(gr, style: TextStyle(color: PortalTheme.textSecondary(context), fontSize: 11, height: 1.4))),
                          ],
                        ),
                      )),
                ],
              ),
            ),
            SizedBox(height: 28),

            Text(
              "Mentor Review Evaluation Logs",
              style: TextStyle(color: PortalTheme.textColor(context), fontSize: 15, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 12),

            // Evaluations Lists
            ListView.builder(
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              itemCount: state.feedbackLogs.length,
              itemBuilder: (context, idx) {
                final log = state.feedbackLogs[idx];
                return Padding(
                  padding: EdgeInsets.only(bottom: 12),
                  child: Container(
                    decoration: BoxDecoration(
                      color: PortalTheme.cardSurface(context),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: PortalTheme.borderLight(context)),
                    ),
                    padding: EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              log.evaluator,
                              style: TextStyle(color: PortalTheme.textColor(context), fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                            Text(
                              "Rating: ${log.overallRating}/10",
                              style: TextStyle(color: PortalTheme.accentBlue(context), fontWeight: FontWeight.bold, fontSize: 12),
                            ),
                          ],
                        ),
                        SizedBox(height: 4),
                        Text(
                          log.date,
                          style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 10),
                        ),
                        SizedBox(height: 12),
                        Divider(color: PortalTheme.divider(context)),
                        SizedBox(height: 8),
                        Text(
                          log.comments,
                          style: TextStyle(color: PortalTheme.textSecondary(context), fontSize: 12, height: 1.5),
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
