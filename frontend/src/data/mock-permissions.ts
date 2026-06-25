export interface Permission {
  id: string;
  module: string;
  action: string;
  label: string;
}

// Route-to-module mapping for route guard checks
export const ROUTE_MODULE_MAP: Record<string, string> = {
  '/admin/users': 'identity',
  '/admin/roles': 'identity',
  '/admin/permissions': 'identity',
  '/admin/sessions': 'identity',
  '/admin/security': 'identity',
  '/admin/employee': 'employee',
  '/admin/organization': 'organization',
  '/admin/program': 'program',
  '/admin/opportunity': 'opportunity',
  '/admin/application': 'application',
  '/admin/student': 'student',
  '/admin/batch': 'batch',
  '/admin/allocation': 'allocation',
  '/admin/mentor': 'mentor',
  '/admin/lms': 'lms',
  '/admin/task': 'task',
  '/admin/assessment': 'assessment',
  '/admin/submissions': 'submission',
  '/admin/attendance': 'attendance',
  '/admin/performance': 'performance',
  '/admin/coordinator': 'college_coordinator',
  '/admin/files': 'common_file',
  '/admin/super-admin': 'super_admin',
};

// Granular permissions using module.action format
export const MOCK_PERMISSIONS: Permission[] = [
  // Identity
  { id: 'identity.view', module: 'identity', action: 'view', label: 'View Identity' },
  { id: 'identity.manage_users', module: 'identity', action: 'manage_users', label: 'Manage Users' },
  { id: 'identity.manage_roles', module: 'identity', action: 'manage_roles', label: 'Manage Roles' },

  // Employee
  { id: 'employee.view', module: 'employee', action: 'view', label: 'View Employees' },
  { id: 'employee.create', module: 'employee', action: 'create', label: 'Create Employee' },
  { id: 'employee.edit', module: 'employee', action: 'edit', label: 'Edit Employee' },
  { id: 'employee.delete', module: 'employee', action: 'delete', label: 'Delete Employee' },

  // Organization
  { id: 'organization.view', module: 'organization', action: 'view', label: 'View Organizations' },
  { id: 'organization.create', module: 'organization', action: 'create', label: 'Create Organization' },
  { id: 'organization.edit', module: 'organization', action: 'edit', label: 'Edit Organization' },

  // Program
  { id: 'program.view', module: 'program', action: 'view', label: 'View Programs' },
  { id: 'program.create', module: 'program', action: 'create', label: 'Create Program' },
  { id: 'program.edit', module: 'program', action: 'edit', label: 'Edit Program' },

  // Opportunity
  { id: 'opportunity.view', module: 'opportunity', action: 'view', label: 'View Opportunities' },
  { id: 'opportunity.create', module: 'opportunity', action: 'create', label: 'Create Opportunity' },

  // Application
  { id: 'application.view', module: 'application', action: 'view', label: 'View Applications' },
  { id: 'application.review', module: 'application', action: 'review', label: 'Review Applications' },

  // Student
  { id: 'student.view', module: 'student', action: 'view', label: 'View Students' },
  { id: 'student.create', module: 'student', action: 'create', label: 'Create Student' },
  { id: 'student.edit', module: 'student', action: 'edit', label: 'Edit Student' },

  // Batch
  { id: 'batch.view', module: 'batch', action: 'view', label: 'View Batches' },
  { id: 'batch.create', module: 'batch', action: 'create', label: 'Create Batch' },
  { id: 'batch.edit', module: 'batch', action: 'edit', label: 'Edit Batch' },

  // Allocation
  { id: 'allocation.view', module: 'allocation', action: 'view', label: 'View Allocations' },
  { id: 'allocation.manage', module: 'allocation', action: 'manage', label: 'Manage Allocations' },

  // Mentor
  { id: 'mentor.view', module: 'mentor', action: 'view', label: 'View Mentors' },
  { id: 'mentor.assign', module: 'mentor', action: 'assign', label: 'Assign Mentors' },

  // LMS
  { id: 'lms.view', module: 'lms', action: 'view', label: 'View LMS' },
  { id: 'lms.create', module: 'lms', action: 'create', label: 'Create LMS Content' },
  { id: 'lms.edit', module: 'lms', action: 'edit', label: 'Edit LMS Content' },

  // Task
  { id: 'task.view', module: 'task', action: 'view', label: 'View Tasks' },
  { id: 'task.submit', module: 'task', action: 'submit', label: 'Submit Tasks' },
  { id: 'task.assign', module: 'task', action: 'assign', label: 'Assign Tasks' },
  { id: 'task.review', module: 'task', action: 'review', label: 'Review Tasks' },

  // Assessment
  { id: 'assessment.view', module: 'assessment', action: 'view', label: 'View Assessments' },
  { id: 'assessment.submit', module: 'assessment', action: 'submit', label: 'Submit Assessments' },
  { id: 'assessment.evaluate', module: 'assessment', action: 'evaluate', label: 'Evaluate Assessments' },
  { id: 'assessment.publish', module: 'assessment', action: 'publish', label: 'Publish Assessments' },

  // Submission
  { id: 'submission.view', module: 'submission', action: 'view', label: 'View Submissions' },
  { id: 'submission.grade', module: 'submission', action: 'grade', label: 'Grade Submissions' },

  // Attendance
  { id: 'attendance.view', module: 'attendance', action: 'view', label: 'View Attendance' },
  { id: 'attendance.mark', module: 'attendance', action: 'mark', label: 'Mark Attendance' },
  { id: 'attendance.edit', module: 'attendance', action: 'edit', label: 'Edit Attendance' },
  { id: 'attendance.delete', module: 'attendance', action: 'delete', label: 'Delete Attendance' },

  // Performance
  { id: 'performance.view', module: 'performance', action: 'view', label: 'View Performance' },
  { id: 'performance.export', module: 'performance', action: 'export', label: 'Export Performance Data' },

  // College Coordinator
  { id: 'college_coordinator.view', module: 'college_coordinator', action: 'view', label: 'View Coordinator' },

  // Common File
  { id: 'common_file.view', module: 'common_file', action: 'view', label: 'View Files' },
  { id: 'common_file.upload', module: 'common_file', action: 'upload', label: 'Upload Files' },

  // Dashboard
  { id: 'dashboard.view', module: 'dashboard', action: 'view', label: 'View Dashboard' },

  // Super Admin
  { id: 'super_admin.view', module: 'super_admin', action: 'view', label: 'View Admin Panel' },
];

