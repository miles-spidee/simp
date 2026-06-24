"use client";

import React, { useState } from 'react';
import { 
  BookOpen, FolderOpen, Percent, Users, ChevronRight, 
  TrendingUp, ArrowUpRight, GraduationCap, Clock
} from 'lucide-react';

export default function LMSDashboardPage() {
  const [stats, setStats] = useState({
    totalCourses: 15,
    totalResources: 340,
    courseCompletion: 78,
    activeLearners: 124
  });

  return (
    <div className="space-y-6 animate-slide-in select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Learning Pathway</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold text-[10px]">Dashboard</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">LMS Dashboard</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of technical curriculum progression, uploaded files, and active intern cohorts metrics.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Courses', val: stats.totalCourses, icon: BookOpen, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Total Resources', val: stats.totalResources, icon: FolderOpen, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Course Completion', val: `${stats.courseCompletion}%`, icon: Percent, color: 'text-purple-600 bg-purple-50 border-purple-100' },
          { label: 'Active Learners', val: stats.activeLearners, icon: Users, color: 'text-amber-600 bg-amber-50 border-amber-100' }
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

      {/* Analytics details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progression charts */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
            Category-wise completion rates
          </h3>
          <div className="space-y-4 pt-1">
            {[
              { category: 'Frontend UI Development', rate: 88, color: 'bg-blue-600' },
              { category: 'Backend Systems & Microservices', rate: 74, color: 'bg-emerald-600' },
              { category: 'Cloud Infrastructure & DevOps', rate: 65, color: 'bg-purple-600' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{item.category}</span>
                  <span>{item.rate}% Completion Rate</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick statistics checklist */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <GraduationCap className="h-4.5 w-4.5 text-blue-600" />
            Storage Pool Metrics
          </h3>
          <div className="space-y-3.5 pt-1 text-xs">
            <div className="flex justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 font-semibold">Total Video Hours:</span>
              <strong className="text-slate-800">120 hrs</strong>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 font-semibold">PDF Files Attached:</span>
              <strong className="text-slate-800">185 files</strong>
            </div>
            <div className="flex justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 font-semibold">Allocated Storage:</span>
              <strong className="text-blue-600 font-bold">14.5 GB / 50 GB</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
