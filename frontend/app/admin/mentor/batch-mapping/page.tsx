"use client";

import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, Package, Link2, Users } from 'lucide-react';
import { mentorService } from '@/src/services/mentor.service';
import { MentorBatchMapping } from '@/src/data/mock-mentor-batch-mappings';

export default function MentorBatchMappingPage() {
  const [mappings, setMappings] = useState<MentorBatchMapping[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mentorService.getBatchMappings().then(data => {
      setMappings(data);
      setLoading(false);
    });
  }, []);

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
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Mentor Batch Mapping</h1>
          <p className="text-sm text-slate-500 mt-1">HR assigns lead mentors to cohort batches after profile creation.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> Map Mentor to Batch
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Link2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Total Mappings</p>
              <p className="text-2xl font-black text-slate-900">{mappings.length}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Active Batches</p>
              <p className="text-2xl font-black text-slate-900">{activeMappings}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Unique Mentors</p>
              <p className="text-2xl font-black text-slate-900">{new Set(mappings.map(m => m.mentorProfileId)).size}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search batch, mentor, program..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
            <button className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(m => {
            const utilPct = m.batchCapacity > 0 ? Math.round((m.studentCount / m.batchCapacity) * 100) : 0;
            return (
              <div key={m.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border">{m.batchCode}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    m.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                    m.status === 'Upcoming' ? 'bg-blue-50 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{m.status}</span>
                </div>

                <h4 className="font-bold text-slate-900">{m.batchName}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{m.programName}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
                    {m.mentorName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Lead Mentor</p>
                    <p className="text-sm font-semibold text-slate-800">{m.mentorName}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block">Students</span>
                    <span className="font-black text-slate-900">{m.studentCount} / {m.batchCapacity}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">Mapped On</span>
                    <span className="font-semibold text-slate-700">{m.mappedDate}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Batch occupancy</span>
                    <span>{utilPct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${utilPct}%` }} />
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 mt-3">Mapped by {m.mappedBy}</p>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No batch mappings match your filters.</div>
        )}
      </div>
    </div>
  );
}
