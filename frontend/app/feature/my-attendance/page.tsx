"use client";

import React, { useEffect, useState } from 'react';
import { 
  ChevronRight, Calendar, UserCheck, Clock, AlertTriangle, 
  CheckCircle2, MapPin, FileText, Send, ArrowRight, ShieldCheck, CalendarDays
} from 'lucide-react';
import { leaveService } from '../../../src/services/leave.service';
import { LeaveRequest } from '../../../src/types/leave.types';
import { EnhancedTable } from '@/components/feature/ui/Table';

interface AttendanceLog {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string;
  duration: string;
  status: 'Present' | 'Absent' | 'Late';
}

interface LocalAppeal {
  id: string;
  studentId: string;
  studentName: string;
  batchId: string;
  batchName: string;
  date: string;
  oldStatus: 'Absent' | 'Late';
  newStatus: 'Present';
  reason: string;
  attachment: string;
  status: string;
  reviewStatus?: 'Pending' | 'Approved' | 'Rejected';
}

export default function MyAttendancePage() {

  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  const [complianceRate, setComplianceRate] = useState(88);
  const [presentDays, setPresentDays] = useState(15);
  const [absentDays, setAbsentDays] = useState(2);
  const [lateDays, setLateDays] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simulated checkin states
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);

  // Appeal form states
  const [appealDate, setAppealDate] = useState('2026-06-08');
  const [appealReason, setAppealReason] = useState('');
  const [appealStatus, setAppealStatus] = useState<'Absent' | 'Late'>('Absent');
  const [appealFile, setAppealFile] = useState<string>('');
  const [myAppeals, setMyAppeals] = useState<LocalAppeal[]>([]);

  // Leave form states
  const [leaveType, setLeaveType] = useState<'Medical' | 'Casual' | 'Emergency' | 'OD' | 'WFH'>('Casual');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [myLeaves, setMyLeaves] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    // Load initial logs
    const initialLogs: AttendanceLog[] = [
      { id: 'att-1', date: '2026-06-15', clockIn: '08:55 AM', clockOut: '05:05 PM', duration: '8h 10m', status: 'Present' },
      { id: 'att-2', date: '2026-06-12', clockIn: '08:50 AM', clockOut: '05:15 PM', duration: '8h 25m', status: 'Present' },
      { id: 'att-3', date: '2026-06-11', clockIn: '08:58 AM', clockOut: '05:10 PM', duration: '8h 12m', status: 'Present' },
      { id: 'att-4', date: '2026-06-10', clockIn: '09:00 AM', clockOut: '05:00 PM', duration: '8h 00m', status: 'Present' },
      { id: 'att-5', date: '2026-06-09', clockIn: '09:30 AM', clockOut: '05:05 PM', duration: '7h 35m', status: 'Late' },
      { id: 'att-6', date: '2026-06-08', clockIn: '-', clockOut: '-', duration: '-', status: 'Absent' },
    ];
    setAttendanceLogs(initialLogs);

    // Sync appeals from local storage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pinesphere_attendance_appeals');
      if (stored) {
        const parsed = JSON.parse(stored);
        setMyAppeals(parsed.filter((a: LocalAppeal) => a.studentId === 'stu-12')); // filter for student Ananya Desai
      }
    }

    const fetchLeaves = async () => {
      const all = await leaveService.getAllLeaves();
      setMyLeaves(all.filter(l => l.userId === 'user-1')); // mock user ID for current user
    };
    fetchLeaves();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCheckIn = () => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsCheckedIn(true);
    setClockInTime(timeNow);
    setClockOutTime(null);
    triggerToast(`Checked in successfully at ${timeNow}. Session active.`);

    const todayDate = new Date().toISOString().split('T')[0];
    const newLog: AttendanceLog = {
      id: `att-${Date.now().toString().slice(-3)}`,
      date: todayDate,
      clockIn: timeNow,
      clockOut: '-',
      duration: 'Ongoing',
      status: 'Present'
    };
    setAttendanceLogs(prev => [newLog, ...prev]);
    setPresentDays(prev => prev + 1);
  };

  const handleCheckOut = () => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsCheckedIn(false);
    setClockOutTime(timeNow);
    triggerToast(`Checked out successfully at ${timeNow}. Session closed.`);

    setAttendanceLogs(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        clockOut: timeNow,
        duration: '8h 00m'
      };
      return updated;
    });
  };

  const handleSimulateAttachment = () => {
    const mockFileNames = ['internet_isp_outage.pdf', 'doctor_note_june8.pdf', 'travel_train_delay.png'];
    const randFile = mockFileNames[Math.floor(Math.random() * mockFileNames.length)];
    setAppealFile(randFile);
    triggerToast(`Attached simulated file: ${randFile}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAppealFile(file.name);
      triggerToast(`Attached file: ${file.name}`);
    }
  };

  const handleSubmitAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealReason) {
      triggerToast("Please provide a reason for the appeal.");
      return;
    }
    if (!appealFile) {
      triggerToast("Please attach a verification document/screenshot.");
      return;
    }

    const newAppeal: LocalAppeal = {
      id: `app-custom-${Date.now().toString().slice(-4)}`,
      studentId: 'stu-12',
      studentName: 'Ananya Desai',
      batchId: 'batch-ai-2026',
      batchName: 'AI Batch 2026',
      date: appealDate,
      oldStatus: appealStatus,
      newStatus: 'Present',
      reason: appealReason,
      attachment: appealFile,
      status: appealStatus, // old status for the review list
      reviewStatus: 'Pending' // review status for the review list
    };

    // Save to localStorage
    if (typeof window !== 'undefined') {
      const existingStr = localStorage.getItem('pinesphere_attendance_appeals') || '[]';
      const existing = JSON.parse(existingStr);
      const updatedAppeals = [newAppeal, ...existing];
      localStorage.setItem('pinesphere_attendance_appeals', JSON.stringify(updatedAppeals));
      setMyAppeals(updatedAppeals.filter((a: LocalAppeal) => a.studentId === 'stu-12'));
    }

    triggerToast("Correction appeal submitted to mentor dashboard!");
    setAppealReason('');
    setAppealFile('');
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveStartDate || !leaveEndDate || !leaveReason) {
      triggerToast("Please fill all required leave fields.");
      return;
    }
    const newLeave = await leaveService.applyLeave({
      userId: 'user-1',
      userName: 'Ananya Desai',
      role: 'Student',
      leaveType,
      startDate: new Date(leaveStartDate).toISOString(),
      endDate: new Date(leaveEndDate).toISOString(),
      reason: leaveReason,
      status: 'Pending',
      appliedOn: new Date().toISOString(),
    });
    setMyLeaves(prev => [newLeave, ...prev]);
    triggerToast("Leave application submitted successfully!");
    setLeaveReason('');
    setLeaveStartDate('');
    setLeaveEndDate('');
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
            <span>Student Hub</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold text-[10px]">My Attendance</span>
          </div>
          <h2 className="text-2xl font-black text-text-primary mt-2 tracking-tight">My Attendance Portal</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Check-in daily, review attendance compliance statistics, and appeal incorrect records.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live checkin card */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[9px] font-bold text-blue-650 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-sm uppercase tracking-widest">
              GPS GEOLOCATION GATEWAY
            </span>
            <h3 className="text-base font-black text-slate-850 mt-3.5">Clock-in Roster</h3>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              Record present status for your cohort class today. Ensure active connectivity.
            </p>
          </div>

          <div className="py-4 border-y border-border space-y-2.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">Date:</span>
              <span className="text-text-primary">{new Date().toISOString().split('T')[0]}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">Checked-In:</span>
              <span className="text-text-primary">{clockInTime || 'Not checked in'}</span>
            </div>
            {clockOutTime && (
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-text-secondary">Checked-Out:</span>
                <span className="text-text-primary">{clockOutTime}</span>
              </div>
            )}
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">Status:</span>
              {isCheckedIn ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Session Active</span>
                </span>
              ) : (
                <span className="text-text-secondary font-bold">Checked Out</span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {isCheckedIn ? (
              <button
                onClick={handleCheckOut}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center shadow-lg shadow-rose-500/10"
              >
                Check Out Session
              </button>
            ) : (
              <button
                onClick={handleCheckIn}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Check In Daily</span>
              </button>
            )}
          </div>
        </div>

        {/* Circular Compliance Meter */}
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col justify-between shadow-sm space-y-6">
          <h3 className="font-bold text-xs text-text-secondary uppercase tracking-widest border-b border-border pb-3">
            Graduation Compliance Meter
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            <div className="relative h-28 w-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" strokeWidth="8" stroke="#f1f5f9" fill="transparent" />
                <circle cx="56" cy="56" r="46" strokeWidth="8" stroke="#2563eb" fill="transparent" strokeDasharray="289" strokeDashoffset={289 * (1 - (complianceRate / 100))} />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-black text-text-primary">{complianceRate}%</span>
                <span className="text-[8px] text-text-secondary font-bold uppercase">Present Rate</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-blue-600 rounded" />
                <span className="text-text-secondary"><strong className="text-text-primary">{presentDays}</strong> Present Days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-rose-500 rounded" />
                <span className="text-text-secondary"><strong className="text-text-primary">{absentDays}</strong> Absent Days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-amber-500 rounded" />
                <span className="text-text-secondary"><strong className="text-text-primary">{lateDays}</strong> Late Days</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 border border-slate-150 rounded-xl text-[10px] text-text-secondary leading-relaxed">
            💡 Minimum threshold to complete academic internship programs is <strong>85%</strong>.
          </div>
        </div>

        {/* June 2026 Interactive Calendar */}
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4 shadow-sm h-fit">
          <h3 className="font-bold text-xs text-text-secondary uppercase tracking-widest border-b border-border pb-3">
            June 2026 Monthly Sheet
          </h3>
          
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1;
              let bg = 'bg-slate-50 border border-border rounded text-text-secondary';
              if (day <= 15) {
                if (day === 7 || day === 14) bg = 'bg-slate-100/50 border border-border/60 rounded text-text-secondary';
                else if (day === 8) bg = 'bg-rose-50 text-rose-600 border border-rose-100 rounded font-bold';
                else if (day === 9) bg = 'bg-amber-50 text-amber-600 border border-amber-100 rounded font-bold';
                else bg = 'bg-emerald-50 text-emerald-600 border border-emerald-100 rounded font-bold';
              } else if (day === 16) {
                bg = isCheckedIn ? 'bg-blue-600 text-white font-bold rounded shadow-sm animate-pulse' : 'bg-blue-50 border border-blue-300 text-blue-600 rounded font-bold';
              }
              return (
                <div key={day} className={`h-8 flex items-center justify-center text-xs font-semibold ${bg}`}>
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Appeal Form and Appeals Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Raise Appeal */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-xs text-text-secondary uppercase tracking-widest border-b border-border pb-3 flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-indigo-500" />
            <span>Raise Attendance Correction Appeal</span>
          </h3>

          <form onSubmit={handleSubmitAppeal} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1.5">Select Date</label>
                <input 
                  type="date"
                  value={appealDate}
                  onChange={(e) => setAppealDate(e.target.value)}
                  className="w-full bg-slate-50 border border-border rounded-xl px-3.5 py-2 text-xs text-text-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Registered Status</label>
                <select 
                  value={appealStatus} 
                  onChange={(e) => setAppealStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-border rounded-xl px-3.5 py-2 text-xs text-text-primary outline-none cursor-pointer"
                >
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Reason for correction</label>
              <textarea 
                rows={3}
                required
                value={appealReason}
                onChange={(e) => setAppealReason(e.target.value)}
                placeholder="Explain the correction context (e.g. ISP failure, medical letter advance notice, etc.)"
                className="w-full bg-slate-50 border border-border rounded-xl px-3.5 py-2.5 text-xs text-text-primary outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Attachment Evidence</label>
              <input 
                type="file" 
                id="appeal-file-upload" 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <div 
                onClick={() => document.getElementById('appeal-file-upload')?.click()}
                className="border-2 border-dashed border-border hover:border-secondary rounded-xl p-4 bg-slate-50/50 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
              >
                <FileText className="h-6 w-6 text-text-secondary mb-1" />
                <span className="text-[10px] font-bold text-text-secondary">Upload Document Evidence</span>
                <span className="text-[8px] text-text-secondary font-semibold mt-0.5">Click to browse and attach certificate/letter</span>
                {appealFile && (
                  <span className="mt-2 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded">
                    📎 {appealFile}
                  </span>
                )}
              </div>
              <div className="flex justify-end mt-1.5">
                <button 
                  type="button" 
                  onClick={handleSimulateAttachment} 
                  className="text-[9px] text-indigo-600 hover:underline font-bold"
                >
                  Simulate Attachment Instead
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5"
            >
              <Send className="h-3 w-3" /> Submit Correction Appeal
            </button>
          </form>
        </div>

        {/* Appeal History */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-xs text-slate-455 uppercase tracking-widest border-b border-border pb-3">
            My Correction Log
          </h3>

          <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1 custom-scrollbar">
            {myAppeals.map(a => (
              <div key={a.id} className="p-4 border border-border rounded-xl space-y-2 hover:border-secondary transition-all bg-slate-50/20">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-text-secondary">Date: {a.date}</span>
                  <span className={`font-extrabold uppercase px-2 py-0.5 rounded border text-[9px] ${
                    (a.reviewStatus || a.status) === 'Pending' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                    (a.reviewStatus || a.status) === 'Approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                    'bg-rose-50 border-rose-100 text-rose-600'
                  }`}>
                    {a.reviewStatus || a.status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-text-primary leading-snug">
                  Appeal: <span className="bg-rose-50 border border-rose-100 text-rose-600 font-extrabold px-1 rounded text-[9px]">{a.oldStatus}</span> → <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 font-extrabold px-1 rounded text-[9px]">{a.newStatus}</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-snug">"{a.reason}"</p>
                <div className="text-[9px] font-bold text-text-secondary flex items-center gap-1">
                  📎 File: <span className="text-indigo-600">{a.attachment}</span>
                </div>
              </div>
            ))}
            {myAppeals.length === 0 && (
              <p className="text-xs text-text-secondary italic text-center py-12">No correction appeals submitted yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Leave Application Form and Leave History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Apply for Leave */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-xs text-text-secondary uppercase tracking-widest border-b border-border pb-3 flex items-center gap-2">
            <CalendarDays className="h-4.5 w-4.5 text-blue-500" />
            <span>Apply for Leave</span>
          </h3>

          <form onSubmit={handleApplyLeave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1.5">Start Date</label>
                <input 
                  type="date"
                  required
                  value={leaveStartDate}
                  onChange={(e) => setLeaveStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-border rounded-xl px-3.5 py-2 text-xs text-text-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1.5">End Date</label>
                <input 
                  type="date"
                  required
                  value={leaveEndDate}
                  onChange={(e) => setLeaveEndDate(e.target.value)}
                  className="w-full bg-slate-50 border border-border rounded-xl px-3.5 py-2 text-xs text-text-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Leave Type</label>
              <select 
                value={leaveType} 
                onChange={(e) => setLeaveType(e.target.value as any)}
                className="w-full bg-slate-50 border border-border rounded-xl px-3.5 py-2 text-xs text-text-primary outline-none cursor-pointer"
              >
                <option value="Casual">Casual Leave</option>
                <option value="Medical">Medical Leave</option>
                <option value="Emergency">Emergency Leave</option>
                <option value="OD">On Duty (OD)</option>
                <option value="WFH">Work from Home (WFH)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Reason for leave</label>
              <textarea 
                rows={3}
                required
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="Explain why you are applying for leave..."
                className="w-full bg-slate-50 border border-border rounded-xl px-3.5 py-2.5 text-xs text-text-primary outline-none resize-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-slate-900/10 flex items-center justify-center gap-1.5"
            >
              <FileText className="h-3 w-3" /> Submit Leave Request
            </button>
          </form>
        </div>

        {/* My Leave History */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-xs text-slate-455 uppercase tracking-widest border-b border-border pb-3">
            My Leave History
          </h3>

          <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1 custom-scrollbar">
            {myLeaves.map(l => (
              <div key={l.id} className="p-4 border border-border rounded-xl space-y-2 hover:border-secondary transition-all bg-slate-50/20">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-text-secondary">Date: {l.startDate.split('T')[0]} to {l.endDate.split('T')[0]}</span>
                  <span className={`font-extrabold uppercase px-2 py-0.5 rounded border text-[9px] ${
                    l.status === 'Pending' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                    l.status === 'Approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                    'bg-rose-50 border-rose-100 text-rose-600'
                  }`}>
                    {l.status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-text-primary leading-snug flex items-center justify-between">
                  <span>Type: <span className="bg-blue-50 border border-blue-100 text-blue-600 font-extrabold px-1 rounded text-[9px]">{l.leaveType}</span></span>
                </div>
                <p className="text-[11px] text-text-secondary leading-snug">"{l.reason}"</p>
              </div>
            ))}
            {myLeaves.length === 0 && (
              <p className="text-xs text-text-secondary italic text-center py-12">No leaves applied yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Historical logs table */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-xs text-text-secondary uppercase tracking-widest border-b border-border pb-3">
          Historical Check-In Signatures
        </h3>
        <EnhancedTable
          data={attendanceLogs}
          columns={[
            { key: 'date', label: 'Session Date' },
            { key: 'clockIn', label: 'Checked In' },
            { key: 'clockOut', label: 'Checked Out' },
            { key: 'duration', label: 'Log Hours' },
            { key: 'status', label: 'Register Status', render: (log: AttendanceLog) => (
              <span className={`inline-block border font-bold px-2 py-0.5 rounded-sm ${
                log.status === 'Present' 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                log.status === 'Absent'
                  ? 'bg-rose-50 border-rose-100 text-rose-600'
                  : 'bg-amber-50 border-amber-100 text-amber-600'
              }`}>
                {log.status}
              </span>
            )},
          ]}
          searchPlaceholder="Search logs..."
          itemsPerPage={10}
          emptyMessage="No attendance logs found."
        />
      </div>
    </div>
  );
}
