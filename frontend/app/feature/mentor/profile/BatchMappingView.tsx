"use client";

import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, Package, Link2, Users } from 'lucide-react';
import { mentorService } from '@/src/services/mentor.service';
import { batchService } from '@/src/services/batch.service';
import { MentorBatchMapping, MentorProfile } from '@/src/types/api/mentor.types';
import { BatchResponse } from '@/src/types/api/batch.types';
import { apiClient } from '@/src/api/api.client';


export default function MentorBatchMappingPage() {
  const [mappings, setMappings] = useState<MentorBatchMapping[]>([]);
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [batches, setBatches] = useState<BatchResponse[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapForm, setMapForm] = useState({
    mentor_profile_id: '',
    batch_id: ''
  });

  const fetchData = async () => {
    setLoading(true);
    const [mapData, mData, bData] = await Promise.all([
      mentorService.getBatchMappings(),
      mentorService.getMentorProfiles(),
      batchService.getBatches()
    ]);
    setMappings(mapData);
    setMentors(mData);
    setBatches(bData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapForm.mentor_profile_id || !mapForm.batch_id) {
      alert("Please select both a mentor and a batch");
      return;
    }
    
    try {
      await apiClient.post('/api/v1/allocation', {
        source_type: "MENTOR",
        source_id: mapForm.mentor_profile_id,
        target_type: "BATCH",
        target_id: mapForm.batch_id,
        role: "LEAD_MENTOR",
        status: "ACTIVE"
      });
      alert("Successfully mapped mentor to batch!");
      
      // Update mock mapping for UI preview
      const mentor = mentors.find(m => m.mentor_profile_id === mapForm.mentor_profile_id);
      const batch = batches.find(b => b.id === mapForm.batch_id);
      
      if (mentor && batch) {
        await mentorService.createBatchMapping({
          mentorProfileId: mentor.mentor_profile_id,
          mentorName: mentor.employeeName || 'Unknown',
          employeeId: mentor.employee_id,
          batchId: batch.id,
          batchName: batch.name || 'Unknown Batch',
          batchCode: batch.code || 'UNKNOWN',
          programName: batch.program_name || 'Program',
          studentCount: 0,
          batchCapacity: batch.max_capacity || 50,
          mappedDate: new Date().toISOString().split('T')[0],
          status: 'Active',
          mappedBy: 'Current User'
        });
      }
      
      setIsMapOpen(false);
      setMapForm({ mentor_profile_id: '', batch_id: '' });
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Failed to create mapping");
    }
  };
  const filtered = mappings.filter(m => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      m.mentorName.toLowerCase().includes(q) ||
      m.batchName.toLowerCase().includes(q) ||
      m.batchCode.toLowerCase().includes(q) ||
      m.programName.toLowerCase().includes(q);
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeMappings = mappings.filter(m => m.status === 'Active').length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Mentor Batch Mapping</h1>
          <p className="text-sm text-text-secondary mt-1">HR assigns lead mentors to cohort batches after profile creation.</p>
        </div>
        <button onClick={() => setIsMapOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> Map Mentor to Batch
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Link2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase">Total Mappings</p>
              <p className="text-2xl font-black text-text-primary">{mappings.length}</p>
            </div>
          </div>
          <div className="bg-white border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase">Active Batches</p>
              <p className="text-2xl font-black text-text-primary">{activeMappings}</p>
            </div>
          </div>
          <div className="bg-white border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase">Unique Mentors</p>
              <p className="text-2xl font-black text-text-primary">{new Set(mappings.map(m => m.mentorProfileId)).size}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search batch, mentor, program..."
                className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm text-text-secondary focus:outline-none focus:border-primary"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
            <button className="p-2 border border-border text-text-secondary rounded-lg hover:bg-slate-50">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(m => {
            const utilPct = m.batchCapacity > 0 ? Math.round((m.studentCount / m.batchCapacity) * 100) : 0;
            return (
              <div key={m.id} className="bg-white border border-border rounded-xl p-5 shadow-sm hover:border-secondary transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-[10px] font-bold text-text-secondary bg-slate-50 px-2 py-0.5 rounded border">{m.batchCode}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    m.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                    m.status === 'Upcoming' ? 'bg-blue-50 text-blue-700' :
                    'bg-slate-100 text-text-secondary'
                  }`}>{m.status}</span>
                </div>

                <h4 className="font-bold text-text-primary">{m.batchName}</h4>
                <p className="text-xs text-text-secondary mt-0.5">{m.programName}</p>

                <div className="mt-4 pt-3 border-t border-border flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
                    {m.mentorName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary font-bold uppercase">Lead Mentor</p>
                    <p className="text-sm font-semibold text-text-primary">{m.mentorName}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-text-secondary font-bold block">Students</span>
                    <span className="font-black text-text-primary">{m.studentCount} / {m.batchCapacity}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary font-bold block">Mapped On</span>
                    <span className="font-semibold text-text-primary">{m.mappedDate}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-text-secondary mb-1">
                    <span>Batch occupancy</span>
                    <span>{utilPct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${utilPct}%` }} />
                  </div>
                </div>

                <p className="text-[10px] text-text-secondary mt-3">Mapped by {m.mappedBy}</p>
              </div>
            );
          })}
        </div>


        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-secondary text-sm">No batch mappings match your filters.</div>
        )}
      </div>

      {isMapOpen && (
        <div className="absolute inset-0 bg-black/50 z-[100] flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-slide-in">
            <h3 className="text-lg font-bold text-text-primary mb-4">Map Mentor to Batch</h3>
            
            <form onSubmit={handleMapSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-text-secondary uppercase">Select Mentor</label>
                <select 
                  required
                  value={mapForm.mentor_profile_id}
                  onChange={e => setMapForm({...mapForm, mentor_profile_id: e.target.value})}
                  className="w-full p-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary text-text-primary font-medium"
                >
                  <option value="">-- Choose Mentor --</option>
                  {mentors.map(m => (
                    <option key={m.mentor_profile_id} value={m.mentor_profile_id}>
                      {m.employeeName || 'Unknown Mentor'} ({m.employee_id || m.mentor_profile_id.substring(0, 8)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-text-secondary uppercase">Select Batch</label>
                <select 
                  required
                  value={mapForm.batch_id}
                  onChange={e => setMapForm({...mapForm, batch_id: e.target.value})}
                  className="w-full p-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary text-text-primary font-medium"
                >
                  <option value="">-- Choose Batch --</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code || b.id.substring(0, 8)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsMapOpen(false)}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-bold text-text-secondary hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700"
                >
                  Confirm Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
