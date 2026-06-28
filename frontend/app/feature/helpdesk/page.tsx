"use client";

import React, { useEffect, useState } from 'react';
import { HelpdeskService } from '@/src/services/helpdesk.service';
import { Ticket, TicketCategory, TicketPriority, TicketStatus, TicketComment } from '@/src/types/helpdesk.types';
import { 
  LifeBuoy, Loader2, MessageSquare, Clock, AlertCircle, Plus, 
  Send, User, Calendar, Tag, Shield, CheckCircle2 
} from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';
import { useAuth } from '@/src/context/AuthContext';
import { Drawer } from '@/components/feature/ui/Drawer';

export default function HelpdeskPage() {
  const { hasPermission } = usePermissions();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // View Ticket Drawer state
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isViewTicketOpen, setIsViewTicketOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Admin management state
  const [mgmtStatus, setMgmtStatus] = useState<TicketStatus>('Open');
  const [mgmtAssigneeId, setMgmtAssigneeId] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // New Ticket Drawer state
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState<TicketCategory>('Technical Issue');
  const [newTicketPriority, setNewTicketPriority] = useState<TicketPriority>('Medium');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
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

  const handleOpenTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setMgmtStatus(ticket.status);
    setMgmtAssigneeId(ticket.assignedTo || '');
    setIsViewTicketOpen(true);
  };

  const handleCloseViewTicket = () => {
    setIsViewTicketOpen(false);
    setSelectedTicket(null);
    setNewCommentText('');
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTicketTitle.trim() || !newTicketDescription.trim()) return;

    setIsSubmittingTicket(true);
    try {
      await HelpdeskService.createTicket({
        title: newTicketTitle,
        description: newTicketDescription,
        category: newTicketCategory,
        priority: newTicketPriority,
        createdBy: user.user_id,
        creatorName: user.name,
        department: hasPermission('helpdesk.assign') ? 'IT Support' : 'Academics'
      });
      // Clear forms
      setNewTicketTitle('');
      setNewTicketDescription('');
      setNewTicketCategory('Technical Issue');
      setNewTicketPriority('Medium');
      setIsNewTicketOpen(false);
      
      // Reload tickets
      await loadData();
    } catch (err) {
      console.error("Failed to create ticket", err);
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedTicket || !newCommentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const comment = await HelpdeskService.addComment(
        selectedTicket.id,
        user.user_id,
        user.name,
        newCommentText
      );

      // Update selected ticket in state
      setSelectedTicket(prev => {
        if (!prev) return null;
        return {
          ...prev,
          comments: [...prev.comments, comment],
          updatedAt: new Date().toISOString()
        };
      });

      setNewCommentText('');
      
      // Reload main tickets list as well
      await loadData();
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleUpdateTicketStatus = async () => {
    if (!selectedTicket || !user) return;
    setIsUpdatingStatus(true);
    try {
      const assigneeName = mgmtAssigneeId === 'self' ? user.name : (mgmtAssigneeId === '' ? '' : 'Support Agent');
      const updated = await HelpdeskService.updateTicketStatus(
        selectedTicket.id,
        mgmtStatus,
        mgmtAssigneeId === 'self' ? user.user_id : (mgmtAssigneeId || undefined),
        mgmtAssigneeId === 'self' ? user.name : (assigneeName || undefined)
      );

      setSelectedTicket(updated);
      await loadData();
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (!hasPermission('helpdesk.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-text-secondary font-sans">
        <p className="font-semibold">You do not have permission to view the helpdesk.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-text-secondary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2 tracking-tight">
            <LifeBuoy className="w-6 h-6 text-indigo-650" />
            Help Desk
          </h1>
          <p className="text-text-secondary text-sm mt-0.5">Manage and track your support tickets and requests.</p>
        </div>
        {hasPermission('helpdesk.create') && (
          <button 
            onClick={() => setIsNewTicketOpen(true)}
            className="bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        )}
      </div>

      {/* Tickets List Card */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-secondary">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold tracking-wider text-text-secondary">
              <tr>
                <th className="px-5 py-4 font-bold">Ticket ID</th>
                <th className="px-5 py-4 font-bold">Title</th>
                <th className="px-5 py-4 font-bold">Status</th>
                <th className="px-5 py-4 font-bold">Priority</th>
                <th className="px-5 py-4 font-bold">Updated</th>
                <th className="px-5 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  onClick={() => handleOpenTicket(ticket)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="px-5 py-4 font-semibold text-text-primary font-mono text-xs">{ticket.ticketNumber}</td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-text-primary group-hover:text-indigo-650 transition-colors">{ticket.title}</div>
                    <div className="text-[11px] text-text-secondary mt-0.5">{ticket.category}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'bg-emerald-100 text-emerald-700' :
                      ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      ticket.status === 'Waiting' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-text-primary'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      ticket.priority === 'Critical' ? 'text-rose-600' :
                      ticket.priority === 'High' ? 'text-orange-500' :
                      ticket.priority === 'Medium' ? 'text-blue-500' :
                      'text-text-secondary'
                    }`}>
                      {ticket.priority === 'Critical' && <AlertCircle className="w-3.5 h-3.5" />}
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(ticket.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => handleOpenTicket(ticket)}
                      className="text-indigo-650 hover:text-indigo-800 font-bold text-xs flex items-center gap-1 ml-auto bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-text-secondary">
                    <LifeBuoy className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm">No tickets found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DRAWERS --- */}

      {/* 1. New Ticket Drawer */}
      <Drawer
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        title="Create New Support Ticket"
      >
        <form onSubmit={handleCreateTicket} className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Ticket Title</label>
            <input
              type="text"
              required
              value={newTicketTitle}
              onChange={(e) => setNewTicketTitle(e.target.value)}
              placeholder="e.g., Unable to submit attendance sheet"
              className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Category</label>
              <select
                value={newTicketCategory}
                onChange={(e) => setNewTicketCategory(e.target.value as TicketCategory)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary cursor-pointer"
              >
                <option value="Technical Issue">Technical Issue</option>
                <option value="Attendance">Attendance</option>
                <option value="Assessment">Assessment</option>
                <option value="Payment">Payment</option>
                <option value="Certificate">Certificate</option>
                <option value="Placement">Placement</option>
                <option value="Login">Login</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Priority</label>
              <select
                value={newTicketPriority}
                onChange={(e) => setNewTicketPriority(e.target.value as TicketPriority)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 flex-1 flex flex-col">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Description of the Issue</label>
            <textarea
              required
              value={newTicketDescription}
              onChange={(e) => setNewTicketDescription(e.target.value)}
              placeholder="Describe your issue or request in detail. Include error codes if any..."
              className="w-full flex-grow min-h-[160px] bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary placeholder-slate-400 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsNewTicketOpen(false)}
              className="flex-1 py-3 border border-border text-text-primary font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingTicket}
              className="flex-1 py-3 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-900/10"
            >
              {isSubmittingTicket ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Ticket'
              )}
            </button>
          </div>
        </form>
      </Drawer>

      {/* 2. View Ticket Drawer */}
      <Drawer
        isOpen={isViewTicketOpen}
        onClose={handleCloseViewTicket}
        title={selectedTicket ? `Ticket details: ${selectedTicket.ticketNumber}` : 'Ticket Details'}
      >
        {selectedTicket && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Ticket Headline Info */}
              <div>
                <h3 className="text-xl font-bold text-text-primary leading-snug">{selectedTicket.title}</h3>
                <div className="flex flex-wrap items-center gap-2.5 mt-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedTicket.status === 'Resolved' || selectedTicket.status === 'Closed' ? 'bg-emerald-100 text-emerald-700' :
                    selectedTicket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    selectedTicket.status === 'Waiting' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-text-primary'
                  }`}>
                    {selectedTicket.status}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedTicket.priority === 'Critical' ? 'bg-rose-100 text-rose-700 animate-pulse' :
                    selectedTicket.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                    selectedTicket.priority === 'Medium' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-text-primary'
                  }`}>
                    {selectedTicket.priority} Priority
                  </span>
                  <span className="text-xs text-text-secondary font-semibold">•</span>
                  <span className="text-xs text-text-secondary font-bold">{selectedTicket.category}</span>
                </div>
              </div>

              {/* Description Body */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-border">
                <div className="flex items-center gap-2 mb-3 text-text-secondary">
                  <User className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{selectedTicket.creatorName}</span>
                  <span className="text-xs">•</span>
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{new Date(selectedTicket.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm font-medium text-text-primary leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              {/* Support Agent Admin actions (Visible if user is support/admin) */}
              {(hasPermission('helpdesk.assign') || hasPermission('helpdesk.resolve')) && (
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-650">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Management Console</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary uppercase">Set Status</label>
                      <select
                        value={mgmtStatus}
                        onChange={(e) => setMgmtStatus(e.target.value as TicketStatus)}
                        className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs font-bold text-text-primary cursor-pointer"
                      >
                        <option value="Open">Open</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Waiting">Waiting</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary uppercase">Assignee</label>
                      <select
                        value={mgmtAssigneeId}
                        onChange={(e) => setMgmtAssigneeId(e.target.value)}
                        className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs font-bold text-text-primary cursor-pointer"
                      >
                        <option value="">Unassigned</option>
                        <option value="self">Assign to Me</option>
                        <option value="EMP-3001">Support Agent 1</option>
                        <option value="EMP-3002">Support Agent 2</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleUpdateTicketStatus}
                    disabled={isUpdatingStatus}
                    className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-650/10"
                  >
                    {isUpdatingStatus ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      'Apply Updates'
                    )}
                  </button>
                </div>
              )}

              {/* Replies History */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Replies & Updates ({selectedTicket.comments?.length || 0})</h4>
                
                <div className="space-y-3.5">
                  {selectedTicket.comments?.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-text-secondary text-xs font-bold shrink-0">
                        {comment.authorName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 bg-slate-50/50 rounded-2xl px-4 py-3 border border-border">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-bold text-text-primary">{comment.authorName}</span>
                          <span className="text-[10px] text-text-secondary">
                            {new Date(comment.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-text-secondary leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {(!selectedTicket.comments || selectedTicket.comments.length === 0) && (
                    <p className="text-xs text-text-secondary font-medium italic text-center py-2">No replies yet. Post a message below to start the conversation.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Comment Post Footer Box */}
            <div className="p-4 border-t border-border bg-white">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Type your message / update..."
                  className="flex-grow bg-slate-50 border border-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary font-medium text-text-primary placeholder-slate-400"
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="bg-slate-900 hover:bg-black disabled:bg-slate-400 text-white px-4 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-sm"
                >
                  {isSubmittingComment ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
