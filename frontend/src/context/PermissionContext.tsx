"use client";

import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { Module } from '../data/mock-modules';
import { ROUTE_MODULE_MAP } from '../data/mock-permissions';

interface PermissionContextType {
  modules: Module[];
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasModule: (moduleId: string) => boolean;
  canAccessRoute: (route: string) => boolean;
  isSuperAdmin: boolean;
}

const PermissionContext = createContext<PermissionContextType>({
  modules: [],
  permissions: [],
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasModule: () => false,
  canAccessRoute: () => false,
  isSuperAdmin: false,
});

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const value = useMemo<PermissionContextType>(() => {
    if (!user) {
      return {
        modules: [],
        permissions: [],
        hasPermission: () => false,
        hasAnyPermission: () => false,
        hasModule: () => false,
        canAccessRoute: () => false,
        isSuperAdmin: false,
      };
    }

    const isSuperAdmin = user.permissions.includes('all');
    const permissionSet = new Set(user.permissions);
    const moduleIdSet = new Set(user.modules.map(m => m.id));

    const hasPermission = (permission: string): boolean => {
      if (isSuperAdmin) return true;
      return permissionSet.has(permission);
    };

    const hasAnyPermission = (permissions: string[]): boolean => {
      if (isSuperAdmin) return true;
      return permissions.some(p => permissionSet.has(p));
    };

    const hasModule = (moduleId: string): boolean => {
      if (isSuperAdmin) return true;
      return moduleIdSet.has(moduleId);
    };

    const canAccessRoute = (route: string): boolean => {
      if (isSuperAdmin) return true;
      // The admin dashboard is always accessible
      if (route === '/feature') return true;

      // Find the matching module for this route
      // Check exact match first, then check if route starts with any known prefix
      const exactModule = ROUTE_MODULE_MAP[route];
      if (exactModule) return moduleIdSet.has(exactModule);

      // Check prefix match for sub-routes (e.g. /admin/lms/management matches /admin/lms)
      const routeKeys = Object.keys(ROUTE_MODULE_MAP).sort((a, b) => b.length - a.length);
      for (const key of routeKeys) {
        if (route.startsWith(key + '/') || route === key) {
          return moduleIdSet.has(ROUTE_MODULE_MAP[key]);
        }
      }

      // Unknown route — deny by default
      return false;
    };

    return {
      modules: user.modules,
      permissions: user.permissions,
      hasPermission,
      hasAnyPermission,
      hasModule,
      canAccessRoute,
      isSuperAdmin,
    };
  }, [user]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export { PermissionContext };
