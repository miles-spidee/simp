import 'package:go_router/go_router.dart';
import 'package:pinesphere_erp/core/widgets/main_shell.dart';
import 'package:pinesphere_erp/features/auth/screens/login_screen.dart';
import 'package:pinesphere_erp/features/auth/screens/splash_screen.dart';
import 'package:pinesphere_erp/features/assessments/screens/assessments_screen.dart';
import 'package:pinesphere_erp/features/attendance/screens/attendance_screen.dart';
import 'package:pinesphere_erp/features/certificates/screens/certificates_screen.dart';
import 'package:pinesphere_erp/features/notifications/screens/notifications_screen.dart';
import 'package:pinesphere_erp/features/profile/screens/profile_screen.dart';
import 'package:pinesphere_erp/features/settings/screens/settings_screen.dart';
import 'package:pinesphere_erp/features/tasks/screens/tasks_screen.dart';
import 'package:pinesphere_erp/features/placement/screens/placement_screen.dart';

class AppRoutes {
  static const String splash = '/';
  static const String login = '/login';
  static const String dashboard = '/dashboard';
  static const String attendance = 'attendance';
  static const String tasks = 'tasks';
  static const String profile = 'profile';
  static const String assessments = 'assessments';
  static const String certificates = 'certificates';
  static const String notifications = 'notifications';
  static const String settings = 'settings';
  static const String placement = 'placement';

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
      GoRoute(
        path: dashboard,
        builder: (context, state) => const MainShell(),
        routes: [
          GoRoute(
            path: 'attendance',
            builder: (context, state) => const AttendanceScreen(),
          ),
          GoRoute(
            path: 'tasks',
            builder: (context, state) => const TasksScreen(),
          ),
          GoRoute(
            path: 'profile',
            builder: (context, state) => const ProfileScreen(),
          ),
          GoRoute(
            path: 'assessments',
            builder: (context, state) => const AssessmentsScreen(),
          ),
          GoRoute(
            path: 'certificates',
            builder: (context, state) => const CertificatesScreen(),
          ),
          GoRoute(
            path: 'notifications',
            builder: (context, state) => const NotificationsScreen(),
          ),
          GoRoute(
            path: 'settings',
            builder: (context, state) => const SettingsScreen(),
          ),
          GoRoute(
            path: 'placement',
            builder: (context, state) => const PlacementScreen(),
          ),
        ],
      ),
    ],
  );
}
