import { apiClient } from '../api/api.client';
import { Role } from '../types/api/role.types';
import { roleApi } from '../api/role.api';

export const roleService = {
  async getRoles(): Promise<Role[]> {
    try {
      return await roleApi.getRoles();
    } catch (error) {
      return [];
    }
  },

  async getRole(id: string): Promise<Role | undefined> {
    try {
      return await roleApi.getRoleById(id);
    } catch (error) {
      return undefined;
    }
  },

  async createRole(role: Omit<Role, 'id' | 'modulesCount' | 'usersCount' | 'color' | 'bg'> & { color?: string, bg?: string }): Promise<Role> {
    try {
      return await roleApi.createRole(role as RoleCreate);
    } catch (error) {
      return null as any;
    }
  },

  async updateRole(id: string, updatedData: Partial<Role>): Promise<Role | undefined> {
    try {
      return await roleApi.updateRole(id, updatedData as RoleUpdate);
    } catch (error) {
      return undefined;
    }
  },

  async deleteRole(id: string): Promise<boolean> {
    try {
      return await roleApi.deleteRole(id);
    } catch (error) {
      return false;
    }
  }
};
