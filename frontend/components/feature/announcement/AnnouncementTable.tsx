'use client';
import { useState, useEffect } from 'react';
import { Announcement } from '@/src/types/announcement.types';
import { AnnouncementService } from '@/src/services/announcement.service';
import { Megaphone, Pin, Clock, MoreVertical, RefreshCw } from 'lucide-react';
import ViewNotificationModal from '../notification/ViewNotificationModal';

export default function AnnouncementTable() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await AnnouncementService.getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      Published: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Draft: 'bg-gray-100 text-gray-700 border-gray-200',
      Archived: 'bg-rose-100 text-rose-700 border-rose-200'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${map[status] || map.Draft}`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const map: Record<string, string> = {
      Urgent: 'bg-rose-100 text-rose-700',
      High: 'bg-amber-100 text-amber-700',
      Normal: 'bg-blue-100 text-blue-700'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${map[priority] || map.Normal}`}>
        {priority}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-white/50 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Announcement</th>
              <th className="px-6 py-4 font-medium">Audience</th>
              <th className="px-6 py-4 font-medium">Status & Priority</th>
              <th className="px-6 py-4 font-medium">Publish Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {announcements.slice(0, 50).map((a) => (
              <tr 
                key={a.id} 
                className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedAnnouncement(a);
                  setIsModalOpen(true);
                }}
              >
                <td className="px-6 py-4">
                  <div className="flex gap-3 items-start">
                    <div className="mt-1">
                      {a.pinned ? <Pin className="h-4 w-4 text-amber-500 fill-amber-500" /> : <Megaphone className="h-4 w-4 text-gray-400" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{a.title}</span>
                      <span className="text-xs text-gray-500 line-clamp-1 max-w-sm mt-0.5">{a.description}</span>
                      <span className="text-xs text-blue-600 mt-1 font-medium">{a.category}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {a.audience.map(aud => (
                      <span key={aud} className="px-2 py-1 bg-gray-100 text-gray-700 text-[10px] font-medium rounded">
                        {aud}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-start gap-2">
                    {getStatusBadge(a.status)}
                    {getPriorityBadge(a.priority)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(a.publishDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-900 transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ViewNotificationModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAnnouncement(null);
        }}
        data={selectedAnnouncement}
      />
    </div>
  );
}
