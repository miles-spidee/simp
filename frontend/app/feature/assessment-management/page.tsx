"use client";

import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, CheckCircle2, Save, HelpCircle
} from 'lucide-react';

interface QuestionItem {
  text: string;
  options: string[];
  answer: string;
  marks: number;
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
  questions: QuestionItem[];
}

export default function AssessmentManagementPage() {
  const [asmTitle, setAsmTitle] = useState('');
  const [asmType, setAsmType] = useState<'MCQ' | 'Coding' | 'File Upload' | 'Mixed'>('MCQ');
  const [asmDuration, setAsmDuration] = useState(45);
  const [asmAttempts, setAsmAttempts] = useState(1);
  const [asmPassingMarks, setAsmPassingMarks] = useState(70);
  const [asmNegativeMarking, setAsmNegativeMarking] = useState(false);
  const [targetBatchId, setTargetBatchId] = useState('batch-ai-2026');

  // MCQ Builder
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  // Security Toggles
  const [secBrowser, setSecBrowser] = useState(true);
  const [secCopy, setSecCopy] = useState(true);
  const [secRightClick, setSecRightClick] = useState(true);
  const [secFullscreen, setSecFullscreen] = useState(true);
  const [secTabSwitch, setSecTabSwitch] = useState(true);
  const [secCamera, setSecCamera] = useState(false);
  const [secMic, setSecMic] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const newQuestions = Array.from({ length: questionCount }).map((_, i) => {
      const existing = questions[i];
      return existing || {
        text: `Question ${i + 1}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: 'A',
        marks: 5
      };
    });
    setQuestions(newQuestions);
  }, [questionCount]);

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asmTitle) {
      triggerToast("Please enter an assessment title.");
      return;
    }

    const newAsm = {
      batchId: targetBatchId,
      title: asmTitle,
      type: asmType,
      duration: asmDuration,
      passingMarks: asmPassingMarks,
      negativeMarking: asmNegativeMarking,
      securitySettings: {
        secureBrowser: secBrowser,
        disableCopy: secCopy,
        disableRightClick: secRightClick,
        fullscreenOnly: secFullscreen,
        disableTabSwitch: secTabSwitch,
        cameraRequired: secCamera,
        microphoneRequired: secMic
      },
      questions: questions
    };

    fetch('http://localhost:8000/api/v1/assessment/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAsm)
    }).then(res => {
      if(res.ok) {
        triggerToast(`Published assessment "${asmTitle}" for batch ${targetBatchId}!`);
        setAsmTitle('');
      } else {
        triggerToast(`Error publishing assessment`);
      }
    }).catch(err => {
      triggerToast(`Network error`);
    });

    triggerToast(`Published assessment "${asmTitle}" for batch ${targetBatchId}!`);
    setAsmTitle('');
  };

  const updateQuestionText = (index: number, val: string) => {
    setQuestions(prev => prev.map((q, idx) => idx === index ? { ...q, text: val } : q));
  };

  const updateQuestionOption = (qIndex: number, oIndex: number, val: string) => {
    setQuestions(prev => prev.map((q, idx) => {
      if (idx === qIndex) {
        const newOptions = [...q.options];
        newOptions[oIndex] = val;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const updateQuestionAnswer = (index: number, val: string) => {
    setQuestions(prev => prev.map((q, idx) => idx === index ? { ...q, answer: val } : q));
  };

  return (
    <div className="space-y-6 animate-slide-in select-none">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 border border-border text-white rounded-xl shadow-2xl animate-bounce-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">{toastMessage}</div>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-text-primary tracking-tight">Assessment Management</h2>
        <p className="text-sm text-text-secondary mt-1">Configure test parameters, build MCQ questionnaires, and toggle secure browser restrictions.</p>
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm max-w-4xl space-y-6">
        <form onSubmit={handleCreateAssessment} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Target Batch</label>
              <select 
                value={targetBatchId}
                onChange={(e) => setTargetBatchId(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none cursor-pointer font-bold"
              >
                <option value="batch-ai-2026">AI Batch 2026</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Exam Type</label>
              <select 
                value={asmType}
                onChange={(e) => setAsmType(e.target.value as any)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none cursor-pointer font-bold"
              >
                <option value="MCQ">MCQ Test</option>
                <option value="Coding">Coding Sandbox</option>
                <option value="File Upload">File Upload Exam</option>
                <option value="Mixed">Mixed Roster</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Passing Threshold (%)</label>
              <input 
                type="number"
                min={50}
                max={100}
                value={asmPassingMarks}
                onChange={(e) => setAsmPassingMarks(parseInt(e.target.value) || 70)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Exam Title</label>
              <input 
                type="text"
                required
                value={asmTitle}
                onChange={(e) => setAsmTitle(e.target.value)}
                placeholder="e.g. Python OOP Challenge"
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Duration (Minutes)</label>
              <input 
                type="number"
                min={5}
                value={asmDuration}
                onChange={(e) => setAsmDuration(parseInt(e.target.value) || 30)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Attempts Allowed</label>
              <input 
                type="number"
                min={1}
                value={asmAttempts}
                onChange={(e) => setAsmAttempts(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none font-bold"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-4 border border-border rounded-xl">
            <input 
              type="checkbox"
              id="negMarking"
              checked={asmNegativeMarking}
              onChange={(e) => setAsmNegativeMarking(e.target.checked)}
              className="h-4 w-4 text-indigo-650 rounded border-border cursor-pointer"
            />
            <label htmlFor="negMarking" className="text-xs font-bold text-label cursor-pointer select-none">
              Enable Negative Marking (-1 mark per incorrect answer)
            </label>
          </div>

          {/* Security Config */}
          <div className="space-y-3.5 border-t border-border pt-4">
            <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider">Exam Security Controls</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Secure Browser Mode', active: secBrowser, setter: setSecBrowser },
                { label: 'Block Copy-Paste', active: secCopy, setter: setSecCopy },
                { label: 'Disable Right-Click', active: secRightClick, setter: setSecRightClick },
                { label: 'Fullscreen Requirement', active: secFullscreen, setter: setSecFullscreen },
                { label: 'Strict Focus Block', active: secTabSwitch, setter: setSecTabSwitch },
                { label: 'Camera Monitoring', active: secCamera, setter: setSecCamera },
                { label: 'Microphone Tracking', active: secMic, setter: setSecMic },
              ].map((sec, idx) => (
                <div 
                  key={idx}
                  onClick={() => sec.setter(!sec.active)}
                  className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    sec.active 
                      ? 'border-rose-500 bg-rose-50/20 font-bold text-rose-800' 
                      : 'border-border hover:border-secondary text-text-secondary'
                  }`}
                >
                  <span className="text-[10px] leading-tight select-none">{sec.label}</span>
                  <input 
                    type="checkbox" 
                    checked={sec.active} 
                    onChange={() => {}} 
                    className="h-3.5 w-3.5 text-rose-600 rounded border-border pointer-events-none" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* MCQ builder */}
          {asmType === 'MCQ' && (
            <div className="space-y-4 border-t border-border pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider">MCQ Questionnaire Builder</label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-text-secondary">Total Questions:</span>
                  {[10, 20, 30, 40].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`px-3 py-1 rounded text-xs font-bold border transition-all ${
                        questionCount === num 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                          : 'bg-white text-text-secondary border-border hover:border-secondary'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 border border-border rounded-xl bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-text-secondary">
                      <span>Question {qIdx + 1}</span>
                      <span className="font-mono text-text-primary">5 Marks</span>
                    </div>
                    
                    <input 
                      type="text"
                      required
                      value={q.text}
                      onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                      placeholder="Enter question text here..."
                      className="w-full bg-white border border-border rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:border-primary"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-text-secondary uppercase">{String.fromCharCode(65 + oIdx)}</span>
                          <input 
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => updateQuestionOption(qIdx, oIdx, e.target.value)}
                            className="w-full bg-white border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-secondary">Correct Option:</span>
                        <select 
                          value={q.answer}
                          onChange={(e) => updateQuestionAnswer(qIdx, e.target.value)}
                          className="bg-white border border-border rounded px-2 py-1 text-xs text-slate-705 cursor-pointer outline-none font-bold"
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button 
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Publish Assessment
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
