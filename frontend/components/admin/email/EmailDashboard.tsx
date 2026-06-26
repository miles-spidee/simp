'use client';
import { useState, useEffect } from 'react';
import { EmailTemplate, EmailHistory } from '@/src/types/email.types';
import { EmailService } from '@/src/services/email.service';
import { Mail, CheckCircle, XCircle, Send, Edit, PlayCircle } from 'lucide-react';

export default function EmailDashboard() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [stats, setStats] = useState({ delivered: 0, bounced: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const tpls = await EmailService.getTemplates();
        const s = await EmailService.getDeliveryStats();
        setTemplates(tpls);
        setStats(s);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Email & Templates</h1>
          <p className="text-sm text-gray-500 mt-1">Manage automated email templates and monitor delivery rates.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium text-sm shadow-sm">
            <Mail className="h-4 w-4" /> New Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600">Total Delivered</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.delivered}</p>
          </div>
          <CheckCircle className="h-10 w-10 text-emerald-200" />
        </div>
        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-rose-600">Bounced / Failed</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.bounced}</p>
          </div>
          <XCircle className="h-10 w-10 text-rose-200" />
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Email Templates</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Template Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Updated</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading templates...</td>
                </tr>
              ) : (
                templates.map(tpl => (
                  <tr key={tpl.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{tpl.name}</span>
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-sm">{tpl.subject}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{tpl.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${tpl.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {tpl.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(tpl.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-gray-400">
                        <button className="hover:text-gray-900"><Edit className="h-4 w-4" /></button>
                        <button className="hover:text-blue-600"><PlayCircle className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
