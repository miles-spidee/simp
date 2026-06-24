"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, Plus, Clock, FileText, CheckCircle2, User, Eye, XCircle, AlertCircle } from 'lucide-react';
import { attendanceService } from '@/src/services/attendance.service';
import { AttendanceSession, AttendanceRecord } from '@/src/data/mock-attendance';

export default function AttendanceManagementPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'sessions'>('dashboard');
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await attendanceService.getSessions();
    setSessions(data);
  };

  const handleCreateSession = async () => {
    const batchId = prompt("Enter Batch ID:");
    if (batchId) {
      await attendanceService.createSession(batchId, 'current-emp', new Date().toISOString().split('T')[0]);
      loadData();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Attendance</h1>
          <p className="text-sm text-slate-500 mt-1">Manage batch attendance sessions</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'dashboard' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveView('sessions')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'sessions' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Sessions
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeView === 'dashboard' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-500 mb-1">Attendance %</p>
                <h3 className="text-3xl font-black text-slate-900">88%</h3>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-500 mb-1">Present</p>
                <h3 className="text-3xl font-black text-emerald-600">145</h3>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-500 mb-1">Absent</p>
                <h3 className="text-3xl font-black text-red-600">12</h3>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-500 mb-1">Late</p>
                <h3 className="text-3xl font-black text-amber-600">8</h3>
              </div>
            </div>
          </div>
        )}

        {activeView === 'sessions' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm max-w-7xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search sessions..."
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
              <button onClick={handleCreateSession} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm">
                <Plus className="h-4 w-4" /> Create Session
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Session ID</th>
                    <th className="px-6 py-3">Batch ID</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessions.filter(s => s.batchId.includes(searchTerm)).map(s => (
                    <tr key={s.id} className="hover:bg-blue-50/50 cursor-pointer transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{s.id}</td>
                      <td className="px-6 py-4 text-slate-600">{s.batchId}</td>
                      <td className="px-6 py-4 text-slate-600">{s.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${s.status === 'Open' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-600 hover:underline">Mark Attendance</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
