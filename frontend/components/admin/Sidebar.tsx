"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Shield, Menu, X, LayoutGrid, Box, 
  Package, FileText, CheckSquare, Award, MonitorPlay, Users as UsersIcon, 
  UsersRound, Calendar, PieChart, Briefcase, Network, Settings, 
  Building2, GraduationCap, FolderOpen, Key, Activity, ShieldAlert
} from 'lucide-react';
import { userService } from '@/src/services/user.service';
import { Module } from '@/src/data/mock-modules';
import { useAuth } from '@/src/context/AuthContext';

interface SidebarProps {
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

// Map module IDs to Lucide icons
const iconMap: Record<string, any> = {
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

export function Sidebar({ isMobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);

  const isLinkActive = (href: string) => {
    return pathname === href;
  };

  useEffect(() => {
    async function loadSidebarModules() {
      if (!user) return;
      try {
        const data = await userService.getUserModules(user.id);
        // Filter out dashboard, super_admin, and modules not present in the iconMap
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
            {modules.map((module) => {
              const IconComponent = iconMap[module.id] || LayoutGrid;

              // 1. Identity Module Subpoints
              if (module.id === 'identity') {
                return (
                  <div key={module.id} className="space-y-1">
                    <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2.5">
                      <IconComponent className="h-4.5 w-4.5 text-slate-455" />
                      <span>{module.name}</span>
                    </div>
                    <div className="pl-6 space-y-1 pt-1 border-l border-slate-850 ml-5">
                      <Link
                        href="/admin/users"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/users') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Users
                      </Link>
                      <Link
                        href="/admin/roles"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/roles') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Roles
                      </Link>
                      <Link
                        href="/admin/permissions"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/permissions') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Permissions
                      </Link>
                      <Link
                        href="/admin/sessions"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/sessions') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Sessions
                      </Link>
                      <Link
                        href="/admin/security"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/security') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Security Center
                      </Link>
                    </div>
                  </div>
                );
              }

              // 2. LMS Module Subpoints
              if (module.id === 'lms') {
                return (
                  <div key={module.id} className="space-y-1">
                    <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2.5">
                      <IconComponent className="h-4.5 w-4.5 text-slate-455" />
                      <span>{module.name}</span>
                    </div>
                    <div className="pl-6 space-y-1 pt-1 border-l border-slate-850 ml-5">
                      <Link
                        href="/admin/lms"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/lms') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/admin/lms/management"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/lms/management') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        LMS Management
                      </Link>
                      <Link
                        href="/admin/lms/my-learning"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/lms/my-learning') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        My Learning
                      </Link>
                    </div>
                  </div>
                );
              }

              // 3. Tasks Module Subpoints
              if (module.id === 'task') {
                return (
                  <div key={module.id} className="space-y-1">
                    <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2.5">
                      <IconComponent className="h-4.5 w-4.5 text-slate-455" />
                      <span>Tasks</span>
                    </div>
                    <div className="pl-6 space-y-1 pt-1 border-l border-slate-850 ml-5">
                      <Link
                        href="/admin/task"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/task') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/admin/task/management"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/task/management') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Task Management
                      </Link>
                      <Link
                        href="/admin/task/my-tasks"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/task/my-tasks') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        My Tasks
                      </Link>
                    </div>
                  </div>
                );
              }

              // 4. Assessments Module Subpoints
              if (module.id === 'assessment') {
                return (
                  <div key={module.id} className="space-y-1">
                    <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2.5">
                      <IconComponent className="h-4.5 w-4.5 text-slate-455" />
                      <span>Assessments</span>
                    </div>
                    <div className="pl-6 space-y-1 pt-1 border-l border-slate-850 ml-5">
                      <Link
                        href="/admin/assessment"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/assessment') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/admin/assessment/management"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/assessment/management') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Assessment Management
                      </Link>
                      <Link
                        href="/admin/assessment/my-assessments"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/assessment/my-assessments') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        My Assessments
                      </Link>
                    </div>
                  </div>
                );
              }

              // 5. Attendance Module Subpoints
              if (module.id === 'attendance') {
                return (
                  <div key={module.id} className="space-y-1">
                    <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2.5">
                      <IconComponent className="h-4.5 w-4.5 text-slate-455" />
                      <span>Attendance</span>
                    </div>
                    <div className="pl-6 space-y-1 pt-1 border-l border-slate-850 ml-5">
                      <Link
                        href="/admin/attendance"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/attendance') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/admin/attendance/management"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/attendance/management') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Attendance Management
                      </Link>
                      <Link
                        href="/admin/attendance/my-attendance"
                        className={`flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          isLinkActive('/admin/attendance/my-attendance') ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        My Attendance
                      </Link>
                    </div>
                  </div>
                );
              }

              // 6. Default standard routing rendering
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
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
              SA
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-none">Super Admin</span>
              <span className="text-[10px] text-slate-500 mt-1 leading-none">admin@pinesphere.com</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
