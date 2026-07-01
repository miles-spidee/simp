"use client";

import React, { useEffect, useState } from 'react';
import { Shield, ShieldAlert, Key, Activity, AlertTriangle, CheckCircle2, Lock, Monitor, Search, Smartphone, Clock, AlertCircle } from 'lucide-react';
import { sessionService } from '@/src/services/session.service';
import { UserSession } from '@/src/data/mock-user-sessions';
import { EnhancedTable } from '@/components/feature/ui/Table';

export default function SecurityCenterPage() {

  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
            <span>Identity</span>
            <span className="text-slate-300">/</span>
            <span className="text-blue-600 font-extrabold">Security</span>
          </div>
          <h2 className="text-2xl font-black text-text-primary mt-2 tracking-tight">Security Center</h2>
          <p className="text-xs text-helper mt-1">
            Monitor authentication events and platform security posture.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Sessions', value: loading ? '-' : activeSessions.length, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Failed Logins (24h)', value: 0, icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Locked Accounts', value: 0, icon: Lock, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Permission Coverage', value: '100%', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold text-text-primary">{kpi.value}</div>
                <div className="text-sm font-medium text-text-secondary mt-1">{kpi.label}</div>
              </div>
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" /> Login Activity Trend (Last 7 Days)
          </h3>
          <div className="h-48 flex items-end justify-between gap-2 border-b border-border pb-2">
            {[45, 52, 38, 65, 59, 48, 62].map((val, idx) => (
              <div key={idx} className="w-full relative group flex flex-col items-center justify-end h-full">
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 text-xs font-bold text-text-primary bg-white shadow-sm border border-border px-2 py-1 rounded transition-opacity">
                  {val}
                </div>
                <div 
                  className="w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600" 
                  style={{ height: `${(val / 65) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-text-secondary">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600" /> Failed Logins (Last 7 Days)
          </h3>
          <div className="h-48 flex items-end justify-between gap-2 border-b border-border pb-2">
            {[2, 0, 1, 4, 0, 0, 0].map((val, idx) => (
              <div key={idx} className="w-full relative group flex flex-col items-center justify-end h-full">
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 text-xs font-bold text-text-primary bg-white shadow-sm border border-border px-2 py-1 rounded transition-opacity">
                  {val}
                </div>
                <div 
                  className={`w-full ${val > 0 ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-200'} rounded-t-sm transition-all`} 
                  style={{ height: `${val === 0 ? 5 : (val / 4) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-text-secondary">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Recent Security Events</h3>
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
                <p className="text-sm font-medium text-text-primary">{event.msg}</p>
                <p className="text-xs text-helper mt-1">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-slate-50/50">
          <div>
            <h3 className="font-semibold text-text-primary">Active User Sessions</h3>
            <p className="text-xs text-helper mt-1">Monitor and manage current user logins across the platform.</p>
          </div>
        </div>
        <EnhancedTable<UserSession>
          data={sessions}
          searchPlaceholder="Search by User ID or IP..."
          loading={loading}
          emptyMessage="No sessions found."
          columns={[
            { key: 'userId', label: 'User', render: (s) => <span className="font-medium text-text-primary">{s.userId}</span> },
            {
              key: 'device',
              label: 'Device & Browser',
              render: (s) => (
                <div className="flex items-center gap-2">
                  {s.device.includes('iPhone') || s.device.includes('Mobile') ? <Smartphone className="h-4 w-4 text-text-secondary" /> : <Monitor className="h-4 w-4 text-text-secondary" />}
                  <div>
                    <div className="text-text-primary">{s.device}</div>
                    <div className="text-xs text-text-secondary">{s.os} • {s.browser}</div>
                  </div>
                </div>
              )
            },
            {
              key: 'location',
              label: 'Location & IP',
              render: (s) => (
                <div className="flex flex-col gap-1">
                  <span className="text-text-primary">{s.location}</span>
                  <span className="text-xs text-text-secondary font-mono">{s.ipAddress}</span>
                </div>
              )
            },
            {
              key: 'lastActivity',
              label: 'Last Activity',
              render: (s) => (
                <div className="flex items-center gap-1 text-text-secondary">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{new Date(s.lastActivity).toLocaleString()}</span>
                </div>
              )
            },
            {
              key: 'status',
              label: 'Status',
              render: (s) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${s.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-text-primary'}`}>
                  {s.status}
                </span>
              )
            },
            {
              key: 'actions',
              label: 'Actions',
              className: 'text-right',
              render: (s) => (
                s.status === 'Active' ? (
                  <button 
                    onClick={() => handleTerminate(s.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                  >
                    Force Logout
                  </button>
                ) : null
              )
            },
          ]}
        />
      </div>
    </div>
  );
}
