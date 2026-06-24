"use client";

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, FileText, CheckCircle2, Clock, AlertTriangle, 
  ChevronRight, TrendingUp, BarChart2, Calendar, ShieldAlert
} from 'lucide-react';
import { taskService } from '@/src/services/task.service';
import { Task } from '@/src/data/mock-tasks';

export default function TaskDashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await taskService.getTasks();
        setTasks(data);
      } catch (err) {
        console.error('Failed to load tasks', err);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  // Calculate statistics
  const totalTasks = tasks.length;
  const pendingReviews = tasks.filter(t => t.status === 'review').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => t.isOverdue).length;
  const pendingTasks = tasks.filter(t => t.status === 'pending' && !t.isOverdue).length;

  return (
    <div className="space-y-6 animate-slide-in select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Execution Panel</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold text-[10px]">Task Dashboard</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Task & Deliverables Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of active tasks, peer review queues, compliance metrics, and overdue escalations.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Published Tasks', val: totalTasks, icon: CheckSquare, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Pending Reviews', val: pendingReviews, icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: 'Completed Tasks', val: completedTasks, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Overdue Tasks', val: overdueTasks, icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 border-rose-100' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all duration-200">
            <div>
              <div className="text-2.5xl font-black text-slate-800 tracking-tight">{kpi.val}</div>
              <div className="text-[10px] font-bold text-slate-455 uppercase tracking-wider mt-0.5">{kpi.label}</div>
            </div>
            <div className={`h-11 w-11 rounded-lg ${kpi.color} border flex items-center justify-center shrink-0`}>
              <kpi.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Task Completion Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
            Task Status Breakdown
          </h3>
          <div className="space-y-4 pt-1">
            {[
              { statusName: 'Completed Tasks', count: completedTasks, percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0, color: 'bg-emerald-600', text: 'text-emerald-650' },
              { statusName: 'Under Review', count: pendingReviews, percentage: totalTasks > 0 ? Math.round((pendingReviews / totalTasks) * 100) : 0, color: 'bg-blue-600', text: 'text-blue-650' },
              { statusName: 'Pending Submission', count: pendingTasks, percentage: totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0, color: 'bg-slate-400', text: 'text-slate-650' },
              { statusName: 'Overdue (Escalated)', count: overdueTasks, percentage: totalTasks > 0 ? Math.round((overdueTasks / totalTasks) * 100) : 0, color: 'bg-rose-500', text: 'text-rose-650' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    {item.statusName}
                  </span>
                  <span>{item.count} tasks ({item.percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Urgent Alerts & Escalations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-455 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <ShieldAlert className="h-4.5 w-4.5 text-rose-600" />
            Escalation Monitor
          </h3>
          
          <div className="space-y-3.5 pt-1">
            {tasks.filter(t => t.isOverdue).map((task) => (
              <div key={task.id} className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl space-y-1">
                <div className="flex justify-between items-center text-[9px] font-bold text-rose-600">
                  <span>{task.id}</span>
                  <span className="bg-rose-100 px-1.5 py-0.5 rounded uppercase">{task.alert || 'Overdue'}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 leading-tight mt-1">{task.title}</h4>
                <p className="text-[10px] text-slate-500 leading-snug">Due: {task.dueDate}</p>
              </div>
            ))}
            {tasks.filter(t => t.isOverdue).length === 0 && (
              <div className="p-8 text-center text-slate-400 italic bg-slate-50 border border-slate-100 rounded-xl text-xs">
                No active escalations found. All cohorts compliant.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
