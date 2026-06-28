'use client';

import { useState, useEffect, useMemo } from 'react';
import { NotificationService } from '@/src/services/notification.service';
import { Notification, NotificationChannel, NotificationPriority, NotificationStatus } from '@/src/types/notification.types';
import { Bell, CheckCircle, AlertCircle, Mail, MessageSquare, Smartphone, Search, X, Eye, Send, Clock, ChevronLeft, ChevronRight, RefreshCw, Inbox } from 'lucide-react';
import { Drawer } from '../ui/Drawer';

type StatusFilter = 'All' | NotificationStatus;
type ChannelFilter = 'All' | NotificationChannel;
type PriorityFilter = 'All' | NotificationPriority;

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
        <div key={i} className="flex gap-4 px-5 py-4 border-b border-border">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded flex-1" />
        </div>
      ))}
    </div>
  );
}

const statusColors: Record<string, string> = {
  Draft: 'bg-slate-100 text-text-secondary',
  Scheduled: 'bg-amber-100 text-amber-700',
  Sent: 'bg-blue-100 text-blue-700',
  Failed: 'bg-rose-100 text-rose-700',
  Delivered: 'bg-sky-100 text-text-primary',
  Read: 'bg-emerald-100 text-emerald-700',
};

const priorityColors: Record<string, string> = {
  Low: 'bg-slate-100 text-text-secondary',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-amber-100 text-amber-700',
  Critical: 'bg-rose-100 text-rose-700',
};

