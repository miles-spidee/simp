import { 
  LayoutDashboard, Users, Shield, LayoutGrid, Package, FileText, CheckSquare, Award,
  MonitorPlay, Users as UsersIcon, UsersRound, Calendar, PieChart, Briefcase, Network, Settings, 
  Building2, GraduationCap, FolderOpen, User, UserPlus, Map, BookOpen, ClipboardList,
  Lock, FileSignature, Key, Activity, ShieldAlert
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface FeatureDefinition {
  moduleId: string;
  featureId: string;
  permissionKey: string;
  displayName: string;
  navigationLabel: string;
  route: string;
  icon: LucideIcon;
  visibilityRules?: string[];
}

export const FEATURE_REGISTRY: FeatureDefinition[] = [
  { moduleId: 'dashboard', featureId: 'dashboard_main', permissionKey: 'dashboard.view', displayName: 'Dashboard', navigationLabel: 'Dashboard', route: '/admin', icon: LayoutDashboard },

  // Identity
  { moduleId: 'identity', featureId: 'identity_users', permissionKey: 'identity.view', displayName: 'Users', navigationLabel: 'Identity - Users', route: '/admin/users', icon: UsersIcon },
  { moduleId: 'identity', featureId: 'identity_roles', permissionKey: 'identity.view', displayName: 'Roles', navigationLabel: 'Identity - Roles', route: '/admin/roles', icon: Key },
  { moduleId: 'identity', featureId: 'identity_permissions', permissionKey: 'identity.view', displayName: 'Permissions', navigationLabel: 'Identity - Permissions', route: '/admin/permissions', icon: Lock },
  { moduleId: 'identity', featureId: 'identity_sessions', permissionKey: 'identity.view', displayName: 'Sessions', navigationLabel: 'Identity - Sessions', route: '/admin/sessions', icon: Activity },
  { moduleId: 'identity', featureId: 'identity_security', permissionKey: 'identity.view', displayName: 'Security Center', navigationLabel: 'Identity - Security Center', route: '/admin/security', icon: ShieldAlert },

  // HR/Management
  { moduleId: 'employee', featureId: 'employee_main', permissionKey: 'employee.view', displayName: 'Employee Management', navigationLabel: 'Employee', route: '/admin/employee', icon: UsersIcon },
  { moduleId: 'organization', featureId: 'organization_main', permissionKey: 'organization.view', displayName: 'Organization Management', navigationLabel: 'Organization', route: '/admin/organization', icon: Building2 },
  { moduleId: 'program', featureId: 'program_main', permissionKey: 'program.view', displayName: 'Program Management', navigationLabel: 'Program', route: '/admin/program', icon: GraduationCap },
  { moduleId: 'opportunity', featureId: 'opportunity_main', permissionKey: 'opportunity.view', displayName: 'Opportunity Management', navigationLabel: 'Opportunity', route: '/admin/opportunity', icon: Briefcase },
  { moduleId: 'application', featureId: 'application_main', permissionKey: 'application.view', displayName: 'Application Management', navigationLabel: 'Application', route: '/admin/application', icon: FileText },
  { moduleId: 'student', featureId: 'student_main', permissionKey: 'student.view', displayName: 'Student Management', navigationLabel: 'Student', route: '/admin/student', icon: UsersRound },
  { moduleId: 'batch', featureId: 'batch_main', permissionKey: 'batch.view', displayName: 'Batch Management', navigationLabel: 'Batch', route: '/admin/batch', icon: Package },
  { moduleId: 'allocation', featureId: 'allocation_main', permissionKey: 'allocation.view', displayName: 'Allocation', navigationLabel: 'Allocation', route: '/admin/allocation', icon: Network },

  // Mentor
  { moduleId: 'mentor', featureId: 'mentor_dashboard', permissionKey: 'mentor.view', displayName: 'Mentor Dashboard', navigationLabel: 'Mentor Dashboard', route: '/admin/mentor', icon: Award },
  { moduleId: 'mentor', featureId: 'mentor_profile', permissionKey: 'mentor.view', displayName: 'Mentor Profile', navigationLabel: 'Mentor Profile', route: '/admin/mentor/profile', icon: User },
  { moduleId: 'mentor', featureId: 'mentor_assignment', permissionKey: 'mentor.view', displayName: 'Mentor Assignment', navigationLabel: 'Mentor Assignment', route: '/admin/mentor/assignment', icon: UserPlus },
  { moduleId: 'mentor', featureId: 'mentor_batch', permissionKey: 'mentor.view', displayName: 'Batch Mapping', navigationLabel: 'Mentor Batch Mapping', route: '/admin/mentor/batch-mapping', icon: Map },

  // LMS
  { moduleId: 'lms', featureId: 'lms_dashboard', permissionKey: 'lms.view', displayName: 'LMS Dashboard', navigationLabel: 'LMS Dashboard', route: '/admin/lms', icon: MonitorPlay },
  { moduleId: 'lms', featureId: 'lms_management', permissionKey: 'lms.view', displayName: 'LMS Management', navigationLabel: 'LMS Management', route: '/admin/lms/management', icon: Settings },
  { moduleId: 'lms', featureId: 'lms_mylearning', permissionKey: 'lms.view', displayName: 'My Learning', navigationLabel: 'LMS My Learning', route: '/admin/lms/my-learning', icon: BookOpen },

  // Attendance
  { moduleId: 'attendance', featureId: 'attendance_dashboard', permissionKey: 'attendance.view', displayName: 'Attendance Dashboard', navigationLabel: 'Attendance Dashboard', route: '/admin/attendance', icon: Calendar },
  { moduleId: 'attendance', featureId: 'attendance_management', permissionKey: 'attendance.view', displayName: 'Attendance Management', navigationLabel: 'Attendance Management', route: '/admin/attendance/management', icon: Calendar },
  { moduleId: 'attendance', featureId: 'attendance_my', permissionKey: 'attendance.view', displayName: 'My Attendance', navigationLabel: 'Attendance My Attendance', route: '/admin/attendance/my-attendance', icon: Calendar },

  // Task
  { moduleId: 'task', featureId: 'task_dashboard', permissionKey: 'task.view', displayName: 'Task Dashboard', navigationLabel: 'Task Dashboard', route: '/admin/task', icon: CheckSquare },
  { moduleId: 'task', featureId: 'task_management', permissionKey: 'task.view', displayName: 'Task Management', navigationLabel: 'Task Management', route: '/admin/task/management', icon: CheckSquare },
  { moduleId: 'task', featureId: 'task_mytasks', permissionKey: 'task.view', displayName: 'My Tasks', navigationLabel: 'Task My Tasks', route: '/admin/task/my-tasks', icon: ClipboardList },

  // Assessment
  { moduleId: 'assessment', featureId: 'assessment_dashboard', permissionKey: 'assessment.view', displayName: 'Assessment Dashboard', navigationLabel: 'Assessment Dashboard', route: '/admin/assessment', icon: FileText },
  { moduleId: 'assessment', featureId: 'assessment_management', permissionKey: 'assessment.view', displayName: 'Assessment Management', navigationLabel: 'Assessment Management', route: '/admin/assessment/management', icon: FileText },
  { moduleId: 'assessment', featureId: 'assessment_my', permissionKey: 'assessment.view', displayName: 'My Assessments', navigationLabel: 'Assessment My Assessments', route: '/admin/assessment/my-assessments', icon: FileSignature },

  // Others
  { moduleId: 'submission', featureId: 'submission_main', permissionKey: 'submission.view', displayName: 'Submissions', navigationLabel: 'Submission', route: '/admin/submissions', icon: Package },
  { moduleId: 'performance', featureId: 'performance_main', permissionKey: 'performance.view', displayName: 'Performance', navigationLabel: 'Performance', route: '/admin/performance', icon: PieChart },
  { moduleId: 'college_coordinator', featureId: 'coordinator_main', permissionKey: 'college_coordinator.view', displayName: 'College Coordinator', navigationLabel: 'College Coordinator', route: '/admin/coordinator', icon: UsersIcon },
  { moduleId: 'common_file', featureId: 'files_main', permissionKey: 'common_file.view', displayName: 'Common Files', navigationLabel: 'Common Files', route: '/admin/files', icon: FolderOpen },
  
  // Super Admin
  { moduleId: 'super_admin', featureId: 'superadmin_main', permissionKey: 'super_admin.view', displayName: 'Super Admin Settings', navigationLabel: 'Super Admin', route: '/admin/super-admin', icon: Settings },
];
