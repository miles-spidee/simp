import { apiClient } from './api.client';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, AssignRoleRequest, AssignPermissionRequest, ForgotPasswordRequest, ForgotPasswordVerify, ForgotPasswordReset } from '../types/api/auth.types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const res = await apiClient.post<RegisterResponse>('/api/v1/auth/register', data);
    return res.data;
  },
  login: async (data: LoginRequest): Promise<LoginResponse> => {
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
