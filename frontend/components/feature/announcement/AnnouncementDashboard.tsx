'use client';
import { useState, useEffect } from 'react';
import AnnouncementTable from './AnnouncementTable';
import CreateAnnouncementModal from './CreateAnnouncementModal';
import { AnnouncementService } from '@/src/services/announcement.service';
import { Megaphone, Edit3, Eye, FileText, Plus } from 'lucide-react';

export default function AnnouncementDashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const announcements = await AnnouncementService.getAnnouncements();
      const pending = await AnnouncementService.getPendingAnnouncements();
      
      setStats({
        total: announcements.length,
        active: announcements.filter(a => a.status === 'Published').length,
        pending: pending.length
      });
    }
    loadStats();
  }, [refreshTrigger]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Announcement Management</h1>
          <p className="text-sm text-gray-500 mt-1">Publish campus-wide alerts, holidays, and academic updates.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium text-sm shadow-sm"
          >
            <Plus className="h-4 w-4" /> Create Announcement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-gray-300 transition-all">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Announcements</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-gray-300 transition-all">
          <div>
            <p className="text-sm font-medium text-gray-500">Active (Published)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
            <Eye className="h-6 w-6 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-gray-300 transition-all">
          <div>
            <p className="text-sm font-medium text-gray-500">Draft (Pending)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
            <Edit3 className="h-6 w-6 text-amber-600" />
          </div>
        </div>
      </div>

      <AnnouncementTable key={refreshTrigger} />

      <CreateAnnouncementModal 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => setRefreshTrigger(prev => prev + 1)}
      />
    </div>
  );
}
