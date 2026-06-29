import { authApi } from '../api/auth.api';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, AssignRoleRequest, AssignPermissionRequest, ForgotPasswordRequest, ForgotPasswordVerify, ForgotPasswordReset, CurrentUserResponse, AuthActionResponse } from '../types/api/auth.types';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const AUTH_USER_KEY = 'auth_user';

export const authService = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return authApi.register(data);
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    const res = await authApi.login(data);
    if (res.access_token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(ACCESS_TOKEN_KEY, res.access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, res.refresh_token);
      }
    }
    return res;
  },

  async getCurrentUser(): Promise<CurrentUserResponse> {
    const user = await authApi.getCurrentUser();
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    }
    return user;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  },

  async assignRole(data: AssignRoleRequest): Promise<void> {
    return authApi.assignRole(data);
  },

  async assignPermission(data: AssignPermissionRequest): Promise<void> {
    return authApi.assignPermission(data);
  },

  async requestPasswordReset(data: ForgotPasswordRequest): Promise<AuthActionResponse> {
    return authApi.requestPasswordReset(data);
  },

  async verifyResetOtp(data: ForgotPasswordVerify): Promise<AuthActionResponse> {
    return authApi.verifyResetOtp(data);
  },

  async resetPassword(data: ForgotPasswordReset): Promise<AuthActionResponse> {
    return authApi.resetPassword(data);
  }
};
