"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/feature/ui/Card';
import { Badge } from '@/components/feature/ui/Badge';
import { useAuth } from '@/src/context/AuthContext';
import { usePermissions } from '@/src/hooks/usePermissions';
import { WIDGET_REGISTRY, WidgetDefinition } from '@/src/core/dashboard/widget-registry';

import { CalendarService } from '@/src/services/calendar.service';
import { NotificationService } from '@/src/services/notification.service';
import { HelpdeskService } from '@/src/services/helpdesk.service';
import { ProductivityService } from '@/src/services/productivity.service';
import { IDCardAPI } from '@/src/api/idcard.api';
import { mentorService } from '@/src/services/mentor.service';
import { submissionService } from '@/src/services/submission.service';
import { CommunicationService } from '@/src/services/communication.service';


import { 
  ShieldCheck, Activity, Users, FileText, GraduationCap, 
  Award, Clock, Calendar, BookOpen, CheckSquare,
  TrendingUp, DollarSign, Target, PieChart, BarChart2,
  Bell, MessageSquare, Mail, Building, ShieldAlert,
  Trophy, LifeBuoy, Gift, Store, CreditCard, Bookmark, Flag, Briefcase
} from 'lucide-react';

// --- MOCK WIDGET COMPONENTS ---

const SystemHealthWidget = () => (
  <Card className="border-emerald-200 bg-emerald-50 h-full">
    <div className="p-4 border-b border-emerald-100 flex items-center gap-2">
      <ShieldCheck className="h-5 w-5 text-emerald-600" />
      <h3 className="font-bold text-text-primary">System Health</h3>
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
  <Card className="border-border bg-white h-full">
    <div className="p-4 border-b border-border flex items-center gap-2">
      <Activity className="h-5 w-5 text-blue-500" />
      <h3 className="font-bold text-text-primary">Recent Platform Activity</h3>
    </div>
    <CardContent className="p-4">
      <p className="text-sm text-text-secondary">System-wide activity log mock data...</p>
    </CardContent>
  </Card>
);

const EmployeeKPIWidget = () => (
  <Card className="border-border bg-white h-full">
    <div className="p-4 border-b border-border flex items-center gap-2">
      <Users className="h-5 w-5 text-indigo-500" />
      <h3 className="font-bold text-text-primary">Employee KPI</h3>
    </div>
    <CardContent className="p-4">
      <div className="text-2xl font-black text-text-primary">1,240</div>
      <p className="text-xs text-text-secondary">Total Active Employees</p>
    </CardContent>
  </Card>
);

const ApplicationsKPIWidget = () => (
  <Card className="border-border bg-white h-full">
    <div className="p-4 border-b border-border flex items-center gap-2">
      <FileText className="h-5 w-5 text-amber-500" />
      <h3 className="font-bold text-text-primary">Applications KPI</h3>
    </div>
    <CardContent className="p-4">
      <div className="text-2xl font-black text-text-primary">84</div>
      <p className="text-xs text-text-secondary">Pending Reviews</p>
    </CardContent>
  </Card>
);

const ProgramStatsWidget = () => (
  <Card className="border-border bg-white h-full">
    <div className="p-4 border-b border-border flex items-center gap-2">
      <GraduationCap className="h-5 w-5 text-blue-500" />
      <h3 className="font-bold text-text-primary">Program Stats</h3>
    </div>
    <CardContent className="p-4">
      <div className="text-2xl font-black text-text-primary">12</div>
      <p className="text-xs text-text-secondary">Active Programs</p>
    </CardContent>
  </Card>
);

const AssignedStudentsWidget = ({ count, loading }: { count: number; loading: boolean }) => (
  <Card className="border-border bg-white h-full flex flex-col hover:shadow-md transition-shadow">
    <div className="p-4 border-b border-border flex items-center gap-2">
      <Award className="h-5 w-5 text-purple-500" />
      <h3 className="font-bold text-text-primary">Assigned Students</h3>
    </div>
    <CardContent className="p-4 flex-1 flex flex-col justify-center">
      {loading ? (
        <div className="h-6 w-12 bg-slate-100 animate-pulse rounded" />
      ) : (
        <div className="text-2xl font-black text-text-primary">{count}</div>
      )}
      <p className="text-xs text-text-secondary mt-1">Students assigned to you</p>
    </CardContent>
  </Card>
);

