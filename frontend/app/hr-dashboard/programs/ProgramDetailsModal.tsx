"use client";

import React from 'react';
import { X, Mail } from 'lucide-react';
import { ProgramData } from '../HRDashboardContext';

interface ProgramDetailsModalProps {
  program: ProgramData | null;
  onClose: () => void;
}

export default function ProgramDetailsModal({ program, onClose }: ProgramDetailsModalProps) {
  if (!program) return null;

  const utilization = Math.round((program.filled / program.capacity) * 100);
  const isCritical = utilization >= 90;

  // Mock dates for demonstration as they are not in the context yet
  const startDate = "Jan 15, 2024";
  const endDate = "Jun 30, 2024";

  // Mock mentors
  const mentors = [
    { name: program.manager, role: "Program Manager", initial: program.manager[0] },
    { name: "Sarah Jenkins", role: "Senior Data Engineer", initial: "S" }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 z-[110] w-full max-w-md bg-[#f8fafc] shadow-2xl animate-slide-in flex flex-col border-l border-slate-200">
        
        {/* Dynamic Header - Solid Blue */}
        <div className="bg-[#0047b3] text-white p-6 shrink-0 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <span className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-colors cursor-pointer">
              DETAILS
            </span>
            <button 
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-6 relative z-10">
            <h2 className="text-2xl font-black tracking-tight leading-tight mb-1">{program.name}</h2>
            <p className="text-blue-100 text-sm font-medium">Department: {program.department}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          
          {/* Program Information Grid */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4">Program Information</h4>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <div className="text-[10px] font-bold text-slate-500 mb-1">Type</div>
                <div className="text-sm font-black text-slate-800">{program.type}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 mb-1">Duration</div>
                <div className="text-sm font-black text-slate-800">{program.duration}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 mb-1">Start Date</div>
                <div className="text-sm font-black text-slate-800">{startDate}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 mb-1">End Date</div>
                <div className="text-sm font-black text-slate-800">{endDate}</div>
              </div>
            </div>
          </div>

          {/* Capacity Utilization Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4">Capacity Utilization</h4>
            <div className="flex justify-between items-end mb-3">
              <div>
                <span className="text-3xl font-black text-slate-900 tracking-tight">{program.filled}</span>
                <span className="text-sm font-bold text-slate-400 ml-1">/ {program.capacity}</span>
                <div className="text-[10px] text-slate-500 font-medium mt-1">Seats Occupied</div>
              </div>
              <div className="text-right">
                <span className={`text-xl font-black ${isCritical ? 'text-rose-500' : 'text-emerald-500'} tracking-tight`}>
                  {(program.capacity - program.filled).toString().padStart(2, '0')}
                </span>
                <div className="text-[10px] text-slate-500 font-medium mt-1">Available</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-3 w-full bg-emerald-100 rounded-full overflow-hidden mb-4">
              <div 
                className={`h-full ${isCritical ? 'bg-[#003B95]' : 'bg-[#003B95]'}`} 
                style={{ width: `${utilization}%` }}
              ></div>
            </div>
            
            {/* Critical Alert */}
            {isCritical && (
              <p className="text-[11px] font-medium text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-bold text-[#003B95]">CRITICAL:</span> Seat utilization has reached {utilization}%. Consider increasing capacity or closing enrollment soon.
              </p>
            )}
          </div>

          {/* Assigned Mentors */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Assigned Mentors</h4>
              <span className="text-[10px] font-bold text-[#003B95] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                Count: {mentors.length < 10 ? `0${mentors.length}` : mentors.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {mentors.map((mentor, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200/80 rounded-xl hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center shadow-sm shrink-0 border border-slate-200">
                      {mentor.initial}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{mentor.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{mentor.role}</div>
                    </div>
                  </div>
                  <button className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button className="w-full py-3 border border-dashed border-[#003B95]/30 text-[#003B95] text-xs font-bold rounded-xl hover:bg-blue-50 hover:border-[#003B95] transition-all">
                + Add New Mentor
              </button>
            </div>
          </div>

          {/* Enrollment Breakdown */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4">Enrollment Breakdown</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f0f4ff] border border-[#e0e7ff] rounded-xl p-5 text-center shadow-sm">
                <div className="text-2xl font-black text-slate-900 mb-1">{program.filled}</div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-600">Active Students</div>
              </div>
              <div className="bg-[#f0f4ff] border border-[#e0e7ff] rounded-xl p-5 text-center shadow-sm">
                <div className="text-2xl font-black text-slate-900 mb-1">
                  {Math.floor(program.filled * 0.18).toString().padStart(2, '0')}
                </div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-600">Completed</div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Footer Action */}
        <div className="p-6 bg-white shrink-0 border-t border-slate-200">
          <button className="w-full py-3.5 bg-[#1a1f36] text-white text-[13px] font-bold rounded-xl hover:bg-black transition-colors shadow-md">
            View All Enrolled Students
          </button>
        </div>

      </div>
    </>
  );
}
