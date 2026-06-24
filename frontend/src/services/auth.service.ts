import { authApi } from '../api/auth.api';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, AssignRoleRequest, AssignPermissionRequest } from '../types/api/auth.types';

export const authService = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return authApi.register(data);
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    const res = await authApi.login(data);
    if (res.access_token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
      }
    }
    return res;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  async assignRole(data: AssignRoleRequest): Promise<void> {
    return authApi.assignRole(data);
  },

  async assignPermission(data: AssignPermissionRequest): Promise<void> {
    return authApi.assignPermission(data);
  }
};
