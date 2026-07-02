"use client";

import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Users, BarChart2, Activity, Play, Star, AlertTriangle, ShieldCheck, XCircle, CheckCircle
} from 'lucide-react';

interface QuestionStat {
  question: string;
  correct: boolean;
  skipped: boolean;
  marksGained: number;
}

interface StudentAttempt {
  studentId: string;
  studentName: string;
  attempts: number;
  score: number;
  status: 'Completed' | 'In Progress' | 'Missed';
  passed: boolean;
  questionAnalysis: {
    correctCount: number;
    wrongCount: number;
    skippedCount: number;
    negativeMarks: number;
    detailed: QuestionStat[];
  };
}

interface AssessmentItem {
  id: string;
  title: string;
  type: 'MCQ' | 'Coding' | 'File Upload' | 'Mixed';
  duration: number; // minutes
  passingMarks: number;
  negativeMarking: boolean;
  securitySettings: {
    secureBrowser: boolean;
    disableCopy: boolean;
    disableRightClick: boolean;
    fullscreenOnly: boolean;
    disableTabSwitch: boolean;
    cameraRequired: boolean;
    microphoneRequired: boolean;
  };
  questions: { text: string; options: string[]; answer: string; marks: number }[];
  attempts: StudentAttempt[];
}

interface BatchAssessments {
  id: string;
  name: string;
  assessmentsCount: number;
  completedCount: string;
  averageScore: number;
  assessments: AssessmentItem[];
}

const INITIAL_BATCH_ASSESSMENTS: BatchAssessments[] = [
  {
    id: 'batch-ai-2026',
    name: 'AI Batch 2026',
    assessmentsCount: 2,
    completedCount: '38/42',
    averageScore: 84,
    assessments: [
      {
        id: 'ASM-401',
        title: 'Python Essentials Quiz',
        type: 'MCQ',
        duration: 30,
        passingMarks: 70,
        negativeMarking: true,
        securitySettings: {
          secureBrowser: true,
          disableCopy: true,
          disableRightClick: true,
          fullscreenOnly: true,
          disableTabSwitch: true,
          cameraRequired: true,
          microphoneRequired: true
        },
        questions: [
          { text: 'Which of the following is an immutable sequence in Python?', options: ['List', 'Tuple', 'Set', 'Dictionary'], answer: 'B', marks: 10 }
        ],
        attempts: [
          {
            studentId: 'stu-harini',
            studentName: 'Harini Sundar',
            attempts: 1,
            score: 90,
            status: 'Completed',
            passed: true,
            questionAnalysis: {
              correctCount: 9,
              wrongCount: 1,
              skippedCount: 0,
              negativeMarks: 1,
              detailed: [
                { question: 'Q1: Immutable sequences in Python?', correct: true, skipped: false, marksGained: 10 },
                { question: 'Q2: Global interpreter lock purpose?', correct: true, skipped: false, marksGained: 10 },
                { question: 'Q3: Lambda expression definition?', correct: false, skipped: false, marksGained: -1 }
              ]
            }
          },
          {
            studentId: 'stu-arun',
            studentName: 'Arun Kumar',
            attempts: 1,
            score: 78,
            status: 'Completed',
            passed: true,
            questionAnalysis: {
              correctCount: 8,
              wrongCount: 2,
              skippedCount: 0,
              negativeMarks: 2,
              detailed: [
                { question: 'Q1: Immutable sequences in Python?', correct: true, skipped: false, marksGained: 10 },
                { question: 'Q2: Global interpreter lock purpose?', correct: false, skipped: false, marksGained: -1 }
              ]
            }
          }
        ]
      },
      {
        id: 'ASM-402',
        title: 'AI Fundamentals Exam',
        type: 'Mixed',
        duration: 60,
        passingMarks: 60,
        negativeMarking: false,
        securitySettings: {
          secureBrowser: true,
          disableCopy: true,
          disableRightClick: true,
          fullscreenOnly: true,
          disableTabSwitch: true,
          cameraRequired: false,
          microphoneRequired: false
        },
        questions: [],
        attempts: [
          {
            studentId: 'stu-rahul',
            studentName: 'Rahul Sen',
            attempts: 1,
            score: 82,
            status: 'Completed',
            passed: true,
            questionAnalysis: {
              correctCount: 8,
              wrongCount: 1,
              skippedCount: 1,
              negativeMarks: 0,
              detailed: []
            }
          }
        ]
      }
    ]
  }
];

interface ComputedStudent {
  id: string;
  name: string;
  avgScore: number;
  attemptsCount: number;
  passedCount: number;
}

