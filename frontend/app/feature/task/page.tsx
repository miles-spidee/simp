"use client";

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, FileText, Clock, AlertTriangle, ChevronRight, TrendingUp, BarChart2, CheckCircle
} from 'lucide-react';
import { Pagination } from '@/components/common/Pagination';

interface TaskSubmission {
  studentId: string;
  studentName: string;
  status: 'Submitted' | 'Overdue' | 'Pending';
  score?: number;
  submittedAt?: string;
}

interface LocalTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  attempts: number;
  requirements: string[];
  submissions: TaskSubmission[];
}

interface BatchTasks {
  id: string;
  name: string;
  totalTasks: number;
  overallSubmissionRate: number;
  overdueCount: number;
  tasks: LocalTask[];
}

const INITIAL_BATCH_TASKS: BatchTasks[] = [];

interface ComputedStudent {
  id: string;
  name: string;
  submittedCount: number;
  overdueCount: number;
  pendingCount: number;
}

export default function TaskDashboardPage() {
  const [batches, setBatches] = useState<BatchTasks[]>(INITIAL_BATCH_TASKS);

  // Drill-down states
  const [selectedBatch, setSelectedBatch] = useState<BatchTasks | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { apiClient } = await import('@/src/api/api.client');
        const res = await apiClient.get('/api/v1/task/grouped');
        if (res.data?.data) {
          setBatches(res.data.data);
        }
      } catch (e) {
        console.error("Failed to fetch tasks", e);
      }
    };
    fetchTasks();
  }, []);

  // Calculate totals
  const totalPublishedTasks = batches.reduce((sum, b) => sum + b.totalTasks, 0);
  const avgSubmissionRate = batches.length ? Math.round(batches.reduce((sum, b) => sum + b.overallSubmissionRate, 0) / batches.length) : 0;
  const globalOverdueCount = batches.reduce((sum, b) => sum + b.overdueCount, 0);

  // Derive students for the selected batch
  let batchStudents: ComputedStudent[] = [];
  if (selectedBatch) {
    const studentMap = new Map<string, { name: string, sub: number, over: number, pend: number }>();
    selectedBatch.tasks.forEach(task => {
      task.submissions.forEach(sub => {
        if (!studentMap.has(sub.studentId)) {
          studentMap.set(sub.studentId, { name: sub.studentName, sub: 0, over: 0, pend: 0 });
        }
        const data = studentMap.get(sub.studentId)!;
        if (sub.status === 'Submitted') data.sub += 1;
        if (sub.status === 'Overdue') data.over += 1;
        if (sub.status === 'Pending') data.pend += 1;
      });
    });
    batchStudents = Array.from(studentMap.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      submittedCount: data.sub,
      overdueCount: data.over,
      pendingCount: data.pend
    }));
  }

  const selectedStudent = batchStudents.find(s => s.id === selectedStudentId);

  // Derive task submissions for selected student
  let studentTasksData: { task: LocalTask, submission: TaskSubmission | null }[] = [];
  let selectedSubmissionData: { task: LocalTask, submission: TaskSubmission } | null = null;
  
  if (selectedBatch && selectedStudentId) {
    studentTasksData = selectedBatch.tasks.map(task => {
      const sub = task.submissions.find(s => s.studentId === selectedStudentId);
      return { task, submission: sub || null };
    });
    if (selectedTaskId) {
      const match = studentTasksData.find(d => d.task.id === selectedTaskId && d.submission);
      if (match && match.submission) {
        selectedSubmissionData = { task: match.task, submission: match.submission };
      }
    }
  }

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset pagination on batch change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBatch?.id]);

  return (
    <div className="space-y-6 animate-slide-in select-none">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-text-primary tracking-tight">Task Dashboard</h2>
        <p className="text-sm text-text-secondary mt-1">Audit published assignments, track student submission percentages, and monitor overdue milestones.</p>
      </div>

      {!selectedBatch ? (
        <>
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Total Published Milestones</span>
              <h3 className="text-3xl font-black text-text-primary mt-1">{totalPublishedTasks} Tasks</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Overall Submission Rate</span>
              <h3 className="text-3xl font-black text-emerald-600 mt-1">{avgSubmissionRate}%</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Overdue Tasks</span>
              <h3 className="text-3xl font-black text-rose-600 mt-1">{globalOverdueCount}</h3>
            </div>
          </div>

          {/* Published Tasks Directory / Batch list */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs text-text-secondary uppercase tracking-widest">Milestones Directory by Cohort</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {batches.map(b => (
                <div 
                  key={b.id}
                  onClick={() => setSelectedBatch(b)}
                  className="bg-white p-6 rounded-2xl border border-border hover:border-secondary transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg flex flex-col justify-between space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold text-text-secondary uppercase">COHORT</span>
                      <h4 className="text-lg font-black text-text-primary mt-1">{b.name}</h4>
                    </div>
                    <span className="bg-indigo-55/15 text-indigo-650 font-black px-3 py-1 rounded-full text-xs">
                      {b.totalTasks} Tasks
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold text-text-secondary pt-2 border-t border-border">
                    <span>Submission Rate: <strong className="text-emerald-600">{b.overallSubmissionRate}%</strong></span>
                    <span>Overdue: <strong className="text-rose-600">{b.overdueCount}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : !selectedStudentId ? (
        /* Candidates list under batch */
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <button 
                onClick={() => setSelectedBatch(null)} 
                className="text-xs font-bold text-indigo-600 hover:underline mb-1 block"
              >
                ← Back to Cohorts
              </button>
              <h3 className="text-lg font-black text-text-primary">{selectedBatch.name} - Candidates</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {batchStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(student => (
              <div 
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className="p-5 border border-border hover:border-secondary hover:shadow-md rounded-2xl transition-all cursor-pointer bg-slate-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-text-primary">{student.name}</h4>
                    <p className="text-xs text-text-secondary">{student.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right text-xs font-bold text-text-secondary">
                    <div>Submitted: <strong className="text-emerald-600">{student.submittedCount}</strong></div>
                    <div className="mt-0.5 opacity-80">Overdue: <strong className="text-rose-600">{student.overdueCount}</strong></div>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs uppercase tracking-wider rounded-xl">
                    View Tasks
                  </button>
                </div>
              </div>
            ))}
            {batchStudents.length === 0 && (
              <p className="text-sm text-text-secondary text-center py-10">No students found with tasks in this cohort.</p>
            )}
          </div>
          {batchStudents.length > itemsPerPage && (
            <div className="mt-4">
              <Pagination 
                currentPage={currentPage} 
                totalPages={Math.ceil(batchStudents.length / itemsPerPage)} 
                onPageChange={setCurrentPage} 
              />
            </div>
          )}
        </div>
      ) : (
        /* Student's Tasks and Trace View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: List of Tasks */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b pb-3">
              <button 
                onClick={() => { setSelectedStudentId(null); setSelectedTaskId(null); }} 
                className="text-[10px] font-bold text-indigo-600 hover:underline block"
              >
                ← Back to Candidates
              </button>
              <h4 className="text-sm font-black text-text-primary mt-1">{selectedStudent?.name}'s Tasks</h4>
            </div>

            <div className="space-y-2">
              {studentTasksData.map(({task, submission}) => (
                <div 
                  key={task.id}
                  onClick={() => {
                    if (submission) setSelectedTaskId(task.id);
                  }}
                  className={`p-3 border rounded-xl transition-all ${
                    !submission ? 'bg-slate-50 border-border opacity-70 cursor-not-allowed' :
                    selectedTaskId === task.id 
                      ? 'bg-slate-900 border-slate-850 text-white shadow cursor-pointer' 
                      : 'bg-slate-50 border-border hover:border-secondary text-text-primary cursor-pointer'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="truncate pr-2">{task.title}</span>
                    {submission ? (
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded border shrink-0 uppercase ${
                        submission.status === 'Submitted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        submission.status === 'Overdue' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                        'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {submission.status}
                      </span>
                    ) : (
                      <span className="text-[8px] font-black px-2 py-0.5 rounded border bg-slate-100 text-slate-500 shrink-0">
                        N/A
                      </span>
                    )}
                  </div>
                  {submission && submission.score !== undefined && (
                    <div className="flex justify-between text-[10px] mt-2 opacity-85">
                      <span>Score: {submission.score}/100</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Report Trace */}
          <div className="lg:col-span-2 space-y-6">
            {selectedSubmissionData ? (
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
                <div className="border-b pb-4 flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-sm uppercase tracking-wider">TASK SUBMISSION DETAIL</span>
                    <h3 className="text-lg font-black text-text-primary mt-2">{selectedSubmissionData.task.title}</h3>
                    <p className="text-xs text-text-secondary mt-1">Due: {selectedSubmissionData.task.dueDate}</p>
                  </div>
                  
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-xl uppercase border ${
                    selectedSubmissionData.submission.status === 'Submitted' ? 'bg-emerald-55/15 text-emerald-700 border-emerald-200' : 
                    selectedSubmissionData.submission.status === 'Overdue' ? 'bg-rose-55/15 text-rose-700 border-rose-200' :
                    'bg-amber-55/15 text-amber-700 border-amber-200'
                  }`}>
                    {selectedSubmissionData.submission.status}
                  </span>
                </div>

                <div className="space-y-4 text-sm text-text-primary">
                  <div>
                    <h4 className="font-bold text-xs text-slate-455 uppercase tracking-widest mb-2">Description</h4>
                    <p className="text-text-secondary">{selectedSubmissionData.task.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-xs text-slate-455 uppercase tracking-widest mb-2">Requirements</h4>
                    <ul className="list-disc pl-5 space-y-1 text-text-secondary">
                      {selectedSubmissionData.task.requirements.map(req => (
                        <li key={req}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-border mt-4">
                    <h4 className="font-bold text-xs text-slate-455 uppercase tracking-widest mb-3">Grading & Analytics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl">
                        <span className="block text-xl font-black text-text-primary">{selectedSubmissionData.submission.score !== undefined ? selectedSubmissionData.submission.score : 'Pending'}</span>
                        <span className="text-[10px] text-text-secondary font-bold uppercase">Awarded Score</span>
                      </div>
                      <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl">
                        <span className="block text-xl font-black text-text-primary">{selectedSubmissionData.submission.submittedAt || 'N/A'}</span>
                        <span className="text-[10px] text-text-secondary font-bold uppercase">Submitted On</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white border border-border rounded-2xl p-16 text-center text-text-secondary italic shadow-sm">
                Select a task card from the left panel to review submission details and grading.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
