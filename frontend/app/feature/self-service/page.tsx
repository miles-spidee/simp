"use client";

import React, { useEffect, useState } from 'react';
import { SelfServiceService } from '@/src/services/selfservice.service';
import { SelfServiceDashboard } from '@/src/types/selfservice.types';
import { UserCircle, Loader2, FileText, UserCog, Settings, Bell, ChevronRight, Download } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';

export default function SelfServicePage() {
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<SelfServiceDashboard | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await SelfServiceService.getDashboard();
      setDashboard(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission('selfservice.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500">
        <p>You do not have permission to view the self-service portal.</p>
      </div>
    );
  }

  if (loading || !dashboard) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-teal-600" />
            Self-Service Portal
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your profile, documents, and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 text-center border-b border-slate-100">
              <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <UserCircle className="w-12 h-12" />
              </div>
              <h2 className="font-bold text-slate-900">{dashboard.profile.name}</h2>
              <p className="text-sm text-slate-500">{dashboard.profile.role}</p>
            </div>
            <div className="p-4 space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-teal-700 bg-teal-50 flex items-center justify-between">
                <span className="flex items-center gap-2"><UserCog className="w-4 h-4" /> My Profile</span>
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-between transition-colors">
                <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Documents</span>
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-between transition-colors">
                <span className="flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</span>
                {dashboard.pendingActions > 0 && (
                  <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full text-xs font-bold">{dashboard.pendingActions}</span>
                )}
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-between transition-colors">
                <span className="flex items-center gap-2"><Settings className="w-4 h-4" /> Settings</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <div className="text-slate-900 font-medium">{dashboard.profile.name}</div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                <div className="text-slate-900 font-medium">{dashboard.profile.email}</div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                <div className="text-slate-900 font-medium">{dashboard.profile.phone}</div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Join Date</label>
                <div className="text-slate-900 font-medium">{new Date(dashboard.profile.joinDate).toLocaleDateString()}</div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Address</label>
                <div className="text-slate-900 font-medium">{dashboard.profile.address}</div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
              <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer">
                Request Profile Update
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800">Recent Document Requests</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {dashboard.recentRequests.map(req => (
                <div key={req.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-bold text-slate-800">{req.type}</div>
                    <div className="text-xs text-slate-500 mt-1">Requested on {new Date(req.requestDate).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      req.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' :
                      req.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {req.status}
                    </span>
                    {req.status === 'Ready' ? (
                      <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
                        <Download className="w-4 h-4" />
                      </button>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
