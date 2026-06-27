"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  Network, Search, Filter, Plus, ChevronRight, Package, Users, 
  GraduationCap, Calendar, CheckCircle2, XCircle, AlertCircle, Award, 
  FileText, Building, Clock, TrendingUp, Download, RefreshCw, UserCheck, 
  MapPin, Activity, Mail, Phone, Shield, Printer, QrCode, Briefcase, 
  UserX, ListFilter, Check, Trash, PlusCircle, LayoutGrid, Eye, Send, Lock,
  PlusSquare, ArrowRight, Layers, Sliders, ShieldAlert, ArrowLeftRight
} from 'lucide-react';
import { allocationService } from '@/src/services/allocation.service';
import { Allocation, AllocationTimelineEvent } from '@/src/data/mock-allocations';
import { studentService } from '@/src/services/student.service';
import { Student } from '@/src/data/mock-students';
import { batchService } from '@/src/services/batch.service';
import { Batch } from '@/src/data/mock-batches';
import { useAuth } from '@/src/context/AuthContext';
import { Drawer } from '@/components/feature/ui/Drawer';

type AllocationTab = 'dashboard' | 'students' | 'batches' | 'mentors' | 'programs' | 'colleges' | 'capacity' | 'conflicts' | 'rules' | 'timeline';

