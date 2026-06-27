"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { activityService } from '../../../src/services/activity.service';
import { ActivityLog } from '../../../src/types/activity.types';
import { Activity, CheckCircle, AlertTriangle, XCircle, Search, X, Eye, Download, Monitor, Smartphone, Tablet, Globe, Clock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Drawer } from '../ui/Drawer';

type StatusFilter = 'All' | 'Success' | 'Failed' | 'Warning';
type ModuleFilter = 'All' | 'Login' | 'Attendance' | 'Task' | 'Assessment' | 'Assignment' | 'Leave' | 'Profile' | 'Certificate' | 'Payment';
type SeverityFilter = 'All' | 'Info' | 'Low' | 'Medium' | 'High' | 'Critical';

const PAGE_SIZE = 20;

function SkeletonCard() {
  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-12 w-12 rounded-2xl bg-slate-200" />
      </div>
      <div className="h-3 w-24 bg-slate-200 rounded mb-2" />
      <div className="h-7 w-16 bg-slate-200 rounded" />
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex gap-4 px-5 py-4 border-b border-slate-100">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-24 bg-slate-200 rounded flex-1" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  );
}

const moduleColors: Record<string, string> = {
  Login: 'bg-blue-100 text-blue-700',
  Attendance: 'bg-emerald-100 text-emerald-700',
  Task: 'bg-violet-100 text-violet-700',
  Assessment: 'bg-amber-100 text-amber-700',
  Assignment: 'bg-indigo-100 text-indigo-700',
  Leave: 'bg-teal-100 text-teal-700',
  Profile: 'bg-slate-100 text-slate-600',
  Certificate: 'bg-rose-100 text-rose-700',
  Payment: 'bg-emerald-100 text-emerald-700',
};

const statusColors: Record<string, string> = {
  Success: 'bg-emerald-100 text-emerald-700',
  Failed: 'bg-rose-100 text-rose-700',
  Warning: 'bg-amber-100 text-amber-700',
};

const severityColors: Record<string, string> = {
  Info: 'bg-sky-100 text-sky-700',
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-rose-100 text-rose-700',
};

function getDeviceIcon(device: string) {
  switch (device) {
    case 'Mobile': return <Smartphone className="w-3.5 h-3.5" />;
    case 'Tablet': return <Tablet className="w-3.5 h-3.5" />;
    default: return <Monitor className="w-3.5 h-3.5" />;
  }
}

