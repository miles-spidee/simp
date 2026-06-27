"use client";

import React, { useEffect, useState } from 'react';
import { Shield, ShieldAlert, Key, Activity, AlertTriangle, CheckCircle2, Lock, Monitor, Search, Smartphone, Clock, AlertCircle } from 'lucide-react';
import { sessionService } from '@/src/services/session.service';
import { UserSession } from '@/src/data/mock-user-sessions';

export default function SecurityCenterPage() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await sessionService.getSessions();
      setSessions(data);
    } catch (err) {
      console.error('Failed to load sessions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTerminate = async (id: string) => {
    if (window.confirm('Are you sure you want to terminate this session?')) {
      await sessionService.terminateSession(id);
      loadData();
    }
  };

  const activeSessions = sessions.filter(s => s.status === 'Active');
  const filteredSessions = sessions.filter(s => 
    s.userId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Identity</span>
            <span className="text-slate-300">/</span>
            <span className="text-blue-600 font-extrabold">Security</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Security Center</h2>
          <p className="text-xs text-slate-500 mt-1">
            Monitor authentication events and platform security posture.
          </p>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Sessions', value: loading ? '-' : activeSessions.length, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Failed Logins (24h)', value: 0, icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Locked Accounts', value: 0, icon: Lock, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Permission Coverage', value: '100%', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
                <div className="text-sm font-medium text-slate-500 mt-1">{kpi.label}</div>
              </div>
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Login Activity Chart (Mock) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" /> Login Activity Trend (Last 7 Days)
          </h3>
          <div className="h-48 flex items-end justify-between gap-2 border-b border-slate-100 pb-2">
            {[45, 52, 38, 65, 59, 48, 62].map((val, idx) => (
              <div key={idx} className="w-full relative group flex flex-col items-center justify-end h-full">
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 text-xs font-bold text-slate-700 bg-white shadow-sm border border-slate-200 px-2 py-1 rounded transition-opacity">
                  {val}
                </div>
                <div 
                  className="w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600" 
                  style={{ height: `${(val / 65) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Failed Login Trend */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600" /> Failed Logins (Last 7 Days)
          </h3>
          <div className="h-48 flex items-end justify-between gap-2 border-b border-slate-100 pb-2">
            {[2, 0, 1, 4, 0, 0, 0].map((val, idx) => (
              <div key={idx} className="w-full relative group flex flex-col items-center justify-end h-full">
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 text-xs font-bold text-slate-700 bg-white shadow-sm border border-slate-200 px-2 py-1 rounded transition-opacity">
                  {val}
                </div>
                <div 
                  className={`w-full ${val > 0 ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-200'} rounded-t-sm transition-all`} 
                  style={{ height: `${val === 0 ? 5 : (val / 4) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Security Events</h3>
        <div className="space-y-4">
          {[
            { msg: 'New device login detected (MacBook Pro, San Francisco)', time: '2 hours ago', icon: Monitor, color: 'text-blue-500', bg: 'bg-blue-50' },
            { msg: 'Super Admin updated role permissions for "Recruiter"', time: '1 day ago', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { msg: 'Failed login attempt from IP 192.168.1.100', time: '2 days ago', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' }
          ].map((event, idx) => (
            <div key={idx} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
              <div className={`p-2 rounded-lg shrink-0 ${event.bg}`}>
                <event.icon className={`h-4 w-4 ${event.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{event.msg}</p>
                <p className="text-xs text-slate-500 mt-1">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Monitoring Table (Integrated) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-900">Active User Sessions</h3>
            <p className="text-xs text-slate-500 mt-1">Monitor and manage current user logins across the platform.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by User ID or IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></div>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Device & Browser</th>
                  <th className="px-6 py-3">Location & IP</th>
                  <th className="px-6 py-3">Last Activity</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{session.userId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {session.device.includes('iPhone') || session.device.includes('Mobile') ? <Smartphone className="h-4 w-4 text-slate-400" /> : <Monitor className="h-4 w-4 text-slate-400" />}
                        <div>
                          <div className="text-slate-900">{session.device}</div>
                          <div className="text-xs text-slate-500">{session.os} • {session.browser}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-900">{session.location}</span>
                        <span className="text-xs text-slate-500 font-mono">{session.ipAddress}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{new Date(session.lastActivity).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${session.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {session.status === 'Active' && (
                        <button 
                          onClick={() => handleTerminate(session.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                        >
                          Force Logout
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredSessions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <AlertCircle className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                      <p>No sessions found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
