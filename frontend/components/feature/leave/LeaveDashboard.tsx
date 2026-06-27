"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { leaveService } from '../../../src/services/leave.service';
import { LeaveRequest } from '../../../src/types/leave.types';
import { Calendar, CheckCircle, Clock, XCircle, Search, X, Filter, Eye, Loader2, CalendarDays, FileText, ThumbsUp, ThumbsDown, ArrowUpDown } from 'lucide-react';
import { Drawer } from '../ui/Drawer';

type StatusFilter = 'All' | 'Pending' | 'Approved' | 'Rejected';
type LeaveTypeFilter = 'All' | 'Medical' | 'Casual' | 'Emergency' | 'OD' | 'WFH';
type RoleFilter = 'All' | 'Student' | 'Mentor' | 'Employee';

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
          <div className="h-8 w-8 bg-slate-200 rounded-full" />
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-32 bg-slate-200 rounded flex-1" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  );
}

const leaveTypeColors: Record<string, string> = {
  Medical: 'bg-rose-100 text-rose-700',
  Casual: 'bg-sky-100 text-sky-700',
  Emergency: 'bg-amber-100 text-amber-700',
  OD: 'bg-violet-100 text-violet-700',
  WFH: 'bg-teal-100 text-teal-700',
};

const statusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-rose-100 text-rose-700',
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
  if (s.getFullYear() !== e.getFullYear()) {
    return `${s.toLocaleDateString('en-IN', { ...opts, year: 'numeric' })} — ${e.toLocaleDateString('en-IN', { ...opts, year: 'numeric' })}`;
  }
  return `${s.toLocaleDateString('en-IN', opts)} — ${e.toLocaleDateString('en-IN', { ...opts, year: 'numeric' })}`;
}

function getDayCount(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
}

