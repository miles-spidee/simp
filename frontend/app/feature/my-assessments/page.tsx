"use client";

import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Search, Clock, ShieldAlert, CheckCircle, 
  Play, Users, Award, Eye, XCircle, Camera, Mic, Volume2, ShieldCheck, ArrowRight, HelpCircle,
  ChevronRight, Calendar
} from 'lucide-react';

interface StudentQuiz {
  id: string;
  title: string;
  type: string;
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
  status: 'Upcoming' | 'Active' | 'Completed';
  score?: number;
  passed?: boolean;
  attempts?: number;
}

const DEFAULT_QUIZZES: StudentQuiz[] = [
  {
    id: 'ASM-401',
    title: 'Python Essentials Quiz',
    type: 'MCQ',
    duration: 10,
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
      { text: 'Which of the following is an immutable sequence in Python?', options: ['List', 'Tuple', 'Set', 'Dictionary'], answer: 'B', marks: 10 },
      { text: 'What is the purpose of the Global Interpreter Lock (GIL) in Python?', options: ['Secure network traffic', 'Prevent multithreading thread safety locks', 'Limit thread execution to one core to prevent racing', 'Encrypt Python bytecode'], answer: 'C', marks: 10 },
      { text: 'Which keyword is used to define anonymous/inline functions in Python?', options: ['anonymous', 'def', 'inline', 'lambda'], answer: 'D', marks: 10 },
    ],
    status: 'Active'
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
    status: 'Upcoming'
  }
];

