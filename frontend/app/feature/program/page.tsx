"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  GraduationCap, Plus, ChevronRight, Clock, Building2, 
  Users, Activity, FileText, Check, ExternalLink, AlertCircle, Layers, 
  Award, Shield, Calendar, DollarSign, MapPin, TrendingUp, CheckCircle2, 
  XCircle, AlertTriangle, ArrowUpRight, Send, Trash, Eye, Download, 
  Upload, Briefcase, Star, Edit, Lock, PlusCircle, UserCheck, MoreVertical, 
  RefreshCw, CheckSquare, MessageSquare, BookOpen, FileDown
} from 'lucide-react';
import { programService } from '@/src/services/program.service';
import { Program, CurriculumModule, ProgramEnrollment, ProgramMentor, ProgramTimelineEvent, ProgramMetadata } from '@/src/data/mock-programs';
import { organizationService } from '@/src/services/organization.service';
import { Organization } from '@/src/data/mock-organizations';
import { useAuth } from '@/src/context/AuthContext';
import { Drawer } from '@/components/feature/ui/Drawer';
import { PermissionGuard } from '@/components/feature/ui/PermissionGuard';
import { EnhancedTable } from '@/components/feature/ui/Table';

interface ProgramWithOrg extends Program {
  organizationData?: Organization;
}

