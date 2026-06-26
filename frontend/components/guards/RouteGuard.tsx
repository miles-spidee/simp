"use client";

import React from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { usePermissions } from '@/src/hooks/usePermissions';
import { usePathname, useRouter } from 'next/navigation';
import { AccessRestrictedModal } from './AccessRestrictedModal';

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { user, loading } = useAuth();
  const { canAccessRoute } = usePermissions();
  const pathname = usePathname();
  const router = useRouter();

  // Still loading auth state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated — layout handles redirect
  if (!user) {
    return null;
  }

  // Dashboard is always accessible
  if (pathname === '/feature') {
    return <>{children}</>;
  }

  // Check route-level access
  if (!canAccessRoute(pathname)) {
    return (
      <div className="relative min-h-[60vh] flex items-center justify-center font-sans">
        <div className="absolute inset-0 bg-slate-50/40 backdrop-blur-sm pointer-events-none" />
        <AccessRestrictedModal 
          isOpen={true} 
          onClose={() => router.push('/feature')} 
        />
      </div>
    );
  }

  return <>{children}</>;
}
