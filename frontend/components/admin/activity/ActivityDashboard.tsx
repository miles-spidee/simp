"use client";

import React, { useState, useEffect } from 'react';
import { activityService } from '../../../src/services/activity.service';
import { ActivityLog } from '../../../src/types/activity.types';
import { Activity, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export default function ActivityDashboard() {
  const [stats, setStats] = useState({ totalLogs: 0, successLogs: 0, failedLogs: 0, criticalLogs: 0 });
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setStats(await activityService.getActivityStats());
      setActivities(await activityService.getAllActivities());
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Activity Tracking</h1>
          <p className="text-sm text-zinc-500 mt-1">Audit trail and system-wide activity logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">Total Activities</span>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-3xl font-semibold mt-4 text-zinc-900 dark:text-zinc-100">{stats.totalLogs}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">Success</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-3xl font-semibold mt-4 text-zinc-900 dark:text-zinc-100">{stats.successLogs}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">Failed</span>
            <XCircle className="w-5 h-5 text-rose-500" />
          </div>
          <span className="text-3xl font-semibold mt-4 text-zinc-900 dark:text-zinc-100">{stats.failedLogs}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">Critical</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-3xl font-semibold mt-4 text-zinc-900 dark:text-zinc-100">{stats.criticalLogs}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Recent Activities</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-5 py-3 font-medium">Timestamp</th>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Module</th>
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              {activities.slice(0, 50).map(a => (
                <tr key={a.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-5 py-3">{new Date(a.timestamp).toLocaleString()}</td>
                  <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">{a.userName}</td>
                  <td className="px-5 py-3">{a.module}</td>
                  <td className="px-5 py-3">{a.action}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${a.status === 'Failed' ? 'bg-rose-100 text-rose-700' : a.status === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${a.severity === 'Critical' || a.severity === 'High' ? 'bg-rose-100 text-rose-700' : a.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                      {a.severity}
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
