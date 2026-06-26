"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, Shield, X, LayoutGrid, Package, FileText, CheckSquare, Award,
  MonitorPlay, Users as UsersIcon, UsersRound, Calendar, PieChart, Briefcase, Network, Settings, 
  Building2, GraduationCap, FolderOpen, User, UserPlus, Map, BookOpen, ClipboardList,
  Lock, FileSignature, Key, Activity, ShieldAlert, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { usePermissions } from '@/src/hooks/usePermissions';

interface SidebarProps {
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface SidebarItem {
  label: string;
  href: string;
  moduleId: string;
  permission?: string;
  icon: LucideIcon;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Dashboard', href: '/admin', moduleId: 'dashboard', icon: LayoutDashboard },
  
  // Identity subpages
  { label: 'Identity - Users', href: '/admin/users', moduleId: 'identity', permission: 'identity.view', icon: Users },
  { label: 'Identity - Roles', href: '/admin/roles', moduleId: 'identity', permission: 'identity.view', icon: Key },
  { label: 'Identity - Permissions', href: '/admin/permissions', moduleId: 'identity', permission: 'identity.view', icon: Lock },
  { label: 'Identity - Sessions', href: '/admin/sessions', moduleId: 'identity', permission: 'identity.view', icon: Activity },
  { label: 'Identity - Security Center', href: '/admin/security', moduleId: 'identity', permission: 'identity.view', icon: ShieldAlert },
  
  // HR/Management modules
  { label: 'Employee', href: '/admin/employee', moduleId: 'employee', permission: 'employee.view', icon: UsersIcon },
  { label: 'Organization', href: '/admin/organization', moduleId: 'organization', permission: 'organization.view', icon: Building2 },
  { label: 'Program', href: '/admin/program', moduleId: 'program', permission: 'program.view', icon: GraduationCap },
  { label: 'Opportunity', href: '/admin/opportunity', moduleId: 'opportunity', permission: 'opportunity.view', icon: Briefcase },
  { label: 'Application', href: '/admin/application', moduleId: 'application', permission: 'application.view', icon: FileText },
  { label: 'Student', href: '/admin/student', moduleId: 'student', permission: 'student.view', icon: UsersRound },
  { label: 'Batch', href: '/admin/batch', moduleId: 'batch', permission: 'batch.view', icon: Package },
  { label: 'Allocation', href: '/admin/allocation', moduleId: 'allocation', permission: 'allocation.view', icon: Network },
  
  // Mentor subpages
  { label: 'Mentor Dashboard', href: '/admin/mentor', moduleId: 'mentor', permission: 'mentor.view', icon: Award },
  { label: 'Mentor Profile', href: '/admin/mentor/profile', moduleId: 'mentor', permission: 'mentor.view', icon: User },
  { label: 'Mentor Assignment', href: '/admin/mentor/assignment', moduleId: 'mentor', permission: 'mentor.view', icon: UserPlus },
  { label: 'Mentor Batch Mapping', href: '/admin/mentor/batch-mapping', moduleId: 'mentor', permission: 'mentor.view', icon: Map },
  
  // LMS subpages
  { label: 'LMS Dashboard', href: '/admin/lms', moduleId: 'lms', permission: 'lms.view', icon: MonitorPlay },
  { label: 'LMS Management', href: '/admin/lms/management', moduleId: 'lms', permission: 'lms.view', icon: Settings },
  { label: 'LMS My Learning', href: '/admin/lms/my-learning', moduleId: 'lms', permission: 'lms.view', icon: BookOpen },
  
  // Attendance subpages
  { label: 'Attendance Dashboard', href: '/admin/attendance', moduleId: 'attendance', permission: 'attendance.view', icon: Calendar },
  { label: 'Attendance Management', href: '/admin/attendance/management', moduleId: 'attendance', permission: 'attendance.view', icon: Calendar },
  { label: 'Attendance My Attendance', href: '/admin/attendance/my-attendance', moduleId: 'attendance', permission: 'attendance.view', icon: Calendar },
  
  // Task subpages
  { label: 'Task Dashboard', href: '/admin/task', moduleId: 'task', permission: 'task.view', icon: CheckSquare },
  { label: 'Task Management', href: '/admin/task/management', moduleId: 'task', permission: 'task.view', icon: CheckSquare },
  { label: 'Task My Tasks', href: '/admin/task/my-tasks', moduleId: 'task', permission: 'task.view', icon: ClipboardList },
  
  // Assessment subpages
  { label: 'Assessment Dashboard', href: '/admin/assessment', moduleId: 'assessment', permission: 'assessment.view', icon: FileText },
  { label: 'Assessment Management', href: '/admin/assessment/management', moduleId: 'assessment', permission: 'assessment.view', icon: FileText },
  { label: 'Assessment My Assessments', href: '/admin/assessment/my-assessments', moduleId: 'assessment', permission: 'assessment.view', icon: FileSignature },
  
  { label: 'Submission', href: '/admin/submissions', moduleId: 'submission', permission: 'submission.view', icon: Package },
  { label: 'Performance', href: '/admin/performance', moduleId: 'performance', permission: 'performance.view', icon: PieChart },
  { label: 'College Coordinator', href: '/admin/coordinator', moduleId: 'college_coordinator', permission: 'college_coordinator.view', icon: Users },
  { label: 'Common Files', href: '/admin/files', moduleId: 'common_file', permission: 'common_file.view', icon: FolderOpen },
  { label: 'Super Admin', href: '/admin/super-admin', moduleId: 'super_admin', permission: 'super_admin.view', icon: Settings },
];

export function Sidebar({ isMobileOpen, setMobileOpen, isCollapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { hasModule, hasPermission, isSuperAdmin } = usePermissions();

  const isLinkActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  // Filter menu items dynamically based on module and permissions
  const filteredItems = SIDEBAR_ITEMS.filter(item => {
    // If user has the module assigned
    const hasMod = hasModule(item.moduleId);
    if (!hasMod) return false;

    // Check specific permission if specified
    if (item.permission && !isSuperAdmin) {
      return hasPermission(item.permission);
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
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
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
            const active = isLinkActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center rounded-lg py-2.5 transition-all duration-150 ${
                  active 
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 font-bold' 
                    : 'hover:bg-slate-800 hover:text-white border border-transparent text-slate-400'
                } ${isCollapsed ? 'justify-center px-0' : 'px-3 gap-x-3'}`}
              >
                <IconComponent className={`h-5 w-5 shrink-0 transition-colors ${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {!isCollapsed && (
                  <span className="text-xs uppercase tracking-wider whitespace-nowrap truncate font-semibold animate-fade-in">
                    {item.label}
                  </span>
                )}
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
              title="Sign Out"
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
