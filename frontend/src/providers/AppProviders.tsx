"use client";

import React, { useState } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { PermissionProvider } from '../context/PermissionContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PermissionProvider>
          {children}
        </PermissionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
