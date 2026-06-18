"use client";

import React, { useState } from 'react';
import { useHRDashboard, StudentData } from '../HRDashboardContext';
import StudentProfileModal from './StudentProfileModal';
import {
  Users,
  UserCheck,
  CheckCircle,
  Briefcase,
  Award,
  Upload,
  Download,
  Plus,
  ChevronDown,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function StudentManagementPage() {
  const { metrics, funnelData, students } = useHRDashboard();
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  return (
    <div className="space-y-8 animate-slide-in">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Management</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage student profiles, lifecycle progression, program assignments, documents, and<br/>activity history across all global departments.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="h-4 w-4" /> Export
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Upload className="h-4 w-4" /> Bulk Import
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#003B95] text-white text-xs font-bold rounded-lg hover:bg-[#002f78] transition-colors shadow-sm">
            <Plus className="h-4 w-4" /> Add Student
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'TOTAL STUDENTS', value: '12,482', trend: '+12%', trendColor: 'text-emerald-600', bg: 'bg-rose-50' },
          { label: 'APPLIED', value: '4,201', trend: '+8%', trendColor: 'text-emerald-600', bg: 'bg-rose-50' },
          { label: 'SELECTED', value: '1,840', trend: '+2%', trendColor: 'text-amber-500', bg: 'bg-rose-50' },
          { label: 'ACTIVE INTERNS', value: '856', trend: '+15%', trendColor: 'text-emerald-600', bg: 'bg-rose-50' },
          { label: 'COMPLETED', value: '3,210', trend: 'Stable', trendColor: 'text-slate-500', bg: 'bg-rose-50' },
          { label: 'CERTIFIED', value: '2,945', trend: '92%', trendColor: 'text-emerald-600', bg: 'bg-rose-50' },
          { label: 'HIRED', value: '422', trend: '+18', trendColor: 'text-emerald-600', bg: 'bg-rose-50' },
        ].map((kpi, i) => (
          <div key={i} className={`${kpi.bg} border border-rose-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="text-[9px] font-black uppercase tracking-wider text-slate-500 mb-2 leading-tight h-6">
              {kpi.label}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-800 tracking-tight">{kpi.value}</span>
              <span className={`text-[10px] font-bold ${kpi.trendColor} flex items-center`}>
                {kpi.trend.startsWith('+') && <TrendingUp className="h-2.5 w-2.5 mr-0.5" />}
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lifecycle Progression Funnel */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Lifecycle Progression Funnel</h3>
          <span className="text-[10px] font-bold text-slate-500">Live View • Global Distribution</span>
        </div>
        <div className="p-6">
          <div className="flex w-full h-12 rounded-lg overflow-hidden">
            {[
              { stage: 'APP', count: '4.2k', color: 'bg-[#003B95]' },
              { stage: 'SCR', count: '3.5k', color: 'bg-blue-700' },
              { stage: 'INT', count: '2.1k', color: 'bg-blue-500' },
              { stage: 'SEL', count: '1.8k', color: 'bg-indigo-500' },
              { stage: 'OFF', count: '1.2k', color: 'bg-indigo-400' },
              { stage: 'JON', count: '950', color: 'bg-purple-500' },
              { stage: 'ACT', count: '856', color: 'bg-emerald-500' },
              { stage: 'COM', count: '3.2k', color: 'bg-slate-200', text: 'text-slate-500' },
              { stage: 'CRT', count: '2.9k', color: 'bg-slate-100', text: 'text-slate-400' },
              { stage: 'HRD', count: '422', color: 'bg-slate-50', text: 'text-slate-300' },
            ].map((item, idx) => (
              <div key={idx} className={`flex-1 ${item.color} flex flex-col items-center justify-center border-r border-white/20 last:border-0`}>
                <span className={`text-[10px] font-bold ${item.text || 'text-white/90'}`}>{item.stage}</span>
              </div>
            ))}
          </div>
          <div className="flex w-full mt-3">
            {[
              { count: '4.2k' }, { count: '3.5k' }, { count: '2.1k' }, { count: '1.8k' }, { count: '1.2k' },
              { count: '950' }, { count: '856' }, { count: '3.2k' }, { count: '2.9k' }, { count: '422' }
            ].map((item, idx) => (
              <div key={idx} className="flex-1 text-center text-[10px] font-bold text-slate-500">
                {item.count}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Search & Filters Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search student name or ID..." 
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
            {['All Colleges', 'Department', 'Program'].map((filter, i) => (
              <button key={i} className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 whitespace-nowrap min-w-[140px]">
                {filter} <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-slate-200 hidden lg:block mx-1"></div>

          <div className="flex items-center gap-3 ml-auto w-full lg:w-auto">
            <button className="flex-1 lg:flex-none flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 min-w-[120px]">
              Status <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-800 px-2 whitespace-nowrap">
              Reset
            </button>
            <button className="flex-1 lg:flex-none px-4 py-2 bg-[#003B95] text-white text-xs font-bold rounded-lg hover:bg-[#002f78] transition-colors whitespace-nowrap shadow-sm">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-500 font-extrabold">
                <th className="p-5 w-24">Student ID</th>
                <th className="p-5">Full Name</th>
                <th className="p-5">College/Dept</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-center">Performance</th>
                <th className="p-5">Manager</th>
                <th className="p-5">Created</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {students.map((student) => (
                <tr 
                  key={student.id} 
                  className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <td className="p-5">
                    <div className="text-[11px] font-bold text-blue-600 max-w-[80px] break-words">{student.id}</div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#003B95] to-blue-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0 shadow-sm">
                        {student.initials}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-[13px]">{student.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="font-bold text-slate-700">{student.college}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{student.department}</div>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                      student.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      student.status === 'Hired' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                      student.status === 'Screening' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      student.status === 'Selected' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {student.status === 'Active' ? 'Active Intern' : 
                       student.status === 'Selected' ? 'Offer Released' : student.status}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${student.performance >= 90 ? 'bg-emerald-500' : student.performance >= 75 ? 'bg-blue-500' : 'bg-indigo-500'}`} style={{ width: `${student.performance}%` }}></div>
                      </div>
                      <div className="font-bold text-slate-800 w-8 text-right">{student.performance}%</div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="font-semibold text-slate-700">
                      {student.status === 'Screening' ? 'Unassigned' : 
                       student.status === 'Hired' ? 'Priya Sharma' : 
                       student.id.includes('8842') ? 'Sarah Chen' : 'Arjun V.'}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="text-slate-600 font-medium">{student.createdDate}</div>
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      className="text-slate-400 hover:text-blue-600 transition-colors p-1.5 rounded-md hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(student);
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500 bg-slate-50/30">
          <div>Showing 1-4 of 12,482 students</div>
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

      {/* Student Profile Modal */}
      <StudentProfileModal 
        student={selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
      />

    </div>
  );
}
