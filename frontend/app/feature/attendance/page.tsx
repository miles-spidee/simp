"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar, CheckSquare, Clock, AlertTriangle, ChevronRight, TrendingUp, BarChart2, CheckCircle2
} from 'lucide-react';

interface StudentRosterItem {
  id: string;
  name: string;
  avatar: string;
  attendanceRate: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  logs: Record<number, 'Present' | 'Absent' | 'Late'>;
  checkIn: string;
  checkOut: string;
  duration: string;
}

interface BatchAttendance {
  id: string;
  name: string;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  rate: number;
  students: StudentRosterItem[];
}

const INITIAL_BATCHES: BatchAttendance[] = [
  {
    id: 'batch-ai-2026',
    name: 'AI Batch 2026',
    presentCount: 42,
    absentCount: 3,
    lateCount: 2,
    rate: 89,
    students: [
      {
        id: 'stu-harini',
        name: 'Harini Sundar',
        avatar: 'HS',
        attendanceRate: 95,
        presentDays: 20,
        absentDays: 1,
        lateDays: 1,
        logs: {
          1: 'Present', 2: 'Present', 3: 'Present', 4: 'Present', 5: 'Present',
          6: 'Late', 7: 'Present', 8: 'Present', 9: 'Present', 10: 'Absent',
          11: 'Present', 12: 'Present', 13: 'Present', 14: 'Present', 15: 'Present',
          16: 'Present', 17: 'Present', 18: 'Present', 19: 'Present', 20: 'Present'
        },
        checkIn: '08:52 AM',
        checkOut: '05:30 PM',
        duration: '8h 38m'
      },
      {
        id: 'stu-arun',
        name: 'Arun Kumar',
        avatar: 'AK',
        attendanceRate: 90,
        presentDays: 18,
        absentDays: 2,
        lateDays: 2,
        logs: {
          1: 'Present', 2: 'Present', 3: 'Late', 4: 'Present', 5: 'Present',
          6: 'Present', 7: 'Present', 8: 'Absent', 9: 'Present', 10: 'Present',
          11: 'Present', 12: 'Late', 13: 'Present', 14: 'Present', 15: 'Present',
          16: 'Present', 17: 'Present', 18: 'Absent', 19: 'Present', 20: 'Present'
        },
        checkIn: '09:05 AM',
        checkOut: '05:42 PM',
        duration: '8h 37m'
      },
      {
        id: 'stu-rahul',
        name: 'Rahul Sen',
        avatar: 'RS',
        attendanceRate: 85,
        presentDays: 17,
        absentDays: 3,
        lateDays: 2,
        logs: {
          1: 'Present', 2: 'Present', 3: 'Present', 4: 'Absent', 5: 'Present',
          6: 'Late', 7: 'Present', 8: 'Present', 9: 'Present', 10: 'Absent',
          11: 'Present', 12: 'Present', 13: 'Present', 14: 'Present', 15: 'Present',
          16: 'Late', 17: 'Present', 18: 'Present', 19: 'Absent', 20: 'Present'
        },
        checkIn: '08:48 AM',
        checkOut: '05:15 PM',
        duration: '8h 27m'
      },
      {
        id: 'stu-priya',
        name: 'Priya Sharma',
        avatar: 'PS',
        attendanceRate: 98,
        presentDays: 21,
        absentDays: 0,
        lateDays: 1,
        logs: {
          1: 'Present', 2: 'Present', 3: 'Present', 4: 'Present', 5: 'Present',
          6: 'Present', 7: 'Present', 8: 'Present', 9: 'Present', 10: 'Present',
          11: 'Present', 12: 'Present', 13: 'Present', 14: 'Present', 15: 'Present',
          16: 'Present', 17: 'Late', 18: 'Present', 19: 'Present', 20: 'Present'
        },
        checkIn: '08:50 AM',
        checkOut: '05:32 PM',
        duration: '8h 42m'
      }
    ]
  }
];