export default function AllocationManagementPage() {
  const { user } = useAuth();
  
  // App views: Left panel tabs
  const [activeTab, setActiveTab] = useState<AllocationTab>('dashboard');
  
  // Data state
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selected allocations for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Detailed Right Panel state
  const [selectedAllocation, setSelectedAllocation] = useState<Allocation | null>(null);
  
  // Action form modal states
  const [activeActionModal, setActiveActionModal] = useState<{
    type: 'assignProgram' | 'assignBatch' | 'assignMentor' | 'create' | 'edit' | 'bulkProgram' | 'bulkBatch' | 'bulkMentor' | 'bulkNotify' | 'bulkReallocate' | 'bulkStatus';
    allocId?: string;
  } | null>(null);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterBatch, setFilterBatch] = useState<string>('all');
  const [filterMentor, setFilterMentor] = useState<string>('all');
  const [filterCollege, setFilterCollege] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCapacity, setFilterCapacity] = useState<string>('all');
  const [filterUtilization, setFilterUtilization] = useState<string>('all');
  
  // Forms state
  const [allocForm, setAllocForm] = useState({
    studentId: '',
    studentName: '',
    internId: '',
    programId: '',
    programName: '',
    batchId: '',
    batchName: '',
    mentorId: '',
    mentorName: '',
    collegeId: '',
    collegeName: '',
    department: 'CSE',
    status: 'Allocated' as Allocation['status'],
  });

  // Allocation Rules Engine Settings
  const [rules, setRules] = useState({
    maxStudentsPerMentor: 45,
    maxBatchCapacity: 30,
    eligibilityRule: 'CGPA >= 6.0',
    deptRestrictions: 'Matches Department Code',
    collegeRestrictions: 'Approved MoU Only',
    autoAllocateEnabled: false
  });

  const [notifyMsg, setNotifyMsg] = useState('');
  const [bulkVal, setBulkVal] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const allocs = await allocationService.getAllocations();
      const stus = await studentService.getStudents();
      const bts = await batchService.getBatches();
      setAllocations(allocs);
      setStudents(stus);
      setBatches(bts);
      
      // Auto-select first allocation if available
      if (allocs.length > 0) {
        setSelectedAllocation(allocs[0]);
      }
    } catch (err) {
      console.error('Failed to load allocations data', err);
      showToast('Error loading relationship allocations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Keyboard Shortcuts (Esc to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveActionModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filters mapping lists
  const programsList = useMemo(() => Array.from(new Set(allocations.map(a => a.programName))), [allocations]);
  const batchesList = useMemo(() => Array.from(new Set(allocations.map(a => a.batchName).filter(Boolean))), [allocations]);
  const mentorsList = useMemo(() => Array.from(new Set(allocations.map(a => a.mentorName).filter(Boolean))), [allocations]);
  const collegesList = useMemo(() => Array.from(new Set(allocations.map(a => a.collegeName))), [allocations]);

  // Main filtered lists based on global searches and filters
  const filteredAllocations = useMemo(() => {
    return allocations.filter(a => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        a.studentName.toLowerCase().includes(q) ||
        a.internId.toLowerCase().includes(q) ||
        a.programName.toLowerCase().includes(q) ||
        a.batchName.toLowerCase().includes(q) ||
        a.mentorName.toLowerCase().includes(q) ||
        a.collegeName.toLowerCase().includes(q);

      const matchesProgram = filterProgram === 'all' || a.programName === filterProgram;
      const matchesBatch = filterBatch === 'all' || a.batchName === filterBatch;
      const matchesMentor = filterMentor === 'all' || a.mentorName === filterMentor;
      const matchesCollege = filterCollege === 'all' || a.collegeName === filterCollege;
      const matchesStatus = filterStatus === 'all' || a.status === filterStatus;

      return matchesSearch && matchesProgram && matchesBatch && matchesMentor && matchesCollege && matchesStatus;
    });
  }, [allocations, searchTerm, filterProgram, filterBatch, filterMentor, filterCollege, filterStatus]);

  // Unallocated students calculation
  const unallocatedStudents = useMemo(() => {
    return students.filter(s => {
      const isAllocated = allocations.some(a => a.studentId === s.id && a.status === 'Allocated');
      return !isAllocated;
    });
  }, [students, allocations]);

  // Conflicts list calculation
  const detectedConflicts = useMemo(() => {
    const list: { id: string; studentName: string; type: string; severity: 'High' | 'Medium'; desc: string }[] = [];
    
    allocations.forEach(a => {
      if (a.status === 'Allocated') {
        // Conflict 1: Student without batch
        if (!a.batchId || a.batchId === '') {
          list.push({
            id: `conf-b-${a.id}`,
            studentName: a.studentName,
            type: 'Student without Batch',
            severity: 'High',
            desc: `Enrolled in "${a.programName}" but no specific cohort batch has been allocated.`
          });
        }
        // Conflict 2: Student without mentor
        if (!a.mentorId || a.mentorId === '') {
          list.push({
            id: `conf-m-${a.id}`,
            studentName: a.studentName,
            type: 'Student without Mentor',
            severity: 'High',
            desc: `Rostered in "${a.batchName}" but no primary facilitating mentor has been remapped.`
          });
        }
      }
    });

    // Conflict 3: Batch without mentor
    batches.forEach(b => {
      if (b.status === 'Active' && (!b.mentor.name || b.mentor.name === '')) {
        list.push({
          id: `conf-bm-${b.id}`,
          studentName: `Batch: ${b.name}`,
          type: 'Batch without Mentor',
          severity: 'High',
          desc: `Active cohort delivery has no lead mentor mapped to guide learners.`
        });
      }
      
      // Conflict 4: Capacity exceeded
      if (b.students.length > b.capacity) {
        list.push({
          id: `conf-bc-${b.id}`,
          studentName: `Batch: ${b.name}`,
          type: 'Capacity Exceeded',
          severity: 'High',
          desc: `Roster count (${b.students.length}) exceeds maximum seat configurations limit (${b.capacity}).`
        });
      }
    });

    // Conflict 5: Mentor overloaded (students > Max)
    const mentorCounts: Record<string, number> = {};
    allocations.forEach(a => {
      if (a.status === 'Allocated' && a.mentorName) {
        mentorCounts[a.mentorName] = (mentorCounts[a.mentorName] || 0) + 1;
      }
    });
    Object.entries(mentorCounts).forEach(([mName, count]) => {
      if (count > rules.maxStudentsPerMentor) {
        list.push({
          id: `conf-mo-${mName}`,
          studentName: `Mentor: ${mName}`,
          type: 'Mentor Over Capacity',
          severity: 'Medium',
          desc: `Currently mentoring ${count} students. Exceeds load balancing target of ${rules.maxStudentsPerMentor}.`
        });
      }
    });

    return list;
  }, [allocations, batches, rules.maxStudentsPerMentor]);

  // Executive KPI summary calculations
  const dashboardStats = useMemo(() => {
    const total = allocations.length;
    const active = allocations.filter(a => a.status === 'Allocated').length;
    const unallocated = unallocatedStudents.length;
    
    let totalCap = 0;
    let usedCap = 0;
    batches.forEach(b => {
      totalCap += b.capacity;
      usedCap += b.students.length;
    });
    const availBatchCap = totalCap - usedCap;

    const uniqueMentors = new Set(batches.map(b => b.mentor.name).filter(Boolean)).size;
    const conflictsCount = detectedConflicts.length;
    const utilizationRate = totalCap > 0 ? Math.round((usedCap / totalCap) * 100) : 0;

    return { total, active, unallocated, availBatchCap, uniqueMentors, conflictsCount, utilizationRate };
  }, [allocations, unallocatedStudents, batches, detectedConflicts]);

  // Visual graph calculations
  const studentStatusCounts = useMemo(() => {
    const counts = { Allocated: 0, Pending: 0, Waitlisted: 0, Reassigned: 0, Dropped: 0 };
    allocations.forEach(a => {
      if (counts[a.status] !== undefined) counts[a.status]++;
    });
    return counts;
  }, [allocations]);

  const mentorUtilStats = useMemo(() => {
    // Map mentors load percentage
    const stats = { Available: 0, 'Partially Utilized': 0, 'Fully Utilized': 0, Overloaded: 0 };
    const mentorMap: Record<string, number> = {};
    allocations.forEach(a => {
      if (a.status === 'Allocated' && a.mentorName) {
        mentorMap[a.mentorName] = (mentorMap[a.mentorName] || 0) + 1;
      }
    });
    Object.values(mentorMap).forEach(count => {
      if (count === 0) stats['Available']++;
      else if (count <= 15) stats['Partially Utilized']++;
      else if (count <= 35) stats['Fully Utilized']++;
      else stats['Overloaded']++;
    });
    return stats;
  }, [allocations]);

  const programAllocationStats = useMemo(() => {
    const stats = { 'With Students': 0, 'Without Students': 0, 'Without Mentors': 0, 'Fully Allocated': 0 };
    // MOCK programs metrics
    batches.forEach(b => {
      if (b.students.length > 0) stats['With Students']++;
      else stats['Without Students']++;
      if (!b.mentor.name) stats['Without Mentors']++;
      else if (b.students.length > 0) stats['Fully Allocated']++;
    });
    return stats;
  }, [batches]);

  const capacityAlloc = useMemo(() => {
    let totalCap = 0;
    let usedCap = 0;
    batches.forEach(b => {
      totalCap += b.capacity;
      usedCap += b.students.length;
    });
    return {
      total: totalCap,
      occupied: usedCap,
      remaining: Math.max(0, totalCap - usedCap)
    };
  }, [batches]);

  const mentorWorkloads = useMemo(() => {
    const mentorMap: Record<string, { name: string; students: number; batchesCount: number }> = {};
    
    batches.forEach(b => {
      if (b.mentor.name) {
        if (!mentorMap[b.mentor.name]) {
          mentorMap[b.mentor.name] = { name: b.mentor.name, students: 0, batchesCount: 0 };
        }
        mentorMap[b.mentor.name].batchesCount++;
      }
    });

    allocations.forEach(a => {
      if (a.status === 'Allocated' && a.mentorName) {
        if (!mentorMap[a.mentorName]) {
          mentorMap[a.mentorName] = { name: a.mentorName, students: 0, batchesCount: 0 };
        }
        mentorMap[a.mentorName].students++;
      }
    });

    return Object.values(mentorMap);
  }, [allocations, batches]);


  // Activity Feed
  const activityFeed = useMemo(() => {
    const feed: { studentName: string; date: string; title: string; desc: string; type: string }[] = [];
    allocations.forEach(a => {
      a.timeline.forEach(evt => {
        feed.push({
          studentName: a.studentName,
          date: evt.date,
          title: evt.title,
          desc: evt.description,
          type: evt.type
        });
      });
    });
    return feed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 7);
  }, [allocations]);

  // Drag and Drop simulation assignment handler
  const handleDragDropAllocate = async (studentId: string, batchId: string) => {
    const student = students.find(s => s.id === studentId);
    const batch = batches.find(b => b.id === batchId);
    if (!student || !batch) return;

    // Check if allocation already exists
    const existing = allocations.find(a => a.studentId === studentId);
    if (existing) {
      const updated = await allocationService.updateAllocation(existing.id, {
        batchId: batch.id,
        batchName: batch.name,
        mentorId: batch.mentor.id || 'emp-2',
        mentorName: batch.mentor.name || 'Bob Johnson',
        status: 'Allocated'
      });
      if (updated) {
        showToast(`Reassigned ${student.personalInfo.name} to ${batch.name}`);
        loadData();
      }
    } else {
      const created = await allocationService.createAllocation({
        studentId: student.id,
        studentName: student.personalInfo.name,
        internId: student.internId,
        programId: batch.programId,
        programName: batch.programName,
        batchId: batch.id,
        batchName: batch.name,
        mentorId: batch.mentor.id || 'emp-2',
        mentorName: batch.mentor.name || 'Bob Johnson',
        collegeId: student.academicInfo.college === 'Stanford University' ? 'org-1' : 'org-2',
        collegeName: student.academicInfo.college,
        department: student.academicInfo.department,
        allocationDate: new Date().toISOString().split('T')[0],
        status: 'Allocated'
      });
      if (created) {
        showToast(`Allocated ${student.personalInfo.name} to ${batch.name}`);
        loadData();
      }
    }
  };

  // Conflict Auto Resolve
  const handleAutoResolve = async () => {
    await allocationService.autoResolveConflicts();
    showToast('Rules engine auto-balanced workload and allocated all unassigned batches.');
    loadData();
  };

  // Submit handlers
  const handleCreateAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === allocForm.studentId);
    const batch = batches.find(b => b.id === allocForm.batchId);
    if (!student) return;

    const created = await allocationService.createAllocation({
      studentId: student.id,
      studentName: student.personalInfo.name,
      internId: student.internId,
      programId: batch?.programId || 'prog-1',
      programName: batch?.programName || 'Summer Software Engineering Internship',
      batchId: batch?.id || '',
      batchName: batch?.name || 'TBA',
      mentorId: batch?.mentor.id || 'emp-2',
      mentorName: batch?.mentor.name || 'Bob Johnson',
      collegeId: student.academicInfo.college === 'Stanford University' ? 'org-1' : 'org-2',
      collegeName: student.academicInfo.college,
      department: student.academicInfo.department,
      allocationDate: new Date().toISOString().split('T')[0],
      status: 'Allocated'
    });

    if (created) {
      setAllocations([...allocations, created]);
      showToast(`Allocated student ${created.studentName} successfully.`);
      setActiveActionModal(null);
    }
  };

  const handleUpdateAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionModal?.allocId) return;

    const targetId = activeActionModal.allocId;
    const original = allocations.find(a => a.id === targetId);
    if (!original) return;

    const updated = await allocationService.updateAllocation(targetId, {
      status: allocForm.status
    });

    if (updated) {
      setAllocations(allocations.map(a => a.id === targetId ? updated : a));
      if (selectedAllocation?.id === targetId) {
        setSelectedAllocation(updated);
      }
      showToast(`Updated allocation status for ${updated.studentName}`);
      setActiveActionModal(null);
    }
  };

  // Batch assignments updates
  const handleUpdateMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAllocation) return;
    const targetId = selectedAllocation.id;

    let updates: Partial<Allocation> = {};
    if (activeActionModal?.type === 'assignProgram') {
      const programName = bulkVal === 'prog-1' ? 'Summer Software Engineering Internship' : bulkVal === 'prog-2' ? 'Data Science Boot Camp' : 'Research Program (Quantum Theory)';
      updates = { programId: bulkVal, programName };
    } else if (activeActionModal?.type === 'assignBatch') {
      const batch = batches.find(b => b.id === bulkVal);
      updates = { batchId: bulkVal, batchName: batch?.name || 'TBA' };
    } else if (activeActionModal?.type === 'assignMentor') {
      const mentorName = bulkVal === 'emp-2' ? 'Bob Johnson' : bulkVal === 'emp-3' ? 'Diana Prince' : 'Charlie Davis';
      updates = { mentorId: bulkVal, mentorName };
    }

    const updated = await allocationService.updateAllocation(targetId, updates);
    if (updated) {
      setAllocations(allocations.map(a => a.id === targetId ? updated : a));
      setSelectedAllocation(updated);
      showToast('Updated relationship assignment mapping');
      setActiveActionModal(null);
      setBulkVal('');
    }
  };

  // Multi-row Selection
  const handleToggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredAllocations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAllocations.map(a => a.id));
    }
  };

  // Bulk Operations Submit
  const handleExecuteBulkAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionModal || selectedIds.length === 0) return;

    if (activeActionModal.type === 'bulkStatus') {
      const statusVal = bulkVal as Allocation['status'];
      await allocationService.bulkUpdateStatus(selectedIds, statusVal);
      showToast(`Bulk updated status to ${statusVal} for ${selectedIds.length} students`);
    } else if (activeActionModal.type === 'bulkReallocate') {
      // Reallocate program, batch, or mentor
      const fields: Partial<Allocation> = {};
      if (bulkVal.startsWith('prog-')) {
        fields.programId = bulkVal;
        fields.programName = bulkVal === 'prog-1' ? 'Summer Software Engineering Internship' : 'Data Science Boot Camp';
      } else if (bulkVal.startsWith('batch-')) {
        const b = batches.find(item => item.id === bulkVal);
        fields.batchId = bulkVal;
        fields.batchName = b?.name || 'TBA';
      } else if (bulkVal.startsWith('emp-')) {
        fields.mentorId = bulkVal;
        fields.mentorName = bulkVal === 'emp-2' ? 'Bob Johnson' : 'Diana Prince';
      }
      await allocationService.bulkReallocate(selectedIds, fields);
      showToast(`Bulk reallocated relationships for ${selectedIds.length} students`);
    } else if (activeActionModal.type === 'bulkNotify') {
      showToast(`Broadcast notice sent to ${selectedIds.length} rosters.`);
    }

    // Refresh state
    const data = await allocationService.getAllocations();
    setAllocations(data);
    setSelectedIds([]);
    setActiveActionModal(null);
    setBulkVal('');
    setNotifyMsg('');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Relationship Mapping Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen -m-6 flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden text-slate-800">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl border bg-white animate-slide-in text-xs font-bold transition-all duration-300">
          {toast.type === 'success' && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />}
          {toast.type === 'error' && <XCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />}
          {toast.type === 'info' && <AlertCircle className="h-4.5 w-4.5 text-blue-600 shrink-0" />}
          <span className="text-slate-700">{toast.message}</span>
        </div>
      )}

      {/* LEFT PANEL: RELATIONAL sidebar ENTITIES */}
      <div className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="text-[10px] font-black uppercase text-blue-600 tracking-wider">PineSphere Relational Map</div>
          <h3 className="font-extrabold text-sm text-slate-900 mt-1 tracking-tight">Allocation Workspaces</h3>
        </div>

        {/* Tab Lists */}
        <div className="p-2 space-y-1 overflow-y-auto flex-1 text-xs font-bold text-slate-600">
          {[
            { id: 'dashboard', label: 'Allocation Overview', icon: LayoutGrid },
            { id: 'students', label: 'Student Allocations', icon: Users },
            { id: 'batches', label: 'Batch Capacity Roster', icon: Package },
            { id: 'mentors', label: 'Facilitators Load', icon: Shield },
            { id: 'programs', label: 'Programs Mapping', icon: Award },
            { id: 'colleges', label: 'Academic Institutions', icon: Building },
            { id: 'capacity', label: 'Capacity Planner', icon: Layers },
            { id: 'conflicts', label: 'Conflict Resolution', icon: ShieldAlert, badge: dashboardStats.conflictsCount },
            { id: 'rules', label: 'Relational Rules Engine', icon: Sliders },
            { id: 'timeline', label: 'Operational History', icon: Activity }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <div className="flex items-center gap-2">
                <tab.icon className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-900" />
                <span>{tab.label}</span>
              </div>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="bg-rose-100 text-rose-700 text-[9.5px] font-black px-1.5 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
          Rules: {rules.maxStudentsPerMentor} max students/coach
        </div>
      </div>

      {/* CENTER WORKSPACE PANEL */}
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        
        {/* Workspace Header */}
        <div className="p-5 border-b border-slate-200 bg-white flex flex-col sm:flex-row justify-between sm:items-center gap-4 shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {activeTab === 'dashboard' && 'Allocation Center Dashboard'}
              {activeTab === 'students' && 'Students Relational Allocation Workspace'}
              {activeTab === 'batches' && 'Cohorts Batches Relational Workspace'}
              {activeTab === 'mentors' && 'Mentor Workloads Mapping Center'}
              {activeTab === 'programs' && 'Programs Resource Matrix'}
              {activeTab === 'colleges' && 'Colleges Institution Map'}
              {activeTab === 'capacity' && 'Capacity & Resource Allocator'}
              {activeTab === 'conflicts' && 'Conflict Resolution Command Center'}
              {activeTab === 'rules' && 'relational Rules & Automation Policies'}
              {activeTab === 'timeline' && 'Change Audit History Logs'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeTab === 'dashboard' && 'Strategic overview and utilization index of campus cohorts.'}
              {activeTab === 'students' && 'Map candidates to programs, cohorts, and facilitating mentors.'}
              {activeTab === 'batches' && 'Monitor seating occupancy, transfer cohorts, and map lead facilitators.'}
              {activeTab === 'mentors' && 'Audit sessions conducted, satisfaction indices, and learner workload loads.'}
              {activeTab === 'programs' && 'Review resource allocations across active academic programs.'}
              {activeTab === 'colleges' && 'Oversee campus allocations, student listings, and MoU states.'}
              {activeTab === 'capacity' && 'Plan overall resource allocations across corporate and university modules.'}
              {activeTab === 'conflicts' && 'Detect unmapped student records, overloaded facilitators, or capacity limits alerts.'}
              {activeTab === 'rules' && 'Customize load balancing parameters and trigger auto-resolution loops.'}
              {activeTab === 'timeline' && 'Chronological audit trail of relational allocations changes.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'conflicts' && (
              <button 
                onClick={handleAutoResolve}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
              >
                Auto Resolve Conflicts
              </button>
            )}
            
            <button 
              onClick={() => {
                setAllocForm({
                  studentId: 'stu-1', studentName: 'Alice Freeman', internId: 'INT-2026-001',
                  programId: 'prog-1', programName: 'Summer Software Engineering Internship',
                  batchId: 'batch-1', batchName: 'Alpha Cohort 2026',
                  mentorId: 'emp-2', mentorName: 'Bob Johnson',
                  collegeId: 'org-1', collegeName: 'Stanford University', department: 'IT',
                  status: 'Allocated'
                });
                setActiveActionModal({ type: 'create' });
              }}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1 shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Map Allocation</span>
            </button>
          </div>
        </div>

        {/* WORKSPACE SWITCHABLE BODIES */}
        <div className="p-6 flex-1 space-y-6">

          {/* TAB 1: ALLOCATION OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Allocations', count: dashboardStats.total, icon: Network, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                  { label: 'Active Assignments', count: dashboardStats.active, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                  { label: 'Unallocated Students', count: dashboardStats.unallocated, icon: UserX, color: 'text-amber-600 bg-amber-50 border-amber-100', clickable: true, tabKey: 'students' },
                  { label: 'Available Batch Seats', count: dashboardStats.availBatchCap, icon: Package, color: 'text-purple-600 bg-purple-50 border-purple-100', clickable: true, tabKey: 'batches' },
                  { label: 'Assigned Mentors', count: dashboardStats.uniqueMentors, icon: Shield, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
                  { label: 'Active Conflicts', count: dashboardStats.conflictsCount, icon: ShieldAlert, color: 'text-rose-600 bg-rose-50 border-rose-100', clickable: true, tabKey: 'conflicts' },
                  { label: 'Overall Utilization Rate', count: `${dashboardStats.utilizationRate}%`, icon: Layers, color: 'text-pink-600 bg-pink-50 border-pink-100' }
                ].map((kpi, idx) => (
                  <div 
                    key={idx}
                    onClick={() => kpi.clickable && setActiveTab(kpi.tabKey as any)}
                    className={`bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between transition group ${kpi.clickable ? 'hover:border-blue-500 hover:shadow-md cursor-pointer' : ''}`}
                  >
                    <div className="space-y-1">
                      <div className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{kpi.count}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</div>
                    </div>
                    <div className={`h-9 w-9 rounded-lg ${kpi.color} flex items-center justify-center shrink-0`}>
                      <kpi.icon className="h-4.5 w-4.5" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Graphical aggregates */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Student status */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-blue-600" />
                    Student Allocation status
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(studentStatusCounts).map(([status, count], index) => {
                      const pct = Math.round((count / allocations.length) * 100) || 0;
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-700">
                            <span>{status}</span>
                            <span>{count} ({pct}%)</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mentor utilization */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    Mentor Utilization splits
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(mentorUtilStats).map(([status, count], index) => {
                      const total = Object.values(mentorUtilStats).reduce((a, b) => a + b, 0);
                      const pct = Math.round((count / total) * 100) || 0;
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-700">
                            <span>{status}</span>
                            <span>{count} ({pct}%)</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Program allocations */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-purple-600" />
                    Program Allocation indices
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(programAllocationStats).map(([status, count], index) => {
                      const total = Object.values(programAllocationStats).reduce((a, b) => a + b, 0);
                      const pct = Math.round((count / total) * 100) || 0;
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-700">
                            <span>{status}</span>
                            <span>{count}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-600 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Relationship workspace: Drag and Drop map simulator */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ArrowLeftRight className="h-4.5 w-4.5 text-blue-600" />
                  Relational Allocation Workspace (Drag & Drop mapping simulation)
                </h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Drag and drop unallocated students into cohort batches to dynamically resolve bottlenecks and balance loads.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Unallocated box */}
                  <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl space-y-3 max-h-[300px] overflow-y-auto">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                      <span>Unallocated Candidates List</span>
                      <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{unallocatedStudents.length} Students</span>
                    </div>
                    {unallocatedStudents.map(s => (
                      <div 
                        key={s.id}
                        className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs flex items-center justify-between text-xs font-semibold text-slate-700 hover:border-blue-500 cursor-grab"
                      >
                        <div>
                          <div className="font-extrabold text-slate-900">{s.personalInfo.name}</div>
                          <span className="text-[9.5px] text-slate-400 font-mono mt-0.5">{s.internId} | CGPA: {s.academicInfo.cgpa}</span>
                        </div>
                        
                        {/* Simulated map trigger */}
                        <button
                          onClick={() => handleDragDropAllocate(s.id, 'batch-1')}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-[10px] font-bold text-white rounded"
                        >
                          Map to Batch 1
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Active Cohorts list */}
                  <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl space-y-3 max-h-[300px] overflow-y-auto">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Active Cohorts</div>
                    {batches.map(b => {
                      const utilPct = Math.round((b.students.length / b.capacity) * 100) || 0;
                      return (
                        <div 
                          key={b.id}
                          className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs flex items-center justify-between text-xs font-semibold text-slate-700"
                        >
                          <div>
                            <div className="font-extrabold text-slate-900">{b.name}</div>
                            <span className="text-[9.5px] text-slate-400 font-bold mt-0.5">Coach: {b.mentor.name || 'Unassigned'}</span>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-xs font-black">{b.students.length} / {b.capacity} Seats</span>
                            <div className="text-[8.5px] font-bold text-slate-400 mt-0.5">{utilPct}% Occupied</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: STUDENT ALLOCATION */}
          {activeTab === 'students' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              
              {/* Toolbar */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search students allocations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <button 
                    onClick={() => showToast('Allocation report downloaded.', 'success')}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={filterProgram}
                    onChange={(e) => setFilterProgram(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Programs</option>
                    {programsList.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select
                    value={filterBatch}
                    onChange={(e) => setFilterBatch(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Batches</option>
                    {batchesList.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <select
                    value={filterMentor}
                    onChange={(e) => setFilterMentor(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Mentors</option>
                    {mentorsList.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select
                    value={filterCollege}
                    onChange={(e) => setFilterCollege(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Colleges</option>
                    {collegesList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Allocated">Allocated</option>
                    <option value="Pending">Pending</option>
                    <option value="Unallocated">Unallocated</option>
                  </select>
                </div>
              </div>

              {/* Data Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Intern ID</th>
                      <th className="px-4 py-3">Mapped Program</th>
                      <th className="px-4 py-3">Cohort Batch</th>
                      <th className="px-4 py-3">Mentor Mapping</th>
                      <th className="px-4 py-3">College</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredAllocations.map(a => (
                      <tr 
                        key={a.id}
                        className={`hover:bg-slate-50/50 cursor-pointer ${selectedAllocation?.id === a.id ? 'bg-blue-50/30' : ''}`}
                        onClick={() => setSelectedAllocation(a)}
                      >
                        <td className="px-4 py-3 font-extrabold text-slate-900">{a.studentName}</td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-500">{a.internId}</td>
                        <td className="px-4 py-3 text-slate-600 truncate max-w-[150px]">{a.programName}</td>
                        <td className="px-4 py-3 text-slate-700 font-semibold">{a.batchName || <span className="italic text-rose-600 font-bold">Unassigned</span>}</td>
                        <td className="px-4 py-3">
                          {a.mentorName ? (
                            <span className="font-semibold text-slate-700">{a.mentorName}</span>
                          ) : (
                            <span className="italic text-rose-600 font-bold">Unassigned</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-500">{a.collegeName}</td>
                        <td className="px-4 py-3 text-slate-500">{a.allocationDate}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.status === 'Allocated' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            a.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-500'
                          }`}>{a.status}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1 justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAllocForm({ ...allocForm, status: a.status });
                                setActiveActionModal({ type: 'edit', allocId: a.id });
                              }}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[10.5px] font-bold text-slate-700 rounded transition"
                            >
                              Shift Status
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: BATCH ALLOCATION */}
          {activeTab === 'batches' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batches.map(b => {
                const utilPct = Math.round((b.students.length / b.capacity) * 100) || 0;
                return (
                  <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded border">{b.code}</span>
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                          b.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                        }`}>{b.status}</span>
                      </div>
                      
                      <h4 className="text-sm font-black text-slate-900 mt-3">{b.name}</h4>
                      <p className="text-[11px] text-slate-500 font-semibold truncate mt-0.5">{b.programName}</p>
                      
                      <div className="mt-4 space-y-2 pt-3 border-t border-slate-50 text-xs font-semibold text-slate-600">
                        <div className="flex justify-between">
                          <span>Max Seating:</span>
                          <span className="text-slate-800 font-bold">{b.capacity} Seats</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Occupancy Util:</span>
                          <span className="text-slate-800 font-bold">{b.students.length} Learners ({utilPct}%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lead Coach:</span>
                          <span className="text-slate-800 font-bold">{b.mentor.name || 'Unassigned'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-50 justify-end">
                      <button 
                        onClick={() => {
                          setSelectedAllocation(allocations.find(a => a.batchId === b.id) || null);
                          setActiveTab('students');
                          showToast(`Opening roster for ${b.name}`);
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[10.5px] font-bold text-slate-700 rounded transition flex items-center gap-1"
                      >
                        <Users className="h-3 w-3" />
                        View Roster
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: MENTOR WORKLOADS */}
          {activeTab === 'mentors' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400">Mentor Workloads & Capacity Monitoring</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mentorWorkloads.map((mentor, index) => {
                  const targetLimit = 45;
                  const utilPct = Math.round((mentor.students / targetLimit) * 100);
                  const isOverload = mentor.students > targetLimit;

                  return (
                    <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="font-extrabold text-sm text-slate-900">{mentor.name}</span>
                          {isOverload && (
                            <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider">
                              Overloaded
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Relational Coaching Unit</p>
                        
                        <div className="mt-4 space-y-2 text-xs font-semibold text-slate-600">
                          <div className="flex justify-between">
                            <span>Batches Coached:</span>
                            <span className="text-slate-800 font-bold">{mentor.batchesCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Students Assigned:</span>
                            <span className="text-slate-800 font-bold">{mentor.students} Students</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Target Load threshold:</span>
                            <span className="text-slate-800 font-bold">{targetLimit} Students</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                            <span>Workload capacity</span>
                            <span>{utilPct}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${isOverload ? 'bg-rose-500' : 'bg-emerald-600'}`} 
                              style={{ width: `${Math.min(utilPct, 100)}%` }} 
                            />
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: PROGRAMS resource matrix */}
          {activeTab === 'programs' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400">Programs Relational Mapping</h4>
              
              <div className="space-y-3">
                {batches.map(b => {
                  const cohortStudents = allocations.filter(a => a.batchId === b.id && a.status === 'Allocated');
                  return (
                    <div key={b.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-semibold text-slate-700">
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm">{b.programName}</div>
                        <span className="text-[10px] text-slate-400 font-bold">Cohort Mapped: {b.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div>
                          <span className="text-[9.5px] uppercase text-slate-400 block font-bold">Students Alloc</span>
                          <span className="text-slate-800 font-black">{cohortStudents.length} Students</span>
                        </div>
                        <div>
                          <span className="text-[9.5px] uppercase text-slate-400 block font-bold">Primary Coach</span>
                          <span className="text-slate-800 font-black">{b.mentor.name || 'Unassigned'}</span>
                        </div>
                        <div>
                          <span className="text-[9.5px] uppercase text-slate-400 block font-bold">College Partner</span>
                          <span className="text-slate-800 font-black">{b.name.includes('Quantum') ? 'Stanford University' : 'MIT'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: COLLEGES */}
          {activeTab === 'colleges' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400">Academic Partners Allocation index</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collegesList.map((college, idx) => {
                  const collegeAllocs = allocations.filter(a => a.collegeName === college && a.status === 'Allocated');
                  const uniqueProgs = new Set(collegeAllocs.map(a => a.programId)).size;
                  
                  return (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="font-extrabold text-slate-900 text-sm">{college}</span>
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">Active MoU</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-700">
                        <div className="bg-white border border-slate-100 p-2 rounded">
                          <span className="text-slate-400 text-[8px] uppercase block">Students</span>
                          <span className="text-slate-900 font-extrabold text-sm">{collegeAllocs.length}</span>
                        </div>
                        <div className="bg-white border border-slate-100 p-2 rounded">
                          <span className="text-slate-400 text-[8px] uppercase block">Programs</span>
                          <span className="text-slate-900 font-extrabold text-sm">{uniqueProgs}</span>
                        </div>
                        <div className="bg-white border border-slate-100 p-2 rounded">
                          <span className="text-slate-400 text-[8px] uppercase block">Active Batches</span>
                          <span className="text-slate-900 font-extrabold text-sm">{collegeAllocs.map(a => a.batchId).filter(Boolean).length}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: CAPACITY PLANNER */}
          {activeTab === 'capacity' && (
            <div className="space-y-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h4 className="text-xs font-black uppercase text-slate-400">Relational Capacity limits Planner</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold text-slate-700">
                
                {/* Students */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                  <h5 className="font-black text-slate-500 uppercase text-[9.5px]">Student Roster Capacity</h5>
                  <div className="flex justify-between">
                    <span>Available Students:</span>
                    <span className="text-slate-900 font-extrabold">{students.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Allocations:</span>
                    <span className="text-emerald-600 font-extrabold">{allocations.filter(a => a.status === 'Allocated').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waitlisted:</span>
                    <span className="text-amber-600 font-extrabold">{allocations.filter(a => a.status === 'Waitlisted').length}</span>
                  </div>
                </div>

                {/* Mentors */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                  <h5 className="font-black text-slate-500 uppercase text-[9.5px]">Mentor Capacity limits</h5>
                  <div className="flex justify-between">
                    <span>Active Coaches:</span>
                    <span className="text-slate-900 font-extrabold">{batches.map(b => b.mentor.name).filter(Boolean).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Load balanced Max:</span>
                    <span className="text-slate-900 font-extrabold">{rules.maxStudentsPerMentor} / coach</span>
                  </div>
                </div>

                {/* Batches */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                  <h5 className="font-black text-slate-500 uppercase text-[9.5px]">Seating Cohort Capacity</h5>
                  <div className="flex justify-between">
                    <span>Total Seating Size:</span>
                    <span className="text-slate-900 font-extrabold">{capacityAlloc.total} Seats</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Occupied Seats:</span>
                    <span className="text-emerald-600 font-extrabold">{capacityAlloc.occupied} Seats</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining Vacancies:</span>
                    <span className="text-slate-900 font-extrabold">{capacityAlloc.remaining} Seats</span>
                  </div>
                </div>

                {/* Programs */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                  <h5 className="font-black text-slate-500 uppercase text-[9.5px]">Program Enrollment caps</h5>
                  <div className="flex justify-between">
                    <span>Max Target Size:</span>
                    <span className="text-slate-900 font-extrabold">250 Enrollments</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Enrollments:</span>
                    <span className="text-slate-900 font-extrabold">{allocations.filter(a => a.status === 'Allocated').length}</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 8: CONFLICT RESOLUTION CENTER */}
          {activeTab === 'conflicts' && (
            <div className="space-y-6">
              
              {/* Conflict Status Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Unallocated Students', count: unallocatedStudents.length, severity: 'High', color: 'text-amber-700 bg-amber-50 border-amber-200' },
                  { label: 'Missing Cohort Batch', count: allocations.filter(a => a.status === 'Allocated' && (!a.batchId || a.batchId === '')).length, severity: 'High', color: 'text-rose-700 bg-rose-50 border-rose-200' },
                  { label: 'Missing Primary Coach', count: allocations.filter(a => a.status === 'Allocated' && (!a.mentorId || a.mentorId === '')).length, severity: 'High', color: 'text-rose-700 bg-rose-50 border-rose-200' },
                  { label: 'Coach Overloads (45+)', count: detectedConflicts.filter(c => c.type === 'Mentor Over Capacity').length, severity: 'Medium', color: 'text-orange-700 bg-orange-50 border-orange-200' }
                ].map((card, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${card.color} font-semibold text-xs`}>
                    <div className="text-2xl font-black">{card.count}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{card.label}</div>
                    <span className="text-[8.5px] uppercase font-black px-1.5 py-0.5 rounded bg-white/70 inline-block mt-2">
                      Severity: {card.severity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Conflicts table */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400">Detected Relational Conflicts list</h4>
                
                {detectedConflicts.length > 0 ? (
                  <div className="space-y-3">
                    {detectedConflicts.map(c => (
                      <div key={c.id} className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center justify-between text-xs font-semibold text-slate-700 gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase ${c.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                              {c.severity} Severity
                            </span>
                            <span className="font-extrabold text-slate-900 text-xs">{c.studentName}</span>
                          </div>
                          <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed mt-1">{c.desc}</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={handleAutoResolve}
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-[10px] font-bold text-white rounded transition shadow-sm"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg text-xs text-emerald-600 font-bold bg-emerald-50/50">
                    Excellent! All system relationships match load balancing rules perfectly. No conflicts detected.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 9: RULES CONFIGURATION */}
          {activeTab === 'rules' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
              <h4 className="text-xs font-black uppercase text-slate-400">relational allocation rule configurations</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block font-bold">Max Learners load per Coach</label>
                  <input 
                    type="number"
                    value={rules.maxStudentsPerMentor}
                    onChange={e => setRules({ ...rules, maxStudentsPerMentor: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block font-bold">Max Batch Cohort capacity limit</label>
                  <input 
                    type="number"
                    value={rules.maxBatchCapacity}
                    onChange={e => setRules({ ...rules, maxBatchCapacity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block font-bold">Eligibility check constraints</label>
                  <input 
                    type="text"
                    value={rules.eligibilityRule}
                    onChange={e => setRules({ ...rules, eligibilityRule: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block font-bold">MoU Institution checks</label>
                  <input 
                    type="text"
                    value={rules.collegeRestrictions}
                    onChange={e => setRules({ ...rules, collegeRestrictions: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-700">
                <div>
                  <div>Automated Allocation Engine</div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Let PineSphere AI balance workloads and allocate waitlisted students automatically.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRules({ ...rules, autoAllocateEnabled: !rules.autoAllocateEnabled });
                    showToast(rules.autoAllocateEnabled ? 'Automated rules suspended.' : 'Auto-allocation engine activated.');
                  }}
                  className={`px-4 py-2 rounded text-xs font-bold text-white transition ${rules.autoAllocateEnabled ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-500 hover:bg-slate-600'}`}
                >
                  {rules.autoAllocateEnabled ? 'Active' : 'Disabled'}
                </button>
              </div>

            </div>
          )}

          {/* TAB 10: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400">Change logs Timeline</h4>
              
              <div className="relative border-l border-slate-200 ml-2 space-y-4.5 pl-4 pt-1 max-h-[450px] overflow-y-auto">
                {allocations.flatMap(a => a.timeline.map(t => ({ studentName: a.studentName, ...t }))).map((evt, idx) => (
                  <div key={idx} className="relative text-xs">
                    <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-slate-400 border border-white" />
                    <div className="text-[9.5px] font-bold text-slate-400">{evt.date}</div>
                    <div className="font-extrabold text-slate-800 mt-0.5">{evt.title}</div>
                    <p className="text-[10.5px] text-slate-500 font-medium leading-normal mt-0.5">
                      Student <span className="font-bold text-blue-700">{evt.studentName}</span>: {evt.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* RIGHT PANEL: ALLOCATION DETAILS SIDEBAR (Persist Right) */}
      {selectedAllocation && (
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Relational Detail Panel</h4>
            <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-blue-400 font-bold">{selectedAllocation.internId}</span>
          </div>

          <div className="p-5 flex-1 overflow-y-auto space-y-6 text-xs font-semibold text-slate-700">
            
            {/* Student metadata */}
            <div className="space-y-3">
              <div className="text-[10px] font-black uppercase text-slate-400">Allocated Candidate</div>
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs">
                  {selectedAllocation.studentName[0]}
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-xs">{selectedAllocation.studentName}</div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{selectedAllocation.internId} | {selectedAllocation.department}</span>
                </div>
              </div>
            </div>

            {/* Relationship Path Node */}
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <div className="text-[10px] font-black uppercase text-slate-400">Allocations Nodes Map</div>
              
              <div className="relative border-l border-blue-500 ml-2 pl-4 space-y-4 py-1">
                
                {/* Node 1: Program */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-blue-600 border border-white" />
                  <span className="text-[9.5px] uppercase text-slate-400 block font-bold">Program Layer</span>
                  <span className="text-slate-900 font-extrabold truncate block w-48" title={selectedAllocation.programName}>{selectedAllocation.programName}</span>
                </div>

                {/* Node 2: Batch */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-blue-600 border border-white" />
                  <span className="text-[9.5px] uppercase text-slate-400 block font-bold">Cohort Batch</span>
                  <span className="text-slate-900 font-extrabold">{selectedAllocation.batchName || 'Unassigned'}</span>
                </div>

                {/* Node 3: Mentor */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-blue-600 border border-white" />
                  <span className="text-[9.5px] uppercase text-slate-400 block font-bold">Primary coach</span>
                  <span className="text-slate-900 font-extrabold">{selectedAllocation.mentorName || 'Unassigned'}</span>
                </div>

                {/* Node 4: College */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-blue-600 border border-white" />
                  <span className="text-[9.5px] uppercase text-slate-400 block font-bold">Academic Institution</span>
                  <span className="text-slate-900 font-extrabold">{selectedAllocation.collegeName}</span>
                </div>

              </div>
            </div>

            {/* Quick configuration actions */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <div className="text-[10px] font-black uppercase text-slate-400">Map Reassignment</div>
              
              <button
                onClick={() => {
                  setBulkVal(selectedAllocation.programId);
                  setActiveActionModal({ type: 'assignProgram' });
                }}
                className="w-full text-left bg-slate-50 border border-slate-200 rounded p-2 text-xs font-extrabold text-slate-700 hover:border-blue-500 transition-colors"
              >
                Change Program Assignment
              </button>
              
              <button
                onClick={() => {
                  setBulkVal(selectedAllocation.batchId);
                  setActiveActionModal({ type: 'assignBatch' });
                }}
                className="w-full text-left bg-slate-50 border border-slate-200 rounded p-2 text-xs font-extrabold text-slate-700 hover:border-blue-500 transition-colors"
              >
                Change Cohort Batch
              </button>
              
              <button
                onClick={() => {
                  setBulkVal(selectedAllocation.mentorId);
                  setActiveActionModal({ type: 'assignMentor' });
                }}
                className="w-full text-left bg-slate-50 border border-slate-200 rounded p-2 text-xs font-extrabold text-slate-700 hover:border-blue-500 transition-colors"
              >
                Change Facilitating Coach
              </button>

            </div>

            {/* Selection Timeline */}
            <div className="space-y-3.5 border-t border-slate-100 pt-4">
              <div className="text-[10px] font-black uppercase text-slate-400">Allocation Logs</div>
              <div className="relative border-l border-slate-200 ml-2 space-y-3 pl-3.5">
                {selectedAllocation.timeline.map((evt, idx) => (
                  <div key={idx} className="relative text-[10.5px]">
                    <div className="absolute -left-[18.5px] top-1 h-1.5 w-1.5 rounded-full bg-slate-400 border border-white" />
                    <div className="text-[8.5px] font-bold text-slate-400">{evt.date}</div>
                    <div className="font-extrabold text-slate-800 leading-tight">{evt.title}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* POPUP ACTION FORM MODALS */}
      {activeActionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-zoom-in">
            
            {/* Header */}
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center text-sm font-black text-slate-900">
              <h3>
                {activeActionModal.type === 'create' && 'Enroll Student Relational Assignment'}
                {activeActionModal.type === 'edit' && 'Shift Lifecycle Status'}
                {activeActionModal.type === 'assignProgram' && 'Change Mapped Program'}
                {activeActionModal.type === 'assignBatch' && 'Change Mapped Cohort Batch'}
                {activeActionModal.type === 'assignMentor' && 'Change Mapped Lead Coach'}
              </h3>
              <button 
                onClick={() => setActiveActionModal(null)}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form 
              onSubmit={
                activeActionModal.type === 'create' ? handleCreateAllocation :
                activeActionModal.type === 'edit' ? handleUpdateAllocation :
                handleUpdateMapping
              }
              className="p-5 space-y-4"
            >
              
              {/* Form 1: Map Student Allocation */}
              {activeActionModal.type === 'create' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Select Target Student *</label>
                    <select
                      value={allocForm.studentId}
                      onChange={e => setAllocForm({ ...allocForm, studentId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="">-- Choose Candidate --</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.personalInfo.name} ({s.internId} | CGPA: {s.academicInfo.cgpa})</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Select Target Batch Cohort *</label>
                    <select
                      value={allocForm.batchId}
                      onChange={e => setAllocForm({ ...allocForm, batchId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="">-- Choose Batch --</option>
                      {batches.map(b => <option key={b.id} value={b.id}>{b.name} (Code: {b.code} | Coach: {b.mentor.name || 'Unassigned'})</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Form 2: Shift Status */}
              {activeActionModal.type === 'edit' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Shift Relational Status *</label>
                    <select
                      value={allocForm.status}
                      onChange={e => setAllocForm({ ...allocForm, status: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="Allocated">Allocated</option>
                      <option value="Pending">Pending</option>
                      <option value="Waitlisted">Waitlisted</option>
                      <option value="Reassigned">Reassigned</option>
                      <option value="Dropped">Dropped</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Form 3: Map Program */}
              {activeActionModal.type === 'assignProgram' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Map Internship Program *</label>
                    <select
                      value={bulkVal}
                      onChange={e => setBulkVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="prog-1">Summer Software Engineering Internship</option>
                      <option value="prog-2">Data Science Boot Camp</option>
                      <option value="prog-6">Research Program (Quantum Theory)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Form 4: Map Batch */}
              {activeActionModal.type === 'assignBatch' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Map Cohort Batch *</label>
                    <select
                      value={bulkVal}
                      onChange={e => setBulkVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="">-- Choose Cohort --</option>
                      {batches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.code})</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Form 5: Map Mentor */}
              {activeActionModal.type === 'assignMentor' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Map primary coaching facilitator *</label>
                    <select
                      value={bulkVal}
                      onChange={e => setBulkVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="emp-2">Bob Johnson (Technical Engineering)</option>
                      <option value="emp-3">Diana Prince (Data Operations)</option>
                      <option value="emp-4">Charlie Davis (HR Specialist)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveActionModal(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                >
                  Confirm Action
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
