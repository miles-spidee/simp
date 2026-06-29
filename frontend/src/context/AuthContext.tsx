"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Module } from '../types/api/module.types';

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
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    // Check token existence. The backend /me endpoint should be called here in the future
    // to populate the user context. For now, we clear loading once checked.
    if (!token) {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = useCallback((token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
    // After login, the user profile should be fetched from the backend.
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
