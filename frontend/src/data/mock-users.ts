export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  roleId: string;
  roleName: string;
  status: 'Active' | 'Inactive';
  date: string;
  avatar: string;
  moduleOverrides?: string[];
}

export const MOCK_USERS: User[] = [
  { id: '0', name: 'System Admin', username: 'admin', email: 'admin@pinesphere.com', roleId: 'role-5', roleName: 'Super Admin', status: 'Active', date: 'Oct 25, 2023', avatar: 'SA', moduleOverrides: [] },
  { id: '1', name: 'Alice Freeman', username: 'alice_f', email: 'alice@example.com', roleId: 'role-1', roleName: 'Student', status: 'Active', date: 'Oct 24, 2023', avatar: 'AF', moduleOverrides: [] },
  { id: '2', name: 'Bob Johnson', username: 'bjohnson', email: 'bob@example.com', roleId: 'role-2', roleName: 'Mentor', status: 'Active', date: 'Oct 23, 2023', avatar: 'BJ', moduleOverrides: ['student'] },
  { id: '3', name: 'Charlie Davis', username: 'charlie_d', email: 'charlie@example.com', roleId: 'role-3', roleName: 'HR', status: 'Inactive', date: 'Oct 22, 2023', avatar: 'CD', moduleOverrides: [] },
  { id: '4', name: 'Diana Prince', username: 'dprince', email: 'diana@example.com', roleId: 'role-4', roleName: 'College Coordinator', status: 'Active', date: 'Oct 21, 2023', avatar: 'DP', moduleOverrides: [] },
  { id: '5', name: 'Evan Wright', username: 'evan_w', email: 'evan@example.com', roleId: 'role-1', roleName: 'Student', status: 'Active', date: 'Oct 20, 2023', avatar: 'EW', moduleOverrides: [] },
];
