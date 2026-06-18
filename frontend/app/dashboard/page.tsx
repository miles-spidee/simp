"use client";

import React from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useDashboard } from './DashboardContext';

export default function DashboardOverviewPage() {
  const {
    username,
    fees,
    kpiStats,
    announcements,
    capstoneStatus,
    courses,
    agenda,
    handleToggleAgendaItem
  } = useDashboard();

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Welcome Greeting panel - Dark blue and black gradient to capture pinesphere.com core colors */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 border border-slate-900 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-lg">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome Back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">{username}</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            Track your performance scorecards, attend lecture paths, submit project code assignments, and keep tabs on payments from one workspace.
          </p>
        </div>
      </div>

      {/* Key KPIs metric cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Attendance Target', value: '88%', desc: 'Threshold is 85%', status: 'Normal', color: 'border-l-4 border-emerald-500' },
          { title: 'LMS Progress', value: '33%', desc: '3 active modules complete', status: 'Ahead', color: 'border-l-4 border-blue-600' },
          { 
            title: 'Pending Dues', 
            value: fees.total === 0 ? 'Free' : `₹${fees.balance.toLocaleString()}`, 
            desc: fees.total === 0 ? 'Free Internship (Non-Paying)' : 'Next pay due by 30th June', 
            status: fees.total === 0 ? 'No Fees' : 'Due', 
            color: fees.total === 0 ? 'border-l-4 border-emerald-500' : 'border-l-4 border-amber-500' 
          },
          { title: 'Current KPI Score', value: `${((kpiStats.technical + kpiStats.delivery + kpiStats.communication) / 3).toFixed(1)}/100`, desc: 'Updated weekly', status: 'Excellent', color: 'border-l-4 border-indigo-600' }
        ].map((stat, idx) => (
          <div 
            key={idx} 
            className={`bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-500/40 hover:-translate-y-1 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 ease-out cursor-pointer ${stat.color}`}
          >
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</div>
            <div className="text-2xl font-black text-slate-800 mt-2 tracking-tight">{stat.value}</div>
            <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 mt-3 pt-2 border-t border-slate-100">
              <span>{stat.desc}</span>
              <span className="text-blue-600 font-bold uppercase tracking-wide">{stat.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Announcements and activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest notices */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md hover:border-blue-500/20 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-600" />
                <span>Announcements</span>
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {announcements.map((an, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                    <span>{an.date}</span>
                    <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-sm">Official</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-850 hover:text-blue-600 transition-colors cursor-pointer">{an.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{an.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Capstone snippet */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-blue-500/30 transition-all duration-300">
            <div className="space-y-1.5">
              <div className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Workspace Project</div>
              <h4 className="font-bold text-sm text-slate-800">Capstone Work: AI ERP Integration Portal</h4>
              <p className="text-xs text-slate-500">Status: <span className="text-amber-600 font-semibold">{capstoneStatus}</span>. Under Guide evaluation.</p>
            </div>
            <Link
              href="/dashboard/capstone"
              className="w-full sm:w-auto px-4 py-2 border border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors shadow-sm text-center"
            >
              Open Workspace
            </Link>
          </div>

          {/* Quick performance widget */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
              LMS Track Progress
            </h3>
            <div className="space-y-3.5">
              {courses.slice(0, 2).map((course, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600 truncate max-w-[200px]">{course.title}</span>
                    <span className="text-blue-600">{course.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick controls & calendar tracker snippet */}
        <div className="space-y-6">
          {/* Active schedule checklist */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
              Today&apos;s Agenda
            </h3>
            <ul className="space-y-3.5">
              {agenda.map((item) => (
                <li key={item.id} className="flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleAgendaItem(item.id)}
                    className="flex items-center gap-3 text-left focus:outline-none group"
                  >
                    <span className={`h-4.5 w-4.5 border flex items-center justify-center transition-all ${item.completed
                        ? 'bg-emerald-500 border-emerald-600 text-white'
                        : 'bg-white border-slate-300 group-hover:border-blue-500 text-transparent'
                      }`}>
                      ✓
                    </span>
                    <span className={`transition-colors duration-200 ${item.completed ? 'line-through text-slate-400' : 'text-slate-600 font-medium group-hover:text-slate-800'}`}>
                      {item.task}
                    </span>
                  </button>
                  <span className="text-[10px] text-slate-400 font-bold">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Internship Roadmap Progress (Circular Indicator) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-blue-500/30 transition-all duration-300">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
              Internship Timeline
            </h3>
            <div className="flex items-center justify-around gap-4 py-2">
              <div className="relative h-24 w-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" strokeWidth="6" stroke="#f1f5f9" fill="transparent" />
                  <circle cx="48" cy="48" r="40" strokeWidth="6" stroke="#004AC6" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.50)} />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-lg font-black text-slate-800">Week 6</span>
                  <span className="text-[7px] text-slate-400 font-bold uppercase">of 12 Weeks</span>
                </div>
              </div>
              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-700">Timeline: 50% Complete</div>
                <div className="text-slate-400">Enrolled: May 05, 2026</div>
                <div className="text-slate-400">Graduation: July 28, 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
