"use client";

import React, { useState } from 'react';
import { 
  FileText, Plus, HelpCircle, ChevronRight, CheckCircle2, XCircle, 
  Trash2, Send, Clock, User, Eye, PlusCircle, BookOpen, AlertTriangle, X
} from 'lucide-react';
import { Assessment, MOCK_ASSESSMENTS } from '@/src/data/mock-assessments';

interface Question {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface StudentAttempt {
  studentName: string;
  studentId: string;
  score: number;
  warnings: number;
  answers: Record<number, string>; // question index -> student chosen option
  status: 'Passed' | 'Failed';
}

export default function AssessmentManagementPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Scheduled assessments state
  const [assessments, setAssessments] = useState<Assessment[]>(MOCK_ASSESSMENTS);
  const [selectedAsmId, setSelectedAsmId] = useState<string>(MOCK_ASSESSMENTS[0]?.id || '');

  // Questions database per assessment
  const [questionsMap, setQuestionsMap] = useState<Record<string, Question[]>>({
    'asm-1': [
      {
        questionText: "Which hook is used to perform side effects in a functional component?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: "useEffect"
      },
      {
        questionText: "What is the primary purpose of useMemo?",
        options: ["To memoize a callback function", "To memoize a computed value", "To trigger a re-render", "To access DOM elements"],
        correctAnswer: "To memoize a computed value"
      }
    ]
  });

  // Student attempts roster per assessment
  const [attemptsMap, setAttemptsMap] = useState<Record<string, StudentAttempt[]>>({
    'asm-1': [
      {
        studentName: 'Alice Johnson',
        studentId: 'STU-001',
        score: 100,
        warnings: 0,
        answers: { 0: 'useEffect', 1: 'To memoize a computed value' },
        status: 'Passed'
      },
      {
        studentName: 'Bob Smith',
        studentId: 'STU-002',
        score: 50,
        warnings: 2,
        answers: { 0: 'useState', 1: 'To memoize a computed value' },
        status: 'Failed'
      }
    ]
  });

