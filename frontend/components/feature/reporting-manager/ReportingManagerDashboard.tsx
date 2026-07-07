"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { reportingManagerService } from '../../../src/services/reportingManager.service';
import { RMBatch, RMStudent, RMMentor } from '../../../src/types/reporting-manager.types';
import {
  Users,
  BookOpen,
  ChevronDown,
  Search,
  X,
  GraduationCap,
  Briefcase,
  Link2,
  ExternalLink,
  Mail,
  Phone,
  Star,
  Calendar,
  CheckCircle2,
  AlertCircle,
  UserCheck,
} from 'lucide-react';

// ─── Skeleton helpers ────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white border border-border rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-11 w-11 rounded-xl bg-slate-200" />
      </div>
      <div className="h-3 w-24 bg-slate-200 rounded mb-2" />
      <div className="h-7 w-16 bg-slate-200 rounded" />
    </div>
  );
}

function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-slate-200 rounded animate-pulse" style={{ width: `${60 + (i * 13) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Avatar initials ─────────────────────────────────────────────────────────

function Avatar({ name, color = 'from-indigo-500 to-violet-600' }: { name: string; color?: string }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {initials || '?'}
    </div>
  );
}

// ─── Batch Selector ──────────────────────────────────────────────────────────

function BatchSelector({
  batches,
  selectedBatch,
  onSelect,
}: {
  batches: RMBatch[];
  selectedBatch: RMBatch | null;
  onSelect: (b: RMBatch) => void;
}) {
  const [open, setOpen] = useState(false);

  if (!batches.length) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-border rounded-xl shadow-sm hover:border-indigo-400 transition-all text-sm font-medium text-text-primary min-w-[260px]"
      >
        <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
        <span className="flex-1 text-left truncate">
          {selectedBatch ? `${selectedBatch.batch_name} — ${selectedBatch.batch_code}` : 'Select batch'}
        </span>
        <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-50 bg-white border border-border rounded-xl shadow-xl w-full min-w-[320px] py-1 overflow-hidden">
          {batches.map(b => (
            <button
              key={b.batch_id}
              onClick={() => { onSelect(b); setOpen(false); }}
              className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-start gap-3 ${selectedBatch?.batch_id === b.batch_id ? 'bg-indigo-50' : ''}`}
            >
              <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary leading-tight">{b.batch_name}</p>
                <p className="text-xs text-text-secondary mt-0.5">{b.batch_code} · {b.program_name}</p>
              </div>
              {selectedBatch?.batch_id === b.batch_id && (
                <CheckCircle2 className="w-4 h-4 text-indigo-600 ml-auto shrink-0 mt-0.5" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Students Table ──────────────────────────────────────────────────────────

function StudentsTable({ students, loading }: { students: RMStudent[]; loading: boolean }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    students.filter(s =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.enrollment_number.toLowerCase().includes(search.toLowerCase())
    ),
    [students, search]
  );

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Filter bar */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by name, email, or enrollment..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm border border-border rounded-lg bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <span className="text-xs font-semibold text-text-secondary px-2.5 py-1 bg-slate-100 rounded-lg">
          {filtered.length} student{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-xs uppercase text-text-secondary tracking-wider border-b border-border">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Student</th>
              <th className="px-5 py-3.5 font-semibold">Enrollment No.</th>
              <th className="px-5 py-3.5 font-semibold">Contact</th>
              <th className="px-5 py-3.5 font-semibold">Profiles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={4} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-text-secondary">
                    <GraduationCap className="w-10 h-10 opacity-30" />
                    <p className="font-medium">{search ? 'No students match your search.' : 'No students in this batch yet.'}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(student => (
                <tr key={student.student_profile_id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={student.name || student.enrollment_number} />
                      <div>
                        <p className="font-semibold text-text-primary">{student.name || '—'}</p>
                        <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1">
                          <Mail className="w-3 h-3" />{student.email || '—'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-mono font-medium text-text-primary">
                      {student.enrollment_number}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {student.phone ? (
                      <span className="flex items-center gap-1 text-text-secondary text-xs">
                        <Phone className="w-3 h-3" />{student.phone}
                      </span>
                    ) : (
                      <span className="text-xs text-text-secondary/50">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {student.github_url && (
                        <a href={student.github_url} target="_blank" rel="noreferrer"
                          className="text-text-secondary hover:text-text-primary transition-colors"
                          title="GitHub">
                          <Link2 className="w-4 h-4" />
                        </a>
                      )}
                      {student.linkedin_url && (
                        <a href={student.linkedin_url} target="_blank" rel="noreferrer"
                          className="text-text-secondary hover:text-blue-600 transition-colors"
                          title="LinkedIn">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {!student.github_url && !student.linkedin_url && (
                        <span className="text-xs text-text-secondary/50">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Mentors Table ────────────────────────────────────────────────────────────

function MentorsTable({ mentors, loading }: { mentors: RMMentor[]; loading: boolean }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    mentors.filter(m =>
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.expertise || '').toLowerCase().includes(search.toLowerCase())
    ),
    [mentors, search]
  );

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by name, email, or expertise..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm border border-border rounded-lg bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <span className="text-xs font-semibold text-text-secondary px-2.5 py-1 bg-slate-100 rounded-lg">
          {filtered.length} mentor{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-xs uppercase text-text-secondary tracking-wider border-b border-border">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Mentor</th>
              <th className="px-5 py-3.5 font-semibold">Expertise</th>
              <th className="px-5 py-3.5 font-semibold">Experience</th>
              <th className="px-5 py-3.5 font-semibold">Students Assigned</th>
              <th className="px-5 py-3.5 font-semibold">Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={5} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-text-secondary">
                    <UserCheck className="w-10 h-10 opacity-30" />
                    <p className="font-medium">{search ? 'No mentors match your search.' : 'No mentors assigned to this batch yet.'}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(mentor => (
                <tr key={mentor.mentor_profile_id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={mentor.name} color="from-emerald-500 to-teal-600" />
                      <div>
                        <p className="font-semibold text-text-primary">{mentor.name || '—'}</p>
                        <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1">
                          <Mail className="w-3 h-3" />{mentor.email || '—'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {mentor.expertise ? (
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                        {mentor.expertise}
                      </span>
                    ) : (
                      <span className="text-xs text-text-secondary/50">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {mentor.years_of_experience != null ? (
                      <span className="text-text-primary font-medium">
                        {mentor.years_of_experience} yr{mentor.years_of_experience !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-xs text-text-secondary/50">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded-full bg-violet-100 flex items-center justify-center">
                        <Users className="w-3 h-3 text-violet-600" />
                      </div>
                      <span className="font-semibold text-text-primary">{mentor.assigned_student_count}</span>
                      <span className="text-xs text-text-secondary">student{mentor.assigned_student_count !== 1 ? 's' : ''}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      mentor.is_available
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-text-secondary'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${mentor.is_available ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {mentor.is_available ? 'Available' : 'Busy'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type ActiveTab = 'students' | 'mentors';

export default function ReportingManagerDashboard() {
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  const [batches, setBatches] = useState<RMBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<RMBatch | null>(null);
  const [students, setStudents] = useState<RMStudent[]>([]);
  const [mentors, setMentors] = useState<RMMentor[]>([]);

  const [activeTab, setActiveTab] = useState<ActiveTab>('students');

  // Load allocated batches on mount
  useEffect(() => {
    const load = async () => {
      setBatchesLoading(true);
      const data = await reportingManagerService.getMyBatches();
      setBatches(data);
      if (data.length > 0) setSelectedBatch(data[0]);
      setBatchesLoading(false);
    };
    load();
  }, []);

  // Load students + mentors whenever selected batch changes
  useEffect(() => {
    if (!selectedBatch) return;
    const load = async () => {
      setDataLoading(true);
      const [studs, ments] = await Promise.all([
        reportingManagerService.getStudentsInBatch(selectedBatch.batch_id),
        reportingManagerService.getMentorsInBatch(selectedBatch.batch_id),
      ]);
      setStudents(studs);
      setMentors(ments);
      setDataLoading(false);
    };
    load();
  }, [selectedBatch]);

  const handleBatchSelect = (b: RMBatch) => {
    setSelectedBatch(b);
    setActiveTab('students');
  };

  // ── KPI cards ──
  const kpiCards = selectedBatch
    ? [
        {
          label: 'Total Students',
          value: students.length || selectedBatch.student_count,
          icon: GraduationCap,
          color: 'text-indigo-600',
          bg: 'bg-indigo-50',
          border: 'border-indigo-100',
        },
        {
          label: 'Mentors in Batch',
          value: mentors.length,
          icon: UserCheck,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-100',
        },
        {
          label: 'Batch Capacity',
          value: selectedBatch.max_capacity,
          icon: Users,
          color: 'text-violet-600',
          bg: 'bg-violet-50',
          border: 'border-violet-100',
        },
        {
          label: 'Availability',
          value: mentors.filter(m => m.is_available).length + ' / ' + mentors.length,
          icon: Star,
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-100',
        },
      ]
    : [];

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between shrink-0 gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">Reporting Manager</h1>
            <p className="text-sm text-text-secondary mt-0.5">Track students and mentors in your allocated batch.</p>
          </div>
        </div>

        {/* Batch Selector */}
        {batchesLoading ? (
          <div className="h-10 w-64 bg-slate-200 rounded-xl animate-pulse" />
        ) : (
          <BatchSelector
            batches={batches}
            selectedBatch={selectedBatch}
            onSelect={handleBatchSelect}
          />
        )}
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6 max-w-7xl mx-auto w-full">

        {/* ── No batches state ── */}
        {!batchesLoading && batches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-text-secondary gap-3">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 opacity-40" />
            </div>
            <h3 className="font-semibold text-text-primary text-lg">No batch allocated</h3>
            <p className="text-sm text-center max-w-md">
              You have not been assigned to any batch yet. Please contact your HR team to get allocated to a batch.
            </p>
          </div>
        )}

        {/* ── Batch summary card ── */}
        {selectedBatch && (
          <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 opacity-80" />
                  <span className="text-xs font-semibold opacity-80 uppercase tracking-wider">{selectedBatch.program_name}</span>
                </div>
                <h2 className="text-xl font-bold">{selectedBatch.batch_name}</h2>
                <p className="text-sm opacity-80 mt-0.5 font-mono">{selectedBatch.batch_code}</p>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-xs opacity-70 uppercase tracking-wider mb-0.5">Start</p>
                  <p className="font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 opacity-80" />
                    {new Date(selectedBatch.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center">
                  <p className="text-xs opacity-70 uppercase tracking-wider mb-0.5">End</p>
                  <p className="font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 opacity-80" />
                    {new Date(selectedBatch.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── KPI Cards ── */}
        {selectedBatch && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {batchesLoading || dataLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              kpiCards.map((kpi, i) => (
                <div key={i} className={`bg-white border ${kpi.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group`}>
                  <div className={`h-11 w-11 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">{kpi.label}</p>
                  <p className="text-2xl font-black text-text-primary tracking-tight">{kpi.value}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Tab switcher + Tables ── */}
        {selectedBatch && (
          <>
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
              {(['students', 'mentors'] as ActiveTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize flex items-center gap-2 ${
                    activeTab === tab
                      ? 'bg-white text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab === 'students' ? <GraduationCap className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  {tab}
                  <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                    activeTab === tab ? 'bg-slate-100 text-text-secondary' : 'bg-slate-200/60 text-text-secondary'
                  }`}>
                    {tab === 'students' ? students.length : mentors.length}
                  </span>
                </button>
              ))}
            </div>

            {activeTab === 'students' && (
              <StudentsTable students={students} loading={dataLoading} />
            )}
            {activeTab === 'mentors' && (
              <MentorsTable mentors={mentors} loading={dataLoading} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
