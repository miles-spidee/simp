import { apiClient } from '../api/api.client';
import { SystemSetting, AuditLog, RolePermission } from '../types/super-admin.types';

class SuperAdminService {
  async getSystemSettings(): Promise<SystemSetting[]> {
    try {
      const res = await apiClient.get('/api/v1/super-admin');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }

  async getDashboardStats(): Promise<any> {
    try {
      const res = await apiClient.get('/api/v1/dashboard');
      return res.data?.data || null;
    } catch (error) {
      return null;
    }
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const res = await apiClient.get('/api/v1/super-admin');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }

  async getRolePermissions(): Promise<RolePermission[]> {
    try {
      const res = await apiClient.get('/api/v1/super-admin');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }
}

export const superAdminService = new SuperAdminService();
