"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Shield, X, LayoutGrid,
  Package, FileText, CheckSquare, Award, MonitorPlay, Users as UsersIcon, 
  UsersRound, Calendar, PieChart, Briefcase, Network, Settings, 
  Building2, GraduationCap, FolderOpen
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { usePermissions } from '@/src/hooks/usePermissions';

interface SidebarProps {
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

// Map module IDs to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  identity: Shield,
  employee: UsersIcon,
  organization: Building2,
  program: GraduationCap,
  opportunity: Briefcase,
  application: FileText,
  student: UsersRound,
  batch: Package,
  allocation: Network,
  mentor: Award,
  lms: MonitorPlay,
  task: CheckSquare,
  assessment: FileText,
  submission: Package,
  attendance: Calendar,
  performance: PieChart,
  college_coordinator: Users,
  dashboard: LayoutDashboard,
  common_file: FolderOpen,
  super_admin: Settings,
};

// Sub-menu definitions for modules that have sub-pages
const MODULE_SUBMENUS: Record<string, { label: string; href: string }[]> = {
  identity: [
    { label: 'Users', href: '/admin/users' },
    { label: 'Roles', href: '/admin/roles' },
    { label: 'Permissions', href: '/admin/permissions' },
    { label: 'Sessions', href: '/admin/sessions' },
    { label: 'Security Center', href: '/admin/security' },
  ],
  lms: [
    { label: 'Dashboard', href: '/admin/lms' },
    { label: 'LMS Management', href: '/admin/lms/management' },
    { label: 'My Learning', href: '/admin/lms/my-learning' },
  ],
  task: [
    { label: 'Dashboard', href: '/admin/task' },
    { label: 'Task Management', href: '/admin/task/management' },
    { label: 'My Tasks', href: '/admin/task/my-tasks' },
  ],
  assessment: [
    { label: 'Dashboard', href: '/admin/assessment' },
    { label: 'Assessment Management', href: '/admin/assessment/management' },
    { label: 'My Assessments', href: '/admin/assessment/my-assessments' },
  ],
  attendance: [
    { label: 'Dashboard', href: '/admin/attendance' },
    { label: 'Attendance Management', href: '/admin/attendance/management' },
    { label: 'My Attendance', href: '/admin/attendance/my-attendance' },
  ],
  mentor: [
    { label: 'Mentor Dashboard', href: '/admin/mentor' },
    { label: 'Mentor Profile', href: '/admin/mentor/profile' },
    { label: 'Mentor Assignment', href: '/admin/mentor/assignment' },
    { label: 'Mentor Batch Mapping', href: '/admin/mentor/batch-mapping' },
  ],
};

export function Sidebar({ isMobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { modules } = usePermissions();

  const isLinkActive = (href: string) => pathname === href;

  // Filter out dashboard and super_admin from sidebar modules list
  const visibleModules = modules.filter(m => 
    m.id !== 'dashboard' && 
    m.id !== 'super_admin' && 
    iconMap[m.id] !== undefined
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/80 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0b1329] text-slate-300 transform transition-transform duration-350 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col border-r border-slate-800`}
      >
        {/* Header Branding */}
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-800 justify-between lg:justify-start">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-500/30">
              P
            </div>
            <span className="text-base font-black text-white tracking-wider uppercase font-sans">Pinesphere ERP</span>
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMobileOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-4 font-sans select-none custom-scrollbar">
          
          {/* Main Dashboard Link */}
          <Link
            href="/admin"
            className={`group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
              pathname === '/admin' 
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20' 
                : 'hover:bg-slate-850 hover:text-white border border-transparent'
            }`}
          >
            <LayoutDashboard className={`h-4.5 w-4.5 shrink-0 ${pathname === '/admin' ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-350'}`} />
            Dashboard
          </Link>

          <div className="pt-2 pb-1">
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Modules Registry
            </h3>
          </div>

          <div className="space-y-3">
            {visibleModules.map((module) => {
              const IconComponent = iconMap[module.id] || LayoutGrid;
              const subMenuItems = MODULE_SUBMENUS[module.id];

              // Modules with sub-menus
              if (subMenuItems) {
                return (
                  <div key={module.id} className="space-y-1">
                    <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2.5">
                      <IconComponent className="h-4.5 w-4.5 text-slate-455" />
                      <span>{module.name}</span>
                    </div>
                    <div className="pl-6 space-y-1 pt-1 border-l border-slate-850 ml-5">
                      {subMenuItems.map(({ label, href }) => (
                        <Link
                          key={href}
                          href={href}
                          className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            isLinkActive(href) ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              // Default single-link modules
              const route = `/admin${module.route}`;
              const isActive = pathname === route;
              
              return (
                <Link
                  key={module.id}
                  href={route}
                  className={`group flex items-center gap-x-3 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive 
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20' 
                      : 'hover:bg-slate-850 hover:text-white border border-transparent'
                  }`}
                >
                  <IconComponent className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-350'}`} />
                  {module.name}
                </Link>
              );
            })}
          </div>

        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-x-4 px-2 py-2">
            <div className="h-9 w-9 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}&backgroundColor=0f172a,1e293b,334155`} alt={user?.name || "User"} className="h-full w-full object-cover" />
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-bold text-slate-200 truncate leading-tight">{user?.name || "User"}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate mt-0.5">{user?.roleName || "Role"}</p>
              <p className="text-[9px] font-mono text-slate-400 mt-1 truncate hidden xl:block">ID: {user?.user_id || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
