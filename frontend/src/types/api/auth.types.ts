import type { Module } from './module.types';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user_id: string;
  username: string;
  email: string;
  is_active: boolean;
  is_email_verified: boolean;
  is_first_login: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface CurrentUserResponse {
  user_id: string;
  name: string;
  email: string;
  roleName: string;
  roleId: string;
  roleCode: string;
  modules: Module[];
  permissions: string[];
}

export interface AuthActionResponse {
  message: string;
  success?: boolean;
}

export interface AssignRoleRequest {
  user_id: string;
  role_id: string;
}

export interface AssignPermissionRequest {
  role_id: string;
  permission_id: string;
}

export interface ForgotPasswordRequest {
  username: string;
}

export interface ForgotPasswordVerify {
  username: string;
  otp: string;
}

export interface ForgotPasswordReset {
  username: string;
  otp: string;
  newPassword: string;
}
