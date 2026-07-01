import { apiClient } from './api.client';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, AssignRoleRequest, AssignPermissionRequest, ForgotPasswordRequest, ForgotPasswordVerify, ForgotPasswordReset, CurrentUserResponse, AuthActionResponse } from '../types/api/auth.types';
import { MOCK_MODULES } from '../data/mock-modules';
import { FEATURE_REGISTRY } from '../core/features/feature-registry';

const hrModules = MOCK_MODULES.filter(m => ['DASHBOARD', 'EMPLOYEE', 'ORG', 'PROGRAM', 'OPPORTUNITY', 'APP', 'STUDENT', 'BATCH', 'ALLOC'].includes(m.code));
const mentorModules = MOCK_MODULES.filter(m => ['DASHBOARD', 'MENTOR', 'LMS', 'ATTEND', 'TASK', 'ASSESS'].includes(m.code));
const studentModules = MOCK_MODULES.filter(m => ['DASHBOARD', 'MLEARN', 'MATTEND', 'MTASK', 'MASSESS', 'CERT'].includes(m.code));
const coordinatorModules = MOCK_MODULES.filter(m => ['DASHBOARD', 'STUDENT', 'BATCH', 'COLLEGE_COORD'].includes(m.code));

const DEMO_USERS: Record<string, CurrentUserResponse & { _password?: string }> = {
  'demo-superadmin': {
    user_id: 'usr-demo-sa',
    name: 'Demo Super Admin',
    email: 'superadmin@pinesphere.com',
    roleName: 'Super Admin',
    roleId: 'role-sa',
    roleCode: 'SUPER_ADMIN',
    modules: MOCK_MODULES,
    permissions: ['all'],
    _password: 'Admin@123'
  },
  'demo-hr': {
    user_id: 'usr-demo-hr',
    name: 'Demo HR',
    email: 'hr@pinesphere.com',
    roleName: 'HR Manager',
    roleId: 'role-hr',
    roleCode: 'HR',
    modules: hrModules,
    permissions: FEATURE_REGISTRY.filter(f => hrModules.some(m => m.id === f.moduleId)).map(f => f.permissionKey),
    _password: 'Hr@123'
  },
  'demo-mentor': {
    user_id: 'usr-demo-mentor',
    name: 'Demo Mentor',
    email: 'mentor@pinesphere.com',
    roleName: 'Mentor',
    roleId: 'role-mentor',
    roleCode: 'MENTOR',
    modules: mentorModules,
    permissions: FEATURE_REGISTRY.filter(f => mentorModules.some(m => m.id === f.moduleId)).map(f => f.permissionKey),
    _password: 'Mentor@123'
  },
  'demo-student': {
    user_id: 'usr-demo-student',
    name: 'Demo Student',
    email: 'student@pinesphere.com',
    roleName: 'Student',
    roleId: 'role-student',
    roleCode: 'STUDENT',
    modules: studentModules,
    permissions: FEATURE_REGISTRY.filter(f => studentModules.some(m => m.id === f.moduleId)).map(f => f.permissionKey),
    _password: 'Student@123'
  },
  'demo-coordinator': {
    user_id: 'usr-demo-coordinator',
    name: 'Demo College Coordinator',
    email: 'coordinator@pinesphere.com',
    roleName: 'College Coordinator',
    roleId: 'role-coordinator',
    roleCode: 'COORDINATOR',
    modules: coordinatorModules,
    permissions: FEATURE_REGISTRY.filter(f => coordinatorModules.some(m => m.id === f.moduleId)).map(f => f.permissionKey),
    _password: 'Coordinator@123'
  }
};

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const res = await apiClient.post<RegisterResponse>('/api/v1/auth/register', data);
    return res.data;
  },
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const demoToken = Object.keys(DEMO_USERS).find(
      key => DEMO_USERS[key].email === data.username && DEMO_USERS[key]._password === data.password
    );
    if (demoToken) {
      return {
        access_token: demoToken,
        refresh_token: `${demoToken}-refresh`,
        token_type: 'Bearer'
      };
    }
    const res = await apiClient.post<LoginResponse>('/api/v1/auth/login', data);
    return res.data;
  },
  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && DEMO_USERS[token]) {
        const { _password, ...user } = DEMO_USERS[token];
        return user as CurrentUserResponse;
      }
    }
    const res = await apiClient.get<CurrentUserResponse>('/api/v1/auth/me');
    return res.data;
  },
  assignRole: async (data: AssignRoleRequest): Promise<void> => {
    await apiClient.post('/api/v1/auth/assign-role', data);
  },
  assignPermission: async (data: AssignPermissionRequest): Promise<void> => {
    await apiClient.post('/api/v1/auth/assign-permission', data);
  },
  requestPasswordReset: async (data: ForgotPasswordRequest): Promise<AuthActionResponse> => {
    const res = await apiClient.post<AuthActionResponse>('/api/v1/auth/forgot-password/request', data);
    return res.data;
  },
  verifyResetOtp: async (data: ForgotPasswordVerify): Promise<AuthActionResponse> => {
    const res = await apiClient.post<AuthActionResponse>('/api/v1/auth/forgot-password/verify', data);
    return res.data;
  },
  resetPassword: async (data: ForgotPasswordReset): Promise<AuthActionResponse> => {
    const res = await apiClient.post<AuthActionResponse>('/api/v1/auth/forgot-password/reset', data);
    return res.data;
  }
};
