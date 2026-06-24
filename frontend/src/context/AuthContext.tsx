"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

// TODO: Waiting for backend endpoint to fetch current user profile
export interface AuthUser {
  user_id: string;
  name: string;
  email: string;
  roleName: string; // Temporarily keeping camelCase for roleName until we fix all pages
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
  logout: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (token) {
      // Mocking user profile until we have a real /me endpoint
      setUser({
        user_id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        roleName: 'Super Admin'
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
    setUser({
      user_id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      roleName: 'Super Admin'
    });
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
