import { SystemSetting, AuditLog, RolePermission, MOCK_SYSTEM_SETTINGS, MOCK_AUDIT_LOGS, MOCK_ROLE_PERMISSIONS } from '../data/mock-super-admin';

class SuperAdminService {
  async getSystemSettings(): Promise<SystemSetting[]> {
    return [...MOCK_SYSTEM_SETTINGS];
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return [...MOCK_AUDIT_LOGS];
  }

  async getRolePermissions(): Promise<RolePermission[]> {
    return [...MOCK_ROLE_PERMISSIONS];
  }
}

export const superAdminService = new SuperAdminService();
