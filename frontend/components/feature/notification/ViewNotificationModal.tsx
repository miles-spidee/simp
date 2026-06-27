'use client';
import React from 'react';
import { X, Calendar, User, Tag, AlertCircle } from 'lucide-react';

interface ViewNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    title: string;
    message?: string;
    description?: string; // fallback for announcements
    createdTime?: string;
    publishDate?: string; // fallback for announcements
    author?: string;
    priority?: string;
    category?: string;
    module?: string; // fallback for notifications
    channel?: string;
    channels?: string[];
    audience?: string[];
  } | null;
}

export default function ViewNotificationModal({ isOpen, onClose, data }: ViewNotificationModalProps) {
  if (!isOpen || !data) return null;

  const title = data.title;
  const message = data.message || data.description || '';
  const date = data.createdTime || data.publishDate || new Date().toISOString();
  const author = data.author || 'System Admin';
  const priority = data.priority || 'Normal';
  const category = data.category || data.module || 'General';

  const getPriorityColor = (p: string) => {
    switch (p.toLowerCase()) {
      case 'urgent':
      case 'critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white/90 backdrop-blur-xl border border-slate-150 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(priority)}`}>
                {priority}
              </span>
              <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {category}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 leading-snug">
              {title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0 border border-transparent hover:border-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-150 rounded-xl p-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="block font-medium text-slate-400">Date & Time</span>
                <span className="font-bold text-slate-700">{new Date(date).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="block font-medium text-slate-400">Sent By</span>
                <span className="font-bold text-slate-700">{author}</span>
              </div>
            </div>
          </div>

          {/* Message Text */}
          <div className="space-y-2">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Message Details</span>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 border border-slate-100 rounded-xl p-5 font-medium">
              {message}
            </div>
          </div>

          {/* Delivery Channels / Target Info */}
          {(data.channels || data.audience) && (
            <div className="border-t border-slate-100 pt-4 space-y-3">
              {data.channels && data.channels.length > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">Sent via:</span>
                  <div className="flex gap-2">
                    {data.channels.map(ch => (
                      <span key={ch} className="px-2 py-1 bg-teal-50 border border-teal-150 text-teal-700 font-semibold rounded-lg">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.channel && (
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">Channel:</span>
                  <span className="px-2 py-1 bg-teal-50 border border-teal-150 text-teal-700 font-semibold rounded-lg">
                    {data.channel}
                  </span>
                </div>
              )}
              {data.audience && data.audience.length > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">Audience:</span>
                  <div className="flex gap-1">
                    {data.audience.map(aud => (
                      <span key={aud} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-650 font-bold rounded">
                        {aud}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-semibold text-sm shadow-sm"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