export default function AttendanceDashboardPage() {
  const [batches, setBatches] = useState<BatchAttendance[]>(INITIAL_BATCHES);
  
  // Drill-down states
  const [selectedBatch, setSelectedBatch] = useState<BatchAttendance | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentRosterItem | null>(null);

  // Sync state corrections from approved appeals or mark daily locks
  useEffect(() => {
    const syncAttendanceData = () => {
      if (typeof window !== 'undefined') {
        const storedAppeals = localStorage.getItem('pinesphere_attendance_appeals');
        if (storedAppeals) {
          const parsedAppeals = JSON.parse(storedAppeals);
          const approved = parsedAppeals.filter((a: any) => a.reviewStatus === 'Approved');
          
          if (approved.length > 0) {
            setBatches(prev => prev.map(b => {
              const updatedStudents = b.students.map(s => {
                const studentAppeals = approved.filter((a: any) => a.studentId === s.id);
                if (studentAppeals.length > 0) {
                  const newLogs = { ...s.logs };
                  studentAppeals.forEach((app: any) => {
                    const dayNum = parseInt(app.date.split('-')[2]);
                    if (!isNaN(dayNum)) {
                      newLogs[dayNum] = app.status as any;
                    }
                  });
                  
                  // Recalculate stats
                  const logVals = Object.values(newLogs);
                  const pres = logVals.filter(x => x === 'Present').length;
                  const abs = logVals.filter(x => x === 'Absent').length;
                  const lat = logVals.filter(x => x === 'Late').length;
                  const rate = Math.round((pres / logVals.length) * 100);

                  return {
                    ...s,
                    logs: newLogs,
                    presentDays: pres,
                    absentDays: abs,
                    lateDays: lat,
                    attendanceRate: rate
                  };
                }
                return s;
              });

              return {
                ...b,
                students: updatedStudents
              };
            }));
          }
        }
      }
    };

    syncAttendanceData();
    window.addEventListener('storage', syncAttendanceData);
    return () => window.removeEventListener('storage', syncAttendanceData);
  }, []);

  // Recalculate top statistics
  const totalStudentsMarked = batches.reduce((sum, b) => sum + b.students.length, 0);
  const averageRate = Math.round(batches.reduce((sum, b) => sum + b.rate, 0) / batches.length);
  const totalAbsentCount = batches.reduce((sum, b) => sum + b.absentCount, 0);
  const totalLateCount = batches.reduce((sum, b) => sum + b.lateCount, 0);

  return (
    <div className="space-y-6 animate-slide-in select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-text-primary tracking-tight">Attendance Dashboard</h2>
          <p className="text-sm text-text-secondary mt-1">Track compliance analytics, view daily check-in lists, and audit student calendar timeline logs.</p>
        </div>
      </div>

      {!selectedBatch ? (
        <>
          {/* Metrics Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Total Attendance %</span>
              <h3 className="text-3xl font-black text-indigo-650 mt-1">{averageRate}%</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Today's Attendance</span>
              <h3 className="text-3xl font-black text-emerald-600 mt-1">{totalStudentsMarked} / {totalStudentsMarked}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Absent Candidates</span>
              <h3 className="text-3xl font-black text-rose-600 mt-1">{totalAbsentCount}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Late Arrivals</span>
              <h3 className="text-3xl font-black text-amber-600 mt-1">{totalLateCount}</h3>
            </div>
          </div>

          {/* Batch View Cards */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs text-text-secondary uppercase tracking-widest">Cohort Compliance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {batches.map(b => (
                <div 
                  key={b.id} 
                  onClick={() => setSelectedBatch(b)}
                  className="bg-white p-6 rounded-2xl border border-border hover:border-secondary hover:shadow-lg transition-all duration-300 cursor-pointer shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold text-text-secondary uppercase">COHORT</span>
                      <h4 className="text-lg font-black text-text-primary mt-1">{b.name}</h4>
                    </div>
                    <span className="bg-indigo-50 border border-indigo-100 text-indigo-650 font-black px-3 py-1 rounded-full text-xs">
                      {b.rate}% Rate
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-[10px] font-bold text-text-secondary">
                    <span className="text-emerald-650">Present: {b.presentCount}</span>
                    <span className="text-rose-650">Absent: {b.absentCount}</span>
                    <span className="text-amber-650">Late: {b.lateCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Drill-down Roster list and Timeline logs */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left/Middle Column: Students list under this batch */}
          <div className="lg:col-span-1 bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b pb-3">
              <button 
                onClick={() => { setSelectedBatch(null); setSelectedStudent(null); }}
                className="text-[10px] font-bold text-indigo-650 hover:underline block"
              >
                ← Back to Batches
              </button>
              <h3 className="text-sm font-black text-text-primary mt-1">{selectedBatch.name} Candidate Roster</h3>
            </div>

            <div className="space-y-2">
              {selectedBatch.students.map(s => (
                <div 
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className={`p-3.5 border rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    selectedStudent?.id === s.id 
                      ? 'bg-slate-900 border-slate-850 text-white shadow-md' 
                      : 'bg-slate-50 border-slate-150 hover:border-secondary text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 bg-indigo-650 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                      {s.avatar}
                    </div>
                    <div className="truncate">
                      <span className="block font-bold text-xs truncate">{s.name}</span>
                      <span className="block text-[9px] opacity-75">{s.id}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black shrink-0 ${
                    s.attendanceRate >= 90 ? 'text-emerald-500' : 'text-amber-500'
                  }`}>
                    {s.attendanceRate}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Individual Student Timeline Sheet */}
          <div className="lg:col-span-2 space-y-6">
            {selectedStudent ? (
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
                
                {/* Profile detail */}
                <div className="border-b pb-4 flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded uppercase tracking-wide">
                      CANDIDATE LOG SHEET
                    </span>
                    <h3 className="text-lg font-black text-text-primary mt-2">{selectedStudent.name}</h3>
                    <p className="text-xs text-text-secondary">Graduation compliance status: <strong className="text-emerald-650">{selectedStudent.attendanceRate}% Attendance Rate</strong></p>
                  </div>
                </div>

                {/* Statistics Box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-center">
                    <span className="block text-sm font-black text-text-primary">{selectedStudent.checkIn}</span>
                    <span className="text-[9px] font-bold text-text-secondary uppercase">Check-In</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-center">
                    <span className="block text-sm font-black text-text-primary">{selectedStudent.checkOut}</span>
                    <span className="text-[9px] font-bold text-text-secondary uppercase">Check-Out</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-center">
                    <span className="block text-sm font-black text-text-primary">{selectedStudent.duration}</span>
                    <span className="text-[9px] font-bold text-text-secondary uppercase">Avg Duration</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-center">
                    <span className="block text-sm font-black text-text-primary">{selectedStudent.presentDays} Days</span>
                    <span className="text-[9px] font-bold text-text-secondary uppercase">Present</span>
                  </div>
                </div>

                {/* Calendar Log grid */}
                <div className="space-y-3.5">
                  <h4 className="font-bold text-xs text-slate-455 uppercase tracking-widest">June 2026 Logs Timeline</h4>
                  <div className="grid grid-cols-5 sm:grid-cols-7 gap-2.5">
                    {Array.from({ length: 30 }).map((_, idx) => {
                      const day = idx + 1;
                      const log = selectedStudent.logs[day];

                      return (
                        <div 
                          key={day} 
                          className={`p-2.5 rounded-xl border flex flex-col justify-between min-h-[52px] ${
                            log === 'Present' ? 'bg-emerald-50 border-emerald-150 text-emerald-850' :
                            log === 'Absent' ? 'bg-rose-50 border-rose-150 text-rose-850' :
                            log === 'Late' ? 'bg-amber-50 border-amber-150 text-amber-850' :
                            'bg-slate-50 border-slate-150 text-text-secondary'
                          }`}
                        >
                          <span className="text-[9px] font-extrabold">{day}</span>
                          <span className="text-[8px] font-black uppercase tracking-wider block mt-2 text-right">
                            {log === 'Present' ? '✓' : log === 'Absent' ? '✗' : log === 'Late' ? '🟡' : '-'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white border border-border rounded-2xl p-16 text-center text-text-secondary italic shadow-sm">
                Select a candidate profile from the left list to review detailed check-in timestamps and calendar compliance histories.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
