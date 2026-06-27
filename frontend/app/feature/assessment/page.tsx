"use client";

import React, { useState, useEffect } from 'react';
import { AlertTriangle,  
  ClipboardList, Search, Filter, Plus, Calendar, Eye, FileText, Code, CheckCircle, 
  Users, BarChart2, Activity, Play, Star
 } from 'lucide-react';
import { assessmentService } from '@/src/services/assessment.service';
import { Assessment, AssessmentSubmission } from '@/src/data/mock-assessments';
import { Drawer } from '@/components/feature/ui/Drawer';

export default function AssessmentManagementPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'directory'>('dashboard');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'questions' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    setLoading(true);
    const data = await assessmentService.getAssessments();
    setAssessments(data);
    setLoading(false);
  };

  const handleAssessmentClick = async (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    const subs = await assessmentService.getSubmissions(assessment.id);
    setSubmissions(subs);
    setActiveTab('overview');
    setIsDrawerOpen(true);
  };

  const filteredAssessments = assessments.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // KPIs
  const activeAssessments = assessments.filter(a => a.status === 'Active').length;
  const upcomingAssessments = assessments.filter(a => a.status === 'Upcoming').length;
  const pendingGradingCount = 1; // MOCK
  const averageScore = 85; // MOCK

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MCQ': return <FileText className="h-4 w-4" />;
      case 'Coding': return <Code className="h-4 w-4" />;
      case 'Project': return <Play className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Assessment Module</h1>
          <p className="text-sm text-slate-500 mt-1">Manage tests, coding assignments, and projects.</p>
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Active Assessments', val: activeAssessments, icon: Activity, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                { label: 'Upcoming', val: upcomingAssessments, icon: Calendar, color: 'text-amber-600 bg-amber-50 border-amber-100' },
                { label: 'Pending Grading', val: pendingGradingCount, icon: ClipboardList, color: 'text-rose-600 bg-rose-50 border-rose-100' },
                { label: 'Average Score', val: `${averageScore}%`, icon: Star, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' }
              ].map((kpi, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all duration-200">
                  <div>
                    <div className="text-2.5xl font-black text-slate-800 tracking-tight">{kpi.val}</div>
                    <div className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mt-0.5">{kpi.label}</div>
                  </div>
                  <div className={`h-11 w-11 rounded-lg ${kpi.color} border flex items-center justify-center shrink-0`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  Upcoming Assessments
                </h3>
                <div className="space-y-3 pt-1">
                  {assessments.filter(a => a.status === 'Upcoming').map((assessment) => (
                    <div key={assessment.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">{assessment.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{assessment.assessmentType} • Batch {assessment.batchId} • Due: {assessment.date}</p>
                      </div>
                      <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Upcoming</span>
                    </div>
                  ))}
                  {assessments.filter(a => a.status === 'Upcoming').length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-sm">No upcoming assessments.</div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Pending Grading
                </h3>
                <div className="space-y-3 pt-1">
                  <div className="p-4 text-center text-slate-500 text-sm italic border border-dashed border-slate-200 rounded-lg">
                    1 submission requires manual grading.
                  </div>
                </div>
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
                    placeholder="Search assessments..."
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <button className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm">
                <Plus className="h-4 w-4" /> Create Assessment
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Assessment Title</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Batch</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssessments.map(a => (
                    <tr key={a.id} className="hover:bg-blue-50/50 cursor-pointer transition-colors" onClick={() => handleAssessmentClick(a)}>
                      <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                          {getTypeIcon(a.assessmentType)}
                        </div>
                        <div>
                          <div>{a.title}</div>
                          <div className="text-xs text-slate-500 font-normal">{a.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{a.assessmentType}</td>
                      <td className="px-6 py-4 text-slate-600">{a.batchId}</td>
                      <td className="px-6 py-4 text-slate-600">{a.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                          a.status === 'Completed' ? 'bg-slate-100 text-slate-700' :
                          a.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {a.status.toUpperCase()}
                        </span>
                      </td>
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

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Assessment Profile" size="lg">
        {selectedAssessment && (
          <div className="flex flex-col h-full bg-slate-50 min-h-0">
            <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedAssessment.title}</h2>
                    <p className="text-sm text-slate-500">ID: {selectedAssessment.id} • Batch: {selectedAssessment.batchId}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    selectedAssessment.status === 'Completed' ? 'bg-slate-100 text-slate-700' :
                    selectedAssessment.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedAssessment.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-6 shrink-0">
              {['overview', 'submissions', 'questions', 'analytics'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="capitalize">{t}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Configuration</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assessment Type</span>
                        <span className="font-medium text-slate-800">{selectedAssessment.assessmentType}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date scheduled</span>
                        <span className="font-medium text-slate-800">{selectedAssessment.date}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Marks</span>
                        <span className="font-medium text-slate-800">{selectedAssessment.totalMarks}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Passing Marks</span>
                        <span className="font-medium text-slate-800">{selectedAssessment.passingMarks}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'submissions' && (
                <div className="space-y-4">
                  {submissions.map(s => (
                    <div key={s.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-full shrink-0">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">Student: {s.studentId}</div>
                          <div className="text-xs text-slate-500">
                            Status: <span className="font-semibold">{s.status}</span> 
                            {s.score !== undefined && ` • Score: ${s.score}`}
                          </div>
                        </div>
                      </div>
                      {s.status === 'Pending Grading' && (
                        <button className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Grade Now</button>
                      )}
                    </div>
                  ))}
                  {submissions.length === 0 && <p className="text-sm text-slate-500 text-center">No submissions yet.</p>}
                </div>
              )}

              {activeTab === 'questions' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                  Question bank will appear here.
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                  Assessment analytics will appear here.
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