const PendingReviewsWidget = ({ count, loading }: { count: number; loading: boolean }) => (
  <Card className="border-border bg-white h-full flex flex-col hover:shadow-md transition-shadow">
    <div className="p-4 border-b border-border flex items-center gap-2">
      <Clock className="h-5 w-5 text-rose-500" />
      <h3 className="font-bold text-text-primary">Pending Reviews</h3>
    </div>
    <CardContent className="p-4 flex-1 flex flex-col justify-center">
      {loading ? (
        <div className="h-6 w-12 bg-slate-100 animate-pulse rounded" />
      ) : (
        <div className="text-2xl font-black text-text-primary">{count}</div>
      )}
      <p className="text-xs text-text-secondary mt-1">Submissions awaiting review</p>
    </CardContent>
  </Card>
);

const AttendanceSummaryWidget = () => (
  <Card className="border-border bg-white h-full">
    <div className="p-4 border-b border-border flex items-center gap-2">
      <Calendar className="h-5 w-5 text-emerald-500" />
      <h3 className="font-bold text-text-primary">Attendance Summary</h3>
    </div>
    <CardContent className="p-4">
      <div className="text-2xl font-black text-text-primary">92%</div>
      <p className="text-xs text-text-secondary">Current Month</p>
    </CardContent>
  </Card>
);

const LearningProgressWidget = () => (
  <Card className="border-border bg-white h-full">
    <div className="p-4 border-b border-border flex items-center gap-2">
      <BookOpen className="h-5 w-5 text-blue-500" />
      <h3 className="font-bold text-text-primary">Learning Progress</h3>
    </div>
    <CardContent className="p-4">
      <div className="text-2xl font-black text-text-primary">65%</div>
      <p className="text-xs text-text-secondary">Frontend Track Completion</p>
    </CardContent>
  </Card>
);

const UpcomingTasksWidget = () => (
  <Card className="border-border bg-white h-full">
    <div className="p-4 border-b border-border flex items-center gap-2">
      <CheckSquare className="h-5 w-5 text-amber-500" />
      <h3 className="font-bold text-text-primary">Upcoming Tasks</h3>
    </div>
    <CardContent className="p-4">
      <div className="text-2xl font-black text-text-primary">3</div>
      <p className="text-xs text-text-secondary">Tasks due this week</p>
    </CardContent>
  </Card>
);

const WIDGET_ICONS: Record<string, React.ElementType> = {
  unread_notifications: Bell,
  todays_events: Calendar,
  upcoming_interviews: Users,
  pending_announcements: MessageSquare,
  unread_messages: Mail,
  scheduled_notifications: Clock,
  notification_analytics: BarChart2,
  communication_activity: Activity,
  certificates_issued: Award,
  pending_certificate_approvals: Clock,
  placement_success_rate: TrendingUp,
  offer_letters_generated: FileText,
  students_hired: Briefcase,
  upcoming_interviews_placement: Calendar,
  top_hiring_companies: Building,
  alumni_growth: GraduationCap,
  verification_requests: ShieldCheck,
  analytics_overview: PieChart,
  executive_summary: FileText,
  attendance_trend: TrendingUp,
  performance_trend: Activity,
  revenue_growth: DollarSign,
  recent_reports: FileText,
  kpi_summary: Target,
  open_tickets: LifeBuoy,
  my_requests: MessageSquare,
  referral_rewards: Gift,
  recommended_internships: Briefcase,
  marketplace_stats: Store,
  idcard_status: CreditCard,
  bookmarks: Bookmark,
  upcoming_tasks_productivity: CheckSquare,
  placement_growth: TrendingUp,
  top_performing_colleges: Building,
  top_performing_programs: Trophy,
  certificate_analytics: PieChart,
  student_risk_overview: ShieldAlert,
  upcoming_milestones: Flag,
};

interface GenericWidgetProps {
  widget: WidgetDefinition;
  dynamicData?: {
    todaysEvents: number;
    upcomingInterviews: number;
    unreadNotifications: number;
    unreadMessages: number;
    myRequests: number;
    idcardStatus: string;
    bookmarks: number;
    upcomingTasks: number;
    loading: boolean;
  };
}


