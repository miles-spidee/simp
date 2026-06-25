"use client";

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { PermissionProvider } from '../context/PermissionContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PermissionProvider>
        {children}
      </PermissionProvider>
    </AuthProvider>
  );
}
