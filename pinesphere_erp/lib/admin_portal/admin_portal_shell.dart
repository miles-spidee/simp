import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/features/auth/providers/auth_provider.dart';
import 'package:pinesphere_erp/shared/services/admin_service.dart';
import 'dart:ui';

/// Admin Portal Shell — Bottom navigation bar + Side Drawer navigation.
///
/// Provides top-class mobile UX with a blur glassmorphism bottom navigation bar
/// for the primary administrative screens, and a side drawer for secondary modules.
class AdminPortalShell extends ConsumerStatefulWidget {
  final StatefulNavigationShell navigationShell;
  const AdminPortalShell({super.key, required this.navigationShell});

  @override
  ConsumerState<AdminPortalShell> createState() => _AdminPortalShellState();
}

class _AdminPortalShellState extends ConsumerState<AdminPortalShell> {
  void _goBranch(int index) {
    widget.navigationShell.goBranch(
      index,
      initialLocation: index == widget.navigationShell.currentIndex,
    );
  }

  int _getBottomNavIndex(int branchIndex) {
    if (branchIndex == 0) return 0; // Dashboard
    if (branchIndex == 10) return 1; // Organizations (Colleges)
    if (branchIndex == 1) return 2; // Students
    if (branchIndex == 4) return 3; // Programs
    return 4; // More
  }

