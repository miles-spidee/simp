"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle2, ChevronRight, Award, AlertTriangle, 
  TrendingUp, Calendar, Percent, ShieldAlert
} from 'lucide-react';
import { assessmentService } from '@/src/services/assessment.service';
import { Assessment, AssessmentResult } from '@/src/data/mock-assessments';

export default function AssessmentDashboardPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [asmList, resList] = await Promise.all([
          assessmentService.getAssessments(),
          assessmentService.getAssessmentResults()
        ]);
        setAssessments(asmList);
        setResults(resList);
      } catch (err) {
        console.error('Failed to load assessment data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  // Calculate statistics
  const scheduledCount = assessments.length;
  const completedCount = results.length;
  const passCount = results.filter(r => r.status === 'Passed').length;
  const failCount = results.filter(r => r.status === 'Failed').length;
  
  const passRate = completedCount > 0 ? Math.round((passCount / completedCount) * 100) : 0;
  const failRate = completedCount > 0 ? Math.round((failCount / completedCount) * 100) : 0;

  return (
    <div className="space-y-6 animate-slide-in select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Execution Panel</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold text-[10px]">Assessment Dashboard</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Assessment & Testing Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of MCQ examinations, student passing thresholds, cohort pass ratios and proctored testing compliance.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Scheduled Exams', val: scheduledCount, icon: Calendar, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Exams Completed', val: completedCount, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Average Pass Rate', val: `${passRate}%`, icon: Percent, color: 'text-purple-600 bg-purple-50 border-purple-100' },
          { label: 'Unsuccessful Attempts', val: failCount, icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 border-rose-100' }
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

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pass / Fail Rate Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
            Cohort Outcome Distribution
          </h3>
          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Passing Grade</span>
                <span>{passCount} attempts ({passRate}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${passRate}%` }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Failing / Re-evaluation Needed</span>
                <span>{failCount} attempts ({failRate}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${failRate}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Performance log */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-455 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Award className="h-4.5 w-4.5 text-blue-600" />
            Recent Grade Logs
          </h3>
          <div className="space-y-3 pt-1 text-xs">
            {results.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-slate-800 block truncate">{r.title}</span>
                  <span className="text-[9px] text-slate-400 font-semibold">{r.date}</span>
                </div>
                <span className={`font-bold shrink-0 ${r.status === 'Passed' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {r.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
