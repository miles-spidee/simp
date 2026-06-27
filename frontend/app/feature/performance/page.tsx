"use client";

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Search, Filter, AlertTriangle, Users, BookOpen, 
  CheckSquare, ClipboardList, Activity, Eye, FileText
} from 'lucide-react';
import { performanceService } from '@/src/services/performance.service';
import { StudentPerformance, BatchPerformance } from '@/src/data/mock-performance';
import { Drawer } from '@/components/feature/ui/Drawer';

export default function PerformanceManagementPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'directory'>('dashboard');
  const [performances, setPerformances] = useState<StudentPerformance[]>([]);
  const [selectedPerformance, setSelectedPerformance] = useState<StudentPerformance | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'tasks' | 'assessments'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await performanceService.getStudentPerformances();
    setPerformances(data);
    setLoading(false);
  };

  const handleStudentClick = (perf: StudentPerformance) => {
    setSelectedPerformance(perf);
    setActiveTab('overview');
    setIsDrawerOpen(true);
  };

  const filteredPerformances = performances.filter(p => p.studentId.toLowerCase().includes(searchTerm.toLowerCase()));

  // KPIs
  const totalStudents = performances.length;
  const avgScoreOverall = totalStudents > 0 ? Math.round(performances.reduce((acc, p) => acc + p.average_score, 0) / totalStudents) : 0;
  const atRiskCount = performances.filter(p => p.isAtRisk).length;
  const topPerformers = performances.filter(p => p.average_score >= 90).length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6 font-medium flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        TODO: Waiting for backend endpoint
      </div>

        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Performance Module</h1>
          <p className="text-sm text-slate-500 mt-1">Track and analyze student and batch performance.</p>
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
                { label: 'Avg Batch Score', val: `${avgScoreOverall}%`, icon: TrendingUp, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                { label: 'Total Students', val: totalStudents, icon: Users, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                { label: 'Top Performers', val: topPerformers, icon: Activity, color: 'text-purple-600 bg-purple-50 border-purple-100' },
                { label: 'At-Risk Students', val: atRiskCount, icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 border-rose-100' }
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Activity className="h-4 w-4 text-purple-600" />
                  Top Performers
                </h3>
                <div className="space-y-3 pt-1">
                  {performances.filter(p => p.average_score >= 90).map((perf) => (
                    <div key={perf.studentId} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">{perf.studentId}</h4>
                        <p className="text-xs text-slate-500 mt-1">Batch: {perf.batchId}</p>
                      </div>
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{perf.average_score}% Avg</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  At-Risk Students
                </h3>
                <div className="space-y-3 pt-1">
                  {performances.filter(p => p.isAtRisk).map((perf) => (
                    <div key={perf.studentId} className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">{perf.studentId}</h4>
                        <p className="text-xs text-slate-500 mt-1">Batch: {perf.batchId}</p>
                      </div>
                      <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{perf.average_score}% Avg</span>
                    </div>
                  ))}
                  {performances.filter(p => p.isAtRisk).length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-sm">No at-risk students.</div>
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
                    placeholder="Search by student ID..."
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <button className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Student ID</th>
                    <th className="px-6 py-3">Batch</th>
                    <th className="px-6 py-3">Avg Score</th>
                    <th className="px-6 py-3">Attendance</th>
                    <th className="px-6 py-3">Task Completion</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPerformances.map(p => (
                    <tr key={p.studentId} className="hover:bg-blue-50/50 cursor-pointer transition-colors" onClick={() => handleStudentClick(p)}>
                      <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                        <Users className="h-4 w-4 text-blue-500" />
                        {p.studentId}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{p.batchId}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{p.average_score}%</td>
                      <td className="px-6 py-4 text-slate-600">{p.attendance_rate}%</td>
                      <td className="px-6 py-4 text-slate-600">{p.task_completion_rate}%</td>
                      <td className="px-6 py-4">
                        {p.isAtRisk ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-rose-50 text-rose-700">At Risk</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">On Track</span>
                        )}
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

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Student Performance" size="lg">
        {selectedPerformance && (
          <div className="flex flex-col h-full bg-slate-50 min-h-0">
            <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Student: {selectedPerformance.studentId}</h2>
                    <p className="text-sm text-slate-500">Batch: {selectedPerformance.batchId}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {selectedPerformance.isAtRisk ? (
                    <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-700">At Risk</span>
                  ) : (
                    <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">On Track</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-6 shrink-0">
              {['overview', 'analytics', 'tasks', 'assessments'].map(t => (
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
                    <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Core Metrics</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Overall Average</span>
                        <span className="font-medium text-slate-800">{selectedPerformance.average_score}%</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Attendance Rate</span>
                        <span className="font-medium text-slate-800">{selectedPerformance.attendance_rate}%</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Task Completion</span>
                        <span className="font-medium text-slate-800">{selectedPerformance.task_completion_rate}%</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assessment Avg</span>
                        <span className="font-medium text-slate-800">{selectedPerformance.assessment_score}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                  Detailed analytics charts will appear here.
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                  Task completion history will appear here.
                </div>
              )}

              {activeTab === 'assessments' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                  Assessment results history will appear here.
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
