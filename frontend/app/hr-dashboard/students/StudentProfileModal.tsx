"use client";

import React, { useState } from 'react';
import { X, Link as LinkIcon, Download, CheckCircle2, Circle } from 'lucide-react';
import { StudentData } from '../HRDashboardContext';

interface StudentProfileModalProps {
  student: StudentData | null;
  onClose: () => void;
}

export default function StudentProfileModal({ student, onClose }: StudentProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'internship' | 'docs'>('overview');

  if (!student) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 z-[110] w-full max-w-md bg-white shadow-2xl animate-slide-in flex flex-col border-l border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Student Profile</h2>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Profile Identity */}
          <div className="p-6 pb-0">
            <div className="flex items-start gap-5">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 text-slate-600 font-black flex items-center justify-center text-2xl shrink-0 border-4 border-white shadow-md">
                {student.initials}
              </div>
              <div className="pt-1">
                <h3 className="text-xl font-black text-slate-900">{student.name}</h3>
                <p className="text-sm font-bold text-blue-600 mt-0.5 mb-2">{student.id}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    student.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    student.status === 'Hired' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                    student.status === 'Screening' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {student.status === 'Active' ? 'Active Intern' : student.status}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                    Fall 2024 Batch
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 mt-6 border-b border-slate-100 flex gap-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'academic', label: 'Academic' },
              { id: 'internship', label: 'Internship' },
              { id: 'docs', label: 'Docs' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-sm font-bold transition-all relative ${
                  activeTab === tab.id 
                    ? 'text-blue-600' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content: Overview */}
          {activeTab === 'overview' && (
            <div className="p-6 space-y-8 animate-in fade-in duration-300">
              
              {/* Personal Details */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-4">Personal Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email</div>
                    <div className="text-xs font-semibold text-slate-700 break-all">{student.email}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Phone</div>
                    <div className="text-xs font-semibold text-slate-700">+1 (555) 012-3456</div>
                  </div>
                  <div className="col-span-2 mt-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Profiles</div>
                    <div className="flex gap-4">
                      <a href="#" className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
                        <LinkIcon className="h-3.5 w-3.5" /> LinkedIn
                      </a>
                      <a href="#" className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
                        <LinkIcon className="h-3.5 w-3.5" /> GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Internship Info */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-4">Internship Info</h4>
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Program</div>
                    <div className="text-sm font-bold text-slate-800">Data Engineering Co-op</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Manager</div>
                    <div className="text-sm font-bold text-slate-800">Arjun V.</div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-4">Documents</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-blue-50 text-blue-600 flex items-center justify-center rounded-lg">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-slate-700">Resume_{student.initials}_2024.pdf</span>
                    </div>
                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-lg">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-slate-700">ID_Proof_Passport.pdf</span>
                    </div>
                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-4">Activity Log</h4>
                <div className="relative pl-3 space-y-6">
                  {/* Timeline Line */}
                  <div className="absolute top-2 bottom-2 left-[15px] w-0.5 bg-slate-100 z-0"></div>
                  
                  <div className="flex gap-4 relative z-10">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 bg-white" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Status changed to &quot;Active Intern&quot;</div>
                      <div className="text-[10px] text-slate-500 mt-1">Nov 14, 2024 • By System Auto-flow</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 relative z-10">
                    <Circle className="h-5 w-5 text-blue-500 bg-white" strokeWidth={3} />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Internship Offer Accepted</div>
                      <div className="text-[10px] text-slate-500 mt-1">Nov 02, 2024 • By {student.name}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
          
          {/* Mock content for other tabs */}
          {activeTab !== 'overview' && (
            <div className="p-6 flex flex-col items-center justify-center text-center h-48 animate-in fade-in">
              <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-3">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-700">No data available</h3>
              <p className="text-xs text-slate-500 mt-1">There is no information to display here yet.</p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-white shrink-0 grid grid-cols-2 gap-3">
          <button className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors">
            Edit Profile
          </button>
          <button className="px-4 py-2.5 bg-[#003B95] text-white text-xs font-bold rounded-xl hover:bg-[#002f78] transition-colors shadow-sm">
            Assign Program
          </button>
        </div>

      </div>
    </>
  );
}
