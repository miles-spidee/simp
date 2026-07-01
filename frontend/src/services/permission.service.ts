import { Permission } from '../types/api/permission.types';
const MOCK_PERMISSIONS: any[] = [];

export const permissionService = {
  async getPermissionsForModule(moduleId: string): Promise<string[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return ['View', 'Create', 'Edit', 'Delete'];
  },

  async getPermissions(): Promise<Permission[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_PERMISSIONS;
  }
};
