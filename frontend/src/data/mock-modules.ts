export interface Module {
  id: string;
  code: string;
  name: string;
  route: string;
  active: boolean;
  desc?: string;
}

export const MOCK_MODULES: Module[] = [
  { id: 'dashboard', code: 'DASHBOARD', name: 'Dashboard', route: '/feature', active: true, desc: 'General system dashboards' },
  
  // Flattened Identity
  { id: 'users', code: 'USERS', name: 'Users', route: '/feature/users', active: true },
  { id: 'roles', code: 'ROLES', name: 'Roles', route: '/feature/roles', active: true },
  { id: 'modules', code: 'MODULES', name: 'Module Registry', route: '/feature/modules', active: true },
  { id: 'security', code: 'SEC', name: 'Security Center', route: '/feature/security', active: true },

  // Flattened HR/Mgmt
  { id: 'employee', code: 'EMPLOYEE', name: 'Employee', route: '/feature/employee', active: true },
  { id: 'organization', code: 'ORG', name: 'Organization', route: '/feature/organization', active: true },
  { id: 'program', code: 'PROGRAM', name: 'Program', route: '/feature/program', active: true },
  { id: 'opportunity', code: 'OPPORTUNITY', name: 'Opportunity', route: '/feature/opportunity', active: true },
  { id: 'application', code: 'APP', name: 'Application', route: '/feature/application', active: true },
  { id: 'student', code: 'STUDENT', name: 'Student', route: '/feature/student', active: true },
  { id: 'batch', code: 'BATCH', name: 'Batch', route: '/feature/batch', active: true },
  { id: 'allocation', code: 'ALLOC', name: 'Allocation', route: '/feature/allocation', active: true },

  // Flattened Mentor
  { id: 'mentor', code: 'MENTOR', name: 'Mentor Profile', route: '/feature/mentor/profile', active: true },
  { id: 'assignment', code: 'ASSIGN', name: 'Mentor Assignment', route: '/feature/assignment', active: true },
  { id: 'batch_mapping', code: 'BMAP', name: 'Batch Mapping', route: '/feature/batch-mapping', active: true },

  // Flattened LMS
  { id: 'lms', code: 'LMS', name: 'LMS Dashboard', route: '/feature/lms', active: true },
  { id: 'my_learning', code: 'MLEARN', name: 'My Learning', route: '/feature/my-learning', active: true },

  // Flattened Attendance
  { id: 'attendance', code: 'ATTEND', name: 'Attendance Dashboard', route: '/feature/attendance', active: true },
  { id: 'my_attendance', code: 'MATTEND', name: 'My Attendance', route: '/feature/my-attendance', active: true },

  // Flattened Task
  { id: 'task', code: 'TASK', name: 'Task Dashboard', route: '/feature/task', active: true },
  { id: 'management', code: 'MGMT', name: 'Task Management', route: '/feature/management', active: true },
  { id: 'my_tasks', code: 'MTASK', name: 'My Tasks', route: '/feature/my-tasks', active: true },

  // Flattened Assessment
  { id: 'assessment', code: 'ASSESS', name: 'Assessment', route: '/feature/assessment', active: true },

  // Phase 5: Certification & Placement
  { id: 'certificate', code: 'CERT', name: 'Certificate Management', route: '/feature/certificates', active: true },
  { id: 'document', code: 'DOC', name: 'Document Generation', route: '/feature/documents', active: true },
  { id: 'placement', code: 'PLACE', name: 'Placement & Hiring', route: '/feature/placement', active: true },
  { id: 'alumni', code: 'ALUMNI', name: 'Alumni Management', route: '/feature/alumni', active: true },

  // Phase 6: Analytics & BI
  { id: 'analytics', code: 'ANL', name: 'Analytics Dashboard', route: '/feature/analytics', active: true },
  { id: 'reports', code: 'REP', name: 'Report Center', route: '/feature/reports', active: true },
  { id: 'kpi', code: 'KPI', name: 'KPI Management', route: '/feature/kpi', active: true },
  { id: 'executive', code: 'EXEC', name: 'Executive Dashboard', route: '/feature/executive', active: true },
  { id: 'export', code: 'EXP', name: 'Data Export Center', route: '/feature/export', active: true },
  { id: 'insights', code: 'INS', name: 'Predictive Insights', route: '/feature/insights', active: true },

  // Phase 7: Support & Productivity
  { id: 'helpdesk', code: 'HELP', name: 'Help Desk', route: '/feature/helpdesk', active: true },
  { id: 'marketplace', code: 'MKT', name: 'ID Card Builder', route: '/feature/id-builder', active: true },
  { id: 'referral', code: 'REF', name: 'Referral Management', route: '/feature/referrals', active: true },
  { id: 'idcard', code: 'IDC', name: 'Digital ID Card', route: '/feature/id-card', active: true },
  { id: 'selfservice', code: 'SELF', name: 'Self-Service Portal', route: '/feature/self-service', active: true },
  { id: 'productivity', code: 'PROD', name: 'Productivity Center', route: '/feature/productivity', active: true },

  // Flattened Others
  { id: 'submission', code: 'SUB', name: 'Submission', route: '/feature/submissions', active: true },
  { id: 'performance', code: 'PERF', name: 'Performance', route: '/feature/performance', active: true },
  { id: 'college_coordinator', code: 'COORD', name: 'College Coordinator', route: '/feature/coordinator', active: true },
  { id: 'common_file', code: 'FILE', name: 'Common File', route: '/feature/files', active: true },
  
  { id: 'super_admin', code: 'ADMIN', name: 'Super Admin', route: '/feature/super-admin', active: true }
];
