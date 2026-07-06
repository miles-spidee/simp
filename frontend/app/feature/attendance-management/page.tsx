"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, Clock, AlertTriangle, ShieldCheck, XCircle, Save, Check
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';

interface StudentRow {
  id: string;
  name: string;
  avatar: string;
  status: 'Present' | 'Absent' | 'Late' | null;
}

interface LocalAppeal {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: string;
  reason: string;
  reviewStatus: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  auditLog?: string[];
}

const INITIAL_STUDENTS: StudentRow[] = [];

export default function AttendanceManagementPage() {
  const { user } = useAuth();
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Attendance Marking Grid State
  const [students, setStudents] = useState<StudentRow[]>(INITIAL_STUDENTS);
  const [isLocked, setIsLocked] = useState(false);

  // Appeals State
  const [appeals, setAppeals] = useState<LocalAppeal[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [batchesList, setBatchesList] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    // Load attendance from backend
    const fetchBatches = async () => {
      try {
        const { apiClient } = await import('@/src/api/api.client');
        const res = await apiClient.get('/api/v1/attendance/batches');
        if (res.data?.data) {
          const fetchedBatches = res.data.data;
          setBatchesList(fetchedBatches.map((b: any) => ({id: b.id, name: b.name})));
          
          if (fetchedBatches.length > 0 && !selectedBatchId) {
             setSelectedBatchId(fetchedBatches[0].id);
          }
          
          const currentBatch = fetchedBatches.find((b: any) => b.id === (selectedBatchId || fetchedBatches[0].id));
          if (currentBatch) {
            // Check if there is local draft
            const savedKey = `pinesphere_attendance_${currentBatch.id}_${selectedDate}`;
            const saved = localStorage.getItem(savedKey);
            if (saved) {
              const parsed = JSON.parse(saved);
              setStudents(parsed.students);
              setIsLocked(parsed.isLocked);
            } else {
              // Populate from backend
              const day = parseInt(selectedDate.split('-')[2]);
              const stuRows = currentBatch.students.map((s: any) => ({
                id: s.id,
                name: s.name,
                avatar: s.avatar,
                status: s.logs && s.logs[day] ? s.logs[day] : null
              }));
              setStudents(stuRows);
              setIsLocked(false);
            }
          }
        }
      } catch(e) {
        console.error(e);
      }
    };
    fetchBatches();

    if (typeof window !== 'undefined') {
      const appealsStr = localStorage.getItem('pinesphere_attendance_appeals') || '[]';
      setAppeals(JSON.parse(appealsStr));
    }
  }, [selectedBatchId, selectedDate]);

  const handleMarkStatus = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    if (isLocked) {
      triggerToast("Roster is locked! Unlock or contact Super Admin to make changes.");
      return;
    }
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
  };

  const handleSaveDraft = () => {
    if (typeof window !== 'undefined') {
      const savedKey = `pinesphere_attendance_${selectedBatchId}_${selectedDate}`;
      localStorage.setItem(savedKey, JSON.stringify({ students, isLocked: false }));
      triggerToast("Draft saved successfully!");
    }
  };

  const handleLockAttendance = async () => {
    if (typeof window !== 'undefined') {
      const savedKey = `pinesphere_attendance_${selectedBatchId}_${selectedDate}`;
      localStorage.setItem(savedKey, JSON.stringify({ students, isLocked: true }));
      setIsLocked(true);
      triggerToast("Attendance roster locked! No further modifications allowed.");
      
      try {
        const { apiClient } = await import('@/src/api/api.client');
        await apiClient.post(`/api/v1/attendance/batches/${selectedBatchId}/mark`, {
          date: selectedDate,
          students: students.map(s => ({ id: s.id, status: s.status }))
        });
      } catch (e) {
        console.error("Failed to post attendance to backend", e);
      }
    }
  };

  const handleApproveAppeal = (appealId: string) => {
    const updatedAppeals = appeals.map(app => {
      if (app.id === appealId) {
        const audit = app.auditLog || [];
        return {
          ...app,
          reviewStatus: 'Approved' as const,
          reviewedBy: user?.name || 'Rahul Verma',
          reviewedAt: new Date().toLocaleString(),
          auditLog: [...audit, `Approved by ${user?.name || 'Rahul Verma'} at ${new Date().toLocaleString()}`]
        };
      }
      return app;
    });

    setAppeals(updatedAppeals);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinesphere_attendance_appeals', JSON.stringify(updatedAppeals));
    }

    // Apply the correction to local attendance grid
    const targetAppeal = appeals.find(a => a.id === appealId);
    if (targetAppeal) {
      const targetDate = targetAppeal.date;
      const targetStatus = targetAppeal.status as 'Present' | 'Absent' | 'Late';
      const savedKey = `pinesphere_attendance_${selectedBatchId}_${targetDate}`;
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const correctedStudents = parsed.students.map((s: any) => 
          s.id === targetAppeal.studentId ? { ...s, status: targetStatus } : s
        );
        localStorage.setItem(savedKey, JSON.stringify({ students: correctedStudents, isLocked: parsed.isLocked }));
        if (targetDate === selectedDate) {
          setStudents(correctedStudents);
        }
      }
    }

    triggerToast("Appeal approved! Attendance correction applied.");
  };

  const handleRejectAppeal = (appealId: string) => {
    const updatedAppeals = appeals.map(app => {
      if (app.id === appealId) {
        const audit = app.auditLog || [];
        return {
          ...app,
          reviewStatus: 'Rejected' as const,
          reviewedBy: user?.name || 'Rahul Verma',
          reviewedAt: new Date().toLocaleString(),
          auditLog: [...audit, `Rejected by ${user?.name || 'Rahul Verma'} at ${new Date().toLocaleString()}`]
        };
      }
      return app;
    });

    setAppeals(updatedAppeals);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinesphere_attendance_appeals', JSON.stringify(updatedAppeals));
    }
    triggerToast("Appeal rejected. Audit log updated.");
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
        <h2 className="text-2xl font-black text-text-primary tracking-tight">Attendance Roster</h2>
        <p className="text-sm text-text-secondary mt-1">Mark daily student logs, lock attendance sheets, and process correction appeals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle: Mark Attendance Grid */}
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <select 
                value={selectedBatchId} 
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="bg-slate-50 border border-border rounded-xl px-4 py-2 text-xs font-bold text-text-primary outline-none cursor-pointer"
              >
                {batchesList.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
                {batchesList.length === 0 && <option value="batch-ai-2026">AI Batch 2026</option>}
              </select>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-50 border border-border rounded-xl px-4 py-2 text-xs font-bold text-text-primary outline-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              {isLocked ? (
                <span className="flex items-center gap-1 bg-rose-50 border border-rose-200 text-rose-700 font-extrabold text-[10px] px-3 py-1.5 rounded-xl uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-rose-500" /> LOCKED
                </span>
              ) : (
                <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 font-extrabold text-[10px] px-3 py-1.5 rounded-xl uppercase tracking-wider">
                  DRAFT STATE
                </span>
              )}
            </div>
          </div>

          {/* Student marking rows */}
          <div className="space-y-3">
            {students.map((student) => (
              <div 
                key={student.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border bg-slate-50/20 rounded-xl gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-indigo-650 text-white rounded-full flex items-center justify-center font-bold text-xs">
                    {student.avatar}
                  </div>
                  <div>
                    <span className="block font-bold text-text-primary text-xs">{student.name}</span>
                    <span className="text-[10px] text-text-secondary font-semibold">{student.id}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {(['Present', 'Absent', 'Late'] as const).map((st) => {
                    const isActive = student.status === st;
                    return (
                      <button
                        key={st}
                        disabled={isLocked}
                        onClick={() => handleMarkStatus(student.id, st)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border cursor-pointer ${
                          isActive 
                            ? st === 'Present' ? 'bg-emerald-600 border-emerald-500 text-white' :
                              st === 'Absent' ? 'bg-rose-600 border-rose-500 text-white' :
                              'bg-amber-500 border-amber-450 text-white'
                            : 'bg-white border-border text-text-secondary hover:border-secondary'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Marking actions */}
          {!isLocked && (
            <div className="flex justify-end gap-3 pt-3 border-t border-border">
              <button 
                onClick={handleSaveDraft}
                className="px-5 py-2.5 bg-white border border-border hover:bg-slate-50 text-text-primary font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" /> Save Draft
              </button>
              <button 
                onClick={handleLockAttendance}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" /> Lock Attendance
              </button>
            </div>
          )}
        </div>

        {/* Right Panel: Appeals Review Inbox */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-xs text-slate-455 uppercase tracking-widest border-b border-border pb-3">Correction Appeals</h3>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
            {appeals.map((app) => (
              <div key={app.id} className="p-4 bg-slate-50 border border-border rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="block font-bold text-text-primary text-xs">{app.studentName}</span>
                    <span className="text-[9px] text-text-secondary font-semibold">{app.date} • Appeal for {app.status}</span>
                  </div>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                    app.reviewStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    app.reviewStatus === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                    'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {app.reviewStatus}
                  </span>
                </div>

                <p className="text-[11px] text-text-secondary leading-relaxed italic">"{app.reason}"</p>

                {app.reviewStatus === 'Pending' && (
                  <div className="flex gap-2 pt-1 border-t border-border/50">
                    <button 
                      onClick={() => handleApproveAppeal(app.id)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleRejectAppeal(app.id)}
                      className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
            {appeals.length === 0 && (
              <p className="text-xs text-text-secondary italic text-center py-12">No correction requests submitted.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
