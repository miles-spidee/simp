"use client";

import React, { useState, useEffect } from 'react';
import { AlertTriangle,  
  FolderDown, Search, Filter, Plus, FileText, CheckCircle2, 
  XCircle, Clock, Eye, MessageSquare, GitCommit, Link,
  CheckSquare
 } from 'lucide-react';
import { submissionService } from '@/src/services/submission.service';
import { Submission } from '@/src/data/mock-submissions';
import { Drawer } from '@/components/feature/ui/Drawer';

export default function SubmissionsManagementPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'directory'>('dashboard');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'feedback' | 'audit'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    const data = await submissionService.getSubmissions();
    setSubmissions(data);
    setLoading(false);
  };

  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setActiveTab('overview');
    setIsDrawerOpen(true);
  };

  const filteredSubmissions = submissions.filter(s => s.studentId.toLowerCase().includes(searchTerm.toLowerCase()));

  // KPIs
  const totalSubmissions = submissions.length;
  const pendingReview = submissions.filter(s => s.status === 'PENDING').length;
  const approvedCount = submissions.filter(s => s.status === 'APPROVED').length;
  const approvalRate = totalSubmissions > 0 ? Math.round((approvedCount / totalSubmissions) * 100) : 0;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6 font-medium flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        TODO: Waiting for backend endpoint
      </div>

        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Submission Module</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and review student task and assessment submissions.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'dashboard' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveView('directory')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'directory' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Directory
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeView === 'dashboard' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-500 mb-1">Total Submissions</p>
                <h3 className="text-3xl font-black text-slate-900">{totalSubmissions}</h3>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-500 mb-1">Pending Review</p>
                <h3 className="text-3xl font-black text-amber-600">{pendingReview}</h3>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-500 mb-1">Approval Rate</p>
                <h3 className="text-3xl font-black text-emerald-600">{approvalRate}%</h3>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Recent Submissions</h3>
              <div className="space-y-3">
                {submissions.slice(0, 5).map((sub) => (
                  <div key={sub.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSubmissionClick(sub)}>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <FolderDown className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">Student: {sub.studentId}</h4>
                        <p className="text-xs text-slate-500 mt-1">Task: {sub.taskId || 'N/A'} • Assessment: {sub.assessmentId || 'N/A'}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                      sub.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                      sub.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                ))}
                {submissions.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-sm">No recent submissions.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeView === 'directory' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm max-w-7xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by student ID..."
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <button className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Student ID</th>
                    <th className="px-6 py-3">Reference (Task/Assm)</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Marks</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.map(s => (
                    <tr key={s.id} className="hover:bg-blue-50/50 cursor-pointer transition-colors" onClick={() => handleSubmissionClick(s)}>
                      <td className="px-6 py-4 font-medium text-slate-900">{s.studentId}</td>
                      <td className="px-6 py-4 text-slate-600">{s.taskId || s.assessmentId}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                          s.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                          s.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{s.marksObtained !== undefined ? s.marksObtained : '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Submission Profile" size="lg">
        {selectedSubmission && (
          <div className="flex flex-col h-full bg-slate-50 min-h-0">
            <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FolderDown className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Student: {selectedSubmission.studentId}</h2>
                    <p className="text-sm text-slate-500">ID: {selectedSubmission.id}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    selectedSubmission.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                    selectedSubmission.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedSubmission.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-6 shrink-0">
              {['overview', 'files', 'feedback', 'audit'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="capitalize">{t === 'audit' ? 'Audit Trail' : t}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Links & References</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Repo Link</span>
                        <a href={selectedSubmission.repoLink} className="font-medium text-blue-600 hover:underline flex items-center gap-1"><Link className="h-3 w-3" /> View Source</a>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Live Link</span>
                        <a href={selectedSubmission.liveLink} className="font-medium text-blue-600 hover:underline flex items-center gap-1"><Link className="h-3 w-3" /> View App</a>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Task Ref</span>
                        <span className="font-medium text-slate-800">{selectedSubmission.taskId || 'None'}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assessment Ref</span>
                        <span className="font-medium text-slate-800">{selectedSubmission.assessmentId || 'None'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-4 mb-4">Subtasks</h3>
                    <div className="space-y-3">
                      {selectedSubmission.subtasks.map(st => (
                        <div key={st.id} className="flex items-center gap-3">
                          {st.completed ? <CheckSquare className="h-4 w-4 text-blue-600" /> : <div className="h-4 w-4 border-2 border-slate-300 rounded" />}
                          <span className={`text-sm ${st.completed ? 'text-slate-800' : 'text-slate-500'}`}>{st.task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'files' && (
                <div className="space-y-4">
                  {selectedSubmission.fileIds && selectedSubmission.fileIds.length > 0 ? (
                    selectedSubmission.fileIds.map(fid => (
                      <div key={fid} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-full shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">File ID: {fid}</div>
                          </div>
                        </div>
                        <button className="text-sm text-blue-600 font-medium hover:underline">Download</button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 text-center">No attached files.</p>
                  )}
                </div>
              )}

              {activeTab === 'feedback' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                  Feedback mechanisms will appear here.
                </div>
              )}

              {activeTab === 'audit' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-4 mb-4">Commit History</h3>
                  <div className="space-y-4 border-l-2 border-slate-100 ml-2 pl-4">
                    {selectedSubmission.commits.map(c => (
                      <div key={c.commit} className="relative">
                        <div className="absolute -left-[23px] bg-white p-1">
                          <div className="h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white" />
                        </div>
                        <p className="text-xs text-slate-500 mb-1">{c.date} • <span className="font-medium text-blue-600">{c.commit}</span></p>
                        <p className="text-sm font-medium text-slate-800">{c.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
