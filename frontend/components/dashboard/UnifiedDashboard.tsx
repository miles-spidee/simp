"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/admin/ui/Card';
import { Badge } from '@/components/admin/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/admin/ui/Table';
import {
  Users, Shield, UserCheck, LayoutGrid, Clock, ArrowRight,
  LayoutDashboard, Package, FileText, CheckSquare, Award, MonitorPlay,
  UsersRound, Calendar, PieChart, Briefcase, Network, Settings,
  Building2, GraduationCap, FolderOpen, Activity, AlertTriangle,
  BookOpen, Bell
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { usePermissions } from '@/src/hooks/usePermissions';
import { userService } from '@/src/services/user.service';
import { roleService } from '@/src/services/role.service';
import { moduleService } from '@/src/services/module.service';
import { User } from '@/src/data/mock-users';
import { Module } from '@/src/data/mock-modules';

// Map module IDs to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  identity: Shield,
  employee: Users,
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

// ─────────────────────────────── KPI SECTION ───────────────────────────────
function KPISection({ isSuperAdmin, hasModule }: { isSuperAdmin: boolean; hasModule: (id: string) => boolean }) {
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, totalRoles: 0, totalModules: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [usersData, rolesData, modulesData] = await Promise.all([
          userService.getUsers(),
          roleService.getRoles(),
          moduleService.getModules(),
        ]);
        setStats({
          totalUsers: usersData.length,
          activeUsers: usersData.filter(u => u.status === 'Active').length,
          totalRoles: rolesData.length,
          totalModules: modulesData.length,
        });
      } catch (err) {
        console.error('Failed to load KPI data', err);
      }
    }
    load();
  }, []);

  // Super Admin / HR see system-wide KPIs
  if (isSuperAdmin || hasModule('employee')) {
    const kpis = [
      { title: 'Total Users', value: stats.totalUsers, icon: Users, change: '+12%', changeType: 'positive' as const },
      { title: 'Total Roles', value: stats.totalRoles, icon: Shield, change: '0%', changeType: 'neutral' as const },
      { title: 'Active Users', value: stats.activeUsers, icon: UserCheck, change: '+5%', changeType: 'positive' as const },
      { title: 'Total Modules', value: stats.totalModules, icon: LayoutGrid, change: '+2', changeType: 'positive' as const },
    ];
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <kpi.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className={`font-medium ${kpi.changeType === 'positive' ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {kpi.change}
                </span>
                <span className="text-slate-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Mentor KPIs
  if (hasModule('mentor') || hasModule('task')) {
    const mentorKpis = [
      { title: 'Assigned Students', value: 12, icon: UsersRound, color: 'bg-blue-50 text-blue-600' },
      { title: 'Pending Reviews', value: 5, icon: CheckSquare, color: 'bg-amber-50 text-amber-600' },
      { title: 'Tasks to Review', value: 8, icon: FileText, color: 'bg-purple-50 text-purple-600' },
      { title: 'Attendance Rate', value: '92%', icon: Calendar, color: 'bg-emerald-50 text-emerald-600' },
    ];
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mentorKpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-lg shrink-0 ${kpi.color}`}>
                <kpi.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Student KPIs
  const studentKpis = [
    { title: 'Attendance', value: '88%', desc: 'Threshold is 85%', status: 'Normal', color: 'border-l-4 border-emerald-500' },
    { title: 'LMS Progress', value: '33%', desc: '3 modules complete', status: 'Ahead', color: 'border-l-4 border-blue-600' },
    { title: 'Pending Tasks', value: '3', desc: 'Due this week', status: 'Active', color: 'border-l-4 border-amber-500' },
    { title: 'Performance', value: '78/100', desc: 'Updated weekly', status: 'Good', color: 'border-l-4 border-indigo-600' },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {studentKpis.map((stat, idx) => (
        <div key={idx} className={`bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all duration-300 ${stat.color}`}>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</div>
          <div className="text-2xl font-black text-slate-800 mt-2 tracking-tight">{stat.value}</div>
          <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 mt-3 pt-2 border-t border-slate-100">
            <span>{stat.desc}</span>
            <span className="text-blue-600 font-bold uppercase tracking-wide">{stat.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────── MODULE REGISTRY GRID ──────────────────────────
function ModuleRegistryGrid({ modules }: { modules: Module[] }) {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">ERP Module Registry</h2>
        <Badge variant="secondary">{modules.length} Available</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {modules.map((module) => {
          const IconComponent = iconMap[module.id] || LayoutGrid;
          const href = module.route === '/admin' ? '/admin' : `/admin${module.route}`;
          return (
            <Link key={module.id} href={href} className="block group">
              <Card className="h-full transition-all hover:shadow-md hover:border-blue-500/30 bg-white">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <Badge variant={module.active ? 'success' : 'secondary'} className="text-[10px]">
                      {module.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                    {module.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 flex-grow">
                    {module.desc || `Manage ${module.name.toLowerCase()} functionality.`}
                  </p>
                  <div className="mt-4 flex items-center text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Access Module <ArrowRight className="h-3 w-3 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────── ROLE WIDGETS ──────────────────────────────────

function AdminWidgets() {
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  useEffect(() => {
    userService.getUsers().then(data => setRecentUsers(data.slice(0, 4)));
  }, []);

  const recentActivity = [
    { id: 1, action: 'User Created', target: 'John Doe', time: '2 mins ago', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
    { id: 2, action: 'Role Updated', target: 'Mentor', time: '1 hour ago', icon: Shield, color: 'text-amber-500', bg: 'bg-amber-100' },
    { id: 3, action: 'Module Assigned', target: 'LMS to HR', time: '3 hours ago', icon: LayoutGrid, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { id: 4, action: 'User Created', target: 'Jane Smith', time: '5 hours ago', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 pt-2">
      <div className="lg:col-span-1">
        <Card className="h-full">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-400" />
            <h3 className="font-semibold text-slate-900">Recent Activity</h3>
          </div>
          <CardContent className="p-6">
            <div className="space-y-6">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex gap-4 relative">
                  {index !== recentActivity.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-[-24px] w-px bg-slate-200" />
                  )}
                  <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activity.bg}`}>
                    <activity.icon className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                    <p className="text-sm text-slate-500">{activity.target}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="h-full">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">System Status</h3>
          </div>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">Loading...</TableCell>
                  </TableRow>
                ) : recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">{user.avatar}</div>
                        <span className="font-medium text-slate-900">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-slate-600">{user.roleName}</span></TableCell>
                    <TableCell><Badge variant={user.status === 'Active' ? 'success' : 'secondary'}>{user.status}</Badge></TableCell>
                    <TableCell><span className="text-slate-500">{user.date}</span></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HRWidgets() {
  const stats = [
    { title: 'Applications Pending Review', value: 14, icon: FileText, color: 'bg-amber-50 text-amber-600' },
    { title: 'New Students This Month', value: 28, icon: UsersRound, color: 'bg-blue-50 text-blue-600' },
    { title: 'Active Programs', value: 6, icon: GraduationCap, color: 'bg-purple-50 text-purple-600' },
    { title: 'Active Batches', value: 12, icon: Package, color: 'bg-emerald-50 text-emerald-600' },
  ];
  return (
    <div className="space-y-4 pt-2">
      <h2 className="text-lg font-bold text-slate-900">HR Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-lg shrink-0 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MentorWidgets() {
  const items = [
    { title: 'Assessments to Evaluate', value: 7, icon: FileText, href: '/admin/assessment' },
    { title: 'Tasks to Review', value: 5, icon: CheckSquare, href: '/admin/task' },
    { title: 'Student Performance', value: 'View', icon: PieChart, href: '/admin/performance' },
    { title: 'Attendance Summary', value: 'View', icon: Calendar, href: '/admin/attendance' },
  ];
  return (
    <div className="space-y-4 pt-2">
      <h2 className="text-lg font-bold text-slate-900">Mentor Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <Link key={idx} href={item.href} className="group block">
            <Card className="hover:shadow-md hover:border-blue-500/30 transition-all">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">{item.title}</p>
                    <h3 className="text-xl font-bold text-slate-900">{item.value}</h3>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StudentWidgets() {
  const quickLinks = [
    { title: 'My Tasks', desc: 'View and submit tasks', href: '/admin/task', icon: CheckSquare },
    { title: 'My Assessments', desc: 'Upcoming quizzes & exams', href: '/admin/assessment', icon: FileText },
    { title: 'My Attendance', desc: 'View attendance record', href: '/admin/attendance', icon: Calendar },
    { title: 'LMS', desc: 'Continue learning', href: '/admin/lms', icon: MonitorPlay },
    { title: 'Performance', desc: 'View your scores', href: '/admin/performance', icon: PieChart },
  ];
  return (
    <div className="space-y-4 pt-2">
      <h2 className="text-lg font-bold text-slate-900">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((link, idx) => (
          <Link key={idx} href={link.href} className="group block">
            <Card className="hover:shadow-md hover:border-blue-500/30 transition-all">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <link.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{link.title}</h3>
                  <p className="text-xs text-slate-500">{link.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────── MAIN DASHBOARD ───────────────────────────────
export default function UnifiedDashboard() {
  const { user } = useAuth();
  const { isSuperAdmin, hasModule, modules } = usePermissions();

  if (!user) return null;

  // Determine the role category for widgets
  const roleCode = user.roleCode;
  const isHR = roleCode === 'ROLE_HR';
  const isMentor = roleCode === 'ROLE_MENTOR';
  const isStudent = roleCode === 'ROLE_STUDENT';

  // Filter visible modules for the registry grid (exclude dashboard and super_admin from cards)
  const registryModules = modules.filter(m => m.id !== 'dashboard' && m.id !== 'super_admin');

  return (
    <div className="space-y-8 animate-slide-in">
      <section className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {user.name.split(' ')[0]}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isSuperAdmin
                ? 'Full system overview — all modules and permissions active.'
                : `Logged in as ${user.roleName}. Showing your assigned modules and widgets.`}
            </p>
          </div>
          <Badge variant="default" className="self-start text-xs">
            {user.roleName}
          </Badge>
        </div>

        {/* KPI Section */}
        <KPISection isSuperAdmin={isSuperAdmin} hasModule={hasModule} />

        {/* Module Registry Grid */}
        <ModuleRegistryGrid modules={registryModules} />

        {/* Role-Based Widgets */}
        {isSuperAdmin && <AdminWidgets />}
        {isHR && !isSuperAdmin && <HRWidgets />}
        {isMentor && !isSuperAdmin && <MentorWidgets />}
        {isStudent && !isSuperAdmin && <StudentWidgets />}
      </section>
    </div>
  );
}
