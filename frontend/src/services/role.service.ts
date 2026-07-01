import { Role, MOCK_ROLES } from '../data/mock-roles';
import { roleApi } from '../api/role.api';

export const roleService = {
  async getRoles(): Promise<Role[]> {
    try {
      const data = await roleApi.getRoles();
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug(e);
    }
    return [...MOCK_ROLES];
  },

  async getRole(id: string): Promise<Role | undefined> {
    try {
      const data = await roleApi.getRoleById(id);
      if (data) return data;
    } catch (e) {
      console.debug(e);
    }
    return MOCK_ROLES.find(r => r.id === id);
  },

  async createRole(role: Omit<Role, 'id' | 'modulesCount' | 'usersCount' | 'color' | 'bg'> & { color?: string, bg?: string }): Promise<Role> {
    const randomColors = [
      { color: 'text-purple-600', bg: 'bg-purple-100' },
      { color: 'text-indigo-600', bg: 'bg-indigo-100' },
      { color: 'text-teal-600', bg: 'bg-teal-100' },
      { color: 'text-rose-600', bg: 'bg-rose-100' },
      { color: 'text-violet-600', bg: 'bg-violet-100' },
    ];
    const colorPair = randomColors[MOCK_ROLES.length % randomColors.length];
    
    const apiRoleData = {
      ...role,
      color: role.color || colorPair.color,
      bg: role.bg || colorPair.bg,
    };

    try {
      const data = await roleApi.createRole(apiRoleData);
      if (data) return data;
    } catch (e) {
      console.debug(e);
    }

    const newRole: Role = {
      ...apiRoleData,
      id: `role-${MOCK_ROLES.length + 1}`,
      modulesCount: role.moduleIds.length,
      usersCount: 0,
    };
    MOCK_ROLES.push(newRole);
    return newRole;
  },

  async updateRole(id: string, updatedData: Partial<Role>): Promise<Role | undefined> {
    try {
      const data = await roleApi.updateRole(id, updatedData);
      if (data) return data;
    } catch (e) {
      console.debug(e);
    }
    const idx = MOCK_ROLES.findIndex(r => r.id === id);
    if (idx !== -1) {
      MOCK_ROLES[idx] = {
        ...MOCK_ROLES[idx],
        ...updatedData,
        modulesCount: updatedData.moduleIds ? updatedData.moduleIds.length : MOCK_ROLES[idx].modulesCount
      };
      return MOCK_ROLES[idx];
    }
    return undefined;
  },

  async deleteRole(id: string): Promise<boolean> {
    try {
      const success = await roleApi.deleteRole(id);
      if (success !== undefined) return success;
    } catch (e) {
      console.debug(e);
    }
    const idx = MOCK_ROLES.findIndex(r => r.id === id);
    if (idx !== -1) {
      MOCK_ROLES.splice(idx, 1);
      return true;
    }
    return false;
  }
};
