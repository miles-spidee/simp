"use client";

import React, { useState, useEffect } from 'react';
import { escalationService } from '../../../src/services/escalation.service';
import { EscalationLog } from '../../../src/types/escalation.types';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function EscalationDashboard() {
  const [stats, setStats] = useState({ totalEscalations: 0, pendingEscalations: 0, resolvedEscalations: 0 });
  const [escalations, setEscalations] = useState<EscalationLog[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setStats(await escalationService.getEscalationStats());
      setEscalations(await escalationService.getEscalations());
    };
    loadData();
  }, []);

  const handleResolve = async (id: string) => {
    await escalationService.resolveEscalation(id);
    setStats(await escalationService.getEscalationStats());
    setEscalations(await escalationService.getEscalations());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Escalation Engine</h1>
          <p className="text-sm text-zinc-500 mt-1">Automated workflow and issue escalations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">Total Escalations</span>
            <ShieldAlert className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-3xl font-semibold mt-4 text-zinc-900 dark:text-zinc-100">{stats.totalEscalations}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">Pending</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-3xl font-semibold mt-4 text-zinc-900 dark:text-zinc-100">{stats.pendingEscalations}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">Resolved</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-3xl font-semibold mt-4 text-zinc-900 dark:text-zinc-100">{stats.resolvedEscalations}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Escalation Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-5 py-3 font-medium">Triggered Date</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Target</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              {escalations.map(e => (
                <tr key={e.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-5 py-3">{new Date(e.triggeredDate).toLocaleString()}</td>
                  <td className="px-5 py-3">{e.type}</td>
                  <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">{e.targetName}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${e.status === 'Pending' ? 'bg-amber-100 text-amber-700' : e.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {e.status === 'Pending' && (
                      <button onClick={() => handleResolve(e.id)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Mark Resolved
                      </button>
                    )}
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
