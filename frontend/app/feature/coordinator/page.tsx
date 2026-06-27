"use client";

import React, { useState, useEffect } from 'react';
import { 
  Building2, Search, Filter, Plus, Users, BookOpen, 
  Briefcase, MessageSquare, FileText, Activity, Eye, CheckCircle
} from 'lucide-react';
import { coordinatorService } from '@/src/services/coordinator.service';
import { Coordinator, CollegeReport } from '@/src/data/mock-coordinators';
import { Drawer } from '@/components/feature/ui/Drawer';

export default function CoordinatorManagementPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'directory'>('dashboard');
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [selectedCoordinator, setSelectedCoordinator] = useState<Coordinator | null>(null);
  const [reports, setReports] = useState<CollegeReport[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'reports' | 'communication'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await coordinatorService.getCoordinators();
    setCoordinators(data);
    setLoading(false);
  };

  const handleCoordinatorClick = async (coord: Coordinator) => {
    setSelectedCoordinator(coord);
    const rpts = await coordinatorService.getReports(coord.id);
    setReports(rpts);
    setActiveTab('overview');
    setIsDrawerOpen(true);
  };

  const filteredCoordinators = coordinators.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // KPIs
  const totalCoordinators = coordinators.length;
  const totalAssignedStudents = coordinators.reduce((acc, c) => acc + c.assignedStudentsCount, 0);
  const totalActiveBatches = coordinators.reduce((acc, c) => acc + c.activeBatchesCount, 0);
  const totalPlacements = coordinators.reduce((acc, c) => acc + c.placementsCount, 0);

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
          <h1 className="text-xl font-bold text-slate-900">College Coordinator Module</h1>
          <p className="text-sm text-slate-500 mt-1">Manage institutional partners, performance, and communication.</p>
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
                { label: 'Total Coordinators', val: totalCoordinators, icon: Building2, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                { label: 'Assigned Students', val: totalAssignedStudents, icon: Users, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                { label: 'Active Batches', val: totalActiveBatches, icon: BookOpen, color: 'text-purple-600 bg-purple-50 border-purple-100' },
                { label: 'Placements Secured', val: totalPlacements, icon: Briefcase, color: 'text-amber-600 bg-amber-50 border-amber-100' }
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

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Top Performing Colleges</h3>
              <div className="space-y-3">
                {coordinators.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleCoordinatorClick(c)}>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">{c.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">College ID: {c.collegeId} • Email: {c.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-slate-600">
                      <div className="text-center">
                        <div className="font-bold text-slate-800">{c.assignedStudentsCount}</div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-slate-800">{c.placementsCount}</div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500">Placements</div>
                      </div>
                    </div>
                  </div>
                ))}
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
                    placeholder="Search by name..."
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <button className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm">
                <Plus className="h-4 w-4" /> Add Coordinator
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">College ID</th>
                    <th className="px-6 py-3">Students</th>
                    <th className="px-6 py-3">Batches</th>
                    <th className="px-6 py-3">Placements</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCoordinators.map(c => (
                    <tr key={c.id} className="hover:bg-blue-50/50 cursor-pointer transition-colors" onClick={() => handleCoordinatorClick(c)}>
                      <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-blue-500" />
                        <div>
                          <div>{c.name}</div>
                          <div className="text-xs text-slate-500 font-normal">{c.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{c.collegeId}</td>
                      <td className="px-6 py-4 text-slate-600">{c.assignedStudentsCount}</td>
                      <td className="px-6 py-4 text-slate-600">{c.activeBatchesCount}</td>
                      <td className="px-6 py-4 text-slate-600">{c.placementsCount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                          c.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {c.status}
                        </span>
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

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Coordinator Profile" size="lg">
        {selectedCoordinator && (
          <div className="flex flex-col h-full bg-slate-50 min-h-0">
            <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedCoordinator.name}</h2>
                    <p className="text-sm text-slate-500">ID: {selectedCoordinator.id} • College: {selectedCoordinator.collegeId}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    selectedCoordinator.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedCoordinator.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-6 shrink-0">
              {['overview', 'students', 'reports', 'communication'].map(t => (
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
                    <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</span>
                        <span className="font-medium text-slate-800">{selectedCoordinator.email}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</span>
                        <span className="font-medium text-slate-800">{selectedCoordinator.phone}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Employee ID</span>
                        <span className="font-medium text-slate-800">{selectedCoordinator.employeeId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-4">
                  <div className="flex justify-end mb-4">
                    <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Upload Report
                    </button>
                  </div>
                  {reports.map(r => (
                    <div key={r.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{r.month} {r.year} Report</div>
                          <div className="text-xs text-slate-500">File ID: {r.fileId}</div>
                        </div>
                      </div>
                      <button className="text-xs font-bold text-blue-600 hover:underline">Download</button>
                    </div>
                  ))}
                  {reports.length === 0 && <p className="text-sm text-slate-500 text-center">No reports available.</p>}
                </div>
              )}

              {activeTab === 'students' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                  Assigned student list will appear here.
                </div>
              )}

              {activeTab === 'communication' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                  Message history will appear here.
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