  void _handleBottomTap(int bottomIndex, GlobalKey<ScaffoldState> scaffoldKey) {
    if (bottomIndex == 0) {
      _goBranch(0);
    } else if (bottomIndex == 1) {
      _goBranch(10);
    } else if (bottomIndex == 2) {
      _goBranch(1);
    } else if (bottomIndex == 3) {
      _goBranch(4);
    } else if (bottomIndex == 4) {
      // Toggle side drawer
      if (scaffoldKey.currentState?.isDrawerOpen == true) {
        scaffoldKey.currentState?.closeDrawer();
      } else {
        scaffoldKey.currentState?.openDrawer();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentUser = ref.watch(currentUserProvider);
    final scaffoldKey = ref.watch(adminScaffoldKeyProvider);
    final branchIndex = widget.navigationShell.currentIndex;
    final bottomIndex = _getBottomNavIndex(branchIndex);

    return Scaffold(
      key: scaffoldKey,
      extendBody: true,
      drawer: _buildDrawer(context, currentUser),
      body: widget.navigationShell,
      bottomNavigationBar: SafeArea(
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(32),
            boxShadow: [
              BoxShadow(
                color: AppColors.primaryBlue.withValues(alpha: 0.15),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(32),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
              child: Container(
                height: 68,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.85),
                  borderRadius: BorderRadius.circular(32),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.2),
                    width: 1.5,
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _NavBarItem(
                      icon: Icons.dashboard_rounded,
                      label: 'Home',
                      isSelected: bottomIndex == 0,
                      onTap: () => _handleBottomTap(0, scaffoldKey),
                    ),
                    _NavBarItem(
                      icon: Icons.business_rounded,
                      label: 'Colleges',
                      isSelected: bottomIndex == 1,
                      onTap: () => _handleBottomTap(1, scaffoldKey),
                    ),
                    _NavBarItem(
                      icon: Icons.people_rounded,
                      label: 'Students',
                      isSelected: bottomIndex == 2,
                      onTap: () => _handleBottomTap(2, scaffoldKey),
                    ),
                    _NavBarItem(
                      icon: Icons.school_rounded,
                      label: 'Programs',
                      isSelected: bottomIndex == 3,
                      onTap: () => _handleBottomTap(3, scaffoldKey),
                    ),
                    _NavBarItem(
                      icon: Icons.menu_open_rounded,
                      label: 'More',
                      isSelected: bottomIndex == 4,
                      onTap: () => _handleBottomTap(4, scaffoldKey),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDrawer(BuildContext context, user) {
    final currentIndex = widget.navigationShell.currentIndex;

    return Drawer(
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.horizontal(right: Radius.circular(28)),
      ),
      backgroundColor: const Color(0xFF0F172A), // slate-900
      child: SafeArea(
        child: Column(
          children: [
            // Brand header
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
              child: Row(
                children: [
                  Image.asset(
                    'assets/images/image.png',
                    height: 32,
                    fit: BoxFit.contain,
                    color: Colors.white,
                    colorBlendMode: BlendMode.srcIn,
                    errorBuilder: (_, _, _) => const Icon(
                      Icons.business_rounded,
                      color: Colors.white,
                      size: 32,
                    ),
                  ),
                  const SizedBox(width: 10),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Pinesphere',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                      Text(
                        'Admin Console',
                        style: TextStyle(
                          color: Color(0xFF94A3B8),
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const Divider(color: Color(0xFF1E293B), thickness: 1),

            // User info
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [AppColors.primaryBlue, Color(0xFF6366F1)],
                      ),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      (user?.displayName?.isNotEmpty == true
                              ? user!.displayName[0]
                              : 'A')
                          .toUpperCase(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user?.displayName ?? 'Admin',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                            fontSize: 13,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          user?.role ?? 'ROLE_SUPER_ADMIN',
                          style: const TextStyle(
                            color: Color(0xFF94A3B8),
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const Divider(color: Color(0xFF1E293B), thickness: 1),

            // Nav items
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(vertical: 8),
                children: [
                  _DrawerSection(label: 'OVERVIEW'),
                  _DrawerItem(
                    icon: Icons.dashboard_rounded,
                    label: 'Dashboard',
                    isSelected: currentIndex == 0,
                    onTap: () {
                      _goBranch(0);
                      Navigator.pop(context);
                    },
                  ),
                  _DrawerSection(label: 'PEOPLE'),
                  _DrawerItem(
                    icon: Icons.school_rounded,
                    label: 'Students',
                    isSelected: currentIndex == 1,
                    onTap: () {
                      _goBranch(1);
                      Navigator.pop(context);
                    },
                  ),
                  _DrawerItem(
                    icon: Icons.badge_rounded,
                    label: 'Employees',
                    isSelected: currentIndex == 2,
                    onTap: () {
                      _goBranch(2);
                      Navigator.pop(context);
                    },
                  ),
                  _DrawerItem(
                    icon: Icons.manage_accounts_rounded,
                    label: 'Users',
                    isSelected: currentIndex == 3,
                    onTap: () {
                      _goBranch(3);
                      Navigator.pop(context);
                    },
                  ),
                  _DrawerSection(label: 'PROGRAMS'),
                  _DrawerItem(
                    icon: Icons.work_outline_rounded,
                    label: 'Programs',
                    isSelected: currentIndex == 4,
                    onTap: () {
                      _goBranch(4);
                      Navigator.pop(context);
                    },
                  ),
                  _DrawerSection(label: 'ACCESS CONTROL'),
                  _DrawerItem(
                    icon: Icons.shield_rounded,
                    label: 'Roles',
                    isSelected: currentIndex == 5,
                    onTap: () {
                      _goBranch(5);
                      Navigator.pop(context);
                    },
                  ),
                  _DrawerSection(label: 'MENTOR MODULE'),
                  _DrawerItem(
                    icon: Icons.analytics_outlined,
                    label: 'Mentor Dashboard',
                    isSelected: currentIndex == 6,
                    onTap: () {
                      _goBranch(6);
                      Navigator.pop(context);
                    },
                  ),
                  _DrawerItem(
                    icon: Icons.people_outline_rounded,
                    label: 'Mentor Profiles',
                    isSelected: currentIndex == 7,
                    onTap: () {
                      _goBranch(7);
                      Navigator.pop(context);
                    },
                  ),
                  _DrawerItem(
                    icon: Icons.assignment_ind_outlined,
                    label: 'Student Assignments',
                    isSelected: currentIndex == 8,
                    onTap: () {
                      _goBranch(8);
                      Navigator.pop(context);
                    },
                  ),
                  _DrawerItem(
                    icon: Icons.grid_view_rounded,
                    label: 'Batch Mappings',
                    isSelected: currentIndex == 9,
                    onTap: () {
                      _goBranch(9);
                      Navigator.pop(context);
                    },
                  ),
                  _DrawerSection(label: 'ORGANIZATION'),
                  _DrawerItem(
                    icon: Icons.business_rounded,
                    label: 'Organizations',
                    isSelected: currentIndex == 10,
                    onTap: () {
                      _goBranch(10);
                      Navigator.pop(context);
                    },
                  ),
                  _DrawerSection(label: 'SECURITY & LOGS'),
                  _DrawerItem(
                    icon: Icons.vpn_key_rounded,
                    label: 'Permissions Matrix',
                    isSelected: currentIndex == 11,
                    onTap: () {
                      _goBranch(11);
                      Navigator.pop(context);
                    },
                  ),
                  _DrawerItem(
                    icon: Icons.receipt_long_rounded,
                    label: 'Audit Logs',
                    isSelected: currentIndex == 12,
                    onTap: () {
                      _goBranch(12);
                      Navigator.pop(context);
                    },
                  ),
                  _DrawerItem(
                    icon: Icons.settings_rounded,
                    label: 'System Settings',
                    isSelected: currentIndex == 13,
                    onTap: () {
                      _goBranch(13);
                      Navigator.pop(context);
                    },
                  ),
                ],
              ),
            ),

            const Divider(color: Color(0xFF1E293B), thickness: 1),

            // Logout
            ListTile(
              leading: const Icon(
                Icons.logout_rounded,
                color: Color(0xFFEF4444),
                size: 20,
              ),
              title: const Text(
                'Sign Out',
                style: TextStyle(
                  color: Color(0xFFEF4444),
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
              onTap: () async {
                Navigator.pop(context);
                await ref.read(authProvider.notifier).logout();
                if (context.mounted) context.go('/login');
              },
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}

class _DrawerSection extends StatelessWidget {
  final String label;
  const _DrawerSection({required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 4),
      child: Text(
        label,
        style: const TextStyle(
          color: Color(0xFF475569),
          fontSize: 10,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.2,
        ),
      ),
    );
  }
}

class _DrawerItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _DrawerItem({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeOutCubic,
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primaryBlue.withValues(alpha: 0.16)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected
                ? AppColors.primaryBlue.withValues(alpha: 0.24)
                : Colors.transparent,
          ),
        ),
        child: ListTile(
          onTap: onTap,
          selected: isSelected,
          selectedTileColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          leading: AnimatedScale(
            scale: isSelected ? 1.08 : 1,
            duration: const Duration(milliseconds: 200),
            curve: Curves.easeOutBack,
            child: Icon(
              icon,
              color: isSelected
                  ? const Color(0xFF60A5FA)
                  : const Color(0xFF94A3B8),
              size: 20,
            ),
          ),
          title: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.white : const Color(0xFF94A3B8),
              fontSize: 14,
              fontWeight: isSelected ? FontWeight.w800 : FontWeight.w500,
            ),
          ),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 12,
            vertical: 1,
          ),
          minLeadingWidth: 24,
          dense: true,
          visualDensity: VisualDensity.compact,
        ),
      ),
    );
  }
}

class _NavBarItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _NavBarItem({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = isSelected ? AppColors.primaryBlue : AppColors.slate400;

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 240),
        curve: Curves.easeOutCubic,
        width: isSelected ? 86 : 54,
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primaryBlue.withValues(alpha: 0.1)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(24),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedScale(
              scale: isSelected ? 1.05 : 1,
              duration: const Duration(milliseconds: 220),
              curve: Curves.easeOutBack,
              child: Icon(icon, color: color, size: 23),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: color,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
