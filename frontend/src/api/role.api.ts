import { apiClient } from './api.client';
import { Role, RoleCreate, RoleUpdate } from '../types/api/role.types';

export const roleApi = {
  getRoles: async (): Promise<Role[]> => {
    const res = await apiClient.get<Role[]>('/roles');
    return res.data;
  },

  getRoleById: async (id: string): Promise<Role> => {
    const res = await apiClient.get<Role>(`/roles/${id}`);
    return res.data;
  },

  createRole: async (data: RoleCreate): Promise<Role> => {
    const res = await apiClient.post<Role>('/roles', data);
    return res.data;
  },

  updateRole: async (id: string, updates: RoleUpdate): Promise<Role> => {
    const res = await apiClient.patch<Role>(`/roles/${id}`, updates);
    return res.data;
  },

  deleteRole: async (id: string): Promise<boolean> => {
    const res = await apiClient.delete<boolean>(`/roles/${id}`);
    return res.data;
  }
};
