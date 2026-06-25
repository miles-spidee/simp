import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pinesphere_erp/features/auth/providers/auth_provider.dart';
import 'package:pinesphere_erp/features/auth/screens/login_screen.dart';
import 'package:pinesphere_erp/features/auth/screens/splash_screen.dart';

// ── Student Portal ────────────────────────────────────────────────────────────
import 'package:pinesphere_erp/student_portal/student_portal_shell.dart';
import 'package:pinesphere_erp/student_portal/screens/student_dashboard_screen.dart';
import 'package:pinesphere_erp/student_portal/screens/attendance_screen.dart'
    as student_attendance;
import 'package:pinesphere_erp/student_portal/screens/tasks_screen.dart'
    as student_tasks;
import 'package:pinesphere_erp/student_portal/screens/profile_screen.dart'
    as student_profile;
import 'package:pinesphere_erp/student_portal/screens/student_more_screen.dart';

// ── HR Portal ─────────────────────────────────────────────────────────────────
import 'package:pinesphere_erp/hr_portal/hr_portal_shell.dart';
import 'package:pinesphere_erp/hr_portal/screens/hr_dashboard_screen.dart';
import 'package:pinesphere_erp/hr_portal/screens/hr_students_screen.dart';
import 'package:pinesphere_erp/hr_portal/screens/hr_programs_screen.dart';
import 'package:pinesphere_erp/hr_portal/screens/hr_audit_screen.dart';
import 'package:pinesphere_erp/hr_portal/screens/hr_profile_screen.dart';

// ── Admin Portal ──────────────────────────────────────────────────────────────
import 'package:pinesphere_erp/admin_portal/admin_portal_shell.dart';
import 'package:pinesphere_erp/admin_portal/screens/admin_dashboard_screen.dart';
import 'package:pinesphere_erp/admin_portal/screens/admin_students_screen.dart';
import 'package:pinesphere_erp/admin_portal/screens/admin_employees_screen.dart';
import 'package:pinesphere_erp/admin_portal/screens/admin_users_screen.dart';
import 'package:pinesphere_erp/admin_portal/screens/admin_programs_screen.dart';
import 'package:pinesphere_erp/admin_portal/screens/admin_roles_screen.dart';

class AppRoutes {
  // ── Named path constants ──────────────────────────────────────────────────

  static const String splash = '/';
  static const String login = '/login';

  static const String studentDashboard = '/student';
  static const String hrDashboard = '/hr';
  static const String adminDashboard = '/admin';

  // Legacy constants — kept for backward compat with feature/dashboard screens
  static const String notifications = '/dashboard/notifications';
  static const String attendance = '/dashboard/attendance';
  static const String tasks = '/dashboard/tasks';
  static const String assessments = '/dashboard/assessments';
  static const String certificates = '/dashboard/certificates';
  static const String placement = '/dashboard/placement';
  static const String settings = '/dashboard/settings';
  static const String profile = '/dashboard/profile';

  // ── Router factory ────────────────────────────────────────────────────────

  static GoRouter createRouter(ProviderContainer container) {
    return GoRouter(
      initialLocation: splash,
      // ── Global auth redirect guard ─────────────────────────────────────
      redirect: (context, state) {
        final authState = container.read(authProvider);
        final location = state.matchedLocation;

        final publicRoutes = [splash, login];
        final isPublic = publicRoutes.contains(location);

        // While auth is being determined, stay on splash
        if (authState.status == AuthStatus.initial ||
            authState.status == AuthStatus.loading) {
          return isPublic ? null : splash;
        }

        // Not authenticated → login page
        if (authState.status == AuthStatus.unauthenticated ||
            authState.status == AuthStatus.error) {
          return isPublic ? null : login;
        }

        // Authenticated on public routes → redirect to portal
        if (authState.isAuthenticated && isPublic) {
          return authState.targetRoute ?? hrDashboard;
        }

        return null; // No redirect needed
      },
      routes: [
        // ── Public routes ──────────────────────────────────────────────
        GoRoute(
          path: splash,
          builder: (context, state) => const SplashScreen(),
        ),
        GoRoute(
          path: login,
          builder: (context, state) => const LoginScreen(),
        ),

        // ── Student Portal ─────────────────────────────────────────────
        StatefulShellRoute.indexedStack(
          builder: (context, state, navigationShell) {
            return StudentPortalShell(navigationShell: navigationShell);
          },
          branches: [
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: studentDashboard,
                  builder: (context, state) =>
                      const StudentDashboardScreen(),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/student/attendance',
                  builder: (context, state) =>
                      const student_attendance.AttendanceScreen(),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/student/tasks',
                  builder: (context, state) =>
                      const student_tasks.TasksScreen(),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/student/profile',
                  builder: (context, state) =>
                      const student_profile.ProfileScreen(),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/student/more',
                  builder: (context, state) =>
                      const StudentMoreScreen(),
                ),
              ],
            ),
          ],
        ),

        // ── HR Portal ──────────────────────────────────────────────────
        StatefulShellRoute.indexedStack(
          builder: (context, state, navigationShell) {
            return HRPortalShell(navigationShell: navigationShell);
          },
          branches: [
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: hrDashboard,
                  builder: (context, state) =>
                      const HRDashboardScreen(),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/hr/students',
                  builder: (context, state) =>
                      const HRStudentsScreen(),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/hr/programs',
                  builder: (context, state) =>
                      const HRProgramsScreen(),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/hr/audit',
                  builder: (context, state) => const HRAuditScreen(),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/hr/profile',
                  builder: (context, state) =>
                      const HRProfileScreen(),
                ),
              ],
            ),
          ],
        ),

        // ── Admin Portal ───────────────────────────────────────────────
        StatefulShellRoute.indexedStack(
          builder: (context, state, navigationShell) {
            return AdminPortalShell(navigationShell: navigationShell);
          },
          branches: [
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: adminDashboard,
                  builder: (context, state) =>
                      const AdminDashboardScreen(),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/admin/students',
                  builder: (context, state) =>
                      const AdminStudentsScreen(),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/admin/employees',
                  builder: (context, state) =>
                      const AdminEmployeesScreen(),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/admin/users',
                  builder: (context, state) =>
                      const AdminUsersScreen(),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/admin/programs',
                  builder: (context, state) =>
                      const AdminProgramsScreen(),
                ),
              ],
            ),
            StatefulShellBranch(
              routes: [
                GoRoute(
                  path: '/admin/roles',
                  builder: (context, state) =>
                      const AdminRolesScreen(),
                ),
              ],
            ),
          ],
        ),
      ],
    );
  }
}
