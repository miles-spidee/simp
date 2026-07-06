"use client";
import React, { useEffect, useState } from 'react';

import { 
  Users, Award, Building, Activity, LayoutGrid, 
  Trash2, Plus, RefreshCw, Briefcase, UserCheck
} from 'lucide-react';

type TabKey = 'overview' | 'student' | 'mentor' | 'program' | 'report_manager' | 'finance_manager' | 'user';

export default function AllocationManagementPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // New allocation form
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [targetType, setTargetType] = useState('PROGRAM');
  const [role, setRole] = useState('MEMBER');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    if (activeTab === 'overview') return;
    
    setLoading(true);
    try {
      const sourceType = activeTab.toUpperCase();
      const res = await fetch(`/api/v1/allocation?source_type=${sourceType}`);
      if(res.ok) {
        const data = await res.json();
        setAllocations(data.data || []);
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch allocations", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const deleteAllocation = async (id: string) => {
    if(!confirm("Are you sure you want to remove this allocation?")) return;
    try {
      const res = await fetch(`/api/v1/allocation/${id}`, { method: "DELETE" });
      if(res.ok) {
        setAllocations(allocations.filter((a: any) => a.id !== id));
        showToast("Allocation removed");
      }
    } catch(error) {
      console.error(error);
      showToast("Error removing allocation", "error");
    }
  };

  const createAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/allocation', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_type: activeTab.toUpperCase(),
          source_id: sourceId,
          target_type: targetType,
          target_id: targetId,
          role: role,
          status: "ACTIVE"
        })
      });
      if(res.ok) {
        showToast("Allocation created successfully");
        setSourceId('');
        setTargetId('');
        fetchData();
      } else {
        const err = await res.json();
        showToast(err.detail || "Error creating allocation", "error");
      }
    } catch(err) {
      console.error(err);
      showToast("Network error", "error");
    }
  };

  const syncApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/allocation/sync-applications`, { method: "POST" });
      if(res.ok) {
        const data = await res.json();
        showToast(data.message);
        fetchData();
      }
    } catch(error) {
      console.error(error);
      showToast("Failed to sync", "error");
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { id: 'overview', label: 'Allocation Overview', icon: LayoutGrid },
    { id: 'student', label: 'Student Mapping', icon: Users },
    { id: 'mentor', label: 'Mentor Mapping', icon: Award },
    { id: 'program', label: 'Program Mapping', icon: Briefcase },
    { id: 'report_manager', label: 'Report Manager Mapping', icon: Activity },
    { id: 'finance_manager', label: 'Finance Manager Mapping', icon: Building },
    { id: 'user', label: 'User Mapping', icon: UserCheck }
  ];

  return (
    <div className="h-screen -m-6 flex bg-slate-50 border border-border rounded-xl overflow-hidden text-text-primary">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl border bg-white animate-slide-in text-xs font-bold transition-all duration-300">
          <span className={toast.type === 'error' ? 'text-red-600' : 'text-emerald-600'}>
            {toast.message}
          </span>
        </div>
      )}

      {/* LEFT PANEL: RELATIONAL sidebar ENTITIES */}
      <div className="w-60 bg-white border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border bg-slate-50/50">
          <div className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Mapping Engine</div>
          <h3 className="font-extrabold text-sm text-text-primary mt-1 tracking-tight">Allocations</h3>
        </div>

        {/* Tab Lists */}
        <div className="p-2 space-y-1 overflow-y-auto flex-1 text-xs font-bold text-text-secondary">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabKey)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 hover:text-text-primary'}`}
            >
              <div className="flex items-center gap-2">
                <tab.icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CENTER WORKSPACE PANEL */}
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <div className="p-5 border-b border-border bg-white flex flex-col sm:flex-row justify-between sm:items-center gap-4 shrink-0">
          <div>
            <h2 className="text-xl font-black text-text-primary tracking-tight capitalize">
              {activeTab.replace('_', ' ')}
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Manage allocations and relationships based on core rules.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'student' && (
              <button 
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-md flex items-center transition-colors"
                onClick={syncApplications} 
                disabled={loading}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Sync from Applications
              </button>
            )}
          </div>
        </div>

        <div className="p-6 flex-1 space-y-6">
          {activeTab === 'overview' ? (
            <div className="bg-white border rounded-xl p-8 text-center text-muted-foreground">
              <LayoutGrid className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">Allocation Overview</h3>
              <p className="text-sm mt-2">Select a mapping category from the sidebar to manage allocations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* List */}
              <div className="xl:col-span-2 bg-white border border-border rounded-xl p-5 shadow-xs overflow-x-auto">
                <h3 className="text-sm font-bold mb-4 capitalize">Current {activeTab.replace('_', ' ')}s</h3>
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-700">Source ID</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Role</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Target Type</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Target ID</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                      <th className="px-4 py-3 font-semibold text-slate-700 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loading ? (
                      <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
                    ) : allocations.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No allocations found.</td></tr>
                    ) : allocations.map((a: any) => (
                      <tr key={a.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-mono text-xs">{a.source_id.substring(0,8)}...</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border">{a.role}</span>
                        </td>
                        <td className="px-4 py-3">{a.target_type}</td>
                        <td className="px-4 py-3 font-mono text-xs">{a.target_id.substring(0,8)}...</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${a.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="p-2 hover:bg-slate-100 rounded-md text-red-500 transition-colors" onClick={() => deleteAllocation(a.id)}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Form */}
              <div className="bg-white border border-border rounded-xl p-5 shadow-xs h-fit">
                <h3 className="text-sm font-bold mb-4">Create New Mapping</h3>
                <form onSubmit={createAllocation} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold">Source ID ({activeTab.toUpperCase()})</label>
                    <input 
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                      placeholder="UUID" 
                      value={sourceId} 
                      onChange={e => setSourceId(e.target.value)} 
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Target Type</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                      value={targetType}
                      onChange={e => setTargetType(e.target.value)}
                    >
                      <option value="PROGRAM">PROGRAM</option>
                      <option value="BATCH">BATCH</option>
                      <option value="USER">USER</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Target ID</label>
                    <input 
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                      placeholder="UUID" 
                      value={targetId} 
                      onChange={e => setTargetId(e.target.value)} 
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Role/Relationship</label>
                    <input 
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                      placeholder="e.g. MEMBER, LEAD, MENTOR" 
                      value={role} 
                      onChange={e => setRole(e.target.value)} 
                    />
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors text-sm">
                    <Plus className="mr-2 h-4 w-4" /> Map Relationship
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
