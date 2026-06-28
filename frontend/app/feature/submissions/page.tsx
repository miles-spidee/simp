"use client";

import React, { useState, useEffect } from 'react';
import { AlertTriangle,  
  FolderDown, Search, Filter, Plus, FileText, CheckCircle2, 
  XCircle, Clock, Eye, MessageSquare, GitCommit, Link,
  CheckSquare
 } from 'lucide-react';
import { submissionService } from '@/src/services/submission.service';
import { Submission } from '@/src/data/mock-submissions';
import { studentService, ExtendedStudent } from '@/src/services/student.service';
import { Drawer } from '@/components/feature/ui/Drawer';

export default function SubmissionsManagementPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'directory' | 'batches'>('dashboard');
  const [students, setStudents] = useState<ExtendedStudent[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
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
    const [subData, stuData] = await Promise.all([
      submissionService.getSubmissions(),
      studentService.getStudents()
    ]);
    setSubmissions(subData);
    setStudents(stuData);
    setLoading(false);
  };

  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setActiveTab('overview');
    setIsDrawerOpen(true);
  };

  const filteredSubmissions = submissions.filter(s => s.studentId.toLowerCase().includes(searchTerm.toLowerCase()));

  // Batch Grouping
  const batchMap = new Map<string, { students: ExtendedStudent[], submissions: Submission[] }>();
  
  students.forEach(stu => {
    const batchName = stu.batch?.name || stu.internshipInfo?.batchName || 'Unassigned';
    if (!batchMap.has(batchName)) {
      batchMap.set(batchName, { students: [], submissions: [] });
    }
    batchMap.get(batchName)!.students.push(stu);
  });

  submissions.forEach(sub => {
    const stu = students.find(s => s.id === sub.studentId || s.student_id === sub.studentId);
    const batchName = stu?.batch?.name || stu?.internshipInfo?.batchName || 'Unassigned';
    if (!batchMap.has(batchName)) {
      batchMap.set(batchName, { students: [], submissions: [] });
    }
    batchMap.get(batchName)!.submissions.push(sub);
  });

  const batches = Array.from(batchMap.entries()).map(([name, data]) => ({
    name,
    ...data
  })).filter(b => b.submissions.length > 0 || b.students.length > 0);

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
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Submission Module</h1>
          <p className="text-sm text-text-secondary mt-1">Manage and review student task and assessment submissions.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-border">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'dashboard' ? 'bg-white text-text-primary shadow-sm border border-border/50' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveView('directory')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'directory' ? 'bg-white text-text-primary shadow-sm border border-border/50' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Directory
          </button>
          <button 
            onClick={() => { setActiveView('batches'); setSelectedBatch(null); }}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'batches' ? 'bg-white text-text-primary shadow-sm border border-border/50' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Batches
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeView === 'dashboard' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                <p className="text-sm font-medium text-text-secondary mb-1">Total Submissions</p>
                <h3 className="text-3xl font-black text-text-primary">{totalSubmissions}</h3>
              </div>
              <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                <p className="text-sm font-medium text-text-secondary mb-1">Pending Review</p>
                <h3 className="text-3xl font-black text-amber-600">{pendingReview}</h3>
              </div>
              <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                <p className="text-sm font-medium text-text-secondary mb-1">Approval Rate</p>
                <h3 className="text-3xl font-black text-emerald-600">{approvalRate}%</h3>
              </div>
            </div>

            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-text-primary">Recent Submissions</h3>
              <div className="space-y-3">
                {submissions.slice(0, 5).map((sub) => (
                  <div key={sub.id} className="p-4 bg-slate-50 border border-border rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSubmissionClick(sub)}>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <FolderDown className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary leading-tight">Student: {sub.studentId}</h4>
                        <p className="text-xs text-helper mt-1">Task: {sub.taskId || 'N/A'} • Assessment: {sub.assessmentId || 'N/A'}</p>
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
                  <div className="p-8 text-center text-text-secondary text-sm">No recent submissions.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeView === 'directory' && (
          <div className="bg-white border border-border rounded-xl shadow-sm max-w-7xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-border flex items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by student ID..."
                    className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <button className="p-2 border border-border text-text-secondary rounded-lg hover:bg-slate-50">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-border text-text-secondary font-medium">
                  <tr>
                    <th className="px-6 py-3">Student ID</th>
                    <th className="px-6 py-3">Reference (Task/Assm)</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Marks</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSubmissions.map(s => (
                    <tr key={s.id} className="hover:bg-blue-50/50 cursor-pointer transition-colors" onClick={() => handleSubmissionClick(s)}>
                      <td className="px-6 py-4 font-medium text-text-primary">{s.studentId}</td>
                      <td className="px-6 py-4 text-text-secondary">{s.taskId || s.assessmentId}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                          s.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                          s.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-secondary">{s.marksObtained !== undefined ? s.marksObtained : '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1 text-text-secondary hover:text-blue-600 transition-colors">
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

        {activeView === 'batches' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            {!selectedBatch ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batches.map(b => (
                  <div key={b.name} onClick={() => setSelectedBatch(b.name)} className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-secondary transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <FolderDown className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-bold text-text-secondary bg-slate-50 px-3 py-1 rounded-full">{b.students.length} Students</span>
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">{b.name}</h3>
                    <p className="text-sm text-text-secondary">{b.submissions.length} Submissions</p>
                  </div>
                ))}
                {batches.length === 0 && (
                  <div className="col-span-full p-12 text-center text-text-secondary bg-white rounded-xl border border-border">
                    No batches found.
                  </div>
                )}
              </div>
            ) : (() => {
              const batch = batches.find(b => b.name === selectedBatch);
              if (!batch) return null;
              
              return (
                <div className="bg-white border border-border rounded-xl shadow-sm flex flex-col h-[calc(100vh-12rem)]">
                  <div className="p-4 border-b border-border flex items-center justify-between gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <button onClick={() => setSelectedBatch(null)} className="text-sm font-semibold text-text-secondary hover:text-text-primary flex items-center gap-1">
                        &larr; Back
                      </button>
                      <h2 className="text-lg font-bold text-text-primary">{batch.name} Students</h2>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 sticky top-0 z-10 border-b border-border text-text-secondary font-medium">
                        <tr>
                          <th className="px-6 py-3">Student Name</th>
                          <th className="px-6 py-3">Student ID</th>
                          <th className="px-6 py-3">Submissions</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {batch.students.map(stu => {
                          const stuSubmissions = batch.submissions.filter(s => s.studentId === stu.id || s.studentId === stu.student_id);
                          return (
                            <tr key={stu.id || stu.student_id} className="hover:bg-blue-50/50 transition-colors">
                              <td className="px-6 py-4 font-medium text-text-primary">{stu.name || 'Unknown'}</td>
                              <td className="px-6 py-4 text-text-secondary">{stu.student_id || stu.id}</td>
                              <td className="px-6 py-4">
                                {stuSubmissions.length > 0 ? (
                                  <div className="flex flex-col gap-1">
                                    {stuSubmissions.map(sub => (
                                      <div key={sub.id} className="flex items-center gap-2 cursor-pointer hover:text-blue-600" onClick={() => handleSubmissionClick(sub)}>
                                        <FileText className="h-3 w-3 text-text-secondary" />
                                        <span className="text-xs font-medium">{sub.taskId || sub.assessmentId || sub.id}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-text-secondary italic">No submissions</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {stuSubmissions.length > 0 ? (
                                  <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                                    stuSubmissions[0].status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                                    stuSubmissions[0].status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                                  }`}>
                                    {stuSubmissions[0].status}
                                  </span>
                                ) : '-'}
                              </td>
                              <td className="px-6 py-4 text-right">
                                {stuSubmissions.length > 0 && (
                                  <button onClick={() => handleSubmissionClick(stuSubmissions[0])} className="p-1 text-text-secondary hover:text-blue-600 transition-colors">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Submission Profile" size="lg">
        {selectedSubmission && (
          <div className="flex flex-col h-full bg-slate-50 min-h-0">
            <div className="bg-white border-b border-border px-6 py-4 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FolderDown className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">Student: {selectedSubmission.studentId}</h2>
                    <p className="text-sm text-text-secondary">ID: {selectedSubmission.id}</p>
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

            <div className="flex overflow-x-auto border-b border-border bg-white px-6 shrink-0">
              {['overview', 'files', 'feedback', 'audit'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                >
                  <span className="capitalize">{t === 'audit' ? 'Audit Trail' : t}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-border shadow-sm space-y-4">
                    <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2">Links & References</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Repo Link</span>
                        <a href={selectedSubmission.repoLink} className="font-medium text-blue-600 hover:underline flex items-center gap-1"><Link className="h-3 w-3" /> View Source</a>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Live Link</span>
                        <a href={selectedSubmission.liveLink} className="font-medium text-blue-600 hover:underline flex items-center gap-1"><Link className="h-3 w-3" /> View App</a>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Task Ref</span>
                        <span className="font-medium text-text-primary">{selectedSubmission.taskId || 'None'}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Assessment Ref</span>
                        <span className="font-medium text-text-primary">{selectedSubmission.assessmentId || 'None'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                    <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-4 mb-4">Subtasks</h3>
                    <div className="space-y-3">
                      {selectedSubmission.subtasks.map(st => (
                        <div key={st.id} className="flex items-center gap-3">
                          {st.completed ? <CheckSquare className="h-4 w-4 text-blue-600" /> : <div className="h-4 w-4 border-2 border-border rounded" />}
                          <span className={`text-sm ${st.completed ? 'text-text-primary' : 'text-text-secondary'}`}>{st.task}</span>
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
                      <div key={fid} className="bg-white p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-full shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-text-primary">File ID: {fid}</div>
                          </div>
                        </div>
                        <button className="text-sm text-blue-600 font-medium hover:underline">Download</button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-text-secondary text-center">No attached files.</p>
                  )}
                </div>
              )}

              {activeTab === 'feedback' && (
                <div className="bg-white rounded-xl border border-border shadow-sm p-6 text-center text-text-secondary">
                  Feedback mechanisms will appear here.
                </div>
              )}

              {activeTab === 'audit' && (
                <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-4 mb-4">Commit History</h3>
                  <div className="space-y-4 border-l-2 border-border ml-2 pl-4">
                    {selectedSubmission.commits.map(c => (
                      <div key={c.commit} className="relative">
                        <div className="absolute -left-[23px] bg-white p-1">
                          <div className="h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white" />
                        </div>
                        <p className="text-xs text-text-secondary mb-1">{c.date} • <span className="font-medium text-blue-600">{c.commit}</span></p>
                        <p className="text-sm font-medium text-text-primary">{c.message}</p>
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
