"use client";

import React from 'react';
import { Card, CardContent } from '@/components/admin/ui/Card';
import { Badge } from '@/components/admin/ui/Badge';
import { useAuth } from '@/src/context/AuthContext';
import { usePermissions } from '@/src/hooks/usePermissions';
import { WIDGET_REGISTRY, WidgetDefinition } from '@/src/core/dashboard/widget-registry';
import { 
  ShieldCheck, Activity, Users, FileText, GraduationCap, 
  Award, Clock, Calendar, BookOpen, CheckSquare 
} from 'lucide-react';

// --- MOCK WIDGET COMPONENTS ---

const SystemHealthWidget = () => (
  <Card className="border-emerald-200 bg-emerald-50 h-full">
    <div className="p-4 border-b border-emerald-100 flex items-center gap-2">
      <ShieldCheck className="h-5 w-5 text-emerald-600" />
      <h3 className="font-bold text-slate-800">System Health</h3>
    </div>
    <CardContent className="p-4">
      <div className="space-y-3 text-sm">
        <div className="flex justify-between"><span>API Latency</span><span className="text-emerald-600 font-bold">18ms</span></div>
        <div className="flex justify-between"><span>Database CPU</span><span className="text-emerald-600 font-bold">12%</span></div>
      </div>
    </CardContent>
  </Card>
);

const RecentActivityWidget = () => (
  <Card className="border-slate-200 bg-white h-full">
    <div className="p-4 border-b border-slate-100 flex items-center gap-2">
      <Activity className="h-5 w-5 text-blue-500" />
      <h3 className="font-bold text-slate-800">Recent Platform Activity</h3>
    </div>
    <CardContent className="p-4">
      <p className="text-sm text-slate-500">System-wide activity log mock data...</p>
    </CardContent>
  </Card>
);

const EmployeeKPIWidget = () => (
  <Card className="border-slate-200 bg-white h-full">
    <div className="p-4 border-b border-slate-100 flex items-center gap-2">
      <Users className="h-5 w-5 text-indigo-500" />
      <h3 className="font-bold text-slate-800">Employee KPI</h3>
    </div>
    <CardContent className="p-4">
      <div className="text-2xl font-black text-slate-900">1,240</div>
      <p className="text-xs text-slate-500">Total Active Employees</p>
    </CardContent>
  </Card>
);

const ApplicationsKPIWidget = () => (
  <Card className="border-slate-200 bg-white h-full">
    <div className="p-4 border-b border-slate-100 flex items-center gap-2">
      <FileText className="h-5 w-5 text-amber-500" />
      <h3 className="font-bold text-slate-800">Applications KPI</h3>
    </div>
    <CardContent className="p-4">
      <div className="text-2xl font-black text-slate-900">84</div>
      <p className="text-xs text-slate-500">Pending Reviews</p>
    </CardContent>
  </Card>
);

const ProgramStatsWidget = () => (
  <Card className="border-slate-200 bg-white h-full">
    <div className="p-4 border-b border-slate-100 flex items-center gap-2">
      <GraduationCap className="h-5 w-5 text-blue-500" />
      <h3 className="font-bold text-slate-800">Program Stats</h3>
    </div>
    <CardContent className="p-4">
      <div className="text-2xl font-black text-slate-900">12</div>
      <p className="text-xs text-slate-500">Active Programs</p>
    </CardContent>
  </Card>
);

const AssignedStudentsWidget = () => (
  <Card className="border-slate-200 bg-white h-full">
    <div className="p-4 border-b border-slate-100 flex items-center gap-2">
      <Award className="h-5 w-5 text-purple-500" />
      <h3 className="font-bold text-slate-800">Assigned Students</h3>
    </div>
    <CardContent className="p-4">
      <div className="text-2xl font-black text-slate-900">45</div>
      <p className="text-xs text-slate-500">Students across 2 batches</p>
    </CardContent>
  </Card>
);

const PendingReviewsWidget = () => (
  <Card className="border-slate-200 bg-white h-full">
    <div className="p-4 border-b border-slate-100 flex items-center gap-2">
      <Clock className="h-5 w-5 text-rose-500" />
      <h3 className="font-bold text-slate-800">Pending Reviews</h3>
    </div>
    <CardContent className="p-4">
      <div className="text-2xl font-black text-slate-900">8</div>
      <p className="text-xs text-slate-500">Submissions awaiting review</p>
    </CardContent>
  </Card>
);

