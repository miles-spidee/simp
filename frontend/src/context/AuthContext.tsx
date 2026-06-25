"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { MOCK_USERS } from '../data/mock-users';
import { MOCK_ROLES } from '../data/mock-roles';
import { MOCK_MODULES, Module } from '../data/mock-modules';

export interface AuthUser {
  user_id: string;
  name: string;
  email: string;
  roleName: string;
  roleId: string;
  roleCode: string;
  modules: Module[];
  permissions: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  login: () => {},
  logout: () => {},
  switchUser: () => {},
});

function resolveAuthUser(userId: string): AuthUser | null {
  const mockUser = MOCK_USERS.find(u => u.id === userId);
  if (!mockUser) return null;

  const role = MOCK_ROLES.find(r => r.id === mockUser.roleId);
  if (!role) return null;

  const isSuperAdmin = role.permissions.includes('all');

  // Collect module IDs from role + user overrides
  const allowedModuleIds = new Set<string>(role.moduleIds);
  if (mockUser.moduleOverrides) {
    mockUser.moduleOverrides.forEach(m => allowedModuleIds.add(m));
  }

  // Resolve modules
  const modules = isSuperAdmin
    ? MOCK_MODULES.filter(m => m.active)
    : MOCK_MODULES.filter(m => allowedModuleIds.has(m.id) && m.active);

  return {
    user_id: mockUser.id,
    name: mockUser.name,
    email: mockUser.email,
    roleName: mockUser.roleName,
    roleId: role.id,
    roleCode: role.code,
    modules,
    permissions: role.permissions,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (token) {
      // Check if there's a saved user_id for dev switching
      const savedUserId = typeof window !== 'undefined' ? localStorage.getItem('dev_user_id') : null;
      const userId = savedUserId || '0'; // Default to Super Admin
      const resolved = resolveAuthUser(userId);
      setUser(resolved);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = useCallback((token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
    const savedUserId = typeof window !== 'undefined' ? localStorage.getItem('dev_user_id') : null;
    const userId = savedUserId || '0';
    setUser(resolveAuthUser(userId));
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('dev_user_id');
    }
    setUser(null);
  }, []);

  const switchUser = useCallback((userId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dev_user_id', userId);
    }
    const resolved = resolveAuthUser(userId);
    setUser(resolved);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
