'use client';
import { useState, useEffect } from 'react';
import NotificationTable from './NotificationTable';
import { NotificationService } from '@/src/services/notification.service';
import { Bell, CheckCircle, AlertCircle, RefreshCw, Filter } from 'lucide-react';

export default function NotificationDashboard() {
  const [stats, setStats] = useState({ delivered: 0, failed: 0, read: 0 });
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const s = await NotificationService.getDeliveryStats();
      const u = await NotificationService.getUnreadCount();
      setStats(s);
      setUnread(u);
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notification Center</h1>
          <p className="text-sm text-gray-500 mt-1">Manage, monitor, and dispatch omni-channel notifications.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm">
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Unread</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{unread}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
            <Bell className="h-6 w-6 text-amber-600" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Delivered</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.delivered}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Read</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.read}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Failed</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.failed}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-rose-600" />
          </div>
        </div>
      </div>

      <NotificationTable />
    </div>
  );
}
