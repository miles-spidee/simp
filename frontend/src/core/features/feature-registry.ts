import { 
  UsersRound, Package, Network, User, UserPlus, Map, 
  MonitorPlay, BookOpen, Calendar, CheckSquare, ClipboardList, 
  FileText, PieChart, UsersIcon, FolderOpen, Settings,
  Briefcase, Activity, ShieldAlert, CreditCard, FileSignature, Wallet,
  Bell, Megaphone, MessageSquare, Mail, Award, TrendingUp, GraduationCap,
  LineChart, FileBarChart, Target, BarChart4, DownloadCloud, Lightbulb, LayoutDashboard, Key, Lock, Building2,
  LifeBuoy, Gift, IdCard, UserCircle, Zap, Sparkles, Building, ShieldCheck
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
  { moduleId: 'dashboard', featureId: 'dashboard_main', permissionKey: 'dashboard.view', displayName: 'Dashboard', navigationLabel: 'Dashboard', route: '/feature', icon: LayoutDashboard },

  // Identity
  { moduleId: 'users', featureId: 'users_main', permissionKey: 'users.view', displayName: 'Users', navigationLabel: 'Identity - Users', route: '/feature/users', icon: UsersIcon },
  { moduleId: 'roles', featureId: 'roles_main', permissionKey: 'roles.view', displayName: 'Roles', navigationLabel: 'Identity - Roles', route: '/feature/roles', icon: Key },
  { moduleId: 'modules', featureId: 'modules_main', permissionKey: 'modules.view', displayName: 'Module Registry', navigationLabel: 'Identity - Module Registry', route: '/feature/modules', icon: Settings },
  { moduleId: 'security', featureId: 'security_main', permissionKey: 'security.view', displayName: 'Security Center', navigationLabel: 'Identity - Security Center', route: '/feature/security', icon: ShieldAlert },

  // HR/Management
  { moduleId: 'employee', featureId: 'employee_main', permissionKey: 'employee.view', displayName: 'Employee Management', navigationLabel: 'Employee', route: '/feature/employee', icon: UsersIcon },
  { moduleId: 'organization', featureId: 'organization_main', permissionKey: 'organization.view', displayName: 'Organization Management', navigationLabel: 'Organization', route: '/feature/organization', icon: Building2 },
  { moduleId: 'program', featureId: 'program_main', permissionKey: 'program.view', displayName: 'Program Management', navigationLabel: 'Program', route: '/feature/program', icon: GraduationCap },
  { moduleId: 'opportunity', featureId: 'opportunity_main', permissionKey: 'opportunity.view', displayName: 'Opportunity Management', navigationLabel: 'Opportunity', route: '/feature/opportunity', icon: Briefcase },
  { moduleId: 'application', featureId: 'application_main', permissionKey: 'application.view', displayName: 'Application Management', navigationLabel: 'Application', route: '/feature/application', icon: FileText },
  { moduleId: 'student', featureId: 'student_main', permissionKey: 'student.view', displayName: 'Student Management', navigationLabel: 'Student', route: '/feature/student', icon: UsersRound },
  { moduleId: 'batch', featureId: 'batch_main', permissionKey: 'batch.view', displayName: 'Batch Management', navigationLabel: 'Batch', route: '/feature/batch', icon: Package },
  { moduleId: 'allocation', featureId: 'allocation_main', permissionKey: 'allocation.view', displayName: 'Allocation', navigationLabel: 'Allocation', route: '/feature/allocation', icon: Network },

  // Mentor
  { moduleId: 'mentor', featureId: 'mentor_profile', permissionKey: 'mentor.view', displayName: 'Mentor Profile', navigationLabel: 'Mentor Profile', route: '/feature/mentor/profile', icon: User },

  // LMS
  { moduleId: 'lms', featureId: 'lms_dashboard', permissionKey: 'lms.view', displayName: 'LMS Dashboard', navigationLabel: 'LMS Dashboard', route: '/feature/lms', icon: MonitorPlay },
  { moduleId: 'lms_management', featureId: 'lms_management_main', permissionKey: 'lms.create', displayName: 'LMS Management', navigationLabel: 'LMS Management', route: '/feature/lms-management', icon: Settings },
  { moduleId: 'my_learning', featureId: 'my_learning_main', permissionKey: 'my_learning.view', displayName: 'My Learning', navigationLabel: 'LMS My Learning', route: '/feature/my-learning', icon: BookOpen },

  // Attendance
  { moduleId: 'attendance', featureId: 'attendance_dashboard', permissionKey: 'attendance.view', displayName: 'Attendance Dashboard', navigationLabel: 'Attendance Dashboard', route: '/feature/attendance', icon: Calendar },
  { moduleId: 'attendance_management', featureId: 'attendance_management_main', permissionKey: 'attendance.mark', displayName: 'Attendance Management', navigationLabel: 'Attendance Management', route: '/feature/attendance-management', icon: Settings },
  { moduleId: 'my_attendance', featureId: 'my_attendance_main', permissionKey: 'my_attendance.view', displayName: 'My Attendance', navigationLabel: 'Attendance My Attendance', route: '/feature/my-attendance', icon: Calendar },

  // Task
  { moduleId: 'task', featureId: 'task_dashboard', permissionKey: 'task.view', displayName: 'Task Dashboard', navigationLabel: 'Task Dashboard', route: '/feature/task', icon: CheckSquare },
  { moduleId: 'task_management', featureId: 'task_management_main', permissionKey: 'task.create', displayName: 'Task Management', navigationLabel: 'Task Management', route: '/feature/task-management', icon: Settings },
  { moduleId: 'my_tasks', featureId: 'my_tasks_main', permissionKey: 'my_tasks.view', displayName: 'My Tasks', navigationLabel: 'Task My Tasks', route: '/feature/my-tasks', icon: ClipboardList },

  // Assessment
  { moduleId: 'assessment', featureId: 'assessment_dashboard', permissionKey: 'assessment.view', displayName: 'Assessment Dashboard', navigationLabel: 'Assessment Dashboard', route: '/feature/assessment', icon: FileText },
  { moduleId: 'assessment_management', featureId: 'assessment_management_main', permissionKey: 'assessment.create', displayName: 'Assessment Management', navigationLabel: 'Assessment Management', route: '/feature/assessment-management', icon: Settings },
  { moduleId: 'my_assessments', featureId: 'my_assessments_main', permissionKey: 'my_assessments.view', displayName: 'My Assessments', navigationLabel: 'Assessment My Assessments', route: '/feature/my-assessments', icon: ClipboardList },

  // Others
  { moduleId: 'submission', featureId: 'submission_main', permissionKey: 'submission.view', displayName: 'Submissions', navigationLabel: 'Submission', route: '/feature/submissions', icon: Package },
  { moduleId: 'performance', featureId: 'performance_main', permissionKey: 'performance.view', displayName: 'Performance', navigationLabel: 'Performance', route: '/feature/performance', icon: PieChart },
  { moduleId: 'college_coordinator', featureId: 'coordinator_main', permissionKey: 'college_coordinator.view', displayName: 'College Coordinator', navigationLabel: 'College Coordinator', route: '/feature/coordinator', icon: UsersIcon },
  { moduleId: 'common_file', featureId: 'files_main', permissionKey: 'common_file.view', displayName: 'Common Files', navigationLabel: 'Common Files', route: '/feature/files', icon: FolderOpen },
  
  // Phase 2: Internship Operations
  { moduleId: 'reporting_manager', featureId: 'reporting_manager_main', permissionKey: 'reporting_manager.view', displayName: 'Reporting Manager', navigationLabel: 'Reporting Manager', route: '/feature/reporting-manager', icon: Briefcase },
  { moduleId: 'leave', featureId: 'leave_main', permissionKey: 'leave.view', displayName: 'Leave Management', navigationLabel: 'Leave Management', route: '/feature/leave', icon: Calendar },
  { moduleId: 'activity', featureId: 'activity_main', permissionKey: 'activity.view', displayName: 'Activity Tracking', navigationLabel: 'Activity Tracking', route: '/feature/activity', icon: Activity },
  { moduleId: 'escalation', featureId: 'escalation_main', permissionKey: 'escalation.view', displayName: 'Escalation Engine', navigationLabel: 'Escalation Engine', route: '/feature/escalation', icon: ShieldAlert },
  
  // Phase 3: Finance & Commercial Management
  { moduleId: 'payment', featureId: 'payment_main', permissionKey: 'payment.view', displayName: 'Payment Management', navigationLabel: 'Payments', route: '/feature/payments', icon: CreditCard },
  { moduleId: 'fee', featureId: 'fee_main', permissionKey: 'fee.view', displayName: 'Fee Structure', navigationLabel: 'Fee Structure', route: '/feature/fees', icon: FileText },
  { moduleId: 'billing', featureId: 'billing_main', permissionKey: 'billing.view', displayName: 'Invoice & Receipt', navigationLabel: 'Billing', route: '/feature/billing', icon: FileSignature },
  { moduleId: 'wallet', featureId: 'wallet_main', permissionKey: 'wallet.view', displayName: 'Internship Wallet', navigationLabel: 'Wallet', route: '/feature/wallet', icon: Wallet },
  { moduleId: 'finance', featureId: 'finance_dashboard', permissionKey: 'finance.view', displayName: 'Finance Dashboard', navigationLabel: 'Finance Dashboard', route: '/feature/finance-dashboard', icon: PieChart },
  { moduleId: 'finance_analytics', featureId: 'analytics_main', permissionKey: 'analytics.finance.view', displayName: 'Revenue Analytics', navigationLabel: 'Revenue Analytics', route: '/feature/finance-analytics', icon: Activity },
  
  // Phase 4: Communication Platform
  { moduleId: 'notification', featureId: 'notification_main', permissionKey: 'notification.view', displayName: 'Notification Center', navigationLabel: 'Notifications', route: '/feature/notifications', icon: Bell },
  { moduleId: 'announcement', featureId: 'announcement_main', permissionKey: 'announcement.view', displayName: 'Announcement Management', navigationLabel: 'Announcements', route: '/feature/announcements', icon: Megaphone },
  { moduleId: 'communication', featureId: 'communication_main', permissionKey: 'communication.view', displayName: 'Communication Center', navigationLabel: 'Messages', route: '/feature/communication', icon: MessageSquare },
  { moduleId: 'calendar', featureId: 'calendar_main', permissionKey: 'calendar.view', displayName: 'Calendar & Scheduler', navigationLabel: 'Calendar', route: '/feature/calendar', icon: Calendar },
  { moduleId: 'email', featureId: 'email_main', permissionKey: 'email.view', displayName: 'Email & Template Management', navigationLabel: 'Email', route: '/feature/email', icon: Mail },

  // Phase 5: Certification & Placement
  { moduleId: 'certificate', featureId: 'certificate_main', permissionKey: 'certificate.view', displayName: 'Certificate Management', navigationLabel: 'Certificates', route: '/feature/certificates', icon: Award },
  { moduleId: 'college_certificates', featureId: 'college_cert_dashboard', permissionKey: 'certificate.view', displayName: 'College Certificate Dashboard', navigationLabel: 'College Certificates', route: '/feature/college-certificates', icon: ShieldCheck },
  { moduleId: 'document', featureId: 'document_main', permissionKey: 'document.view', displayName: 'Document Generation', navigationLabel: 'Documents', route: '/feature/documents', icon: FileText },
  { moduleId: 'placement', featureId: 'placement_main', permissionKey: 'placement.view', displayName: 'Placement & Hiring', navigationLabel: 'Placement', route: '/feature/placement', icon: TrendingUp },
  { moduleId: 'alumni', featureId: 'alumni_main', permissionKey: 'alumni.view', displayName: 'Alumni Management', navigationLabel: 'Alumni', route: '/feature/alumni', icon: GraduationCap },

  // Phase 6: Analytics & BI
  { moduleId: 'analytics', featureId: 'analytics_dashboard', permissionKey: 'analytics.view', displayName: 'Analytics Dashboard', navigationLabel: 'Analytics', route: '/feature/analytics', icon: LineChart },
  { moduleId: 'reports', featureId: 'reports_main', permissionKey: 'report.view', displayName: 'Report Center', navigationLabel: 'Reports', route: '/feature/reports', icon: FileBarChart },
  { moduleId: 'kpi', featureId: 'kpi_main', permissionKey: 'kpi.view', displayName: 'KPI Management', navigationLabel: 'KPIs', route: '/feature/kpi', icon: Target },
  { moduleId: 'executive', featureId: 'executive_dashboard', permissionKey: 'executive.view', displayName: 'Executive Dashboard', navigationLabel: 'Executive Dashboard', route: '/feature/executive', icon: BarChart4 },
  { moduleId: 'export', featureId: 'export_main', permissionKey: 'export.view', displayName: 'Data Export Center', navigationLabel: 'Export Center', route: '/feature/export', icon: DownloadCloud },
  { moduleId: 'insights', featureId: 'insights_main', permissionKey: 'insights.view', displayName: 'Predictive Insights', navigationLabel: 'Insights', route: '/feature/insights', icon: Lightbulb },

  // Phase 7: Support, Productivity & Experience
  { moduleId: 'helpdesk', featureId: 'helpdesk_main', permissionKey: 'helpdesk.view', displayName: 'Help Desk / Tickets', navigationLabel: 'Help Desk', route: '/feature/helpdesk', icon: LifeBuoy },
  { moduleId: 'marketplace', featureId: 'idbuilder_main', permissionKey: 'idcard.view', displayName: 'ID Card Builder', navigationLabel: 'ID Card Builder', route: '/feature/id-builder', icon: Sparkles },
  { moduleId: 'referral', featureId: 'referral_main', permissionKey: 'referral.view', displayName: 'Referral Management', navigationLabel: 'Referrals', route: '/feature/referrals', icon: Gift },
  { moduleId: 'idcard', featureId: 'idcard_main', permissionKey: 'idcard.view', displayName: 'Digital ID Card', navigationLabel: 'Digital ID', route: '/feature/id-card', icon: IdCard },
  { moduleId: 'selfservice', featureId: 'selfservice_main', permissionKey: 'selfservice.view', displayName: 'Self-Service Portal', navigationLabel: 'Self-Service', route: '/feature/self-service', icon: UserCircle },
  { moduleId: 'productivity', featureId: 'productivity_main', permissionKey: 'productivity.view', displayName: 'Productivity Center', navigationLabel: 'Productivity', route: '/feature/productivity', icon: Zap },

  // Super Admin
  { moduleId: 'super_admin', featureId: 'superadmin_main', permissionKey: 'super_admin.view', displayName: 'Super Admin Settings', navigationLabel: 'Super Admin', route: '/feature/super-admin', icon: Settings },
];
