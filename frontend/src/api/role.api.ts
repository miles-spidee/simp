import { apiClient } from './api.client';
import { Role, RoleCreate, RoleUpdate } from '../types/api/role.types';

export const roleApi = {
  getRoles: async (): Promise<Role[]> => {
    const res = await apiClient.get<Role[]>('/api/v1/rbac/roles');
    return (res.data as any)?.data || res.data;
  },

  getRoleById: async (id: string): Promise<Role> => {
    const res = await apiClient.get<Role>(`/api/v1/rbac/roles/${id}`);
    return (res.data as any)?.data || res.data;
  },

  createRole: async (data: RoleCreate): Promise<Role> => {
    const res = await apiClient.post<Role>('/api/v1/rbac/roles', data);
    return (res.data as any)?.data || res.data;
  },

  updateRole: async (id: string, updates: RoleUpdate): Promise<Role> => {
    const res = await apiClient.patch<Role>(`/api/v1/rbac/roles/${id}`, updates);
    return (res.data as any)?.data || res.data;
  },

  deleteRole: async (id: string): Promise<boolean> => {
    const res = await apiClient.delete<boolean>(`/api/v1/rbac/roles/${id}`);
    return (res.data as any)?.data || res.data;
  }
};
