"use client";

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, FileText, CheckCircle2, Clock, AlertTriangle, 
  ChevronRight, UploadCloud, GitBranch, Globe, RefreshCw, Send, CheckCircle
} from 'lucide-react';
import { Task, MOCK_TASKS } from '@/src/data/mock-tasks';

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(MOCK_TASKS[0]?.id || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Submission form input state
  const [submissionInput, setSubmissionInput] = useState({
    githubUrl: '',
    deployUrl: '',
    zipFileName: ''
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSimulateSelectFile = () => {
    setSubmissionInput(prev => ({
      ...prev,
      zipFileName: `solution_archive_${Date.now().toString().slice(-4)}.zip`
    }));
    triggerToast('Simulated ZIP archive attachment.');
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionInput.githubUrl || !submissionInput.zipFileName) {
      triggerToast('GitHub URL and ZIP deliverable are required.');
      return;
    }

    // Optimistically update the status of the task to 'review'
    setTasks(prev => prev.map(t => {
      if (t.id === selectedTaskId) {
        return {
          ...t,
          status: 'review',
          isOverdue: false // Submission removes overdue active flag for student view
        };
      }
      return t;
    }));

    triggerToast('Task deliverables submitted successfully for review!');
    setSubmissionInput({ githubUrl: '', deployUrl: '', zipFileName: '' });
  };

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="space-y-6 animate-slide-in select-none">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6 font-medium flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        TODO: Waiting for backend endpoint
      </div>

      
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl animate-bounce-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">{toastMessage}</div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Student Hub</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold text-[10px]">My Tasks</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">My Assigned Tasks</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View active homework, submit repository deliverables, check code status, and review mentor feedback logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Task list */}
        <div className="space-y-4">
          <h3 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Assigned Milestones</h3>
          
          <div className="space-y-3">
            {tasks.map((task) => {
              const isSelected = task.id === selectedTaskId;
              const isOverdue = task.isOverdue;

              return (
                <div 
                  key={task.id}
                  onClick={() => {
                    setSelectedTaskId(task.id);
                    setSubmissionInput({ githubUrl: '', deployUrl: '', zipFileName: '' });
                  }}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-900 border-slate-800 text-white shadow-xl translate-x-1' 
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-350'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    {isOverdue ? (
                      <span className="bg-rose-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded uppercase tracking-wide flex items-center gap-1">
                        OVERDUE
                      </span>
                    ) : (
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        task.status === 'review' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {task.status}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-semibold">{task.id}</span>
                  </div>

                  <h4 className="text-sm font-black mt-3 tracking-tight">{task.title}</h4>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100/10 flex justify-between items-center text-[10px] font-bold">
                    <span className={isSelected ? 'text-slate-400' : 'text-slate-505'}>Deadline:</span>
                    <span className={isOverdue ? 'text-rose-500' : isSelected ? 'text-white' : 'text-slate-800'}>
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Task workspace workspace */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTask && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Task Details Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-sm">
                      ASSIGNED
                    </span>
                    <span className="text-slate-400 font-semibold">By: {selectedTask.assignedBy}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">{selectedTask.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{selectedTask.description}</p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Submit By</span>
                  <span className={`text-xs font-extrabold flex items-center gap-1 ${
                    selectedTask.isOverdue ? 'text-rose-600' : 'text-amber-600'
                  }`}>
                    <Clock className="h-3.5 w-3.5" />
                    {selectedTask.dueDate}
                  </span>
                </div>
              </div>

              {/* Overdue Warning Alert Box */}
              {selectedTask.isOverdue && selectedTask.alert && (
                <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-4 flex items-start gap-2.5">
                  <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h5 className="text-xs font-bold text-rose-800">Critical Assignment Warning</h5>
                    <p className="text-[11px] text-rose-700 font-medium leading-relaxed mt-0.5">
                      {selectedTask.alert}. Please complete your upload immediately to avoid automated grading penalty.
                    </p>
                  </div>
                </div>
              )}

              {/* Deliverable submission card */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Deliverables Setup</h4>

                {selectedTask.status === 'completed' ? (
                  <div className="p-8 border border-emerald-250 bg-emerald-50/20 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
                    <CheckCircle className="h-10 w-10 text-emerald-500" />
                    <h5 className="text-sm font-black text-slate-800">Task Evaluation Approved</h5>
                    <p className="text-xs text-slate-500 max-w-sm">
                      This task submission has been successfully reviewed and locked by your supervisor.
                    </p>
                  </div>
                ) : selectedTask.status === 'review' ? (
                  <div className="p-8 border border-blue-200 bg-blue-50/15 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
                    <RefreshCw className="h-10 w-10 text-blue-500 animate-spin-slow" />
                    <h5 className="text-sm font-black text-slate-850">Submission Under Review</h5>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Your solution code has been received. Your mentor will grade and post feedback comments shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitTask} className="space-y-4">
                    
                    {/* Dotted upload component */}
                    <div 
                      onClick={handleSimulateSelectFile}
                      className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 bg-slate-50/50 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                    >
                      <UploadCloud className="h-10 w-10 text-blue-500 mb-2" />
                      <h5 className="text-xs font-bold text-slate-700">Attach Deliverable ZIP Archive</h5>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">
                        Click here to select and attach your compiled project solution files.
                      </p>
                      {submissionInput.zipFileName && (
                        <div className="mt-3.5 px-3 py-1.5 bg-white border border-slate-250 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm flex items-center gap-2">
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                          <span>{submissionInput.zipFileName}</span>
                        </div>
                      )}
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <GitBranch className="h-3.5 w-3.5 text-slate-500" />
                          <span>GitHub Repository URL</span>
                        </label>
                        <input 
                          type="url" 
                          required
                          placeholder="https://github.com/username/project" 
                          value={submissionInput.githubUrl}
                          onChange={(e) => setSubmissionInput({ ...submissionInput, githubUrl: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5 text-slate-500" />
                          <span>Live Deployment URL</span>
                        </label>
                        <input 
                          type="url" 
                          placeholder="https://project.vercel.app (Optional)" 
                          value={submissionInput.deployUrl}
                          onChange={(e) => setSubmissionInput({ ...submissionInput, deployUrl: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-850 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/10 cursor-pointer transition-colors"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Submit Deliverable</span>
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
