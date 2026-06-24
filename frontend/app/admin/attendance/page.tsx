"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, CheckCircle, Clock, AlertTriangle, 
  ChevronRight, TrendingUp, BarChart2, ShieldCheck, UserCheck
} from 'lucide-react';
import { attendanceService } from '@/src/services/attendance.service';
import { AttendanceLog } from '@/src/data/mock-attendance';

export default function AttendanceDashboardPage() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const logsData = await attendanceService.getAttendanceLogs();
        setLogs(logsData);
      } catch (err) {
        console.error('Failed to load logs', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  // Calculate generic dashboard statistics
  const presentCount = logs.filter(l => l.status === 'Present').length;
  const absentCount = logs.filter(l => l.status === 'Absent').length;
  const leaveCount = logs.filter(l => l.status === 'Leave').length;
  const totalCount = logs.length;

  const presentPercent = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
  const absentPercent = totalCount > 0 ? Math.round((absentCount / totalCount) * 100) : 0;
  const leavePercent = totalCount > 0 ? Math.round((leaveCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 animate-slide-in select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Operational Panel</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold text-[10px]">Attendance Dashboard</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Attendance & Sessions Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor daily cohort sign-ins, average checkout intervals, guides locks and verify cohort compliance rates.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Present Ratio', val: `${presentPercent}%`, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Absent Ratio', val: `${absentPercent}%`, icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 border-rose-100' },
          { label: 'Leave Ratio', val: `${leavePercent}%`, icon: Calendar, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Today\'s Sign-Ins', val: 42, icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all duration-200">
            <div>
              <div className="text-2.5xl font-black text-slate-800 tracking-tight">{kpi.val}</div>
              <div className="text-[10px] font-bold text-slate-455 uppercase tracking-wider mt-0.5">{kpi.label}</div>
            </div>
            <div className={`h-11 w-11 rounded-lg ${kpi.color} border flex items-center justify-center shrink-0`}>
              <kpi.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cohort Compliance Bars */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
            Cohort Attendance Ratios
          </h3>
          <div className="space-y-4 pt-1">
            {[
              { batch: 'Cohort Alpha (Batch 1)', rate: 94, color: 'bg-emerald-600' },
              { batch: 'Cohort Beta (Batch 2)', rate: 86, color: 'bg-blue-600' },
              { batch: 'Cohort Gamma (Batch 3)', rate: 72, color: 'bg-rose-500' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{item.batch}</span>
                  <span>{item.rate}% Present Rate</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick status box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-455 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Clock className="h-4.5 w-4.5 text-blue-600" />
            Sign-In Activity Log
          </h3>
          <div className="space-y-3 pt-1 text-xs select-text">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex justify-between">
              <span className="text-slate-550 font-semibold">Today's Class Duration:</span>
              <strong className="text-slate-800">8 hours</strong>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex justify-between">
              <span className="text-slate-550 font-semibold">Locked Registers:</span>
              <strong className="text-emerald-600 font-bold">2 / 2 Locks</strong>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex justify-between">
              <span className="text-slate-550 font-semibold">Active Sessions:</span>
              <strong className="text-blue-600 font-bold">Ongoing</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
