import 'package:flutter/material.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class HRProfileScreen extends StatelessWidget {
  const HRProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: PortalTheme.backgroundSlate(context),
      appBar: AppBar(
        title: const Text('My Profile'),
        backgroundColor: PortalTheme.cardSurface(context),
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            Center(
              child: Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: PortalTheme.primaryBlue(context).withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                  border: Border.all(color: PortalTheme.primaryBlue(context), width: 2),
                ),
                child: Center(
                  child: Text(
                    "HR",
                    style: TextStyle(
                      color: PortalTheme.primaryBlue(context),
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              "Administrator",
              style: TextStyle(
                color: PortalTheme.textColor(context),
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              "hr@pinesphere.com",
              style: TextStyle(
                color: PortalTheme.textSecondary(context),
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 32),
            _buildProfileCard(
              context,
              children: [
                _buildProfileTile(context, Icons.person, "Personal Information"),
                const Divider(height: 1),
                _buildProfileTile(context, Icons.security, "Security Settings"),
                const Divider(height: 1),
                _buildProfileTile(context, Icons.notifications, "Notification Preferences"),
              ],
            ),
            const SizedBox(height: 24),
            _buildProfileCard(
              context,
              children: [
                _buildProfileTile(
                  context,
                  Icons.logout,
                  "Sign Out",
                  color: PortalTheme.errorRed(context),
                  showArrow: false,
                ),
              ],
            ),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileCard(BuildContext context, {required List<Widget> children}) {
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

  Widget _buildProfileTile(BuildContext context, IconData icon, String title, {Color? color, bool showArrow = true}) {
    return ListTile(
      leading: Icon(icon, color: color ?? PortalTheme.primaryBlue(context)),
      title: Text(
        title,
        style: TextStyle(
          color: color ?? PortalTheme.textColor(context),
          fontWeight: FontWeight.w600,
        ),
      ),
      trailing: showArrow ? Icon(Icons.chevron_right, color: PortalTheme.textMuted(context)) : null,
      onTap: () {},
    );
  }
}
