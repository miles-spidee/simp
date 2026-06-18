"use client";

import React, { useState } from 'react';
import { useHRDashboard, ProgramData } from '../HRDashboardContext';
import ProgramDetailsModal from './ProgramDetailsModal';
import {
  FolderOpen,
  PlayCircle,
  Users,
  CheckSquare,
  Armchair,
  Trophy,
  Search,
  ChevronDown,
  MoreVertical,
  Download,
  UserPlus,
  Rocket,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function InternshipProgramsPage() {
  const { programs } = useHRDashboard();
  const [selectedProgram, setSelectedProgram] = useState<ProgramData | null>(null);

  // Aggregate metrics
  const totalPrograms = programs.length;
  const activePrograms = programs.filter(p => p.status === 'Active').length;
  const totalCapacity = programs.reduce((acc, curr) => acc + curr.capacity, 0);
  const filledSeats = programs.reduce((acc, curr) => acc + curr.filled, 0);
  const availableSeats = totalCapacity - filledSeats;
  const nearCompletion = 8; // Mocked for display matching the mockup

  // Function to format date range for table
  const getDateRange = (type: string) => {
    if (type.includes('Research')) return 'Jan 15\n- Jun 30';
    if (type.includes('Data') || type.includes('Stipend')) return 'Feb 01\n- Apr 30';
    if (type.includes('Marketing')) return 'Nov 01\n- Dec 31';
    return 'Mar 15\n- Jul 15';
  };

  return (
    <div className="space-y-8 animate-slide-in">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Internship Program Management</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage holistic internship programs, define seat capacities, assign specialized<br/>mentors, and track lifecycle durations across various internship types.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="h-4 w-4" /> Export Programs
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <UserPlus className="h-4 w-4" /> Assign Mentor
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#003B95] text-white text-xs font-bold rounded-lg hover:bg-[#002f78] transition-colors shadow-sm">
            <Rocket className="h-4 w-4" /> Create Program
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'TOTAL PROGRAMS', value: totalPrograms.toString(), icon: FolderOpen, trend: '+12%', color: 'border-blue-600', text: 'text-blue-600' },
          { label: 'ACTIVE PROGRAMS', value: activePrograms.toString(), icon: PlayCircle, trend: '', color: 'border-emerald-500', text: 'text-emerald-500' },
          { label: 'TOTAL CAPACITY', value: totalCapacity.toLocaleString(), icon: Users, trend: '', color: 'border-indigo-500', text: 'text-indigo-500' },
          { label: 'FILLED SEATS', value: filledSeats.toLocaleString(), icon: CheckSquare, trend: '', color: 'border-purple-500', text: 'text-purple-500' },
          { label: 'AVAILABLE SEATS', value: availableSeats.toLocaleString(), icon: Armchair, trend: '', color: 'border-amber-500', text: 'text-amber-500' },
          { label: 'NEAR COMPLETION', value: nearCompletion.toString().padStart(2, '0'), icon: Trophy, trend: '', color: 'border-rose-500', text: 'text-rose-500' },
        ].map((kpi, i) => (
          <div key={i} className={`bg-white border-y border-r border-slate-200 border-l-4 ${kpi.color} rounded-r-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center ${kpi.text} group-hover:scale-110 transition-transform`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              {kpi.trend && (
                <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> {kpi.trend}
                </span>
              )}
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">{kpi.value}</div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mt-1">{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Search & Filters Bar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px] lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Program Name or Dept..." 
              className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-200 bg-slate-50 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
            {['Department', 'Internship Type', 'Status'].map((filter, i) => (
              <button key={i} className="flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 whitespace-nowrap min-w-[150px]">
                {filter} <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              More Filters
            </button>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-800 whitespace-nowrap flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          </div>
        </div>

        {/* Programs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-500 font-extrabold">
                <th className="p-6">Program Name</th>
                <th className="p-6">Type & Dept</th>
                <th className="p-6 text-center">Duration</th>
                <th className="p-6">Utilization</th>
                <th className="p-6">Date Range</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {programs.map((prog) => {
                const util = Math.round((prog.filled / prog.capacity) * 100);
                const isCritical = util >= 90;
                
                // Color assignments based on type for mockup accuracy
                let typeBadgeColor = 'bg-indigo-50 text-indigo-700';
                if (prog.type === 'Paid') typeBadgeColor = 'bg-blue-50 text-blue-700';
                if (prog.type === 'Stipend Based') typeBadgeColor = 'bg-[#e0e7ff] text-[#4338ca]';
                if (prog.type === 'Research Based') typeBadgeColor = 'bg-purple-50 text-purple-700';
                if (prog.name.includes('Automation')) typeBadgeColor = 'bg-rose-50 text-rose-700';
                
                let progressColor = isCritical ? 'bg-[#003B95]' : (prog.name.includes('Full Stack') ? 'bg-[#003B95]' : 'bg-rose-500');
                if (prog.name.includes('Automation')) progressColor = 'bg-amber-500';

                return (
                  <tr 
                    key={prog.id} 
                    className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedProgram(prog)}
                  >
                    <td className="p-6">
                      <div className="font-bold text-[#003B95] text-sm max-w-[160px] leading-tight mb-1">{prog.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">Project: Neural Synthesis</div>
                    </td>
                    <td className="p-6">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider mb-2 ${typeBadgeColor}`}>
                        {prog.type === 'Research Based' ? 'RESEARCH' : prog.type === 'Stipend Based' ? 'STIPEND BASED' : prog.type === 'Paid' ? 'PAID' : 'INDUSTRIAL'}
                      </span>
                      <div className="text-[11px] text-slate-600 font-medium">{prog.department}</div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="font-black text-slate-800 text-lg">{prog.duration.split(' ')[0]}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Weeks</div>
                    </td>
                    <td className="p-6 w-48">
                      <div className="flex justify-between items-center mb-1.5 text-xs font-black">
                        <span className="text-slate-800">{prog.filled} / {prog.capacity}</span>
                        <span className="text-slate-800">{util}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${progressColor}`} style={{ width: `${util}%` }}></div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-[11px] font-semibold text-slate-700 whitespace-pre-line leading-relaxed">
                        {getDateRange(prog.type)}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                        prog.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                        prog.name.includes('Full Stack') ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          prog.status === 'Active' ? 'bg-emerald-500' :
                          prog.name.includes('Full Stack') ? 'bg-amber-500' :
                          'bg-slate-400'
                        }`} />
                        {prog.name.includes('Full Stack') ? 'Upcoming' : 
                         prog.name.includes('Marketing') ? 'Completed' : 'Active'}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        className="text-slate-400 hover:text-[#003B95] transition-colors p-2 rounded-md hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProgram(prog);
                        }}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500 bg-white">
          <div>Showing 4 of 42 programs</div>
          <div className="flex items-center gap-1">
            <button className="h-8 w-8 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="h-8 w-8 flex items-center justify-center border border-[#003B95] bg-[#003B95] text-white font-bold rounded shadow-sm">
              1
            </button>
            <button className="h-8 w-8 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              2
            </button>
            <button className="h-8 w-8 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              3
            </button>
            <button className="h-8 w-8 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Program Details Modal */}
      <ProgramDetailsModal 
        program={selectedProgram} 
        onClose={() => setSelectedProgram(null)} 
      />

    </div>
  );
}
