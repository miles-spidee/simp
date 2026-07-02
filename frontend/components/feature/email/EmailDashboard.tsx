'use client';
import { useState, useEffect } from 'react';
import { EmailTemplate, EmailHistory } from '@/src/types/email.types';
import { EmailService } from '@/src/services/email.service';
import { Mail, CheckCircle, XCircle, Send, Edit, PlayCircle, Loader2, Search, Calendar, User, Eye } from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { Pagination } from '@/components/common/Pagination';

export default function EmailDashboard() {
  const [activeTab, setActiveTab] = useState<'templates' | 'history'>('templates');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [history, setHistory] = useState<EmailHistory[]>([]);
  const [stats, setStats] = useState({ delivered: 0, bounced: 0 });
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, activeTab]);

  // New & Edit Template drawer state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [formName, setFormName] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formCategory, setFormCategory] = useState<any>('Registration');
  const [formBody, setFormBody] = useState('');
  const [formStatus, setFormStatus] = useState<any>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Test send state
  const [testTemplate, setTestTemplate] = useState<EmailTemplate | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const tpls = await EmailService.getTemplates();
      const s = await EmailService.getDeliveryStats();
      const hist = await EmailService.getHistory();
      setTemplates(tpls);
      setStats(s);
      setHistory(hist);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedTemplate(null);
    setFormName('');
    setFormSubject('');
    setFormCategory('Registration');
    setFormBody('Hi {{studentName}},\n\nWelcome to Pinesphere training program for {{program}}!\n\nBest regards,\nSupport Team');
    setFormStatus('Active');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (tpl: EmailTemplate) => {
    setSelectedTemplate(tpl);
    setFormName(tpl.name);
    setFormSubject(tpl.subject);
    setFormCategory(tpl.category);
    setFormBody(tpl.htmlBody);
    setFormStatus(tpl.status);
    setIsFormOpen(true);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSubject.trim()) return;

    setIsSubmitting(true);
    try {
      await EmailService.saveTemplate({
        id: selectedTemplate?.id,
        name: formName,
        subject: formSubject,
        category: formCategory,
        htmlBody: formBody,
        status: formStatus,
        variables: ['{{studentName}}', '{{program}}']
      });

      setIsFormOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail.trim() || !testTemplate) return;

    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      setTestTemplate(null);
      setTestEmail('');
      // Simulate incrementing delivered stats
      setStats(prev => ({ ...prev, delivered: prev.delivered + 1 }));
    }, 1500);
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPagesTemplates = Math.ceil(filteredTemplates.length / itemsPerPage);
  const paginatedTemplates = filteredTemplates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPagesHistory = Math.ceil(history.length / itemsPerPage);
  const paginatedHistory = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      'Active': 'bg-emerald-50 text-emerald-700 border-emerald-150',
      'Draft': 'bg-slate-100 text-text-primary border-border',
      'Archived': 'bg-rose-50 text-rose-700 border-rose-150'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${map[status] || map.Draft}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <Mail className="h-6 w-6 text-indigo-650" />
            Email & Templates
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">Manage automated email templates, test integrations, and monitor delivery logs.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all font-bold text-sm shadow-lg shadow-slate-900/10 cursor-pointer animate-fade-in"
          >
            <Mail className="h-4 w-4" /> New Template
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Delivered</p>
            <p className="text-3xl font-extrabold text-text-primary mt-1 font-mono">{stats.delivered}</p>
          </div>
          <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Bounced / Failed</p>
            <p className="text-3xl font-extrabold text-text-primary mt-1 font-mono">{stats.bounced}</p>
          </div>
          <div className="h-12 w-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <XCircle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-3 text-sm font-bold border-b-2 px-4 transition-all cursor-pointer ${
            activeTab === 'templates' 
              ? 'border-indigo-650 text-indigo-650' 
              : 'border-transparent text-text-secondary hover:text-text-secondary'
          }`}
        >
          Email Templates
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-sm font-bold border-b-2 px-4 transition-all cursor-pointer ${
            activeTab === 'history' 
              ? 'border-indigo-650 text-indigo-650' 
              : 'border-transparent text-text-secondary hover:text-text-secondary'
          }`}
        >
          Delivery History Logs
        </button>
      </div>

      {/* --- TAB VIEWS --- */}

      {activeTab === 'templates' ? (
        <div className="bg-white border border-border rounded-2xl shadow-sm p-6 space-y-5">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl pl-9.5 pr-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-all font-medium text-text-primary placeholder-slate-400"
              />
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-text-secondary uppercase tracking-wider">Category</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-border rounded-xl px-3 py-2 font-bold text-text-primary focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Registration">Registration</option>
                <option value="Offer Letter">Offer Letter</option>
                <option value="Interview Invitation">Interview Invitation</option>
                <option value="Attendance Alert">Attendance Alert</option>
                <option value="Payment Reminder">Payment Reminder</option>
              </select>
            </div>
          </div>

          {/* Templates list table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-secondary">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold tracking-wider text-text-secondary border-b border-border">
                <tr>
                  <th className="px-5 py-4">Template Name</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Last Updated</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-text-secondary">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading templates...
                    </td>
                  </tr>
                ) : paginatedTemplates.map(tpl => (
                  <tr key={tpl.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-text-primary text-sm">{tpl.name}</div>
                      <div className="text-[10px] text-text-secondary mt-0.5 truncate max-w-sm">{tpl.subject}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-text-secondary">{tpl.category}</td>
                    <td className="px-5 py-4">{getStatusBadge(tpl.status)}</td>
                    <td className="px-5 py-4 font-mono font-medium text-slate-405">
                      {new Date(tpl.lastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-text-secondary">
                        <button 
                          onClick={() => handleOpenEdit(tpl)}
                          title="Edit Template"
                          className="p-1.5 hover:text-text-primary bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setTestTemplate(tpl)}
                          title="Send Test"
                          className="p-1.5 hover:text-indigo-650 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <PlayCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTemplates.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-text-secondary font-medium">
                      No templates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPagesTemplates} 
            onPageChange={setCurrentPage} 
          />
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-text-primary tracking-tight flex items-center gap-1.5 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-text-secondary" /> Delivery Audit Logs
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text-secondary">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold tracking-wider text-text-secondary border-b border-border">
                <tr>
                  <th className="px-5 py-4">Recipient Email</th>
                  <th className="px-5 py-4">Template ID</th>
                  <th className="px-5 py-4">Delivery Status</th>
                  <th className="px-5 py-4">Sent Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedHistory.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 font-bold text-text-primary">{item.recipientEmail}</td>
                    <td className="px-5 py-4 font-mono font-medium text-text-secondary">{item.templateId}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        ['Delivered', 'Opened', 'Clicked', 'SENT', 'Sent'].includes(item.status)
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono font-medium text-text-secondary">
                      {new Date(item.sentAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPagesHistory} 
            onPageChange={setCurrentPage} 
          />
        </div>
      )}

      {/* --- DRAWERS --- */}

      {/* 1. New & Edit Template Drawer */}
      <Drawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedTemplate ? `Edit Template: ${selectedTemplate.name}` : 'Create New Email Template'}
      >
        <form onSubmit={handleSaveTemplate} className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Template Title Name</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g., Student Welcome Onboarding"
              className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary cursor-pointer"
              >
                <option value="Registration">Registration</option>
                <option value="Offer Letter">Offer Letter</option>
                <option value="Interview Invitation">Interview Invitation</option>
                <option value="Attendance Alert">Attendance Alert</option>
                <option value="Payment Reminder">Payment Reminder</option>
                <option value="Certificate Generated">Certificate Generated</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Initial Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary cursor-pointer"
              >
                <option value="Active">Active (Ready to Send)</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Email Subject Line</label>
            <input
              type="text"
              required
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              placeholder="e.g., Welcome to Pinesphere Internship Program!"
              className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary"
            />
          </div>

          <div className="space-y-1.5 flex-1 flex flex-col min-h-[200px]">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">HTML Body Content</label>
            <textarea
              required
              value={formBody}
              onChange={(e) => setFormBody(e.target.value)}
              placeholder="Write template message body..."
              className="w-full flex-1 bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary resize-none font-mono text-xs"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="flex-1 py-3 border border-border text-text-primary font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-slate-900/10"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Template'
              )}
            </button>
          </div>
        </form>
      </Drawer>

      {/* 2. Test Send Modal Drawer */}
      <Drawer
        isOpen={testTemplate !== null}
        onClose={() => setTestTemplate(null)}
        title={testTemplate ? `Test Template: ${testTemplate.name}` : 'Test Template'}
      >
        {testTemplate && (
          <form onSubmit={handleSendTest} className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Subject</span>
              <p className="text-xs font-bold text-text-primary">{testTemplate.subject}</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Test Recipient Email</label>
              <input
                type="email"
                required
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="e.g., test-recipient@example.com"
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary placeholder-slate-405"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-border mt-auto">
              <button
                type="button"
                onClick={() => setTestTemplate(null)}
                className="flex-1 py-3 border border-border text-text-primary font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSendingTest}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/10"
              >
                {isSendingTest ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Sending Test...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send Test Email
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </Drawer>

    </div>
  );
}
