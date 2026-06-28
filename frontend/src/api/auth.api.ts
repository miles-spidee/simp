import { apiClient } from './api.client';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, AssignRoleRequest, AssignPermissionRequest, ForgotPasswordRequest, ForgotPasswordVerify, ForgotPasswordReset } from '../types/api/auth.types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const res = await apiClient.post<RegisterResponse>('/api/v1/auth/register', data);
    return res.data;
  },
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const usernameLower = data.username.toLowerCase().trim();
    const devUsers = [
      { email: 'superadmin@pinesphere.com', username: 'superadmin', password: 'Admin@123', userId: '0' },
      { email: 'hr@pinesphere.com', username: 'hr', password: 'Hr@123', userId: '10' },
      { email: 'mentor@pinesphere.com', username: 'mentor', password: 'Mentor@123', userId: '11' },
      { email: 'student@pinesphere.com', username: 'student', password: 'Student@123', userId: '12' },
      { email: 'coordinator@pinesphere.com', username: 'coordinator', password: 'Coordinator@123', userId: '13' }
    ];

    const matchedDev = devUsers.find(
      u => (u.email === usernameLower || u.username === usernameLower) && u.password === data.password
    );

    if (matchedDev) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('dev_user_id', matchedDev.userId);
      }
      return {
        access_token: `mock-token-${matchedDev.userId}`,
        refresh_token: `mock-refresh-${matchedDev.userId}`,
        token_type: 'Bearer'
      };
    }

    const res = await apiClient.post<LoginResponse>('/api/v1/auth/login', data);
    return res.data;
  },
  assignRole: async (data: AssignRoleRequest): Promise<void> => {
    await apiClient.post('/api/v1/auth/assign-role', data);
  },
  assignPermission: async (data: AssignPermissionRequest): Promise<void> => {
    await apiClient.post('/api/v1/auth/assign-permission', data);
  },
  requestPasswordReset: async (data: ForgotPasswordRequest): Promise<any> => {
    const res = await apiClient.post('/api/v1/auth/forgot-password/request', data);
    return res.data;
  },
  verifyResetOtp: async (data: ForgotPasswordVerify): Promise<any> => {
    const res = await apiClient.post('/api/v1/auth/forgot-password/verify', data);
    return res.data;
  },
  resetPassword: async (data: ForgotPasswordReset): Promise<any> => {
    const res = await apiClient.post('/api/v1/auth/forgot-password/reset', data);
    return res.data;
  }
};
