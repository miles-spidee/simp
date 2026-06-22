import 'package:flutter/material.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';
import 'package:pinesphere_erp/student_portal/screens/assessment_screen.dart';
import 'package:pinesphere_erp/student_portal/screens/documents_screen.dart';

class StudentMoreScreen extends StatelessWidget {
  const StudentMoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: PortalTheme.backgroundSlate(context),
      appBar: AppBar(
        title: const Text('More Options'),
        backgroundColor: PortalTheme.cardSurface(context),
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionHeader(context, 'ACADEMICS'),
            _buildMenuCard(
              context,
              children: [
                _buildMenuTile(
                  context,
                  icon: Icons.assignment_turned_in_rounded,
                  title: 'Assessments',
                  subtitle: 'View upcoming tests and scores',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const AssessmentScreen()),
                    );
                  },
                ),
                _buildDivider(context),
                _buildMenuTile(
                  context,
                  icon: Icons.workspace_premium_rounded,
                  title: 'Certificates & Documents',
                  subtitle: 'Download course certificates',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const DocumentsScreen()),
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 24),
            _buildSectionHeader(context, 'PREFERENCES'),
            _buildMenuCard(
              context,
              children: [
                _buildMenuTile(
                  context,
                  icon: Icons.notifications_active_rounded,
                  title: 'Notifications',
                  subtitle: 'Manage alert preferences',
                  onTap: () {},
                ),
                _buildDivider(context),
                _buildMenuTile(
                  context,
                  icon: Icons.settings_rounded,
                  title: 'Settings',
                  subtitle: 'App configuration and privacy',
                  onTap: () {},
                ),
              ],
            ),
            const SizedBox(height: 24),
            _buildMenuCard(
              context,
              children: [
                _buildMenuTile(
                  context,
                  icon: Icons.logout_rounded,
                  title: 'Sign Out',
                  titleColor: PortalTheme.errorRed(context),
                  iconColor: PortalTheme.errorRed(context),
                  showArrow: false,
                  onTap: () {},
                ),
              ],
            ),
            const SizedBox(height: 100), // padding for bottom nav
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 8, bottom: 12),
      child: Text(
        title,
        style: TextStyle(
          color: PortalTheme.textMuted(context),
          fontSize: 11,
          fontWeight: FontWeight.w800,
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _buildMenuCard(BuildContext context, {required List<Widget> children}) {
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
        children: children,
      ),
    );
  }

  Widget _buildDivider(BuildContext context) {
    return Divider(
      height: 1,
      thickness: 1,
      color: PortalTheme.borderLight(context),
      indent: 56,
    );
  }

  Widget _buildMenuTile(
    BuildContext context, {
    required IconData icon,
    required String title,
    String? subtitle,
    Color? titleColor,
    Color? iconColor,
    bool showArrow = true,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: (iconColor ?? PortalTheme.primaryBlue(context)).withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: iconColor ?? PortalTheme.primaryBlue(context),
                size: 20,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      color: titleColor ?? PortalTheme.textColor(context),
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: TextStyle(
                        color: PortalTheme.textSecondary(context),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            if (showArrow)
              Icon(
                Icons.chevron_right_rounded,
                color: PortalTheme.textMuted(context),
                size: 20,
              ),
          ],
        ),
      ),
    );
  }
}
