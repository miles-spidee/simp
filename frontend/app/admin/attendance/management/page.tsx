"use client";

import React, { useState } from 'react';
import { 
  Calendar, Check, User, Save, Lock, ChevronRight, CheckCircle2, 
  Search, ShieldAlert, AlertCircle, Sparkles, Filter, ShieldCheck
} from 'lucide-react';

interface StudentRosterItem {
  id: string;
  name: string;
  status: 'Present' | 'Absent' | 'Late';
}

interface RegisterHistory {
  date: string;
  batchId: string;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  isLocked: boolean;
}

export default function AttendanceManagementPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selector State
  const [selectedBatch, setSelectedBatch] = useState('batch-1');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Active Mark Attendance State
  const [roster, setRoster] = useState<StudentRosterItem[]>([
    { id: 'STU-001', name: 'Alice Johnson', status: 'Present' },
    { id: 'STU-002', name: 'Bob Smith', status: 'Present' },
    { id: 'STU-003', name: 'Charlie Brown', status: 'Absent' },
    { id: 'STU-004', name: 'David Lee', status: 'Late' }
  ]);

  const [isLocked, setIsLocked] = useState(false);

  // History Register State
  const [history, setHistory] = useState<RegisterHistory[]>([
    { date: '2026-06-23', batchId: 'batch-1', presentCount: 3, absentCount: 1, lateCount: 0, isLocked: true },
    { date: '2026-06-22', batchId: 'batch-1', presentCount: 4, absentCount: 0, lateCount: 0, isLocked: true },
    { date: '2026-06-23', batchId: 'batch-2', presentCount: 2, absentCount: 1, lateCount: 1, isLocked: false }
  ]);

  // Filters State
  const [filterBatch, setFilterBatch] = useState('all');
  const [filterSearch, setFilterSearch] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    if (isLocked) {
      triggerToast('Register is locked. Unlock or create a new session to modify.');
      return;
    }
    setRoster(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
  };

  const handleSaveDraft = () => {
    triggerToast('Attendance draft saved successfully.');
  };

  const handleLockRegister = () => {
    setIsLocked(true);
    
    // Add or update in history
    const presentCount = roster.filter(s => s.status === 'Present').length;
    const absentCount = roster.filter(s => s.status === 'Absent').length;
    const lateCount = roster.filter(s => s.status === 'Late').length;

    const existingIndex = history.findIndex(h => h.date === selectedDate && h.batchId === selectedBatch);
    if (existingIndex > -1) {
      const updated = [...history];
      updated[existingIndex] = {
        date: selectedDate,
        batchId: selectedBatch,
        presentCount,
        absentCount,
        lateCount,
        isLocked: true
      };
      setHistory(updated);
    } else {
      setHistory([
        {
          date: selectedDate,
          batchId: selectedBatch,
          presentCount,
          absentCount,
          lateCount,
          isLocked: true
        },
        ...history
      ]);
    }
    triggerToast('Register locked. Attendance synchronized to cloud backend.');
  };

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
            <span className="text-blue-600 font-extrabold text-[10px]">Attendance Management</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Daily Attendance Register</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select student cohorts, mark clock-in sessions, lock daily attendance sheets and query historical audits.
          </p>
        </div>
      </div>

      {/* Main Grid Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Selector options & Mark register */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* Cohort selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-slate-100">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-455 uppercase block">Select Batch / Cohort</label>
                <select 
                  value={selectedBatch}
                  onChange={(e) => {
                    setSelectedBatch(e.target.value);
                    setIsLocked(false);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="batch-1">Cohort Alpha (Batch 1)</option>
                  <option value="batch-2">Cohort Beta (Batch 2)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-455 uppercase block">Attendance Date</label>
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setIsLocked(false);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Marking list */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Student Roster</h4>
                {isLocked ? (
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Register Locked
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 border border-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Editing Draft Mode
                  </span>
                )}
              </div>

              <div className="divide-y divide-slate-100">
                {roster.map((student) => (
                  <div key={student.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-850">{student.name}</div>
                        <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">{student.id}</span>
                      </div>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      {[
                        { label: 'Present', val: 'Present' as const, style: 'peer-checked:bg-emerald-500 peer-checked:text-white border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600' },
                        { label: 'Late', val: 'Late' as const, style: 'peer-checked:bg-amber-500 peer-checked:text-white border-slate-200 text-slate-655 hover:bg-amber-50 hover:text-amber-600' },
                        { label: 'Absent', val: 'Absent' as const, style: 'peer-checked:bg-rose-500 peer-checked:text-white border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600' }
                      ].map((statusBtn) => {
                        const isSelected = student.status === statusBtn.val;
                        return (
                          <button
                            key={statusBtn.val}
                            disabled={isLocked}
                            onClick={() => handleStatusChange(student.id, statusBtn.val)}
                            className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              isSelected 
                                ? statusBtn.val === 'Present' ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                                  : statusBtn.val === 'Late' ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                                  : 'bg-rose-600 border-rose-600 text-white shadow-sm'
                                : 'bg-white border-slate-200 text-slate-550 hover:bg-slate-50'
                            } disabled:opacity-70`}
                          >
                            {statusBtn.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions footer */}
            {!isLocked && (
              <div className="flex gap-3 pt-5 border-t border-slate-100 justify-end">
                <button
                  onClick={handleSaveDraft}
                  className="flex items-center gap-1.5 px-4 py-2 border border-slate-250 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={handleLockRegister}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Lock Attendance</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Attendance Register History */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 h-fit">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Register Logs History</h3>
            <Filter className="h-4 w-4 text-slate-400" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-slate-400 uppercase block">Filter by Batch</label>
            <select 
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-700 focus:outline-none"
            >
              <option value="all">All Cohorts</option>
              <option value="batch-1">Cohort Alpha (Batch 1)</option>
              <option value="batch-2">Cohort Beta (Batch 2)</option>
            </select>
          </div>

          <div className="space-y-3 pt-2">
            {history
              .filter(h => filterBatch === 'all' || h.batchId === filterBatch)
              .map((h, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>{h.date}</span>
                    <span className={`text-[8px] px-1.5 py-0.2 rounded border font-sans ${
                      h.isLocked ? 'bg-emerald-50 border-emerald-100 text-emerald-650' : 'bg-amber-50 border-amber-100 text-amber-650'
                    }`}>
                      {h.isLocked ? 'LOCKED' : 'DRAFT'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 leading-tight mt-1">{h.batchId === 'batch-1' ? 'Cohort Alpha' : 'Cohort Beta'}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold mt-1">
                    <span>P: <strong className="text-emerald-600">{h.presentCount}</strong></span>
                    <span>L: <strong className="text-amber-500">{h.lateCount}</strong></span>
                    <span>A: <strong className="text-rose-500">{h.absentCount}</strong></span>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>

    </div>
  );
}