const GenericWidget = ({ widget, dynamicData }: GenericWidgetProps) => {
  // Generate a consistent seed based on the widget id
  const seed = widget.widgetId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  let valueStr = "";
  let trendStr = "";
  let Icon = WIDGET_ICONS[widget.widgetId] || Activity;
  let iconColor = "text-text-secondary";
  
  const nameLower = widget.name.toLowerCase();
  
  // Dynamic value mappings if available
  if (dynamicData && !dynamicData.loading) {
    if (widget.widgetId === 'todays_events') {
      valueStr = dynamicData.todaysEvents.toString();
      trendStr = 'Scheduled events today';
      iconColor = "text-blue-500";
    } else if (widget.widgetId === 'upcoming_interviews') {
      valueStr = dynamicData.upcomingInterviews.toString();
      trendStr = 'Upcoming interviews';
      iconColor = "text-indigo-500";
    } else if (widget.widgetId === 'unread_notifications') {
      valueStr = dynamicData.unreadNotifications.toString();
      trendStr = 'Unread notifications';
      iconColor = "text-amber-500";
    } else if (widget.widgetId === 'unread_messages') {
      valueStr = dynamicData.unreadMessages.toString();
      trendStr = 'Unread messages in inbox';
      iconColor = "text-amber-500";

    } else if (widget.widgetId === 'my_requests') {
      valueStr = dynamicData.myRequests.toString();
      trendStr = 'Your active requests';
      iconColor = "text-rose-500";
    } else if (widget.widgetId === 'idcard_status') {
      valueStr = dynamicData.idcardStatus;
      trendStr = 'Card status verified';
      iconColor = "text-emerald-500";
    } else if (widget.widgetId === 'bookmarks') {
      valueStr = dynamicData.bookmarks.toString();
      trendStr = 'Total saved links';
      iconColor = "text-blue-500";
    } else if (widget.widgetId === 'upcoming_tasks_productivity') {
      valueStr = dynamicData.upcomingTasks.toString();
      trendStr = 'Pending personal tasks';
      iconColor = "text-indigo-500";
    }
  }

  // Fallback to static generation if dynamic data didn't set values
  if (!valueStr) {
    if (nameLower.includes('revenue') || nameLower.includes('reward')) {
      const val = (seed * 13 % 900) + 10;
      valueStr = `$${val}K`;
      trendStr = `+${(seed % 15) + 2}% from last month`;
      iconColor = "text-emerald-500";
    } else if (nameLower.includes('rate') || nameLower.includes('growth') || nameLower.includes('trend')) {
      const val = (seed * 7 % 80) + 10;
      valueStr = `${val}%`;
      trendStr = `Up by ${(seed % 8) + 1}%`;
      iconColor = "text-blue-500";
    } else if (nameLower.includes('overview') || nameLower.includes('summary') || nameLower.includes('stats') || nameLower.includes('analytics')) {
      const val = (seed * 19 % 5000) + 500;
      valueStr = val.toLocaleString();
      trendStr = 'Total count across all programs';
      iconColor = "text-indigo-500";
    } else if (nameLower.includes('status') || nameLower.includes('health')) {
      valueStr = seed % 2 === 0 ? 'Optimal' : 'Active';
      trendStr = 'System running normally';
      iconColor = "text-emerald-500";
    } else {
      // Default count
      const val = (seed * 11 % 300) + 10;
      valueStr = val.toString();
      trendStr = 'Recent active items';
      iconColor = "text-text-secondary";
    }
  }

  return (
    <Card className="border-border bg-white h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h3 className="font-bold text-text-primary">{widget.name}</h3>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col justify-center">
        {dynamicData?.loading ? (
          <div className="h-6 w-12 bg-slate-100 animate-pulse rounded" />
        ) : (
          <div className="text-2xl font-black text-text-primary">{valueStr}</div>
        )}
        <p className="text-xs text-helper mt-1">{trendStr}</p>
      </CardContent>
    </Card>
  );
};

// --- WIDGET RENDERER ---

