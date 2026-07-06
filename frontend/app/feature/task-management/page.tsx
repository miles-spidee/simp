"use client";

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, FileText, Clock, AlertTriangle, Eye, CheckCircle, 
  Users, Play, XCircle, Trash2, Send, Save, ArrowUpRight, GitBranch, ExternalLink, Video
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { Pagination } from '@/components/common/Pagination';

interface StudentSubmission {
  studentId: string;
  studentName: string;
  githubUrl: string;
  deployUrl: string;
  videoUrl: string;
  screenshot: string;
  pdfFile: string;
  submittedAt: string;
  score: number;
  feedback: string;
  status: 'Submitted' | 'Graded' | 'Pending';
}

interface LocalTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  attempts: number;
  requirements: string[];
  examplePdf: string;
  referencePdf: string;
  starterCode: string;
}

const DEFAULT_SUBMISSIONS: StudentSubmission[] = [];

const INITIAL_TASKS: LocalTask[] = [];

export default function TaskManagementPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<LocalTask[]>(INITIAL_TASKS);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(DEFAULT_SUBMISSIONS);
  
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string>('');
  const [selectedSub, setSelectedSub] = useState<StudentSubmission | null>(null);
  
  // Data loaded from backend grouped tasks
  const [groupedData, setGroupedData] = useState<any[]>([]);

  // Form: Grading
  const [inputScore, setInputScore] = useState<number>(0);
  const [inputFeedback, setInputFeedback] = useState<string>('');

  // Form: Task Creator
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-06-30');
  const [reqGithub, setReqGithub] = useState(true);
  const [reqDeploy, setReqDeploy] = useState(true);
  const [reqVideo, setReqVideo] = useState(false);
  const [reqZip, setReqZip] = useState(false);
  const [reqScreenshot, setReqScreenshot] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { apiClient } = await import('@/src/api/api.client');
        const res = await apiClient.get('/api/v1/task/grouped');
        if (res.data?.data) {
          const fetchedBatches = res.data.data;
          setGroupedData(fetchedBatches);
          
          let allTasks: LocalTask[] = [];
          fetchedBatches.forEach((b: any) => {
            b.tasks.forEach((t: any) => {
               if (!allTasks.find(x => x.title === t.title)) {
                  allTasks.push(t);
               }
            });
          });
          setTasks(allTasks);
          
          if (allTasks.length > 0 && !selectedTaskTitle) {
             setSelectedTaskTitle(allTasks[0].title);
          }
        }
      } catch (e) {
        console.error("Failed to fetch grouped tasks", e);
      }
    };
    fetchTasks();
  }, []);
  
  // When selected task title changes, update submissions list
  useEffect(() => {
    if (!selectedTaskTitle || groupedData.length === 0) return;
    
    let subs: StudentSubmission[] = [];
    groupedData.forEach(b => {
       const taskGroup = b.tasks.find((t: any) => t.title === selectedTaskTitle);
       if (taskGroup) {
          subs = [...subs, ...taskGroup.submissions];
       }
    });
    setSubmissions(subs);
  }, [selectedTaskTitle, groupedData]);

  const handlePostGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    
    // We need the actual underlying task id (which is stored in the submission object in our grouped API)
    const actualTaskId = (selectedSub as any).taskId;
    if (!actualTaskId) {
      triggerToast("Error: Missing Task ID for this submission.");
      return;
    }

    try {
      const { apiClient } = await import('@/src/api/api.client');
      await apiClient.patch(`/api/v1/task/${actualTaskId}/grade`, {
        score: inputScore,
        feedback: inputFeedback
      });
      
      const updated = submissions.map(sub => {
        if (sub.studentId === selectedSub.studentId) {
          return {
            ...sub,
            score: inputScore,
            feedback: inputFeedback,
            status: 'Graded' as const
          };
        }
        return sub;
      });

      setSubmissions(updated);
      setSelectedSub(null);
      triggerToast(`Grades published for ${selectedSub.studentName}!`);
    } catch (e) {
      console.error("Failed to grade task", e);
      triggerToast("Failed to grade task.");
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskDesc) {
      triggerToast("Please enter task title and description details.");
      return;
    }

    try {
      const { apiClient } = await import('@/src/api/api.client');
      await apiClient.post('/api/v1/task/bulk', {
        title: newTaskTitle,
        description: newTaskDesc,
        dueDate: newDueDate,
        batchId: 'batch-ai-2026'
      });
      
      // refresh tasks
      const res = await apiClient.get('/api/v1/task/grouped');
      if (res.data?.data) {
        const fetchedBatches = res.data.data;
        setGroupedData(fetchedBatches);
        let allTasks: LocalTask[] = [];
        fetchedBatches.forEach((b: any) => {
          b.tasks.forEach((t: any) => {
             if (!allTasks.find(x => x.title === t.title)) {
                allTasks.push(t);
             }
          });
        });
        setTasks(allTasks);
      }
      
      setNewTaskTitle('');
      setNewTaskDesc('');
      triggerToast(`Milestone "${newTaskTitle}" published for students!`);
    } catch (e) {
      console.error("Failed to create task", e);
      triggerToast("Failed to publish task.");
    }
  };

  return (
    <div className="space-y-6 animate-slide-in select-none">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 border border-border text-white rounded-xl shadow-2xl animate-bounce-in">
          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">{toastMessage}</div>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-text-primary tracking-tight">Task Management</h2>
        <p className="text-sm text-text-secondary mt-1">Grade student deliverables, write review comments, and publish new milestone tasks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Create Task Form */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-xs text-slate-455 uppercase tracking-widest border-b pb-2">Publish Task</h3>
          
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Task Title</label>
              <input 
                type="text" 
                required
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Build Backend Auth Middleware"
                className="w-full bg-slate-50 border border-border rounded-xl px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-primary focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Description</label>
              <textarea 
                rows={3} 
                required
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Detail core requirements, routing specs, and testing criteria."
                className="w-full bg-slate-50 border border-border rounded-xl px-3.5 py-2.5 text-xs text-text-primary outline-none resize-none leading-relaxed focus:border-primary focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Due Date</label>
              <input 
                type="date" 
                required
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl px-3.5 py-2 text-xs font-bold text-text-primary outline-none cursor-pointer"
              />
            </div>

            {/* Checkboxes for required deliverables */}
            <div className="space-y-2 border-t pt-3">
              <span className="block text-[10px] font-bold text-text-secondary uppercase tracking-wide">Required Deliverables</span>
              {[
                { label: 'GitHub Repository Link', active: reqGithub, setter: setReqGithub },
                { label: 'Live Deployment URL', active: reqDeploy, setter: setReqDeploy },
                { label: 'Video Walkthrough', active: reqVideo, setter: setReqVideo },
                { label: 'Build ZIP Package', active: reqZip, setter: setReqZip },
                { label: 'Screenshots Attachment', active: reqScreenshot, setter: setReqScreenshot }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <input 
                    type="checkbox" 
                    id={`req_${idx}`}
                    checked={item.active} 
                    onChange={(e) => item.setter(e.target.checked)}
                    className="h-3.5 w-3.5 text-indigo-650 rounded border-border cursor-pointer" 
                  />
                  <label htmlFor={`req_${idx}`} className="font-bold text-label cursor-pointer select-none">{item.label}</label>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              Publish Milestone Task
            </button>
          </form>
        </div>

        {/* Right Columns: Submissions and Grading Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-sm uppercase tracking-wide">SUBMISSIONS ASSIGNED</span>
                <select 
                  value={selectedTaskTitle}
                  onChange={(e) => { setSelectedTaskTitle(e.target.value); setSelectedSub(null); }}
                  className="block mt-2 bg-slate-50 border border-border rounded-xl px-4 py-2 text-xs font-bold text-text-primary outline-none cursor-pointer"
                >
                  {tasks.map((t, idx) => (
                    <option key={idx} value={t.title}>{t.title}</option>
                  ))}
                  {tasks.length === 0 && <option value="">No tasks available</option>}
                </select>
              </div>
            </div>

            {/* List of Student Submissions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Submission Roster Cards */}
              <div className="space-y-3">
                <span className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">Candidate Submissions</span>
                
                {submissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(sub => (
                  <div 
                    key={sub.studentId}
                    onClick={() => { setSelectedSub(sub); setInputScore(sub.score || 0); setInputFeedback(sub.feedback || ''); }}
                    className={`p-4 border rounded-2xl cursor-pointer transition-all ${
                      selectedSub?.studentId === sub.studentId 
                        ? 'bg-slate-900 border-slate-850 text-white shadow-xl translate-x-1' 
                        : 'bg-slate-50 border-slate-150 hover:border-secondary text-text-primary'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs">{sub.studentName}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                        sub.status === 'Graded' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {sub.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] opacity-80 mt-3 pt-3 border-t border-border/50">
                      <span>Submitted: {sub.submittedAt.slice(0, 10)}</span>
                      <span>Score: {sub.status === 'Graded' ? `${sub.score}/100` : 'Pending'}</span>
                    </div>
                  </div>
                ))}
              </div>
              {submissions.length > itemsPerPage && (
                <div className="mt-4">
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={Math.ceil(submissions.length / itemsPerPage)} 
                    onPageChange={setCurrentPage} 
                  />
                </div>
              )}

              {/* Grading Workspace Panel */}
              <div className="border border-slate-150 rounded-2xl p-5 bg-slate-50/20">
                {selectedSub ? (
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-sm uppercase tracking-wide">
                      GRADER CONSOLE
                    </span>
                    
                    <div>
                      <h4 className="font-bold text-xs text-text-primary">{selectedSub.studentName} Solution</h4>
                      
                      {/* Code credentials buttons */}
                      <div className="space-y-2 mt-3">
                        {selectedSub.githubUrl && (
                          <a 
                            href={selectedSub.githubUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex items-center gap-2 p-2 bg-white border border-border rounded-lg hover:border-secondary transition-colors text-[10px] text-slate-655 font-bold"
                          >
                            <GitBranch className="h-4 w-4 text-text-primary" />
                            <span className="truncate">Repository: {selectedSub.githubUrl}</span>
                          </a>
                        )}
                        {selectedSub.videoUrl && (
                          <a 
                            href={selectedSub.videoUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex items-center gap-2 p-2 bg-white border border-border rounded-lg hover:border-secondary transition-colors text-[10px] text-slate-655 font-bold"
                          >
                            <Video className="h-4 w-4 text-rose-500" />
                            <span className="truncate">Walkthrough Video</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <form onSubmit={handlePostGrade} className="space-y-4 pt-3 border-t">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-text-secondary uppercase">Assessment Score (0-100)</label>
                        <input 
                          type="number" 
                          min={0}
                          max={100}
                          required
                          value={inputScore}
                          onChange={(e) => setInputScore(parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-border rounded-lg px-3 py-2 text-xs font-bold text-text-primary outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-text-secondary uppercase">Feedback Comment</label>
                        <textarea 
                          rows={2} 
                          required
                          value={inputFeedback}
                          onChange={(e) => setInputFeedback(e.target.value)}
                          placeholder="e.g. Beautiful layout styling, clean middleware routers."
                          className="w-full bg-white border border-border rounded-lg px-3 py-2 text-xs text-text-primary outline-none resize-none leading-relaxed"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-colors cursor-pointer"
                      >
                        Publish Scores & Review
                      </button>
                    </form>
                  </div>
                ) : (
                  <p className="text-xs text-text-secondary italic text-center py-16">
                    Select a student submission card from the left panel to review solution repo links and publish grades.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
