"use client";

import React, { useEffect, useState } from 'react';
import { User, Eye, Plus, Clock, Briefcase } from 'lucide-react';
import { mentorService } from '@/src/services/mentor.service';
import { MentorProfile } from '@/src/types/api/mentor.types';
import { Drawer } from '@/components/feature/ui/Drawer';
import { EnhancedTable } from '@/components/feature/ui/Table';
import BatchMappingView from './BatchMappingView';
import MentorPerformanceView from './MentorPerformanceView';

import { employeeService } from '@/src/services/employee.service';

export default function MentorProfilePage() {

  const [profiles, setProfiles] = useState<MentorProfile[]>([]);
  const [selected, setSelected] = useState<MentorProfile | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'profiles' | 'batch-mapping' | 'performance'>('profiles');
  
  // Creation States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [createForm, setCreateForm] = useState({
    employee_id: '',
    employeeName: '',
    mentor_bio: '',
    mentor_expertise_string: '',
    years_of_experience: 0,
    max_student_capacity: 5,
    is_available: true,
  });

  useEffect(() => {
    Promise.all([
      mentorService.getMentorProfiles(),
      employeeService.getEmployees()
    ]).then(([mProfiles, emps]) => {
      setProfiles(mProfiles);
      setEmployees(emps);
      setLoading(false);
    });
  }, []);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.employee_id) return;
    
    await mentorService.createMentorProfile({
      employee_id: createForm.employee_id,
      employeeName: createForm.employeeName,
      mentor_bio: createForm.mentor_bio,
      mentor_expertise: createForm.mentor_expertise_string.split(',').map(s => s.trim()).filter(Boolean),
      years_of_experience: Number(createForm.years_of_experience),
      max_student_capacity: Number(createForm.max_student_capacity),
      current_student_count: 0,
      is_available: createForm.is_available,
    });
    
    const updatedProfiles = await mentorService.getMentorProfiles();
    setProfiles(updatedProfiles);
    
    setCreateForm({
      employee_id: '',
      employeeName: '',
      mentor_bio: '',
      mentor_expertise_string: '',
      years_of_experience: 0,
      max_student_capacity: 5,
      is_available: true,
    });
    setIsCreateOpen(false);
  };

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
    <div className={`flex flex-col h-full bg-slate-50 ${
      isCreateOpen ? 'h-[calc(100vh-80px)] overflow-hidden relative' : ''
    }`}>
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Mentor Profile</h1>
          <p className="text-sm text-text-secondary mt-1">Manage mentor-specific profiles linked to employees with role MENTOR.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 shadow-inner border border-border mr-2">
            <button 
              onClick={() => setActiveView('profiles')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeView === 'profiles' ? 'bg-white text-blue-700 shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Profiles
            </button>
            <button 
              onClick={() => setActiveView('batch-mapping')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeView === 'batch-mapping' ? 'bg-white text-blue-700 shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Batch Mapping
            </button>
            <button 
              onClick={() => setActiveView('performance')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeView === 'performance' ? 'bg-white text-blue-700 shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Performance
            </button>
          </div>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Create Profile
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeView === 'batch-mapping' ? (
          <BatchMappingView />
        ) : activeView === 'performance' ? (
          <MentorPerformanceView />
        ) : (
        <div className="bg-white border border-border rounded-xl shadow-sm max-w-7xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
          <EnhancedTable
            data={profiles}
            columns={[
              {
                key: 'employeeName',
                label: 'Mentor',
                render: (p: MentorProfile) => (
                  <div>
                    <div className="flex items-center gap-2 font-medium text-text-primary">
                      <User className="h-4 w-4 text-text-secondary" />
                      {p.employeeName || 'Unknown Mentor'}
                    </div>
                    <span className="text-xs text-text-secondary font-mono">{p.employee_id || p.mentor_profile_id.substring(0, 8)}</span>
                  </div>
                ),
              },
              { key: 'employee_id', label: 'Employee ID', className: 'font-mono text-text-secondary' },
              {
                key: 'years_of_experience',
                label: 'Experience',
                render: (p: MentorProfile) => <span className="text-text-secondary">{p.years_of_experience} yrs</span>,
              },
              {
                key: 'mentor_expertise',
                label: 'Expertise',
                render: (p: MentorProfile) => {
                  const expertiseStr = (p as any).expertise || '';
                  const expertiseList = expertiseStr ? expertiseStr.split(',').map((e: string) => e.trim()) : (p.mentor_expertise || []);
                  return (
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {expertiseList.slice(0, 2).map((exp: string) => (
                      <span key={exp} className="px-2 py-0.5 bg-slate-100 text-text-secondary rounded text-xs font-semibold">{exp}</span>
                    ))}
                    {expertiseList.length > 2 && (
                      <span className="text-xs text-text-secondary">+{expertiseList.length - 2}</span>
                    )}
                  </div>
                  );
                },
              },
              {
                key: 'current_student_count',
                label: 'Capacity',
                render: (p: MentorProfile) => {
                  const maxCap = (p as any).max_capacity ?? p.max_student_capacity ?? 0;
                  const currentCap = p.current_student_count ?? 0;
                  const ratio = maxCap > 0 ? (currentCap / maxCap) * 100 : 0;
                  return (
                  <div>
                    <span className="text-text-secondary">{currentCap} / {maxCap}</span>
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full ${currentCap >= maxCap && maxCap > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                  );
                },
              },
              {
                key: 'is_available',
                label: 'Availability',
                render: (p: MentorProfile) =>
                  p.is_available ? (
                    <span className="inline-flex px-2 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">Available</span>
                  ) : (
                    <span className="inline-flex px-2 py-1 rounded text-xs font-semibold bg-red-50 text-red-700">Unavailable</span>
                  ),
              },
              {
                key: 'actions',
                label: '',
                render: (p: MentorProfile) => (
                  <button
                    onClick={(e) => { e.stopPropagation(); openProfile(p); }}
                    className="p-1 text-text-secondary hover:text-blue-600 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                ),
              },
            ]}
            searchPlaceholder="Search by name, employee ID..."
            searchFields={['employeeName', 'employee_id', 'mentor_profile_id']}
            itemsPerPage={10}
            emptyMessage="No mentor profiles found."
          />
        </div>
        )}
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Mentor Profile Details" size="lg">
        {selected && (
          <div className="flex flex-col h-full bg-slate-50 min-h-0">
            <div className="bg-white border-b border-border px-6 py-4 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                  {(selected.employeeName || 'U').charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-primary">{selected.employeeName || 'Unknown Mentor'}</h2>
                  <p className="text-sm text-text-secondary">Employee: {selected.employee_id || selected.mentor_profile_id.substring(0, 8)} · Profile: {selected.mentor_profile_id.substring(0, 8)}</p>
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
              <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2 mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-500" /> Bio
                </h3>
                <p className="text-text-secondary text-sm">{selected.mentor_bio || 'No bio provided.'}</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2 mb-4">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {((selected as any).expertise ? (selected as any).expertise.split(',').map((e: string) => e.trim()) : (selected.mentor_expertise || [])).map((exp: string) => (
                    <span key={exp} className="px-2.5 py-1 bg-slate-100 text-text-primary rounded-lg text-xs font-semibold">{exp}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2 mb-4">Capacity & Experience</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Years of Experience</p>
                    <p className="text-2xl font-black text-text-primary">{selected.years_of_experience}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Max Student Capacity</p>
                    <p className="text-2xl font-black text-text-primary">{selected.max_student_capacity}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Current Students</p>
                    <p className="text-2xl font-black text-text-primary">{selected.current_student_count}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Workload</p>
                    <p className="text-2xl font-black text-text-primary">
                      {Math.round((selected.current_student_count / selected.max_student_capacity) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2 mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-text-secondary" /> Timestamps
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs text-text-secondary">
                  <div>
                    <span className="font-bold text-text-secondary uppercase block mb-1">Created</span>
                    {new Date(selected.created_at).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-bold text-text-secondary uppercase block mb-1">Updated</span>
                    {new Date(selected.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {isCreateOpen && (
        <div className="absolute inset-0 bg-white z-[100] flex items-start justify-stretch flex-col animate-slide-in">
          <div className="max-w-none w-full h-full rounded-none border-none flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-border px-6 py-4 flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-text-primary uppercase tracking-wide">
                Create Mentor Profile
              </h3>
              
              <button 
                onClick={() => setIsCreateOpen(false)}
                className="text-xs font-bold text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
            </div>

            {/* Forms body */}
            <form 
              onSubmit={handleCreateProfile} 
              className="text-xs font-semibold text-text-primary flex flex-col min-h-0 p-8 space-y-6 flex-1 h-full justify-between"
            >
              <div className="space-y-6 max-w-5xl mx-auto w-full flex-1 flex flex-col justify-start overflow-hidden pt-4">
                
                {/* Section 1 */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-border pb-1">
                    Section 1: Link Employee & Configuration
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-2 space-y-1">
                      <label className="block text-text-secondary text-[10px]">Select Employee *</label>
                      <select 
                        required
                        value={createForm.employee_id}
                        onChange={(e) => {
                          const empId = e.target.value;
                          const emp = employees.find(emp => emp.employee_id === empId);
                          setCreateForm({
                            ...createForm,
                            employee_id: empId,
                            employeeName: emp ? emp.name : '',
                          });
                        }}
                        className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none text-text-primary font-semibold"
                      >
                        <option value="">-- Choose Employee --</option>
                        {employees.map(emp => (
                          <option key={emp.employee_id} value={emp.employee_id}>
                            {emp.name} ({emp.employee_id} - {emp.designation})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-text-secondary text-[10px]">Years of Experience</label>
                      <input 
                        type="number" 
                        required
                        min={0}
                        value={createForm.years_of_experience}
                        onChange={(e) => setCreateForm({ ...createForm, years_of_experience: Number(e.target.value) })}
                        className="w-full p-2 border border-border rounded text-xs focus:outline-none text-text-primary font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-text-secondary text-[10px]">Max Student Capacity</label>
                      <input 
                        type="number" 
                        required
                        min={1}
                        value={createForm.max_student_capacity}
                        onChange={(e) => setCreateForm({ ...createForm, max_student_capacity: Number(e.target.value) })}
                        className="w-full p-2 border border-border rounded text-xs focus:outline-none text-text-primary font-semibold"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    <div className="space-y-1 col-span-2">
                      <label className="block text-text-secondary text-[10px]">Availability Status</label>
                      <select 
                        value={createForm.is_available ? 'true' : 'false'}
                        onChange={(e) => setCreateForm({ ...createForm, is_available: e.target.value === 'true' })}
                        className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none text-text-primary font-semibold"
                      >
                        <option value="true">Available</option>
                        <option value="false">Unavailable</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-border pb-1">
                    Section 2: Expertise & Bio
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-text-secondary text-[10px]">Expertise Fields (comma separated)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. React, Node.js, Cloud Architecture"
                        value={createForm.mentor_expertise_string}
                        onChange={(e) => setCreateForm({ ...createForm, mentor_expertise_string: e.target.value })}
                        className="w-full p-2 border border-border rounded text-xs focus:outline-none text-text-primary font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-text-secondary text-[10px]">Mentor Biography / Bio</label>
                      <textarea 
                        rows={3}
                        required
                        placeholder="Write a brief biography..."
                        value={createForm.mentor_bio}
                        onChange={(e) => setCreateForm({ ...createForm, mentor_bio: e.target.value })}
                        className="w-full p-2 border border-border rounded text-xs focus:outline-none font-semibold text-text-primary"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer button */}
              <div className="pt-4 border-t border-border max-w-5xl mx-auto w-full flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-border text-text-primary bg-white hover:bg-slate-50 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Confirm Profile Creation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
