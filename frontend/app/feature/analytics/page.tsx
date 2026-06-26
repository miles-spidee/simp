"use client";

import React, { useEffect, useState } from 'react';
import { AnalyticsService } from '@/src/services/analytics.service';
import { AnalyticsSummary, AnalyticsDimension, AnalyticsDataPoint } from '@/src/types/analytics.types';
import { LineChart, BarChart4, TrendingUp, Users, Activity, Loader2, Award, Briefcase, GraduationCap } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';

export default function AnalyticsDashboardPage() {
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [attendance, setAttendance] = useState<AnalyticsDataPoint[]>([]);
  const [programs, setPrograms] = useState<AnalyticsDimension[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await AnalyticsService.getDashboardData();
      setSummary(data.summary);
      setAttendance(data.attendanceTrend);
      setPrograms(data.topPrograms);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission('analytics.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500">
        <p>You do not have permission to view analytics.</p>
      </div>
    );
  }

  if (loading || !summary) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <LineChart className="w-6 h-6 text-blue-600" />
            Enterprise Analytics Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">High-level view of organization performance and metrics.</p>
        </div>
        
        {hasPermission('analytics.export') && (
          <button className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Export Report
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Cards */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-sm font-medium">Total Students</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{summary.totalStudents.toLocaleString()}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-sm font-medium">Active Interns</span>
            <Activity className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{summary.activeInterns.toLocaleString()}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-sm font-medium">Placement Rate</span>
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{summary.placementRate}%</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-sm font-medium">Completion Rate</span>
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{summary.completionRate}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Programs */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart4 className="w-5 h-5 text-slate-400" />
            Top Performing Programs
          </h2>
          <div className="space-y-4">
            {programs.map(program => (
              <div key={program.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{program.name}</span>
                  <span className="text-slate-500">{program.value.toLocaleString()} students</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${program.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-slate-900 rounded-xl shadow-sm p-6 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Award className="w-32 h-32" />
          </div>
          <div>
            <h2 className="text-lg font-bold mb-1">Certificates Issued</h2>
            <p className="text-slate-400 text-sm mb-6">Total verified credentials</p>
            <div className="text-4xl font-bold text-white mb-2">{summary.certificatesIssued.toLocaleString()}</div>
            <p className="text-emerald-400 text-sm font-medium">+12% from last month</p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-800">
            <h2 className="text-lg font-bold mb-1">Avg Score</h2>
            <div className="text-3xl font-bold text-white">{summary.averageScore}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
