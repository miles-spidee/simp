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
  // Organizational Data Isolation scopes
  collegeId?: string;
  batchId?: string;
  departmentId?: string;
}

export const MOCK_USERS: User[] = [
  // Super Admin
  { id: '0', name: 'Super Admin', username: 'superadmin', email: 'superadmin@pinesphere.com', roleId: 'role-5', roleName: 'Super Admin', status: 'Active', date: 'Oct 25, 2023', avatar: 'SA', moduleOverrides: [] },

  // Existing users
  { id: '1', name: 'Alice Freeman', username: 'alice_f', email: 'alice@example.com', roleId: 'role-1', roleName: 'Student', status: 'Active', date: 'Oct 24, 2023', avatar: 'AF', moduleOverrides: [], collegeId: 'col-1', batchId: 'batch-1' },
  { id: '2', name: 'Bob Johnson', username: 'bjohnson', email: 'bob@example.com', roleId: 'role-2', roleName: 'Mentor', status: 'Active', date: 'Oct 23, 2023', avatar: 'BJ', moduleOverrides: ['student'], batchId: 'batch-1' },
  { id: '3', name: 'Charlie Davis', username: 'charlie_d', email: 'charlie@example.com', roleId: 'role-3', roleName: 'HR', status: 'Inactive', date: 'Oct 22, 2023', avatar: 'CD', moduleOverrides: [], departmentId: 'dept-hr' },
  { id: '4', name: 'Diana Prince', username: 'dprince', email: 'diana@example.com', roleId: 'role-4', roleName: 'College Coordinator', status: 'Active', date: 'Oct 21, 2023', avatar: 'DP', moduleOverrides: [], collegeId: 'col-1' },
  { id: '5', name: 'Evan Wright', username: 'evan_w', email: 'evan@example.com', roleId: 'role-1', roleName: 'Student', status: 'Active', date: 'Oct 20, 2023', avatar: 'EW', moduleOverrides: [], collegeId: 'col-2', batchId: 'batch-2' },

  // Seed users per spec
  { id: '10', name: 'Priya Sharma', username: 'hr', email: 'hr@pinesphere.com', roleId: 'role-3', roleName: 'HR', status: 'Active', date: 'Jun 01, 2026', avatar: 'PS', moduleOverrides: [], departmentId: 'dept-hr' },
  { id: '11', name: 'Rahul Verma', username: 'mentor', email: 'mentor@pinesphere.com', roleId: 'role-2', roleName: 'Mentor', status: 'Active', date: 'Jun 01, 2026', avatar: 'RV', moduleOverrides: [], batchId: 'batch-1' },
  { id: '12', name: 'Ananya Desai', username: 'student', email: 'student@pinesphere.com', roleId: 'role-1', roleName: 'Student', status: 'Active', date: 'Jun 01, 2026', avatar: 'AD', moduleOverrides: [], collegeId: 'col-1', batchId: 'batch-1' },
  { id: '13', name: 'Diana Prince', username: 'coordinator', email: 'coordinator@pinesphere.com', roleId: 'role-4', roleName: 'College Coordinator', status: 'Active', date: 'Jun 01, 2026', avatar: 'DP', moduleOverrides: [], collegeId: 'col-1' },
];