function renderWidget(widget: WidgetDefinition, dynamicData?: any) {
  switch (widget.widgetId) {
    case 'sys_health': return <SystemHealthWidget />;
    case 'recent_activity': return <RecentActivityWidget />;
    case 'employee_kpi': return <EmployeeKPIWidget />;
    case 'applications_kpi': return <ApplicationsKPIWidget />;
    case 'program_stats': return <ProgramStatsWidget />;
    case 'assigned_students': return <AssignedStudentsWidget count={dynamicData?.assignedStudents || 0} loading={dynamicData?.loading ?? true} />;
    case 'pending_reviews': return <PendingReviewsWidget count={dynamicData?.pendingReviews || 0} loading={dynamicData?.loading ?? true} />;
    case 'attendance_summary': return <AttendanceSummaryWidget />;
    case 'learning_progress': return <LearningProgressWidget />;
    case 'upcoming_tasks': return <UpcomingTasksWidget />;
    default: return <GenericWidget widget={widget} dynamicData={dynamicData} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD SHELL
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardShell() {
  const { user } = useAuth();
  const { isSuperAdmin, hasModule, hasPermission } = usePermissions();

  const [data, setData] = useState({
    todaysEvents: 0,
    upcomingInterviews: 0,
    unreadNotifications: 0,
    unreadMessages: 0,
    myRequests: 0,
    idcardStatus: 'Optimal',
    bookmarks: 0,
    upcomingTasks: 0,
    assignedStudents: 0,
    pendingReviews: 0,
    loading: true,
  });


  useEffect(() => {
    if (!user || !user.user_id) return;

    let isMounted = true;
    const currentUserId = user.user_id;

    async function loadStats() {
      try {
        const [
          todaysEvents,
          upcomingInterviews,
          unreadNotifications,
          unreadMessages,
          myTickets,
          idCard,
          workspace,
          assignments,
          submissions
        ] = await Promise.all([
          CalendarService.getTodaysEvents().catch(() => []),
          CalendarService.getUpcomingInterviews().catch(() => []),
          NotificationService.getUnreadCount().catch(() => 0),
          CommunicationService.getUnreadCount(currentUserId).catch(() => 0),
          HelpdeskService.getMyTickets(currentUserId).catch(() => []),
          IDCardAPI.getMyIDCard(currentUserId).catch(() => null),
          ProductivityService.getWorkspace().catch(() => null),
          mentorService.getAssignments().catch(() => []),
          submissionService.getSubmissions().catch(() => []),
        ]);


        if (!isMounted) return;

        // Find mentor profile for this user
        const profiles = await mentorService.getMentorProfiles().catch(() => []);
        const myProfile = profiles.find(p => p.employee_id === currentUserId || p.mentor_profile_id === currentUserId);
        const myAssignments = myProfile 
          ? assignments.filter(a => a.mentorProfileId === myProfile.mentor_profile_id && a.status === 'Active')
          : assignments.filter(a => a.employeeId === currentUserId && a.status === 'Active');

        const pendingSubmissions = submissions.filter(s => s.status === 'PENDING');
        const activeInterviews = upcomingInterviews.filter(e => e.type === 'Interview');

        setData({
          todaysEvents: todaysEvents.length,
          upcomingInterviews: activeInterviews.length || upcomingInterviews.length,
          unreadNotifications: unreadNotifications,
          unreadMessages: unreadMessages,
          myRequests: myTickets.length,
          idcardStatus: idCard?.status || 'Active',
          bookmarks: workspace?.bookmarks?.length || 0,
          upcomingTasks: workspace?.tasks?.filter(t => !t.completed).length || 0,
          assignedStudents: myAssignments.length,
          pendingReviews: pendingSubmissions.length,
          loading: false,
        });

      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
        if (isMounted) {
          setData(prev => ({ ...prev, loading: false }));
        }
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, [user]);

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
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Welcome back, {user.name.split(' ')[0]}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
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
                {renderWidget(widget, data)}
              </div>
            );
          })}
        </div>

        {authorizedWidgets.length === 0 && (
          <div className="p-12 text-center text-text-secondary bg-white border border-border rounded-xl">
            No widgets available for your current role and permissions.
          </div>
        )}
      </section>
    </div>
  );
}
