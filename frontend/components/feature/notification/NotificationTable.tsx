'use client';
import { useState, useEffect } from 'react';
import { Notification } from '@/src/types/notification.types';
import { NotificationService } from '@/src/services/notification.service';
import { Bell, Mail, MessageSquare, Smartphone, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import ViewNotificationModal from './ViewNotificationModal';

export default function NotificationTable() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await NotificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch(channel) {
      case 'Email': return <Mail className="h-4 w-4 text-blue-500" />;
      case 'SMS': return <MessageSquare className="h-4 w-4 text-emerald-500" />;
      case 'Push Notification': return <Bell className="h-4 w-4 text-amber-500" />;
      case 'WhatsApp': return <Smartphone className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      Delivered: 'bg-blue-100 text-blue-700 border-blue-200',
      Read: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Failed: 'bg-rose-100 text-rose-700 border-rose-200',
      Scheduled: 'bg-amber-100 text-amber-700 border-amber-200',
      Draft: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${map[status] || map.Draft}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-white/50 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm">
        <RefreshCw className="h-6 w-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Notification</th>
              <th className="px-6 py-4 font-medium">Channel & Module</th>
              <th className="px-6 py-4 font-medium">Recipient</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {notifications.slice(0, 50).map((n) => (
              <tr 
                key={n.id} 
                className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                onClick={async () => {
                  setSelectedNotif(n);
                  setIsModalOpen(true);
                  if (!n.readStatus) {
                    try {
                      await NotificationService.markAsRead(n.id);
                      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, readStatus: true } : item));
                    } catch (e) {
                      console.error("Failed to mark as read", e);
                    }
                  }
                }}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{n.title}</span>
                    <span className="text-xs text-gray-500 truncate max-w-[250px]">{n.message}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(n.channel)}
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{n.channel}</span>
                      <span className="text-xs text-gray-500">{n.module}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{n.recipient}</span>
                    <span className="text-xs text-gray-500">{n.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 items-start">
                    {getStatusBadge(n.status)}
                    {n.priority === 'Critical' && (
                      <span className="flex items-center gap-1 text-xs text-rose-600 font-medium">
                        <AlertCircle className="h-3 w-3" /> Critical
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">
                  {new Date(n.createdTime).toLocaleString()}
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
          setSelectedNotif(null);
        }}
        data={selectedNotif}
      />
    </div>
  );
}
