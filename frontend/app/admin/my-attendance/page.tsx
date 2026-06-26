"use client";

import React, { useEffect, useState } from 'react';
import { 
  ChevronRight, Calendar, UserCheck, Clock, AlertTriangle, 
  CheckCircle2, Compass, Play, ShieldCheck, MapPin
} from 'lucide-react';
import { attendanceService } from '@/src/services/attendance.service';
import { AttendanceLog, AttendanceStatus } from '@/src/data/mock-attendance';

export default function MyAttendancePage() {
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  const [status, setStatus] = useState<AttendanceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simulated checkin states
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [logsData, statusData] = await Promise.all([
          attendanceService.getAttendanceLogs(),
          attendanceService.getAttendanceStatus()
        ]);
        setAttendanceLogs(logsData);
        setStatus(statusData);
        setIsCheckedIn(statusData.isCheckedIn);
        setClockInTime(statusData.clockInTime);
      } catch (err) {
        console.error('Failed to load attendance data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
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
    
    // Add log optimistically
    const newLog: AttendanceLog = {
      id: `att-${Date.now().toString().slice(-3)}`,
      studentId: 'stu-1',
      date: new Date().toISOString().split('T')[0],
      clockIn: timeNow,
      clockOut: '-',
      duration: 'Ongoing',
      status: 'Present'
    };
    setAttendanceLogs(prev => [newLog, ...prev]);

    if (status) {
      setStatus({
        ...status,
        isCheckedIn: true,
        clockInTime: timeNow,
        presentDays: status.presentDays + 1
      });
    }
  };

  const handleCheckOut = () => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsCheckedIn(false);
    setClockOutTime(timeNow);
    triggerToast(`Checked out successfully at ${timeNow}. Session closed.`);

    // Update first log optimistically
    setAttendanceLogs(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        clockOut: timeNow,
        duration: '8h 0m'
      };
      return updated;
    });

    if (status) {
      setStatus({
        ...status,
        isCheckedIn: false,
        clockInTime: null
      });
    }
  };

  if (loading || !status) {
    return (
      <div className="flex h-64 items-center justify-center">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6 font-medium flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        TODO: Waiting for backend endpoint
      </div>

        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  const { presentDays, absentDays, leaveDays, averageAttendance } = status;

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
            <span>Student Hub</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold text-[10px]">My Attendance</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">My Attendance & Logs</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Check-in to daily sessions, track active logging status, review monthly calendar sheets, and verify academic metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live checkin card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-sm">
              GPS GEOLOCATION
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-3.5">Student Check-In Gate</h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">
              Clock-in to log present status for your assigned cohort daily class. Keep checkin duration window above 8 hours.
            </p>
          </div>

          <div className="py-4 border-y border-slate-100 space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Today's Date:</span>
              <span className="text-slate-700 font-bold">{new Date().toISOString().split('T')[0]}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Checked-In Time:</span>
              <span className="text-slate-700 font-bold">{clockInTime || 'Not checked in'}</span>
            </div>
            {clockOutTime && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">Checked-Out Time:</span>
                <span className="text-slate-700 font-bold">{clockOutTime}</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Sign-in Status:</span>
              {isCheckedIn ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Session Active</span>
                </span>
              ) : (
                <span className="text-slate-455 font-bold">Checked Out</span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {isCheckedIn ? (
              <button
                onClick={handleCheckOut}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center"
              >
                Check Out Session
              </button>
            ) : (
              <button
                onClick={handleCheckIn}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Check In Daily</span>
              </button>
            )}
          </div>
        </div>

        {/* Circular Compliance Meter */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm space-y-6">
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
            Graduation Compliance Meter
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            <div className="relative h-28 w-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" strokeWidth="8" stroke="#f1f5f9" fill="transparent" />
                <circle cx="56" cy="56" r="46" strokeWidth="8" stroke="#2563eb" fill="transparent" strokeDasharray="289" strokeDashoffset={289 * (1 - (averageAttendance / 100))} />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-black text-slate-800">{averageAttendance}%</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase">Present Rate</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-blue-600 rounded" />
                <span className="text-slate-500"><strong className="text-slate-800">{presentDays}</strong> Present Days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-rose-500 rounded" />
                <span className="text-slate-500"><strong className="text-slate-800">{absentDays}</strong> Absent Days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-slate-350 rounded" />
                <span className="text-slate-500"><strong className="text-slate-800">{leaveDays}</strong> Leaves Mapped</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 border border-slate-100 rounded-xl text-[10px] text-slate-550 leading-relaxed">
            💡 Minimum threshold to complete guide evaluations is <strong>85%</strong>.
          </div>
        </div>

        {/* June 2026 Interactive Calendar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm h-fit">
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
            June 2026 Monthly Sheet
          </h3>
          
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1;
              let bg = 'bg-slate-50 border border-slate-100 rounded text-slate-400';
              if (day <= 15) {
                if (day === 7 || day === 14) bg = 'bg-slate-100/50 border border-slate-200/60 rounded text-slate-400';
                else if (day === 8) bg = 'bg-rose-50 text-rose-600 border border-rose-100 rounded font-bold';
                else bg = 'bg-emerald-50 text-emerald-600 border border-emerald-100 rounded font-bold';
              } else if (day === 16) {
                bg = isCheckedIn ? 'bg-blue-600 text-white font-bold rounded shadow-sm' : 'bg-blue-50 border border-blue-300 text-blue-600 animate-pulse rounded font-bold';
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

      {/* Historical logs table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
          Historical Check-In Signatures
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest font-bold">
                <th className="py-2.5 px-4 font-semibold">Session Date</th>
                <th className="py-2.5 px-4">Checked In</th>
                <th className="py-2.5 px-4">Checked Out</th>
                <th className="py-2.5 px-4">Log Hours</th>
                <th className="py-2.5 px-4 text-right">Register Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-655 select-text">
              {attendanceLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-800">{log.date}</td>
                  <td className="py-3 px-4">{log.clockIn}</td>
                  <td className="py-3 px-4">{log.clockOut}</td>
                  <td className="py-3 px-4">{log.duration}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-block border font-bold px-2 py-0.5 rounded-sm ${
                      log.status === 'Present' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : 'bg-rose-50 border-rose-100 text-rose-600'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