export default function ProgramManagementPage() {

  const { user } = useAuth();
  
  // App views: dashboard, directory
  const [activeView, setActiveView] = useState<'dashboard' | 'directory'>('dashboard');
  
  // Data state
  const [programs, setPrograms] = useState<ProgramWithOrg[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selected programs for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Drawer states
  const [activeProfile, setActiveProfile] = useState<ProgramWithOrg | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'types' | 'curriculum' | 'enrollments' | 'mentors' | 'analytics' | 'certifications' | 'metadata' | 'timeline'>('overview');
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  
  // Popovers & Modals
  const [activeActionModal, setActiveActionModal] = useState<{
    type: 'status' | 'mentor' | 'module' | 'edit' | 'onboard' | 'notify' | 'bulkStatus' | 'bulkMentor' | 'bulkNotify' | 'bulkCert';
    progId?: string;
  } | null>(null);
  
  // Filter state variables
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Input fields for actions
  const [statusInput, setStatusInput] = useState<Program['status']>('Active');
  const [mentorInput, setMentorInput] = useState('');
  const [notifyMsg, setNotifyMsg] = useState('');
  
  // Curriculum module addition form
  const [moduleForm, setModuleForm] = useState({
    name: '',
    topicsString: '',
    outcomesString: '',
    assessmentsString: '',
    assignmentsString: '',
    projectsString: ''
  });

  // Program onboard/edit form
  const [programForm, setProgramForm] = useState({
    title: '',
    code: '',
    type: 'Stipend Internship' as Program['type'],
    durationWeeks: 12,
    organizationId: 'org-1',
    description: '',
    capacity: 100,
    eligibility: '',
    category: '',
    level: 'Intermediate' as ProgramMetadata['level'],
    domain: '',
    tagsString: '',
    techStackString: '',
    skillsString: '',
    certType: ''
  });

  // Dashboard ranking toggle
  const [performanceMetric, setPerformanceMetric] = useState<'completion' | 'attendance' | 'satisfaction' | 'placement'>('completion');

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load programs and organizations
  const loadData = async () => {
    setLoading(true);
    try {
      const progData = await programService.getPrograms();
      const orgData = await organizationService.getOrganizations();
      
      const mergedData = progData.map(prog => ({
        ...prog,
        organizationData: orgData.find(o => o.id === prog.organizationId)
      }));
      
      setPrograms(mergedData);
      setOrganizations(orgData);
    } catch (err) {
      console.error(err);
      showToast('Failed to load programs data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync activeProfile state from main array
  useEffect(() => {
    if (activeProfile) {
      const refreshed = programs.find(p => p.id === activeProfile?.id);
      if (refreshed) {
        setActiveProfile(refreshed);
      }
    }
  }, [programs, activeProfile?.id]);

  // Global Keyboard listener for shortcuts (Escape to close modals/drawers)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileDrawerOpen(false);
        setActiveActionModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered programs calculation (for dashboard KPI click integration)
  const filteredPrograms = useMemo(() => {
    return programs.filter(prog => {
      return filterStatus === 'all' || prog.status === filterStatus;
    });
  }, [programs, filterStatus]);

  // Strategic KPI indicators
  const kpiStats = useMemo(() => {
    const total = programs.length;
    const active = programs.filter(p => p.status === 'Active').length;
    const completed = programs.filter(p => p.status === 'Completed').length;
    const upcoming = programs.filter(p => p.status === 'Upcoming' || p.status === 'Open Enrollment').length;
    
    let studentsCount = 0;
    const mentorsSet = new Set<string>();
    let totalCompletion = 0;
    let completedCount = 0;
    
    programs.forEach(p => {
      studentsCount += p.studentsEnrolled;
      p.mentors.forEach(m => mentorsSet.add(m.id));
      if (p.status === 'Completed' || p.status === 'Active') {
        totalCompletion += p.completionRate;
        completedCount++;
      }
    });

    const completionRate = completedCount > 0 ? Math.round(totalCompletion / completedCount) : 0;
    const placementRate = 92; // default mock conversion

    return { total, active, completed, upcoming, studentsCount, activeMentors: mentorsSet.size, completionRate, placementRate };
  }, [programs]);

  // Combined Activities Feed
  const recentActivities = useMemo(() => {
    const events: { progId: string; progTitle: string; event: ProgramTimelineEvent }[] = [];
    programs.forEach(prog => {
      prog.timeline.forEach(t => {
        events.push({
          progId: prog.id,
          progTitle: prog.title,
          event: t
        });
      });
    });
    return events
      .sort((a, b) => new Date(b.event.date).getTime() - new Date(a.event.date).getTime())
      .slice(0, 10);
  }, [programs]);

  // Leaders rankings for the dashboard
  const performanceLeaderboard = useMemo(() => {
    return [...programs].sort((a, b) => {
      if (performanceMetric === 'completion') {
        return b.completionRate - a.completionRate;
      } else if (performanceMetric === 'attendance') {
        return b.analytics.attendanceRate - a.analytics.attendanceRate;
      } else if (performanceMetric === 'placement') {
        return b.analytics.placementRate - a.analytics.placementRate;
      } else {
        return b.analytics.satisfactionScore - a.analytics.satisfactionScore;
      }
    }).slice(0, 5);
  }, [programs, performanceMetric]);

  // Mentor performance aggregated summary
  const mentorContributions = useMemo(() => {
    const mentorsMap: Record<string, ProgramMentor & { progTitles: string[] }> = {};
    programs.forEach(prog => {
      prog.mentors.forEach(m => {
        if (!mentorsMap[m.id]) {
          mentorsMap[m.id] = { ...m, progTitles: [prog.title] };
        } else {
          mentorsMap[m.id].assignedStudents += m.assignedStudents;
          mentorsMap[m.id].sessionsConducted += m.sessionsConducted;
          if (!mentorsMap[m.id].progTitles.includes(prog.title)) {
            mentorsMap[m.id].progTitles.push(prog.title);
          }
        }
      });
    });
    return Object.values(mentorsMap).slice(0, 5);
  }, [programs]);

  // Program Type distribution (Paid/Free/Stipend/Industrial/Research/Corporate)
  const typeStats = useMemo(() => {
    const counts: Record<string, number> = {};
    programs.forEach(p => {
      counts[p.type] = (counts[p.type] || 0) + 1;
    });
    return counts;
  }, [programs]);

  // Open program drawer
  const handleOpenProfile = (prog: ProgramWithOrg) => {
    setActiveProfile(prog);
    setProfileTab('overview');
    setIsProfileDrawerOpen(true);
  };

  // Pre-fill forms for editing
  const openEditModal = (prog: ProgramWithOrg) => {
    setProgramForm({
      title: prog.title,
      code: prog.code,
      type: prog.type,
      durationWeeks: prog.durationWeeks,
      organizationId: prog.organizationId,
      description: prog.description,
      capacity: prog.capacity,
      eligibility: prog.eligibility,
      category: prog.metadata.category,
      level: prog.metadata.level,
      domain: prog.metadata.domain,
      tagsString: prog.metadata.tags.join(', '),
      techStackString: prog.metadata.techStack.join(', '),
      skillsString: prog.metadata.skills.join(', '),
      certType: prog.metadata.certType
    });
    setActiveActionModal({ type: 'edit', progId: prog.id });
  };

  // Pre-fill fields for new program onboarding
  const openOnboardModal = () => {
    setProgramForm({
      title: '',
      code: '',
      type: 'Free Internship',
      durationWeeks: 8,
      organizationId: 'org-1',
      description: '',
      capacity: 100,
      eligibility: 'B.Tech CSE/IT Students',
      category: 'Software Engineering',
      level: 'Intermediate',
      domain: 'Cloud Services',
      tagsString: 'Cloud, Serverless',
      techStackString: 'AWS, Lambda, Dynamodb',
      skillsString: 'Serverless architecture, Database design',
      certType: 'Co-branded Technical Certification'
    });
    setActiveActionModal({ type: 'onboard' });
  };

  // Handle single action execution forms
  const executeAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionModal) return;
    const { type, progId } = activeActionModal;
    const targetId = progId || activeProfile?.id;
    if (!targetId && type !== 'onboard') return;

    try {
      if (type === 'status') {
        const updated = await programService.updateProgram(targetId!, { status: statusInput });
        if (updated) {
          updated.timeline.unshift({
            date: new Date().toISOString().split('T')[0],
            title: 'Status Transitioned',
            description: `Lifecycle program stage manually moved to: ${statusInput}`,
            type: 'update'
          });
          const refreshed = {
            ...updated,
            organizationData: organizations.find(o => o.id === updated.organizationId)
          };
          setPrograms(programs.map(p => p.id === targetId ? refreshed : p));
          showToast(`Updated program status of ${updated.title} to ${statusInput}`);
        }
      } else if (type === 'mentor') {
        const updated = await programService.getProgram(targetId!);
        if (updated) {
          const mentorName = mentorInput === 'emp-2' ? 'Bob Johnson' : mentorInput === 'emp-3' ? 'Diana Prince' : 'Charlie Davis';
          const mentors = [...updated.mentors];
          const hasMentor = mentors.some(m => m.id === mentorInput);
          if (!hasMentor) {
            mentors.push({
              id: mentorInput,
              name: mentorName,
              department: 'Technical Development',
              assignedStudents: 10,
              sessionsConducted: 4,
              rating: 4.8,
              successRate: 95,
              satisfaction: 4.9,
              completionContribution: 95
            });
          }
          const updatedProg = await programService.updateProgram(targetId!, { 
            mentors,
            mentorsAssigned: mentors.length
          });
          if (updatedProg) {
            updatedProg.timeline.unshift({
              date: new Date().toISOString().split('T')[0],
              title: 'Mentor Mapped',
              description: `Mapped mentor: ${mentorName} to program.`,
              type: 'mentor'
            });
            const refreshed = {
              ...updatedProg,
              organizationData: organizations.find(o => o.id === updatedProg.organizationId)
            };
            setPrograms(programs.map(p => p.id === targetId ? refreshed : p));
            showToast(`Mapped ${mentorName} as program mentor.`);
          }
        }
      } else if (type === 'module') {
        const updated = await programService.getProgram(targetId!);
        if (updated) {
          const newModule: CurriculumModule = {
            name: moduleForm.name,
            topics: moduleForm.topicsString.split(',').map(s => s.trim()).filter(Boolean),
            learningOutcomes: moduleForm.outcomesString.split(',').map(s => s.trim()).filter(Boolean),
            assessments: moduleForm.assessmentsString.split(',').map(s => s.trim()).filter(Boolean),
            assignments: moduleForm.assignmentsString.split(',').map(s => s.trim()).filter(Boolean),
            projects: moduleForm.projectsString.split(',').map(s => s.trim()).filter(Boolean)
          };
          const curriculum = [...updated.curriculum, newModule];
          const updatedProg = await programService.updateProgram(targetId!, { curriculum });
          if (updatedProg) {
            updatedProg.timeline.unshift({
              date: new Date().toISOString().split('T')[0],
              title: 'Curriculum Published',
              description: `Created curriculum module: ${moduleForm.name}`,
              type: 'curriculum'
            });
            const refreshed = {
              ...updatedProg,
              organizationData: organizations.find(o => o.id === updatedProg.organizationId)
            };
            setPrograms(programs.map(p => p.id === targetId ? refreshed : p));
            showToast(`Added curriculum module ${moduleForm.name}`);
          }
        }
      } else if (type === 'edit') {
        const updated = await programService.updateProgram(targetId!, {
          title: programForm.title,
          code: programForm.code,
          type: programForm.type,
          durationWeeks: Number(programForm.durationWeeks),
          organizationId: programForm.organizationId,
          description: programForm.description,
          capacity: Number(programForm.capacity),
          eligibility: programForm.eligibility,
          metadata: {
            category: programForm.category,
            level: programForm.level,
            domain: programForm.domain,
            tags: programForm.tagsString.split(',').map(s => s.trim()).filter(Boolean),
            techStack: programForm.techStackString.split(',').map(s => s.trim()).filter(Boolean),
            skills: programForm.skillsString.split(',').map(s => s.trim()).filter(Boolean),
            certType: programForm.certType
          }
        });
        if (updated) {
          const refreshed = {
            ...updated,
            organizationData: organizations.find(o => o.id === updated.organizationId)
          };
          setPrograms(programs.map(p => p.id === targetId ? refreshed : p));
          showToast(`Updated program details for ${updated.title}`);
        }
      } else if (type === 'onboard') {
        const newProg = await programService.createProgram({
          program_name: programForm.title,
          program_code: programForm.code,
          internship_type_id: '',
          program_description: '',
          duration_weeks: Number(programForm.durationWeeks),
          certificate_available: true,
          status: 'DRAFT',
        } as any);
        const refreshed = {
          ...newProg,
          organizationData: organizations.find(o => o.id === newProg.organizationId)
        };
        setPrograms([...programs, refreshed]);
        showToast(`Successfully onboarded program cohort: ${newProg.title}`);
      } else if (type === 'notify') {
        showToast(`System notification dispatched to cohort enrollments of ${programs.find(p => p.id === targetId)?.title}: "${notifyMsg}"`, 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to complete action', 'error');
    }
    setActiveActionModal(null);
  };

  // Bulk operations
  const executeBulkAction = async (type: 'status' | 'mentor' | 'notify' | 'cert') => {
    if (selectedIds.length === 0) return;
    
    try {
      if (type === 'status') {
        await programService.bulkUpdateStatus(selectedIds, statusInput);
        setPrograms(programs.map(prog => 
          selectedIds.includes(prog.id) 
            ? { ...prog, status: statusInput, timeline: [
                { date: new Date().toISOString().split('T')[0], title: 'Bulk Status Update', description: `Program status bulk-transitioned to ${statusInput}`, type: 'update' },
                ...prog.timeline
              ]} 
            : prog
        ));
        showToast(`Bulk updated program status to ${statusInput} for ${selectedIds.length} cohorts`);
      } else if (type === 'mentor') {
        await programService.bulkAssignMentor(selectedIds, mentorInput);
        const mentorName = mentorInput === 'emp-2' ? 'Bob Johnson' : mentorInput === 'emp-3' ? 'Diana Prince' : 'Charlie Davis';
        setPrograms(programs.map(prog => {
          if (selectedIds.includes(prog.id)) {
            const hasMentor = prog.mentors.some(m => m.id === mentorInput);
            const list = [...prog.mentors];
            if (!hasMentor) {
              list.push({
                id: mentorInput,
                name: mentorName,
                department: 'Engineering',
                assignedStudents: 10,
                sessionsConducted: 2,
                rating: 4.8,
                successRate: 98,
                satisfaction: 4.9,
                completionContribution: 98
              });
            }
            return {
              ...prog,
              mentors: list,
              mentorsAssigned: list.length,
              timeline: [
                { date: new Date().toISOString().split('T')[0], title: 'Mentor Assigned', description: `Assigned new program mentor ${mentorName} via bulk operations.`, type: 'mentor' },
                ...prog.timeline
              ]
            };
          }
          return prog;
        }));
        showToast(`Bulk assigned mentor ${mentorName} to ${selectedIds.length} programs`);
      } else if (type === 'notify') {
        showToast(`Bulk notification dispatched to ${selectedIds.length} selected cohorts: "${notifyMsg}"`, 'info');
      } else if (type === 'cert') {
        showToast(`Initiating bulk PDF certificate generation & security seal sign-off for ${selectedIds.length} cohorts`, 'success');
      }
      setSelectedIds([]);
      setActiveActionModal(null);
    } catch (err) {
      console.error(err);
      showToast('Error executing bulk action', 'error');
    }
  };

  // Toggle checkbox selectors
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const filteredIds = filteredPrograms.map(p => p.id);
    const allSelected = filteredIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  // Student enrollment approval mutations
  const handleEnrollmentStatus = async (progId: string, studentId: string, newStatus: 'Approved' | 'Rejected') => {
    const prog = programs.find(p => p.id === progId);
    if (!prog) return;

    const enrolls = [...prog.enrollments];
    const idx = enrolls.findIndex(e => e.id === studentId);
    if (idx !== -1) {
      enrolls[idx] = {
        ...enrolls[idx],
        status: newStatus
      };
    }

    try {
      const updated = await programService.updateProgram(progId, { enrollments: enrolls });
      if (updated) {
        updated.timeline.unshift({
          date: new Date().toISOString().split('T')[0],
          title: 'Student Joined',
          description: `Enrollment status of student ID ${studentId} changed to ${newStatus}.`,
          type: 'enrollment'
        });
        const refreshed = {
          ...updated,
          organizationData: organizations.find(o => o.id === updated.organizationId)
        };
        setPrograms(programs.map(p => p.id === progId ? refreshed : p));
        showToast(`Enrollment status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Generate certificate single trigger
  const handleGenerateCertificate = async (progId: string, studentName: string) => {
    const prog = programs.find(p => p.id === progId);
    if (!prog) return;

    const list = [...prog.certifications.list, {
      id: `CERT-${prog.code}-${Date.now().toString().slice(-4)}`,
      studentName,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'Issued' as const
    }];

    try {
      const updated = await programService.updateProgram(progId, {
        certifications: {
          ...prog.certifications,
          generated: prog.certifications.generated + 1,
          issued: prog.certifications.issued + 1,
          list
        }
      });
      if (updated) {
        updated.timeline.unshift({
          date: new Date().toISOString().split('T')[0],
          title: 'Certificates Generated',
          description: `Generated secure PDF completion certificate for ${studentName}.`,
          type: 'cert'
        });
        const refreshed = {
          ...updated,
          organizationData: organizations.find(o => o.id === updated.organizationId)
        };
        setPrograms(programs.map(p => p.id === progId ? refreshed : p));
        showToast(`Certificate issued successfully for ${studentName}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Export roster of programs as CSV
  const handleExportData = () => {
    const headers = ['ID', 'Program Name', 'Code', 'Type', 'Weeks', 'Enrolled', 'Status', 'Completion Rate'];
    const rows = programs.map(p => [
      p.id,
      p.title,
      p.code,
      p.type,
      p.durationWeeks,
      p.studentsEnrolled,
      p.status,
      p.completionRate
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "program_cohorts_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Programs roster CSV downloaded successfully');
  };

  return (
    <div className={`space-y-6 select-none ${
      (activeActionModal?.type === 'edit' || activeActionModal?.type === 'onboard') 
        ? 'h-[calc(100vh-80px)] overflow-hidden relative' 
        : 'animate-slide-in'
    }`}>
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-5 right-5 z-[9999] flex items-center gap-3 px-4 py-3 bg-slate-900 border border-border text-white rounded-xl shadow-2xl animate-bounce-in max-w-sm">
          {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <XCircle className="h-5 w-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <AlertCircle className="h-5 w-5 text-blue-400 shrink-0" />}
          <div className="text-xs font-semibold leading-relaxed">{toast.message}</div>
        </div>
      )}

      {/* Header Sticky Navigation Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 bg-white/60 backdrop-blur-md sticky top-0 z-40">
        <div>
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
            <span>PLMS Console</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold">Program Lifecycles</span>
          </div>
          <h2 className="text-2xl font-black text-text-primary mt-1 tracking-tight flex items-center gap-2">
            Program Workspace
            <span className="text-[10px] bg-slate-100 text-text-secondary px-2 py-0.5 rounded font-mono font-medium">v3.1 (Enterprise)</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveView('dashboard')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'dashboard' 
                  ? 'bg-white text-text-primary shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Executive Dashboard
            </button>
            <button 
              onClick={() => setActiveView('directory')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'directory' 
                  ? 'bg-white text-text-primary shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Program Directory ({filteredPrograms.length})
            </button>
          </div>

          <PermissionGuard required="program.export">
            <button 
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-3 py-2 border border-border hover:border-secondary hover:bg-slate-50 bg-white rounded-lg text-xs font-bold text-text-primary shadow-sm transition-all duration-200 cursor-pointer"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>Export Roster</span>
            </button>
          </PermissionGuard>
          
          <PermissionGuard required="program.create">
            <button 
              onClick={openOnboardModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Program</span>
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* ------------------ VIEW 1: EXECUTIVE DASHBOARD ------------------ */}
      {activeView === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* KPI Dashboard Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Programs', val: kpiStats.total, icon: GraduationCap, color: 'bg-blue-50 text-blue-600 border-blue-100', filter: { name: 'status', val: 'all' } },
              { label: 'Active Cohorts', val: kpiStats.active, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', filter: { name: 'status', val: 'Active' } },
              { label: 'Students Enrolled', val: kpiStats.studentsCount, icon: Users, color: 'bg-sky-50 text-text-secondary border-border', filter: { name: 'status', val: 'all' } },
              { label: 'Active Mentors', val: kpiStats.activeMentors, icon: Award, color: 'bg-indigo-50 text-indigo-600 border-indigo-100', filter: { name: 'status', val: 'all' } },
              { label: 'Avg Completion Rate', val: `${kpiStats.completionRate}%`, icon: Clock, color: 'bg-purple-50 text-purple-600 border-purple-100', filter: { name: 'status', val: 'Completed' } },
              { label: 'Placement Conversion', val: `${kpiStats.placementRate}%`, icon: TrendingUp, color: 'bg-teal-50 text-teal-600 border-teal-100', filter: { name: 'status', val: 'all' } },
              { label: 'Completed Cohorts', val: kpiStats.completed, icon: UserCheck, color: 'bg-cyan-50 text-cyan-600 border-cyan-100', filter: { name: 'status', val: 'Completed' } },
              { label: 'Draft / Pipelines', val: kpiStats.upcoming, icon: AlertCircle, color: 'bg-amber-50 text-amber-600 border-amber-100', filter: { name: 'status', val: 'Draft' } }
            ].map((kpi, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  if (kpi.filter.name === 'status') {
                    setFilterStatus(kpi.filter.val);
                  }
                  setActiveView('directory');
                  showToast(`Roster filtered by: ${kpi.label}`);
                }}
                className="bg-white border border-border hover:border-secondary hover:shadow-md rounded-xl p-4 shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="text-2xl font-black text-text-primary tracking-tight">{kpi.val}</div>
                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">{kpi.label}</div>
                </div>
                <div className={`h-10 w-10 rounded-lg ${kpi.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>

          {/* Analytics Graphs */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Chart 1: Program Category & Enrollments */}
            <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-text-primary tracking-tight flex items-center gap-1.5">
                <Layers className="h-4.5 w-4.5 text-blue-600" />
                Programs by Category & Duration
              </h3>

              <div className="space-y-3">
                {[
                  { type: 'Stipend Internships', count: typeStats['Stipend Internship'] || 0, color: 'bg-blue-600' },
                  { type: 'Corporate Sponsored', count: typeStats['Corporate Sponsored'] || 0, color: 'bg-emerald-600' },
                  { type: 'Free Learning Programs', count: typeStats['Free Internship'] || 0, color: 'bg-purple-600' },
                  { type: 'Paid / Industrial Training', count: typeStats['Paid Internship'] || 0, color: 'bg-amber-500' }
                ].map((item, index) => {
                  const percent = Math.round((item.count / programs.length) * 100) || 0;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-text-primary">
                        <span>{item.type}</span>
                        <span>{item.count} ({percent}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Enrollment Metrics */}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Participant Pipeline Breakdown</div>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-text-primary">
                  <div className="bg-slate-50 border border-border rounded-lg p-2.5 flex justify-between">
                    <span className="text-text-secondary">Enrolled Total</span>
                    <span className="text-text-primary">{kpiStats.studentsCount}</span>
                  </div>
                  <div className="bg-slate-50 border border-border rounded-lg p-2.5 flex justify-between">
                    <span className="text-emerald-600">Active Duty</span>
                    <span className="text-emerald-700">730</span>
                  </div>
                  <div className="bg-slate-50 border border-border rounded-lg p-2.5 flex justify-between">
                    <span className="text-blue-600">Completions</span>
                    <span className="text-blue-700">138</span>
                  </div>
                  <div className="bg-slate-50 border border-border rounded-lg p-2.5 flex justify-between">
                    <span className="text-rose-500">Dropouts</span>
                    <span className="text-rose-600">12</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 2: Top Programs Leaderboard */}
            <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-text-primary tracking-tight flex items-center gap-1.5">
                  <Award className="h-4.5 w-4.5 text-emerald-600" />
                  Top Performing Programs
                </h3>
                
                <select 
                  value={performanceMetric}
                  onChange={(e) => setPerformanceMetric(e.target.value as any)}
                  className="text-[10px] font-bold border border-border rounded p-1 bg-white focus:outline-none"
                >
                  <option value="completion">Completion Rate</option>
                  <option value="attendance">Attendance Rate</option>
                  <option value="placement">Placement Rate</option>
                  <option value="satisfaction">Student Satisfaction</option>
                </select>
              </div>

              <div className="divide-y divide-border">
                {performanceLeaderboard.map((prog, index) => {
                  let valLabel = '';
                  if (performanceMetric === 'completion') {
                    valLabel = `${prog.completionRate}% Completion`;
                  } else if (performanceMetric === 'attendance') {
                    valLabel = `${prog.analytics.attendanceRate}% Attendance`;
                  } else if (performanceMetric === 'placement') {
                    valLabel = `${prog.analytics.placementRate}% Placed`;
                  } else {
                    valLabel = `${prog.analytics.satisfactionScore}/5.0 Star`;
                  }

                  return (
                    <div 
                      key={prog.id} 
                      onClick={() => handleOpenProfile(prog)}
                      className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-black text-text-secondary w-4">{index + 1}</span>
                        <div className="h-7 w-7 rounded bg-blue-50 text-blue-600 font-extrabold text-[10px] flex items-center justify-center shrink-0">
                          {prog.code.slice(0, 3)}
                        </div>
                        <div className="max-w-[150px] truncate">
                          <div className="text-xs font-bold text-text-primary group-hover:text-blue-600 transition-colors truncate">{prog.title}</div>
                          <div className="text-[10px] text-text-secondary font-semibold">{prog.code}</div>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-blue-600">{valLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 3: Mentor Contribution Scorecard */}
            <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-text-primary tracking-tight flex items-center gap-1.5">
                <UserCheck className="h-4.5 w-4.5 text-indigo-600" />
                Senior Mentor Contribution
              </h3>

              <div className="space-y-3">
                {mentorContributions.map((mentor, idx) => (
                  <div key={idx} className="bg-slate-50 border border-border rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-extrabold text-text-primary leading-none">{mentor.name}</div>
                        <div className="text-[9px] font-bold text-text-secondary mt-1">{mentor.department} Division</div>
                      </div>
                      <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[8px] font-bold border border-amber-100 flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                        {mentor.rating}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] font-bold text-text-secondary border-t border-border/60 pt-1.5">
                      <div>
                        <div className="text-text-primary">{mentor.assignedStudents}</div>
                        <div className="text-[7px] text-text-secondary uppercase">Interns</div>
                      </div>
                      <div>
                        <div className="text-text-primary">{mentor.sessionsConducted}</div>
                        <div className="text-[7px] text-text-secondary uppercase">Sessions</div>
                      </div>
                      <div>
                        <div className="text-emerald-600">{mentor.successRate}%</div>
                        <div className="text-[7px] text-text-secondary uppercase">Success</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Activity Feed */}
          <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-text-primary tracking-tight flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-text-primary" />
              PLMS Program Milestone timeline
            </h3>

            <div className="divide-y divide-border max-h-[350px] overflow-y-auto pr-1">
              {recentActivities.map((act, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    const match = programs.find(p => p.id === act.progId);
                    if (match) handleOpenProfile(match);
                  }}
                  className="py-3 flex items-start gap-4 hover:bg-slate-50/50 px-2 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="h-8 w-8 rounded bg-slate-100 text-text-primary font-extrabold text-[10px] flex items-center justify-center shrink-0">
                    {act.progTitle.split(' ').map(n => n[0]).join('').slice(0, 3)}
                  </div>
                  
                  <div className="flex-1 space-y-0.5 text-xs">
                    <div className="font-extrabold text-text-primary group-hover:text-blue-600 transition-colors">{act.progTitle}</div>
                    <div className="text-text-primary font-semibold leading-relaxed">
                      {act.event.title} — <span className="text-text-secondary font-normal">{act.event.description}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-text-secondary font-bold shrink-0">{act.event.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------ VIEW 2: PROGRAM DIRECTORY ------------------ */}
      {activeView === 'directory' && (
        <div className="bg-white border border-border rounded-xl shadow-xs overflow-hidden">
          <EnhancedTable<ProgramWithOrg>
            data={filteredPrograms}
            searchPlaceholder="Search programs (Name, Code, Type, Domain, Mentor)..."
            itemsPerPage={10}
            columns={[
              {
                key: 'select',
                label: '',
                render: (prog) => (
                  <input 
                    type="checkbox"
                    checked={selectedIds.includes(prog.id)}
                    onChange={() => toggleSelect(prog.id)}
                    className="rounded border-border h-3.5 w-3.5 text-blue-600 focus:ring-primary cursor-pointer"
                  />
                ),
              },
              {
                key: 'name',
                label: 'Program Name',
                render: (prog) => (
                  <div onClick={() => handleOpenProfile(prog)} className="flex items-center gap-2.5 cursor-pointer">
                    <div className="h-8 w-8 rounded bg-blue-50 text-blue-600 font-extrabold text-xs flex items-center justify-center shrink-0">
                      {prog.code.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-bold text-text-primary hover:text-blue-600 transition-colors">{prog.title}</div>
                      <div className="text-[10px] text-text-secondary">{prog.metadata.category}</div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'code',
                label: 'Program Code',
                render: (prog) => <span className="font-mono font-bold text-text-secondary">{prog.code}</span>,
              },
              {
                key: 'type',
                label: 'Program Type',
                render: (prog) => <span className="text-text-primary font-bold">{prog.type}</span>,
              },
              {
                key: 'duration',
                label: 'Duration',
                render: (prog) => <span className="text-text-secondary font-medium">{prog.durationWeeks} Weeks</span>,
              },
              {
                key: 'dates',
                label: 'Start - End',
                render: (prog) => <span className="text-text-secondary">{prog.startDate} to {prog.endDate}</span>,
              },
              {
                key: 'studentsEnrolled',
                label: 'Enrolled',
                render: (prog) => <span className="text-text-primary font-bold">{prog.studentsEnrolled}</span>,
              },
              {
                key: 'completionRate',
                label: 'Completion %',
                render: (prog) => <span className="text-blue-600 font-extrabold">{prog.completionRate}%</span>,
              },
              {
                key: 'status',
                label: 'Status',
                render: (prog) => (
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black ${
                    prog.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : prog.status === 'Completed'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : prog.status === 'Draft'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-text-secondary border border-border'
                  }`}>
                    {prog.status}
                  </span>
                ),
              },
              {
                key: 'actions',
                label: 'Actions',
                className: 'text-right',
                render: (prog) => (
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => handleOpenProfile(prog)} className="p-1 hover:bg-slate-100 rounded text-text-secondary hover:text-text-primary cursor-pointer" title="Open Profile Program">
                      <Eye className="h-4 w-4" />
                    </button>
                    <PermissionGuard required="program.edit">
                      <button onClick={() => openEditModal(prog)} className="p-1 hover:bg-slate-100 rounded text-text-secondary hover:text-text-primary cursor-pointer" title="Edit Program Details">
                        <Edit className="h-4 w-4" />
                      </button>
                    </PermissionGuard>
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* ------------------ BULK ACTIONS PANEL ------------------ */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-border text-white rounded-xl shadow-2xl px-6 py-4 flex flex-col md:flex-row items-center gap-4 animate-slide-up max-w-4xl w-[90%]">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white h-6 w-6 rounded-full flex items-center justify-center font-extrabold text-xs">
              {selectedIds.length}
            </div>
            <span className="text-xs font-bold">Programs selected</span>
          </div>

          <div className="h-px md:h-6 w-full md:w-px bg-slate-800 my-1 md:my-0" />

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2.5 items-center justify-center w-full md:w-auto">
            <button 
              onClick={() => {
                setStatusInput('Active');
                setActiveActionModal({ type: 'bulkStatus' });
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-border px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              Bulk Change Status
            </button>
            <button 
              onClick={() => {
                setMentorInput('');
                setActiveActionModal({ type: 'bulkMentor' });
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-border px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              Assign Mentor
            </button>
            <button 
              onClick={() => {
                setNotifyMsg('');
                setActiveActionModal({ type: 'bulkNotify' });
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-border px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors text-blue-400"
            >
              Send notification
            </button>
            <button 
              onClick={() => {
                setActiveActionModal({ type: 'bulkCert' });
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-border px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors text-emerald-400"
            >
              Generate Certificates
            </button>
          </div>

          <button 
            onClick={() => setSelectedIds([])}
            className="text-xs font-bold text-text-secondary hover:text-white underline shrink-0 cursor-pointer ml-auto"
          >
            Cancel Selection
          </button>
        </div>
      )}

      {/* ------------------ PROFILE DRAWER (RIGHT PANEL SPLIT VIEW) ------------------ */}
      <Drawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        title="Program Command Workspace"
      >
        {activeProfile ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 text-text-primary select-none">
            
            {/* STICKY HEADER ACCENTS PANEL */}
            <div className="bg-slate-900 text-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-lg border-b border-border">
              
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded bg-slate-800 text-slate-200 border border-border flex items-center justify-center font-black text-lg shrink-0 shadow-md">
                  {activeProfile.code.slice(0, 3)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white tracking-tight">{activeProfile.title}</h3>
                    <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold border border-border">
                      {activeProfile.code}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-none mt-1 font-semibold">
                    {activeProfile.type} — <span className="text-slate-300 font-bold">{activeProfile.durationWeeks} Weeks</span>
                  </p>
                </div>
              </div>

              {/* Sticky action buttons list */}
              <div className="flex items-center flex-wrap gap-2">
                <PermissionGuard required="program.edit">
                  <button 
                    onClick={() => openEditModal(activeProfile)}
                    className="bg-slate-800 hover:bg-slate-700 border border-border text-white px-2.5 py-1.5 rounded text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit Info</span>
                  </button>
                </PermissionGuard>
                <button 
                  onClick={() => {
                    setStatusInput('Active');
                    setActiveActionModal({ type: 'status' });
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-border text-white px-2.5 py-1.5 rounded text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3 text-emerald-400" />
                  <span>Status</span>
                </button>
                <button 
                  onClick={() => {
                    setModuleForm({ name: '', topicsString: '', outcomesString: '', assessmentsString: '', assignmentsString: '', projectsString: '' });
                    setActiveActionModal({ type: 'module' });
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-border text-white px-2.5 py-1.5 rounded text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center gap-1 text-purple-400"
                >
                  <PlusCircle className="h-3 w-3" />
                  <span>Add Module</span>
                </button>
                <button 
                  onClick={() => {
                    setMentorInput('');
                    setActiveActionModal({ type: 'mentor' });
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-border text-white px-2.5 py-1.5 rounded text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center gap-1 text-text-secondary"
                >
                  <UserCheck className="h-3 w-3" />
                  <span>Mentor</span>
                </button>
                <button 
                  onClick={() => {
                    setNotifyMsg('');
                    setActiveActionModal({ type: 'notify' });
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-border text-white px-2.5 py-1.5 rounded text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center gap-1 text-blue-400"
                >
                  <Send className="h-3 w-3" />
                  <span>Notify</span>
                </button>
                <button 
                  onClick={() => {
                    showToast(`Single Program placement audit compiled & exported for ${activeProfile.title}`);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-border text-slate-300 hover:text-white p-1.5 rounded cursor-pointer"
                  title="Export Data Summary"
                >
                  <FileDown className="h-4 w-4" />
                </button>
              </div>

            </div>

            {/* TAB STRIP */}
            <div className="bg-white border-b border-border px-6 overflow-x-auto flex shrink-0 scrollbar-none">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'types', label: 'Internship Classifications' },
                { id: 'curriculum', label: 'Curriculum' },
                { id: 'enrollments', label: 'Participant Management' },
                { id: 'mentors', label: 'Mentors & Staff' },
                { id: 'analytics', label: 'Performance Analytics' },
                { id: 'certifications', label: 'Certifications Management' },
                { id: 'metadata', label: 'Domain Settings' },
                { id: 'timeline', label: 'Timeline History' }
              ].map((tab) => {
                const isActive = profileTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setProfileTab(tab.id as any)}
                    className={`py-3 px-4 font-bold text-xs border-b-2 transition-all shrink-0 cursor-pointer ${
                      isActive 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TABS CONTAINER */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: OVERVIEW */}
              {profileTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* General Program Info */}
                    <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-3">
                      <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                        Program Information
                      </h4>
                      
                      <div className="divide-y divide-border text-xs font-semibold">
                        {[
                          { label: 'Title', val: activeProfile.title },
                          { label: 'Program Code', val: activeProfile.code },
                          { label: 'Classification', val: activeProfile.type },
                          { label: 'Duration Weeks', val: `${activeProfile.durationWeeks} Weeks` },
                          { label: 'Capacity limit', val: activeProfile.capacity },
                          { label: 'Eligibility', val: activeProfile.eligibility }
                        ].map((row, idx) => (
                          <div key={idx} className="py-2.5 flex justify-between">
                            <span className="text-text-secondary">{row.label}</span>
                            <span className="text-text-primary text-right max-w-[60%] leading-relaxed">{row.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational performance snapshot */}
                    <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-3">
                      <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-emerald-600" />
                        Performance Snapshot
                      </h4>

                      <div className="divide-y divide-border text-xs font-semibold">
                        {[
                          { label: 'Total Enrollments', val: activeProfile.studentsEnrolled },
                          { label: 'Active Students Count', val: activeProfile.enrollments.filter(e => e.status === 'Approved').length },
                          { label: 'Completion Rate', val: `${activeProfile.completionRate}%` },
                          { label: 'Placement Rate', val: `${activeProfile.analytics.placementRate}%` },
                          { label: 'Assigned Mentors', val: activeProfile.mentorsAssigned },
                          { label: 'Academic Partner', val: activeProfile.organizationData?.name || 'Stanford University' }
                        ].map((row, idx) => (
                          <div key={idx} className="py-2.5 flex justify-between">
                            <span className="text-text-secondary">{row.label}</span>
                            <span className="text-text-primary font-extrabold">{row.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 2: INTERNSHIP CLASSIFICATIONS */}
              {profileTab === 'types' && (
                <div className="space-y-6 animate-fade-in animate-slide-down">
                  
                  <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">
                    Internship Program Classifications
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { type: 'Free Internship', fee: 'Free', rules: 'Direct Certification upon completion', benefit: 'Academic credits mapping, baseline skills assessment' },
                      { type: 'Paid Internship', fee: '$500 Enrolment', rules: 'Must clear assessments with score > 80%', benefit: 'Industrial project sponsorship, HOD accreditation' },
                      { type: 'Stipend Internship', fee: 'Funded (+$300/mo)', rules: 'YubiKey check and attendance verification', benefit: 'Stipend disbursement, mentor feedback dashboard' },
                      { type: 'Corporate Sponsored', fee: 'Sponsored by Partner', rules: 'Direct matching for corporate placement drives', benefit: 'Custom domain training, pre-placement review opportunities' },
                      { type: 'Research Program', fee: 'Sponsorship Grant', rules: 'Weekly progress reports & blueprint submission', benefit: 'Accreditation certificates, research publication scope' }
                    ].map((row) => (
                      <div key={row.type} className="bg-white border border-border rounded-xl p-4.5 shadow-sm space-y-2">
                        <div className="flex justify-between items-center border-b border-border pb-2 mb-2">
                          <h5 className="font-extrabold text-text-primary text-xs">{row.type}</h5>
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[8px] font-black border border-blue-100">
                            {row.fee}
                          </span>
                        </div>
                        <div className="text-[10px] font-semibold text-text-secondary space-y-1">
                          <div>Benefits: <span className="text-text-primary leading-relaxed block mt-0.5 font-medium">{row.benefit}</span></div>
                          <div className="pt-1.5">Rules: <span className="text-text-primary leading-relaxed block mt-0.5 font-medium">{row.rules}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 3: CURRICULUM MANAGEMENT */}
              {profileTab === 'curriculum' && (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">
                      Structured Program Curriculum
                    </h4>
                    
                    <button 
                      onClick={() => {
                        setModuleForm({ name: '', topicsString: '', outcomesString: '', assessmentsString: '', assignmentsString: '', projectsString: '' });
                        setActiveActionModal({ type: 'module' });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-150 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Curriculum Module</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {activeProfile.curriculum.map((mod, idx) => (
                      <div key={idx} className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-3">
                        <h5 className="font-extrabold text-sm text-text-primary border-b border-border pb-2">{mod.name}</h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-text-secondary">
                          
                          <div className="space-y-1">
                            <div className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Topics Covered</div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {mod.topics.map((t, tIdx) => (
                                <span key={tIdx} className="bg-slate-100 text-text-primary text-[10px] font-bold px-2 py-0.5 rounded">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Learning Outcomes</div>
                            <ul className="list-disc pl-4 space-y-0.5 pt-1">
                              {mod.learningOutcomes.map((o, oIdx) => (
                                <li key={oIdx}>{o}</li>
                              ))}
                            </ul>
                          </div>

                        </div>

                        <div className="border-t border-border pt-3.5 grid grid-cols-3 gap-4 text-[10px] font-bold">
                          <div className="bg-slate-50 border border-border rounded-lg p-2.5">
                            <div className="text-text-secondary uppercase text-[8px] tracking-wider mb-0.5">Assessments</div>
                            <div className="text-text-primary">{mod.assessments.join(', ') || 'None'}</div>
                          </div>
                          <div className="bg-slate-50 border border-border rounded-lg p-2.5">
                            <div className="text-text-secondary uppercase text-[8px] tracking-wider mb-0.5">Assignments</div>
                            <div className="text-text-primary">{mod.assignments.join(', ') || 'None'}</div>
                          </div>
                          <div className="bg-slate-50 border border-border rounded-lg p-2.5">
                            <div className="text-text-secondary uppercase text-[8px] tracking-wider mb-0.5">Capstone Projects</div>
                            <div className="text-text-primary">{mod.projects.join(', ') || 'None'}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 4: ENROLLMENT MANAGEMENT */}
              {profileTab === 'enrollments' && (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">
                      Active Student Roster
                    </h4>
                  </div>

                  {/* Enrollments Table */}
                  <EnhancedTable
                    data={activeProfile.enrollments}
                    searchPlaceholder="Search enrollments..."
                    itemsPerPage={5}
                    emptyMessage="No active enrollments for this program."
                    columns={[
                      {
                        key: 'name',
                        label: 'Student Name',
                        render: (enr) => (
                          <div>
                            <div className="font-extrabold text-text-primary">{enr.name}</div>
                            <div className="text-[9px] text-text-secondary font-mono">{enr.id}</div>
                          </div>
                        ),
                      },
                      {
                        key: 'college',
                        label: 'College / Org',
                        render: (enr) => <span className="text-text-secondary font-medium">{enr.college}</span>,
                      },
                      {
                        key: 'department',
                        label: 'Department',
                        render: (enr) => <span className="text-text-secondary font-semibold">{enr.department}</span>,
                      },
                      {
                        key: 'enrollmentDate',
                        label: 'Enrollment Date',
                        render: (enr) => <span className="text-text-secondary font-medium">{enr.enrollmentDate}</span>,
                      },
                      {
                        key: 'attendance',
                        label: 'Attendance',
                        render: (enr) => <span className="font-extrabold text-text-primary">{enr.attendance}%</span>,
                      },
                      {
                        key: 'performance',
                        label: 'Performance',
                        render: (enr) => <span className="font-extrabold text-blue-600">{enr.performance} / 100</span>,
                      },
                      {
                        key: 'status',
                        label: 'Status',
                        render: (enr) => (
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold ${
                            enr.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-text-secondary'
                          }`}>
                            {enr.status}
                          </span>
                        ),
                      },
                      {
                        key: 'actions',
                        label: 'Actions',
                        className: 'text-right',
                        render: (enr) => (
                          <div className="flex gap-2 justify-end" onClick={e => e.stopPropagation()}>
                            {enr.status !== 'Approved' && (
                              <button 
                                onClick={() => handleEnrollmentStatus(activeProfile?.id, enr.id, 'Approved')}
                                className="text-emerald-600 hover:text-emerald-700 font-bold"
                              >
                                Approve
                              </button>
                            )}
                            {enr.status !== 'Rejected' && (
                              <button 
                                onClick={() => handleEnrollmentStatus(activeProfile?.id, enr.id, 'Rejected')}
                                className="text-rose-600 hover:text-rose-700 font-bold"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        ),
                      },
                    ]}
                  />

                </div>
              )}

              {/* TAB 5: MENTOR MANAGEMENT */}
              {profileTab === 'mentors' && (
                <div className="space-y-6 animate-fade-in animate-slide-down">
                  
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">
                      Program Mentors Mapped
                    </h4>
                    
                    <button 
                      onClick={() => {
                        setMentorInput('');
                        setActiveActionModal({ type: 'mentor' });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-150 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Map Program Mentor</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeProfile.mentors.map((m, idx) => (
                      <div key={idx} className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-extrabold text-text-primary text-xs leading-none">{m.name}</h5>
                            <p className="text-[9px] text-text-secondary font-bold mt-1.5 uppercase tracking-wider">{m.department}</p>
                          </div>
                          
                          <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[8px] font-bold border border-amber-200 flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {m.rating}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                          <div className="bg-slate-50 border border-border rounded-lg p-2">
                            <div className="text-text-primary">{m.assignedStudents}</div>
                            <div className="text-[8px] text-text-secondary uppercase mt-0.5">Guided</div>
                          </div>
                          <div className="bg-slate-50 border border-border rounded-lg p-2">
                            <div className="text-text-primary">{m.sessionsConducted}</div>
                            <div className="text-[8px] text-text-secondary uppercase mt-0.5">Sessions</div>
                          </div>
                          <div className="bg-slate-50 border border-border rounded-lg p-2">
                            <div className="text-emerald-600">{m.successRate}%</div>
                            <div className="text-[8px] text-text-secondary uppercase mt-0.5">Completion</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 6: PERFORMANCE ANALYTICS */}
              {profileTab === 'analytics' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* KPI Overview */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    {[
                      { label: 'Overall Completion Rate', val: `${activeProfile.completionRate}%`, icon: Clock, color: 'text-purple-600 bg-purple-50/40' },
                      { label: 'Average Score Test', val: `${activeProfile.analytics.avgScore}%`, icon: Award, color: 'text-blue-600 bg-blue-50/40' },
                      { label: 'Placement Rate', val: `${activeProfile.analytics.placementRate}%`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50/40' },
                      { label: 'Satisfaction Rating', val: `${activeProfile.analytics.satisfactionScore} / 5`, icon: Star, color: 'text-amber-600 bg-amber-50/40' }
                    ].map((kpi, idx) => (
                      <div key={idx} className="bg-white border border-border rounded-xl p-4 shadow-sm flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${kpi.color}`}>
                          <kpi.icon className="h-5 w-5" />
                        </div>
                        <div className="text-left leading-none">
                          <div className="text-lg font-black text-text-primary">{kpi.val}</div>
                          <div className="text-[8px] font-bold text-text-secondary uppercase tracking-wider mt-1">{kpi.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SVG charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* SVG Line chart for attendance */}
                    <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
                      <h5 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">Attendance Trend (Weekly)</h5>
                      
                      <div className="h-44 w-full bg-slate-50 border border-border rounded-lg p-4 flex flex-col justify-between">
                        <div className="flex justify-between text-[10px] text-text-secondary font-bold border-b border-border pb-1">
                          <span>Attendance Rate (%)</span>
                          <span>Trend Range: 3 Weeks</span>
                        </div>
                        
                        <div className="relative flex-1 flex items-end justify-between px-6 pt-6">
                          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50 py-3">
                            <div className="border-b border-dashed border-border w-full" />
                          </div>

                          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path 
                              d="M 10,20 L 50,45 L 90,30" 
                              fill="none" 
                              stroke="#6366f1" 
                              strokeWidth="3" 
                              strokeLinecap="round"
                            />
                            <circle cx="10" cy="20" r="4" fill="#6366f1" />
                            <circle cx="50" cy="45" r="4" fill="#6366f1" />
                            <circle cx="90" cy="30" r="4" fill="#6366f1" />
                          </svg>

                          {activeProfile.analytics.attendanceTrend.map((t, idx) => (
                            <div key={idx} className="z-10 flex flex-col items-center">
                              <span className="text-[10px] font-black text-text-primary bg-white border border-border rounded px-1 shadow-sm mb-1">{t.rate}%</span>
                              <span className="text-[10px] font-bold text-text-secondary">{t.week}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* SVG Quiz performance */}
                    <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
                      <h5 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">Average Assessment Performance</h5>
                      
                      <div className="space-y-4">
                        {activeProfile.analytics.assessmentPerformance.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-text-primary">
                              <span>{item.testName}</span>
                              <span className="font-extrabold text-text-primary">{item.avgScore}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.avgScore}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 7: CERTIFICATION MANAGEMENT */}
              {profileTab === 'certifications' && (
                <div className="space-y-6 animate-fade-in animate-slide-down">
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
                      <div className="text-2xl font-black text-emerald-600">{activeProfile.certifications.issued}</div>
                      <div className="text-[9px] font-bold text-text-secondary uppercase tracking-wider mt-1">Certificates Issued</div>
                    </div>
                    <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
                      <div className="text-2xl font-black text-amber-600">{activeProfile.certifications.pending}</div>
                      <div className="text-[9px] font-bold text-text-secondary uppercase tracking-wider mt-1">Certificates Pending</div>
                    </div>
                    <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
                      <div className="text-2xl font-black text-text-primary">{activeProfile.certifications.generated}</div>
                      <div className="text-[9px] font-bold text-text-secondary uppercase tracking-wider mt-1">Total Generated</div>
                    </div>
                  </div>

                  {/* Certificates Actions Table */}
                  <EnhancedTable
                    data={activeProfile.enrollments.slice(0, 10).map(enr => ({
                      ...enr,
                      issuedCert: activeProfile.certifications.list.find(c => c.studentName === enr.name)
                    }))}
                    searchPlaceholder="Search certificates..."
                    itemsPerPage={5}
                    emptyMessage="No enrollment records found."
                    columns={[
                      {
                        key: 'id',
                        label: 'Certificate ID',
                        render: (item) => (
                          <span className="font-mono font-bold text-text-secondary">
                            {item.issuedCert ? item.issuedCert.id : 'N/A'}
                          </span>
                        ),
                      },
                      {
                        key: 'name',
                        label: 'Student Name',
                        render: (item) => <span className="font-bold text-text-primary">{item.name}</span>,
                      },
                      {
                        key: 'issuedCert',
                        label: 'Date Issued',
                        render: (item) => (
                          <span className="text-text-secondary font-medium">
                            {item.issuedCert ? item.issuedCert.issueDate : 'Not Issued'}
                          </span>
                        ),
                      },
                      {
                        key: 'issuedCert',
                        label: 'Status',
                        render: (item) => (
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold ${
                            item.issuedCert?.status === 'Issued' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-text-secondary'
                          }`}>
                            {item.issuedCert ? item.issuedCert.status : 'Pending'}
                          </span>
                        ),
                      },
                      {
                        key: 'actions',
                        label: 'Actions',
                        className: 'text-right',
                        render: (item) => (
                          <div className="flex gap-2 justify-end" onClick={e => e.stopPropagation()}>
                            {!item.issuedCert && (
                              <button 
                                onClick={() => handleGenerateCertificate(activeProfile?.id, item.name)}
                                className="text-blue-600 hover:text-blue-700 font-bold"
                              >
                                Generate Certificate
                              </button>
                            )}
                            {item.issuedCert && (
                              <button 
                                onClick={() => {
                                  showToast(`Revoking certificate ID ${item.issuedCert?.id}`, 'info');
                                }}
                                className="text-rose-600 hover:text-rose-700 font-bold"
                              >
                                Revoke
                              </button>
                            )}
                          </div>
                        ),
                      },
                    ]}
                  />

                </div>
              )}

              {/* TAB 8: DOMAIN SETTINGS */}
              {profileTab === 'metadata' && (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-blue-600" />
                      Domain & Technology Metadata
                    </h4>

                    <div className="divide-y divide-border text-xs font-semibold">
                      <div className="py-3 flex justify-between">
                        <span className="text-text-secondary">Program Category</span>
                        <span className="text-text-primary font-extrabold">{activeProfile.metadata.category}</span>
                      </div>
                      <div className="py-3 flex justify-between">
                        <span className="text-text-secondary">Industry Domain Scope</span>
                        <span className="text-text-primary font-extrabold">{activeProfile.metadata.domain}</span>
                      </div>
                      <div className="py-3 flex justify-between">
                        <span className="text-text-secondary">Cognitive Level</span>
                        <span className="text-text-primary font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                          {activeProfile.metadata.level}
                        </span>
                      </div>
                      
                      <div className="py-3.5 space-y-1.5">
                        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Technology Stack</div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeProfile.metadata.techStack.map((tech, idx) => (
                            <span key={idx} className="bg-slate-100 text-text-primary text-[10px] font-bold px-2 py-0.5 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="py-3.5 space-y-1.5">
                        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Core Skills Taught</div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeProfile.metadata.skills.map((skill, idx) => (
                            <span key={idx} className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="py-3 flex justify-between items-center">
                        <span className="text-text-secondary">Certification Template Type</span>
                        <span className="text-text-primary font-extrabold">{activeProfile.metadata.certType}</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 9: TIMELINE */}
              {profileTab === 'timeline' && (
                <div className="space-y-6 animate-fade-in">
                  
                  <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">
                    Program Milestones Timeline
                  </h4>

                  <div className="relative border-l-2 border-border pl-6 space-y-6 ml-2 py-2">
                    {activeProfile.timeline.map((evt, idx) => (
                      <div key={idx} className="relative">
                        
                        <div className={`absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-white flex items-center justify-center ${
                          evt.type === 'created' ? 'bg-blue-600' :
                          evt.type === 'curriculum' ? 'bg-purple-600' :
                          evt.type === 'enrollment' ? 'bg-sky-500' :
                          evt.type === 'mentor' ? 'bg-indigo-600' :
                          evt.type === 'assessment' ? 'bg-rose-500' :
                          evt.type === 'cert' ? 'bg-emerald-500' :
                          'bg-slate-400'
                        }`} />
                        
                        <div className="text-xs">
                          <span className="font-mono font-bold text-text-secondary">{evt.date}</span>
                          <h5 className="font-extrabold text-text-primary mt-0.5">{evt.title}</h5>
                          <p className="text-text-secondary mt-0.5 font-medium leading-relaxed">
                            {evt.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-secondary">
            Select a program cohort from the directory to inspect.
          </div>
        )}
      </Drawer>

      {/* ------------------ OPERATIONAL MODALS ------------------ */}
      {activeActionModal && (
        <div className={`z-[100] flex transition-all ${
          (activeActionModal.type === 'edit' || activeActionModal.type === 'onboard') 
            ? 'absolute inset-0 bg-white p-0 items-start justify-stretch' 
            : 'fixed inset-0 bg-slate-900/50 backdrop-blur-sm p-4 items-center justify-center'
        }`}>
          <div className={`bg-white overflow-hidden transition-all duration-300 ${
            (activeActionModal.type === 'edit' || activeActionModal.type === 'onboard') 
              ? 'max-w-none w-full h-full rounded-none border-none flex flex-col' 
              : 'border border-border rounded-xl shadow-2xl max-w-lg w-full animate-bounce-in'
          }`}>
            
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-border px-6 py-4 flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-text-primary uppercase tracking-wide">
                {activeActionModal.type === 'status' && 'Transition Program status'}
                {activeActionModal.type === 'mentor' && 'Assign Advisor / Program Mentor'}
                {activeActionModal.type === 'module' && 'Create Curriculum Module'}
                {activeActionModal.type === 'edit' && 'Edit Program Information'}
                {activeActionModal.type === 'onboard' && 'Create Program Cohort'}
                {activeActionModal.type === 'notify' && 'Dispatch Notification'}
                
                {/* Bulk Actions */}
                {activeActionModal.type === 'bulkStatus' && 'Bulk Program status transition'}
                {activeActionModal.type === 'bulkMentor' && 'Bulk Assign Mentors'}
                {activeActionModal.type === 'bulkNotify' && 'Bulk Dispatch Notifications'}
                {activeActionModal.type === 'bulkCert' && 'Bulk Certificate Generation & Verification'}
              </h3>
              
              <button 
                onClick={() => setActiveActionModal(null)}
                className="text-xs font-bold text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
            </div>

            {/* Forms body */}
            <form 
              onSubmit={executeAction} 
              className={`text-xs font-semibold text-text-primary flex flex-col min-h-0 ${
                (activeActionModal.type === 'edit' || activeActionModal.type === 'onboard') 
                  ? 'p-8 space-y-6 flex-1 h-full justify-between' 
                  : 'p-6 space-y-4'
              }`}
            >
              
              {/* Form 1: Program status */}
              {(activeActionModal.type === 'status' || activeActionModal.type === 'bulkStatus') && (
                <div className="space-y-3">
                  <label className="block text-text-secondary">Select Program Stage Status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as any)}
                    className="w-full p-2.5 border border-border rounded-lg bg-white font-semibold text-xs focus:outline-none"
                  >
                    <option value="Draft">Draft Stage</option>
                    <option value="Upcoming">Upcoming Program</option>
                    <option value="Open Enrollment">Open Enrollment</option>
                    <option value="Active">Active / Ongoing</option>
                    <option value="Completed">Completed Cohort</option>
                    <option value="Archived">Archived / Legacy</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                  
                  {activeActionModal.type === 'bulkStatus' ? (
                    <button 
                      type="button"
                      onClick={() => executeBulkAction('status')}
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                    >
                      Apply Bulk Status Change ({selectedIds.length} programs)
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                    >
                      Save Program Status
                    </button>
                  )}
                </div>
              )}

              {/* Form 2: Program Mentor assignment */}
              {(activeActionModal.type === 'mentor' || activeActionModal.type === 'bulkMentor') && (
                <div className="space-y-3">
                  <label className="block text-text-secondary">Select Program Mentor</label>
                  <select
                    value={mentorInput}
                    onChange={(e) => setMentorInput(e.target.value)}
                    className="w-full p-2.5 border border-border rounded-lg bg-white font-semibold text-xs focus:outline-none"
                  >
                    <option value="">Choose Mentor...</option>
                    <option value="emp-1">Charlie Davis (Leadership)</option>
                    <option value="emp-2">Bob Johnson (Engineering)</option>
                    <option value="emp-3">Diana Prince (Academics)</option>
                  </select>
                  
                  {activeActionModal.type === 'bulkMentor' ? (
                    <button 
                      type="button"
                      onClick={() => executeBulkAction('mentor')}
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                    >
                      Assign Mentor to Group ({selectedIds.length} programs)
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                    >
                      Map Program Mentor
                    </button>
                  )}
                </div>
              )}

              {/* Form 3: Notification dispatcher */}
              {(activeActionModal.type === 'notify' || activeActionModal.type === 'bulkNotify') && (
                <div className="space-y-3">
                  <label className="block text-text-secondary">System Notification Content Message</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Dispatches notifications to enrolled student cohort dashboard..."
                    value={notifyMsg}
                    onChange={(e) => setNotifyMsg(e.target.value)}
                    className="w-full p-2.5 border border-border rounded-lg bg-white focus:outline-none text-xs font-semibold leading-relaxed"
                  />
                  
                  {activeActionModal.type === 'bulkNotify' ? (
                    <button 
                      type="button"
                      onClick={() => executeBulkAction('notify')}
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                    >
                      Dispatch Bulk Notifications ({selectedIds.length} selected)
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                    >
                      Dispatch Notification
                    </button>
                  )}
                </div>
              )}

              {/* Form 4: Add module */}
              {activeActionModal.type === 'module' && (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  <div className="space-y-1">
                    <label className="block text-text-secondary">Curriculum Module Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Module 3: Docker & Cloud Deployment"
                      value={moduleForm.name}
                      onChange={(e) => setModuleForm({ ...moduleForm, name: e.target.value })}
                      className="w-full p-2 border border-border rounded focus:outline-none"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-text-secondary">Topics Covered (Comma separated)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Dockerfiles, Kubernetes, ECS, VPC"
                      value={moduleForm.topicsString}
                      onChange={(e) => setModuleForm({ ...moduleForm, topicsString: e.target.value })}
                      className="w-full p-2 border border-border rounded focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-text-secondary">Learning Outcomes (Comma separated)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Deploy containerized apps, Manage subnets"
                      value={moduleForm.outcomesString}
                      onChange={(e) => setModuleForm({ ...moduleForm, outcomesString: e.target.value })}
                      className="w-full p-2 border border-border rounded focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="block text-text-secondary">Assessments</label>
                      <input 
                        type="text" 
                        placeholder="Cloud Quiz"
                        value={moduleForm.assessmentsString}
                        onChange={(e) => setModuleForm({ ...moduleForm, assessmentsString: e.target.value })}
                        className="w-full p-2 border border-border rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-text-secondary">Assignments</label>
                      <input 
                        type="text" 
                        placeholder="Deploy API"
                        value={moduleForm.assignmentsString}
                        onChange={(e) => setModuleForm({ ...moduleForm, assignmentsString: e.target.value })}
                        className="w-full p-2 border border-border rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-text-secondary">Capstone Project</label>
                      <input 
                        type="text" 
                        placeholder="SaaS Deployment"
                        value={moduleForm.projectsString}
                        onChange={(e) => setModuleForm({ ...moduleForm, projectsString: e.target.value })}
                        className="w-full p-2 border border-border rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-2 cursor-pointer"
                  >
                    Publish Curriculum Module
                  </button>
                </div>
              )}

              {/* Form 5: Bulk Certifications */}
              {activeActionModal.type === 'bulkCert' && (
                <div className="space-y-3">
                  <div className="bg-slate-50 border border-border rounded-lg p-3 text-xs leading-relaxed text-text-secondary">
                    You are generating PDF certificates with verified academic sign-offs for all enrollments in the selected **{selectedIds.length}** cohorts.
                  </div>
                  <button 
                    type="button"
                    onClick={() => executeBulkAction('cert')}
                    className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                  >
                    Confirm Bulk Issuance
                  </button>
                </div>
              )}

              {/* Form 6 & 7: Onboard / Edit Program Details */}
              {(activeActionModal.type === 'edit' || activeActionModal.type === 'onboard') && (
                <div className="space-y-6 max-w-5xl mx-auto w-full flex-1 flex flex-col justify-start overflow-hidden pt-4">
                  
                  {/* Section 1 */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-border pb-1">
                      Section 1: Program Identity
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Program Title Name</label>
                        <input 
                          type="text" 
                          required
                          value={programForm.title}
                          onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                          className="w-full p-2 border border-border rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Program Code</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. SEI-2026"
                          value={programForm.code}
                          onChange={(e) => setProgramForm({ ...programForm, code: e.target.value })}
                          className="w-full p-2 border border-border rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Program Classification Type</label>
                        <select 
                          value={programForm.type}
                          onChange={(e) => setProgramForm({ ...programForm, type: e.target.value as any })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        >
                          <option value="Free Internship">Free Internship</option>
                          <option value="Paid Internship">Paid Internship</option>
                          <option value="Stipend Internship">Stipend Internship</option>
                          <option value="Corporate Sponsored">Corporate Sponsored</option>
                          <option value="Research Program">Research Program</option>
                          <option value="Placement Prep">Placement Prep Program</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Academic Partner College</label>
                        <select 
                          value={programForm.organizationId}
                          onChange={(e) => setProgramForm({ ...programForm, organizationId: e.target.value })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        >
                          {organizations.map(o => (
                            <option key={o.id} value={o.id}>{o.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Duration (Weeks)</label>
                        <input 
                          type="number" 
                          required
                          value={programForm.durationWeeks}
                          onChange={(e) => setProgramForm({ ...programForm, durationWeeks: Number(e.target.value) })}
                          className="w-full p-2 border border-border rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Capacity limit</label>
                        <input 
                          type="number" 
                          required
                          value={programForm.capacity}
                          onChange={(e) => setProgramForm({ ...programForm, capacity: Number(e.target.value) })}
                          className="w-full p-2 border border-border rounded text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Program Description</label>
                        <input 
                          type="text"
                          required
                          value={programForm.description}
                          onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                          className="w-full p-2 border border-border rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Eligibility Criteria</label>
                        <input 
                          type="text" 
                          required
                          value={programForm.eligibility}
                          onChange={(e) => setProgramForm({ ...programForm, eligibility: e.target.value })}
                          className="w-full p-2 border border-border rounded text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-border pb-1">
                      Section 2: Domain & Technology Settings
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Program Category</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Software Engineering"
                          value={programForm.category}
                          onChange={(e) => setProgramForm({ ...programForm, category: e.target.value })}
                          className="w-full p-2 border border-border rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Cognitive Level</label>
                        <select 
                          value={programForm.level}
                          onChange={(e) => setProgramForm({ ...programForm, level: e.target.value as any })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        >
                          <option value="Beginner">Beginner Level</option>
                          <option value="Intermediate">Intermediate Level</option>
                          <option value="Advanced">Advanced Level</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Industry Domain</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Web Development"
                          value={programForm.domain}
                          onChange={(e) => setProgramForm({ ...programForm, domain: e.target.value })}
                          className="w-full p-2 border border-border rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Certification Type</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Institutional Certificate"
                          value={programForm.certType}
                          onChange={(e) => setProgramForm({ ...programForm, certType: e.target.value })}
                          className="w-full p-2 border border-border rounded text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Technology Stack (Comma separated)</label>
                        <input 
                          type="text" 
                          placeholder="React, NextJS, NestJS"
                          value={programForm.techStackString}
                          onChange={(e) => setProgramForm({ ...programForm, techStackString: e.target.value })}
                          className="w-full p-2 border border-border rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Core Skills Covered (Comma separated)</label>
                        <input 
                          type="text" 
                          placeholder="Frontend Architecture, API Design"
                          value={programForm.skillsString}
                          onChange={(e) => setProgramForm({ ...programForm, skillsString: e.target.value })}
                          className="w-full p-2 border border-border rounded text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer button */}
                  <div className="pt-2">
                    <button 
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all cursor-pointer text-xs"
                    >
                      {activeActionModal.type === 'edit' ? 'Save Program Details' : 'Confirm Cohort Launch'}
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
