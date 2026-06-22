import 'package:flutter/material.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class HRDashboardScreen extends StatelessWidget {
  const HRDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: PortalTheme.backgroundSlate(context),
      appBar: AppBar(
        title: const Text('HR Dashboard'),
        backgroundColor: PortalTheme.cardSurface(context),
        elevation: 0,
        centerTitle: true,
        actions: [
          IconButton(
            icon: Icon(Icons.notifications_outlined, color: PortalTheme.primaryBlue(context)),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
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
                boxShadow: [
                  BoxShadow(
                    color: PortalTheme.primaryBlue(context).withValues(alpha: 0.3),
                    blurRadius: 16,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Good Morning, Admin!',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Here is the status of the organization today.',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.8),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: 1.1,
              children: [
                _buildMetricCard(context, Icons.people_rounded, 'Students', '124', PortalTheme.primaryBlue(context)),
                _buildMetricCard(context, Icons.school_rounded, 'Programs', '8', PortalTheme.successGreen(context)),
                _buildMetricCard(context, Icons.assessment_rounded, 'Audit Logs', '32', PortalTheme.warningAmber(context)),
                _buildMetricCard(context, Icons.work_rounded, 'Internships', '98', Colors.indigoAccent),
              ],
            ),
            const SizedBox(height: 24),
            Text(
              'Recent Activity',
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
              itemCount: 5,
              itemBuilder: (context, index) {
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
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: PortalTheme.primaryBlue(context).withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(
                          Icons.person_add_rounded,
                          color: PortalTheme.primaryBlue(context),
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'New student registered',
                              style: TextStyle(
                                color: PortalTheme.textColor(context),
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Today, ${(index + 1) * 2} hours ago',
                              style: TextStyle(
                                color: PortalTheme.textSecondary(context),
                                fontSize: 12,
                              ),
                            ),
                          ],
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

  Widget _buildMetricCard(BuildContext context, IconData icon, String title, String value, Color color) {
    return Container(
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
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: TextStyle(
              color: PortalTheme.textSecondary(context),
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              color: PortalTheme.textColor(context),
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}