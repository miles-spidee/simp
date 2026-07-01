export interface SystemSetting {
  id: string;
  category: string;
  key: string;
  value: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  status: 'Success' | 'Failed';
}

export interface RolePermission {
  role: string;
  permissions: string[];
}

export const MOCK_SYSTEM_SETTINGS: SystemSetting[] = [
  { id: 'set-1', category: 'General', key: 'Platform Name', value: 'PineSphere ERP' },
  { id: 'set-2', category: 'Security', key: 'Max Login Attempts', value: '5' },
  { id: 'set-3', category: 'Storage', key: 'Max File Size', value: '50MB' }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', userId: 'emp-1', action: 'LOGIN', entityType: 'System', entityId: 'sys-1', timestamp: '2023-11-20T10:00:00Z', status: 'Success' },
  { id: 'log-2', userId: 'emp-2', action: 'CREATE_TASK', entityType: 'Task', entityId: 'tsk-101', timestamp: '2023-11-20T10:15:00Z', status: 'Success' },
  { id: 'log-3', userId: 'unknown', action: 'LOGIN', entityType: 'System', entityId: 'sys-1', timestamp: '2023-11-20T11:00:00Z', status: 'Failed' }
];

export const MOCK_ROLE_PERMISSIONS: RolePermission[] = [
  { role: 'Super Admin', permissions: ['*'] },
  { role: 'Mentor', permissions: ['view_students', 'grade_tasks', 'view_batches'] },
  { role: 'Student', permissions: ['view_tasks', 'submit_tasks', 'view_lms'] }
];
