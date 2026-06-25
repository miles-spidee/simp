import { MOCK_PERMISSIONS, MOCK_PERMISSION_LIST, MOCK_PERMISSIONS_BY_MODULE, Permission } from '../data/mock-permissions';

export const permissionService = {
  async getPermissionsForModule(moduleId: string): Promise<string[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_PERMISSIONS_BY_MODULE[moduleId] || ['View', 'Create', 'Edit', 'Delete'];
  },

  async getPermissions(): Promise<Permission[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_PERMISSION_LIST;
  }
};
