"use client";

import React, { useState } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { PermissionProvider } from '../context/PermissionContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorDialog } from '../components/common/ErrorDialog';
import { SuccessToast } from '../components/common/SuccessToast';

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
          <ErrorDialog />
          <SuccessToast />
        </PermissionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
