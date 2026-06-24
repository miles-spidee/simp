"use client";

import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, ChevronRight, AlertTriangle, Play, CheckCircle2, 
  CheckCircle, Circle, Timer, Monitor, Camera, Mic, Wifi
} from 'lucide-react';
import { assessmentService } from '@/src/services/assessment.service';
import { AssessmentResult } from '@/src/data/mock-assessments';

export default function MyAssessmentsPage() {
  const [pastExamResults, setPastExamResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Active exam ID
  const [selectedExamId, setSelectedExamId] = useState<string>('asm-1');

  // Exam HUD States
  const [showExamHUD, setShowExamHUD] = useState(false);
  const [examHUDWarningCount, setExamHUDWarningCount] = useState(0);
  const [examHUDSecRemaining, setExamHUDSecRemaining] = useState(1200); // 20 mins
  const [examHUDCompleted, setExamHUDCompleted] = useState(false);
  const [examHUDScore, setExamHUDScore] = useState(0);
  const [examHUDQuestionIndex, setExamHUDQuestionIndex] = useState(0);
  const [examHUDAnswers, setExamHUDAnswers] = useState<Record<number, string>>({});
  
  const [assessmentPreflight, setAssessmentPreflight] = useState({
    camera: false,
    mic: false,
    screen: false,
    network: true
  });

  const mockExamQuestions = [
    {
      question: "Which hook is used to perform side effects in a functional component?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      answer: "useEffect"
    },
    {
      question: "What is the primary purpose of useMemo?",
      options: ["To memoize a callback function", "To memoize a computed value", "To trigger a re-render", "To access DOM elements"],
      answer: "To memoize a computed value"
    },
    {
      question: "In Next.js 13+, which folder name signifies a route group?",
      options: ["[group]", "(group)", "{group}", "<group>"],
      answer: "(group)"
    },
    {
      question: "How do you pass data deeply into the component tree without prop drilling?",
      options: ["Context API", "Redux only", "Higher Order Components", "React Router"],
      answer: "Context API"
    }
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const data = await assessmentService.getAssessmentResults();
        setPastExamResults(data);
      } catch (err) {
        console.error('Failed to load assessment results', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showExamHUD && !examHUDCompleted && examHUDSecRemaining > 0) {
      interval = setInterval(() => {
        setExamHUDSecRemaining(prev => prev - 1);
      }, 1000);
    } else if (examHUDSecRemaining === 0 && !examHUDCompleted) {
      handleSubmitExam();
    }
    return () => clearInterval(interval);
  }, [showExamHUD, examHUDCompleted, examHUDSecRemaining]);

  const handleStartExam = () => {
    if (assessmentPreflight.camera && assessmentPreflight.mic && assessmentPreflight.screen) {
      setShowExamHUD(true);
      setExamHUDSecRemaining(1200);
      setExamHUDCompleted(false);
      setExamHUDScore(0);
      setExamHUDQuestionIndex(0);
      setExamHUDAnswers({});
      setExamHUDWarningCount(0);
    } else {
      alert("Please complete the device diagnostics checklist first.");
    }
  };

  const handleExitExamHUD = () => {
    setShowExamHUD(false);
  };

  const handleAnswerQuestion = (option: string) => {
    setExamHUDAnswers(prev => ({
      ...prev,
      [examHUDQuestionIndex]: option
    }));
  };

  const handleSubmitExam = () => {
    let score = 0;
    mockExamQuestions.forEach((q, idx) => {
      if (examHUDAnswers[idx] === q.answer) {
        score += 25; // 4 questions * 25 = 100
      }
    });

    setExamHUDScore(score);
    setExamHUDCompleted(true);

    // Save into list of results
    const newResult: AssessmentResult = {
      id: `asm-res-${Date.now().toString().slice(-3)}`,
      title: 'React Architecture Prep',
      date: new Date().toISOString().split('T')[0],
      score,
      status: score >= 75 ? 'Passed' : 'Failed'
    };

    setPastExamResults(prev => [newResult, ...prev]);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Student Hub</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold text-[10px]">My Assessments</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Proctored Examinations</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Access secure testing centers, verify camera permissions and complete scheduled MCQ assessment blocks.
          </p>
        </div>
      </div>

      {showExamHUD ? (
        /* EXAM INTERFACE HUD WINDOW */
        <div className="bg-white border border-red-200 rounded-2xl p-6 space-y-6 animate-slide-in relative shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-red-50 border border-red-100 p-4 gap-4 rounded-xl">
            <div>
              <span className="text-[8px] font-bold text-red-600 uppercase tracking-widest bg-red-100 border border-red-200 px-2 py-0.5 animate-pulse rounded-sm">
                PROCTOR ACTIVE
              </span>
              <h4 className="font-bold text-xs text-slate-800 mt-1.5">
                Pinesphere Proctor Gateway (Secure Attempt Mode)
              </h4>
            </div>
            <div className="flex gap-4 text-xs font-bold shrink-0">
              <div className="text-amber-600 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Warnings: {examHUDWarningCount}/3
              </div>
              <div className="text-slate-800 flex items-center gap-1">
                <Timer className="h-4 w-4 text-blue-600" />
                Time Left: {Math.floor(examHUDSecRemaining / 60)}:{(examHUDSecRemaining % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          {examHUDCompleted ? (
            <div className="text-center py-12 space-y-6 max-w-md mx-auto">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800">Assessment Submitted Successfully</h3>
                <p className="text-xs text-slate-500">
                  Your grades have been finalized and synced with mentor records.
                </p>
              </div>
              <div className="bg-slate-50 p-6 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attempt Score</span>
                <div className="text-3.5xl font-black text-slate-800 mt-2">{examHUDScore} / 100</div>
                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mt-3 rounded ${
                  examHUDScore >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {examHUDScore >= 75 ? 'Passed ✓' : 'Failed'}
                </span>
              </div>
              <button
                onClick={handleExitExamHUD}
                className="px-6 py-2.5 bg-blue-600 rounded-lg hover:bg-blue-700 text-xs font-bold text-white uppercase tracking-wider cursor-pointer transition-colors"
              >
                Exit Secure Mode
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Question Palette */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 h-fit">
                <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Question Palette</h5>
                <div className="grid grid-cols-4 gap-2">
                  {mockExamQuestions.map((q, idx) => {
                    const isCurrent = idx === examHUDQuestionIndex;
                    const isAnswered = examHUDAnswers[idx] !== undefined;
                    return (
                      <button
                        key={idx}
                        onClick={() => setExamHUDQuestionIndex(idx)}
                        className={`h-9 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-blue-600 border-blue-500 text-white font-bold'
                            : isAnswered
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-750'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-550 leading-relaxed space-y-1">
                  <div>• Keep browser in focus.</div>
                  <div>• Warning triggers if window focus is lost.</div>
                </div>
              </div>

              {/* Active Question Panel */}
              <div className="lg:col-span-3 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
                <div className="space-y-2 text-xs">
                  <span className="text-blue-600 font-bold uppercase tracking-wider text-[9px]">Question {examHUDQuestionIndex + 1} of {mockExamQuestions.length}</span>
                  <h4 className="text-sm font-bold text-slate-800 leading-relaxed">
                    {mockExamQuestions[examHUDQuestionIndex]?.question}
                  </h4>
                </div>

                <div className="space-y-2">
                  {mockExamQuestions[examHUDQuestionIndex]?.options.map((option, idx) => {
                    const isSelected = examHUDAnswers[examHUDQuestionIndex] === option;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerQuestion(option)}
                        className={`w-full text-left p-4 rounded-lg border transition-all text-xs flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 text-slate-800 font-medium'
                            : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-100/50'
                        }`}
                      >
                        <span>{option}</span>
                        <span className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center text-[10px] shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'border-slate-300'
                        }`}>
                          {isSelected && '✓'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <button
                    disabled={examHUDQuestionIndex === 0}
                    onClick={() => setExamHUDQuestionIndex(examHUDQuestionIndex - 1)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold text-slate-700 uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Previous
                  </button>
                  {examHUDQuestionIndex === mockExamQuestions.length - 1 ? (
                    <button
                      onClick={() => handleSubmitExam()}
                      className="px-5 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 text-xs font-bold text-white uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      Submit Exam
                    </button>
                  ) : (
                    <button
                      onClick={() => setExamHUDQuestionIndex(examHUDQuestionIndex + 1)}
                      className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-xs font-bold text-white uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      Next Question
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      ) : (
        /* PRE-FLIGHT GATEWAY */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Checklist & History */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Device Diagnostic Checklist */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Device Diagnostic Checklist</h3>
                <p className="text-xs text-slate-500 mt-1">Complete diagnostics hardware mapping prior to loading the testing portal.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'camera', label: 'Camera Diagnostics check', desc: 'Allows identity detection checks.', icon: Camera },
                  { key: 'mic', label: 'Audio / Mic Input check', desc: 'Allows live ambient voice checking.', icon: Mic },
                  { key: 'screen', label: 'Screen Share permission', desc: 'Required to review tab lock status.', icon: Monitor },
                  { key: 'network', label: 'Database Sync status', desc: 'Connects client nodes to sync results.', icon: Wifi, static: true }
                ].map((chk) => {
                  const isChecked = assessmentPreflight[chk.key as keyof typeof assessmentPreflight];
                  const Icon = chk.icon;
                  return (
                    <div key={chk.key} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-505">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800 block">{chk.label}</span>
                          <span className="text-[10px] text-slate-400 block leading-tight">{chk.desc}</span>
                        </div>
                      </div>

                      {chk.static ? (
                        <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold px-2.5 py-1 uppercase rounded-sm">Sync Active</span>
                      ) : (
                        <button
                          onClick={() => setAssessmentPreflight(prev => ({
                            ...prev,
                            [chk.key]: !isChecked
                          }))}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {isChecked ? 'Pass ✓' : 'Verify'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exam Results History */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                Historical Exam Roster
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest font-bold">
                      <th className="py-2.5 px-4 font-semibold">Test Paper</th>
                      <th className="py-2.5 px-4">Completion Date</th>
                      <th className="py-2.5 px-4">Score</th>
                      <th className="py-2.5 px-4 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-655">
                    {pastExamResults.map((result) => (
                      <tr key={result.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-800">{result.title}</td>
                        <td className="py-3 px-4 text-slate-500">{result.date}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{result.score}%</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-block border font-bold px-2 py-0.5 rounded-sm ${
                            result.status === 'Passed' 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                              : 'bg-rose-50 border-rose-100 text-rose-600'
                          }`}>
                            {result.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Launch Exam Card */}
          <div className="space-y-4 h-fit">
            <h3 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Launch Exam Gateway</h3>
            
            <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between h-72">
              <div>
                <span className="text-[8px] font-bold text-blue-450 uppercase tracking-widest bg-blue-600/15 border border-blue-500/20 px-2 py-0.5 rounded-sm">
                  AVAILABLE PORTAL
                </span>
                <h4 className="text-base font-bold text-white mt-3 leading-snug">React Architecture Prep</h4>
                
                <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] font-bold text-slate-400 space-y-2">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="text-white">20 Minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passing rate:</span>
                    <span className="text-blue-400">75%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Marks:</span>
                    <span className="text-white">100 Marks</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartExam}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Launch Exam HUD</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
