"use client";

import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Users, BookOpen, 
  Briefcase, MessageSquare, FileText, Activity, Eye, CheckCircle
} from 'lucide-react';
import { coordinatorService } from '@/src/services/coordinator.service';
import { Coordinator, CollegeReport } from '@/src/types/api/coordinator.types';
import { Drawer } from '@/components/feature/ui/Drawer';
import { EnhancedTable } from '@/components/feature/ui/Table';

export default function CoordinatorManagementPage() {

  const [activeView, setActiveView] = useState<'dashboard' | 'directory'>('dashboard');
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [selectedCoordinator, setSelectedCoordinator] = useState<Coordinator | null>(null);
  const [reports, setReports] = useState<CollegeReport[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCoordinator, setNewCoordinator] = useState({ name: '', email: '', collegeId: '', phone: '' });
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'reports' | 'communication'>('overview');
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

  const handleAddCoordinator = async () => {
    if (!newCoordinator.name || !newCoordinator.email) {
      alert("Name and Email are required");
      return;
    }
    await coordinatorService.createCoordinator({
      name: newCoordinator.name,
      email: newCoordinator.email,
      collegeId: newCoordinator.collegeId || 'COL-99',
      phone: newCoordinator.phone,
      employeeId: 'EMP-' + Math.floor(Math.random() * 1000)
    });
    setIsAddModalOpen(false);
    setNewCoordinator({ name: '', email: '', collegeId: '', phone: '' });
    loadData();
  };


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
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-text-primary">College Coordinator Module</h1>
          <p className="text-sm text-text-secondary mt-1">Manage institutional partners, performance, and communication.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-border">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'dashboard' ? 'bg-white text-text-primary shadow-sm border border-border/50' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveView('directory')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'directory' ? 'bg-white text-text-primary shadow-sm border border-border/50' : 'text-text-secondary hover:text-text-primary'}`}
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
                <div key={idx} className="bg-white border border-border rounded-xl p-5 shadow-sm flex items-center justify-between group hover:border-secondary transition-all duration-200">
                  <div>
                    <div className="text-2.5xl font-black text-text-primary tracking-tight">{kpi.val}</div>
                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">{kpi.label}</div>
                  </div>
                  <div className={`h-11 w-11 rounded-lg ${kpi.color} border flex items-center justify-center shrink-0`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-text-primary">Top Performing Colleges</h3>
              <div className="space-y-3">
                {coordinators.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-50 border border-border rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleCoordinatorClick(c)}>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary leading-tight">{c.name}</h4>
                        <p className="text-xs text-helper mt-1">College ID: {c.collegeId} • Email: {c.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-text-secondary">
                      <div className="text-center">
                        <div className="font-bold text-text-primary">{c.assignedStudentsCount}</div>
                        <div className="text-[10px] uppercase tracking-wider text-text-secondary">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-text-primary">{c.placementsCount}</div>
                        <div className="text-[10px] uppercase tracking-wider text-text-secondary">Placements</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'directory' && (
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm"
              >
                <Plus className="h-4 w-4" /> Add Coordinator
              </button>
            </div>
            <EnhancedTable
              data={coordinators}
              columns={[
                {
                  key: 'name',
                  label: 'Name',
                  render: (c: Coordinator) => (
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-blue-500" />
                      <div>
                        <div>{c.name}</div>
                        <div className="text-xs text-text-secondary font-normal">{c.email}</div>
                      </div>
                    </div>
                  ),
                },
                { key: 'collegeId', label: 'College ID' },
                { key: 'assignedStudentsCount', label: 'Students' },
                { key: 'activeBatchesCount', label: 'Batches' },
                { key: 'placementsCount', label: 'Placements' },
                {
                  key: 'status',
                  label: 'Status',
                  render: (c: Coordinator) => (
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                      c.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-text-primary'
                    }`}>
                      {c.status}
                    </span>
                  ),
                },
                {
                  key: 'actions',
                  label: '',
                  className: 'text-right',
                  render: (c: Coordinator) => (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleCoordinatorClick(c)} className="p-1 text-text-secondary hover:text-blue-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this coordinator?')) {
                            await coordinatorService.deleteCoordinator(c.id);
                            loadData();
                          }
                        }}
                        className="p-1 text-text-secondary hover:text-red-600 transition-colors"
                      >
                        <span className="text-xs font-semibold">Delete</span>
                      </button>
                    </div>
                  ),
                },
              ]}
              searchPlaceholder="Search by name..."
              itemsPerPage={10}
              emptyMessage="No coordinators found."
            />
          </div>
        )}
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Coordinator Profile" size="lg">
        {selectedCoordinator && (
          <div className="flex flex-col h-full bg-slate-50 min-h-0">
            <div className="bg-white border-b border-border px-6 py-4 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">{selectedCoordinator.name}</h2>
                    <p className="text-sm text-text-secondary">ID: {selectedCoordinator.id} • College: {selectedCoordinator.collegeId}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    selectedCoordinator.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-text-primary'
                  }`}>
                    {selectedCoordinator.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex overflow-x-auto border-b border-border bg-white px-6 shrink-0">
              {['overview', 'students', 'reports', 'communication'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                >
                  <span className="capitalize">{t}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-border shadow-sm space-y-4">
                    <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Email</span>
                        <span className="font-medium text-text-primary">{selectedCoordinator.email}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Phone</span>
                        <span className="font-medium text-text-primary">{selectedCoordinator.phone}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Employee ID</span>
                        <span className="font-medium text-text-primary">{selectedCoordinator.employeeId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-4">
                  <div className="flex justify-end mb-4">
                    <button 
                      onClick={async () => {
                        const month = prompt("Enter report month (e.g., July):");
                        if (!month) return;
                        const year = prompt("Enter report year (e.g., 2026):");
                        if (!year) return;
                        await coordinatorService.uploadReport(selectedCoordinator.id, {
                          id: `rep-${Math.floor(Math.random() * 1000)}`,
                          month,
                          year,
                          fileId: `file-${Math.floor(Math.random() * 1000)}`
                        });
                        const updatedRpts = await coordinatorService.getReports(selectedCoordinator.id);
                        setReports(updatedRpts);
                      }}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" /> Upload Report
                    </button>
                  </div>
                  {reports.map(r => (
                    <div key={r.id} className="bg-white p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-text-primary">{r.month} {r.year} Report</div>
                          <div className="text-xs text-text-secondary">File ID: {r.fileId}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const element = document.createElement("a");
                          const file = new Blob([`Dummy report content for ${r.month} ${r.year}`], { type: 'text/plain' });
                          element.href = URL.createObjectURL(file);
                          element.download = `Report_${r.month}_${r.year}.txt`;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                        }}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                  {reports.length === 0 && <p className="text-sm text-text-secondary text-center">No reports available.</p>}
                </div>
              )}

              {activeTab === 'students' && (
                <div className="bg-white rounded-xl border border-border shadow-sm p-6 text-center text-text-secondary">
                  Assigned student list will appear here.
                </div>
              )}

              {activeTab === 'communication' && (
                <div className="bg-white rounded-xl border border-border shadow-sm p-6 text-center text-text-secondary">
                  Message history will appear here.
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Add Coordinator Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl font-bold text-text-primary">Add New Coordinator</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-label block mb-1">Name *</label>
                <input 
                  type="text" 
                  className="w-full border rounded p-2 text-sm"
                  value={newCoordinator.name}
                  onChange={e => setNewCoordinator(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-label block mb-1">Email *</label>
                <input 
                  type="email" 
                  className="w-full border rounded p-2 text-sm"
                  value={newCoordinator.email}
                  onChange={e => setNewCoordinator(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-label block mb-1">College ID</label>
                <input 
                  type="text" 
                  className="w-full border rounded p-2 text-sm"
                  value={newCoordinator.collegeId}
                  onChange={e => setNewCoordinator(prev => ({ ...prev, collegeId: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-label block mb-1">Phone</label>
                <input 
                  type="text" 
                  className="w-full border rounded p-2 text-sm"
                  value={newCoordinator.phone}
                  onChange={e => setNewCoordinator(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCoordinator}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                Add Coordinator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
