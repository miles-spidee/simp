"use client";

import React, { useEffect, useState } from 'react';
import { HelpdeskService } from '@/src/services/helpdesk.service';
import { Ticket } from '@/src/types/helpdesk.types';
import { LifeBuoy, Loader2, MessageSquare, Clock, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';
import { useAuth } from '@/src/context/AuthContext';

export default function HelpdeskPage() {
  const { hasPermission } = usePermissions();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Admins see all, users see their own
      const data = hasPermission('helpdesk.assign') 
        ? await HelpdeskService.getTickets() 
        : await HelpdeskService.getMyTickets(user.user_id);
      setTickets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission('helpdesk.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500">
        <p>You do not have permission to view the helpdesk.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-indigo-600" />
            Help Desk
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track your support requests.</p>
        </div>
        {hasPermission('helpdesk.create') && (
          <button className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Ticket ID</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 cursor-pointer">
                  <td className="px-4 py-3 font-medium text-slate-900">{ticket.ticketNumber}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{ticket.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{ticket.category}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'bg-emerald-100 text-emerald-700' :
                      ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 ${
                      ticket.priority === 'Critical' ? 'text-rose-600' :
                      ticket.priority === 'High' ? 'text-orange-500' :
                      'text-slate-500'
                    }`}>
                      {ticket.priority === 'Critical' && <AlertCircle className="w-3 h-3" />}
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1 ml-auto">
                      <MessageSquare className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
