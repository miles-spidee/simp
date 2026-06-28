export interface Role {
  id: string;
  name: string;
  code: string;
  desc: string;
  status: 'Active' | 'Inactive';
  modulesCount: number;
  usersCount: number;
  color: string;
  bg: string;
  moduleIds: string[];
  permissions: string[];
}

export type RoleCreate = Omit<Role, 'id' | 'modulesCount' | 'usersCount'>;
export type RoleUpdate = Partial<RoleCreate>;
