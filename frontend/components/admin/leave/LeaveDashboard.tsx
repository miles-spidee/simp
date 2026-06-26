"use client";

import React, { useState, useEffect } from 'react';
import { leaveService } from '../../../src/services/leave.service';
import { LeaveRequest } from '../../../src/types/leave.types';
import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function LeaveDashboard() {
  const [stats, setStats] = useState({ totalRequests: 0, pendingRequests: 0, approvedRequests: 0, rejectedRequests: 0 });
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setStats(await leaveService.getLeaveDashboardStats());
      setLeaves(await leaveService.getAllLeaves());
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Leave Management</h1>
          <p className="text-sm text-zinc-500 mt-1">Track and manage leave requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">Total Leaves</span>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-3xl font-semibold mt-4 text-zinc-900 dark:text-zinc-100">{stats.totalRequests}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">Pending</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-3xl font-semibold mt-4 text-zinc-900 dark:text-zinc-100">{stats.pendingRequests}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">Approved</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-3xl font-semibold mt-4 text-zinc-900 dark:text-zinc-100">{stats.approvedRequests}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">Rejected</span>
            <XCircle className="w-5 h-5 text-rose-500" />
          </div>
          <span className="text-3xl font-semibold mt-4 text-zinc-900 dark:text-zinc-100">{stats.rejectedRequests}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Leave Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Leave Type</th>
                <th className="px-5 py-3 font-medium">Dates</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              {leaves.map(l => (
                <tr key={l.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">{l.userName}</td>
                  <td className="px-5 py-3">{l.role}</td>
                  <td className="px-5 py-3">{l.leaveType}</td>
                  <td className="px-5 py-3">{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${l.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : l.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {l.status}
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
