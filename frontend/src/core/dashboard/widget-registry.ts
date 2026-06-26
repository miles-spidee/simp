export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface WidgetDefinition {
  widgetId: string;
  name: string;
  description: string;
  moduleId: string;
  permissionKey?: string; // If undefined, it only requires the module
  supportedRoles: string[]; // e.g., ['HR', 'Super Admin'] or ['*'] for any role with the module
  size: WidgetSize;
}

export const WIDGET_REGISTRY: WidgetDefinition[] = [
  // Super Admin Widgets
  {
    widgetId: 'sys_health',
    name: 'System Health',
    description: 'Overview of API, DB, and Server health',
    moduleId: 'super_admin',
    permissionKey: 'super_admin.view',
    supportedRoles: ['Super Admin'],
    size: 'full'
  },
  {
    widgetId: 'recent_activity',
    name: 'Recent Platform Activity',
    description: 'System-wide activity log',
    moduleId: 'super_admin',
    permissionKey: 'super_admin.view',
    supportedRoles: ['Super Admin'],
    size: 'large'
  },

  // HR / Management Widgets
  {
    widgetId: 'employee_kpi',
    name: 'Employee KPI',
    description: 'Key performance indicators for employees',
    moduleId: 'employee',
    permissionKey: 'employee.view',
    supportedRoles: ['HR', 'Super Admin'],
    size: 'medium'
  },
  {
    widgetId: 'applications_kpi',
    name: 'Applications KPI',
    description: 'Pipeline statistics for applications',
    moduleId: 'application',
    permissionKey: 'application.view',
    supportedRoles: ['HR', 'Super Admin'],
    size: 'medium'
  },
  {
    widgetId: 'program_stats',
    name: 'Program Statistics',
    description: 'Active programs and enrollments',
    moduleId: 'program',
    permissionKey: 'program.view',
    supportedRoles: ['HR', 'Super Admin', 'College Coordinator'],
    size: 'medium'
  },

  // Mentor Widgets
  {
    widgetId: 'assigned_students',
    name: 'Assigned Students',
    description: 'Quick view of students assigned to the mentor',
    moduleId: 'mentor',
    permissionKey: 'mentor.view',
    supportedRoles: ['Mentor'],
    size: 'medium'
  },
  {
    widgetId: 'pending_reviews',
    name: 'Pending Reviews',
    description: 'Tasks and assessments requiring review',
    moduleId: 'mentor',
    permissionKey: 'mentor.view', // Can be assessment.review as well
    supportedRoles: ['Mentor'],
    size: 'medium'
  },
  
  // Student Widgets
  {
    widgetId: 'attendance_summary',
    name: 'Attendance Summary',
    description: 'Student attendance percentage and history',
    moduleId: 'attendance',
    permissionKey: 'attendance.view',
    supportedRoles: ['Student'],
    size: 'small'
  },
  {
    widgetId: 'learning_progress',
    name: 'Learning Progress',
    description: 'LMS progress and current modules',
    moduleId: 'lms',
    permissionKey: 'lms.view',
    supportedRoles: ['Student'],
    size: 'large'
  },
  {
    widgetId: 'upcoming_tasks',
    name: 'Upcoming Tasks',
    description: 'Tasks assigned to the student',
    moduleId: 'task',
    permissionKey: 'task.view',
    supportedRoles: ['Student'],
    size: 'medium'
  },
  
  // Phase 4: Communication Widgets
  {
    widgetId: 'unread_notifications',
    name: 'Unread Notifications',
    description: 'Quick view of unread notifications',
    moduleId: 'notification',
    permissionKey: 'notification.view',
    supportedRoles: ['*'],
    size: 'small'
  },
  {
    widgetId: 'todays_events',
    name: 'Today\'s Events',
    description: 'Overview of events scheduled for today',
    moduleId: 'calendar',
    permissionKey: 'calendar.view',
    supportedRoles: ['*'],
    size: 'medium'
  },
  {
    widgetId: 'upcoming_interviews',
    name: 'Upcoming Interviews',
    description: 'List of upcoming scheduled interviews',
    moduleId: 'calendar',
    permissionKey: 'calendar.view',
    supportedRoles: ['*'],
    size: 'medium'
  },
  {
    widgetId: 'pending_announcements',
    name: 'Pending Announcements',
    description: 'Draft or pending announcements to publish',
    moduleId: 'announcement',
    permissionKey: 'announcement.create',
    supportedRoles: ['HR', 'Super Admin'],
    size: 'medium'
  },
  {
    widgetId: 'unread_messages',
    name: 'Unread Messages',
    description: 'Unread internal messages and conversations',
    moduleId: 'communication',
    permissionKey: 'communication.view',
    supportedRoles: ['*'],
    size: 'medium'
  },
  {
    widgetId: 'scheduled_notifications',
    name: 'Scheduled Notifications',
    description: 'Queue of notifications to be sent',
    moduleId: 'notification',
    permissionKey: 'notification.schedule',
    supportedRoles: ['HR', 'Super Admin'],
    size: 'medium'
  },
  {
    widgetId: 'notification_analytics',
    name: 'Notification Analytics',
    description: 'Metrics on delivery and read rates',
    moduleId: 'notification',
    permissionKey: 'notification.export',
    supportedRoles: ['HR', 'Super Admin'],
    size: 'large'
  },
  {
    widgetId: 'communication_activity',
    name: 'Communication Activity',
    description: 'Overall activity in the communication platform',
    moduleId: 'communication',
    permissionKey: 'communication.view',
    supportedRoles: ['HR', 'Super Admin'],
    size: 'large'
  },

  // Phase 5: Certification & Placement
  {
    widgetId: 'certificates_issued',
    name: 'Certificates Issued',
    description: 'Total certificates issued to students',
    moduleId: 'certificate',
    permissionKey: 'certificate.view',
    supportedRoles: ['HR', 'Super Admin'],
    size: 'small'
  },
  {
    widgetId: 'pending_certificate_approvals',
    name: 'Pending Certificate Approvals',
    description: 'Certificates awaiting HR approval',
    moduleId: 'certificate',
    permissionKey: 'certificate.approve',
    supportedRoles: ['HR', 'Super Admin'],
    size: 'small'
  },
  {
    widgetId: 'placement_success_rate',
    name: 'Placement Success Rate',
    description: 'Overall student placement statistics',
    moduleId: 'placement',
    permissionKey: 'placement.view',
    supportedRoles: ['HR', 'Super Admin'],
    size: 'medium'
  },
  {
    widgetId: 'offer_letters_generated',
    name: 'Offer Letters Generated',
    description: 'Count of generated offer letters',
    moduleId: 'document',
    permissionKey: 'document.view',
    supportedRoles: ['HR', 'Super Admin'],
    size: 'small'
  },
  {
    widgetId: 'students_hired',
    name: 'Students Hired',
    description: 'Total count of hired students',
    moduleId: 'placement',
    permissionKey: 'placement.view',
    supportedRoles: ['HR', 'Super Admin'],
    size: 'small'
  },
  {
    widgetId: 'upcoming_interviews_placement',
    name: 'Upcoming Interviews (Placement)',
    description: 'Placement-related interview schedule',
    moduleId: 'placement',
    permissionKey: 'placement.view',
    supportedRoles: ['HR', 'Super Admin'],
    size: 'medium'
  },
  {
    widgetId: 'top_hiring_companies',
    name: 'Top Hiring Companies',
    description: 'List of companies with highest hiring volume',
    moduleId: 'placement',
    permissionKey: 'placement.view',
    supportedRoles: ['HR', 'Super Admin'],
    size: 'medium'
  },
  {
    widgetId: 'alumni_growth',
    name: 'Alumni Growth',
    description: 'Tracking alumni network expansion',
    moduleId: 'alumni',
    permissionKey: 'alumni.view',
    supportedRoles: ['HR', 'Super Admin'],
    size: 'medium'
  },
  {
    widgetId: 'verification_requests',
    name: 'Verification Requests',
    description: 'Pending verification requests for certificates',
    moduleId: 'certificate',
    permissionKey: 'certificate.verify',
    supportedRoles: ['HR', 'Super Admin'],
    size: 'small'
  },

  // Phase 6: Analytics & BI
  {
    widgetId: 'analytics_overview',
    name: 'Analytics Overview',
    description: 'High-level system usage and statistics',
    moduleId: 'analytics',
    permissionKey: 'analytics.view',
    supportedRoles: ['Super Admin', 'HR', 'Management'],
    size: 'full'
  },
  {
    widgetId: 'executive_summary',
    name: 'Executive Summary',
    description: 'Key performance indicators for executives',
    moduleId: 'executive',
    permissionKey: 'executive.view',
    supportedRoles: ['Super Admin', 'Management'],
    size: 'large'
  },
  {
    widgetId: 'attendance_trend',
    name: 'Attendance Trend',
    description: 'Time-series analysis of attendance',
    moduleId: 'analytics',
    permissionKey: 'analytics.view',
    supportedRoles: ['Super Admin', 'HR', 'College Coordinator'],
    size: 'medium'
  },
  {
    widgetId: 'performance_trend',
    name: 'Performance Trend',
    description: 'Time-series analysis of student performance',
    moduleId: 'analytics',
    permissionKey: 'analytics.view',
    supportedRoles: ['Super Admin', 'HR', 'Mentor'],
    size: 'medium'
  },
  {
    widgetId: 'revenue_growth',
    name: 'Revenue Growth',
    description: 'Track revenue growth over time',
    moduleId: 'executive',
    permissionKey: 'executive.view',
    supportedRoles: ['Super Admin', 'Finance Manager', 'Management'],
    size: 'medium'
  },
  {
    widgetId: 'recent_reports',
    name: 'Recent Reports',
    description: 'List of recently generated reports',
    moduleId: 'reports',
    permissionKey: 'report.view',
    supportedRoles: ['Super Admin', 'HR', 'Management'],
    size: 'medium'
  },
  {
    widgetId: 'kpi_summary',
    name: 'KPI Summary',
    description: 'Summary of key performance indicators',
    moduleId: 'kpi',
    permissionKey: 'kpi.view',
    supportedRoles: ['Super Admin', 'HR', 'Management'],
    size: 'large'
  },

  // Phase 7: Support & Productivity
  {
    widgetId: 'open_tickets',
    name: 'Open Tickets',
    description: 'List of open helpdesk tickets',
    moduleId: 'helpdesk',
    permissionKey: 'helpdesk.view',
    supportedRoles: ['Super Admin', 'HR'],
    size: 'medium'
  },
  {
    widgetId: 'my_requests',
    name: 'My Requests',
    description: 'List of my helpdesk requests',
    moduleId: 'helpdesk',
    permissionKey: 'helpdesk.create',
    supportedRoles: ['*'],
    size: 'medium'
  },
  {
    widgetId: 'referral_rewards',
    name: 'Referral Rewards',
    description: 'Total referral rewards earned',
    moduleId: 'referral',
    permissionKey: 'referral.view',
    supportedRoles: ['*'],
    size: 'small'
  },
  {
    widgetId: 'recommended_internships',
    name: 'Recommended Internships',
    description: 'Internships recommended for you',
    moduleId: 'marketplace',
    permissionKey: 'marketplace.view',
    supportedRoles: ['Student'],
    size: 'large'
  },
  {
    widgetId: 'marketplace_stats',
    name: 'Marketplace Statistics',
    description: 'Overall marketplace statistics',
    moduleId: 'marketplace',
    permissionKey: 'marketplace.manage',
    supportedRoles: ['Super Admin', 'HR'],
    size: 'medium'
  },
  {
    widgetId: 'idcard_status',
    name: 'Digital ID Status',
    description: 'Status of your digital ID card',
    moduleId: 'idcard',
    permissionKey: 'idcard.view',
    supportedRoles: ['*'],
    size: 'small'
  },
  {
    widgetId: 'bookmarks',
    name: 'Bookmarks',
    description: 'Your saved bookmarks',
    moduleId: 'productivity',
    permissionKey: 'productivity.view',
    supportedRoles: ['*'],
    size: 'small'
  },
  {
    widgetId: 'upcoming_tasks_productivity',
    name: 'Upcoming Tasks (Productivity)',
    description: 'Your upcoming personal tasks',
    moduleId: 'productivity',
    permissionKey: 'productivity.view',
    supportedRoles: ['*'],
    size: 'medium'
  },
  {
    widgetId: 'placement_growth',
    name: 'Placement Growth',
    description: 'Trend analysis of student placements',
    moduleId: 'analytics',
    permissionKey: 'analytics.view',
    supportedRoles: ['Super Admin', 'HR'],
    size: 'medium'
  },
  {
    widgetId: 'top_performing_colleges',
    name: 'Top Performing Colleges',
    description: 'Ranking of colleges by student performance',
    moduleId: 'analytics',
    permissionKey: 'analytics.view',
    supportedRoles: ['Super Admin', 'HR'],
    size: 'medium'
  },
  {
    widgetId: 'top_performing_programs',
    name: 'Top Performing Programs',
    description: 'Ranking of programs by student outcomes',
    moduleId: 'analytics',
    permissionKey: 'analytics.view',
    supportedRoles: ['Super Admin', 'HR'],
    size: 'medium'
  },
  {
    widgetId: 'certificate_analytics',
    name: 'Certificate Analytics',
    description: 'Statistics on certificate generation and validation',
    moduleId: 'analytics',
    permissionKey: 'analytics.view',
    supportedRoles: ['Super Admin', 'HR'],
    size: 'small'
  },
  {
    widgetId: 'student_risk_overview',
    name: 'Student Risk Overview',
    description: 'AI-driven risk classification of students',
    moduleId: 'insights',
    permissionKey: 'insights.view',
    supportedRoles: ['Super Admin', 'HR', 'Management'],
    size: 'medium'
  },
  {
    widgetId: 'upcoming_milestones',
    name: 'Upcoming Milestones',
    description: 'Predicted upcoming system milestones',
    moduleId: 'insights',
    permissionKey: 'insights.view',
    supportedRoles: ['Super Admin', 'HR'],
    size: 'small'
  }
];
