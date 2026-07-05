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
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 bg-sidebar text-text-primary transition-all duration-300 ease-in-out md:static md:inset-auto flex flex-col border-r border-border ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 md:translate-x-0'
        } ${
          isCollapsed ? 'md:w-20' : 'md:w-72'
        }`}
      >
        {/* Branding header */}
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-border justify-between">
          <Link href="/feature" className="flex items-center gap-3 overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Pinesphere Logo" 
              className={`h-15 w-auto object-contain transition-transform hover:scale-[1.02] animate-fade-in ${isCollapsed && !isMobileOpen ? 'hidden' : 'block'}`} 
            />
            <img 
              src="/pinesphere_ai_app_icon.png" 
              alt="Pinesphere Icon" 
              className={`h-8 w-8 object-contain transition-transform hover:scale-[1.02] animate-fade-in shadow-sm shadow-primary/30 rounded ${isCollapsed && !isMobileOpen ? 'block' : 'hidden'}`} 
            />
          </Link>
          <button className="md:hidden text-text-secondary hover:text-text-primary cursor-pointer" onClick={() => setMobileOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop Sidebar Toggle */}
        <div className={`hidden md:flex items-center mt-5 px-5 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Menu</span>}
          <button 
            onClick={() => setCollapsed(!isCollapsed)} 
            className="p-1 rounded-md text-text-secondary hover:bg-selected hover:text-primary transition-colors cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 font-sans select-none custom-scrollbar">
          {filteredItems.map((item) => {
            const IconComponent = item.icon;
            const active = isLinkActive(item.route);
            return (
              <Link
                key={item.featureId}
                href={item.route}
                onClick={() => setMobileOpen(false)}
                className={`
                  group flex items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-200 cursor-pointer
                  ${active 
                    ? 'bg-selected text-primary shadow-sm shadow-primary/5 font-bold' 
                    : 'text-text-secondary hover:bg-selected/60 hover:text-primary-hover font-medium'}
                `}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <IconComponent className={`h-5 w-5 shrink-0 ${active ? 'text-primary' : 'text-text-secondary group-hover:text-primary-hover'}`} />
                  <span className={`text-sm font-medium whitespace-nowrap truncate animate-fade-in ${isCollapsed && !isMobileOpen ? 'hidden' : 'block'}`}>
                    {item.navigationLabel}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / User section */}
        <div className="p-4 border-t border-border shrink-0">
          <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'justify-between px-2 py-2'}`}>
            <div className="flex items-center gap-x-3 overflow-hidden">
              <div className="h-9 w-9 shrink-0 rounded-full bg-selected border border-border shadow-sm flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}&backgroundColor=3183C8,256DB4,83B9E5`} 
                  alt={user?.name || "User"} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div className={`overflow-hidden animate-fade-in font-premium ${isCollapsed && !isMobileOpen ? 'hidden' : 'block'}`}>
                <p className="text-sm font-bold text-text-primary truncate leading-tight">{user?.name || "User"}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-text-secondary truncate mt-0.5">{user?.roleName || "Role"}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="p-1.5 rounded-lg text-text-secondary hover:bg-error/10 hover:text-error transition-colors cursor-pointer"
             
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