  // Selected student attempt to inspect
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);

  // New Assessment Creation Dialog State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAsmInput, setNewAsmInput] = useState({
    title: '',
    batchId: 'batch-1',
    durationMinutes: '20',
    passingMarks: '75'
  });

  // Add Question Dialog State
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [newQuestionInput, setNewQuestionInput] = useState({
    questionText: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: ''
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsmInput.title || !newAsmInput.passingMarks) {
      triggerToast('Please provide a valid title & passing threshold.');
      return;
    }
    const newId = `asm-${Date.now().toString().slice(-3)}`;
    const newAsm: Assessment = {
      id: newId,
      title: newAsmInput.title,
      courseId: 'course-101',
      batchId: newAsmInput.batchId,
      totalMarks: 100,
      passingMarks: Number(newAsmInput.passingMarks),
      date: new Date().toISOString().split('T')[0]
    };

    setAssessments([...assessments, newAsm]);
    setQuestionsMap(prev => ({ ...prev, [newId]: [] }));
    setAttemptsMap(prev => ({ ...prev, [newId]: [] }));
    setSelectedAsmId(newId);
    setShowCreateModal(false);
    triggerToast(`Assessment "${newAsmInput.title}" created successfully!`);
    setNewAsmInput({
      title: '',
      batchId: 'batch-1',
      durationMinutes: '20',
      passingMarks: '75'
    });
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const { questionText, option1, option2, option3, option4, correctAnswer } = newQuestionInput;
    if (!questionText || !option1 || !option2 || !correctAnswer) {
      triggerToast('A question text, at least two options, and correct answer are required.');
      return;
    }

    const nextQuestion: Question = {
      questionText,
      options: [option1, option2, option3, option4].filter(o => o.trim() !== ''),
      correctAnswer
    };

    setQuestionsMap(prev => ({
      ...prev,
      [selectedAsmId]: [...(prev[selectedAsmId] || []), nextQuestion]
    }));

    setShowAddQuestionModal(false);
    triggerToast('Question added successfully.');
    setNewQuestionInput({
      questionText: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctAnswer: ''
    });
  };

  const selectedAsm = assessments.find(a => a.id === selectedAsmId);
  const activeQuestions = selectedAsmId ? (questionsMap[selectedAsmId] || []) : [];
  const activeAttempts = selectedAsmId ? (attemptsMap[selectedAsmId] || []) : [];
  const selectedAttempt = activeAttempts.find(att => att.studentId === selectedAttemptId);

  return (
    <div className="space-y-6 animate-slide-in select-none">
      
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
            <span className="text-blue-600 font-extrabold text-[10px]">Assessment Management</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Assessment & Exam Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Schedule proctored MCQ examinations, edit test papers, formulate answers and audit student proctor logs.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Assessment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Scheduled Assessments */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-fit">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Active Test Papers</h3>
          </div>
          <div className="divide-y divide-slate-100 flex flex-col">
            {assessments.map((asm) => {
              const isActive = selectedAsmId === asm.id;
              const questionCount = (questionsMap[asm.id] || []).length;
              return (
                <button
                  key={asm.id}
                  onClick={() => {
                    setSelectedAsmId(asm.id);
                    setSelectedAttemptId(null);
                  }}
                  className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer ${
                    isActive ? 'bg-blue-50/40 text-blue-600 font-bold border-l-4 border-blue-600' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">{asm.title}</div>
                    <span className="text-[9px] text-slate-405 font-semibold mt-1 block">
                      {questionCount} Questions • Passing: {asm.passingMarks}%
                    </span>
                  </div>
                  <ChevronRight className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-350'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Columns: Question details & student attempts */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAsm && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Selected assessment settings overview */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-sm">
                      {selectedAsm.batchId === 'batch-1' ? 'Cohort Alpha' : 'Cohort Beta'}
                    </span>
                    <span className="text-slate-400 font-semibold">• ID: {selectedAsm.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{selectedAsm.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold pt-1">
                    <span>Duration: <strong>20 mins</strong></span>
                    <span>•</span>
                    <span>Total Marks: <strong>100</strong></span>
                    <span>•</span>
                    <span>Passing Rate: <strong className="text-blue-600">{selectedAsm.passingMarks}%</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddQuestionModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Add Question</span>
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Question Bank Checklist</h4>
                <div className="space-y-3.5">
                  {activeQuestions.map((q, idx) => (
                    <div key={idx} className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between items-start font-semibold text-slate-800">
                        <span>Q{idx + 1}. {q.questionText}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <div 
                            key={oIdx} 
                            className={`p-2 border rounded-lg ${
                              opt === q.correctAnswer ? 'bg-emerald-50 border-emerald-250 font-bold text-emerald-700' : 'bg-white border-slate-200'
                            }`}
                          >
                            {opt} {opt === q.correctAnswer && '✓'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {activeQuestions.length === 0 && (
                    <div className="p-8 text-center text-slate-400 italic bg-slate-50 border border-slate-100 rounded-xl text-xs">
                      No questions configured in this assessment set yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Student Attempts Roster */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Student Outcomes & Proctoring</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeAttempts.map((att) => {
                    const isSelected = selectedAttemptId === att.studentId;
                    return (
                      <div
                        key={att.studentId}
                        onClick={() => setSelectedAttemptId(att.studentId)}
                        className={`p-4 border rounded-xl flex items-center justify-between gap-4 cursor-pointer hover:border-slate-400 transition-colors ${
                          isSelected ? 'bg-slate-50 border-slate-800' : 'bg-slate-50/50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                            {att.studentName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{att.studentName}</div>
                            <span className="text-[10px] text-slate-450 block font-semibold mt-0.5">Score: {att.score}%</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            att.status === 'Passed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                          }`}>
                            {att.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {activeAttempts.length === 0 && (
                    <div className="col-span-2 p-8 text-center text-slate-400 italic bg-slate-50 border border-slate-100 rounded-xl text-xs">
                      No cohort members have attempted this test yet.
                    </div>
                  )}
                </div>
              </div>

              {/* INSPECT STUDENT ATTEMPT DIALOG */}
              {selectedAttempt && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 animate-slide-in">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-blue-400">
                      <User className="h-4.5 w-4.5" />
                      Proctoring Audit: {selectedAttempt.studentName}
                    </h5>
                    <button 
                      onClick={() => setSelectedAttemptId(null)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-bold border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[9px] text-slate-450 uppercase block font-semibold">Warnings Logged</span>
                      <span className={`text-sm flex items-center gap-1 mt-0.5 ${
                        selectedAttempt.warnings > 0 ? 'text-amber-400 font-bold' : 'text-slate-200'
                      }`}>
                        <AlertTriangle className="h-4 w-4" />
                        {selectedAttempt.warnings} warnings
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-450 uppercase block font-semibold">Final Grade</span>
                      <span className={`text-sm ${
                        selectedAttempt.status === 'Passed' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>{selectedAttempt.score} / 100 ({selectedAttempt.status})</span>
                    </div>
                  </div>

                  {/* MCQ Detailed audit */}
                  <div className="space-y-3.5 pt-1 max-h-56 overflow-y-auto pr-1 select-text">
                    {activeQuestions.map((q, qIdx) => {
                      const studentAnswer = selectedAttempt.answers[qIdx];
                      const isCorrect = studentAnswer === q.correctAnswer;
                      return (
                        <div key={qIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1 text-xs">
                          <div className="font-bold text-slate-300">Q{qIdx + 1}. {q.questionText}</div>
                          <div className="flex flex-col gap-1 text-[11px] text-slate-400 pt-1">
                            <div>Student Answer: <strong className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{studentAnswer || '(Skipped)'}</strong></div>
                            <div>Correct Answer: <strong className="text-emerald-400">{q.correctAnswer}</strong></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

      {/* CREATE ASSESSMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateAssessment} className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Schedule Examination Paper</h3>
            
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Examination Title</label>
              <input 
                type="text" 
                required 
                placeholder="React Hooks Fundamentals" 
                value={newAsmInput.title}
                onChange={(e) => setNewAsmInput({ ...newAsmInput, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Assigned Batch</label>
              <select 
                value={newAsmInput.batchId}
                onChange={(e) => setNewAsmInput({ ...newAsmInput, batchId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
              >
                <option value="batch-1">Cohort Alpha (Batch 1)</option>
                <option value="batch-2">Cohort Beta (Batch 2)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase block">Time Duration (mins)</label>
                <input 
                  type="number" 
                  min={5}
                  required 
                  value={newAsmInput.durationMinutes}
                  onChange={(e) => setNewAsmInput({ ...newAsmInput, durationMinutes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase block">Passing Mark (%)</label>
                <input 
                  type="number" 
                  min={0}
                  max={100}
                  required 
                  value={newAsmInput.passingMarks}
                  onChange={(e) => setNewAsmInput({ ...newAsmInput, passingMarks: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer">Create Test</button>
              <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-655 rounded text-xs font-bold uppercase tracking-wider cursor-pointer">Close</button>
            </div>
          </form>
        </div>
      )}

      {/* ADD QUESTION MODAL */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddQuestion} className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Add MCQ Question</h3>
            
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Question Text</label>
              <textarea 
                required
                rows={2}
                placeholder="In Next.js, what signifies a route group name?" 
                value={newQuestionInput.questionText}
                onChange={(e) => setNewQuestionInput({ ...newQuestionInput, questionText: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase block">Option A</label>
                <input 
                  type="text" 
                  required 
                  placeholder="[group]" 
                  value={newQuestionInput.option1}
                  onChange={(e) => setNewQuestionInput({ ...newQuestionInput, option1: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase block">Option B</label>
                <input 
                  type="text" 
                  required 
                  placeholder="(group)" 
                  value={newQuestionInput.option2}
                  onChange={(e) => setNewQuestionInput({ ...newQuestionInput, option2: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase block">Option C (Optional)</label>
                <input 
                  type="text" 
                  placeholder="{group}" 
                  value={newQuestionInput.option3}
                  onChange={(e) => setNewQuestionInput({ ...newQuestionInput, option3: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-805 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase block">Option D (Optional)</label>
                <input 
                  type="text" 
                  placeholder="<group>" 
                  value={newQuestionInput.option4}
                  onChange={(e) => setNewQuestionInput({ ...newQuestionInput, option4: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Correct Answer Value</label>
              <input 
                type="text" 
                required 
                placeholder="Must match correct option string exactly..." 
                value={newQuestionInput.correctAnswer}
                onChange={(e) => setNewQuestionInput({ ...newQuestionInput, correctAnswer: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-808 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer">Add Question</button>
              <button type="button" onClick={() => setShowAddQuestionModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-655 rounded text-xs font-bold uppercase tracking-wider cursor-pointer">Close</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
