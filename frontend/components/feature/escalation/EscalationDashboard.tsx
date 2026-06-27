"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { escalationService } from '../../../src/services/escalation.service';
import { EscalationRule, EscalationLog } from '../../../src/types/escalation.types';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock, Search, X, Eye, Settings, EyeOff, Loader2, Zap, Users, FileText, ChevronRight } from 'lucide-react';
import { Drawer } from '../ui/Drawer';

type Tab = 'logs' | 'rules';
type StatusFilter = 'All' | 'Pending' | 'Resolved' | 'Ignored';
type TypeFilter = 'All' | 'Attendance' | 'Assignments' | 'Leave' | 'Assessments' | 'Performance' | 'Payment' | 'Certificate Approval';

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
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-4 px-5 py-4 border-b border-slate-100">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-24 bg-slate-200 rounded flex-1" />
        </div>
      ))}
    </div>
  );
}

const typeColors: Record<string, string> = {
  Attendance: 'bg-blue-100 text-blue-700',
  Assignments: 'bg-violet-100 text-violet-700',
  Leave: 'bg-teal-100 text-teal-700',
  Assessments: 'bg-amber-100 text-amber-700',
  Performance: 'bg-rose-100 text-rose-700',
  Payment: 'bg-emerald-100 text-emerald-700',
  'Certificate Approval': 'bg-indigo-100 text-indigo-700',
};

const statusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Resolved: 'bg-emerald-100 text-emerald-700',
  Ignored: 'bg-slate-100 text-slate-500',
};

