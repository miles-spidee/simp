"use client";

import React, { useState, useEffect } from 'react';
import { reportingManagerService } from '../../../src/services/reportingManager.service';
import { ManagerAssignment } from '../../../src/types/reporting-manager.types';
import { Briefcase, Users, AlertCircle, TrendingUp } from 'lucide-react';

export default function ReportingManagerDashboard() {
  const [stats, setStats] = useState({ totalInterns: 0, averagePerformance: 0, highRiskInterns: 0 });
  const [assignments, setAssignments] = useState<ManagerAssignment[]>([]);

  useEffect(() => {
    // Mock Manager ID
    const loadData = async () => {
      const dashboardStats = await reportingManagerService.getDashboardKPIs('rm-1');
      const data = await reportingManagerService.getInternAssignments('rm-1');
      setStats(dashboardStats);
      setAssignments(data);
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Reporting Manager</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage assigned interns and track their performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">Total Interns</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-3xl font-semibold mt-4 text-zinc-900 dark:text-zinc-100">{stats.totalInterns}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">Average Performance</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-3xl font-semibold mt-4 text-zinc-900 dark:text-zinc-100">{stats.averagePerformance.toFixed(1)}/10</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">High Risk Interns</span>
            <AlertCircle className="w-5 h-5 text-rose-500" />
          </div>
          <span className="text-3xl font-semibold mt-4 text-zinc-900 dark:text-zinc-100">{stats.highRiskInterns}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Assigned Interns</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-5 py-3 font-medium">Intern Name</th>
                <th className="px-5 py-3 font-medium">Batch</th>
                <th className="px-5 py-3 font-medium">Attendance</th>
                <th className="px-5 py-3 font-medium">Assessment</th>
                <th className="px-5 py-3 font-medium">Task Completion</th>
                <th className="px-5 py-3 font-medium">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              {assignments.map(a => (
                <tr key={a.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">{a.internName}</td>
                  <td className="px-5 py-3">{a.batch}</td>
                  <td className="px-5 py-3">{a.attendancePercent}%</td>
                  <td className="px-5 py-3">{a.assessmentPercent}%</td>
                  <td className="px-5 py-3">{a.taskCompletionPercent}%</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${a.riskLevel === 'High' ? 'bg-rose-100 text-rose-700' : a.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {a.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