function getRelativeTime(timestamp: string) {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export default function ActivityDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalLogs: 0, successLogs: 0, failedLogs: 0, criticalLogs: 0 });
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>('All');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('All');
  const [page, setPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [s, a] = await Promise.all([
          activityService.getActivityStats(),
          activityService.getAllActivities(),
        ]);
        setStats(s);
        // Sort newest first
        setActivities(a.sort((x, y) => new Date(y.timestamp).getTime() - new Date(x.timestamp).getTime()));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter(a => {
      const matchesSearch = !search || a.userName.toLowerCase().includes(search.toLowerCase()) || a.action.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      const matchesModule = moduleFilter === 'All' || a.module === moduleFilter;
      const matchesSeverity = severityFilter === 'All' || a.severity === severityFilter;
      return matchesSearch && matchesStatus && matchesModule && matchesSeverity;
    });
  }, [activities, search, statusFilter, moduleFilter, severityFilter]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, statusFilter, moduleFilter, severityFilter]);

  const totalPages = Math.ceil(filteredActivities.length / PAGE_SIZE);
  const paginatedActivities = filteredActivities.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleView = (activity: ActivityLog) => {
    setSelectedActivity(activity);
    setDrawerOpen(true);
  };

  const statCards = [
    { title: 'Total Activities', value: stats.totalLogs, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Success', value: stats.successLogs, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Failed', value: stats.failedLogs, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Critical', value: stats.criticalLogs, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const statusOptions: StatusFilter[] = ['All', 'Success', 'Failed', 'Warning'];
  const moduleOptions: ModuleFilter[] = ['All', 'Login', 'Attendance', 'Task', 'Assessment', 'Assignment', 'Leave', 'Profile', 'Certificate', 'Payment'];
  const severityOptions: SeverityFilter[] = ['All', 'Info', 'Low', 'Medium', 'High', 'Critical'];

  const activeFilterCount = [statusFilter !== 'All', moduleFilter !== 'All', severityFilter !== 'All'].filter(Boolean).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Activity Tracking</h1>
            <p className="text-sm text-slate-500 mt-0.5">Audit trail and system-wide activity logs.</p>
          </div>
        </div>
        <button className="bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20">
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          statCards.map((c, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${c.bg} ${c.color} group-hover:scale-110 transition-transform duration-300`}>
                  <c.icon size={22} />
                </div>
                {c.title !== 'Total Activities' && stats.totalLogs > 0 && (
                  <span className="text-xs font-medium text-slate-400">
                    {((c.value / stats.totalLogs) * 100).toFixed(0)}%
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">{c.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{c.value}</h3>
            </div>
          ))
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by user, action, or description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setStatusFilter('All'); setModuleFilter('All'); setSeverityFilter('All'); }}
                className="text-xs font-medium text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear filters ({activeFilterCount})
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Status pills */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase text-slate-400 mr-1">Status</span>
              {statusOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setStatusFilter(opt)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === opt
                      ? opt === 'All' ? 'bg-slate-900 text-white' : statusColors[opt] || 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {/* Module select */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase text-slate-400 mr-1">Module</span>
              <select
                value={moduleFilter}
                onChange={e => setModuleFilter(e.target.value as ModuleFilter)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-600 outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100"
              >
                {moduleOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            {/* Severity pills */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase text-slate-400 mr-1">Severity</span>
              {severityOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSeverityFilter(opt)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    severityFilter === opt
                      ? opt === 'All' ? 'bg-slate-900 text-white' : severityColors[opt] || 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <SkeletonTable />
        ) : paginatedActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Activity className="w-12 h-12 mb-3 opacity-40" />
            <p className="font-medium text-slate-500">No activities found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Time</th>
                  <th className="px-5 py-3.5 font-semibold">User</th>
                  <th className="px-5 py-3.5 font-semibold">Module</th>
                  <th className="px-5 py-3.5 font-semibold">Action</th>
                  <th className="px-5 py-3.5 font-semibold">Device</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Severity</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {paginatedActivities.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer" onClick={() => handleView(a)}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-medium">{getRelativeTime(a.timestamp)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                          {a.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 text-xs">{a.userName}</span>
                          <p className="text-[10px] text-slate-400">{a.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${moduleColors[a.module] || 'bg-slate-100 text-slate-600'}`}>
                        {a.module}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 font-medium text-xs max-w-[160px] truncate">{a.action}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        {getDeviceIcon(a.device)}
                        <span>{a.browser}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${statusColors[a.status]}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${severityColors[a.severity]}`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={e => { e.stopPropagation(); handleView(a); }}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-xs flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filteredActivities.length)} of {filteredActivities.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let p: number;
                if (totalPages <= 5) {
                  p = i + 1;
                } else if (page <= 3) {
                  p = i + 1;
                } else if (page >= totalPages - 2) {
                  p = totalPages - 4 + i;
                } else {
                  p = page - 2 + i;
                }
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-8 w-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                      page === p ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Activity Details">
        {selectedActivity && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Activity Header */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                {selectedActivity.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedActivity.userName}</h3>
                <p className="text-sm text-slate-500">{selectedActivity.role}</p>
              </div>
            </div>

            {/* Action Summary */}
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-5 border border-sky-100">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${moduleColors[selectedActivity.module]}`}>
                  {selectedActivity.module}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${statusColors[selectedActivity.status]}`}>
                    {selectedActivity.status}
                  </span>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${severityColors[selectedActivity.severity]}`}>
                    {selectedActivity.severity}
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-800 mt-2">{selectedActivity.action}</p>
              <p className="text-sm text-slate-600 mt-1">{selectedActivity.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Timestamp</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">{new Date(selectedActivity.timestamp).toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Device</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5 flex items-center gap-1.5">
                  {getDeviceIcon(selectedActivity.device)}
                  {selectedActivity.device}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Browser</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  {selectedActivity.browser}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">IP Address</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5 font-mono">{selectedActivity.ip}</p>
              </div>
            </div>

            {/* User ID */}
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400">User ID</p>
              <p className="text-sm font-medium text-slate-700 mt-0.5 font-mono">{selectedActivity.userId}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
