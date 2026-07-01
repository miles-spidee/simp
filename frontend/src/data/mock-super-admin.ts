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

export const MOCK_SYSTEM_SETTINGS: SystemSetting[] = [];

export const MOCK_AUDIT_LOGS: AuditLog[] = [];

export const MOCK_ROLE_PERMISSIONS: RolePermission[] = [];
