"use client";

import React, { useState } from 'react';
import { Users, Search, Filter, Briefcase, Eye, UserCheck, UserX, User, Activity, Clock } from 'lucide-react';
import { MOCK_MENTORS, Mentor } from '@/src/data/mock-mentors';
import { Drawer } from '@/components/admin/ui/Drawer';
import MentorDashboard from '@/components/dashboards/MentorDashboard';

export default function MentorPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'directory'>('dashboard');
  const [mentors, setMentors] = useState<Mentor[]>(MOCK_MENTORS);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'batches' | 'performance' | 'availability' | 'timeline'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMentors = mentors.filter(m => m.id.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleMentorClick = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setActiveTab('overview');
    setIsDrawerOpen(true);
  };

  const toggleAvailability = (mentorId: string) => {
    setMentors(prev => prev.map(m => m.id === mentorId ? { ...m, is_available: !m.is_available } : m));
    if (selectedMentor && selectedMentor.id === mentorId) {
      setSelectedMentor({ ...selectedMentor, is_available: !selectedMentor.is_available });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Mentor Module</h1>
          <p className="text-sm text-slate-500 mt-1">Manage mentor profiles, capacities, and performance.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'dashboard' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveView('directory')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'directory' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Directory
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeView === 'dashboard' && <MentorDashboard />}

        {activeView === 'directory' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm max-w-7xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search mentors..."
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
                    <th className="px-6 py-3">Mentor ID</th>
                    <th className="px-6 py-3">Experience</th>
                    <th className="px-6 py-3">Capacity</th>
                    <th className="px-6 py-3">Availability</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMentors.map(m => (
                    <tr key={m.id} className="hover:bg-blue-50/50 cursor-pointer transition-colors" onClick={() => handleMentorClick(m)}>
                      <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        {m.id}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{m.years_of_experience} years</td>
                      <td className="px-6 py-4 text-slate-600">
                        {m.current_student_count} / {m.max_student_capacity}
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full ${m.current_student_count >= m.max_student_capacity ? 'bg-red-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${(m.current_student_count / m.max_student_capacity) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {m.is_available ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">Available</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-50 text-red-700">Unavailable</span>
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
        )}
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Mentor Profile" size="lg">
        {selectedMentor && (
          <div className="flex flex-col h-full bg-slate-50 min-h-0">
            <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                  {selectedMentor.id.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedMentor.id}</h2>
                  <p className="text-sm text-slate-500">Employee ID: {selectedMentor.employeeId}</p>
                </div>
              </div>
              <button 
                onClick={() => toggleAvailability(selectedMentor.id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${selectedMentor.is_available ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
              >
                {selectedMentor.is_available ? 'Set Unavailable' : 'Set Available'}
              </button>
            </div>

            <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-6 shrink-0">
              {[
                { id: 'overview', label: 'Overview', icon: Briefcase },
                { id: 'availability', label: 'Availability & Capacity', icon: Clock },
                { id: 'students', label: 'Students', icon: Users },
                { id: 'batches', label: 'Batches', icon: Briefcase },
                { id: 'performance', label: 'Performance', icon: Activity },
                { id: 'timeline', label: 'Timeline', icon: Activity }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Bio</h3>
                    <p className="text-slate-600 text-sm">{selectedMentor.mentor_bio}</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMentor.mentor_expertise.map((exp, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'availability' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Capacity Tracking</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Students</p>
                        <p className="text-2xl font-black text-slate-900">{selectedMentor.current_student_count}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Max Capacity</p>
                        <p className="text-2xl font-black text-slate-900">{selectedMentor.max_student_capacity}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Workload</span>
                        <span>{Math.round((selectedMentor.current_student_count / selectedMentor.max_student_capacity) * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${selectedMentor.current_student_count >= selectedMentor.max_student_capacity ? 'bg-red-500' : 'bg-blue-500'}`} 
                          style={{ width: `${(selectedMentor.current_student_count / selectedMentor.max_student_capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'students' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                  Student assignment list will appear here.
                </div>
              )}
              {activeTab === 'batches' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                  Batch assignment list will appear here.
                </div>
              )}
              {activeTab === 'performance' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                  Mentor performance analytics will appear here.
                </div>
              )}
              {activeTab === 'timeline' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                  Timeline of mentor activity will appear here.
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
