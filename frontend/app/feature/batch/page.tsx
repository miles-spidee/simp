"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  Package, Search, Filter, Plus, ChevronRight, Calendar, Users, FileDown,
  GraduationCap, CheckCircle2, XCircle, AlertCircle, Award, FileText, 
  Building, Clock, TrendingUp, Download, RefreshCw, UserCheck, MapPin, 
  Activity, Mail, Phone, Shield, Printer, QrCode, Briefcase, UserX, 
  ListFilter, Check, Trash, PlusCircle, LayoutGrid, Eye, Send, Lock,
  PlusSquare, ArrowRight, Layers
} from 'lucide-react';
import { batchService } from '@/src/services/batch.service';
import { Batch, BatchStudent, BatchTimelineEvent, BatchProject } from '@/src/data/mock-batches';
import { useAuth } from '@/src/context/AuthContext';
import { Drawer } from '@/components/feature/ui/Drawer';

export default function BatchManagementPage() {
  const { user } = useAuth();
  
  // App views: dashboard, directory
  const [activeView, setActiveView] = useState<'dashboard' | 'directory'>('dashboard');
  
  // Data state
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selected batches for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Drawer states
  const [activeProfile, setActiveProfile] = useState<Batch | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'students' | 'mentor' | 'capacity' | 'performance' | 'lifecycle' | 'projects' | 'metadata' | 'timeline'>('overview');
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  
  // Modal / Action form states
  const [activeActionModal, setActiveActionModal] = useState<{
    type: 'create' | 'edit' | 'studentAdd' | 'mentorRemap' | 'capacityChange' | 'statusShift' | 'bulkStatus' | 'bulkMentor' | 'bulkCapacity' | 'bulkNotify';
    batchId?: string;
  } | null>(null);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMentor, setFilterMentor] = useState<string>('all');
  const [filterCapacity, setFilterCapacity] = useState<string>('all');
  const [filterCompletion, setFilterCompletion] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Forms state
  const [editForm, setEditForm] = useState({
    name: '',
    code: '',
    programId: '',
    programName: '',
    internshipType: 'Free Internship' as Batch['internshipType'],
    startDate: '',
    endDate: '',
    capacity: 30,
    status: 'Draft' as Batch['status'],
    category: '',
    domain: '',
    techStackString: '',
    tagsString: '',
    priority: 'Medium' as Batch['metadata']['priority'],
    academicYear: '2026-2027',
  });

  const [studentForm, setStudentForm] = useState({
    name: '',
    internId: '',
    college: '',
    department: 'CSE',
    performanceScore: 85,
  });

  const [mentorForm, setMentorForm] = useState({
    mentorId: 'emp-2',
    mentorName: 'Bob Johnson',
  });

  const [capacityForm, setCapacityForm] = useState(30);
  const [statusForm, setStatusForm] = useState<Batch['status']>('Draft');
  
  const [notifyMsg, setNotifyMsg] = useState('');
  const [bulkVal, setBulkVal] = useState('');

  // Toast notification
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
      const data = await batchService.getBatches();
      setBatches(data);
    } catch (err) {
      console.error('Failed to load batch records', err);
      showToast('Error loading batch cohorts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Keyboard listener
  const searchInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileDrawerOpen(false);
        setActiveActionModal(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        if (activeView === 'directory' && searchInputRef.current) {
          e.preventDefault();
          searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView]);

  // Derived Filter Lists
  const programsList = useMemo(() => {
    const programs = new Set(batches.map(b => b.programName));
    return Array.from(programs);
  }, [batches]);

  const mentorsList = useMemo(() => {
    const mentors = new Set(batches.map(b => b.mentor.name).filter(Boolean));
    return Array.from(mentors);
  }, [batches]);

  // Filtered Batches logic
  const filteredBatches = useMemo(() => {
    return batches.filter(b => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.programName.toLowerCase().includes(q) ||
        (b.mentor && b.mentor.name.toLowerCase().includes(q));

      const matchesProgram = filterProgram === 'all' || b.programName === filterProgram;
      const matchesType = filterType === 'all' || b.internshipType === filterType;
      const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
      const matchesMentor = filterMentor === 'all' || b.mentor.name === filterMentor;
      
      let matchesCapacity = true;
      if (filterCapacity !== 'all') {
        const util = (b.students.length / b.capacity) * 100;
        if (filterCapacity === 'full') matchesCapacity = util >= 100;
        else if (filterCapacity === 'high') matchesCapacity = util >= 80 && util < 100;
        else if (filterCapacity === 'low') matchesCapacity = util < 50;
      }

      let matchesCompletion = true;
      if (filterCompletion !== 'all') {
        const rate = b.completionRate;
        if (filterCompletion === 'high') matchesCompletion = rate >= 90;
        else if (filterCompletion === 'mid') matchesCompletion = rate >= 60 && rate < 90;
        else if (filterCompletion === 'low') matchesCompletion = rate < 60;
      }

      return matchesSearch && matchesProgram && matchesType && matchesStatus && matchesMentor && matchesCapacity && matchesCompletion;
    });
  }, [batches, searchTerm, filterProgram, filterType, filterStatus, filterMentor, filterCapacity, filterCompletion]);

  // Dashboard calculations
  const dashboardStats = useMemo(() => {
    const total = batches.length;
    const active = batches.filter(b => b.status === 'Active').length;
    const upcoming = batches.filter(b => b.status === 'Upcoming' || b.status === 'Enrollment Open').length;
    const completed = batches.filter(b => b.status === 'Completed').length;
    
    let totalStudents = 0;
    let totalCapacity = 0;
    batches.forEach(b => {
      totalStudents += b.students.length;
      totalCapacity += b.capacity;
    });

    const uniqueMentors = new Set(batches.map(b => b.mentor.id).filter(Boolean)).size;
    const avgOccupancy = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;
    
    // Average completion rate of completed batches
    const completedBatches = batches.filter(b => b.status === 'Completed');
    const avgCompletion = completedBatches.length > 0 
      ? Math.round(completedBatches.reduce((acc, curr) => acc + curr.completionRate, 0) / completedBatches.length)
      : 88; // industry default fallback

    return { total, active, upcoming, completed, totalStudents, uniqueMentors, avgOccupancy, avgCompletion };
  }, [batches]);

  // Chart aggregates
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { Draft: 0, Upcoming: 0, 'Enrollment Open': 0, Active: 0, 'On Hold': 0, Completed: 0, Archived: 0 };
    batches.forEach(b => {
      if (counts[b.status] !== undefined) counts[b.status]++;
    });
    return counts;
  }, [batches]);

  const capacityAlloc = useMemo(() => {
    let totalCapacity = 0;
    let totalOccupied = 0;
    batches.forEach(b => {
      totalCapacity += b.capacity;
      totalOccupied += b.students.length;
    });
    const remaining = totalCapacity - totalOccupied;
    const utilization = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
    return { total: totalCapacity, occupied: totalOccupied, remaining, utilization };
  }, [batches]);

  const mentorWorkloads = useMemo(() => {
    const workloads: Record<string, { name: string; students: number; batchesCount: number; maxCap: number }> = {};
    batches.forEach(b => {
      if (!b.mentor.name) return;
      if (!workloads[b.mentor.name]) {
        workloads[b.mentor.name] = { name: b.mentor.name, students: 0, batchesCount: 0, maxCap: 0 };
      }
      workloads[b.mentor.name].students += b.students.length;
      workloads[b.mentor.name].batchesCount += 1;
      workloads[b.mentor.name].maxCap += b.capacity;
    });
    return Object.values(workloads);
  }, [batches]);

  const programTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'Free Internship': 0, 'Paid Internship': 0, 'Stipend Internship': 0, 'Industrial Internship': 0, 'Research Internship': 0, 'Corporate Internship': 0
    };
    batches.forEach(b => {
      if (counts[b.internshipType] !== undefined) counts[b.internshipType]++;
    });
    return counts;
  }, [batches]);

  // Activity Feed
  const activityFeed = useMemo(() => {
    const feed: { batchName: string; code: string; date: string; title: string; desc: string; type: string }[] = [];
    batches.forEach(b => {
      b.timeline.forEach(evt => {
        feed.push({
          batchName: b.name,
          code: b.code,
          date: evt.date,
          title: evt.title,
          desc: evt.description,
          type: evt.type
        });
      });
    });
    return feed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
  }, [batches]);

  // Drawer / Selection Syncing
  const handleOpenProfile = (batch: Batch) => {
    setActiveProfile(batch);
    setProfileTab('overview');
    setIsProfileDrawerOpen(true);
  };

  const openEditModal = (batch: Batch) => {
    setEditForm({
      name: batch.name,
      code: batch.code,
      programId: batch.programId,
      programName: batch.programName,
      internshipType: batch.internshipType,
      startDate: batch.startDate,
      endDate: batch.endDate,
      capacity: batch.capacity,
      status: batch.status,
      category: batch.metadata.category,
      domain: batch.metadata.domain,
      techStackString: batch.metadata.techStack.join(', '),
      tagsString: batch.metadata.tags.join(', '),
      priority: batch.metadata.priority,
      academicYear: batch.metadata.academicYear,
    });
    setActiveActionModal({ type: 'edit', batchId: batch.id });
  };

  // Submit operations
  const handleSaveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionModal?.batchId) return;

    const targetId = activeActionModal.batchId;
    const original = batches.find(b => b.id === targetId);
    if (!original) return;

    const updated = await batchService.updateBatch(targetId, {
      name: editForm.name,
      internshipType: editForm.internshipType,
      startDate: editForm.startDate,
      endDate: editForm.endDate,
      capacity: Number(editForm.capacity),
      status: editForm.status,
      metadata: {
        type: original.metadata.type,
        category: editForm.category,
        domain: editForm.domain,
        techStack: editForm.techStackString.split(',').map(s => s.trim()).filter(Boolean),
        tags: editForm.tagsString.split(',').map(s => s.trim()).filter(Boolean),
        priority: editForm.priority,
        academicYear: editForm.academicYear
      }
    });

    if (updated) {
      setBatches(batches.map(b => b.id === targetId ? updated : b));
      if (activeProfile?.id === targetId) {
        setActiveProfile(updated);
      }
      showToast(`Updated cohort parameters for ${updated.name}`);
      setActiveActionModal(null);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const newB = await batchService.createBatch({
      batch_name: editForm.name,
      batch_code: `BATCH-${Date.now()}`,
      program_id: editForm.programId || 'prog-1',
      start_date: editForm.startDate || '2026-05-01',
      end_date: editForm.endDate || '2026-08-01',
      max_capacity: Number(editForm.capacity) || 30,
      batch_status: editForm.status || 'Draft'
    } as any);

    if (newB) {
      setBatches([...batches, newB]);
      showToast(`Cohort Batch "${newB.name}" created under ID ${newB.code}`);
      setActiveActionModal(null);
    }
  };

  // Add student allocation
  const handleAddStudentToBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;
    const batchId = activeProfile.id;

    const hasStudent = activeProfile.students.some(s => s.internId === studentForm.internId);
    if (hasStudent) {
      showToast('Student is already allocated to this batch roster.', 'error');
      return;
    }

    const updatedStudents = [...activeProfile.students, {
      id: `stu-${Date.now()}`,
      name: studentForm.name,
      internId: studentForm.internId || `INT-${Date.now()}`,
      college: studentForm.college || 'Stanford University',
      department: studentForm.department,
      performanceScore: Number(studentForm.performanceScore),
      status: 'Active' as const
    }];

    const updatedTimeline = [...activeProfile.timeline];
    updatedTimeline.unshift({
      date: new Date().toISOString().split('T')[0],
      title: 'Student Roster Allocated',
      description: `Manually allocated candidate ${studentForm.name} to the cohort.`,
      type: 'student'
    });

    const updated = await batchService.updateBatch(batchId, {
      students: updatedStudents,
      timeline: updatedTimeline
    });

    if (updated) {
      setBatches(batches.map(b => b.id === batchId ? updated : b));
      setActiveProfile(updated);
      showToast(`Allocated student ${studentForm.name} to ${activeProfile.name}`);
      setActiveActionModal(null);
    }
  };

  // Remove student from roster
  const handleRemoveStudentFromBatch = async (studentId: string) => {
    if (!activeProfile) return;
    const batchId = activeProfile.id;

    const removedStudent = activeProfile.students.find(s => s.id === studentId);
    const updatedStudents = activeProfile.students.filter(s => s.id !== studentId);
    const updatedTimeline = [...activeProfile.timeline];
    updatedTimeline.unshift({
      date: new Date().toISOString().split('T')[0],
      title: 'Student Removed',
      description: `Removed student ${removedStudent?.name || studentId} from batch roster.`,
      type: 'student'
    });

    const updated = await batchService.updateBatch(batchId, {
      students: updatedStudents,
      timeline: updatedTimeline
    });

    if (updated) {
      setBatches(batches.map(b => b.id === batchId ? updated : b));
      setActiveProfile(updated);
      showToast('Removed student allocation');
    }
  };

  // Remap lead mentor
  const handleRemapMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;
    const batchId = activeProfile.id;

    const mentorName = mentorForm.mentorId === 'emp-2' ? 'Bob Johnson' : mentorForm.mentorId === 'emp-3' ? 'Diana Prince' : 'Charlie Davis';
    const updated = await batchService.updateBatch(batchId, {
      mentor: {
        id: mentorForm.mentorId,
        name: mentorName,
        department: 'Technical Operations Division',
        expertise: 'Architecture Facilitation',
        rating: 4.8,
        sessionsConducted: 0,
        studentSatisfaction: 4.8,
        successRate: 95,
        completionContribution: 95
      }
    });

    if (updated) {
      const updatedTimeline = [...updated.timeline];
      updatedTimeline.unshift({
        date: new Date().toISOString().split('T')[0],
        title: 'Lead Mentor Assigned',
        description: `Lead coach remapped to ${mentorName}.`,
        type: 'mentor'
      });
      const finalObj = await batchService.updateBatch(batchId, { timeline: updatedTimeline });
      
      if (finalObj) {
        setBatches(batches.map(b => b.id === batchId ? finalObj : b));
        setActiveProfile(finalObj);
        showToast(`Remapped batch lead mentor to ${mentorName}`);
        setActiveActionModal(null);
      }
    }
  };

  // Change capacity limits
  const handleUpdateCapacity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;
    const batchId = activeProfile.id;

    const updated = await batchService.updateBatch(batchId, {
      capacity: Number(capacityForm)
    });

    if (updated) {
      const updatedTimeline = [...updated.timeline];
      updatedTimeline.unshift({
        date: new Date().toISOString().split('T')[0],
        title: 'Capacity Reconfigured',
        description: `Scaled maximum allowed cohort size to ${capacityForm} seats.`,
        type: 'capacity'
      });
      const finalObj = await batchService.updateBatch(batchId, { timeline: updatedTimeline });

      if (finalObj) {
        setBatches(batches.map(b => b.id === batchId ? finalObj : b));
        setActiveProfile(finalObj);
        showToast(`Batch seat capacity updated to ${capacityForm}`);
        setActiveActionModal(null);
      }
    }
  };

  // Shift status
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;
    const batchId = activeProfile.id;

    const updated = await batchService.updateBatch(batchId, {
      status: statusForm
    });

    if (updated) {
      const updatedTimeline = [...updated.timeline];
      updatedTimeline.unshift({
        date: new Date().toISOString().split('T')[0],
        title: 'Lifecycle Status Update',
        description: `Shifted batch status to "${statusForm}".`,
        type: 'info'
      });
      const finalObj = await batchService.updateBatch(batchId, { timeline: updatedTimeline });

      if (finalObj) {
        setBatches(batches.map(b => b.id === batchId ? finalObj : b));
        setActiveProfile(finalObj);
        showToast(`Cohort status updated to ${statusForm}`);
        setActiveActionModal(null);
      }
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
    if (selectedIds.length === filteredBatches.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBatches.map(b => b.id));
    }
  };

  // Bulk executions
  const handleExecuteBulkAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionModal || selectedIds.length === 0) return;

    if (activeActionModal.type === 'bulkStatus') {
      const statusVal = bulkVal as Batch['status'];
      await batchService.bulkUpdateStatus(selectedIds, statusVal);
      showToast(`Bulk updated status to ${statusVal} for ${selectedIds.length} batches`);
    } else if (activeActionModal.type === 'bulkMentor') {
      const mentorName = bulkVal === 'emp-2' ? 'Bob Johnson' : bulkVal === 'emp-3' ? 'Diana Prince' : 'Charlie Davis';
      await batchService.bulkAssignMentor(selectedIds, bulkVal, mentorName);
      showToast(`Bulk assigned mentor ${mentorName} to ${selectedIds.length} batches`);
    } else if (activeActionModal.type === 'bulkCapacity') {
      const capNum = Number(bulkVal) || 30;
      await batchService.bulkUpdateCapacity(selectedIds, capNum);
      showToast(`Rescaled max capacity to ${capNum} for ${selectedIds.length} cohorts`);
    } else if (activeActionModal.type === 'bulkNotify') {
      showToast(`Broadcast notice sent to ${selectedIds.length} cohort rosters.`);
    }

    // Refresh state
    const data = await batchService.getBatches();
    setBatches(data);
    setSelectedIds([]);
    setActiveActionModal(null);
    setBulkVal('');
    setNotifyMsg('');
  };

  const handleExportRoster = () => {
    const listToExport = selectedIds.length > 0 
      ? batches.filter(b => selectedIds.includes(b.id))
      : filteredBatches;

    if (listToExport.length === 0) {
      showToast('No batch records to export', 'error');
      return;
    }

    const headers = ['Batch Code', 'Batch Name', 'Internship Program', 'Mentor Assigned', 'Occupied Capacity', 'Total Capacity', 'Start Date', 'End Date', 'Status', 'Completion Rate'];
    const rows = listToExport.map(b => [
      b.code,
      b.name,
      b.programName,
      b.mentor.name || 'Unassigned',
      b.students.length,
      b.capacity,
      b.startDate,
      b.endDate,
      b.status,
      b.completionRate
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Batch_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${listToExport.length} batch records successfully.`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Cohort Delivery System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 select-none text-slate-800 ${
      (activeActionModal?.type === 'edit' || activeActionModal?.type === 'create') 
        ? 'h-[calc(100vh-80px)] overflow-hidden relative' 
        : 'pb-12 animate-fade-in relative min-h-screen'
    }`}>
      
      {/* Toast alert popup */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl border bg-white animate-slide-in text-xs font-bold transition-all duration-300">
          {toast.type === 'success' && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />}
          {toast.type === 'error' && <XCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />}
          {toast.type === 'info' && <AlertCircle className="h-4.5 w-4.5 text-blue-600 shrink-0" />}
          <span className="text-slate-700">{toast.message}</span>
        </div>
      )}

      {/* Roster Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Operations Delivery (ODMS)</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-black">Cohort Batches</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">Batch Delivery Portal</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Structure learners into execution modules. Remap coaches, monitor capacities, and audit cohort progressions.
          </p>
        </div>

        {/* Global tab toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-100 p-0.5 rounded-lg flex border border-slate-200 shadow-sm shrink-0">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all duration-200 ${activeView === 'dashboard' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Operational Dashboard</span>
            </button>
            <button
              onClick={() => setActiveView('directory')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all duration-200 ${activeView === 'directory' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Batch Directory</span>
            </button>
          </div>

          <button 
            onClick={handleExportRoster}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:border-blue-600 hover:text-blue-600 bg-white rounded-lg text-xs font-bold text-slate-700 shadow-sm transition-all cursor-pointer"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>Export Roster</span>
          </button>
          
          <button 
            onClick={() => {
              setEditForm({
                name: '', code: '', programId: 'prog-1', programName: 'Summer Software Engineering Internship',
                internshipType: 'Stipend Internship', startDate: '', endDate: '', capacity: 30, status: 'Draft',
                category: 'Software Engineering', domain: 'Fullstack Dev', techStackString: '', tagsString: '',
                priority: 'Medium', academicYear: '2026-2027'
              });
              setActiveActionModal({ type: 'create' });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Batch</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: EXECUTIVE OPERATIONS DASHBOARD */}
      {activeView === 'dashboard' && (
        <div className="space-y-6">
          
          {/* KPI Dashboard Card Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Batches', count: dashboardStats.total, icon: Package, color: 'text-blue-600 bg-blue-50 border-blue-100', filterKey: 'all', filterVal: 'all' },
              { label: 'Active Cohorts', count: dashboardStats.active, icon: Activity, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', filterKey: 'status', filterVal: 'Active' },
              { label: 'Upcoming Batches', count: dashboardStats.upcoming, icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100', filterKey: 'status', filterVal: 'Upcoming' },
              { label: 'Concluded Cohorts', count: dashboardStats.completed, icon: GraduationCap, color: 'text-purple-600 bg-purple-50 border-purple-100', filterKey: 'status', filterVal: 'Completed' },
              { label: 'Allocated Students', count: dashboardStats.totalStudents, icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', filterKey: 'all', filterVal: 'all' },
              { label: 'Facilitators Assigned', count: dashboardStats.uniqueMentors, icon: Shield, color: 'text-teal-600 bg-teal-50 border-teal-100', filterKey: 'all', filterVal: 'all' },
              { label: 'Average Occupancy', count: `${dashboardStats.avgOccupancy}%`, icon: Layers, color: 'text-pink-600 bg-pink-50 border-pink-100', filterKey: 'all', filterVal: 'all' },
              { label: 'Batch Completion Rate', count: `${dashboardStats.avgCompletion}%`, icon: Award, color: 'text-rose-600 bg-rose-50 border-rose-100', filterKey: 'all', filterVal: 'all' }
            ].map((kpi, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  if (kpi.filterKey === 'status') setFilterStatus(kpi.filterVal);
                  if (kpi.filterKey !== 'all') {
                    setActiveView('directory');
                    showToast(`Filtering batches by status: ${kpi.filterVal}`);
                  }
                }}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between group hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{kpi.count}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</div>
                </div>
                <div className={`h-9 w-9 rounded-lg ${kpi.color} flex items-center justify-center shrink-0`}>
                  <kpi.icon className="h-4.5 w-4.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Graphical Distributions Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            
            {/* Status splits */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-blue-600" />
                Status Distribution
              </h3>
              <div className="space-y-2">
                {Object.entries(statusCounts).map(([status, count], index) => {
                  const pct = Math.round((count / batches.length) * 100) || 0;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{status}</span>
                        <span>{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Capacity Util */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-emerald-600" />
                Student Roster Allocation
              </h3>
              
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>Occupied Capacity:</span>
                  <span className="text-slate-900">{capacityAlloc.occupied} / {capacityAlloc.total} Seats</span>
                </div>
                
                {/* SVG circular speedometer or progress meter */}
                <div className="flex justify-center items-center h-20">
                  <div className="relative h-20 w-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500 transition-all duration-1000"
                        strokeDasharray={`${capacityAlloc.utilization}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-sm font-black text-slate-800">{capacityAlloc.utilization}%</span>
                      <span className="text-[7.5px] uppercase font-bold text-slate-400 block -mt-0.5">Utilized</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold text-slate-600">
                  <div className="bg-slate-50 border border-slate-100 p-2 rounded">
                    <span className="text-slate-400 block uppercase">Allocated</span>
                    <span className="text-slate-800 text-xs">{capacityAlloc.occupied} Seats</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-2 rounded">
                    <span className="text-slate-400 block uppercase">Remaining</span>
                    <span className="text-slate-800 text-xs">{capacityAlloc.remaining} Seats</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Mentor Workloads */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-purple-600" />
                Facilitator Workloads
              </h3>
              <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                {mentorWorkloads.map((mentor, index) => {
                  const limit = 60; // Max default target students
                  const pct = Math.min(Math.round((mentor.students / limit) * 100), 100);
                  const isOverloaded = mentor.students > 45;

                  return (
                    <div key={index} className="space-y-1 border-b border-slate-50 pb-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span className="font-extrabold">{mentor.name}</span>
                        <span className={isOverloaded ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                          {mentor.students} Students ({mentor.batchesCount} Batches)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isOverloaded ? 'bg-rose-500' : 'bg-purple-600'}`} 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Program distribution */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-indigo-600" />
                Program Mapping Split
              </h3>
              <div className="space-y-2">
                {Object.entries(programTypeCounts).map(([type, count], index) => {
                  const pct = Math.round((count / batches.length) * 100) || 0;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span className="truncate max-w-[150px] block">{type}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Activity Timeline and underperforming list */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Underperforming Cohorts */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 lg:col-span-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-rose-600" />
                Critical Watch List (Under 80%)
              </h3>
              <div className="space-y-3">
                {batches.filter(b => b.performance.attendanceRate < 90 || b.performance.assessmentAverage < 80).map(b => (
                  <div 
                    key={b.id} 
                    onClick={() => handleOpenProfile(b)}
                    className="flex items-center justify-between border-b border-slate-50 pb-2 cursor-pointer hover:bg-slate-50/50 p-1.5 rounded-lg transition"
                  >
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">{b.name}</div>
                      <div className="text-[10px] text-slate-500">Coach: {b.mentor.name || 'Unassigned'}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 block">
                        Attend: {b.performance.attendanceRate}%
                      </span>
                      <span className="text-[9px] text-slate-400 block font-semibold mt-0.5">Quiz Avg: {b.performance.assessmentAverage}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Projects Overview */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 lg:col-span-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-blue-600" />
                Active Capstones Submission Rates
              </h3>
              <div className="space-y-3.5">
                {batches.flatMap(b => b.projects.map(p => ({ batchName: b.name, ...p }))).slice(0, 5).map((proj, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span className="font-extrabold truncate max-w-[180px]">{proj.name}</span>
                      <span>{proj.submissionRate}% Submitted</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${proj.submissionRate}%` }} />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase shrink-0">{proj.evaluationStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent timeline events feed */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 lg:col-span-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-indigo-600" />
                Operational Delivery Logs
              </h3>
              <div className="relative border-l-2 border-slate-100 ml-2 space-y-4.5 pl-4 max-h-[300px] overflow-y-auto">
                {activityFeed.map((act, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[23px] top-0.5 bg-slate-100 text-slate-700 h-4 w-4 rounded-full flex items-center justify-center text-[7px] font-black border border-white uppercase">
                      {act.code.slice(-2)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold">{act.date}</div>
                    <div className="text-xs font-extrabold text-slate-800 mt-0.5">{act.title}</div>
                    <p className="text-[10.5px] text-slate-600 mt-0.5 leading-tight">
                      Batch <span className="font-bold text-blue-700">{act.batchName}</span>: {act.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: BATCH DIRECTORY TABLE */}
      {activeView === 'directory' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          
          {/* Filtering and Toolbar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  ref={searchInputRef}
                  placeholder="Search batches (Name, Code, Program, Mentor)... [Ctrl+F]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Filters trigger */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-lg text-xs font-bold shadow-xs transition-all ${showFilters ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                  <ListFilter className="h-3.5 w-3.5" />
                  <span>{showFilters ? 'Hide Filters' : 'Advanced Filters'}</span>
                </button>

                {(filterProgram !== 'all' || filterType !== 'all' || filterStatus !== 'all' || filterMentor !== 'all' || filterCapacity !== 'all' || filterCompletion !== 'all') && (
                  <button 
                    onClick={() => {
                      setFilterProgram('all');
                      setFilterType('all');
                      setFilterStatus('all');
                      setFilterMentor('all');
                      setFilterCapacity('all');
                      setFilterCompletion('all');
                      showToast('Cleared directory filters');
                    }}
                    className="px-3.5 py-2 border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all"
                  >
                    Reset All
                  </button>
                )}
              </div>

            </div>

            {/* Filter Panels */}
            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
                
                {/* Program filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Internship Program</label>
                  <select 
                    value={filterProgram}
                    onChange={(e) => setFilterProgram(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="all">All Programs</option>
                    {programsList.map((p, idx) => <option key={idx} value={p}>{p}</option>)}
                  </select>
                </div>

                {/* Status filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Batch Status</label>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Enrollment Open">Enrollment Open</option>
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                {/* Mentor filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Cohort Coach</label>
                  <select 
                    value={filterMentor}
                    onChange={(e) => setFilterMentor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="all">All Mentors</option>
                    {mentorsList.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* Capacity utilization filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Seats Utilization</label>
                  <select 
                    value={filterCapacity}
                    onChange={(e) => setFilterCapacity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="all">All Levels</option>
                    <option value="full">At Capacity (100%+)</option>
                    <option value="high">High Seats (80%-99%)</option>
                    <option value="low">Under Allocated (Below 50%)</option>
                  </select>
                </div>

                {/* Completion rate filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Completion Rates</label>
                  <select 
                    value={filterCompletion}
                    onChange={(e) => setFilterCompletion(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="all">All Ranges</option>
                    <option value="high">Top Out (90%+)</option>
                    <option value="mid">Standard (60%-89%)</option>
                    <option value="low">Underachieving (Below 60%)</option>
                  </select>
                </div>

                {/* Internship Type filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Internship Type</label>
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="all">All Types</option>
                    <option value="Free Internship">Free Internship</option>
                    <option value="Paid Internship">Paid Internship</option>
                    <option value="Stipend Internship">Stipend Internship</option>
                    <option value="Industrial Internship">Industrial Internship</option>
                    <option value="Research Internship">Research Internship</option>
                    <option value="Corporate Internship">Corporate Internship</option>
                  </select>
                </div>

              </div>
            )}

          </div>

          {/* High Density Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-center w-10">
                    <input 
                      type="checkbox"
                      checked={filteredBatches.length > 0 && selectedIds.length === filteredBatches.length}
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3">Batch Name</th>
                  <th className="px-4 py-3">Batch Code</th>
                  <th className="px-4 py-3">Internship Program</th>
                  <th className="px-4 py-3">Lead Mentor</th>
                  <th className="px-4 py-3">Seat Allocations</th>
                  <th className="px-4 py-3">Timeline Dates</th>
                  <th className="px-4 py-3">Completion %</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredBatches.length > 0 ? (
                  filteredBatches.map(b => {
                    const isSelected = selectedIds.includes(b.id);
                    const utilPct = Math.round((b.students.length / b.capacity) * 100) || 0;

                    return (
                      <tr 
                        key={b.id}
                        className={`hover:bg-slate-50/50 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}
                      >
                        <td className="px-4 py-3 text-center">
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectRow(b.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div 
                            onClick={() => handleOpenProfile(b)}
                            className="font-extrabold text-slate-900 hover:text-blue-600 cursor-pointer flex items-center gap-1.5"
                          >
                            <Package className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            {b.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-500">{b.code}</td>
                        <td className="px-4 py-3 text-slate-600 truncate max-w-[150px]" title={b.programName}>{b.programName}</td>
                        <td className="px-4 py-3">
                          {b.mentor.name ? (
                            <span className="font-semibold text-slate-700 flex items-center gap-1">
                              <Shield className="h-3 w-3 text-slate-400" />
                              {b.mentor.name}
                            </span>
                          ) : (
                            <span className="italic text-rose-600 font-bold">Unassigned</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-black ${utilPct >= 100 ? 'text-rose-600' : 'text-slate-800'}`}>
                              {b.students.length} / {b.capacity}
                            </span>
                            <span className="text-[10px] text-slate-400">({utilPct}%)</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{b.startDate} to {b.endDate}</td>
                        <td className="px-4 py-3 font-black text-slate-700">{b.completionRate}%</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            b.status === 'Completed' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            b.status === 'Upcoming' || b.status === 'Enrollment Open' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            b.status === 'On Hold' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => handleOpenProfile(b)}
                              className="p-1 hover:text-blue-600 hover:bg-slate-100 rounded text-slate-400 transition-colors"
                              title="Cohort Command Drawer"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => openEditModal(b)}
                              className="p-1 hover:text-amber-600 hover:bg-slate-100 rounded text-slate-400 transition-colors"
                              title="Edit Cohort Parameters"
                            >
                              <PlusCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-slate-500">
                      <Package className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                      <p className="text-sm font-extrabold text-slate-600">No batches match filters</p>
                      <p className="text-xs text-slate-400 mt-0.5">Try altering the search terms or department queries.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-500">
            <div>
              Showing {filteredBatches.length} of {batches.length} cohorts
            </div>
            <div>
              {selectedIds.length > 0 && (
                <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  {selectedIds.length} batches selected for batch scaling
                </span>
              )}
            </div>
          </div>

        </div>
      )}

      {/* FLOAT-UP BULK ACTION TOOLBAR */}
      {selectedIds.length > 0 && activeView === 'directory' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-xl shadow-2xl px-5 py-3.5 border border-slate-800 flex items-center justify-between gap-6 max-w-3xl w-[90%] animate-slide-up">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-blue-600 text-white font-black text-xs rounded-full flex items-center justify-center shrink-0">
              {selectedIds.length}
            </div>
            <span className="text-xs font-bold text-slate-300">Batches checked for batch operations</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button 
              onClick={() => setActiveActionModal({ type: 'bulkStatus' })}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-bold text-slate-200 transition"
            >
              Update Status
            </button>
            <button 
              onClick={() => setActiveActionModal({ type: 'bulkMentor' })}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-bold text-slate-200 transition"
            >
              Map Coach
            </button>
            <button 
              onClick={() => setActiveActionModal({ type: 'bulkCapacity' })}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-bold text-slate-200 transition"
            >
              Scale Capacity
            </button>
            <button 
              onClick={() => setActiveActionModal({ type: 'bulkNotify' })}
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-[11px] font-bold text-white transition"
            >
              Broadcast alerts
            </button>
            <button 
              onClick={() => setSelectedIds([])}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* COHORT COMMAND DRAWER */}
      <Drawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        title=""
      >
        {activeProfile && (
          <div className="space-y-6 pb-20">
            
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-5 -mx-6 -mt-6 sticky top-0 z-30 shadow-md">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 border border-slate-700">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm tracking-tight text-white">{activeProfile.name}</h3>
                    <span className="text-[10px] font-bold bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-blue-400">{activeProfile.code}</span>
                  </div>
                  <div className="text-[10.5px] text-slate-400 font-semibold truncate max-w-[280px]">
                    Program: {activeProfile.programName}
                  </div>
                </div>
              </div>

              {/* Drawer Sticky Quick Actions */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => openEditModal(activeProfile)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded transition"
                >
                  Edit Parameters
                </button>
                <button
                  onClick={() => setActiveActionModal({ type: 'mentorRemap' })}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded transition"
                >
                  Map Coach
                </button>
                <button
                  onClick={() => {
                    setStudentForm({ name: '', internId: '', college: 'Stanford University', department: 'CSE', performanceScore: 85 });
                    setActiveActionModal({ type: 'studentAdd' });
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded transition"
                >
                  Add Student
                </button>
                <button
                  onClick={() => {
                    setCapacityForm(activeProfile.capacity);
                    setActiveActionModal({ type: 'capacityChange' });
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded transition"
                >
                  Scale capacity
                </button>
                <button
                  onClick={() => {
                    setStatusForm(activeProfile.status);
                    setActiveActionModal({ type: 'statusShift' });
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded transition"
                >
                  Shift Status
                </button>
              </div>
            </div>

            {/* Quick Status Ribbon */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-wrap justify-between items-center text-xs font-semibold text-slate-600 gap-2">
              <div className="flex items-center gap-2">
                <span>Cohort Status:</span>
                <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{activeProfile.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Occupancy Utilized:</span>
                <span className="font-extrabold text-slate-800">{activeProfile.students.length} / {activeProfile.capacity} Seats</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Completion progress:</span>
                <span className="font-extrabold text-slate-800">{activeProfile.completionRate}%</span>
              </div>
            </div>

            {/* 9 Tabs selector */}
            <div className="border-b border-slate-200 flex flex-wrap gap-1">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'students', label: 'Student Allocation' },
                { id: 'mentor', label: 'Mentor Hub' },
                { id: 'capacity', label: 'Capacity management' },
                { id: 'performance', label: 'Intelligence stats' },
                { id: 'lifecycle', label: 'Lifecycle Journeys' },
                { id: 'projects', label: 'Projects & Tasks' },
                { id: 'metadata', label: 'Domain Settings' },
                { id: 'timeline', label: 'Audits History' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setProfileTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition border-b-2 ${profileTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50/20' : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB PANELS */}

            {/* TAB 1: OVERVIEW */}
            {profileTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Cohorts Details */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-400">Cohort parameters</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Batch Name</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Unique Code</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.code}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Program Mapping</span>
                      <span className="text-slate-900 font-extrabold truncate block" title={activeProfile.programName}>{activeProfile.programName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Internship Classification</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.internshipType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Start Date</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.startDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">End Date</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.endDate}</span>
                    </div>
                  </div>
                </div>

                {/* Aggregate performance stats */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-400">Cohort aggregates Metrics</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Assigned Learners</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.students.length} students</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Attendance Rate</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.performance.attendanceRate}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Completion Rate</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.completionRate}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Placement Rate</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.performance.placementConversion}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Active Capstone Tasks</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.projects.length} Projects</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Satisfaction Feedback</span>
                      <span className="text-emerald-700 font-black flex items-center gap-1 mt-0.5">
                        ★ {activeProfile.performance.satisfactionScore} / 5.0
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: STUDENT ALLOCATION */}
            {profileTab === 'students' && (
              <div className="space-y-6">
                
                {/* Allocation metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                    <div className="text-xl font-black text-slate-900">{activeProfile.students.length} / {activeProfile.capacity}</div>
                    <div className="text-[9.5px] uppercase font-bold text-slate-400 mt-0.5">Occupied Seats</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                    <div className="text-xl font-black text-slate-900">{activeProfile.capacity - activeProfile.students.length}</div>
                    <div className="text-[9.5px] uppercase font-bold text-slate-400 mt-0.5">Available Seats</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-slate-400">Allocated Cohort Roster</h4>
                    <button
                      onClick={() => {
                        setStudentForm({ name: '', internId: '', college: 'Stanford University', department: 'CSE', performanceScore: 85 });
                        setActiveActionModal({ type: 'studentAdd' });
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-extrabold flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Candidate
                    </button>
                  </div>

                  {activeProfile.students.length > 0 ? (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                          <tr>
                            <th className="px-4 py-2">Candidate</th>
                            <th className="px-4 py-2">Intern ID</th>
                            <th className="px-4 py-2">College / Dept</th>
                            <th className="px-4 py-2">GPA Score</th>
                            <th className="px-4 py-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                          {activeProfile.students.map(stu => (
                            <tr key={stu.id} className="hover:bg-slate-50/50">
                              <td className="px-4 py-2.5 font-extrabold text-slate-900">{stu.name}</td>
                              <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">{stu.internId}</td>
                              <td className="px-4 py-2.5 text-slate-500">{stu.college} ({stu.department})</td>
                              <td className="px-4 py-2.5 font-black text-slate-700">{stu.performanceScore}%</td>
                              <td className="px-4 py-2.5 text-right">
                                <button
                                  onClick={() => handleRemoveStudentFromBatch(stu.id)}
                                  className="p-1 hover:text-red-600 rounded text-slate-400 transition"
                                  title="Deallocate student from cohort batch roster"
                                >
                                  ✕ Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg text-xs text-slate-500">
                      No students are currently allocated to this batch cohort.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: MENTOR ALLOCATION */}
            {profileTab === 'mentor' && (
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase text-slate-400">Assigned Cohort Coach</h4>
                
                {activeProfile.mentor.name ? (
                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-semibold text-slate-700 space-y-3.5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">Mentor Name</span>
                          <span className="text-slate-900 font-extrabold">{activeProfile.mentor.name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">Department</span>
                          <span className="text-slate-900 font-extrabold">{activeProfile.mentor.department}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">Coach Expertise</span>
                          <span className="text-slate-900 font-extrabold">{activeProfile.mentor.expertise}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">Sessions Completed</span>
                          <span className="text-slate-900 font-extrabold">{activeProfile.mentor.sessionsConducted} Live Classes</span>
                        </div>
                      </div>
                    </div>

                    {/* Mentor Metrics grid */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                      <h5 className="text-[10px] font-black uppercase text-slate-500">Coach performance indices</h5>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded">
                          <div className="text-lg font-black text-slate-800">★ {activeProfile.mentor.rating}</div>
                          <span className="text-[8px] uppercase text-slate-400 font-bold block mt-0.5">Expert Rating</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded">
                          <div className="text-lg font-black text-slate-800">{activeProfile.mentor.studentSatisfaction}/5</div>
                          <span className="text-[8px] uppercase text-slate-400 font-bold block mt-0.5">Learners Rating</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded">
                          <div className="text-lg font-black text-slate-800">{activeProfile.mentor.successRate}%</div>
                          <span className="text-[8px] uppercase text-slate-400 font-bold block mt-0.5">Success Rate</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded">
                          <div className="text-lg font-black text-slate-800">{activeProfile.mentor.completionContribution}%</div>
                          <span className="text-[8px] uppercase text-slate-400 font-bold block mt-0.5">Completion contribution</span>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg text-xs text-rose-600 font-bold bg-rose-50/50">
                    Warning: No facilitator coach assigned. Student progress tracking disabled.
                  </div>
                )}

                <div className="border-t border-slate-200 pt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setMentorForm({
                        mentorId: activeProfile.mentor.id || 'emp-2',
                        mentorName: activeProfile.mentor.name || 'Bob Johnson'
                      });
                      setActiveActionModal({ type: 'mentorRemap' });
                    }}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-lg transition shadow-sm"
                  >
                    {activeProfile.mentor.name ? 'Reassign Mentor' : 'Assign Lead Coach'}
                  </button>
                  {activeProfile.mentor.name && (
                    <button
                      onClick={async () => {
                        const updated = await batchService.updateBatch(activeProfile.id, {
                          mentor: {
                            id: '', name: '', department: '', expertise: '', rating: 0, sessionsConducted: 0, studentSatisfaction: 0, successRate: 0, completionContribution: 0
                          }
                        });
                        if (updated) {
                          setBatches(batches.map(b => b.id === activeProfile.id ? updated : b));
                          setActiveProfile(updated);
                          showToast('Removed assigned mentor');
                        }
                      }}
                      className="px-3.5 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold transition"
                    >
                      Remove Mentor
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* TAB 4: CAPACITY MANAGEMENT */}
            {profileTab === 'capacity' && (
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400">Capacity Management Control</h4>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-semibold text-slate-700 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Maximum Capacity</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.capacity} Seats</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Allocated Capacity</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.students.length} Seats</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Remaining Vacancy</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.capacity - activeProfile.students.length} Seats</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Enrollment Phase</span>
                      <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block mt-0.5 border border-blue-100">
                        {activeProfile.status === 'Enrollment Open' ? 'Enrollment Active' : 'Enrollment Frozen'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setCapacityForm(activeProfile.capacity);
                      setActiveActionModal({ type: 'capacityChange' });
                    }}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-lg transition shadow-sm"
                  >
                    Adjust Max Seats
                  </button>
                  {activeProfile.status !== 'Enrollment Open' ? (
                    <button
                      onClick={async () => {
                        const updated = await batchService.updateBatch(activeProfile.id, { status: 'Enrollment Open' });
                        if (updated) {
                          setBatches(batches.map(b => b.id === activeProfile.id ? updated : b));
                          setActiveProfile(updated);
                          showToast('Enrollment open status activated');
                        }
                      }}
                      className="px-3.5 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold transition"
                    >
                      Open Enrollment
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        const updated = await batchService.updateBatch(activeProfile.id, { status: 'Active' });
                        if (updated) {
                          setBatches(batches.map(b => b.id === activeProfile.id ? updated : b));
                          setActiveProfile(updated);
                          showToast('Enrollment frozen');
                        }
                      }}
                      className="px-3.5 py-2 border border-slate-200 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs font-bold transition"
                    >
                      Freeze Enrollment
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* TAB 5: INTELLIGENCE STATS */}
            {profileTab === 'performance' && (
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase text-slate-400">Cohort Intelligence Center</h4>

                {/* Scorecard KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                  {[
                    { label: 'Completion Rate', value: `${activeProfile.completionRate}%`, color: 'bg-blue-50 text-blue-700' },
                    { label: 'Attendance Rate', value: `${activeProfile.performance.attendanceRate}%`, color: 'bg-emerald-50 text-emerald-700' },
                    { label: 'Assessment Avg', value: `${activeProfile.performance.assessmentAverage}/100`, color: 'bg-indigo-50 text-indigo-700' },
                    { label: 'Hiring Conversion', value: `${activeProfile.performance.placementConversion}%`, color: 'bg-purple-50 text-purple-700' },
                    { label: 'Satisfaction Score', value: `★ ${activeProfile.performance.satisfactionScore}/5`, color: 'bg-amber-50 text-amber-700' }
                  ].map((card, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border border-slate-100 flex flex-col justify-center ${card.color}`}>
                      <div className="text-lg font-black">{card.value}</div>
                      <div className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">{card.label}</div>
                    </div>
                  ))}
                </div>

                {/* SVG Charts */}
                {activeProfile.performance.attendanceTrend.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Attendance */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                      <h5 className="text-[10px] font-black uppercase text-slate-500">Weekly Attendance Trends</h5>
                      <div className="h-32 w-full flex items-end justify-between px-2 pt-4">
                        {activeProfile.performance.attendanceTrend.map((t, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                            <div className="text-[9px] font-bold text-slate-500">{t.rate}%</div>
                            <div className="w-8 bg-emerald-600 rounded-t" style={{ height: `${t.rate * 0.8}px` }} />
                            <div className="text-[8.5px] font-semibold text-slate-400 mt-1 truncate max-w-[40px]">{t.week}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Assessments */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                      <h5 className="text-[10px] font-black uppercase text-slate-500">Assessment Average</h5>
                      <div className="h-32 w-full flex items-end justify-between px-2 pt-4">
                        {activeProfile.performance.assessmentTrend.map((t, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                            <div className="text-[9px] font-bold text-slate-500">{t.average}</div>
                            <div className="w-8 bg-indigo-600 rounded-t" style={{ height: `${t.average * 0.8}px` }} />
                            <div className="text-[8.5px] font-semibold text-slate-400 mt-1 truncate max-w-[50px]" title={t.test}>{t.test}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg text-xs text-slate-500">
                    Cohort statistics parameters are generating. Check back post program activation milestones.
                  </div>
                )}

              </div>
            )}

            {/* TAB 6: LIFECYCLE PROGRESS */}
            {profileTab === 'lifecycle' && (
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400">Cohort Lifecycle progression</h4>

                <div className="relative border-l-2 border-blue-500 ml-4 pl-6 space-y-6 pt-2">
                  {[
                    { key: 'Draft', title: 'Phase 1: Roster Configured', desc: 'Cohort shell generated in ERP database.' },
                    { key: 'Upcoming', title: 'Phase 2: Roster Scheduled', desc: 'Mapped to academic timelines and programs.' },
                    { key: 'Enrollment Open', title: 'Phase 3: Registration Open', desc: 'Open to student allocations and university mapping.' },
                    { key: 'Active', title: 'Phase 4: Program Activated', desc: 'Coaching classes running. Weekly sprints launched.' },
                    { key: 'Completed', title: 'Phase 5: Concluded & Certified', desc: 'Milestones concluded. Internship credentials verified.' }
                  ].map((phase, idx) => {
                    const statusCycle = ['Draft', 'Upcoming', 'Enrollment Open', 'Active', 'Completed'];
                    const currentIdx = statusCycle.indexOf(activeProfile.status === 'On Hold' ? 'Enrollment Open' : activeProfile.status);
                    const isPast = statusCycle.indexOf(phase.key) <= currentIdx;
                    const isCurrent = phase.key === activeProfile.status;

                    return (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-[31px] top-0 h-4 w-4 rounded-full flex items-center justify-center border transition ${isCurrent ? 'bg-blue-600 border-blue-600 text-white shadow' : isPast ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 text-slate-400'}`}>
                          {isPast ? <Check className="h-2.5 w-2.5" /> : <div className="h-1 w-1 bg-slate-300 rounded-full" />}
                        </div>
                        <div className={`text-xs font-extrabold ${isCurrent ? 'text-blue-700' : isPast ? 'text-slate-800' : 'text-slate-400'}`}>
                          {phase.title}
                        </div>
                        <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed mt-0.5">{phase.desc}</p>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* TAB 7: PROJECTS & TASKS */}
            {profileTab === 'projects' && (
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400">Cohort Tasks & Capstones</h4>

                {activeProfile.projects.length > 0 ? (
                  <div className="space-y-3">
                    {activeProfile.projects.map((proj, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-center text-xs font-extrabold text-slate-800">
                          <span>{proj.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            proj.evaluationStatus === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                            proj.evaluationStatus === 'Ongoing' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                          }`}>{proj.evaluationStatus}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                            <span>Learner Submissions:</span>
                            <span>{proj.submissionRate}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${proj.submissionRate}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg text-xs text-slate-500">
                    No active tasks or capstones mapped to this cohort batch yet.
                  </div>
                )}

                <div className="border-t border-slate-200 pt-4">
                  <button
                    onClick={async () => {
                      const updatedProj = [...activeProfile.projects, {
                        name: `Module Sprint Capstone Project #${activeProfile.projects.length + 1}`,
                        submissionRate: 0,
                        evaluationStatus: 'Pending' as const
                      }];
                      const updated = await batchService.updateBatch(activeProfile.id, { projects: updatedProj });
                      if (updated) {
                        setBatches(batches.map(b => b.id === activeProfile.id ? updated : b));
                        setActiveProfile(updated);
                        showToast('Appended new sprint capstone task');
                      }
                    }}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-lg transition flex items-center gap-1 shadow-sm"
                  >
                    <PlusSquare className="h-4 w-4" />
                    Add Sprint Capstone
                  </button>
                </div>
              </div>
            )}

            {/* TAB 8: METADATA */}
            {profileTab === 'metadata' && (
              <div className="space-y-6">
                
                {/* Tech Stack */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-400">Software Stack Dependencies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProfile.metadata.techStack.map((tech, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono text-[10.5px]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-400">Batch Categorization Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProfile.metadata.tags.map((tag, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded text-[10.5px] font-bold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Settings list */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-400">Additional Domain Parameters</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Program Category</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.metadata.category}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Domain Focus</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.metadata.domain}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Urgency Priority</span>
                      <span className={`font-black px-1.5 py-0.5 rounded text-[10.5px] ${
                        activeProfile.metadata.priority === 'High' ? 'text-red-700 bg-red-50' : 'text-blue-700 bg-blue-50'
                      }`}>{activeProfile.metadata.priority}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Academic Year Mapped</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.metadata.academicYear}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 9: TIMELINE */}
            {profileTab === 'timeline' && (
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400">Chronological Audit Timeline</h4>
                
                <div className="relative border-l border-slate-200 ml-2 space-y-4 pl-4 pt-1">
                  {activeProfile.timeline.map((evt, idx) => (
                    <div key={idx} className="relative text-xs">
                      <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-slate-400 border border-white" />
                      <div className="text-[9.5px] font-bold text-slate-400">{evt.date}</div>
                      <div className="font-extrabold text-slate-800 mt-0.5">{evt.title}</div>
                      <p className="text-[10.5px] text-slate-500 font-medium leading-normal mt-0.5">{evt.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </Drawer>

      {/* POPUPS & DIALOGS */}
      {activeActionModal && (
        <div className={`z-50 flex transition-all ${
          (activeActionModal.type === 'edit' || activeActionModal.type === 'create') 
            ? 'absolute inset-0 bg-white p-0 items-start justify-stretch' 
            : 'fixed inset-0 bg-slate-900/60 backdrop-blur-xs p-4 items-center justify-center'
        }`}>
          <div className={`bg-white overflow-hidden transition-all duration-300 ${
            (activeActionModal.type === 'edit' || activeActionModal.type === 'create') 
              ? 'max-w-none w-full h-full rounded-none border-none flex flex-col' 
              : 'rounded-xl shadow-2xl border border-slate-200 w-full max-w-md animate-zoom-in'
          }`}>
            
            {/* Modal Header */}
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center text-sm font-black text-slate-900">
              <h3>
                {activeActionModal.type === 'create' && 'Create Cohort Batch'}
                {activeActionModal.type === 'edit' && 'Edit Cohort Parameters'}
                {activeActionModal.type === 'studentAdd' && 'Allocate Student to Roster'}
                {activeActionModal.type === 'mentorRemap' && 'Map Lead Coach'}
                {activeActionModal.type === 'capacityChange' && 'Scale Seat Capacity'}
                {activeActionModal.type === 'statusShift' && 'Update Lifecycle Status'}
                {activeActionModal.type === 'bulkStatus' && 'Bulk Shift Statuses'}
                {activeActionModal.type === 'bulkMentor' && 'Bulk Assign Lead Mentor'}
                {activeActionModal.type === 'bulkCapacity' && 'Bulk Scale Max Capacities'}
                {activeActionModal.type === 'bulkNotify' && 'Broadcast Cohort Notification'}
              </h3>
              <button 
                onClick={() => setActiveActionModal(null)}
                className="text-slate-400 hover:text-slate-700 transition text-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form 
              onSubmit={
                activeActionModal.type === 'create' ? handleCreateBatch :
                activeActionModal.type === 'edit' ? handleSaveBatch :
                activeActionModal.type === 'studentAdd' ? handleAddStudentToBatch :
                activeActionModal.type === 'mentorRemap' ? handleRemapMentor :
                activeActionModal.type === 'capacityChange' ? handleUpdateCapacity :
                activeActionModal.type === 'statusShift' ? handleUpdateStatus :
                handleExecuteBulkAction
              }
              className={`text-slate-850 flex flex-col min-h-0 ${
                (activeActionModal.type === 'edit' || activeActionModal.type === 'create') 
                  ? 'p-8 space-y-6 flex-1 h-full justify-between' 
                  : 'p-5 space-y-4'
              }`}
            >
              
              {/* Form 1: Create / Edit Cohort */}
              {(activeActionModal.type === 'create' || activeActionModal.type === 'edit') && (
                <div className="space-y-6 max-w-5xl mx-auto w-full flex-1 flex flex-col justify-start overflow-hidden pt-4">
                  
                  {/* Section 1 */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                      Section 1: Batch Parameters
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Batch Name *</label>
                        <input 
                          type="text" 
                          required 
                          value={editForm.name}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                      
                      {activeActionModal.type === 'edit' ? (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">Batch Code</label>
                          <input 
                            type="text" 
                            disabled
                            value={editForm.code}
                            className="w-full bg-slate-100 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-500 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">Program ID Mapped</label>
                          <select 
                            value={editForm.programId}
                            onChange={e => {
                              const pId = e.target.value;
                              const pName = pId === 'prog-1' ? 'Summer Software Engineering Internship' : pId === 'prog-2' ? 'Data Science Boot Camp' : 'Sales Boot Camp';
                              setEditForm({ ...editForm, programId: pId, programName: pName });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                          >
                            <option value="prog-1">Summer Software Engineering</option>
                            <option value="prog-2">Data Science Boot Camp</option>
                            <option value="prog-3">Sales Boot Camp</option>
                          </select>
                        </div>
                      )}

                      {activeActionModal.type === 'edit' && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">Program ID Mapped</label>
                          <select 
                            value={editForm.programId}
                            onChange={e => {
                              const pId = e.target.value;
                              const pName = pId === 'prog-1' ? 'Summer Software Engineering Internship' : pId === 'prog-2' ? 'Data Science Boot Camp' : 'Sales Boot Camp';
                              setEditForm({ ...editForm, programId: pId, programName: pName });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                          >
                            <option value="prog-1">Summer Software Engineering</option>
                            <option value="prog-2">Data Science Boot Camp</option>
                            <option value="prog-3">Sales Boot Camp</option>
                          </select>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Internship Classification</label>
                        <select 
                          value={editForm.internshipType}
                          onChange={e => setEditForm({ ...editForm, internshipType: e.target.value as any })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        >
                          <option value="Free Internship">Free Internship</option>
                          <option value="Paid Internship">Paid Internship</option>
                          <option value="Stipend Internship">Stipend Internship</option>
                          <option value="Industrial Internship">Industrial Internship</option>
                          <option value="Research Internship">Research Internship</option>
                          <option value="Corporate Internship">Corporate Internship</option>
                        </select>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Start Date</label>
                        <input 
                          type="date" 
                          value={editForm.startDate}
                          onChange={e => setEditForm({ ...editForm, startDate: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">End Date</label>
                        <input 
                          type="date" 
                          value={editForm.endDate}
                          onChange={e => setEditForm({ ...editForm, endDate: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Seat Capacity limit</label>
                        <input 
                          type="number" 
                          value={editForm.capacity}
                          onChange={e => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Lifecycle Status</label>
                        <select 
                          value={editForm.status}
                          onChange={e => setEditForm({ ...editForm, status: e.target.value as any })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Upcoming">Upcoming</option>
                          <option value="Enrollment Open">Enrollment Open</option>
                          <option value="Active">Active</option>
                          <option value="On Hold">On Hold</option>
                          <option value="Completed">Completed</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                      Section 2: Domain Details
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Category</label>
                        <input 
                          type="text" 
                          value={editForm.category}
                          onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Domain Focus</label>
                        <input 
                          type="text" 
                          value={editForm.domain}
                          onChange={e => setEditForm({ ...editForm, domain: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Priority Urgency</label>
                        <select 
                          value={editForm.priority}
                          onChange={e => setEditForm({ ...editForm, priority: e.target.value as any })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Academic Year Mapped</label>
                        <input 
                          type="text" 
                          value={editForm.academicYear}
                          onChange={e => setEditForm({ ...editForm, academicYear: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Software Stack Dependencies (comma separated)</label>
                        <input 
                          type="text" 
                          value={editForm.techStackString}
                          onChange={e => setEditForm({ ...editForm, techStackString: e.target.value })}
                          placeholder="e.g. React, Node.js, Docker"
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Form 2: Student Allocation */}
              {activeActionModal.type === 'studentAdd' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Student Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={studentForm.name}
                      onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Intern ID *</label>
                      <input 
                        type="text" 
                        required
                        value={studentForm.internId}
                        onChange={e => setStudentForm({ ...studentForm, internId: e.target.value })}
                        placeholder="e.g. INT-2026-999"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">GPA Score (0-100) *</label>
                      <input 
                        type="number" 
                        required
                        value={studentForm.performanceScore}
                        onChange={e => setStudentForm({ ...studentForm, performanceScore: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">College Institution</label>
                      <input 
                        type="text" 
                        value={studentForm.college}
                        onChange={e => setStudentForm({ ...studentForm, college: e.target.value })}
                        placeholder="e.g. Stanford University"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Department</label>
                      <select 
                        value={studentForm.department}
                        onChange={e => setStudentForm({ ...studentForm, department: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                      >
                        <option value="CSE">CSE</option>
                        <option value="IT">IT</option>
                        <option value="AI & DS">AI & DS</option>
                        <option value="ECE">ECE</option>
                        <option value="EEE">EEE</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Civil">Civil</option>
                        <option value="MBA">MBA</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Form 3: Mentor mapping */}
              {activeActionModal.type === 'mentorRemap' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Lead Cohort Coach *</label>
                    <select
                      value={mentorForm.mentorId}
                      onChange={e => {
                        const mId = e.target.value;
                        const mName = mId === 'emp-2' ? 'Bob Johnson' : mId === 'emp-3' ? 'Diana Prince' : 'Charlie Davis';
                        setMentorForm({ mentorId: mId, mentorName: mName });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="emp-2">Bob Johnson (Technical Engineering)</option>
                      <option value="emp-3">Diana Prince (Data Operations)</option>
                      <option value="emp-4">Charlie Davis (Supervisory HR)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Form 4: Capacity Scaling */}
              {activeActionModal.type === 'capacityChange' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Scale Max Cohort Size *</label>
                    <input 
                      type="number" 
                      required
                      value={capacityForm}
                      onChange={e => setCapacityForm(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Form 5: Status Shifting */}
              {activeActionModal.type === 'statusShift' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Update Lifecycle Status *</label>
                    <select
                      value={statusForm}
                      onChange={e => setStatusForm(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Enrollment Open">Enrollment Open</option>
                      <option value="Active">Active</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Form 6: Bulk updates */}
              {activeActionModal.type === 'bulkStatus' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Bulk Status Update *</label>
                    <select
                      value={bulkVal}
                      onChange={e => setBulkVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="">-- Choose Status --</option>
                      <option value="Draft">Draft</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Enrollment Open">Enrollment Open</option>
                      <option value="Active">Active</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>
              )}

              {activeActionModal.type === 'bulkMentor' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Map Coach *</label>
                    <select
                      value={bulkVal}
                      onChange={e => setBulkVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="">-- Choose Mentor --</option>
                      <option value="emp-2">Bob Johnson (Technical Engineering)</option>
                      <option value="emp-3">Diana Prince (Data Operations)</option>
                      <option value="emp-4">Charlie Davis (Supervisory HR)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeActionModal.type === 'bulkCapacity' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Max Seat Capacities limit *</label>
                    <input 
                      type="number"
                      required
                      value={bulkVal}
                      onChange={e => setBulkVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {activeActionModal.type === 'bulkNotify' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Notice Broadcast alert msg *</label>
                    <textarea
                      required
                      rows={3}
                      value={notifyMsg}
                      onChange={e => setNotifyMsg(e.target.value)}
                      placeholder="Write cohort email notifications content..."
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className={`flex gap-2 justify-end pt-4 border-t border-slate-100 ${
                (activeActionModal.type === 'edit' || activeActionModal.type === 'create') 
                  ? 'max-w-5xl mx-auto w-full' 
                  : ''
              }`}>
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