const AttendanceSummaryWidget = () => (
  <Card className="border-slate-200 bg-white h-full">
    <div className="p-4 border-b border-slate-100 flex items-center gap-2">
      <Calendar className="h-5 w-5 text-emerald-500" />
      <h3 className="font-bold text-slate-800">Attendance Summary</h3>
    </div>
    <CardContent className="p-4">
      <div className="text-2xl font-black text-slate-900">92%</div>
      <p className="text-xs text-slate-500">Current Month</p>
    </CardContent>
  </Card>
);

const LearningProgressWidget = () => (
  <Card className="border-slate-200 bg-white h-full">
    <div className="p-4 border-b border-slate-100 flex items-center gap-2">
      <BookOpen className="h-5 w-5 text-blue-500" />
      <h3 className="font-bold text-slate-800">Learning Progress</h3>
    </div>
    <CardContent className="p-4">
      <div className="text-2xl font-black text-slate-900">65%</div>
      <p className="text-xs text-slate-500">Frontend Track Completion</p>
    </CardContent>
  </Card>
);

const UpcomingTasksWidget = () => (
  <Card className="border-slate-200 bg-white h-full">
    <div className="p-4 border-b border-slate-100 flex items-center gap-2">
      <CheckSquare className="h-5 w-5 text-amber-500" />
      <h3 className="font-bold text-slate-800">Upcoming Tasks</h3>
    </div>
    <CardContent className="p-4">
      <div className="text-2xl font-black text-slate-900">3</div>
      <p className="text-xs text-slate-500">Tasks due this week</p>
    </CardContent>
  </Card>
);

// --- WIDGET RENDERER ---

function renderWidget(widget: WidgetDefinition) {
  switch (widget.widgetId) {
    case 'sys_health': return <SystemHealthWidget />;
    case 'recent_activity': return <RecentActivityWidget />;
    case 'employee_kpi': return <EmployeeKPIWidget />;
    case 'applications_kpi': return <ApplicationsKPIWidget />;
    case 'program_stats': return <ProgramStatsWidget />;
    case 'assigned_students': return <AssignedStudentsWidget />;
    case 'pending_reviews': return <PendingReviewsWidget />;
    case 'attendance_summary': return <AttendanceSummaryWidget />;
    case 'learning_progress': return <LearningProgressWidget />;
    case 'upcoming_tasks': return <UpcomingTasksWidget />;
    default: return <div className="p-4 text-slate-400">Unknown Widget: {widget.name}</div>;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD SHELL
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardShell() {
  const { user } = useAuth();
  const { isSuperAdmin, hasModule, hasPermission } = usePermissions();

  if (!user) return null;

  // Filter widgets based on WIDGET_REGISTRY, user roles, and permissions
  const authorizedWidgets = WIDGET_REGISTRY.filter((widget) => {
    // Check if widget supports user's role
    const supportsRole = widget.supportedRoles.includes('*') || 
                         widget.supportedRoles.includes(user.roleName) || 
                         (isSuperAdmin && widget.supportedRoles.includes('Super Admin'));
    
    if (!supportsRole) return false;

    // Check module access
    if (!hasModule(widget.moduleId)) return false;

    // Check specific permission access
    if (widget.permissionKey && !isSuperAdmin) {
      if (!hasPermission(widget.permissionKey)) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-slide-in">
      <section className="space-y-6">
        {/* Welcome Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {user.name.split(' ')[0]}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isSuperAdmin
                ? 'Full enterprise administration access. All systems operational.'
                : `Logged in as ${user.roleName}. Showing dynamic workspace widgets.`}
            </p>
          </div>
          <Badge variant="default" className="self-start text-xs font-bold px-3 py-1 bg-slate-900 text-white rounded">
            {user.roleName}
          </Badge>
        </div>

        {/* Dynamic Widgets Rendered from Registry */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {authorizedWidgets.map((widget) => {
            // Apply col-span based on size
            let colSpan = 'col-span-1';
            if (widget.size === 'medium') colSpan = 'col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2';
            if (widget.size === 'large') colSpan = 'col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-3';
            if (widget.size === 'full') colSpan = 'col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4';

            return (
              <div key={widget.widgetId} className={colSpan}>
                {renderWidget(widget)}
              </div>
            );
          })}
        </div>

        {authorizedWidgets.length === 0 && (
          <div className="p-12 text-center text-slate-500 bg-white border border-slate-200 rounded-xl">
            No widgets available for your current role and permissions.
          </div>
        )}
      </section>
    </div>
  );
}
