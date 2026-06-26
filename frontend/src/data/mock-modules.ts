export interface Module {
  id: string;
  code: string;
  name: string;
  route: string;
  active: boolean;
  desc?: string;
}

export const MOCK_MODULES: Module[] = [
  { id: 'identity', code: 'IDENTITY', name: 'Identity', route: '/identity', active: true, desc: 'Manage users, roles, and permissions' },
  { id: 'employee', code: 'EMPLOYEE', name: 'Employee', route: '/employee', active: true, desc: 'Manage employee profiles and data' },
  { id: 'organization', code: 'ORG', name: 'Organization', route: '/organization', active: true, desc: 'Manage company structure and departments' },
  { id: 'program', code: 'PROGRAM', name: 'Program', route: '/program', active: true, desc: 'Manage learning and internship programs' },
  { id: 'opportunity', code: 'OPPORTUNITY', name: 'Opportunity', route: '/opportunity', active: true, desc: 'Publish open opportunities' },
  { id: 'application', code: 'APP', name: 'Application', route: '/application', active: true, desc: 'Track candidate applications' },
  { id: 'student', code: 'STUDENT', name: 'Student', route: '/student', active: true, desc: 'Manage student information' },
  { id: 'batch', code: 'BATCH', name: 'Batch', route: '/batch', active: true, desc: 'Manage cohorts and batches' },
  { id: 'allocation', code: 'ALLOC', name: 'Allocation', route: '/allocation', active: true, desc: 'Allocate resources and mentors' },
  { id: 'mentor', code: 'MENTOR', name: 'Mentor Module', route: '/mentor', active: true, desc: 'Mentor ecosystem with profiles, assignments, batch mapping, and dashboard' },
  { id: 'lms', code: 'LMS', name: 'LMS', route: '/lms', active: true, desc: 'Learning Management System for courses' },
  { id: 'task', code: 'TASK', name: 'Task', route: '/task', active: true, desc: 'Assign and track tasks' },
  { id: 'assessment', code: 'ASSESS', name: 'Assessment', route: '/assessment', active: true, desc: 'Create and grade quizzes and exams' },
  { id: 'submission', code: 'SUB', name: 'Submission', route: '/submission', active: true, desc: 'Manage project submissions' },
  { id: 'attendance', code: 'ATTEND', name: 'Attendance', route: '/attendance', active: true, desc: 'Track and manage attendance' },
  { id: 'performance', code: 'PERF', name: 'Performance', route: '/performance', active: true, desc: 'View analytics and performance metrics' },
  { id: 'dashboard', code: 'DASHBOARD', name: 'Dashboard', route: '/dashboard', active: true, desc: 'General system dashboards' },
  { id: 'common_file', code: 'FILE', name: 'Common File', route: '/files', active: true, desc: 'File repository and sharing' },
  { id: 'super_admin', code: 'ADMIN', name: 'Super Admin', route: '/feature', active: true, desc: 'Platform Control Center' },
];
