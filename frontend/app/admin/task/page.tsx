"use client";

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, FileText, CheckCircle2, Clock, AlertTriangle, 
  ChevronRight, TrendingUp, BarChart2, Calendar, ShieldAlert,
  Search, Filter, Plus, Eye, CheckCircle, BookOpen, Users, Play, XCircle
} from 'lucide-react';
import { taskService } from '@/src/services/task.service';
import { Task, TaskAssignee } from '@/src/data/mock-tasks';
import { Drawer } from '@/components/admin/ui/Drawer';

export default function TaskManagementPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'directory'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [assignees, setAssignees] = useState<TaskAssignee[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'assignees' | 'submissions' | 'comments'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const data = await taskService.getTasks();
    setTasks(data);
    setLoading(false);
  };

  const handleTaskClick = async (task: Task) => {
    setSelectedTask(task);
    const taskAssignees = await taskService.getAssignees(task.id);
    setAssignees(taskAssignees);
    setActiveTab('overview');
    setIsDrawerOpen(true);
  };

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // Dashboard Stats
  const totalTasks = tasks.length;
  const pendingReviews = tasks.filter(t => t.status === 'review').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => t.isOverdue).length;
  const pendingTasks = tasks.filter(t => t.status === 'pending' && !t.isOverdue).length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Task Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track batch tasks and assignments.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'dashboard' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveView('directory')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'directory' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Directory
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeView === 'dashboard' && (
          <div className="space-y-6 max-w-7xl mx-auto">
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
                    <div className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mt-0.5">{kpi.label}</div>
                  </div>
                  <div className={`h-11 w-11 rounded-lg ${kpi.color} border flex items-center justify-center shrink-0`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Task Completion Breakdown */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
                  Task Status Breakdown
                </h3>
                <div className="space-y-4 pt-1">
                  {[
                    { statusName: 'Completed Tasks', count: completedTasks, percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0, color: 'bg-emerald-600' },
                    { statusName: 'Under Review', count: pendingReviews, percentage: totalTasks > 0 ? Math.round((pendingReviews / totalTasks) * 100) : 0, color: 'bg-blue-600' },
                    { statusName: 'Pending Submission', count: pendingTasks, percentage: totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0, color: 'bg-slate-400' },
                    { statusName: 'Overdue (Escalated)', count: overdueTasks, percentage: totalTasks > 0 ? Math.round((overdueTasks / totalTasks) * 100) : 0, color: 'bg-rose-500' }
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
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
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
        )}

        {activeView === 'directory' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm max-w-7xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm">
                <Plus className="h-4 w-4" /> Create Task
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Task Title</th>
                    <th className="px-6 py-3">Batch</th>
                    <th className="px-6 py-3">Assigned By</th>
                    <th className="px-6 py-3">Due Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map(t => (
                    <tr key={t.id} className="hover:bg-blue-50/50 cursor-pointer transition-colors" onClick={() => handleTaskClick(t)}>
                      <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                        <CheckSquare className="h-4 w-4 text-blue-500" />
                        <div>
                          <div>{t.title}</div>
                          <div className="text-xs text-slate-500 font-normal">{t.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{t.batchId}</td>
                      <td className="px-6 py-4 text-slate-600">{t.assignedBy}</td>
                      <td className="px-6 py-4 text-slate-600">{t.dueDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                          t.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                          t.status === 'review' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {t.status.toUpperCase()}
                        </span>
                        {t.isOverdue && <span className="ml-2 inline-flex px-2 py-1 rounded text-xs font-semibold bg-rose-50 text-rose-700">OVERDUE</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Task Details" size="lg">
        {selectedTask && (
          <div className="flex flex-col h-full bg-slate-50 min-h-0">
            <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <CheckSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedTask.title}</h2>
                    <p className="text-sm text-slate-500">ID: {selectedTask.id} • Batch: {selectedTask.batchId}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    selectedTask.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    selectedTask.status === 'review' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedTask.status}
                  </span>
                  {selectedTask.isOverdue && <span className="mt-1 text-xs font-bold text-rose-600">OVERDUE</span>}
                </div>
              </div>
            </div>

            <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-6 shrink-0">
              {['overview', 'assignees', 'submissions', 'comments'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="capitalize">{t}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Description</h3>
                    <p className="text-sm text-slate-600">{selectedTask.description}</p>
                    
                    <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mt-4">Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned By</span>
                        <span className="font-medium text-slate-800">{selectedTask.assignedBy}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Due Date</span>
                        <span className="font-medium text-slate-800">{selectedTask.dueDate}</span>
                      </div>
                    </div>

                    {selectedTask.fileIds && selectedTask.fileIds.length > 0 && (
                      <>
                        <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mt-4">Attachments</h3>
                        <div className="space-y-2">
                          {selectedTask.fileIds.map(fid => (
                            <div key={fid} className="flex items-center gap-2 p-2 rounded border border-slate-100 bg-slate-50">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <span className="text-sm text-slate-700 font-medium">{fid}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'assignees' && (
                <div className="space-y-4">
                  {assignees.map(a => (
                    <div key={a.studentId} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-full shrink-0">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">Student ID: {a.studentId}</div>
                          <div className="text-xs text-slate-500">Status: <span className="font-semibold">{a.status}</span></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {assignees.length === 0 && <p className="text-sm text-slate-500 text-center">No assignees found.</p>}
                </div>
              )}

              {activeTab === 'submissions' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                  Submissions will appear here.
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                  Comments will appear here.
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
