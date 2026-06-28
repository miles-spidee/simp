"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { X, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { usePermissions } from '@/src/hooks/usePermissions';
import { FEATURE_REGISTRY } from '@/src/core/features/feature-registry';

interface SidebarProps {
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isMobileOpen, setMobileOpen, isCollapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { hasModule, hasPermission, isSuperAdmin } = usePermissions();

  const isLinkActive = (href: string) => {
    if (href === '/feature') {
      return pathname === '/feature';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Filter menu items dynamically based on module and permissions from FEATURE_REGISTRY
  const filteredItems = FEATURE_REGISTRY.filter(item => {
    // If user has the module assigned
    const hasMod = hasModule(item.moduleId);
    if (!hasMod) return false;

    // Check specific permission if specified
    if (item.permissionKey && !isSuperAdmin) {
      return hasPermission(item.permissionKey);
    }

    return true;
  });

  return (
    <>
      {/* Mobile drawer backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 bg-[#0b1329] text-slate-300 transition-all duration-300 ease-in-out lg:static lg:inset-auto flex flex-col border-r border-slate-800 ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 lg:translate-x-0'
        } ${
          isCollapsed ? 'lg:w-20' : 'lg:w-72'
        }`}
      >
        {/* Branding header */}
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-800 justify-between">
          <Link href="/feature" className="flex items-center gap-3 overflow-hidden">
            <div className="h-8 w-8 shrink-0 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-500/30">
              P
            </div>
            {!isCollapsed && (
              <span className="text-sm font-black text-white tracking-wider uppercase font-sans whitespace-nowrap animate-fade-in">
                Pinesphere ERP
              </span>
            )}
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMobileOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Dynamic Sidebar Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1 font-sans select-none custom-scrollbar">
          {filteredItems.map((item) => {
            const IconComponent = item.icon;
            const active = isLinkActive(item.route);
            return (
              <Link
                key={item.featureId}
                href={item.route}
                onClick={() => setMobileOpen(false)}
                className={`
                  group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200
                  ${active 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
                `}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <IconComponent className={`h-5 w-5 shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                  {!isCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap truncate animate-fade-in">
                      {item.navigationLabel}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / User section */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className={`flex items-center justify-between ${isCollapsed ? 'flex-col gap-2' : 'px-2 py-2'}`}>
            <div className="flex items-center gap-x-3 overflow-hidden">
              <div className="h-9 w-9 shrink-0 rounded-full bg-slate-200 border border-white shadow-sm flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}&backgroundColor=0f172a,1e293b,334155`} 
                  alt={user?.name || "User"} 
                  className="h-full w-full object-cover" 
                />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden animate-fade-in">
                  <p className="text-sm font-bold text-slate-200 truncate leading-tight">{user?.name || "User"}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 truncate mt-0.5">{user?.roleName || "Role"}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-red-950/30 hover:text-red-400 transition-colors"
             
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
          
          {/* Collapse sidebar toggle button for desktop/tablet */}
          <div className="hidden lg:flex justify-end mt-4 pt-2 border-t border-slate-800/50">
            <button 
              onClick={() => setCollapsed(!isCollapsed)} 
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