function getTimeSince(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function EscalationDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalEscalations: 0, pendingEscalations: 0, resolvedEscalations: 0, ignoredEscalations: 0 });
  const [escalations, setEscalations] = useState<EscalationLog[]>([]);
  const [rules, setRules] = useState<EscalationRule[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('logs');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [selectedEscalation, setSelectedEscalation] = useState<EscalationLog | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, e, r] = await Promise.all([
        escalationService.getEscalationStats(),
        escalationService.getEscalations(),
        escalationService.getRules(),
      ]);
      const ignored = e.filter(x => x.status === 'Ignored').length;
      setStats({ ...s, ignoredEscalations: ignored });
      setEscalations(e.sort((a, b) => new Date(b.triggeredDate).getTime() - new Date(a.triggeredDate).getTime()));
      setRules(r);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredEscalations = useMemo(() => {
    return escalations.filter(e => {
      const matchesSearch = !search || e.targetName.toLowerCase().includes(search.toLowerCase()) || e.type.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
      const matchesType = typeFilter === 'All' || e.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [escalations, search, statusFilter, typeFilter]);

  const handleResolve = async (id: string) => {
    await escalationService.resolveEscalation(id);
    await loadData();
  };

  const handleIgnore = async (id: string) => {
    const { escalationApi } = await import('../../../src/api/escalation.api');
    await escalationApi.updateEscalationStatus(id, 'Ignored');
    await loadData();
  };

  const handleView = (esc: EscalationLog) => {
    setSelectedEscalation(esc);
    setDrawerOpen(true);
  };

  const statCards = [
    { title: 'Total Escalations', value: stats.totalEscalations, icon: ShieldAlert, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Pending', value: stats.pendingEscalations, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Resolved', value: stats.resolvedEscalations, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Ignored', value: stats.ignoredEscalations, icon: EyeOff, color: 'text-slate-500', bg: 'bg-slate-100' },
  ];

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'logs', label: 'Escalation Logs', icon: <FileText className="w-4 h-4" />, count: escalations.length },
    { id: 'rules', label: 'Escalation Rules', icon: <Settings className="w-4 h-4" />, count: rules.length },
  ];

  const statusOptions: StatusFilter[] = ['All', 'Pending', 'Resolved', 'Ignored'];
  const typeOptions: TypeFilter[] = ['All', 'Attendance', 'Assignments', 'Leave', 'Assessments', 'Performance'];

  const activeFilterCount = [statusFilter !== 'All', typeFilter !== 'All'].filter(Boolean).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
            <Zap size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Escalation Engine</h1>
            <p className="text-sm text-slate-500 mt-0.5">Automated workflow and issue escalations.</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('rules')}
          className="bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20"
        >
          <Settings className="w-4 h-4" />
          Manage Rules
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          statCards.map((c, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => {
              setActiveTab('logs');
              if (c.title === 'Pending') setStatusFilter('Pending');
              else if (c.title === 'Resolved') setStatusFilter('Resolved');
              else if (c.title === 'Ignored') setStatusFilter('Ignored');
              else setStatusFilter('All');
            }}>
              <div className="flex justify-between items-start mb-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${c.bg} ${c.color} group-hover:scale-110 transition-transform duration-300`}>
                  <c.icon size={22} />
                </div>
                {c.title === 'Pending' && c.value > 0 && (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">{c.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{c.value}</h3>
            </div>
          ))
        )}
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${
              activeTab === tab.id ? 'bg-slate-100 text-slate-600' : 'bg-slate-200/60 text-slate-400'
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Escalation Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by target name or type..."
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
                  onClick={() => { setStatusFilter('All'); setTypeFilter('All'); }}
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
              {/* Type pills */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase text-slate-400 mr-1">Type</span>
                {typeOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setTypeFilter(opt)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      typeFilter === opt
                        ? opt === 'All' ? 'bg-slate-900 text-white' : typeColors[opt] || 'bg-slate-900 text-white'
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
          ) : filteredEscalations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <ShieldAlert className="w-12 h-12 mb-3 opacity-40" />
              <p className="font-medium text-slate-500">No escalations found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Triggered</th>
                    <th className="px-5 py-3.5 font-semibold">Type</th>
                    <th className="px-5 py-3.5 font-semibold">Target</th>
                    <th className="px-5 py-3.5 font-semibold">Notified</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold">Resolution</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredEscalations.map(e => (
                    <tr key={e.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer" onClick={() => handleView(e)}>
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-xs font-medium text-slate-700">{getTimeSince(e.triggeredDate)}</p>
                          <p className="text-[10px] text-slate-400">{new Date(e.triggeredDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${typeColors[e.type] || 'bg-slate-100 text-slate-600'}`}>
                          {e.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white text-[10px] font-bold">
                            {e.targetName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-semibold text-slate-900 text-xs">{e.targetName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex -space-x-1.5">
                          {e.notifiedUsers.slice(0, 3).map((u, i) => (
                            <div key={i} className="h-6 w-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-600" title={`${u.name} (${u.role})`}>
                              {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                          ))}
                          {e.notifiedUsers.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">
                              +{e.notifiedUsers.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${statusColors[e.status]}`}>
                          {e.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 max-w-[150px]">
                        {e.resolutionNotes ? (
                          <p className="text-xs text-slate-500 truncate">{e.resolutionNotes}</p>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          {e.status === 'Pending' && (
                            <>
                              <button
                                onClick={ev => { ev.stopPropagation(); handleResolve(e.id); }}
                                className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                              >
                                Resolve
                              </button>
                              <button
                                onClick={ev => { ev.stopPropagation(); handleIgnore(e.id); }}
                                className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                              >
                                Ignore
                              </button>
                            </>
                          )}
                          <button
                            onClick={ev => { ev.stopPropagation(); handleView(e); }}
                            className="text-indigo-600 hover:text-indigo-800 p-1"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Results count */}
          {!loading && filteredEscalations.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
              Showing {filteredEscalations.length} of {escalations.length} escalations
            </div>
          )}
        </div>
      )}

      {/* Escalation Rules Tab */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Escalation Rules</h2>
            <p className="text-xs text-slate-400 mt-0.5">Automated triggers for workflow escalations</p>
          </div>
          {loading ? <SkeletonTable /> : rules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Settings className="w-12 h-12 mb-3 opacity-40" />
              <p className="font-medium text-slate-500">No rules configured</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {rules.map(rule => (
                <div key={rule.id} className="p-5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${typeColors[rule.type] || 'bg-slate-100 text-slate-600'}`}>
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${typeColors[rule.type] || 'bg-slate-100 text-slate-600'}`}>
                            {rule.type}
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                            rule.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {rule.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-900">{rule.condition}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Trigger after {rule.triggerDays} day(s)
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Notify: {rule.notifyRoles.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detail Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Escalation Details">
        {selectedEscalation && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Escalation Header */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                {selectedEscalation.targetName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedEscalation.targetName}</h3>
                <p className="text-sm text-slate-500">Target ID: {selectedEscalation.targetId}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${typeColors[selectedEscalation.type]}`}>
                    {selectedEscalation.type}
                  </span>
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${statusColors[selectedEscalation.status]}`}>
                    {selectedEscalation.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Info */}
            <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-5 border border-rose-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Triggered</span>
                <span className="text-sm font-bold text-slate-900">{getTimeSince(selectedEscalation.triggeredDate)}</span>
              </div>
              <p className="text-sm text-slate-600">{new Date(selectedEscalation.triggeredDate).toLocaleString('en-IN')}</p>
              {selectedEscalation.resolvedDate && (
                <div className="flex items-center justify-between pt-2 border-t border-rose-100">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Resolved</span>
                  <span className="text-sm font-medium text-slate-700">{new Date(selectedEscalation.resolvedDate).toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Rule ID</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5 font-mono">{selectedEscalation.ruleId}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Resolved By</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">{selectedEscalation.resolvedBy || '—'}</p>
              </div>
            </div>

            {/* Notified Users */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-900">Notified Users</h4>
              <div className="space-y-2">
                {selectedEscalation.notifiedUsers.map((u, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolution Notes */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-900">Resolution Notes</h4>
              <div className="bg-slate-50 rounded-xl p-4">
                {selectedEscalation.resolutionNotes ? (
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedEscalation.resolutionNotes}</p>
                ) : (
                  <p className="text-sm text-slate-400 italic">No resolution notes provided.</p>
                )}
              </div>
            </div>

            {/* Actions */}
            {selectedEscalation.status === 'Pending' && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { handleResolve(selectedEscalation.id); setDrawerOpen(false); }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Resolved
                </button>
                <button
                  onClick={() => { handleIgnore(selectedEscalation.id); setDrawerOpen(false); }}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <EyeOff className="w-4 h-4" />
                  Ignore
                </button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
