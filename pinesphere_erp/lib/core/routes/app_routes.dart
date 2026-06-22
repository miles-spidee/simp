import 'package:go_router/go_router.dart';
import 'package:pinesphere_erp/features/auth/screens/login_screen.dart';
import 'package:pinesphere_erp/features/auth/screens/splash_screen.dart';

// Student Portal Screens
import 'package:pinesphere_erp/student_portal/student_portal_shell.dart';
import 'package:pinesphere_erp/student_portal/screens/student_dashboard_screen.dart';
import 'package:pinesphere_erp/student_portal/screens/attendance_screen.dart' as student_attendance;
import 'package:pinesphere_erp/student_portal/screens/tasks_screen.dart' as student_tasks;
import 'package:pinesphere_erp/student_portal/screens/profile_screen.dart' as student_profile;
import 'package:pinesphere_erp/student_portal/screens/student_more_screen.dart';

// HR Portal Screens
import 'package:pinesphere_erp/hr_portal/hr_portal_shell.dart';
import 'package:pinesphere_erp/hr_portal/screens/hr_dashboard_screen.dart';
import 'package:pinesphere_erp/hr_portal/screens/hr_students_screen.dart';
import 'package:pinesphere_erp/hr_portal/screens/hr_programs_screen.dart';
import 'package:pinesphere_erp/hr_portal/screens/hr_audit_screen.dart';
import 'package:pinesphere_erp/hr_portal/screens/hr_profile_screen.dart';

class AppRoutes {
  static const String splash = '/';
  static const String login = '/login';
  
  static const String studentDashboard = '/student';
  static const String hrDashboard = '/hr';

  // Legacy dashboard route constants
  static const String notifications = 'notifications';
  static const String attendance = 'attendance';
  static const String tasks = 'tasks';
  static const String assessments = 'assessments';
  static const String certificates = 'certificates';
  static const String placement = 'placement';
  static const String settings = 'settings';
  static const String profile = 'profile';

  static final router = GoRouter(
    initialLocation: splash,
    routes: [
      GoRoute(
        path: splash,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: login,
        builder: (context, state) => const LoginScreen(),
      ),
      
      // Student Portal
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return StudentPortalShell(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: studentDashboard,
                builder: (context, state) => const StudentDashboardScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/student/attendance',
                builder: (context, state) => const student_attendance.AttendanceScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/student/tasks',
                builder: (context, state) => const student_tasks.TasksScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/student/profile',
                builder: (context, state) => const student_profile.ProfileScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/student/more',
                builder: (context, state) => const StudentMoreScreen(),
              ),
            ],
          ),
        ],
      ),

      // HR Portal
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return HRPortalShell(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: hrDashboard,
                builder: (context, state) => const HRDashboardScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/hr/students',
                builder: (context, state) => const HRStudentsScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/hr/programs',
                builder: (context, state) => const HRProgramsScreen(),
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
                builder: (context, state) => const HRProfileScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
  );
}
