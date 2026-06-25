"use client";

import React, { useState } from 'react';
import { usePermissions } from '@/src/hooks/usePermissions';
import { AccessRestrictedModal } from './AccessRestrictedModal';

interface PermissionGuardProps {
  /** Permission string or array of permissions (any match = allowed) */
  permission: string | string[];
  /** Behavior when permission is denied */
  fallback?: 'hide' | 'disable' | 'modal';
  children: React.ReactNode;
}

export function PermissionGuard({ permission, fallback = 'hide', children }: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission } = usePermissions();
  const [showModal, setShowModal] = useState(false);

  const isAllowed = Array.isArray(permission)
    ? hasAnyPermission(permission)
    : hasPermission(permission);

  if (isAllowed) {
    return <>{children}</>;
  }

  switch (fallback) {
    case 'hide':
      return null;

    case 'disable':
      return (
        <div className="opacity-50 pointer-events-none cursor-not-allowed select-none" aria-disabled="true">
          {children}
        </div>
      );

    case 'modal':
      return (
        <>
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowModal(true);
            }}
            className="cursor-not-allowed"
          >
            {children}
          </div>
          <AccessRestrictedModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
      );

    default:
      return null;
  }
}