export default function MyAssessmentsPage() {
  const [quizzes, setQuizzes] = useState<StudentQuiz[]>(DEFAULT_QUIZZES);
  const [selectedQuiz, setSelectedQuiz] = useState<StudentQuiz | null>(null);
  
  // Interactive Secure Browser state
  const [isExamActive, setIsExamActive] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [examTimer, setExamTimer] = useState(600); // 10 minutes in seconds

  // Warnings
  const [warningCount, setWarningCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/assessment/quizzes');
        if (res.ok) {
          const data = await res.json();
          const batch = data.find((b: any) => b.id === 'batch-ai-2026');
          if (batch) {
            const mapped = batch.assessments.map((a: any) => {
              const myAttempt = a.attempts.find((att: any) => att.studentId === 'stu-12');
              if (myAttempt) {
                return {
                  ...a,
                  status: 'Completed',
                  score: myAttempt.score,
                  passed: myAttempt.passed,
                  attempts: myAttempt.attempts
                };
              }
              return { ...a, status: 'Active' };
            });
            setQuizzes(mapped);
          }
        }
      } catch (err) {
        console.error('Error fetching quizzes', err);
      }
    };

    loadQuizzes();
    const interval = setInterval(loadQuizzes, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  // Timer effect during exam
  useEffect(() => {
    let timerInterval: any;
    if (isExamActive && examTimer > 0) {
      timerInterval = setInterval(() => {
        setExamTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            handleAutoSubmit("Time is up!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isExamActive, examTimer]);

  // Window focus listener to simulate strict focus monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isExamActive && document.hidden) {
        triggerFocusWarning();
      }
    };

    const handleWindowBlur = () => {
      if (isExamActive) {
        triggerFocusWarning();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [isExamActive, warningCount]);

  const triggerFocusWarning = () => {
    const newCount = warningCount + 1;
    setWarningCount(newCount);

    if (newCount === 1) {
      triggerToast("⚠️ WARNING 1: Alt+Tab or page focus loss detected! Please keep window focus locked on the assessment environment.");
    } else if (newCount === 2) {
      triggerToast("🚨 WARNING 2: Final Warning! Alt+Tab switch detected. Another tab switch will trigger automated paper submission.");
    } else if (newCount >= 3) {
      triggerToast("🚫 CRITICAL COMPLIANCE BREACH: Automated grading triggered.");
      handleAutoSubmit("Automated submission due to multiple focus switch events.");
    }
  };

  const handleStartExam = (quiz: StudentQuiz) => {
    if (!quiz.questions || quiz.questions.length === 0) {
      triggerToast("This assessment has no questions configured yet.");
      return;
    }
    setSelectedQuiz(quiz);
    setExamTimer(quiz.duration * 60);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setWarningCount(0);
    setIsExamActive(true);

    // Apply strict browser locks
    if (quiz.securitySettings.disableCopy) {
      document.oncopy = (e) => e.preventDefault();
      document.oncut = (e) => e.preventDefault();
    }
    if (quiz.securitySettings.disableRightClick) {
      document.oncontextmenu = (e) => e.preventDefault();
    }
  };

  const handleAutoSubmit = (reason: string) => {
    setIsExamActive(false);
    
    // Clean handlers
    document.oncopy = null;
    document.oncut = null;
    document.oncontextmenu = null;

    // Calculate score
    let score = 0;
    if (selectedQuiz) {
      let correct = 0;
      let wrong = 0;
      selectedQuiz?.questions?.forEach((q, idx) => {
        const studentAns = selectedAnswers[idx];
        if (studentAns === q.answer) {
          correct++;
        } else if (studentAns) {
          wrong++;
        }
      });
      
      const rawScore = correct * 10;
      const penalty = selectedQuiz.negativeMarking ? wrong * 1 : 0;
      score = Math.max(0, Math.round(((rawScore - penalty) / (selectedQuiz.questions.length * 10)) * 100));

      const isPassed = score >= selectedQuiz.passingMarks;

      const submissionAttempt = {
        asmId: selectedQuiz.id,
        studentId: 'stu-12',
        studentName: 'Ananya Desai',
        attempts: 1,
        score: score,
        status: 'Completed',
        passed: isPassed,
        questionAnalysis: {
          correctCount: correct,
          wrongCount: wrong,
          skippedCount: (selectedQuiz?.questions?.length || 0) - (correct + wrong),
          negativeMarks: penalty,
          detailed: selectedQuiz?.questions?.map((q, idx) => ({
            question: q?.text,
            correct: selectedAnswers[idx] === q?.answer,
            skipped: !selectedAnswers[idx],
            marksGained: selectedAnswers[idx] === q?.answer ? q?.marks : selectedAnswers[idx] ? -1 : 0
          }))
        }
      };

      fetch('http://localhost:8000/api/v1/assessment/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionAttempt)
      }).catch(err => console.error("Error saving submission", err));

      setQuizzes(prev => prev.map(q => q.id === selectedQuiz.id ? { ...q, status: 'Completed', score, passed: isPassed } : q));
    }

    triggerToast(`Quiz Submitted! ${reason} - Score: ${score}%`);
    setSelectedQuiz(null);
  };

  const formatTimer = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const formatSecurityChecklist = (quiz: StudentQuiz) => {
    const list: string[] = [];
    if (quiz.securitySettings.secureBrowser) list.push('Strict Window Lock');
    if (quiz.securitySettings.fullscreenOnly) list.push('Fullscreen Enforced');
    if (quiz.securitySettings.disableCopy) list.push('No Copy-Paste');
    if (quiz.securitySettings.cameraRequired) list.push('Camera streams');
    return list.join(', ');
  };

  return (
    <div className="space-y-6 animate-slide-in select-none">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 border border-border text-white rounded-xl shadow-2xl animate-bounce-in">
          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">{toastMessage}</div>
        </div>
      )}

      {/* Main Page Layout */}
      {!isExamActive ? (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                <span>Student Hub</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-blue-600 font-extrabold text-[10px]">My Assessments</span>
              </div>
              <h2 className="text-2xl font-black text-text-primary mt-2 tracking-tight">Active Quizzes & Exams</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Take tests under secure conditions. Browser switches are monitored.
              </p>
            </div>
          </div>

          {/* Active Quizzes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-xs text-slate-455 uppercase tracking-widest border-b border-border pb-3 flex items-center gap-2">
                <Play className="h-4 w-4 text-emerald-500" />
                <span>Available Assessments</span>
              </h3>

              <div className="space-y-3">
                {quizzes.filter(q => q.status === 'Active').map(q => (
                  <div key={q.id} className="p-4 border border-border bg-slate-50/20 rounded-xl space-y-3 hover:border-secondary transition-all">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-text-primary">{q.title}</span>
                      <span className="text-indigo-650 text-[10px]">{q.id}</span>
                    </div>
                    <div className="text-[11px] text-text-secondary leading-relaxed">
                      Duration: <strong>{q.duration} Mins</strong> • Pass threshold: <strong>{q.passingMarks}%</strong>
                      <br />
                      Security: <strong className="text-rose-600">{formatSecurityChecklist(q)}</strong>
                    </div>
                    <button
                      onClick={() => handleStartExam(q)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <span>Launch Secure Exam</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {quizzes.filter(q => q.status === 'Active').length === 0 && (
                  <p className="text-xs text-text-secondary italic text-center py-8">No exams active currently.</p>
                )}
              </div>
            </div>

            {/* Completed and Upcoming */}
            <div className="space-y-6">
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-xs text-slate-455 uppercase tracking-widest border-b border-border pb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-indigo-500" />
                  <span>My Results & Gradings</span>
                </h3>

                <div className="space-y-3 max-h-[160px] overflow-y-auto custom-scrollbar">
                  {quizzes.filter(q => q.status === 'Completed').map(q => (
                    <div key={q.id} className="p-3 border border-border bg-slate-50/30 rounded-xl flex items-center justify-between text-xs font-semibold">
                      <div>
                        <span className="block font-bold text-text-primary">{q.title}</span>
                        <span className="text-[10px] text-text-secondary">{q.id}</span>
                      </div>
                      <div className="text-right">
                        <span className={`block font-black text-sm ${q.passed ? 'text-emerald-650' : 'text-rose-600'}`}>{q.score}%</span>
                        <span className="text-[9px] text-text-secondary font-bold uppercase">{q.passed ? 'Pass' : 'Fail'}</span>
                      </div>
                    </div>
                  ))}
                  {quizzes.filter(q => q.status === 'Completed').length === 0 && (
                    <p className="text-xs text-text-secondary italic text-center py-6">No completed tests yet.</p>
                  )}
                </div>
              </div>

              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-xs text-slate-455 uppercase tracking-widest border-b border-border pb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>Upcoming Schedule</span>
                </h3>

                <div className="space-y-2.5">
                  {quizzes.filter(q => q.status === 'Upcoming').map(q => (
                    <div key={q.id} className="p-3 bg-slate-50 border border-border rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="block font-bold text-text-primary">{q.title}</span>
                        <span className="text-[10px] text-text-secondary">Attempts configured: {q.attempts}</span>
                      </div>
                      <span className="bg-slate-200 text-slate-655 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Locked</span>
                    </div>
                  ))}
                  {quizzes.filter(q => q.status === 'Upcoming').length === 0 && (
                    <p className="text-xs text-text-secondary italic text-center py-4">No upcoming tests.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ACTIVE SECURE EXAM SCREEN LAYOUT */
        <div className="fixed inset-0 z-50 bg-[#0f172a] text-slate-350 flex flex-col justify-between font-sans select-none overflow-hidden">
          
          {/* Exam Header */}
          <div className="bg-[#1e293b] border-b border-[#334155] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-6 w-6 text-rose-500 animate-pulse" />
              <div>
                <h2 className="text-base font-black text-white">{selectedQuiz?.title}</h2>
                <p className="text-[10px] text-rose-400 font-semibold tracking-wider">SECURE BROWSER ACTIVE • SCREEN VISIBILITY LOCKED</p>
              </div>
            </div>
            
            {/* Timer and warning controls */}
            <div className="flex items-center gap-6">
              {/* Warnings Indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-950/45 border border-rose-900 rounded-lg text-xs font-bold text-rose-400">
                <span>Tab Focus Warnings:</span>
                <span className="bg-rose-600 text-white px-2 py-0.2 rounded font-black text-sm">{warningCount} / 3</span>
              </div>

              {/* Timer clock */}
              <div className="flex items-center gap-2 px-4 py-1.5 bg-[#1e293b] border border-[#475569] rounded-xl text-white font-black text-sm font-mono">
                <Clock className="w-4.5 h-4.5 text-indigo-400" />
                <span>{formatTimer(examTimer)}</span>
              </div>
            </div>
          </div>

          {/* Exam Body (Simulation workspace) */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 overflow-hidden max-w-7xl mx-auto w-full">
            
            {/* Left: Questions navigations & streams */}
            <div className="space-y-6 flex flex-col justify-between h-full lg:col-span-1 min-h-0">
              
              {/* Video Monitor Stream Mockup */}
              {selectedQuiz?.securitySettings.cameraRequired && (
                <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden h-44 shrink-0 shadow-inner">
                  {/* Fake camera green dot */}
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  
                  <Camera className="h-10 w-10 text-text-secondary mb-1" />
                  <span className="text-[10px] font-bold text-slate-300">Camera Feed Compliant</span>
                  
                  {/* Fake wave indicators */}
                  <div className="flex items-center gap-1 pt-1.5">
                    <Volume2 className="h-3.5 w-3.5 text-indigo-400" />
                    <span className="text-[9px] text-slate-455">Mic Tracking active</span>
                  </div>
                </div>
              )}

              {/* Questions Grid */}
              <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 flex-1 overflow-y-auto space-y-4">
                <span className="block text-[9px] font-bold text-text-secondary uppercase tracking-widest border-b border-[#334155] pb-2">Questions map</span>
                
                <div className="grid grid-cols-4 gap-2">
                  {selectedQuiz?.questions?.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`h-9 flex items-center justify-center text-xs font-bold rounded-lg border transition-all ${
                        currentQuestionIdx === idx 
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow' 
                          : selectedAnswers[idx] !== undefined
                          ? 'bg-emerald-950/45 border-emerald-900 text-emerald-400'
                          : 'bg-[#1a2336] border-[#334155] text-text-secondary hover:border-[#475569]'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Center: Question details pane */}
            <div className="lg:col-span-3 bg-[#1e293b] border border-[#334155] rounded-3xl p-8 flex flex-col justify-between h-full min-h-0 relative shadow-2xl">
              
              {/* Question container */}
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-400">
                  <span className="flex items-center gap-1.5"><HelpCircle className="h-4 w-4" /> Question {currentQuestionIdx + 1} of {selectedQuiz?.questions?.length || 0}</span>
                  <span className="font-mono">5 Marks</span>
                </div>

                <h3 className="text-lg font-bold text-white leading-relaxed">
                  {selectedQuiz?.questions?.[currentQuestionIdx]?.text}
                </h3>

                {/* Options list */}
                <div className="grid grid-cols-1 gap-3.5 pt-2">
                  {selectedQuiz?.questions?.[currentQuestionIdx]?.options?.map((opt, oIdx) => {
                    const optionChar = String.fromCharCode(65 + oIdx);
                    const isSelected = selectedAnswers[currentQuestionIdx] === optionChar;

                    return (
                      <button
                        key={oIdx}
                        onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQuestionIdx]: optionChar }))}
                        className={`p-4 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-3.5 cursor-pointer ${
                          isSelected 
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                            : 'bg-[#151c2c] border-[#334155] text-slate-350 hover:bg-[#1a2336] hover:border-[#475569]'
                        }`}
                      >
                        <span className={`h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-bold border ${
                          isSelected 
                            ? 'bg-indigo-750 border-indigo-400 text-white' 
                            : 'bg-[#1e293b] border-[#334155] text-text-secondary'
                        }`}>
                          {optionChar}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center pt-6 border-t border-[#334155] mt-6">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                  className="px-5 py-2.5 bg-[#151c2c] border border-[#334155] hover:bg-[#1a2336] text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {currentQuestionIdx < (selectedQuiz?.questions?.length || 0) - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={() => handleAutoSubmit("Exam completed by candidate.")}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/10 transition-colors cursor-pointer"
                  >
                    Submit Paper
                  </button>
                )}
              </div>

              {/* Developer Test Helper Tooltips */}
              <div className="absolute bottom-4 right-8 flex items-center gap-2">
                <span className="text-[9px] font-bold text-text-secondary uppercase">Test Security Monitor:</span>
                <button 
                  onClick={triggerFocusWarning} 
                  className="bg-rose-950/60 border border-rose-900 text-rose-400 px-2 py-0.5 rounded text-[8px] font-bold hover:bg-rose-900 hover:text-white transition-colors"
                >
                  ⚡ Simulate Alt+Tab / Focus Switch
                </button>
              </div>

            </div>
          </div>

          {/* Compliance Footer bar */}
          <div className="bg-[#1a2336] border-t border-[#334155] px-6 py-3 text-center text-[10px] font-mono text-text-secondary flex justify-between items-center">
            <span>Client Platform Fingerprint: Pinesphere-SecureAgent-Chrome122</span>
            <span>Focus Activity Lock status: <strong className="text-emerald-500 font-bold">MONITORED</strong></span>
          </div>

        </div>
      )}
    </div>
  );
}
