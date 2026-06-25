"use client";

import React, { useEffect, useState } from 'react';
import { Search, Filter, User, Eye, Plus, Clock, Briefcase } from 'lucide-react';
import { mentorService } from '@/src/services/mentor.service';
import { MentorProfile } from '@/src/data/mock-mentors';
import { Drawer } from '@/components/admin/ui/Drawer';

export default function MentorProfilePage() {
  const [profiles, setProfiles] = useState<MentorProfile[]>([]);
  const [selected, setSelected] = useState<MentorProfile | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mentorService.getMentorProfiles().then(data => {
      setProfiles(data);
      setLoading(false);
    });
  }, []);

  const filtered = profiles.filter(p =>
    p.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.mentor_profile_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openProfile = (profile: MentorProfile) => {
    setSelected(profile);
    setIsDrawerOpen(true);
  };

  const toggleAvailability = async (profile: MentorProfile) => {
    const updated = await mentorService.updateMentorProfile(profile.mentor_profile_id, {
      is_available: !profile.is_available,
    });
    if (updated) {
      setProfiles(prev => prev.map(p => p.mentor_profile_id === updated.mentor_profile_id ? updated : p));
      if (selected?.mentor_profile_id === updated.mentor_profile_id) setSelected(updated);
    }
  };

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
          <h1 className="text-xl font-bold text-slate-900">Mentor Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage mentor-specific profiles linked to employees with role MENTOR.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> Create Profile
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm max-w-7xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, employee ID..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <button className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Mentor</th>
                  <th className="px-6 py-3">Employee ID</th>
                  <th className="px-6 py-3">Experience</th>
                  <th className="px-6 py-3">Expertise</th>
                  <th className="px-6 py-3">Capacity</th>
                  <th className="px-6 py-3">Availability</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(p => (
                  <tr
                    key={p.mentor_profile_id}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                    onClick={() => openProfile(p)}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        {p.employeeName}
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{p.mentor_profile_id}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono">{p.employee_id}</td>
                    <td className="px-6 py-4 text-slate-600">{p.years_of_experience} yrs</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.mentor_expertise.slice(0, 2).map(exp => (
                          <span key={exp} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold">{exp}</span>
                        ))}
                        {p.mentor_expertise.length > 2 && (
                          <span className="text-xs text-slate-400">+{p.mentor_expertise.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {p.current_student_count} / {p.max_student_capacity}
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full ${p.current_student_count >= p.max_student_capacity ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${(p.current_student_count / p.max_student_capacity) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.is_available ? (
                        <span className="inline-flex px-2 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">Available</span>
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded text-xs font-semibold bg-red-50 text-red-700">Unavailable</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Mentor Profile Details" size="lg">
        {selected && (
          <div className="flex flex-col h-full bg-slate-50 min-h-0">
            <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                  {selected.employeeName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selected.employeeName}</h2>
                  <p className="text-sm text-slate-500">Employee: {selected.employee_id} · Profile: {selected.mentor_profile_id}</p>
                </div>
              </div>
              <button
                onClick={() => toggleAvailability(selected)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${selected.is_available ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
              >
                {selected.is_available ? 'Set Unavailable' : 'Set Available'}
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-500" /> Bio
                </h3>
                <p className="text-slate-600 text-sm">{selected.mentor_bio}</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.mentor_expertise.map(exp => (
                    <span key={exp} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">{exp}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Capacity & Experience</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Years of Experience</p>
                    <p className="text-2xl font-black text-slate-900">{selected.years_of_experience}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Max Student Capacity</p>
                    <p className="text-2xl font-black text-slate-900">{selected.max_student_capacity}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Students</p>
                    <p className="text-2xl font-black text-slate-900">{selected.current_student_count}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Workload</p>
                    <p className="text-2xl font-black text-slate-900">
                      {Math.round((selected.current_student_count / selected.max_student_capacity) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" /> Timestamps
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-400 uppercase block mb-1">Created</span>
                    {new Date(selected.created_at).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase block mb-1">Updated</span>
                    {new Date(selected.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
