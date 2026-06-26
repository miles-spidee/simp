"use client";

import React from 'react';
import { usePermissions } from '@/src/hooks/usePermissions';
import { AccessRestricted } from '@/components/common/AccessRestrictedModal';

interface PermissionGuardProps {
  required: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode | 'restricted';
  fallbackVariant?: 'modal' | 'inline' | 'page';
  requireAll?: boolean;
}

export function PermissionGuard({ 
  required, 
  children, 
  fallback = null, 
  fallbackVariant = 'inline',
  requireAll = false 
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission } = usePermissions();
  
  let isAuthorized = false;

  if (Array.isArray(required)) {
    if (requireAll) {
      isAuthorized = required.every(p => hasPermission(p));
    } else {
      isAuthorized = hasAnyPermission(required);
    }
  } else {
    isAuthorized = hasPermission(required);
  }

  if (!isAuthorized) {
    if (fallback === 'restricted') {
      return <AccessRestricted variant={fallbackVariant} />;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
