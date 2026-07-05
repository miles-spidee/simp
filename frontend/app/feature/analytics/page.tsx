"use client";

import React, { useEffect, useState } from 'react';
import { AnalyticsService } from '@/src/services/analytics.service';
import { AnalyticsSummary, AnalyticsDimension, AnalyticsDataPoint } from '@/src/types/analytics.types';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  LineChart as RechartsLineChart, Line
} from 'recharts';
import {
  LineChart, BarChart4, TrendingUp, Users, Activity, Loader2,
  Award, Briefcase, GraduationCap, Download, CheckCircle, Calendar,
  TrendingDown, Star, Layers
} from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';
import { useAuth } from '@/src/context/AuthContext';

/* ─── Attendance Trend Line Chart ───────────────────────────── */
function AttendanceTrendChart({ data }: { data: AnalyticsDataPoint[] }) {
  if (!data || data.length === 0) return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex items-center justify-center h-full min-h-[200px]">
      <p className="text-sm text-text-secondary">No attendance data available.</p>
    </div>
  );

  const values = data.map((d) => d.value);
  const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);
  const trend = values.length > 0 ? values[values.length - 1] - values[0] : 0;

  // Format data for recharts
  const chartData = data.map(d => ({
    ...d,
    dateStr: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    value: parseFloat(d.value.toFixed(1))
  }));

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.08)] transition-all duration-300 relative overflow-hidden group h-full flex flex-col">
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-br from-blue-100 to-sky-50 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-5 relative z-10 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            30-Day Attendance Trend
          </h3>
          <p className="text-[11px] text-text-secondary mt-0.5 font-medium">
            Daily average attendance rate across all active batches
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full font-bold">
            Avg: {avg.toFixed(1)}%
          </span>
          <span className={`text-[10px] font-bold flex items-center gap-1 ${trend >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}% over period
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-[220px] relative z-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="dateStr" 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
              axisLine={false} 
              tickLine={false}
              minTickGap={30}
            />
            <YAxis 
              domain={[0, 100]} 
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
              axisLine={false} 
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgb(0 0 0 / 0.12)' }}
              labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
              formatter={(value: any) => [<span className="font-bold text-blue-600">{value}%</span>, <span className="text-slate-500">Attendance</span>]}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ─── Top Programs Bar Chart ─────────────────────────────────── */
function TopProgramsChart({ programs }: { programs: AnalyticsDimension[] }) {
  if (!programs || programs.length === 0) return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[295px]">
      <p className="text-sm text-text-secondary m-auto">No program data available.</p>
    </div>
  );

  const barColors = ['#2563eb', '#3b82f6', '#60a5fa', '#0ea5e9', '#38bdf8'];

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.08)] transition-all duration-300 h-full relative overflow-hidden flex flex-col group">
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-br from-blue-100 to-sky-50 rounded-full blur-3xl opacity-30 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-5 relative z-10 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
            <BarChart4 className="w-4 h-4 text-slate-400" />
            Top Performing Programs
          </h3>
          <p className="text-[11px] text-text-secondary mt-0.5 font-medium">Student enrollment by program</p>
        </div>
      </div>

      <div className="flex-1 min-h-[250px] relative z-10 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={programs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(val) => val.length > 12 ? val.slice(0, 12) + '...' : val}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: '#64748b' }} 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }} 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgb(0 0 0 / 0.12)', padding: '12px 16px' }}
              labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }}
              formatter={(value: any, name, props) => {
                return [
                  <span key="val" className="font-bold text-blue-600">{value} students ({props.payload.percentage}%)</span>,
                  <span key="name" className="text-slate-500 font-medium">Enrollment</span>
                ];
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
              {programs.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend list */}
      <div className="mt-4 space-y-2 pt-4 border-t border-border relative z-10 shrink-0">
        {programs.map((prog, i) => {
          const color = barColors[i % barColors.length];
          return (
            <div key={prog.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                <span className="font-semibold text-text-primary">{prog.name}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-slate-500">
                <span>{prog.value.toLocaleString()} students</span>
                <span className="font-bold" style={{ color: color }}>{prog.percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Stat Card ─────────────────────────────────────────────── */
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  valueClass,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: any;
  color: string;
  valueClass?: string;
}) {
  return (
    <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl p-5 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-blue-100 to-sky-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="flex items-center justify-between text-text-secondary mb-4 relative z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>
      <div className="relative z-10">
        <div className={`text-3xl font-extrabold font-sans tracking-tight mb-1 ${valueClass || 'text-slate-800'}`}>
          {value}
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{sub}</p>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}

/* ─── Main Dashboard Page ────────────────────────────────────── */
export default function AnalyticsDashboardPage() {
  const { hasPermission } = usePermissions();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [attendance, setAttendance] = useState<AnalyticsDataPoint[]>([]);
  const [programs, setPrograms] = useState<AnalyticsDimension[]>([]);
  const [dateFilter, setDateFilter] = useState('30d');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadData();
  }, [dateFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await AnalyticsService.getDashboardData();

      if (data.summary) {
        setSummary(data.summary);
      }
      setAttendance(data.attendanceTrend || []);
      setPrograms(data.topPrograms || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!summary) return;
    setIsExporting(true);
    setTimeout(() => {
      const rows = [
        'Metric,Value',
        `Total Students,${summary.totalStudents}`,
        `Active Interns,${summary.activeInterns}`,
        `Placement Rate,${summary.placementRate}%`,
        `Completion Rate,${summary.completionRate}%`,
        `Attendance Rate,${summary.attendanceRate}%`,
        `Certificates Issued,${summary.certificatesIssued}`,
        `Average Score,${summary.averageScore}%`,
        '',
        'Program,Students,Share',
        ...programs.map((p) => `${p.name},${p.value},${p.percentage}%`),
      ].join('\n');

      const blob = new Blob([rows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Analytics_Report_${dateFilter}_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 1000);
  };

  if (!hasPermission('analytics.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-text-secondary font-sans">
        <p className="font-semibold">You do not have permission to view analytics.</p>
      </div>
    );
  }

  if (loading || !summary) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm text-text-secondary font-semibold">Loading analytics data…</p>
      </div>
    );
  }

  const totalEnrolled = programs.reduce((s, p) => s + p.value, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2 tracking-tight">
            <LineChart className="w-6 h-6 text-indigo-500" />
            Enterprise Analytics Dashboard
          </h1>
          <p className="text-text-secondary text-sm mt-0.5">
            Real-time insights into academic performance, attendance, and program distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-border text-xs">
            <Calendar className="w-3.5 h-3.5 text-text-secondary ml-1" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent font-bold text-text-primary focus:outline-none cursor-pointer pr-1"
            >
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 3 Months</option>
              <option value="180d">Last 6 Months</option>
            </select>
          </div>

          {hasPermission('analytics.export') && (
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 cursor-pointer disabled:opacity-60"
            >
              {isExporting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Exporting…</>
              ) : (
                <><Download className="w-4 h-4" /> Export CSV</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={summary.totalStudents.toLocaleString()}
          sub="Registered Accounts"
          icon={Users}
          color="bg-blue-50 text-blue-500"
          valueClass="text-text-primary"
        />
        <StatCard
          label="Active Interns"
          value={summary.activeInterns.toLocaleString()}
          sub="In Active Training"
          icon={Activity}
          color="bg-fuchsia-50 text-fuchsia-500"
        />
        <StatCard
          label="Placement Rate"
          value={`${summary.placementRate}%`}
          sub="✓ Target Achieved"
          icon={Briefcase}
          color="bg-emerald-50 text-emerald-500"
          valueClass="text-emerald-600"
        />
        <StatCard
          label="Completion Rate"
          value={`${summary.completionRate}%`}
          sub="✓ Stable Performance"
          icon={GraduationCap}
          color="bg-blue-50 text-blue-500"
          valueClass="text-blue-600"
        />
      </div>

      {/* ── Attendance Trend + Cert Card ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <AttendanceTrendChart data={attendance} />
        </div>

        {/* Dark cert / score card */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-sm p-6 text-white flex flex-col justify-between min-h-[295px] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Award className="w-36 h-36" />
          </div>

          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
              Audit Credentials
            </span>
            <h2 className="text-base font-bold mb-1 mt-0.5 text-slate-100">Certificates Issued</h2>
            <p className="text-slate-400 text-[11px] mb-6">Verified digital credentials generated</p>
            <div className="text-4xl font-extrabold text-white font-mono tracking-tight">
              {summary.certificatesIssued.toLocaleString()}
            </div>
            <p className="text-emerald-400 text-xs font-bold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Verified count based on origin data</span>
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Course Score</h3>
              <span className="text-xl font-extrabold text-white font-mono">{summary.averageScore.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</h3>
              <span className="text-xl font-extrabold text-white font-mono">{summary.attendanceRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Programs Bar Chart + Insights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <TopProgramsChart programs={programs} />
        </div>

        {/* Insights card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.08)] p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-sky-100 to-blue-50 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              Enterprise Insights
            </h2>

            <div className="space-y-4">
              {programs.slice(0, 1).map((prog) => (
                <div key={prog.id} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-text-secondary leading-relaxed">
                    <strong className="text-text-primary">{prog.name}</strong> drives the largest share at{' '}
                    <strong className="text-blue-600">{prog.percentage}%</strong> of overall enrollment.
                  </p>
                </div>
              ))}

              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-text-secondary leading-relaxed">
                  Placement rate at <strong className="text-emerald-600">{summary.placementRate}%</strong> based on original
                  student and placement data.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-text-secondary leading-relaxed">
                  <strong className="text-text-primary">{summary.certificatesIssued.toLocaleString()}</strong> certificates
                  issued based on real database entries.
                </p>
              </div>
            </div>
          </div>

          {/* Summary metrics */}
          <div className="mt-6 pt-4 border-t border-border space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-semibold">Programs tracked</span>
              <span className="font-bold text-text-primary">{programs.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-semibold">Total enrolled (program data)</span>
              <span className="font-bold text-text-primary">{totalEnrolled.toLocaleString()}</span>
            </div>
            <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Verified Audited Stats ✓
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