export default function AssessmentDashboardPage() {
  const [batches, setBatches] = useState<BatchAssessments[]>(INITIAL_BATCH_ASSESSMENTS);

  // Drill-down states
  const [selectedBatch, setSelectedBatch] = useState<BatchAssessments | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedAsmId, setSelectedAsmId] = useState<string | null>(null);

  // Sync candidate score records
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/assessment/quizzes');
        if (res.ok) {
          const data = await res.json();
          // The API returns the exact structure expected by the batches state
          setBatches(data);
        }
      } catch (err) {
        console.error('Error fetching assessments', err);
      }
    };
    fetchAssessments();
    const interval = setInterval(fetchAssessments, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  const activeCount = batches.reduce((sum, b) => sum + b.assessments.length, 0);
  const totalSubCount = batches.reduce((sum, b) => sum + b.assessments.reduce((s, a) => s + a.attempts.length, 0), 0);

  let totalScoreSum = 0;
  let totalPassed = 0;
  batches.forEach(b => {
    b.assessments.forEach(a => {
      a.attempts.forEach(att => {
        totalScoreSum += att.score;
        if (att.passed) totalPassed += 1;
      });
    });
  });
  
  const globalAverage = totalSubCount > 0 ? Math.round(totalScoreSum / totalSubCount) : 0;
  const globalPassRate = totalSubCount > 0 ? Math.round((totalPassed / totalSubCount) * 100) : 0;

  // Derive students for the selected batch
  let batchStudents: ComputedStudent[] = [];
  if (selectedBatch) {
    const studentMap = new Map<string, { name: string, totalScore: number, attempts: number, passed: number }>();
    selectedBatch.assessments.forEach(asm => {
      asm.attempts.forEach(att => {
        if (!studentMap.has(att.studentId)) {
          studentMap.set(att.studentId, { name: att.studentName, totalScore: 0, attempts: 0, passed: 0 });
        }
        const data = studentMap.get(att.studentId)!;
        data.totalScore += att.score;
        data.attempts += 1;
        if (att.passed) data.passed += 1;
      });
    });
    batchStudents = Array.from(studentMap.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      avgScore: Math.round(data.totalScore / data.attempts),
      attemptsCount: data.attempts,
      passedCount: data.passed
    }));
  }

  const selectedStudent = batchStudents.find(s => s.id === selectedStudentId);

  // Derive exam attempts for selected student
  let studentAttemptsData: { asm: AssessmentItem, attempt: StudentAttempt | null }[] = [];
  let selectedAttemptData: { asm: AssessmentItem, attempt: StudentAttempt } | null = null;
  
  if (selectedBatch && selectedStudentId) {
    studentAttemptsData = selectedBatch.assessments.map(asm => {
      const att = asm.attempts.find(a => a.studentId === selectedStudentId);
      return { asm, attempt: att || null };
    });
    if (selectedAsmId) {
      const match = studentAttemptsData.find(d => d.asm.id === selectedAsmId && d.attempt);
      if (match && match.attempt) {
        selectedAttemptData = { asm: match.asm, attempt: match.attempt };
      }
    }
  }

  return (
    <div className="space-y-6 animate-slide-in select-none">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-text-primary tracking-tight">Assessment Dashboard</h2>
        <p className="text-sm text-text-secondary mt-1">Monitor candidate scores, analyze focus warning flags, and audit individual question stats.</p>
      </div>

      {!selectedBatch ? (
        <>
          {/* Metrics Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Active Exams</span>
              <h3 className="text-3xl font-black text-text-primary mt-1">{activeCount}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Attempts Recorded</span>
              <h3 className="text-3xl font-black text-emerald-600 mt-1">{totalSubCount}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Pass Rate Avg</span>
              <h3 className="text-3xl font-black text-indigo-650 mt-1">{totalSubCount > 0 ? `${globalPassRate}%` : 'N/A'}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
              <span className="text-[10px] font-bold text-slate-405 uppercase tracking-widest">Class Average</span>
              <h3 className="text-3xl font-black text-amber-600 mt-1">{totalSubCount > 0 ? `${globalAverage}%` : 'N/A'}</h3>
            </div>
          </div>

          {/* Batch list cards */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs text-text-secondary uppercase tracking-widest">Roster Compliance</h3>
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
                      {b.assessments.length} Active Tests
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold text-text-secondary pt-2 border-t border-border">
                    <span>Submissions: <strong className="text-text-primary">{b.completedCount}</strong></span>
                    <span>Average: <strong className="text-indigo-600">{b.averageScore}%</strong></span>
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
            {batchStudents.map(student => (
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
                    <div>Average Score: <strong className="text-indigo-600">{student.avgScore}%</strong></div>
                    <div className="mt-0.5 opacity-80">Passed: {student.passedCount} / {selectedBatch.assessments.length}</div>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs uppercase tracking-wider rounded-xl">
                    View Exams
                  </button>
                </div>
              </div>
            ))}
            {batchStudents.length === 0 && (
              <p className="text-sm text-text-secondary text-center py-10">No students found with attempts in this cohort.</p>
            )}
          </div>
        </div>
      ) : (
        /* Student's Exams and Trace View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: List of Exams */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b pb-3">
              <button 
                onClick={() => { setSelectedStudentId(null); setSelectedAsmId(null); }} 
                className="text-[10px] font-bold text-indigo-600 hover:underline block"
              >
                ← Back to Candidates
              </button>
              <h4 className="text-sm font-black text-text-primary mt-1">{selectedStudent?.name}'s Exams</h4>
            </div>

            <div className="space-y-2">
              {studentAttemptsData.map(({asm, attempt}) => (
                <div 
                  key={asm.id}
                  onClick={() => {
                    if (attempt) setSelectedAsmId(asm.id);
                  }}
                  className={`p-3 border rounded-xl transition-all ${
                    !attempt ? 'bg-slate-50 border-border opacity-70 cursor-not-allowed' :
                    selectedAsmId === asm.id 
                      ? 'bg-slate-900 border-slate-850 text-white shadow cursor-pointer' 
                      : 'bg-slate-50 border-border hover:border-secondary text-text-primary cursor-pointer'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="truncate pr-2">{asm.title}</span>
                    {attempt ? (
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded border shrink-0 ${
                        attempt.passed ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {attempt.passed ? 'PASS' : 'FAIL'}
                      </span>
                    ) : (
                      <span className="text-[8px] font-black px-2 py-0.5 rounded border bg-slate-100 text-slate-500 shrink-0">
                        MISSED
                      </span>
                    )}
                  </div>
                  {attempt && (
                    <div className="flex justify-between text-[10px] mt-2 opacity-85">
                      <span>Score: {attempt.score}%</span>
                      <span>Attempt #{attempt.attempts}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Report Trace */}
          <div className="lg:col-span-2 space-y-6">
            {selectedAttemptData ? (
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
                <div className="border-b pb-4 flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-sm uppercase tracking-wider">PAPER COMPLIANCE REPORT</span>
                    <h3 className="text-lg font-black text-text-primary mt-2">{selectedAttemptData.asm.title}</h3>
                    <p className="text-xs text-text-secondary mt-1">Grading Score: <strong>{selectedAttemptData.attempt.score}%</strong></p>
                  </div>
                  
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-xl uppercase ${
                    selectedAttemptData.attempt.passed ? 'bg-emerald-55/15 text-emerald-700 border' : 'bg-rose-55/15 text-rose-700 border'
                  }`}>
                    {selectedAttemptData.attempt.passed ? 'Passed Exam' : 'Failed Exam'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                    <span className="block text-xl font-black text-emerald-700">{selectedAttemptData.attempt.questionAnalysis.correctCount}</span>
                    <span className="text-[10px] text-text-secondary font-bold uppercase">Correct answers</span>
                  </div>
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-center">
                    <span className="block text-xl font-black text-rose-700">{selectedAttemptData.attempt.questionAnalysis.wrongCount}</span>
                    <span className="text-[10px] text-text-secondary font-bold uppercase">Wrong answers</span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-border rounded-2xl text-center">
                    <span className="block text-xl font-black text-text-primary">{selectedAttemptData.attempt.questionAnalysis.skippedCount}</span>
                    <span className="text-[10px] text-text-secondary font-bold uppercase">Skipped</span>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-center">
                    <span className="block text-xl font-black text-amber-700">-{selectedAttemptData.attempt.questionAnalysis.negativeMarks}</span>
                    <span className="text-[10px] text-text-secondary font-bold uppercase">Negative Penalties</span>
                  </div>
                </div>

                {/* trace questions list */}
                {selectedAttemptData.attempt.questionAnalysis.detailed.length > 0 && (
                  <div className="space-y-3.5">
                    <h4 className="font-bold text-xs text-slate-455 uppercase tracking-widest">Question trace detail</h4>
                    <div className="space-y-2">
                      {selectedAttemptData.attempt.questionAnalysis.detailed.map((det, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-750 truncate mr-4">{det.question}</span>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                              det.correct ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              det.skipped ? 'bg-slate-100 text-slate-655 border border-border' :
                              'bg-rose-50 text-rose-700 border border-rose-150'
                            }`}>
                              {det.correct ? 'Correct' : det.skipped ? 'Skipped' : 'Wrong'}
                            </span>
                            <span className="font-mono font-bold text-text-primary">
                              {det.marksGained > 0 ? `+${det.marksGained}` : det.marksGained} marks
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-border rounded-2xl p-16 text-center text-text-secondary italic shadow-sm">
                Select an exam attempt card from the left panel to review score details and negative marking audits.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
