"use client";

import React, { useMemo } from 'react';
import { mentorService } from '@/src/services/mentor.service';
import { performanceService } from '@/src/services/performance.service';
import { TrendingUp, Users, CheckCircle, Target, Award, AlertTriangle } from 'lucide-react';

export default function MentorPerformanceView() {
  const [mappings, setMappings] = React.useState<any[]>([]);
  const [performances, setPerformances] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function loadData() {
      const [maps, perfs] = await Promise.all([
        mentorService.getBatchMappings(),
        performanceService.getBatchPerformances()
      ]);
      setMappings(maps);
      setPerformances(perfs);
    }
    loadData();
  }, []);

  const mentorPerformanceData = useMemo(() => {
    const mentorMap = new Map<string, { mentorName: string, batches: any[] }>();

    mappings.forEach(mapping => {
      const perf = performances.find(p => p.batchId === mapping.batchId);
      
      if (!mentorMap.has(mapping.mentorProfileId)) {
        mentorMap.set(mapping.mentorProfileId, {
          mentorName: mapping.mentorName,
          batches: []
        });
      }
      
      mentorMap.get(mapping.mentorProfileId)!.batches.push({
        ...mapping,
        performance: perf || { average_score: 0, attendance_rate: 0, task_completion_rate: 0, assessment_score: 0 }
      });
    });

    return Array.from(mentorMap.values());
  }, [mappings, performances]);

  const overallAverages = useMemo(() => {
    let totalScore = 0, totalAttendance = 0, totalTaskCompletion = 0, count = 0;
    mentorPerformanceData.forEach(mentor => {
      mentor.batches.forEach(batch => {
        if (batch.performance.average_score > 0) {
          totalScore += batch.performance.average_score;
          totalAttendance += batch.performance.attendance_rate;
          totalTaskCompletion += batch.performance.task_completion_rate;
          count++;
        }
      });
    });
    
    return {
      avgScore: count > 0 ? Math.round(totalScore / count) : 0,
      avgAttendance: count > 0 ? Math.round(totalAttendance / count) : 0,
      avgTaskCompletion: count > 0 ? Math.round(totalTaskCompletion / count) : 0,
      totalBatches: count
    };
  }, [mentorPerformanceData]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-border px-6 py-4 shrink-0">
        <h1 className="text-xl font-bold text-text-primary">Batch Performance Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">Monitor the overall performance and health of batches led by each mentor.</p>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase">Active Batches</p>
              <p className="text-2xl font-black text-text-primary">{overallAverages.totalBatches}</p>
            </div>
          </div>
          <div className="bg-white border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase">Avg Score</p>
              <p className="text-2xl font-black text-text-primary">{overallAverages.avgScore}%</p>
            </div>
          </div>
          <div className="bg-white border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase">Attendance</p>
              <p className="text-2xl font-black text-text-primary">{overallAverages.avgAttendance}%</p>
            </div>
          </div>
          <div className="bg-white border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase">Task Completion</p>
              <p className="text-2xl font-black text-text-primary">{overallAverages.avgTaskCompletion}%</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {mentorPerformanceData.map(mentor => (
            <div key={mentor.mentorName} className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border bg-slate-50/50 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {mentor.mentorName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-lg">{mentor.mentorName}</h3>
                  <p className="text-sm text-text-secondary">Mentoring {mentor.batches.length} Batch(es)</p>
                </div>
              </div>
              <div className="divide-y divide-border">
                {mentor.batches.map(batch => {
                  const perf = batch.performance;
                  const isAtRisk = perf.attendance_rate > 0 && perf.attendance_rate < 75;
                  return (
                    <div key={batch.id} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center hover:bg-slate-50/50 transition-colors">
                      <div className="md:col-span-3">
                        <span className="font-mono text-[10px] font-bold text-text-secondary bg-slate-100 px-2 py-0.5 rounded border mb-2 inline-block">
                          {batch.batchCode}
                        </span>
                        <h4 className="font-bold text-text-primary">{batch.batchName}</h4>
                        <p className="text-xs text-helper mt-1">{batch.programName}</p>
                      </div>

                      <div className="md:col-span-2">
                        <p className="text-xs font-bold text-text-secondary uppercase mb-1">Avg Score</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-text-primary">{perf.average_score}%</span>
                          {perf.average_score > 85 ? (
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                          ) : perf.average_score > 0 ? (
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                          ) : null}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <p className="text-xs font-bold text-text-secondary uppercase mb-1">Attendance</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-text-primary">{perf.attendance_rate}%</span>
                          {isAtRisk && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        </div>
                      </div>

                      <div className="md:col-span-3">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-text-secondary uppercase">Task Completion</span>
                          <span className="text-text-primary">{perf.task_completion_rate}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${perf.task_completion_rate > 80 ? 'bg-emerald-500' : perf.task_completion_rate > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                            style={{ width: `${perf.task_completion_rate}%` }} 
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 text-right">
                        {isAtRisk ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                            <AlertTriangle className="h-3 w-3" /> Needs Attention
                          </span>
                        ) : perf.average_score > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <CheckCircle className="h-3 w-3" /> On Track
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-text-secondary border border-border">
                            Not Started
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {mentorPerformanceData.length === 0 && (
            <div className="text-center py-12 text-text-secondary text-sm">No mentor performance data available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
