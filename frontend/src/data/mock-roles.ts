export interface Role {
  id: string;
  name: string;
  code: string;
  desc: string;
  status: 'Active' | 'Inactive';
  modulesCount: number;
  usersCount: number;
  color: string;
  bg: string;
  moduleIds: string[];
  permissions: string[];
}

export const MOCK_ROLES: Role[] = [
  {
    id: 'role-1',
    name: 'Student',
    code: 'ROLE_STUDENT',
    desc: 'Can access LMS, submit tasks and assessments, view attendance and performance.',
    status: 'Active',
    modulesCount: 6,
    usersCount: 245,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    moduleIds: ['dashboard', 'task', 'assessment', 'attendance', 'performance', 'lms'],
    permissions: [
      'task.view', 'task.submit',
      'assessment.view', 'assessment.submit',
      'attendance.view',
      'performance.view',
      'lms.view',
    ],
  },
  {
    id: 'role-2',
    name: 'Mentor',
    code: 'ROLE_MENTOR',
    desc: 'Can view students, mark attendance, review tasks and evaluate assessments.',
    status: 'Active',
    modulesCount: 6,
    usersCount: 34,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
    moduleIds: ['dashboard', 'student', 'attendance', 'task', 'assessment', 'performance'],
    permissions: [
      'student.view',
      'attendance.view', 'attendance.mark',
      'task.view', 'task.review',
      'assessment.view', 'assessment.evaluate',
      'performance.view',
    ],
  },
  {
    id: 'role-3',
    name: 'HR',
    code: 'ROLE_HR',
    desc: 'Can manage employees, organizations, programs, applications, students and batches.',
    status: 'Active',
    modulesCount: 8,
    usersCount: 12,
    color: 'text-rose-600',
    bg: 'bg-rose-100',
    moduleIds: ['dashboard', 'employee', 'organization', 'program', 'opportunity', 'application', 'student', 'batch'],
    permissions: [
      'employee.view', 'employee.create', 'employee.edit',
      'organization.view', 'organization.create', 'organization.edit',
      'program.view', 'program.create', 'program.edit',
      'application.view', 'application.review',
      'student.view', 'student.create', 'student.edit',
      'batch.view', 'batch.create', 'batch.edit',
    ],
  },
  {
    id: 'role-4',
    name: 'College Coordinator',
    code: 'ROLE_CC',
    desc: 'Can track student progress and view reports.',
    status: 'Active',
    modulesCount: 5,
    usersCount: 28,
    color: 'text-violet-600',
    bg: 'bg-violet-100',
    moduleIds: ['dashboard', 'college_coordinator', 'student', 'attendance', 'performance'],
    permissions: [
      'college_coordinator.view',
      'student.view',
      'attendance.view',
      'performance.view',
    ],
  },
  {
    id: 'role-5',
    name: 'Super Admin',
    code: 'ROLE_ADMIN',
    desc: 'Full system access. All modules, all permissions, no restrictions.',
    status: 'Active',
    modulesCount: 20,
    usersCount: 3,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    moduleIds: [
      'identity', 'employee', 'organization', 'program', 'opportunity',
      'application', 'student', 'batch', 'allocation', 'mentor',
      'lms', 'task', 'assessment', 'submission', 'attendance',
      'performance', 'college_coordinator', 'dashboard', 'common_file', 'super_admin',
    ],
    permissions: ['all'],
  },
];
