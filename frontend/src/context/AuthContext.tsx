"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Module } from '../types/api/module.types';
import type { CurrentUserResponse } from '../types/api/auth.types';
import { authService } from '../services/auth.service';

const ACCESS_TOKEN_KEY = 'access_token';
const AUTH_USER_KEY = 'auth_user';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

export interface AuthUser extends CurrentUserResponse {
  modules: Module[];
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  login: async () => {},
  logout: () => {},
});

function readStoredAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawUser = localStorage.getItem(AUTH_USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function initializeAuth() {
      const token = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;

      if (!token) {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        const storedUser = readStoredAuthUser();
        if (!cancelled) {
          setUser(storedUser);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
