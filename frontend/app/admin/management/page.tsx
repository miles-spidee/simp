"use client";

import React, { useState } from 'react';
import { 
  CheckSquare, Plus, CheckCircle, ChevronRight, Clock, AlertTriangle, 
  ExternalLink, User, Send, CheckCircle2, XCircle, RefreshCw, X, FileText
} from 'lucide-react';
import { Task, MOCK_TASKS } from '@/src/data/mock-tasks';

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  githubUrl: string;
  deployUrl: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'resubmit';
  feedback?: string;
  attempts: number;
}

export default function TaskManagementPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Tasks local state
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(MOCK_TASKS[0]?.id || '');
  
  // Submissions local state mapped by taskId
  const [submissions, setSubmissions] = useState<Record<string, Submission[]>>({
    'TSK-101': [
      { 
        id: 'sub-1', 
        studentName: 'Alice Johnson', 
        studentId: 'STU-001', 
        githubUrl: 'https://github.com/alicej/auth-microservice', 
        deployUrl: 'https://auth-test.pinesphere.io', 
        submittedAt: '2023-11-15 14:30', 
        status: 'pending', 
        attempts: 1 
      },
      { 
        id: 'sub-2', 
        studentName: 'Bob Smith', 
        studentId: 'STU-002', 
        githubUrl: 'https://github.com/bobsmith/auth-service', 
        deployUrl: 'https://bob-auth.vercel.app', 
        submittedAt: '2023-11-16 09:15', 
        status: 'approved', 
        attempts: 2,
        feedback: 'Clean JWT middleware implementation. Good job!' 
      }
    ],
    'TSK-102': [
      { 
        id: 'sub-3', 
        studentName: 'Charlie Brown', 
        studentId: 'STU-003', 
        githubUrl: 'https://github.com/charlie/react-arch', 
        deployUrl: 'https://charlie-react.netlify.app', 
        submittedAt: '2023-10-10 16:45', 
        status: 'approved', 
        attempts: 1,
        feedback: 'Folder structure adheres to standards.' 
      }
    ],
    'TSK-103': [
      { 
        id: 'sub-4', 
        studentName: 'David Lee', 
        studentId: 'STU-004', 
        githubUrl: 'https://github.com/davelee/api-gateway', 
        deployUrl: 'https://gateway.dave.dev', 
        submittedAt: '2023-11-22 11:20', 
        status: 'pending', 
        attempts: 1 
      }
    ]
  });

  // Selected student submission for grading
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [feedbackInput, setFeedbackInput] = useState('');

  // Create Task Form State
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskInput, setTaskInput] = useState({
    title: '',
    description: '',
    batchId: 'batch-1',
    dueDate: '',
    assignedBy: 'Super Admin',
    maxAttempts: '3'
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.title || !taskInput.description || !taskInput.dueDate) {
      triggerToast('Please complete all task fields.');
      return;
    }
    const newTaskId = `TSK-${Date.now().toString().slice(-3)}`;
    const newTask: Task = {
      id: newTaskId,
      title: taskInput.title,
      description: taskInput.description,
      batchId: taskInput.batchId,
      assignedBy: taskInput.assignedBy,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: taskInput.dueDate,
      status: 'pending',
      isOverdue: false,
      isLocked: false
    };

    setTasks([newTask, ...tasks]);
    setSubmissions(prev => ({ ...prev, [newTaskId]: [] }));
    setSelectedTaskId(newTaskId);
    setShowTaskForm(false);
    triggerToast(`Task "${taskInput.title}" published!`);
    setTaskInput({
      title: '',
      description: '',
      batchId: 'batch-1',
      dueDate: '',
      assignedBy: 'Super Admin',
      maxAttempts: '3'
    });
  };

  const handleEvaluateSubmission = (status: 'approved' | 'rejected' | 'resubmit') => {
    if (!selectedSubId) return;
    
    setSubmissions(prev => {
      const taskSubs = prev[selectedTaskId] || [];
      const updated = taskSubs.map(s => {
        if (s.id === selectedSubId) {
          return {
            ...s,
            status,
            feedback: feedbackInput || undefined
          };
        }
        return s;
      });
      return { ...prev, [selectedTaskId]: updated };
    });

    // Also update overall task status dynamically if needed (Optional UX touch)
    triggerToast(`Submission marked as ${status.toUpperCase()}.`);
    setSelectedSubId(null);
    setFeedbackInput('');
  };

  const selectedTask = tasks.find(t => t.id === selectedTaskId);
  const taskSubmissions = selectedTaskId ? (submissions[selectedTaskId] || []) : [];
  const selectedSubmission = taskSubmissions.find(s => s.id === selectedSubId);

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
            <span>Operational Panel</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold text-[10px]">Task Management</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Assignment Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish academic assignments, set deadlines, and review student source code repositories.
          </p>
        </div>

        <button
          onClick={() => setShowTaskForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Publish New Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Tasks List */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-fit">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Active Assignments</h3>
          </div>
          <div className="divide-y divide-slate-100 flex flex-col">
            {tasks.map((task) => {
              const isActive = selectedTaskId === task.id;
              const subs = submissions[task.id] || [];
              const pendingGradeCount = subs.filter(s => s.status === 'pending').length;

              return (
                <button
                  key={task.id}
                  onClick={() => {
                    setSelectedTaskId(task.id);
                    setSelectedSubId(null);
                    setFeedbackInput('');
                  }}
                  className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer ${
                    isActive ? 'bg-blue-50/40 text-blue-600 font-bold border-l-4 border-blue-600' : 'text-slate-700'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 truncate">
                      <span>{task.id}</span>
                      <span className="font-medium text-slate-455">| {task.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Due: {task.dueDate}</span>
                  </div>
                  
                  {pendingGradeCount > 0 && (
                    <span className="h-5 min-w-5 px-1.5 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center shrink-0 animate-pulse">
                      {pendingGradeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Columns: Task details & attached submissions roster */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTask && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Selected Task Overview */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-sm">
                      {selectedTask.batchId === 'batch-1' ? 'Cohort Alpha' : 'Cohort Beta'}
                    </span>
                    <span className="text-slate-400">• Created: {selectedTask.assignedDate}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{selectedTask.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{selectedTask.description}</p>
                </div>

                <div className="flex flex-col items-end gap-1 text-right shrink-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Deadline</span>
                  <span className="text-xs font-extrabold text-rose-600 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {selectedTask.dueDate}
                  </span>
                </div>
              </div>

              {/* Submissions Roster */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Student Submissions</h4>
                
                <div className="grid grid-cols-1 gap-3">
                  {taskSubmissions.map((sub) => {
                    const isGraded = sub.status !== 'pending';
                    const isSelected = selectedSubId === sub.id;

                    return (
                      <div 
                        key={sub.id}
                        onClick={() => {
                          setSelectedSubId(sub.id);
                          setFeedbackInput(sub.feedback || '');
                        }}
                        className={`p-4 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:border-slate-400 transition-all ${
                          isSelected 
                            ? 'bg-slate-50 border-slate-800' 
                            : 'bg-slate-50/50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-black text-xs text-slate-600">
                            {sub.studentName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{sub.studentName}</div>
                            <div className="flex items-center gap-2 mt-0.5 text-[9px] text-slate-450 font-bold">
                              <span>ID: {sub.studentId}</span>
                              <span>•</span>
                              <span>Attempt {sub.attempts}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end md:self-auto">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            sub.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            sub.status === 'rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            sub.status === 'resubmit' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                            {sub.status === 'pending' ? 'Needs Review' : sub.status}
                          </span>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    );
                  })}
                  {taskSubmissions.length === 0 && (
                    <div className="p-8 text-center text-slate-400 italic bg-slate-50 border border-slate-100 rounded-xl text-xs">
                      No submissions uploaded for this task yet.
                    </div>
                  )}
                </div>
              </div>

              {/* EVALUATION BLOCK */}
              {selectedSubmission && (
                <div className="border-t border-slate-100 pt-5 mt-5 space-y-4 animate-slide-in">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <User className="h-4.5 w-4.5 text-blue-600" />
                      Evaluating: {selectedSubmission.studentName}
                    </h4>
                    <button 
                      onClick={() => setSelectedSubId(null)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  {/* Submission Links info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <a 
                      href={selectedSubmission.githubUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-slate-400 transition-colors text-xs font-semibold text-slate-700 bg-white"
                    >
                      <span className="truncate">GitHub: {selectedSubmission.githubUrl}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-2" />
                    </a>
                    
                    <a 
                      href={selectedSubmission.deployUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-slate-400 transition-colors text-xs font-semibold text-slate-700 bg-white"
                    >
                      <span className="truncate">Deploy: {selectedSubmission.deployUrl}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-2" />
                    </a>
                  </div>

                  {/* Feedback Form */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Submission Feedback</label>
                    <textarea 
                      rows={3} 
                      placeholder="Write evaluation review details..." 
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEvaluateSubmission('approved')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm shadow-emerald-600/10"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                    
                    <button
                      onClick={() => handleEvaluateSubmission('resubmit')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm shadow-amber-500/10"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Request Resubmit</span>
                    </button>

                    <button
                      onClick={() => handleEvaluateSubmission('rejected')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm shadow-rose-600/10"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

      {/* CREATE TASK MODAL */}
      {showTaskForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateTask} className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Publish New Assignment</h3>
            
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Assignment Title</label>
              <input 
                type="text" 
                required 
                placeholder="Database Normalization Quiz" 
                value={taskInput.title}
                onChange={(e) => setTaskInput({ ...taskInput, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Assigned Cohort Batch</label>
              <select 
                value={taskInput.batchId}
                onChange={(e) => setTaskInput({ ...taskInput, batchId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
              >
                <option value="batch-1">Cohort Alpha (Batch 1)</option>
                <option value="batch-2">Cohort Beta (Batch 2)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase block">Deadline Date</label>
                <input 
                  type="date" 
                  required 
                  value={taskInput.dueDate}
                  onChange={(e) => setTaskInput({ ...taskInput, dueDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-850 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase block">Max Attempts</label>
                <input 
                  type="number" 
                  min={1} 
                  required 
                  value={taskInput.maxAttempts}
                  onChange={(e) => setTaskInput({ ...taskInput, maxAttempts: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Description / Requirements</label>
              <textarea 
                required
                rows={3} 
                placeholder="Include description guidelines and file specifications..." 
                value={taskInput.description}
                onChange={(e) => setTaskInput({ ...taskInput, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer">Publish Task</button>
              <button type="button" onClick={() => setShowTaskForm(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-655 rounded text-xs font-bold uppercase tracking-wider cursor-pointer">Close</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