// Legacy compat: grouped permissions by module (used by permissions page)
export const MOCK_PERMISSIONS_BY_MODULE: Record<string, string[]> = {
  identity: ['View', 'Manage Users', 'Manage Roles'],
  employee: ['View', 'Create', 'Edit', 'Delete'],
  organization: ['View', 'Create', 'Edit'],
  program: ['View', 'Create', 'Edit'],
  opportunity: ['View', 'Create'],
  application: ['View', 'Review'],
  student: ['View', 'Create', 'Edit'],
  batch: ['View', 'Create', 'Edit'],
  allocation: ['View', 'Manage'],
  mentor: ['View', 'Assign'],
  lms: ['View', 'Create', 'Edit'],
  task: ['View', 'Submit', 'Assign', 'Review'],
  assessment: ['View', 'Submit', 'Evaluate', 'Publish'],
  submission: ['View', 'Grade'],
  attendance: ['View', 'Mark Attendance', 'Edit Attendance', 'Delete'],
  performance: ['View Reports', 'Export Data'],
  college_coordinator: ['View'],
  common_file: ['View', 'Upload'],
  dashboard: ['View System KPIs', 'View Activity'],
  super_admin: ['View'],
};

// Legacy compat: flat permission list (used by permissions management page)
export const MOCK_PERMISSION_LIST = MOCK_PERMISSIONS;
