"use client";

import React, { useEffect, useState } from 'react';
import { Package, Search, Filter, Plus, ChevronRight, Calendar, Users, GraduationCap } from 'lucide-react';
import { batchService } from '@/src/services/batch.service';
import { Batch } from '@/src/data/mock-batches';
import { programService } from '@/src/services/program.service';
import { Program } from '@/src/data/mock-programs';

interface BatchWithProgram extends Batch {
  programData?: Program;
}

export default function BatchPage() {
  const [batches, setBatches] = useState<BatchWithProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const batchData = await batchService.getBatches();
        const progData = await programService.getPrograms();
        
        const mergedData = batchData.map(batch => ({
          ...batch,
          programData: progData.find(p => p.id === batch.programId)
        }));
        
        setBatches(mergedData);
      } catch (err) {
        console.error('Failed to load batches', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredBatches = batches.filter(batch => 
    batch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ongoingBatches = batches.filter(b => b.status === 'Ongoing').length;
  const upcomingBatches = batches.filter(b => b.status === 'Upcoming').length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Lifecycle</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold">Batches</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Learning Cohorts</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage batches, schedules, and capacity limits for programs.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer">
            <Plus className="h-3.5 w-3.5" />
            <span>Create Batch</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{batches.length}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Batches</div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{ongoingBatches}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Ongoing Batches</div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{upcomingBatches}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Upcoming Batches</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search batches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Grid View */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.length > 0 ? (
            filteredBatches.map((batch) => (
              <div key={batch.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Package className="h-5 w-5" />
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    batch.status === 'Ongoing' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : batch.status === 'Upcoming'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {batch.status}
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-slate-900 leading-tight mb-2">{batch.name}</h3>
                
                <div className="mt-4 space-y-3 pt-4 border-t border-slate-100 flex-grow">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{batch.programData?.title || batch.programId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{batch.startDate} to {batch.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span>Capacity: {batch.capacity}</span>
                  </div>
                </div>
                
                <button className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors">
                  View Roster
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500">
              <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-medium text-slate-600">No batches found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
