import { apiClient } from '../api/api.client';
import { Role } from '../types/api/role.types';
import { roleApi } from '../api/role.api';

export const roleService = {
  async getRoles(): Promise<Role[]> {
    try {
      const res = await apiClient.get('/api/v1/role');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },

  async getRole(id: string): Promise<Role | undefined> {
    try {
      const res = await apiClient.get('/api/v1/role');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  async createRole(role: Omit<Role, 'id' | 'modulesCount' | 'usersCount' | 'color' | 'bg'> & { color?: string, bg?: string }): Promise<Role> {
    try {
      const res = await apiClient.post('/api/v1/role');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  async updateRole(id: string, updatedData: Partial<Role>): Promise<Role | undefined> {
    try {
      const res = await apiClient.patch('/api/v1/role');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  async deleteRole(id: string): Promise<boolean> {
    try {
      const res = await apiClient.delete('/api/v1/role');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
