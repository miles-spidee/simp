"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Shield, Menu, X, LayoutGrid, Box, Package, FileText, CheckSquare, Award, MonitorPlay, Users as UsersIcon, UsersRound, Calendar, PieChart, Briefcase, Network, Settings, Building2, GraduationCap, FolderOpen } from 'lucide-react';
import { userService } from '@/src/services/user.service';
import { Module } from '@/src/data/mock-modules';
import { useAuth } from '@/src/context/AuthContext';

interface SidebarProps {
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

// Map module IDs to Lucide icons for visual variety
const iconMap: Record<string, any> = {
  identity: Shield,
  // employee: UsersIcon,
  // organization: Building2,
  // program: GraduationCap,
  opportunity: Briefcase,
  application: FileText,
  // student: UsersRound,
  // batch: Package,
  // allocation: Network,
  // mentor: Award,
  // lms: MonitorPlay,
  // task: CheckSquare,
  // assessment: FileText,
  // submission: Package,
  // attendance: Calendar,
  // performance: PieChart,
  // college_coordinator: Users,
  // dashboard: LayoutDashboard,
  // common_file: FolderOpen,
  // super_admin: Settings,
};

export function Sidebar({ isMobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    async function loadSidebarModules() {
      if (!user) return;
      try {
        const data = await userService.getUserModules(user.id);
        // Filter out dashboard, super_admin, and any modules that are commented out in iconMap
        const visibleModules = data.filter(m => 
          m.id !== 'dashboard' && 
          m.id !== 'super_admin' && 
          iconMap[m.id] !== undefined
        );
        setModules(visibleModules);
      } catch (err) {
        console.error("Failed to load modules for sidebar", err);
      }
    }
    loadSidebarModules();
  }, [user]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/80 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0a192f] text-slate-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-700/50 justify-between lg:justify-start">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-900/50">
              P
            </div>
            <span className="text-lg font-bold text-white tracking-wide">Pinesphere ERP</span>
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMobileOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {/* Static Dashboard Link */}
          <Link
            href="/admin"
            className={`group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === '/admin' 
                ? 'bg-blue-600/10 text-blue-400' 
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className={`h-5 w-5 shrink-0 ${pathname === '/admin' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`} />
            Dashboard
          </Link>

          <div className="pt-4 pb-2">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Modules Registry
            </h3>
          </div>

          {/* Dynamic Modules Links */}
          {modules.map((module) => {
            const IconComponent = iconMap[module.id] || LayoutGrid;
            
            // Special case for Identity module which has sub-routes built in our UI
            if (module.id === 'identity') {
              return (
                <div key={module.id} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-slate-400 flex items-center gap-x-3">
                    <IconComponent className="h-5 w-5 shrink-0" />
                    {module.name}
                  </div>
                  <ul className="pl-8 space-y-1 mt-1">
                    <li>
                      <Link
                        href="/admin/users"
                        className={`group flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          pathname === '/admin/users' 
                            ? 'bg-blue-600/10 text-blue-400' 
                            : 'hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Users className={`h-4 w-4 shrink-0 ${pathname === '/admin/users' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`} />
                        Users
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/roles"
                        className={`group flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          pathname === '/admin/roles' 
                            ? 'bg-blue-600/10 text-blue-400' 
                            : 'hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Shield className={`h-4 w-4 shrink-0 ${pathname === '/admin/roles' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`} />
                        Roles
                      </Link>
                    </li>
                  </ul>
                </div>
              );
            }

            // Standard Module rendering
            const route = `/admin${module.route}`;
            const isActive = pathname === route;
            
            return (
              <Link
                key={module.id}
                href={route}
                className={`group flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400' 
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <IconComponent className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`} />
                {module.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-x-4 px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
              SA
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">Super Admin</span>
              <span className="text-xs text-slate-400">admin@pinesphere.com</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
