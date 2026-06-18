"use client";

import React from 'react';
import { useHRDashboard } from './HRDashboardContext';
import {
  Users,
  Briefcase,
  CheckCircle,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Award,
  ArrowRight,
  Filter,
  MoreVertical,
  Activity,
  FolderOpen
} from 'lucide-react';

export default function HRDashboardOverview() {
  const { metrics, funnelData, recentActivity, escalations, students, programs } = useHRDashboard();

  return (
    <div className="space-y-8 animate-slide-in">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Real-time performance and student lifecycle tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-lg shadow-sm">
            CURRENT CYCLE: <span className="text-blue-600">FALL 2024</span>
          </div>
          <button className="h-8 w-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 shadow-sm transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Active Interns', value: metrics.activeInterns.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', trend: '+12.5% New this month' },
          { label: 'Registrations', value: metrics.registrations.toLocaleString(), icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', trend: 'Stable' },
          { label: 'Completion Rate', value: `${metrics.completionRate}%`, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', trend: '+12% vs last cycle' },
          { label: 'Hiring Rate', value: `${metrics.hiringRate}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', trend: '+8% industry avg' },
          { label: 'Total Revenue', value: `$${(metrics.totalRevenue / 1000).toFixed(1)}k`, icon: DollarSign, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100', trend: '+15% Q3 Target Met' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className={`absolute top-0 right-0 p-4 opacity-10 ${kpi.color} transform group-hover:scale-110 transition-transform duration-500`}>
              <kpi.icon className="h-16 w-16" />
            </div>
            <div className={`h-10 w-10 rounded-xl ${kpi.bg} ${kpi.color} ${kpi.border} border flex items-center justify-center mb-4 relative z-10`}>
              <kpi.icon className="h-5 w-5" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{kpi.value}</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 mb-3">{kpi.label}</p>
              <div className="text-[10px] font-bold text-slate-400 bg-slate-50 inline-block px-2 py-1 rounded-md">
                {kpi.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Funnel & Escalations */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Lifecycle Funnel */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Student Lifecycle Funnel</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Lifecycle Progression Funnel - Fall 2024</p>
              </div>
              <button className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                Export Data
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-2">
                {[
                  { stage: 'Applied', count: funnelData.applied, color: 'bg-slate-200' },
                  { stage: 'Screening', count: funnelData.screening, color: 'bg-slate-300' },
                  { stage: 'Interview', count: funnelData.interview, color: 'bg-indigo-200' },
                  { stage: 'Selected', count: funnelData.selected, color: 'bg-indigo-400' },
                  { stage: 'Joined', count: funnelData.joined, color: 'bg-blue-400' },
                  { stage: 'Active Interns', count: funnelData.active, color: 'bg-blue-600' },
                  { stage: 'Completed', count: funnelData.completed, color: 'bg-emerald-400' },
                  { stage: 'Certified', count: funnelData.certified, color: 'bg-emerald-500' },
                  { stage: 'Hired', count: funnelData.hired, color: 'bg-teal-600' },
                ].map((item, idx, arr) => {
                  const max = arr[0].count;
                  const width = `${(item.count / max) * 100}%`;
                  return (
                    <div key={item.stage} className="flex items-center gap-4 text-xs font-bold">
                      <div className="w-24 text-right text-slate-500 uppercase tracking-wider text-[10px]">{item.stage}</div>
                      <div className="flex-1 h-6 bg-slate-50 rounded-r-md relative">
                        <div 
                          className={`absolute top-0 left-0 h-full ${item.color} rounded-r-md flex items-center px-2 transition-all duration-1000 ease-out`}
                          style={{ width }}
                        >
                          {item.count > 100 && <span className="text-white text-[10px] mix-blend-difference">{item.count.toLocaleString()}</span>}
                        </div>
                      </div>
                      <div className="w-12 text-slate-700 text-right">{item.count < 100 && item.count.toLocaleString()}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Student Management Preview Table */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Student Management</h3>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-500 font-extrabold">
                    <th className="p-4">Student ID / Name</th>
                    <th className="p-4 hidden sm:table-cell">College / Dept</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Performance</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px] shrink-0 border border-slate-200">
                            {student.initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{student.name}</div>
                            <div className="text-[10px] text-slate-500 font-medium">{student.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="font-semibold text-slate-700">{student.college}</div>
                        <div className="text-[10px] text-slate-500">{student.department}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          student.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          student.status === 'Hired' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                          student.status === 'Screening' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="font-bold text-slate-800">{student.performance}%</div>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mt-1 overflow-hidden">
                          <div className={`h-full ${student.performance >= 90 ? 'bg-emerald-500' : student.performance >= 75 ? 'bg-blue-500' : 'bg-slate-300'}`} style={{ width: `${student.performance}%` }}></div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors p-1 opacity-0 group-hover:opacity-100">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Internship Programs Capacity Preview */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                  <FolderOpen className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Internship Programs</h3>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {programs.map(prog => {
                const util = Math.round((prog.filled / prog.capacity) * 100);
                return (
                  <div key={prog.id} className="border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-sm text-slate-800 line-clamp-1">{prog.name}</div>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{prog.type}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium mb-4">{prog.department} • {prog.duration}</div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        <span>Capacity Utilization</span>
                        <span className={util >= 90 ? 'text-rose-600' : 'text-blue-600'}>{util}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${util >= 90 ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${util}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 font-medium pt-1">
                        <span>Filled: {prog.filled}</span>
                        <span>Available: {prog.capacity - prog.filled}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Activity & Escalations */}
        <div className="space-y-8">
          
          {/* Escalation Management */}
          <div className="bg-white border border-rose-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50/30">
              <div className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-sm font-extrabold tracking-tight">Escalation Management</h3>
              </div>
              <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                {escalations.reduce((acc, esc) => acc + esc.count, 0)} Open
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {escalations.map(esc => (
                <div key={esc.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3">
                  <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                    esc.severity === 'HIGH' ? 'bg-rose-500 animate-pulse' : 
                    esc.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-slate-400'
                  }`} />
                  <div>
                    <div className="text-xs font-bold text-slate-800">{esc.rule}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">{esc.count} {esc.status}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
              <button className="text-[10px] font-bold text-rose-600 hover:text-rose-700 uppercase tracking-wider">
                Review Escalations →
              </button>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-slate-400" />
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Recent Activity Feed</h3>
            </div>
            <div className="p-5 relative">
              {/* Timeline line */}
              <div className="absolute top-5 bottom-5 left-[29px] w-px bg-slate-100 z-0"></div>
              
              <div className="space-y-6 relative z-10">
                {recentActivity.map((log) => (
                  <div key={log.id} className="flex gap-4">
                    <div className={`h-2.5 w-2.5 rounded-full mt-1 shrink-0 ring-4 ring-white ${
                      log.type === 'system' ? 'bg-indigo-500' :
                      log.type === 'alert' ? 'bg-rose-500' : 'bg-emerald-500'
                    }`} />
                    <div className="-mt-1">
                      <p className="text-xs text-slate-700 leading-relaxed">
                        <span className="font-bold text-slate-900">{log.target}</span> {log.action}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 font-semibold">{log.timestamp}</span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] text-slate-500 font-medium bg-slate-50 px-1.5 py-0.5 rounded">{log.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
