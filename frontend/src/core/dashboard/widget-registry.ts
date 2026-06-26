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
  }
];
