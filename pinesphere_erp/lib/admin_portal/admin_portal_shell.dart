import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/features/auth/providers/auth_provider.dart';

/// Admin Portal Shell — Drawer-based navigation for the admin/super-admin role.
///
/// Uses a Drawer instead of bottom nav because admin has many modules.
/// Mirrors the Sidebar layout from frontend components/admin/Sidebar.tsx.
class AdminPortalShell extends ConsumerStatefulWidget {
  final StatefulNavigationShell navigationShell;
  const AdminPortalShell({super.key, required this.navigationShell});

  @override
  ConsumerState<AdminPortalShell> createState() => _AdminPortalShellState();
}

class _AdminPortalShellState extends ConsumerState<AdminPortalShell> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  void _goBranch(int index) {
    widget.navigationShell.goBranch(
      index,
      initialLocation: index == widget.navigationShell.currentIndex,
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentUser = ref.watch(currentUserProvider);

    return Scaffold(
      key: _scaffoldKey,
      drawer: _buildDrawer(context, currentUser),
      body: widget.navigationShell,
    );
  }

  Widget _buildDrawer(BuildContext context, user) {
    final currentIndex = widget.navigationShell.currentIndex;

    return Drawer(
      backgroundColor: const Color(0xFF0F172A), // slate-900
      child: SafeArea(
        child: Column(
          children: [
            // ── Brand header ──────────────────────────────────────────
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
                    errorBuilder: (_, __, ___) => const Icon(
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

            // ── User info ─────────────────────────────────────────────
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
                          user?.role ?? 'Administrator',
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

            // ── Nav items ─────────────────────────────────────────────
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
                ],
              ),
            ),

            const Divider(color: Color(0xFF1E293B), thickness: 1),

            // ── Logout ────────────────────────────────────────────────
            ListTile(
              leading: const Icon(Icons.logout_rounded,
                  color: Color(0xFFEF4444), size: 20),
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

// ── Drawer Section Label ──────────────────────────────────────────────────────

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

// ── Drawer Item ───────────────────────────────────────────────────────────────

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
      child: ListTile(
        onTap: onTap,
        selected: isSelected,
        selectedTileColor:
            AppColors.primaryBlue.withValues(alpha: 0.15),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        leading: Icon(
          icon,
          color: isSelected
              ? AppColors.primaryBlue
              : const Color(0xFF94A3B8),
          size: 20,
        ),
        title: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : const Color(0xFF94A3B8),
            fontSize: 14,
            fontWeight:
                isSelected ? FontWeight.w700 : FontWeight.w500,
          ),
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 0),
        minLeadingWidth: 24,
        dense: true,
        visualDensity: VisualDensity.compact,
      ),
    );
  }
}
