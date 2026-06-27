"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { reportingManagerService } from '../../../src/services/reportingManager.service';
import { ManagerAssignment, ManagerEvaluation } from '../../../src/types/reporting-manager.types';
import { Briefcase, Users, AlertCircle, TrendingUp, Search, ChevronDown, X, Star, FileText, Eye, Loader2 } from 'lucide-react';
import { Drawer } from '../ui/Drawer';

type Tab = 'interns' | 'evaluations';
type RiskFilter = 'All' | 'Low' | 'Medium' | 'High';

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
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 px-5 py-4 border-b border-slate-100">
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-32 bg-slate-200 rounded flex-1" />
          <div className="h-4 w-32 bg-slate-200 rounded flex-1" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2.5 min-w-[120px]">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-600 tabular-nums w-9 text-right">{value}%</span>
    </div>
  );
}

export default function ReportingManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalInterns: 0, averagePerformance: 0, highRiskInterns: 0, evaluationCount: 0 });
  const [assignments, setAssignments] = useState<ManagerAssignment[]>([]);
  const [evaluations, setEvaluations] = useState<ManagerEvaluation[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('interns');
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('All');
  const [selectedIntern, setSelectedIntern] = useState<ManagerAssignment | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [dashboardStats, data, evals] = await Promise.all([
          reportingManagerService.getDashboardKPIs('rm-1'),
          reportingManagerService.getInternAssignments('rm-1'),
          reportingManagerService.getEvaluations('rm-1'),
        ]);
        setStats({ ...dashboardStats, evaluationCount: evals.length });
        setAssignments(data);
        setEvaluations(evals);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const matchesSearch = !search || a.internName.toLowerCase().includes(search.toLowerCase()) || a.batch.toLowerCase().includes(search.toLowerCase()) || a.college.toLowerCase().includes(search.toLowerCase());
      const matchesRisk = riskFilter === 'All' || a.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [assignments, search, riskFilter]);

  const handleViewIntern = (intern: ManagerAssignment) => {
    setSelectedIntern(intern);
    setDrawerOpen(true);
  };

  const statCards = [
    { title: 'Total Interns', value: stats.totalInterns, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Avg Performance', value: `${stats.averagePerformance.toFixed(1)}/10`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'High Risk', value: stats.highRiskInterns, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Evaluations', value: stats.evaluationCount, icon: Star, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'interns', label: 'Assigned Interns', count: assignments.length },
    { id: 'evaluations', label: 'Evaluations', count: evaluations.length },
  ];

  const riskOptions: RiskFilter[] = ['All', 'Low', 'Medium', 'High'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reporting Manager</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage assigned interns and track their performance.</p>
          </div>
        </div>
        <button className="bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20">
          <FileText className="w-4 h-4" />
          Add Evaluation
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
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${
              activeTab === tab.id ? 'bg-slate-100 text-slate-600' : 'bg-slate-200/60 text-slate-400'
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Assigned Interns Tab */}
      {activeTab === 'interns' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, batch, or college..."
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
            <div className="flex items-center gap-2">
              {riskOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setRiskFilter(opt)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    riskFilter === opt
                      ? opt === 'High' ? 'bg-rose-100 text-rose-700' : opt === 'Medium' ? 'bg-amber-100 text-amber-700' : opt === 'Low' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <SkeletonTable />
          ) : filteredAssignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Users className="w-12 h-12 mb-3 opacity-40" />
              <p className="font-medium text-slate-500">No interns found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Intern</th>
                    <th className="px-5 py-3.5 font-semibold">Batch</th>
                    <th className="px-5 py-3.5 font-semibold">Attendance</th>
                    <th className="px-5 py-3.5 font-semibold">Assessment</th>
                    <th className="px-5 py-3.5 font-semibold">Tasks</th>
                    <th className="px-5 py-3.5 font-semibold">Performance</th>
                    <th className="px-5 py-3.5 font-semibold">Risk</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredAssignments.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer" onClick={() => handleViewIntern(a)}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {a.internName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900">{a.internName}</span>
                            <p className="text-xs text-slate-400 mt-0.5">{a.college}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">{a.batch}</span>
                      </td>
                      <td className="px-5 py-3.5"><ProgressBar value={a.attendancePercent} color="bg-blue-500" /></td>
                      <td className="px-5 py-3.5"><ProgressBar value={a.assessmentPercent} color="bg-violet-500" /></td>
                      <td className="px-5 py-3.5"><ProgressBar value={a.taskCompletionPercent} color="bg-emerald-500" /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="font-semibold text-slate-800">{a.performanceScore}</span>
                          <span className="text-slate-400 text-xs">/10</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                          a.riskLevel === 'High' ? 'bg-rose-100 text-rose-700' :
                          a.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {a.riskLevel}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={e => { e.stopPropagation(); handleViewIntern(a); }}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Evaluations Tab */}
      {activeTab === 'evaluations' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Recent Evaluations</h2>
            <p className="text-xs text-slate-400 mt-0.5">Performance evaluations submitted for assigned interns</p>
          </div>
          {loading ? <SkeletonTable /> : evaluations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Star className="w-12 h-12 mb-3 opacity-40" />
              <p className="font-medium text-slate-500">No evaluations yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Intern ID</th>
                    <th className="px-5 py-3.5 font-semibold">Date</th>
                    <th className="px-5 py-3.5 font-semibold">Score</th>
                    <th className="px-5 py-3.5 font-semibold">Feedback</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {evaluations.map(ev => (
                    <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-900">{ev.internId}</td>
                      <td className="px-5 py-3.5 text-slate-500">{new Date(ev.evaluationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Star className={`w-3.5 h-3.5 ${ev.score >= 7 ? 'text-amber-500 fill-amber-500' : ev.score >= 5 ? 'text-slate-400 fill-slate-300' : 'text-rose-400 fill-rose-300'}`} />
                          <span className="font-semibold text-slate-800">{ev.score}</span>
                          <span className="text-xs text-slate-400">/10</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 max-w-[300px] truncate text-slate-500">{ev.feedback}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                          ev.status === 'Submitted' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {ev.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Detail Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Intern Details">
        {selectedIntern && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Intern Header */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {selectedIntern.internName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedIntern.internName}</h3>
                <p className="text-sm text-slate-500">{selectedIntern.college} · {selectedIntern.batch}</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                  selectedIntern.riskLevel === 'High' ? 'bg-rose-100 text-rose-700' :
                  selectedIntern.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {selectedIntern.riskLevel} Risk
                </span>
              </div>
            </div>

            {/* Performance Score */}
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-5 border border-indigo-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600">Overall Performance</span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="text-2xl font-bold text-slate-900">{selectedIntern.performanceScore}</span>
                  <span className="text-slate-400">/10</span>
                </div>
              </div>
              <div className="h-3 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                  style={{ width: `${selectedIntern.performanceScore * 10}%` }}
                />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-xs font-medium text-blue-600 mb-1">Attendance</p>
                <p className="text-2xl font-bold text-blue-700">{selectedIntern.attendancePercent}%</p>
              </div>
              <div className="bg-violet-50 rounded-xl p-4 text-center">
                <p className="text-xs font-medium text-violet-600 mb-1">Assessment</p>
                <p className="text-2xl font-bold text-violet-700">{selectedIntern.assessmentPercent}%</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <p className="text-xs font-medium text-emerald-600 mb-1">Tasks</p>
                <p className="text-2xl font-bold text-emerald-700">{selectedIntern.taskCompletionPercent}%</p>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900">Assignment Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400">Assigned Date</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">{new Date(selectedIntern.assignedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">{selectedIntern.status}</p>
                </div>
              </div>
            </div>

            {/* Related Evaluations */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900">Evaluation History</h4>
              {evaluations.filter(e => e.internId === selectedIntern.internId).length === 0 ? (
                <p className="text-sm text-slate-400 bg-slate-50 rounded-xl p-4 text-center">No evaluations recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {evaluations.filter(e => e.internId === selectedIntern.internId).map(ev => (
                    <div key={ev.id} className="bg-slate-50 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{new Date(ev.evaluationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{ev.feedback}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-slate-800">{ev.score}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
