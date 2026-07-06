"use client";

import React, { useState, useEffect } from 'react';
import { AlertTriangle,  
  ShieldAlert, Activity, Settings, List, Users, 
  Database, Server, HardDrive, AlertCircle, CheckCircle
 } from 'lucide-react';
import { superAdminService } from '@/src/services/super-admin.service';
import { SystemSetting, AuditLog, RolePermission } from '@/src/types/super-admin.types';
import { EnhancedTable } from '@/components/feature/ui/Table';
import EmailDashboard from '@/components/feature/email/EmailDashboard';
import CertificateDashboard from '@/components/feature/certificate/CertificateDashboard';
import CollegeCertificateDashboard from '@/components/feature/certificate/CollegeCertificateDashboard';
import DocumentDashboard from '@/components/feature/document/DocumentDashboard';
import { Mail, Award, ShieldCheck, FileText } from 'lucide-react';

export default function SuperAdminPage() {

  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'logs' | 'roles' | 'email' | 'certificates' | 'college-certificates' | 'documents'>('dashboard');
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [roles, setRoles] = useState<RolePermission[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [sysSettings, auditLogs, sysRoles, stats] = await Promise.all([
      superAdminService.getSystemSettings(),
      superAdminService.getAuditLogs(),
      superAdminService.getRolePermissions(),
      superAdminService.getDashboardStats()
    ]);
    setSettings(sysSettings);
    setLogs(auditLogs);
    setRoles(sysRoles);
    setDashboardStats(stats);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-96 items-center justify-center gap-6 font-premium">
        <div className="relative group bg-white/60 backdrop-blur-xl border border-amber-200/50 shadow-[0_8px_30px_rgb(251,191,36,0.08)] rounded-2xl p-5 max-w-md w-full flex items-center gap-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(251,191,36,0.15)] hover:border-amber-300/60 animate-in fade-in slide-in-from-bottom-4">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl opacity-10 blur-md group-hover:opacity-15 transition-opacity duration-300"></div>
          <div className="relative h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100 shadow-inner">
            <AlertTriangle className="h-6 w-6 text-amber-600 animate-pulse" />
          </div>
          <div className="relative flex-1">
            <h4 className="text-sm font-bold text-text-primary font-display-premium tracking-wide">Developer Notice</h4>
            <p className="text-xs text-amber-800/90 mt-1 font-medium leading-relaxed">TODO: Waiting for backend endpoint</p>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-blue-600 shadow-md"></div>
          <div className="absolute h-4 w-4 rounded-full bg-blue-100 animate-ping"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 font-premium">
      <div className="bg-white border-b border-border px-6 py-4 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2 font-display-premium tracking-tight">
            <ShieldAlert className="h-6 w-6 text-blue-600 animate-float-3" />
            Super Admin Portal
          </h1>
          <p className="text-sm text-text-secondary mt-1">System configuration, audit logs, and global security.</p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 px-3.5 py-1.5 rounded-xl border border-emerald-100/80 text-xs font-bold tracking-wide shadow-sm shadow-emerald-100/10">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>System Healthy</span>
        </div>
      </div>

      <div className="flex border-b border-border bg-white px-6 shrink-0">
        {[
          { id: 'dashboard', label: 'System Health', icon: Activity },
          { id: 'settings', label: 'Global Settings', icon: Settings },
          { id: 'roles', label: 'Role Permissions', icon: Users },
          { id: 'logs', label: 'Audit Logs', icon: List },
          { id: 'email', label: 'Email Templates', icon: Mail },
          { id: 'certificates', label: 'Certificates', icon: Award },
          { id: 'college-certificates', label: 'College Verifications', icon: ShieldCheck },
          { id: 'documents', label: 'Documents', icon: FileText }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
          >
            <t.icon className="h-4 w-4" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 text-text-secondary mb-2">
                    <Users className="h-5 w-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">Active Users</span>
                  </div>
                  <div className="text-3xl font-black text-text-primary">{dashboardStats?.activeUsers?.toLocaleString() || 0}</div>
                </div>
                <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 text-text-secondary mb-2">
                    <Database className="h-5 w-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">DB Load</span>
                  </div>
                  <div className="text-3xl font-black text-emerald-600">{dashboardStats?.dbLoad || 0}%</div>
                </div>
                <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 text-text-secondary mb-2">
                    <Server className="h-5 w-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">API Uptime</span>
                  </div>
                  <div className="text-3xl font-black text-emerald-600">{dashboardStats?.apiUptime || 0}%</div>
                </div>
                <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 text-text-secondary mb-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">Failed Logins</span>
                  </div>
                  <div className="text-3xl font-black text-rose-600">{dashboardStats?.failedLogins || 0}</div>
                </div>
              </div>

              <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-blue-600" />
                  Storage & Infrastructure
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-text-primary">App Server Memory</span>
                      <span className="text-text-secondary">{dashboardStats?.storage?.memoryUsed || "0 GB"} / {dashboardStats?.storage?.memoryTotal || "8 GB"}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${dashboardStats?.storage?.memoryPct || 0}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-text-primary">Database Storage</span>
                      <span className="text-text-secondary">{dashboardStats?.storage?.dbUsed || "0 GB"} / {dashboardStats?.storage?.dbTotal || "50 GB"}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${dashboardStats?.storage?.dbPct || 0}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-text-primary">File Storage (S3)</span>
                      <span className="text-text-secondary">{dashboardStats?.storage?.s3Used || "0 GB"} / {dashboardStats?.storage?.s3Total || "1 TB"}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${dashboardStats?.storage?.s3Pct || 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-slate-50">
                <h3 className="font-bold text-text-primary">Global Configuration</h3>
              </div>
              <div className="divide-y divide-border">
                {settings.map(s => (
                  <div key={s.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 block">{s.category}</span>
                      <span className="font-medium text-text-primary">{s.key}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input type="text" defaultValue={s.value} className="border border-border rounded px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                      <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Save</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-slate-50">
                <h3 className="font-bold text-text-primary">Role Permissions Mapping</h3>
              </div>
              <div className="divide-y divide-border">
                {roles.map(r => (
                  <div key={r.role} className="p-5">
                    <h4 className="font-bold text-text-primary mb-3">{r.role}</h4>
                    <div className="flex flex-wrap gap-2">
                      {r.permissions.map(p => (
                        <span key={p} className="px-2.5 py-1 bg-slate-100 border border-border text-text-primary rounded-md text-xs font-medium font-mono">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-text-primary">System Audit Trail</h3>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Export CSV</button>
              </div>
              <EnhancedTable
                data={logs}
                columns={[
                  { key: 'timestamp', label: 'Timestamp', className: 'whitespace-nowrap' },
                  { key: 'action', label: 'Action', className: 'font-medium text-text-primary font-mono text-xs' },
                  { key: 'userId', label: 'User ID' },
                  {
                    key: 'entity',
                    label: 'Entity',
                    render: (l: AuditLog) => <span>{l.entityType} ({l.entityId})</span>,
                  },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (l: AuditLog) => (
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        l.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {l.status}
                      </span>
                    ),
                  },
                ]}
                searchPlaceholder="Search audit logs..."
                itemsPerPage={10}
                emptyMessage="No audit logs found."
              />
            </div>
          )}
          {activeTab === 'email' && <EmailDashboard />}
          {activeTab === 'certificates' && <CertificateDashboard />}
          {activeTab === 'college-certificates' && <CollegeCertificateDashboard />}
          {activeTab === 'documents' && <DocumentDashboard />}
        </div>
      </div>
    </div>
  );
}
