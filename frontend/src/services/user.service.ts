import { User, MOCK_USERS } from '../data/mock-users';
import { roleService } from './role.service';
import { moduleService } from './module.service';
import { Module } from '../data/mock-modules';

export const userService = {
  async getUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MOCK_USERS];
  },

  async getUser(id: string): Promise<User | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_USERS.find(u => u.id === id);
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_USERS.find(u => u.email === email);
  },

  async getUserModules(id: string): Promise<Module[]> {
    const user = await this.getUser(id);
    if (!user) return [];

    const role = await roleService.getRole(user.roleId);
    let allowedModuleIds = new Set<string>();

    if (role && role.moduleIds) {
      role.moduleIds.forEach(m => allowedModuleIds.add(m));
    }

    if (user.moduleOverrides) {
      user.moduleOverrides.forEach(m => allowedModuleIds.add(m));
    }

    const allModules = await moduleService.getModules();

    // Super Admin gets all modules
    if (role && role.permissions.includes('all')) {
      return allModules.filter(m => m.active);
    }

    return allModules.filter(m => allowedModuleIds.has(m.id) && m.active);
  },

  async getUserPermissions(id: string): Promise<string[]> {
    const user = await this.getUser(id);
    if (!user) return [];

    const role = await roleService.getRole(user.roleId);
    if (!role) return [];

    return role.permissions;
  },

  async createUser(user: Omit<User, 'id' | 'date' | 'avatar'> & { avatar?: string }): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = {
      ...user,
      id: `user-${MOCK_USERS.length + 1}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      avatar: user.avatar || user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      status: user.status || 'Active'
    };
    MOCK_USERS.push(newUser);
    return newUser;
  },

  async updateUser(id: string, updatedData: Partial<User>): Promise<User | undefined> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const idx = MOCK_USERS.findIndex(u => u.id === id);
    if (idx !== -1) {
      MOCK_USERS[idx] = {
        ...MOCK_USERS[idx],
        ...updatedData
      };
      return MOCK_USERS[idx];
    }
    return undefined;
  },

  async deleteUser(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const idx = MOCK_USERS.findIndex(u => u.id === id);
    if (idx !== -1) {
      MOCK_USERS.splice(idx, 1);
      return true;
    }
    return false;
  }
};
