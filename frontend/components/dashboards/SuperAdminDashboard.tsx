import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/admin/ui/Card';
import { 
  Users, Shield, UserCheck, LayoutGrid, Clock,
  LayoutDashboard, Package, FileText, CheckSquare, Award, MonitorPlay, Users as UsersIcon, 
  UsersRound, Calendar, PieChart, Briefcase, Network, Settings, 
  Building2, GraduationCap, FolderOpen, ArrowRight
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/admin/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/admin/ui/Table';
import { userService } from '@/src/services/user.service';
import { roleService } from '@/src/services/role.service';
import { moduleService } from '@/src/services/module.service';
import { User } from '@/src/data/mock-users';
import { Module } from '@/src/data/mock-modules';
import { useAuth } from '@/src/context/AuthContext';

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

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRoles: 0,
    totalModules: 0,
  });

  useEffect(() => {
    async function loadData() {
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

        setRecentUsers(usersData.slice(0, 4));

        // Load modules based on user role
        if (user) {
          if (user.roleName === 'Super Admin' || user.roleName === 'System Admin') {
            setModules(modulesData);
          } else {
            const userModules = await userService.getUserModules(user.user_id);
            setModules(userModules);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    }
    loadData();
  }, [user]);

  const kpis = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, change: '+12%', changeType: 'positive' },
    { title: 'Total Roles', value: stats.totalRoles, icon: Shield, change: '0%', changeType: 'neutral' },
    { title: 'Active Users', value: stats.activeUsers, icon: UserCheck, change: '+5%', changeType: 'positive' },
    { title: 'Modules Assigned', value: stats.totalModules, icon: LayoutGrid, change: '+2', changeType: 'positive' },
  ];

  const recentActivity = [
    { id: 1, action: 'User Created', target: 'John Doe', time: '2 mins ago', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
    { id: 2, action: 'Role Updated', target: 'Mentor', time: '1 hour ago', icon: Shield, color: 'text-amber-500', bg: 'bg-amber-100' },
    { id: 3, action: 'Module Assigned', target: 'LMS to HR', time: '3 hours ago', icon: LayoutGrid, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { id: 4, action: 'User Created', target: 'Jane Smith', time: '5 hours ago', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
  ];

  return (
    <div className="space-y-8 animate-slide-in">
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Overview</h1>
            <p className="text-sm text-slate-500 mt-1">Monitor key platform metrics across all tenants and users.</p>
          </div>
        </div>

        {/* KPI Section */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600`}>
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

        {/* Module Registry Grid */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">ERP Module Registry</h2>
            <Badge variant="secondary">{modules.length} Available</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {modules.map((module) => {
              const IconComponent = iconMap[module.id] || LayoutGrid;
              // Avoid generating /admin/admin links
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
                        {module.desc || `Manage and configure ${module.name.toLowerCase()} functionality.`}
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 pt-2">
          {/* Recent Activity */}
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

          {/* System Status */}
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
                        <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
                              {user.avatar}
                            </div>
                            <span className="font-medium text-slate-900">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-600">{user.roleName}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'Active' ? 'success' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-500">{user.date}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
