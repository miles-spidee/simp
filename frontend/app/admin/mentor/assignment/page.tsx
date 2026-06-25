"use client";

import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, Users, UserCheck } from 'lucide-react';
import { mentorService } from '@/src/services/mentor.service';
import { MentorAssignment } from '@/src/data/mock-mentor-assignments';
import { MentorProfile } from '@/src/data/mock-mentors';

export default function MentorAssignmentPage() {
  const [assignments, setAssignments] = useState<MentorAssignment[]>([]);
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([mentorService.getAssignments(), mentorService.getMentorProfiles()]).then(([a, m]) => {
      setAssignments(a);
      setMentors(m);
      setLoading(false);
    });
  }, []);

  const filtered = assignments.filter(a => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      a.studentName.toLowerCase().includes(q) ||
      a.mentorName.toLowerCase().includes(q) ||
      a.internId.toLowerCase().includes(q) ||
      a.batchName.toLowerCase().includes(q);
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeCount = assignments.filter(a => a.status === 'Active').length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Mentor Assignment</h1>
          <p className="text-sm text-slate-500 mt-1">HR assigns mentors to students within cohort batches.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> Assign Mentor
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Total Assignments</p>
              <p className="text-2xl font-black text-slate-900">{assignments.length}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Active</p>
              <p className="text-2xl font-black text-slate-900">{activeCount}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Mentors Involved</p>
              <p className="text-2xl font-black text-slate-900">{new Set(assignments.map(a => a.mentorProfileId)).size}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3 bg-slate-50/50">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student, mentor, batch..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Transferred">Transferred</option>
            </select>
            <button className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">
              <Filter className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Intern ID</th>
                  <th className="px-6 py-3">Mentor</th>
                  <th className="px-6 py-3">Batch</th>
                  <th className="px-6 py-3">Assigned Date</th>
                  <th className="px-6 py-3">Assigned By</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{a.studentName}</td>
                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">{a.internId}</td>
                    <td className="px-6 py-4 text-slate-700">{a.mentorName}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-[180px] truncate" title={a.batchName}>{a.batchName}</td>
                    <td className="px-6 py-4 text-slate-500">{a.assignedDate}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{a.assignedBy}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                        a.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                        a.status === 'Completed' ? 'bg-slate-100 text-slate-600' :
                        'bg-amber-50 text-amber-700'
                      }`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Mentor Capacity Check</h3>
          <p className="text-xs text-slate-500 mb-4">Validate assignments against max_student_capacity before assigning new students.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mentors.map(m => {
              const atLimit = m.current_student_count >= m.max_student_capacity;
              return (
                <div key={m.mentor_profile_id} className={`p-3 rounded-lg border text-xs ${atLimit ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>{m.employeeName}</span>
                    <span>{m.current_student_count} / {m.max_student_capacity}</span>
                  </div>
                  {atLimit && <p className="text-red-600 mt-1 font-medium">At capacity — cannot accept new assignments</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
