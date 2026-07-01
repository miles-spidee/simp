'use client';
import React, { useState } from 'react';
import { X, Send, Megaphone, Check } from 'lucide-react';
import { AnnouncementService } from '@/src/services/announcement.service';
import { NotificationService } from '@/src/services/notification.service';


interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAnnouncementModal({ isOpen, onClose, onSuccess }: CreateAnnouncementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'General' as any,
    priority: 'Normal' as any,
    pinned: false,
    channels: ['Portal'], // default
    targetType: 'roles' as 'roles' | 'person',
    targetRoles: ['All'],
    targetPersonId: '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['General', 'Academic', 'Internship', 'Holiday', 'Emergency', 'Placement', 'Finance', 'System Update'];
  const priorities = ['Normal', 'High', 'Urgent'];
  const channelsList = [
    { label: 'In-Portal Notification', value: 'Portal' },
    { label: 'WhatsApp Message', value: 'WhatsApp' },
    { label: 'SMS Alert', value: 'SMS' },
    { label: 'Email Broadcast', value: 'Email' }
  ];
  const rolesList = ['All', 'Student', 'Mentor', 'HR', 'College Coordinator'];

  const handleCheckboxChange = (field: 'channels' | 'targetRoles', value: string) => {
    setForm(prev => {
      const current = prev[field] as string[];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(x => x !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      alert("Please fill in the title and description.");
      return;
    }
    if (form.channels.length === 0) {
      alert("Please select at least one delivery channel.");
      return;
    }
    if (form.targetType === 'roles' && form.targetRoles.length === 0) {
      alert("Please select at least one target role.");
      return;
    }
    if (form.targetType === 'person' && !form.targetPersonId) {
      alert("Please select a specific person.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Determine target audience descriptor
      let audience: string[] = [];
      let targetedUser = '';
      let recipientEmail = 'all';

      if (form.targetType === 'roles') {
        audience = form.targetRoles;
      } else {
        const userObj = ([] as any[]).find((u: any) => u.id === form.targetPersonId);
        if (userObj) {
          audience = [userObj.roleName];
          targetedUser = userObj.name;
          recipientEmail = userObj.email;
        }
      }

      // 2. Save Announcement mock
      const announcementData = {
        title: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority,
        audience: audience,
        pinned: form.pinned,
        status: 'Published' as const, // auto-publish for ease
        publishDate: new Date().toISOString(),
        author: 'Admin Team'
      };

      await AnnouncementService.createAnnouncement(announcementData);

      // 3. Generate In-Portal Notification if checked
      if (form.channels.includes('Portal')) {
        await NotificationService.createNotification({
          title: `Announcement: ${form.title}`,
          message: form.description,
          recipient: recipientEmail,
          role: form.targetType === 'roles' ? form.targetRoles.join(', ') : audience[0],
          module: form.category,
          channel: 'In-App Notification',
          priority: form.priority === 'Urgent' ? 'Critical' : (form.priority === 'High' ? 'High' : 'Medium'),
          status: 'Delivered',
        });
      }

      // 4. Simulate sending other channels
      const otherChannels = form.channels.filter(c => c !== 'Portal');
      if (otherChannels.length > 0) {
        showToast(`Dispatched message via: ${otherChannels.join(', ')}`);
        // wait shortly for user to see toast
        await new Promise(r => setTimeout(r, 1200));
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create announcement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl border border-border shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="bg-white border border-border rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-text-primary">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Create New Announcement</h3>
              <p className="text-xs text-text-secondary">Distribute notices, alerts, and instructions across modules.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-text-secondary hover:text-text-primary transition-colors border border-transparent hover:border-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Announcement Title *</label>
            <input 
              type="text"
              required
              placeholder="E.g. Mid-Term Intern Assessment Timeline"
              value={form.title}
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-xl border border-slate-350 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Announcement Message *</label>
            <textarea 
              required
              rows={4}
              placeholder="Enter the full message details..."
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-xl border border-slate-350 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all font-medium whitespace-pre-wrap"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Category</label>
              <select 
                value={form.category}
                onChange={e => setForm(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-text-primary"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Priority</label>
              <div className="flex gap-2">
                {priorities.map(p => {
                  const active = form.priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, priority: p as any }))}
                      className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        active 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20' 
                          : 'bg-white text-text-secondary border-border hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Delivery Channels */}
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Delivery Channels *</label>
            <div className="grid grid-cols-2 gap-3">
              {channelsList.map(ch => {
                const checked = form.channels.includes(ch.value);
                return (
                  <label 
                    key={ch.value}
                    className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer select-none transition-all ${
                      checked 
                        ? 'border-blue-500 bg-blue-50/20 text-text-primary font-semibold' 
                        : 'border-border bg-white hover:bg-slate-50 text-text-secondary'
                    }`}
                  >
                    <input 
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxChange('channels', ch.value)}
                      className="h-4.5 w-4.5 text-blue-600 border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-xs">{ch.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Target type Toggle */}
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Target Audience</label>
            <div className="flex bg-slate-100 rounded-xl p-1 max-w-[280px]">
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, targetType: 'roles' }))}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  form.targetType === 'roles' ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary'
                }`}
              >
                Target Roles
              </button>
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, targetType: 'person' }))}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  form.targetType === 'person' ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary'
                }`}
              >
                Specific Person
              </button>
            </div>
          </div>

          {/* Dynamic Target Selection */}
          {form.targetType === 'roles' ? (
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Select Roles *</label>
              <div className="flex flex-wrap gap-2">
                {rolesList.map(r => {
                  const checked = form.targetRoles.includes(r);
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleCheckboxChange('targetRoles', r)}
                      className={`px-3 py-2 border rounded-xl text-xs font-semibold transition-all ${
                        checked 
                          ? 'bg-slate-900 border-border text-white shadow-sm' 
                          : 'bg-white border-border text-text-secondary hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Select Person *</label>
              <select
                value={form.targetPersonId}
                onChange={e => setForm(prev => ({ ...prev, targetPersonId: e.target.value }))}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-text-primary"
              >
                <option value="">-- Choose User --</option>
                {[].map(u => (
                  <option key={(u as any).id} value={(u as any).id}>
                    {(u as any).name} ({(u as any).roleName}) - {(u as any).email}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pinned */}
          <label className="flex items-center gap-3 select-none cursor-pointer p-1">
            <input 
              type="checkbox"
              checked={form.pinned}
              onChange={e => setForm(prev => ({ ...prev, pinned: e.target.checked }))}
              className="h-4.5 w-4.5 text-blue-650 border-border rounded focus:ring-primary focus:ring-2"
            />
            <div className="text-xs">
              <span className="block font-bold text-slate-750">Pin Announcement</span>
              <span className="block text-[10px] text-text-secondary font-medium">Keep this notice featured at the top of listings.</span>
            </div>
          </label>
        </form>

        {/* Footer */}
        <div className="p-6 bg-slate-50/50 border-t border-border flex justify-end gap-3 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-border text-text-primary rounded-xl hover:bg-slate-50 transition-colors font-semibold text-sm shadow-sm"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4.5 h-4.5" />
            {isSubmitting ? 'Sending...' : 'Send Announcement'}
          </button>
        </div>
      </div>
    </div>
  );
}