const channelIcons: Record<string, { icon: typeof Mail; color: string; bg: string }> = {
  Email: { icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50' },
  SMS: { icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  WhatsApp: { icon: Smartphone, color: 'text-green-600', bg: 'bg-green-50' },
  'Push Notification': { icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50' },
  'In-App Notification': { icon: Inbox, color: 'text-violet-600', bg: 'bg-violet-50' },
};

function getRelativeTime(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export default function NotificationDashboard() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('All');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Notification | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await NotificationService.getNotifications();
      setNotifications(data.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const stats = useMemo(() => {
    const unread = notifications.filter(n => !n.readStatus).length;
    const delivered = notifications.filter(n => n.status === 'Delivered' || n.status === 'Read').length;
    const read = notifications.filter(n => n.readStatus).length;
    const failed = notifications.filter(n => n.status === 'Failed').length;
    return { unread, delivered, read, failed };
  }, [notifications]);

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase()) || n.recipient.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || n.status === statusFilter;
      const matchChannel = channelFilter === 'All' || n.channel === channelFilter;
      const matchPriority = priorityFilter === 'All' || n.priority === priorityFilter;
      return matchSearch && matchStatus && matchChannel && matchPriority;
    });
  }, [notifications, search, statusFilter, channelFilter, priorityFilter]);

  useEffect(() => { setPage(1); }, [search, statusFilter, channelFilter, priorityFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleView = async (n: Notification) => {
    setSelected(n);
    setDrawerOpen(true);
    if (!n.readStatus) {
      try {
        await NotificationService.markAsRead(n.id);
        setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, readStatus: true, status: 'Read' } : item));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const statCards = [
    { title: 'Unread', value: stats.unread, icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50', pulse: stats.unread > 0 },
    { title: 'Delivered', value: stats.delivered, icon: Send, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Read', value: stats.read, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Failed', value: stats.failed, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const statusOptions: StatusFilter[] = ['All', 'Draft', 'Scheduled', 'Sent', 'Delivered', 'Read', 'Failed'];
  const channelOptions: ChannelFilter[] = ['All', 'Email', 'SMS', 'WhatsApp', 'Push Notification', 'In-App Notification'];
  const priorityOptions: PriorityFilter[] = ['All', 'Low', 'Medium', 'High', 'Critical'];

  const activeFilterCount = [statusFilter !== 'All', channelFilter !== 'All', priorityFilter !== 'All'].filter(Boolean).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-premium">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-200/50">
            <Bell size={24} className="animate-float-3" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight font-display-premium">Notification Center</h1>
            <p className="text-sm text-text-secondary mt-0.5">Manage and monitor omni-channel notifications.</p>
          </div>
        </div>
        <button
          onClick={loadData}
          className="bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          statCards.map((c, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => {
              if (c.title === 'Unread') { setStatusFilter('All'); /* unread is cross-status */ }
              else if (c.title === 'Delivered') setStatusFilter('Delivered');
              else if (c.title === 'Read') setStatusFilter('Read');
              else if (c.title === 'Failed') setStatusFilter('Failed');
            }}>
              <div className="flex justify-between items-start mb-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${c.bg} ${c.color} group-hover:scale-110 transition-transform duration-300`}>
                  <c.icon size={22} />
                </div>
                {'pulse' in c && c.pulse && (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary font-semibold mb-1 font-display-premium tracking-wide">{c.title}</p>
              <h3 className="text-2xl font-black text-text-primary font-display-premium">{c.value}</h3>
            </div>
          ))
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Search by title, message, or recipient..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary transition-all outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-secondary">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setStatusFilter('All'); setChannelFilter('All'); setPriorityFilter('All'); }}
                className="text-xs font-medium text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear filters ({activeFilterCount})
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Status pills */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase text-text-secondary mr-1">Status</span>
              {statusOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setStatusFilter(opt)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === opt
                      ? opt === 'All' ? 'bg-slate-900 text-white' : statusColors[opt] || 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {/* Channel select */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase text-text-secondary mr-1">Channel</span>
              <select
                value={channelFilter}
                onChange={e => setChannelFilter(e.target.value as ChannelFilter)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-border bg-slate-50 text-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {channelOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            {/* Priority pills */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase text-text-secondary mr-1">Priority</span>
              {priorityOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setPriorityFilter(opt)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    priorityFilter === opt
                      ? opt === 'All' ? 'bg-slate-900 text-white' : priorityColors[opt] || 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
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
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
            <Bell className="w-12 h-12 mb-3 opacity-40" />
            <p className="font-medium text-text-secondary">No notifications found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase text-text-secondary tracking-wider font-display-premium">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Notification</th>
                  <th className="px-5 py-3.5 font-semibold">Channel</th>
                  <th className="px-5 py-3.5 font-semibold">Recipient</th>
                  <th className="px-5 py-3.5 font-semibold">Priority</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Time</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text-secondary">
                {paginated.map(n => {
                  const ch = channelIcons[n.channel] || channelIcons['In-App Notification'];
                  const ChIcon = ch.icon;
                  return (
                    <tr key={n.id} className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${!n.readStatus ? 'bg-amber-50/30' : ''}`} onClick={() => handleView(n)}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-start gap-2.5">
                          {!n.readStatus && <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />}
                          <div className="min-w-0">
                            <p className={`text-xs truncate max-w-[200px] ${!n.readStatus ? 'font-bold text-text-primary' : 'font-semibold text-text-primary'}`}>{n.title}</p>
                            <p className="text-[10px] text-text-secondary truncate max-w-[200px] mt-0.5">{n.message}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${ch.bg}`}>
                            <ChIcon className={`w-3.5 h-3.5 ${ch.color}`} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-text-primary">{n.channel}</p>
                            <p className="text-[10px] text-text-secondary">{n.module}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                            {n.recipient.split(' ').map(w => w[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-text-primary">{n.recipient}</p>
                            <p className="text-[10px] text-text-secondary">{n.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${priorityColors[n.priority]}`}>
                          {n.priority}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${statusColors[n.status]}`}>
                          {n.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-text-secondary">
                          <Clock className="w-3.5 h-3.5 text-text-secondary" />
                          <span className="text-xs font-medium">{getRelativeTime(n.createdTime)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={e => { e.stopPropagation(); handleView(n); }}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-xs flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-5 py-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-text-secondary">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-slate-100 disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let p: number;
                if (totalPages <= 5) p = i + 1;
                else if (page <= 3) p = i + 1;
                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                else p = page - 2 + i;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`h-8 w-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${page === p ? 'bg-slate-900 text-white' : 'text-text-secondary hover:bg-slate-100'}`}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-slate-100 disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Notification Details">
        {selected && (() => {
          const ch = channelIcons[selected.channel] || channelIcons['In-App Notification'];
          const ChIcon = ch.icon;
          return (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 font-premium">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg ${ch.bg}`}>
                  <ChIcon className={`w-7 h-7 ${ch.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-text-primary font-display-premium tracking-tight">{selected.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${statusColors[selected.status]}`}>
                      {selected.status}
                    </span>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${priorityColors[selected.priority]}`}>
                      {selected.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">Message Content</p>
                <p className="text-sm text-text-primary leading-relaxed">{selected.message}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-text-secondary">Channel</p>
                  <p className="text-sm font-medium text-text-primary mt-0.5 flex items-center gap-1.5">
                    <ChIcon className={`w-3.5 h-3.5 ${ch.color}`} />
                    {selected.channel}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-text-secondary">Module</p>
                  <p className="text-sm font-medium text-text-primary mt-0.5">{selected.module}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-text-secondary">Recipient</p>
                  <p className="text-sm font-medium text-text-primary mt-0.5">{selected.recipient}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-text-secondary">Role</p>
                  <p className="text-sm font-medium text-text-primary mt-0.5">{selected.role}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-text-secondary">Created</p>
                  <p className="text-sm font-medium text-text-primary mt-0.5">{new Date(selected.createdTime).toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-text-secondary">Delivered</p>
                  <p className="text-sm font-medium text-text-primary mt-0.5">{selected.deliveredTime ? new Date(selected.deliveredTime).toLocaleString('en-IN') : '—'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-text-secondary">Read Status</p>
                  <p className="text-sm font-medium text-text-primary mt-0.5">{selected.readStatus ? '✓ Read' : '✗ Unread'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-text-secondary">Retry Count</p>
                  <p className="text-sm font-medium text-text-primary mt-0.5">{selected.retryCount}</p>
                </div>
              </div>

              {selected.scheduledTime && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-text-secondary">Scheduled For</p>
                  <p className="text-sm font-medium text-text-primary mt-0.5">{new Date(selected.scheduledTime).toLocaleString('en-IN')}</p>
                </div>
              )}
            </div>
          );
        })()}
      </Drawer>
    </div>
  );
}
