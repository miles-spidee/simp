"use client";

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, FileText, CheckCircle2, Clock, AlertTriangle, 
  ChevronRight, UploadCloud, GitBranch, Globe, RefreshCw, Send, 
  CheckCircle, Download, File, Play, Video, ExternalLink
} from 'lucide-react';
import { Pagination } from '@/components/common/Pagination';

interface LocalSubmission {
  taskId: string;
  submission: {
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
  };
}

interface StudentTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  attempts: number;
  requirements: string[];
  examplePdf: string;
  referencePdf: string;
  starterCode: string;
  status: 'pending' | 'review' | 'completed';
  score?: number;
  feedback?: string;
  isOverdue: boolean;
}

const DEFAULT_TASKS: StudentTask[] = [];

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<StudentTask[]>(DEFAULT_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('TSK-202');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form states
  const [githubUrl, setGithubUrl] = useState('');
  const [deployUrl, setDeployUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [screenshotName, setScreenshotName] = useState('');
  const [zipName, setZipName] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const loadStateAndGrades = async () => {
      try {
        const { apiClient } = await import('@/src/api/api.client');
        const res = await apiClient.get('/api/v1/task');
        const tasksFromApi = res.data?.data || [];
        
        const mappedTasks: StudentTask[] = tasksFromApi.map((t: any) => ({
          ...t,
          attempts: t.attempts || 1,
          requirements: t.requirements || ['Github Link', 'Deployment URL', 'Screenshot'],
          examplePdf: t.examplePdf || 'task_spec_v1.pdf',
          referencePdf: t.referencePdf || 'reference_guide.pdf',
          starterCode: t.starterCode || 'starter-code.zip',
          status: t.status || 'pending',
          isOverdue: t.isOverdue || false,
        }));
        
        if (mappedTasks.length > 0) {
          setTasks(mappedTasks);
          if (!mappedTasks.find((t:any) => t.id === selectedTaskId)) {
            setSelectedTaskId(mappedTasks[0].id);
          }
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error('Failed to load tasks', err);
      }
    };

    loadStateAndGrades();
  }, []);

  const handleSimulateScreenshot = () => {
    const filename = `task_solution_preview_${Date.now().toString().slice(-4)}.png`;
    setScreenshotName(filename);
    triggerToast(`Captured mock screenshot: ${filename}`);
  };

  const handleSimulateZip = () => {
    const filename = `build_bundle_${Date.now().toString().slice(-4)}.zip`;
    setZipName(filename);
    triggerToast(`Attached simulated build: ${filename}`);
  };

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();

    const selected = tasks.find(t => t.id === selectedTaskId);
    if (!selected) return;

    try {
      const { apiClient } = await import('@/src/api/api.client');
      await apiClient.post('/api/v1/submission', {
        taskId: selectedTaskId,
        repoLink: githubUrl,
        deployUrl: deployUrl,
        videoUrl: videoUrl,
        screenshot: screenshotName,
        pdfFile: 'intern_design_spec.pdf'
      });
      
      setTasks(prev => prev.map(t => t.id === selectedTaskId ? { ...t, status: 'review' } : t));
      
      // Clear inputs
      setGithubUrl('');
      setDeployUrl('');
      setVideoUrl('');
      setScreenshotName('');
      setZipName('');

      triggerToast("Deliverables uploaded successfully for mentor evaluation!");
    } catch (err) {
      console.error('Failed to submit solution', err);
      triggerToast("Failed to upload deliverables.");
    }
  };

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="space-y-6 animate-slide-in select-none">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 border border-border text-white rounded-xl shadow-2xl animate-bounce-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">{toastMessage}</div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
            <span>Student Hub</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold text-[10px]">My Tasks</span>
          </div>
          <h2 className="text-2xl font-black text-text-primary mt-2 tracking-tight">Assigned Milestones</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Submit repositories, download starter boilerplate codes, and view graded mentor reviews.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Task list */}
        <div className="space-y-4">
          <h3 className="font-bold text-[10px] text-text-secondary uppercase tracking-widest">Active Milestones</h3>
          
          <div className="space-y-3">
            {tasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((task) => {
              const isSelected = task.id === selectedTaskId;
              const isOverdue = task.isOverdue && task.status === 'pending';

              return (
                <div 
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-900 border-border text-white shadow-xl translate-x-1' 
                      : 'bg-white border-border text-slate-850 hover:border-secondary'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    {isOverdue ? (
                      <span className="bg-rose-500 text-white font-extrabold text-[8px] px-2 py-0.5 rounded uppercase tracking-wide flex items-center gap-1">
                        OVERDUE
                      </span>
                    ) : (
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        task.status === 'completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                        task.status === 'review' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-slate-100 border-border text-text-secondary'
                      }`}>
                        {task.status}
                      </span>
                    )}
                    <span className="text-[10px] text-text-secondary font-semibold">{task.id}</span>
                  </div>

                  <h4 className="text-sm font-black mt-3 tracking-tight">{task.title}</h4>
                  
                  <div className="mt-4 pt-4 border-t border-border/10 flex justify-between items-center text-[10px] font-bold">
                    <span className={isSelected ? 'text-text-secondary' : 'text-text-secondary'}>Deadline:</span>
                    <span className={isOverdue ? 'text-rose-550' : isSelected ? 'text-white' : 'text-text-primary'}>
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {tasks.length > itemsPerPage && (
            <div className="mt-4">
              <Pagination 
                currentPage={currentPage} 
                totalPages={Math.ceil(tasks.length / itemsPerPage)} 
                onPageChange={setCurrentPage} 
              />
            </div>
          )}
        </div>

        {/* Right Column: Task workspace */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTask && (
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Task Details Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-sm uppercase tracking-widest">
                      ASSIGNED TASK
                    </span>
                    <span className="text-slate-405 font-semibold">Attempts configured: {selectedTask.attempts}</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mt-2">{selectedTask.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{selectedTask.description}</p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Due Date</span>
                  <span className={`text-xs font-extrabold flex items-center gap-1 ${
                    selectedTask.isOverdue ? 'text-rose-600' : 'text-amber-600'
                  }`}>
                    <Clock className="h-3.5 w-3.5" />
                    {selectedTask.dueDate}
                  </span>
                </div>
              </div>

              {/* Starter template assets */}
              <div className="space-y-3.5">
                <h4 className="font-bold text-xs text-text-secondary uppercase tracking-widest">Starter Reference Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-slate-100/50 cursor-pointer">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                      <span className="font-bold text-text-primary truncate">{selectedTask.examplePdf}</span>
                    </div>
                    <Download className="h-3.5 w-3.5 text-text-secondary hover:text-indigo-600" />
                  </div>
                  <div className="p-3 bg-slate-50 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-slate-100/50 cursor-pointer">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="h-4.5 w-4.5 text-text-secondary shrink-0" />
                      <span className="font-bold text-text-primary truncate">{selectedTask.referencePdf}</span>
                    </div>
                    <Download className="h-3.5 w-3.5 text-text-secondary hover:text-indigo-600" />
                  </div>
                  <div className="p-3 bg-slate-50 border border-border rounded-xl flex items-center justify-between text-xs hover:bg-slate-100/50 cursor-pointer">
                    <div className="flex items-center gap-2 truncate">
                      <File className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                      <span className="font-bold text-text-primary truncate">{selectedTask.starterCode}</span>
                    </div>
                    <Download className="h-3.5 w-3.5 text-text-secondary hover:text-indigo-600" />
                  </div>
                </div>
              </div>

              {/* Deliverable submission card */}
              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-xs text-slate-455 uppercase tracking-widest border-b border-border pb-2">Deliverables Workspace</h4>

                {selectedTask.status === 'completed' ? (
                  <div className="space-y-4">
                    <div className="p-8 border border-emerald-250 bg-emerald-50/20 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
                      <CheckCircle className="h-10 w-10 text-emerald-500" />
                      <h5 className="text-sm font-black text-text-primary">Task Graded & Closed</h5>
                      <p className="text-xs text-text-secondary max-w-sm">
                        This submission has been graded by your mentor. Double submissions are locked.
                      </p>
                    </div>

                    {selectedTask.score !== undefined && (
                      <div className="p-5 border border-indigo-150 bg-indigo-50/10 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-text-secondary uppercase">Assessment Score</span>
                          <span className="text-xl font-black text-indigo-650">{selectedTask.score} / 100</span>
                        </div>
                        {selectedTask.feedback && (
                          <div className="pt-2 border-t border-indigo-100/55">
                            <span className="block text-[9px] font-bold text-indigo-650 uppercase">Feedback Comment</span>
                            <p className="text-xs text-slate-655 mt-1 leading-relaxed italic">"{selectedTask.feedback}"</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : selectedTask.status === 'review' ? (
                  <div className="p-8 border border-blue-200 bg-blue-50/15 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
                    <RefreshCw className="h-10 w-10 text-blue-500 animate-spin-slow" />
                    <h5 className="text-sm font-black text-slate-850">Submission Under Mentor Review</h5>
                    <p className="text-xs text-text-secondary max-w-sm">
                      Your solution code has been uploaded. Your mentor will grade and post feedback comments shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitSolution} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTask.requirements.includes('Github Link') && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-455 uppercase flex items-center gap-1.5">
                            <GitBranch className="h-3.5 w-3.5 text-indigo-500" />
                            <span>GitHub Repository URL *</span>
                          </label>
                          <input 
                            type="url" 
                            required
                            placeholder="https://github.com/ananya/project" 
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            className="w-full bg-slate-50 border border-border rounded-xl px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-primary focus:bg-white"
                          />
                        </div>
                      )}

                      {selectedTask.requirements.includes('Deployment URL') && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-455 uppercase flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5 text-indigo-500" />
                            <span>Live Deployment URL *</span>
                          </label>
                          <input 
                            type="url" 
                            required
                            placeholder="https://project-demo.vercel.app" 
                            value={deployUrl}
                            onChange={(e) => setDeployUrl(e.target.value)}
                            className="w-full bg-slate-50 border border-border rounded-xl px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-primary focus:bg-white"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTask.requirements.includes('Video Walkthrough') && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-455 uppercase flex items-center gap-1.5">
                            <Video className="h-3.5 w-3.5 text-indigo-500" />
                            <span>Video Walkthrough URL *</span>
                          </label>
                          <input 
                            type="url" 
                            required
                            placeholder="https://loom.com/share/video-id" 
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="w-full bg-slate-50 border border-border rounded-xl px-3.5 py-2.5 text-xs text-text-primary outline-none focus:border-primary focus:bg-white"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      {(selectedTask.requirements.includes('Screenshot') || selectedTask.requirements.includes('Screenshots')) && (
                        <div 
                          onClick={handleSimulateScreenshot}
                          className="border-2 border-dashed border-border hover:border-secondary rounded-2xl p-4 bg-slate-50/50 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                        >
                          <UploadCloud className="h-8 w-8 text-indigo-500 mb-1" />
                          <span className="text-[10px] font-bold text-slate-655">Attach Simulated Screenshot</span>
                          {screenshotName && (
                            <span className="mt-2 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded">
                              📎 {screenshotName}
                            </span>
                          )}
                        </div>
                      )}

                      {selectedTask.requirements.includes('ZIP Archive') && (
                        <div 
                          onClick={handleSimulateZip}
                          className="border-2 border-dashed border-border hover:border-secondary rounded-2xl p-4 bg-slate-50/50 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                        >
                          <UploadCloud className="h-8 w-8 text-indigo-500 mb-1" />
                          <span className="text-[10px] font-bold text-slate-655">Attach Build ZIP Package</span>
                          {zipName && (
                            <span className="mt-2 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded">
                              📎 {zipName}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/10 cursor-pointer transition-colors"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Submit Solution Deliverable</span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