export default function LeaveDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRequests: 0, pendingRequests: 0, approvedRequests: 0, rejectedRequests: 0 });
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [typeFilter, setTypeFilter] = useState<LeaveTypeFilter>('All');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [s, l] = await Promise.all([
          leaveService.getLeaveDashboardStats(),
          leaveService.getAllLeaves(),
        ]);
        setStats(s);
        setLeaves(l);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredLeaves = useMemo(() => {
    return leaves.filter(l => {
      const matchesSearch = !search || l.userName.toLowerCase().includes(search.toLowerCase()) || l.reason.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
      const matchesType = typeFilter === 'All' || l.leaveType === typeFilter;
      const matchesRole = roleFilter === 'All' || l.role === roleFilter;
      return matchesSearch && matchesStatus && matchesType && matchesRole;
    });
  }, [leaves, search, statusFilter, typeFilter, roleFilter]);

  const handleView = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setDrawerOpen(true);
  };

  const statCards = [
    { title: 'Total Leaves', value: stats.totalRequests, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Pending', value: stats.pendingRequests, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Approved', value: stats.approvedRequests, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Rejected', value: stats.rejectedRequests, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const statusOptions: StatusFilter[] = ['All', 'Pending', 'Approved', 'Rejected'];
  const typeOptions: LeaveTypeFilter[] = ['All', 'Medical', 'Casual', 'Emergency', 'OD', 'WFH'];
  const roleOptions: RoleFilter[] = ['All', 'Student', 'Mentor', 'Employee'];

  const activeFilterCount = [statusFilter !== 'All', typeFilter !== 'All', roleFilter !== 'All'].filter(Boolean).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
            <CalendarDays size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leave Management</h1>
            <p className="text-sm text-slate-500 mt-0.5">Track and manage all leave requests.</p>
          </div>
        </div>
        <button className="bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20">
          <FileText className="w-4 h-4" />
          Apply Leave
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          statCards.map((c, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => {
              if (c.title === 'Pending') setStatusFilter('Pending');
              else if (c.title === 'Approved') setStatusFilter('Approved');
              else if (c.title === 'Rejected') setStatusFilter('Rejected');
              else setStatusFilter('All');
            }}>
              <div className="flex justify-between items-start mb-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${c.bg} ${c.color} group-hover:scale-110 transition-transform duration-300`}>
                  <c.icon size={22} />
                </div>
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
                placeholder="Search by name or reason..."
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
                onClick={() => { setStatusFilter('All'); setTypeFilter('All'); setRoleFilter('All'); }}
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
                      ? opt === 'Pending' ? 'bg-amber-100 text-amber-700' : opt === 'Approved' ? 'bg-emerald-100 text-emerald-700' : opt === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-slate-900 text-white'
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
                      ? opt === 'All' ? 'bg-slate-900 text-white' : leaveTypeColors[opt] || 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {/* Role pills */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase text-slate-400 mr-1">Role</span>
              {roleOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setRoleFilter(opt)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    roleFilter === opt
                      ? 'bg-slate-900 text-white'
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
        ) : filteredLeaves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Calendar className="w-12 h-12 mb-3 opacity-40" />
            <p className="font-medium text-slate-500">No leave requests found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Employee</th>
                  <th className="px-5 py-3.5 font-semibold">Role</th>
                  <th className="px-5 py-3.5 font-semibold">Leave Type</th>
                  <th className="px-5 py-3.5 font-semibold">Duration</th>
                  <th className="px-5 py-3.5 font-semibold">Applied On</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredLeaves.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer" onClick={() => handleView(l)}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                          {getInitials(l.userName)}
                        </div>
                        <span className="font-semibold text-slate-900">{l.userName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">{l.role}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${leaveTypeColors[l.leaveType] || 'bg-slate-100 text-slate-600'}`}>
                        {l.leaveType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-slate-700 font-medium">{formatDateRange(l.startDate, l.endDate)}</p>
                        <p className="text-[11px] text-slate-400">{getDayCount(l.startDate, l.endDate)} day(s)</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {new Date(l.appliedOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${statusColors[l.status]}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {l.status === 'Pending' && (
                          <>
                            <button
                              onClick={e => { e.stopPropagation(); }}
                              className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                              title="Approve"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); }}
                              className="h-7 w-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors"
                              title="Reject"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); handleView(l); }}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1"
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
        {!loading && filteredLeaves.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
            <span>Showing {filteredLeaves.length} of {leaves.length} requests</span>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Leave Request Details">
        {selectedLeave && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* User Header */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {getInitials(selectedLeave.userName)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedLeave.userName}</h3>
                <p className="text-sm text-slate-500">{selectedLeave.role} · ID: {selectedLeave.userId}</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${statusColors[selectedLeave.status]}`}>
                  {selectedLeave.status}
                </span>
              </div>
            </div>

            {/* Leave Info Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${leaveTypeColors[selectedLeave.leaveType]}`}>
                  {selectedLeave.leaveType} Leave
                </span>
                <span className="text-sm font-bold text-slate-900">{getDayCount(selectedLeave.startDate, selectedLeave.endDate)} day(s)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">{formatDateRange(selectedLeave.startDate, selectedLeave.endDate)}</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Applied On</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">{new Date(selectedLeave.appliedOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">Approved By</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">{selectedLeave.approvedBy || '—'}</p>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-900">Reason</h4>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600 leading-relaxed">{selectedLeave.reason}</p>
              </div>
            </div>

            {/* Approval Remarks */}
            {selectedLeave.approvalRemarks && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-900">Approval Remarks</h4>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedLeave.approvalRemarks}</p>
                </div>
              </div>
            )}

            {/* Supporting Document */}
            {selectedLeave.supportingDocument && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-900">Supporting Document</h4>
                <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">{selectedLeave.supportingDocument}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            {selectedLeave.status === 'Pending' && (
              <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  Approve
                </button>
                <button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2">
                  <ThumbsDown className="w-4 h-4" />
                  Reject
                </button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
