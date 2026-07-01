import { User } from '../types/api/user.types';
import { apiClient } from '../api/api.client';
import { roleService } from './role.service';
import { moduleService } from './module.service';
import { Module } from '../types/api/module.types';

const MOCK_USERS: any[] = [];
const MOCK_MODULES: any[] = [];

export const userService = {
  async getUsers(): Promise<User[]> {
    try {
      const res = await apiClient.post('/api/v1/users/search', { page: 1, size: 1000 });
      const items = (res.data as any)?.data?.items || res.data?.items || [];
      return items.map((u: any) => ({
        ...u,
        name: u.username || u.email || 'Unknown User',
        status: u.account_status === 'ACTIVE' ? 'Active' : 'Inactive',
        date: u.created_at ? new Date(u.created_at).toLocaleDateString() : '',
        avatar: (u.username || u.email || 'U')[0].toUpperCase(),
        roleName: u.roleName || 'User'
      }));
    } catch (e) {
      return [];
    }
  },

  async getUser(id: string): Promise<User | undefined> {
    try {
      const res = await apiClient.get(`/api/v1/users/${id}`);
      return (res.data as any)?.data || res.data;
    } catch (e) {
      return undefined;
    }
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const users = await this.getUsers();
      return users.find(u => u.email === email);
    } catch (e) {
      return undefined;
    }
  },

  async getUserModules(id: string): Promise<Module[]> {
    const user = await this.getUser(id);
    if (!user) return [];

    const role = await roleService.getRole(user.roleId);
    let allowedModuleIds = new Set<string>();

    if (role && role.moduleIds) {
      role.moduleIds.forEach((m: any) => allowedModuleIds.add(m));
    }

    if (user.moduleOverrides) {
      user.moduleOverrides.forEach(m => allowedModuleIds.add(m));
    }

    const allModules = await moduleService.getModules();

    // Super Admin gets all modules
    if (role && role.permissions && role.permissions.includes('all')) {
      return allModules.filter((m: any) => m.active !== false);
    }

    return allModules.filter((m: any) => allowedModuleIds.has(m.id) && m.active !== false);
  },

  async getUserPermissions(id: string): Promise<string[]> {
    const user = await this.getUser(id);
    if (!user) return [];

    const role = await roleService.getRole(user.roleId);
    if (!role) return [];

    return role.permissions || [];
  },

  async createUser(user: Omit<User, 'id' | 'date' | 'avatar'> & { avatar?: string }): Promise<User> {
    const res = await apiClient.post('/api/v1/users/', user);
    return (res.data as any)?.data || res.data;
  },

  async updateUser(id: string, updatedData: Partial<User>): Promise<User | undefined> {
    const res = await apiClient.patch(`/api/v1/users/${id}`, updatedData);
    return (res.data as any)?.data || res.data;
  },

  async deleteUser(id: string): Promise<boolean> {
    const res = await apiClient.delete(`/api/v1/users/${id}`);
    return !!res.data;
  }
};
