"use client";

import React, { useEffect, useState } from 'react';
import { Briefcase, Search, Filter, Plus, ChevronRight, MapPin, Users } from 'lucide-react';
import { opportunityService } from '@/src/services/opportunity.service';
import { Opportunity } from '@/src/data/mock-opportunities';
import { programService } from '@/src/services/program.service';
import { Program } from '@/src/data/mock-programs';

interface OpportunityWithProgram extends Opportunity {
  programData?: Program;
}

export default function OpportunityPage() {
  const [opportunities, setOpportunities] = useState<OpportunityWithProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const oppData = await opportunityService.getOpportunities();
        const progData = await programService.getPrograms();
        
        const mergedData = oppData.map(opp => ({
          ...opp,
          programData: progData.find(p => p.id === opp.programId)
        }));
        
        setOpportunities(mergedData);
      } catch (err) {
        console.error('Failed to load opportunities', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredOpportunities = opportunities.filter(opp => 
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    opp.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openOpportunities = opportunities.filter(o => o.status === 'Open').length;
  const totalOpenings = opportunities.filter(o => o.status === 'Open').reduce((acc, curr) => acc + curr.openings, 0);

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
            <span>Enterprise</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold">Opportunities</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Opportunity Board</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage job postings, internships, and allocation requirements.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer">
            <Plus className="h-3.5 w-3.5" />
            <span>Post Opportunity</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{opportunities.length}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Postings</div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{openOpportunities}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Active Postings</div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{totalOpenings}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Openings</div>
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
              placeholder="Search opportunities..."
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

        {/* List View */}
        <div className="divide-y divide-slate-100">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opp) => (
              <div key={opp.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{opp.title}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        opp.status === 'Open' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : opp.status === 'Draft'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {opp.status}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span>{opp.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>{opp.openings} Openings</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <span>{opp.programData?.title || opp.programId}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <span className="text-xs text-slate-400">Posted {opp.postedDate}</span>
                  <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">View Details</button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500">
              <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-medium text-slate-600">No opportunities found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
