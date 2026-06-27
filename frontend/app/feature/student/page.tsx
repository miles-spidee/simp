"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  Users, Search, Filter, Plus, ChevronRight, FileDown, MoreVertical, 
  GraduationCap, CheckCircle2, XCircle, AlertCircle, Calendar, Award, 
  FileText, Building, Clock, TrendingUp, Download, RefreshCw, UserCheck, 
  MapPin, Activity, Mail, Phone, Shield, Printer, QrCode, Briefcase, 
  UserX, ListFilter, Check, Trash, PlusCircle, LayoutGrid, Eye, Send, Lock
} from 'lucide-react';
import { studentService } from '@/src/services/student.service';
import { Student, StudentDocument, StudentTimelineEvent, StudentBatch } from '@/src/data/mock-students';
import { useAuth } from '@/src/context/AuthContext';
import { Drawer } from '@/components/feature/ui/Drawer';
import { PermissionGuard } from '@/components/feature/ui/PermissionGuard';

export default function StudentLifecycleManagementPage() {
  const { user } = useAuth();
  
  // App views: dashboard, directory
  const [activeView, setActiveView] = useState<'dashboard' | 'directory'>('dashboard');
  
  // Data state
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selected students for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Drawer states
  const [activeProfile, setActiveProfile] = useState<Student | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'documents' | 'id_credentials' | 'batch' | 'mentor' | 'performance' | 'placement' | 'lifecycle' | 'timeline'>('overview');
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  
  // Modal / Action form states
  const [activeActionModal, setActiveActionModal] = useState<{
    type: 'batch' | 'mentor' | 'status' | 'credentials' | 'cert' | 'import' | 'edit' | 'placement' | 'onboard' | 'bulkStatus' | 'bulkBatch' | 'bulkMentor' | 'bulkNotify';
    studentId?: string;
  } | null>(null);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterCollege, setFilterCollege] = useState<string>('all');
  const [filterBatch, setFilterBatch] = useState<string>('all');
  const [filterMentor, setFilterMentor] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlacement, setFilterPlacement] = useState<string>('all');
  const [filterPerformance, setFilterPerformance] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Forms state
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    college: '',
    department: 'CSE' as Student['academicInfo']['department'],
    degree: '',
    year: 1,
    cgpa: 8.0,
    graduationYear: 2027,
    program: '',
    internshipType: 'Free Internship' as Student['internshipInfo']['internshipType'],
    batchName: '',
    mentorId: '',
    mentorName: '',
    joiningDate: '',
    expectedCompletion: '',
  });

  const [batchForm, setBatchForm] = useState({
    name: '',
    program: '',
    startDate: '',
    endDate: '',
    mentor: '',
  });

  const [mentorForm, setMentorForm] = useState({
    mentorId: 'emp-2',
    mentorName: 'Bob Johnson',
  });

  const [statusForm, setStatusForm] = useState<Student['status']>('Applied');
  
  const [placementForm, setPlacementForm] = useState({
    status: 'Eligible' as Student['placement']['status'],
    company: '',
    package: '',
    interviewStatus: '',
    offerStatus: '',
  });

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
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (err) {
      console.error('Failed to load students data', err);
      showToast('Error loading student records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Keyboard Shortcuts listener (Esc to close, Ctrl+F to focus search)
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
  const collegesList = useMemo(() => {
    const colleges = new Set(students.map(s => s.academicInfo.college));
    return Array.from(colleges);
  }, [students]);

  const programsList = useMemo(() => {
    const programs = new Set(students.map(s => s.internshipInfo.program));
    return Array.from(programs);
  }, [students]);

  const batchesList = useMemo(() => {
    const batches = new Set(students.map(s => s.internshipInfo.batchName).filter(Boolean));
    return Array.from(batches);
  }, [students]);

  const mentorsList = useMemo(() => {
    const mentors = new Set(students.map(s => s.internshipInfo.mentorName).filter(Boolean));
    return Array.from(mentors);
  }, [students]);

  // Filtered Students logic
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      // Global text query search (ID, Name, Email, Phone, College)
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        s.personalInfo.name.toLowerCase().includes(q) ||
        s.internId.toLowerCase().includes(q) ||
        s.personalInfo.email.toLowerCase().includes(q) ||
        s.personalInfo.phone.toLowerCase().includes(q) ||
        s.academicInfo.college.toLowerCase().includes(q);

      const matchesProgram = filterProgram === 'all' || s.internshipInfo.program === filterProgram;
      const matchesDept = filterDept === 'all' || s.academicInfo.department === filterDept;
      const matchesCollege = filterCollege === 'all' || s.academicInfo.college === filterCollege;
      const matchesBatch = filterBatch === 'all' || s.internshipInfo.batchName === filterBatch;
      const matchesMentor = filterMentor === 'all' || s.internshipInfo.mentorName === filterMentor;
      const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
      const matchesPlacement = filterPlacement === 'all' || s.placement.status === filterPlacement;
      
      let matchesPerformance = true;
      if (filterPerformance !== 'all') {
        const perf = s.performance.overallPerformance;
        if (filterPerformance === 'high') matchesPerformance = perf >= 90;
        else if (filterPerformance === 'mid') matchesPerformance = perf >= 75 && perf < 90;
        else if (filterPerformance === 'low') matchesPerformance = perf < 75;
      }

      return matchesSearch && matchesProgram && matchesDept && matchesCollege && matchesBatch && matchesMentor && matchesStatus && matchesPlacement && matchesPerformance;
    });
  }, [students, searchTerm, filterProgram, filterDept, filterCollege, filterBatch, filterMentor, filterStatus, filterPlacement, filterPerformance]);

  // Executive Dashboard KPIs
  const dashboardStats = useMemo(() => {
    const total = students.length;
    const active = students.filter(s => s.status === 'Active').length;
    const training = students.filter(s => s.status === 'Enrolled' || s.status === 'Active').length;
    const completed = students.filter(s => s.status === 'Completed' || s.status === 'Certified' || s.status === 'Placed').length;
    const placementReady = students.filter(s => s.placement.status === 'Placement Ready' || s.placement.status === 'Placed' || s.placement.status === 'Offer Received').length;
    const placed = students.filter(s => s.status === 'Placed' || s.placement.status === 'Placed').length;
    const activeMentors = new Set(students.map(s => s.internshipInfo.mentorId).filter(Boolean)).size;
    
    // Count pending documents across all students
    let pendingDocs = 0;
    students.forEach(s => {
      s.documents.forEach(d => {
        if (d.status === 'Pending') pendingDocs++;
      });
    });

    return { total, active, training, completed, placementReady, placed, activeMentors, pendingDocs };
  }, [students]);

  // Aggregate stats for charts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Applied: 0, Approved: 0, Enrolled: 0, Active: 0, 'On Hold': 0, Completed: 0, Certified: 0, Placed: 0, Dropped: 0, Suspended: 0
    };
    students.forEach(s => {
      if (counts[s.status] !== undefined) counts[s.status]++;
    });
    return counts;
  }, [students]);

  const deptCounts = useMemo(() => {
    const counts: Record<string, number> = {
      CSE: 0, IT: 0, 'AI & DS': 0, ECE: 0, EEE: 0, Mechanical: 0, Civil: 0, MBA: 0
    };
    students.forEach(s => {
      const dept = s.academicInfo.department;
      if (counts[dept] !== undefined) counts[dept]++;
    });
    return counts;
  }, [students]);

  const programTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'Free Internship': 0, 'Paid Internship': 0, 'Industrial Internship': 0, 'Research Internship': 0, 'Corporate Internship': 0, 'Stipend Internship': 0
    };
    students.forEach(s => {
      const type = s.internshipInfo.internshipType;
      if (counts[type] !== undefined) counts[type]++;
    });
    return counts;
  }, [students]);

  // Performers list (Top 4 & Bottom 4)
  const sortedPerformers = useMemo(() => {
    const sorted = [...students].sort((a, b) => b.performance.overallPerformance - a.performance.overallPerformance);
    return {
      top: sorted.slice(0, 4),
      bottom: [...sorted].reverse().slice(0, 4).filter(s => s.performance.overallPerformance < 75)
    };
  }, [students]);

  // Global Activity Feed based on timeline logs
  const activityFeed = useMemo(() => {
    const feed: { studentName: string; avatar: string; date: string; title: string; desc: string; type: string }[] = [];
    students.forEach(s => {
      s.timeline.forEach(evt => {
        feed.push({
          studentName: s.personalInfo.name,
          avatar: s.personalInfo.avatar,
          date: evt.date,
          title: evt.title,
          desc: evt.description,
          type: evt.type
        });
      });
    });
    return feed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 7);
  }, [students]);

  // Click handler to open Drawer and sync the active profile
  const handleOpenProfile = (student: Student) => {
    setActiveProfile(student);
    setProfileTab('overview');
    setIsProfileDrawerOpen(true);
  };

  // Pre-fill student editing forms
  const openEditModal = (student: Student) => {
    setEditForm({
      name: student.personalInfo.name,
      email: student.personalInfo.email,
      phone: student.personalInfo.phone,
      dob: student.personalInfo.dob,
      gender: student.personalInfo.gender,
      address: student.personalInfo.address,
      college: student.academicInfo.college,
      department: student.academicInfo.department,
      degree: student.academicInfo.degree,
      year: student.academicInfo.year,
      cgpa: student.academicInfo.cgpa,
      graduationYear: student.academicInfo.graduationYear,
      program: student.internshipInfo.program,
      internshipType: student.internshipInfo.internshipType,
      batchName: student.internshipInfo.batchName,
      mentorId: student.internshipInfo.mentorId,
      mentorName: student.internshipInfo.mentorName,
      joiningDate: student.internshipInfo.joiningDate,
      expectedCompletion: student.internshipInfo.expectedCompletion,
    });
    setActiveActionModal({ type: 'edit', studentId: student.id });
  };

  // Primary action handlers
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionModal?.studentId) return;
    
    const targetId = activeActionModal.studentId;
    const original = students.find(s => s.id === targetId);
    if (!original) return;

    const updated = await studentService.updateStudent(targetId, {
      personalInfo: {
        ...original.personalInfo,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        dob: editForm.dob,
        gender: editForm.gender,
        address: editForm.address,
        avatar: editForm.name.split(' ').map(n => n[0]).join('').toUpperCase()
      },
      academicInfo: {
        college: editForm.college,
        department: editForm.department,
        degree: editForm.degree,
        year: Number(editForm.year),
        cgpa: Number(editForm.cgpa),
        graduationYear: Number(editForm.graduationYear)
      },
      internshipInfo: {
        ...original.internshipInfo,
        program: editForm.program,
        internshipType: editForm.internshipType,
        batchName: editForm.batchName,
        mentorId: editForm.mentorId || 'emp-2',
        mentorName: editForm.mentorName || 'Bob Johnson',
        joiningDate: editForm.joiningDate,
        expectedCompletion: editForm.expectedCompletion
      }
    });

    if (updated) {
      setStudents(students.map(s => s.id === targetId ? updated : s));
      if (activeProfile?.id === targetId) {
        setActiveProfile(updated);
      }
      showToast(`Updated student profile for ${updated.personalInfo.name}`);
      setActiveActionModal(null);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const newStu = await studentService.createStudent({
      application_id: 'app-1',
      program_id: 'prog-1'
    } as any);

    if (newStu) {
      setStudents([...students, newStu]);
      showToast(`Enrolled student ${newStu.personalInfo.name} with ID ${newStu.internId}`);
      setActiveActionModal(null);
    }
  };

  // Document verification toggle
  const handleVerifyDocument = async (studentId: string, docType: string, newStatus: 'Verified' | 'Rejected') => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const updatedDocs = student.documents.map(doc => {
      if (doc.type === docType) {
        return { ...doc, status: newStatus, verifiedBy: user?.name || 'System Coordinator' };
      }
      return doc;
    });

    const updatedTimeline = [...student.timeline];
    updatedTimeline.unshift({
      date: new Date().toISOString().split('T')[0],
      title: `Document ${newStatus}`,
      description: `Document of type ${docType} has been ${newStatus.toLowerCase()} by ${user?.name || 'Academic Operations'}.`,
      type: newStatus === 'Verified' ? 'approval' : 'info'
    });

    const updated = await studentService.updateStudent(studentId, {
      documents: updatedDocs,
      timeline: updatedTimeline
    });

    if (updated) {
      setStudents(students.map(s => s.id === studentId ? updated : s));
      if (activeProfile?.id === studentId) {
        setActiveProfile(updated);
      }
      showToast(`Document "${docType}" status set to ${newStatus}`);
    }
  };

  // Credential resets
  const handleToggleAccess = async (studentId: string, accessKey: keyof Student['credentials']) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const updatedCreds = {
      ...student.credentials,
      [accessKey]: !student.credentials[accessKey]
    };

    const updated = await studentService.updateStudent(studentId, {
      credentials: updatedCreds
    });

    if (updated) {
      setStudents(students.map(s => s.id === studentId ? updated : s));
      if (activeProfile?.id === studentId) {
        setActiveProfile(updated);
      }
      showToast(`Access config "${String(accessKey)}" updated successfully`);
    }
  };

  // Single batch mapping update
  const handleUpdateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;
    const studentId = activeProfile.id;

    const updated = await studentService.updateStudent(studentId, {
      batch: {
        name: batchForm.name,
        program: batchForm.program || activeProfile.internshipInfo.program,
        startDate: batchForm.startDate || '2026-05-01',
        endDate: batchForm.endDate || '2026-08-01',
        mentor: batchForm.mentor || activeProfile.internshipInfo.mentorName,
        status: 'Active'
      },
      internshipInfo: {
        ...activeProfile.internshipInfo,
        batchName: batchForm.name
      }
    });

    if (updated) {
      // Add timeline event
      const updatedTimeline = [...updated.timeline];
      updatedTimeline.unshift({
        date: new Date().toISOString().split('T')[0],
        title: 'Batch Re-assigned',
        description: `Transferred to batch "${batchForm.name}".`,
        type: 'batch'
      });
      const finalObj = await studentService.updateStudent(studentId, { timeline: updatedTimeline });
      
      if (finalObj) {
        setStudents(students.map(s => s.id === studentId ? finalObj : s));
        setActiveProfile(finalObj);
        showToast(`Transferred student to batch ${batchForm.name}`);
        setActiveActionModal(null);
      }
    }
  };

  // Single mentor mapping update
  const handleUpdateMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;
    const studentId = activeProfile.id;

    const updated = await studentService.updateStudent(studentId, {
      mentor: {
        name: mentorForm.mentorName,
        department: 'Engineering Operations',
        expertise: 'Domain Expert',
        sessionsConducted: 0,
        rating: 5.0,
        feedbackGiven: []
      },
      internshipInfo: {
        ...activeProfile.internshipInfo,
        mentorId: mentorForm.mentorId,
        mentorName: mentorForm.mentorName
      }
    });

    if (updated) {
      const updatedTimeline = [...updated.timeline];
      updatedTimeline.unshift({
        date: new Date().toISOString().split('T')[0],
        title: 'Mentor Remapped',
        description: `Assigned new primary mentor ${mentorForm.mentorName}.`,
        type: 'mentor'
      });
      const finalObj = await studentService.updateStudent(studentId, { timeline: updatedTimeline });

      if (finalObj) {
        setStudents(students.map(s => s.id === studentId ? finalObj : s));
        setActiveProfile(finalObj);
        showToast(`Assigned mentor ${mentorForm.mentorName} successfully`);
        setActiveActionModal(null);
      }
    }
  };

  // Single status mapping update
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;
    const studentId = activeProfile.id;

    const updated = await studentService.updateStudent(studentId, {
      status: statusForm
    });

    if (updated) {
      const updatedTimeline = [...updated.timeline];
      updatedTimeline.unshift({
        date: new Date().toISOString().split('T')[0],
        title: 'Status Updated',
        description: `Status changed to "${statusForm}".`,
        type: 'info'
      });
      const finalObj = await studentService.updateStudent(studentId, { timeline: updatedTimeline });

      if (finalObj) {
        setStudents(students.map(s => s.id === studentId ? finalObj : s));
        setActiveProfile(finalObj);
        showToast(`Student status updated to ${statusForm}`);
        setActiveActionModal(null);
      }
    }
  };

  // Single placement mapping update
  const handleUpdatePlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;
    const studentId = activeProfile.id;

    const updated = await studentService.updateStudent(studentId, {
      placement: {
        status: placementForm.status,
        company: placementForm.company || undefined,
        package: placementForm.package || undefined,
        interviewStatus: placementForm.interviewStatus || undefined,
        offerStatus: placementForm.offerStatus || undefined
      }
    });

    if (updated) {
      const updatedTimeline = [...updated.timeline];
      updatedTimeline.unshift({
        date: new Date().toISOString().split('T')[0],
        title: 'Placement Info Updated',
        description: `Placement pipeline status changed to ${placementForm.status}${placementForm.company ? ` at ${placementForm.company}` : ''}.`,
        type: 'placement'
      });
      const finalObj = await studentService.updateStudent(studentId, { timeline: updatedTimeline });

      if (finalObj) {
        setStudents(students.map(s => s.id === studentId ? finalObj : s));
        setActiveProfile(finalObj);
        showToast(`Placement parameters updated for ${activeProfile.personalInfo.name}`);
        setActiveActionModal(null);
      }
    }
  };

  // Generate certificate for single student
  const handleGenerateCertificate = async (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const hasCert = student.documents.some(doc => doc.type === 'Completion Certificate');
    let updatedDocs = [...student.documents];
    if (!hasCert) {
      updatedDocs.push({
        type: 'Completion Certificate',
        name: `PineSphere_Certificate_${student.internId}.pdf`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Verified',
        verifiedBy: 'Academic Operations',
        url: '#'
      });
    }

    const updatedTimeline = [...student.timeline];
    updatedTimeline.unshift({
      date: new Date().toISOString().split('T')[0],
      title: 'Certificate Issued',
      description: `internship completion certificate generated for ${student.internId}.`,
      type: 'cert'
    });

    const updated = await studentService.updateStudent(studentId, {
      status: 'Certified',
      documents: updatedDocs,
      timeline: updatedTimeline
    });

    if (updated) {
      setStudents(students.map(s => s.id === studentId ? updated : s));
      if (activeProfile?.id === studentId) {
        setActiveProfile(updated);
      }
      showToast(`Successfully generated credentials/certificates for ${student.personalInfo.name}`);
    }
  };

  // Revoke certificate
  const handleRevokeCertificate = async (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const updatedDocs = student.documents.filter(doc => doc.type !== 'Completion Certificate');
    const updatedTimeline = [...student.timeline];
    updatedTimeline.unshift({
      date: new Date().toISOString().split('T')[0],
      title: 'Certificate Revoked',
      description: `Completion certificate has been revoked due to administrative criteria.`,
      type: 'cert'
    });

    const updated = await studentService.updateStudent(studentId, {
      status: 'Active',
      documents: updatedDocs,
      timeline: updatedTimeline
    });

    if (updated) {
      setStudents(students.map(s => s.id === studentId ? updated : s));
      if (activeProfile?.id === studentId) {
        setActiveProfile(updated);
      }
      showToast('Certificate revoked successfully');
    }
  };

  // Multi-row Selection handlers
  const handleToggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map(s => s.id));
    }
  };

  // Bulk Operations Submit
  const handleExecuteBulkAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionModal || selectedIds.length === 0) return;

    if (activeActionModal.type === 'bulkStatus') {
      const statusVal = bulkVal as Student['status'];
      await studentService.bulkUpdateStatus(selectedIds, statusVal);
      showToast(`Bulk updated status to ${statusVal} for ${selectedIds.length} students`);
    } else if (activeActionModal.type === 'bulkBatch') {
      await studentService.bulkAssignBatch(selectedIds, bulkVal);
      showToast(`Bulk mapped ${selectedIds.length} students to batch ${bulkVal}`);
    } else if (activeActionModal.type === 'bulkMentor') {
      const mentorName = bulkVal === 'emp-2' ? 'Bob Johnson' : bulkVal === 'emp-3' ? 'Diana Prince' : 'Charlie Davis';
      await studentService.bulkAssignMentor(selectedIds, bulkVal, mentorName);
      showToast(`Bulk assigned mentor ${mentorName} to ${selectedIds.length} students`);
    } else if (activeActionModal.type === 'bulkNotify') {
      showToast(`Notification sent to ${selectedIds.length} selected students.`);
    }

    // Refresh state
    const data = await studentService.getStudents();
    setStudents(data);
    setSelectedIds([]);
    setActiveActionModal(null);
    setBulkVal('');
    setNotifyMsg('');
  };

  const handleBulkCredentials = async () => {
    if (selectedIds.length === 0) return;
    await studentService.bulkGenerateCredentials(selectedIds);
    const data = await studentService.getStudents();
    setStudents(data);
    setSelectedIds([]);
    showToast(`Dispatched LMS credentials and reset access keys for ${selectedIds.length} accounts.`);
  };

  const handleBulkCertificates = async () => {
    if (selectedIds.length === 0) return;
    await studentService.bulkGenerateCertificates(selectedIds);
    const data = await studentService.getStudents();
    setStudents(data);
    setSelectedIds([]);
    showToast(`Bulk generated completion credentials & certifications for ${selectedIds.length} students.`);
  };

  // Export selected roster to CSV
  const handleExportRoster = () => {
    const listToExport = selectedIds.length > 0 
      ? students.filter(s => selectedIds.includes(s.id))
      : filteredStudents;

    if (listToExport.length === 0) {
      showToast('No student records to export', 'error');
      return;
    }

    const headers = ['Intern ID', 'Full Name', 'Email', 'Phone', 'College', 'Department', 'Batch', 'Program', 'Mentor', 'Status', 'Performance Score', 'Placement Status'];
    const rows = listToExport.map(s => [
      s.internId,
      s.personalInfo.name,
      s.personalInfo.email,
      s.personalInfo.phone,
      s.academicInfo.college,
      s.academicInfo.department,
      s.internshipInfo.batchName || 'N/A',
      s.internshipInfo.program,
      s.internshipInfo.mentorName || 'N/A',
      s.status,
      s.performance.overallPerformance,
      s.placement.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Student_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${listToExport.length} student records successfully.`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Student CRM Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 select-none text-slate-800 ${
      (activeActionModal?.type === 'edit' || activeActionModal?.type === 'onboard') 
        ? 'h-[calc(100vh-80px)] overflow-hidden relative' 
        : 'pb-12 animate-fade-in relative min-h-screen'
    }`}>
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl border bg-white animate-slide-in text-xs font-bold transition-all duration-300">
          {toast.type === 'success' && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />}
          {toast.type === 'error' && <XCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />}
          {toast.type === 'info' && <AlertCircle className="h-4.5 w-4.5 text-blue-600 shrink-0" />}
          <span className="text-slate-700">{toast.message}</span>
        </div>
      )}

      {/* Header Sticky Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>PineSphere Operations</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-black">Student Lifecycle CRM</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">Student Workspace (SLMS)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Oversee credentials, batch shifts, mentor pipelines, document verification, and hiring analytics.
          </p>
        </div>

        {/* Global Tab Toggle and Quick actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-100 p-0.5 rounded-lg flex border border-slate-200 shadow-sm shrink-0">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all duration-200 ${activeView === 'dashboard' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Overview Dashboard</span>
            </button>
            <button
              onClick={() => setActiveView('directory')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all duration-200 ${activeView === 'directory' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Student Directory</span>
            </button>
          </div>

          <PermissionGuard required="student.export">
            <button 
              onClick={handleExportRoster}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:border-blue-600 hover:text-blue-600 bg-white rounded-lg text-xs font-bold text-slate-700 shadow-sm transition-all cursor-pointer"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </PermissionGuard>
          
          <PermissionGuard required="student.create">
            <button 
              onClick={() => {
                setEditForm({
                  name: '', email: '', phone: '', dob: '', gender: 'Male', address: '', college: '',
                  department: 'CSE', degree: 'B.Tech', year: 3, cgpa: 8.5, graduationYear: 2027,
                  program: 'Summer Software Engineering Internship', internshipType: 'Free Internship',
                  batchName: 'Alpha Cohort 2026', mentorId: 'emp-2', mentorName: 'Bob Johnson',
                  joiningDate: '', expectedCompletion: ''
                });
                setActiveActionModal({ type: 'onboard' });
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Enroll Student</span>
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* VIEW 1: EXECUTIVE DASHBOARD */}
      {activeView === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Dashboard Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Enrolled', count: dashboardStats.total, icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100', filterKey: 'all', filterVal: 'all' },
              { label: 'Active Students', count: dashboardStats.active, icon: Activity, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', filterKey: 'status', filterVal: 'Active' },
              { label: 'In Training Roster', count: dashboardStats.training, icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100', filterKey: 'status', filterVal: 'Active' },
              { label: 'Completed Specialization', count: dashboardStats.completed, icon: GraduationCap, color: 'text-purple-600 bg-purple-50 border-purple-100', filterKey: 'status', filterVal: 'Completed' },
              { label: 'Placement Ready', count: dashboardStats.placementReady, icon: Award, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', filterKey: 'placement', filterVal: 'Placement Ready' },
              { label: 'Hired & Placed', count: dashboardStats.placed, icon: UserCheck, color: 'text-teal-600 bg-teal-50 border-teal-100', filterKey: 'status', filterVal: 'Placed' },
              { label: 'Assigned Mentors', count: dashboardStats.activeMentors, icon: Shield, color: 'text-pink-600 bg-pink-50 border-pink-100', filterKey: 'all', filterVal: 'all' },
              { label: 'Pending Documents', count: dashboardStats.pendingDocs, icon: FileText, color: 'text-rose-600 bg-rose-50 border-rose-100', filterKey: 'all', filterVal: 'all' }
            ].map((kpi, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  if (kpi.filterKey === 'status') setFilterStatus(kpi.filterVal);
                  if (kpi.filterKey === 'placement') setFilterPlacement(kpi.filterVal);
                  if (kpi.filterKey !== 'all') {
                    setActiveView('directory');
                    showToast(`Filtering directory by ${kpi.label}`);
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Status Splits */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-blue-600" />
                Status Distribution
              </h3>
              <div className="space-y-2">
                {Object.entries(statusCounts).map(([status, count], index) => {
                  const pct = Math.round((count / students.length) * 100) || 0;
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

            {/* Department Splits */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Building className="h-4 w-4 text-emerald-600" />
                Enrollments by Department
              </h3>
              <div className="space-y-2">
                {Object.entries(deptCounts).map(([dept, count], index) => {
                  const pct = Math.round((count / students.length) * 100) || 0;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{dept}</span>
                        <span>{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Program Type Splits */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-purple-600" />
                Internship Type Mapping
              </h3>
              <div className="space-y-2">
                {Object.entries(programTypeCounts).map(([type, count], index) => {
                  const pct = Math.round((count / students.length) * 100) || 0;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{type}</span>
                        <span>{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-600 rounded-full transition-all duration-500" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Performance Lists & Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Top Performers */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 lg:col-span-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                Academic Top Performers (90%+)
              </h3>
              <div className="space-y-3">
                {sortedPerformers.top.map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => handleOpenProfile(s)}
                    className="flex items-center justify-between border-b border-slate-100 pb-2 cursor-pointer hover:bg-slate-50/50 p-1.5 rounded-lg transition"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        {s.personalInfo.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{s.personalInfo.name}</div>
                        <div className="text-[10px] text-slate-500">{s.academicInfo.college} | {s.academicInfo.department}</div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {s.performance.overallPerformance}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Performers or At Risk */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 lg:col-span-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-rose-600" />
                At-Risk Cohort (Below 75%)
              </h3>
              <div className="space-y-3">
                {sortedPerformers.bottom.length > 0 ? (
                  sortedPerformers.bottom.map(s => (
                    <div 
                      key={s.id} 
                      onClick={() => handleOpenProfile(s)}
                      className="flex items-center justify-between border-b border-slate-100 pb-2 cursor-pointer hover:bg-slate-50/50 p-1.5 rounded-lg transition"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
                          {s.personalInfo.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{s.personalInfo.name}</div>
                          <div className="text-[10px] text-slate-500">{s.academicInfo.college} | {s.academicInfo.department}</div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        {s.performance.overallPerformance}%
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-500">No students are currently marked below 75% threshold.</div>
                )}
              </div>
            </div>

            {/* Recent Timeline Feed */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 lg:col-span-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-blue-600" />
                Recent SLMS Activity Feed
              </h3>
              <div className="relative border-l-2 border-slate-100 ml-2 space-y-4.5 pl-4 max-h-[300px] overflow-y-auto">
                {activityFeed.map((act, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[23px] top-0.5 bg-blue-100 text-blue-700 h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold border border-white">
                      {act.avatar[0]}
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold">{act.date}</div>
                    <div className="text-xs font-extrabold text-slate-800 mt-0.5">{act.title}</div>
                    <p className="text-[10.5px] text-slate-600 leading-tight mt-0.5">
                      <span className="font-bold text-blue-700">{act.studentName}</span>: {act.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW 2: STUDENT DIRECTORY */}
      {activeView === 'directory' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          
          {/* Filters & Search Toolbar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              
              {/* Query Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  ref={searchInputRef}
                  placeholder="Search students (Name, ID, Email, Phone, College)... [Ctrl+F]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-lg text-xs font-bold shadow-xs transition-all ${showFilters ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                  <ListFilter className="h-3.5 w-3.5" />
                  <span>{showFilters ? 'Hide Filters' : 'Advanced Filters'}</span>
                </button>

                {(filterProgram !== 'all' || filterDept !== 'all' || filterCollege !== 'all' || filterBatch !== 'all' || filterMentor !== 'all' || filterStatus !== 'all' || filterPlacement !== 'all' || filterPerformance !== 'all') && (
                  <button 
                    onClick={() => {
                      setFilterProgram('all');
                      setFilterDept('all');
                      setFilterCollege('all');
                      setFilterBatch('all');
                      setFilterMentor('all');
                      setFilterStatus('all');
                      setFilterPlacement('all');
                      setFilterPerformance('all');
                      showToast('Cleared all directories filters');
                    }}
                    className="px-3.5 py-2 border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all"
                  >
                    Reset All
                  </button>
                )}
              </div>

            </div>

            {/* Dynamic Multi-Filter Panels */}
            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
                
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
                  <label className="text-[10px] font-black uppercase text-slate-400">Lifecycle Status</label>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Applied">Applied</option>
                    <option value="Approved">Approved</option>
                    <option value="Enrolled">Enrolled</option>
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Certified">Certified</option>
                    <option value="Placed">Placed</option>
                    <option value="Dropped">Dropped</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                {/* College filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Institution College</label>
                  <select 
                    value={filterCollege}
                    onChange={(e) => setFilterCollege(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="all">All Colleges</option>
                    {collegesList.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Department filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Department</label>
                  <select 
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="all">All Departments</option>
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

                {/* Batch filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Batch Cohort</label>
                  <select 
                    value={filterBatch}
                    onChange={(e) => setFilterBatch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="all">All Batches</option>
                    {batchesList.map((b, idx) => <option key={idx} value={b}>{b}</option>)}
                  </select>
                </div>

                {/* Mentor filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Mentor Assigned</label>
                  <select 
                    value={filterMentor}
                    onChange={(e) => setFilterMentor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="all">All Mentors</option>
                    {mentorsList.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* Placement Stage filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Placement Stage</label>
                  <select 
                    value={filterPlacement}
                    onChange={(e) => setFilterPlacement(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="all">All Placement Stages</option>
                    <option value="Not Eligible">Not Eligible</option>
                    <option value="Eligible">Eligible</option>
                    <option value="Placement Ready">Placement Ready</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Offer Received">Offer Received</option>
                    <option value="Placed">Placed</option>
                  </select>
                </div>

                {/* Performance level filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Overall Performance</label>
                  <select 
                    value={filterPerformance}
                    onChange={(e) => setFilterPerformance(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700"
                  >
                    <option value="all">All Ranges</option>
                    <option value="high">High Performers (90%+)</option>
                    <option value="mid">Mid Performers (75%-89%)</option>
                    <option value="low">At Risk (Below 75%)</option>
                  </select>
                </div>

              </div>
            )}

          </div>

          {/* High Density React Data Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-center w-10">
                    <input 
                      type="checkbox"
                      checked={filteredStudents.length > 0 && selectedIds.length === filteredStudents.length}
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3">Intern ID</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">College</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Batch Cohort</th>
                  <th className="px-4 py-3">Internship Program</th>
                  <th className="px-4 py-3">Mentor Mapping</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Hiring Stage</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => {
                    const isSelected = selectedIds.includes(s.id);
                    return (
                      <tr 
                        key={s.id} 
                        className={`hover:bg-slate-50/50 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}
                      >
                        <td className="px-4 py-3 text-center">
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectRow(s.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-500 font-semibold">{s.internId}</td>
                        <td className="px-4 py-3">
                          <div 
                            onClick={() => handleOpenProfile(s)}
                            className="flex items-center gap-2 cursor-pointer group"
                          >
                            <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 group-hover:scale-105 transition-transform">
                              {s.personalInfo.avatar}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{s.personalInfo.name}</div>
                              <div className="text-[10px] text-slate-400 font-bold">{s.personalInfo.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{s.academicInfo.college}</td>
                        <td className="px-4 py-3 text-slate-600">{s.academicInfo.department}</td>
                        <td className="px-4 py-3 text-slate-500">{s.internshipInfo.batchName || <span className="italic text-slate-300">TBA</span>}</td>
                        <td className="px-4 py-3 text-slate-600 truncate max-w-[150px]">{s.internshipInfo.program}</td>
                        <td className="px-4 py-3">
                          {s.internshipInfo.mentorName ? (
                            <span className="text-slate-700 font-semibold flex items-center gap-1">
                              <Shield className="h-3 w-3 text-slate-400" />
                              {s.internshipInfo.mentorName}
                            </span>
                          ) : (
                            <span className="text-rose-600 font-bold italic flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-black px-1.5 py-0.5 rounded ${s.performance.overallPerformance >= 90 ? 'text-emerald-700 bg-emerald-50' : s.performance.overallPerformance >= 75 ? 'text-blue-700 bg-blue-50' : 'text-rose-700 bg-rose-50'}`}>
                            {s.performance.overallPerformance}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.placement.status === 'Placed' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                            s.placement.status === 'Offer Received' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            s.placement.status === 'Interview Scheduled' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            s.placement.status === 'Placement Ready' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {s.placement.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            s.status === 'Completed' || s.status === 'Certified' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            s.status === 'Placed' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                            s.status === 'On Hold' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => handleOpenProfile(s)}
                              className="p-1 hover:text-blue-600 hover:bg-slate-100 rounded text-slate-400 transition-colors"
                              title="View Profile Workspace"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <PermissionGuard required="student.edit">
                              <button 
                                onClick={() => openEditModal(s)}
                                className="p-1 hover:text-amber-600 hover:bg-slate-100 rounded text-slate-400 transition-colors"
                                title="Edit Personal/Academic Info"
                              >
                                <PlusCircle className="h-4 w-4" />
                              </button>
                            </PermissionGuard>
                            <button 
                              onClick={() => handleGenerateCertificate(s.id)}
                              className="p-1 hover:text-emerald-600 hover:bg-slate-100 rounded text-slate-400 transition-colors"
                              title="Generate Certificates"
                            >
                              <Award className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={12} className="px-4 py-12 text-center text-slate-500">
                      <Users className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                      <p className="text-sm font-extrabold text-slate-600">No student records found</p>
                      <p className="text-xs text-slate-400 mt-0.5">Adjust filter conditions or search query keywords.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Roster Table Pagination Summary */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-500">
            <div>
              Showing {filteredStudents.length} of {students.length} students
            </div>
            <div>
              {selectedIds.length > 0 && (
                <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  {selectedIds.length} items checked for bulk processing
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FLOAT-UP BULK ACTION TOOLBAR (linear style) */}
      {selectedIds.length > 0 && activeView === 'directory' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-xl shadow-2xl px-5 py-3.5 border border-slate-800 flex items-center justify-between gap-6 max-w-3xl w-[90%] animate-slide-up">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-blue-600 text-white font-black text-xs rounded-full flex items-center justify-center shrink-0">
              {selectedIds.length}
            </div>
            <span className="text-xs font-bold text-slate-300">Selected for Bulk Admin operations</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            
            {/* Status */}
            <button 
              onClick={() => setActiveActionModal({ type: 'bulkStatus' })}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-bold text-slate-200 transition-colors"
            >
              Update Status
            </button>

            {/* Batch */}
            <button 
              onClick={() => setActiveActionModal({ type: 'bulkBatch' })}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-bold text-slate-200 transition-colors"
            >
              Assign Batch
            </button>

            {/* Mentor */}
            <button 
              onClick={() => setActiveActionModal({ type: 'bulkMentor' })}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-bold text-slate-200 transition-colors"
            >
              Map Mentor
            </button>

            {/* Credentials */}
            <button 
              onClick={handleBulkCredentials}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-bold text-slate-200 transition-colors flex items-center gap-1"
            >
              <Lock className="h-3 w-3 text-slate-400" />
              Credentials
            </button>

            {/* Certificates */}
            <button 
              onClick={handleBulkCertificates}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-bold text-slate-200 transition-colors flex items-center gap-1"
            >
              <Award className="h-3 w-3 text-slate-400" />
              Certificates
            </button>

            {/* Notify */}
            <button 
              onClick={() => setActiveActionModal({ type: 'bulkNotify' })}
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-[11px] font-bold text-white transition-colors"
            >
              Send Alerts
            </button>

            <button 
              onClick={() => setSelectedIds([])}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
              title="Clear selection"
            >
              <Trash className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      )}

      {/* SINGLE STUDENT COMPREHENSIVE DRAWER COMMAND CENTER */}
      <Drawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        title="" // Custom styled header below
      >
        {activeProfile && (
          <div className="space-y-6 pb-20">
            
            {/* Drawer Master Sticky Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-5 -mx-6 -mt-6 sticky top-0 z-30 shadow-md">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm border border-slate-700 shrink-0">
                  {activeProfile.personalInfo.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm tracking-tight">{activeProfile.personalInfo.name}</h3>
                    <span className="text-[10px] font-bold bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-blue-400">{activeProfile.internId}</span>
                  </div>
                  <div className="text-[10.5px] text-slate-400 font-medium">
                    {activeProfile.academicInfo.college} | {activeProfile.academicInfo.department}
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex flex-wrap items-center gap-1.5">
                <PermissionGuard required="student.edit">
                  <button
                    onClick={() => openEditModal(activeProfile)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded transition"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setActiveActionModal({ type: 'batch' })}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded transition"
                  >
                    Transfer Batch
                  </button>
                </PermissionGuard>
                <button
                  onClick={() => setActiveActionModal({ type: 'mentor' })}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded transition"
                >
                  Map Mentor
                </button>
                <button
                  onClick={() => {
                    setStatusForm(activeProfile.status);
                    setActiveActionModal({ type: 'status' });
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded transition"
                >
                  Shift Status
                </button>
                <button
                  onClick={() => handleGenerateCertificate(activeProfile.id)}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded transition"
                >
                  Generate Cert
                </button>
              </div>
            </div>

            {/* Profile Workspace Status Ribbon */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-wrap justify-between items-center text-xs font-semibold text-slate-600 gap-2">
              <div className="flex items-center gap-2">
                <span>Roster Status:</span>
                <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{activeProfile.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Current Batch:</span>
                <span className="font-extrabold text-slate-800">{activeProfile.internshipInfo.batchName || 'TBA'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Mentor:</span>
                <span className="font-extrabold text-slate-800">{activeProfile.internshipInfo.mentorName || 'Unassigned'}</span>
              </div>
            </div>

            {/* Drawer 9 Tabs Selector */}
            <div className="border-b border-slate-200 flex flex-wrap gap-1">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'documents', label: 'Documents' },
                { id: 'id_credentials', label: 'Credentials' },
                { id: 'batch', label: 'Batch' },
                { id: 'mentor', label: 'Mentor Hub' },
                { id: 'performance', label: 'Performance' },
                { id: 'placement', label: 'Placement' },
                { id: 'lifecycle', label: 'Journey' },
                { id: 'timeline', label: 'Audit Timeline' }
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

            {/* TAB CONTENTS */}

            {/* TAB 1: OVERVIEW */}
            {profileTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Personal */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1">
                    <Users className="h-4.5 w-4.5 text-slate-400" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Full Legal Name</span>
                      <span className="text-slate-900 font-extrabold text-xs">{activeProfile.personalInfo.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Email Address</span>
                      <span className="text-slate-900 font-extrabold text-xs">{activeProfile.personalInfo.email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Mobile Contact</span>
                      <span className="text-slate-900 font-extrabold text-xs">{activeProfile.personalInfo.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Date of Birth</span>
                      <span className="text-slate-900 font-extrabold text-xs">{activeProfile.personalInfo.dob}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Gender Identity</span>
                      <span className="text-slate-900 font-extrabold text-xs">{activeProfile.personalInfo.gender}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Mailing Address</span>
                      <span className="text-slate-900 font-extrabold text-xs truncate" title={activeProfile.personalInfo.address}>{activeProfile.personalInfo.address}</span>
                    </div>
                  </div>
                </div>

                {/* Academic */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1">
                    <Building className="h-4.5 w-4.5 text-slate-400" />
                    Academic Credentials
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Institution / College</span>
                      <span className="text-slate-900 font-extrabold text-xs">{activeProfile.academicInfo.college}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Academic Department</span>
                      <span className="text-slate-900 font-extrabold text-xs">{activeProfile.academicInfo.department}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Degree / Certification Focus</span>
                      <span className="text-slate-900 font-extrabold text-xs">{activeProfile.academicInfo.degree}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Current Year of Study</span>
                      <span className="text-slate-900 font-extrabold text-xs">Year {activeProfile.academicInfo.year}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Cumulative GPA / CGPA</span>
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-black text-xs">{activeProfile.academicInfo.cgpa} / 10.0</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Graduation Year</span>
                      <span className="text-slate-900 font-extrabold text-xs">{activeProfile.academicInfo.graduationYear}</span>
                    </div>
                  </div>
                </div>

                {/* Internship mapping */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1">
                    <Briefcase className="h-4.5 w-4.5 text-slate-400" />
                    Cohort Internship Registration
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Active Program</span>
                      <span className="text-slate-900 font-extrabold text-xs">{activeProfile.internshipInfo.program}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Internship Classification</span>
                      <span className="text-slate-900 font-extrabold text-xs">{activeProfile.internshipInfo.internshipType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Cohort Batch Mapped</span>
                      <span className="text-slate-900 font-extrabold text-xs">{activeProfile.internshipInfo.batchName || 'Not Assigned'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Assigned Mentor Roster</span>
                      <span className="text-slate-900 font-extrabold text-xs">{activeProfile.internshipInfo.mentorName || 'Not Assigned'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Cohort Joining Date</span>
                      <span className="text-slate-900 font-extrabold text-xs">{activeProfile.internshipInfo.joiningDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Expected Completion</span>
                      <span className="text-slate-900 font-extrabold text-xs">{activeProfile.internshipInfo.expectedCompletion}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: DOCUMENTS */}
            {profileTab === 'documents' && (
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400">Document Management Center</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeProfile.documents.map((doc, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-800">{doc.type}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' :
                            doc.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                          }`}>{doc.status}</span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-500 mt-1 truncate" title={doc.name}>{doc.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Uploaded: {doc.uploadDate}</p>
                        {doc.verifiedBy && <p className="text-[9.5px] text-slate-400 font-medium">Verified by: {doc.verifiedBy}</p>}
                        
                        {/* Simulated text preview */}
                        {doc.previewText && (
                          <div className="mt-2 bg-white border border-slate-100 p-2 rounded text-[10px] text-slate-600 font-mono">
                            {doc.previewText}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1.5 justify-end">
                        {doc.status !== 'Verified' && (
                          <button
                            onClick={() => handleVerifyDocument(activeProfile.id, doc.type, 'Verified')}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-[10px] font-bold text-white rounded transition"
                          >
                            Approve
                          </button>
                        )}
                        {doc.status !== 'Rejected' && (
                          <button
                            onClick={() => handleVerifyDocument(activeProfile.id, doc.type, 'Rejected')}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-[10px] font-bold text-white rounded transition"
                          >
                            Reject
                          </button>
                        )}
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); showToast(`Simulating download for ${doc.name}`); }}
                          className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-[10px] font-bold text-slate-700 rounded transition text-center"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: CREDENTIALS */}
            {profileTab === 'id_credentials' && (
              <div className="space-y-6">
                
                {/* ID Card Display */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row items-center gap-6">
                  
                  {/* Mock ID Card */}
                  <div className="bg-slate-900 text-white rounded-xl p-4 w-72 h-44 shadow-xl border border-slate-700 relative overflow-hidden shrink-0 flex flex-col justify-between font-mono">
                    <div className="absolute top-0 right-0 h-16 w-16 bg-blue-600/30 rounded-bl-full" />
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">PineSphere ERP</div>
                        <div className="text-[7px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">INTERNSHIP ID CARD</div>
                      </div>
                      <QrCode className="h-9 w-9 text-slate-400" />
                    </div>

                    <div className="flex items-center gap-3 my-2">
                      <div className="h-10 w-10 bg-slate-800 text-white font-bold text-xs flex items-center justify-center rounded-lg border border-slate-700">
                        {activeProfile.personalInfo.avatar}
                      </div>
                      <div className="text-[10px]">
                        <div className="font-extrabold text-white uppercase text-[11px] truncate max-w-[150px]">{activeProfile.personalInfo.name}</div>
                        <div className="text-[9px] text-slate-400 font-bold">{activeProfile.internId}</div>
                        <div className="text-[8px] text-slate-500 font-bold mt-0.5">{activeProfile.academicInfo.department} | Year {activeProfile.academicInfo.year}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[7px] text-slate-400 border-t border-slate-800 pt-1.5 mt-1">
                      <span>ROLE: COHORT INTERN</span>
                      <span>GEN: {activeProfile.timeline[0]?.date || '2026-05-01'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-400">Intern ID Card Credentials</h4>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                      This ID is the unique campus security verification credential used across corporate centers and verification gates.
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => showToast('Dispatched ID Card verification file to printer.')}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold text-white transition flex items-center gap-1"
                      >
                        <Printer className="h-3 w-3" />
                        Print ID
                      </button>
                      <button 
                        onClick={() => showToast('PDF version downloaded successfully.')}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold text-white transition flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Download Card
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account Access Controls */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-400">Student Portal Access Controls</h4>
                  
                  <div className="space-y-3 text-xs font-semibold text-slate-700">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <div>Portal User ID</div>
                        <span className="font-mono text-[10.5px] text-slate-400 font-semibold">{activeProfile.credentials.username}</span>
                      </div>
                      <button
                        onClick={() => showToast(`Password for username ${activeProfile.credentials.username} has been reset.`)}
                        className="px-2.5 py-1.5 border border-slate-200 hover:border-blue-600 hover:text-blue-600 bg-white rounded text-[10px] font-bold transition-all"
                      >
                        Reset Password
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <div>Student Portal Login</div>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Toggle student's ability to view assignments and report attendance.</span>
                      </div>
                      <button
                        onClick={() => handleToggleAccess(activeProfile.id, 'portalAccess')}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold text-white transition ${activeProfile.credentials.portalAccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-400 hover:bg-slate-500'}`}
                      >
                        {activeProfile.credentials.portalAccess ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <div>LMS Access System</div>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Grant access to courses, video syllabi, and coding sandboxes.</span>
                      </div>
                      <button
                        onClick={() => handleToggleAccess(activeProfile.id, 'lmsAccess')}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold text-white transition ${activeProfile.credentials.lmsAccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-400 hover:bg-slate-500'}`}
                      >
                        {activeProfile.credentials.lmsAccess ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div>Assessment System Access</div>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Allow student to lock and submit milestone assessment submissions.</span>
                      </div>
                      <button
                        onClick={() => handleToggleAccess(activeProfile.id, 'assessmentAccess')}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold text-white transition ${activeProfile.credentials.assessmentAccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-400 hover:bg-slate-500'}`}
                      >
                        {activeProfile.credentials.assessmentAccess ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: BATCH ASSIGNMENT */}
            {profileTab === 'batch' && (
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400">Current Batch Assignment</h4>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-semibold text-slate-700 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Active Batch Name</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.batch.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Active Program</span>
                      <span className="text-slate-900 font-extrabold truncate block">{activeProfile.batch.program}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Start Date</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.batch.startDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">End Date</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.batch.endDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Cohort Mentor</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.batch.mentor}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Batch Status</span>
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block mt-0.5">
                        {activeProfile.batch.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <button
                    onClick={() => {
                      setBatchForm({
                        name: activeProfile.batch.name,
                        program: activeProfile.batch.program,
                        startDate: activeProfile.batch.startDate,
                        endDate: activeProfile.batch.endDate,
                        mentor: activeProfile.batch.mentor
                      });
                      setActiveActionModal({ type: 'batch' });
                    }}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-lg transition"
                  >
                    Transfer / Change Batch
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: MENTOR ASSIGNMENT */}
            {profileTab === 'mentor' && (
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400">Mentor Assignment & Metrics</h4>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-semibold text-slate-700 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Assigned Mentor Name</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.mentor.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Mentor Department</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.mentor.department}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Primary Expertise Domain</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.mentor.expertise}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Sessions Conducted</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.mentor.sessionsConducted} Live Sessions</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Student Rating Score</span>
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-black text-xs inline-block mt-0.5">
                        ★ {activeProfile.mentor.rating} / 5.0
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mentor Feedback Logs */}
                <div className="space-y-3">
                  <h5 className="text-[10.5px] font-black uppercase text-slate-400">Recent Mentor Performance Review logs</h5>
                  {activeProfile.mentor.feedbackGiven.length > 0 ? (
                    <div className="space-y-3">
                      {activeProfile.mentor.feedbackGiven.map((fb, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 p-3 rounded-lg text-xs leading-relaxed text-slate-700">
                          <div className="flex justify-between font-bold text-slate-500 text-[10px] mb-1">
                            <span>Reviewed by: {fb.reviewer}</span>
                            <span>{fb.date}</span>
                          </div>
                          <p>{fb.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg text-xs text-slate-500">
                      No review logs have been submitted by the mentor yet.
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setMentorForm({
                        mentorId: activeProfile.internshipInfo.mentorId || 'emp-2',
                        mentorName: activeProfile.internshipInfo.mentorName || 'Bob Johnson'
                      });
                      setActiveActionModal({ type: 'mentor' });
                    }}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-lg transition"
                  >
                    Reassign Mentor
                  </button>
                  {activeProfile.internshipInfo.mentorId && (
                    <button
                      onClick={async () => {
                        const updated = await studentService.updateStudent(activeProfile.id, {
                          internshipInfo: {
                            ...activeProfile.internshipInfo,
                            mentorId: '',
                            mentorName: ''
                          },
                          mentor: {
                            name: '', department: '', expertise: '', sessionsConducted: 0, rating: 5.0, feedbackGiven: []
                          }
                        });
                        if (updated) {
                          setStudents(students.map(s => s.id === activeProfile.id ? updated : s));
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

            {/* TAB 6: PERFORMANCE CENTER */}
            {profileTab === 'performance' && (
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase text-slate-400">Student Intelligence Scorecard</h4>

                {/* Scorecards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  {[
                    { label: 'Attendance', value: `${activeProfile.performance.attendanceScore}%`, color: 'bg-blue-50 text-blue-700' },
                    { label: 'Assessments', value: `${activeProfile.performance.assessmentScore}/100`, color: 'bg-indigo-50 text-indigo-700' },
                    { label: 'Capstones/Proj', value: `${activeProfile.performance.projectScore}/100`, color: 'bg-purple-50 text-purple-700' },
                    { label: 'Mentor Rating', value: `★ ${activeProfile.performance.mentorRating}/5`, color: 'bg-amber-50 text-amber-700' },
                    { label: 'Overall Perf', value: `${activeProfile.performance.overallPerformance}%`, color: 'bg-emerald-50 text-emerald-700' }
                  ].map((card, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border border-slate-100 flex flex-col justify-center text-center ${card.color}`}>
                      <div className="text-lg font-black">{card.value}</div>
                      <div className="text-[9.5px] uppercase font-bold text-slate-400 mt-0.5">{card.label}</div>
                    </div>
                  ))}
                </div>

                {/* Trends Charts */}
                {activeProfile.performance.attendanceTrend.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Attendance SVG trend */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                      <h5 className="text-[10px] font-black uppercase text-slate-500">Attendance Score Progression</h5>
                      <div className="h-32 w-full flex items-end justify-between px-2 pt-4">
                        {activeProfile.performance.attendanceTrend.map((t, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                            <div className="text-[9px] font-bold text-slate-500">{t.score}%</div>
                            <div className="w-8 bg-blue-600 rounded-t" style={{ height: `${t.score * 0.8}px` }} />
                            <div className="text-[8.5px] font-semibold text-slate-400 mt-1 truncate max-w-[40px]">{t.date}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Assessment SVG trend */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                      <h5 className="text-[10px] font-black uppercase text-slate-500">Milestone Test Scores</h5>
                      <div className="h-32 w-full flex items-end justify-between px-2 pt-4">
                        {activeProfile.performance.assessmentTrend.map((t, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                            <div className="text-[9px] font-bold text-slate-500">{t.score}</div>
                            <div className="w-8 bg-indigo-600 rounded-t" style={{ height: `${t.score * 0.8}px` }} />
                            <div className="text-[8.5px] font-semibold text-slate-400 mt-1 truncate max-w-[40px]" title={t.test}>{t.test}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg text-xs text-slate-500">
                    No analytics trends data is populated for this student record yet.
                  </div>
                )}

                {/* Skill Progression bars */}
                {activeProfile.performance.skills.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                    <h5 className="text-[10px] font-black uppercase text-slate-500">Skill Acquisition Metrics</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeProfile.performance.skills.map((skill, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-700">
                            <span>{skill.name}</span>
                            <span>{skill.value}% Mastery</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${skill.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 7: PLACEMENT TRACKING */}
            {profileTab === 'placement' && (
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase text-slate-400">Placement Tracking & Status</h4>

                {/* Placement stages flow */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
                  <h5 className="text-[10.5px] font-black uppercase text-slate-500">Employment Pipeline Phase</h5>
                  <div className="flex items-center justify-between text-center relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                    
                    {[
                      'Not Eligible', 'Eligible', 'Placement Ready', 'Interview Scheduled', 'Offer Received', 'Placed'
                    ].map((stage, idx) => {
                      const stages = ['Not Eligible', 'Eligible', 'Placement Ready', 'Interview Scheduled', 'Offer Received', 'Placed'];
                      const activeIdx = stages.indexOf(activeProfile.placement.status);
                      const isPast = idx <= activeIdx;
                      const isCurrent = idx === activeIdx;

                      return (
                        <div key={idx} className="relative z-10 flex flex-col items-center flex-1">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition ${isCurrent ? 'bg-blue-600 text-white border-blue-600 shadow-md' : isPast ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-400 border-slate-200'}`}>
                            {idx + 1}
                          </div>
                          <span className={`text-[8.5px] font-bold mt-1.5 transition leading-tight ${isCurrent ? 'text-blue-700' : isPast ? 'text-slate-800' : 'text-slate-400'}`}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Placement info metrics */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                  <h5 className="text-[10.5px] font-black uppercase text-slate-500">Corporate Offer Parameters</h5>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Hired Company</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.placement.company || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Offered Annual CTC (LPA)</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.placement.package || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Interview Pipeline Logs</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.placement.interviewStatus || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Candidate Offer Status</span>
                      <span className="text-slate-900 font-extrabold">{activeProfile.placement.offerStatus || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <button
                    onClick={() => {
                      setPlacementForm({
                        status: activeProfile.placement.status,
                        company: activeProfile.placement.company || '',
                        package: activeProfile.placement.package || '',
                        interviewStatus: activeProfile.placement.interviewStatus || '',
                        offerStatus: activeProfile.placement.offerStatus || '',
                      });
                      setActiveActionModal({ type: 'placement' });
                    }}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-lg transition"
                  >
                    Edit Placement Parameters
                  </button>
                </div>

              </div>
            )}

            {/* TAB 8: LIFECYCLE MANAGEMENT */}
            {profileTab === 'lifecycle' && (
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400">PineSphere Student SLMS Journey</h4>
                
                <div className="relative border-l-2 border-blue-500 ml-4 pl-6 space-y-6 pt-2">
                  {[
                    { key: 'Applied', title: 'Phase 1: Application Registered', desc: 'Candidate submits CV and documents through PineSphere portal.' },
                    { key: 'Approved', title: 'Phase 2: Recruiter Approved', desc: 'HR Operations team validates qualifications and approves internship access.' },
                    { key: 'Enrolled', title: 'Phase 3: Program Enrolled', desc: 'Linked to university partnership and configured with access portals.' },
                    { key: 'Active', title: 'Phase 4: Active Cohort Training', desc: 'Assigned to a specific mentor and active batch curriculum.' },
                    { key: 'Completed', title: 'Phase 5: Capstone Completed', desc: 'Syllabus modules are completed and verified by course managers.' },
                    { key: 'Certified', title: 'Phase 6: PineSphere Certified', desc: 'LMS credentials archived, completion certificate issued.' },
                    { key: 'Placed', title: 'Phase 7: Corporate Placement', desc: 'Hired in corporate partner network with verified offer letter.' }
                  ].map((phase, idx) => {
                    const statusCycle = ['Applied', 'Approved', 'Enrolled', 'Active', 'Completed', 'Certified', 'Placed'];
                    const currentIdx = statusCycle.indexOf(activeProfile.status === 'On Hold' ? 'Enrolled' : activeProfile.status);
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

            {/* TAB 9: AUDIT TIMELINE */}
            {profileTab === 'timeline' && (
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400">Chronological Audit Log Feed</h4>
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

      {/* POPUPS & MODALS DIALOGS */}
      {activeActionModal && (
        <div className={`z-50 flex transition-all ${
          (activeActionModal.type === 'edit' || activeActionModal.type === 'onboard') 
            ? 'absolute inset-0 bg-white p-0 items-start justify-stretch' 
            : 'fixed inset-0 bg-slate-900/60 backdrop-blur-xs p-4 items-center justify-center'
        }`}>
          <div className={`bg-white overflow-hidden transition-all duration-300 ${
            (activeActionModal.type === 'edit' || activeActionModal.type === 'onboard') 
              ? 'max-w-none w-full h-full rounded-none border-none flex flex-col' 
              : 'rounded-xl shadow-2xl border border-slate-200 w-full max-w-md animate-zoom-in'
          }`}>
            
            {/* Modal Header */}
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center text-sm font-black text-slate-900">
              <h3>
                {activeActionModal.type === 'onboard' && 'Enroll New Student'}
                {activeActionModal.type === 'edit' && 'Modify Student Record'}
                {activeActionModal.type === 'batch' && 'Change / Transfer Batch'}
                {activeActionModal.type === 'mentor' && 'Remap Primary Mentor'}
                {activeActionModal.type === 'status' && 'Shift Lifecycle Status'}
                {activeActionModal.type === 'placement' && 'Update Corporate Placement Parameters'}
                {activeActionModal.type === 'bulkStatus' && 'Bulk Update Student Statuses'}
                {activeActionModal.type === 'bulkBatch' && 'Bulk Assign Cohort Batch'}
                {activeActionModal.type === 'bulkMentor' && 'Bulk Remap Primary Mentor'}
                {activeActionModal.type === 'bulkNotify' && 'Broadcast System Alert'}
              </h3>
              <button 
                onClick={() => setActiveActionModal(null)}
                className="text-slate-400 hover:text-slate-700 transition font-black text-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form 
              onSubmit={
                activeActionModal.type === 'onboard' ? handleCreateStudent :
                activeActionModal.type === 'edit' ? handleSaveStudent :
                activeActionModal.type === 'batch' ? handleUpdateBatch :
                activeActionModal.type === 'mentor' ? handleUpdateMentor :
                activeActionModal.type === 'status' ? handleUpdateStatus :
                activeActionModal.type === 'placement' ? handleUpdatePlacement :
                handleExecuteBulkAction
              }
              className={`text-slate-800 flex flex-col min-h-0 ${
                (activeActionModal.type === 'edit' || activeActionModal.type === 'onboard') 
                  ? 'p-8 space-y-6 flex-1 h-full justify-between' 
                  : 'p-5 space-y-4'
              }`}
            >
              
              {/* Form 1: Onboard / Edit Student Profile */}
              {(activeActionModal.type === 'onboard' || activeActionModal.type === 'edit') && (
                <div className="space-y-6 max-w-5xl mx-auto w-full flex-1 flex flex-col justify-start overflow-hidden pt-4">
                  
                  {/* Section 1 */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                      Section 1: Personal Info
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Legal Name *</label>
                        <input 
                          type="text" 
                          required 
                          value={editForm.name}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Email Address *</label>
                        <input 
                          type="email" 
                          required 
                          value={editForm.email}
                          onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Phone Number</label>
                        <input 
                          type="text" 
                          value={editForm.phone}
                          onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Date of Birth</label>
                        <input 
                          type="date" 
                          value={editForm.dob}
                          onChange={e => setEditForm({ ...editForm, dob: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Gender</label>
                        <select 
                          value={editForm.gender}
                          onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Address</label>
                        <input 
                          type="text" 
                          value={editForm.address}
                          onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                      Section 2: Academic Info
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Institution *</label>
                        <input 
                          type="text" 
                          required
                          value={editForm.college}
                          onChange={e => setEditForm({ ...editForm, college: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Department</label>
                        <select 
                          value={editForm.department}
                          onChange={e => setEditForm({ ...editForm, department: e.target.value as any })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
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
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Degree Focus</label>
                        <input 
                          type="text" 
                          value={editForm.degree}
                          onChange={e => setEditForm({ ...editForm, degree: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">CGPA (out of 10.0)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={editForm.cgpa}
                          onChange={e => setEditForm({ ...editForm, cgpa: Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Current Study Year</label>
                        <input 
                          type="number" 
                          value={editForm.year}
                          onChange={e => setEditForm({ ...editForm, year: Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Graduation Year</label>
                        <input 
                          type="number" 
                          value={editForm.graduationYear}
                          onChange={e => setEditForm({ ...editForm, graduationYear: Number(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                      Section 3: Internship Mapping
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Program Mapped</label>
                        <input 
                          type="text" 
                          value={editForm.program}
                          onChange={e => setEditForm({ ...editForm, program: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Internship Type</label>
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
                        <label className="text-[10px] font-bold text-slate-500">Batch Cohort</label>
                        <input 
                          type="text" 
                          value={editForm.batchName}
                          onChange={e => setEditForm({ ...editForm, batchName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Form 2: Batch transfer */}
              {activeActionModal.type === 'batch' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Target Batch Name *</label>
                    <input 
                      type="text" 
                      required
                      value={batchForm.name}
                      onChange={e => setBatchForm({ ...batchForm, name: e.target.value })}
                      placeholder="e.g. Gamma Cohort 2026"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Mapped Program</label>
                    <input 
                      type="text" 
                      value={batchForm.program}
                      onChange={e => setBatchForm({ ...batchForm, program: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Start Date</label>
                      <input 
                        type="date" 
                        value={batchForm.startDate}
                        onChange={e => setBatchForm({ ...batchForm, startDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">End Date</label>
                      <input 
                        type="date" 
                        value={batchForm.endDate}
                        onChange={e => setBatchForm({ ...batchForm, endDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form 3: Mentor reassignment */}
              {activeActionModal.type === 'mentor' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Select Target Mentor *</label>
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

              {/* Form 4: Status shift */}
              {activeActionModal.type === 'status' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Shift Lifecycle Status *</label>
                    <select
                      value={statusForm}
                      onChange={e => setStatusForm(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Approved">Approved</option>
                      <option value="Enrolled">Enrolled</option>
                      <option value="Active">Active</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                      <option value="Certified">Certified</option>
                      <option value="Placed">Placed</option>
                      <option value="Dropped">Dropped</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Form 5: Placement edits */}
              {activeActionModal.type === 'placement' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Employment Pipeline Phase</label>
                    <select
                      value={placementForm.status}
                      onChange={e => setPlacementForm({ ...placementForm, status: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="Not Eligible">Not Eligible</option>
                      <option value="Eligible">Eligible</option>
                      <option value="Placement Ready">Placement Ready</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Offer Received">Offer Received</option>
                      <option value="Placed">Placed</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Hiring Company</label>
                      <input 
                        type="text" 
                        value={placementForm.company}
                        onChange={e => setPlacementForm({ ...placementForm, company: e.target.value })}
                        placeholder="e.g. Amazon India"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Package (CTC / LPA)</label>
                      <input 
                        type="text" 
                        value={placementForm.package}
                        onChange={e => setPlacementForm({ ...placementForm, package: e.target.value })}
                        placeholder="e.g. 15 LPA"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Interview Status</label>
                      <input 
                        type="text" 
                        value={placementForm.interviewStatus}
                        onChange={e => setPlacementForm({ ...placementForm, interviewStatus: e.target.value })}
                        placeholder="e.g. L2 Cleared"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Offer Acceptance Status</label>
                      <input 
                        type="text" 
                        value={placementForm.offerStatus}
                        onChange={e => setPlacementForm({ ...placementForm, offerStatus: e.target.value })}
                        placeholder="e.g. Accepted"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form 6: Bulk updates forms */}
              {activeActionModal.type === 'bulkStatus' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Bulk Shift Lifecycle Status *</label>
                    <select
                      value={bulkVal}
                      onChange={e => setBulkVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="">-- Choose Status --</option>
                      <option value="Applied">Applied</option>
                      <option value="Approved">Approved</option>
                      <option value="Enrolled">Enrolled</option>
                      <option value="Active">Active</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                      <option value="Certified">Certified</option>
                      <option value="Placed">Placed</option>
                      <option value="Dropped">Dropped</option>
                    </select>
                  </div>
                </div>
              )}

              {activeActionModal.type === 'bulkBatch' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Enter Batch Name *</label>
                    <input 
                      type="text"
                      required
                      value={bulkVal}
                      onChange={e => setBulkVal(e.target.value)}
                      placeholder="e.g. Sigma Cohort 2026"
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {activeActionModal.type === 'bulkMentor' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Map Mentor *</label>
                    <select
                      value={bulkVal}
                      onChange={e => setBulkVal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="">-- Select Mentor --</option>
                      <option value="emp-2">Bob Johnson (Technical Engineering)</option>
                      <option value="emp-3">Diana Prince (Data Operations)</option>
                      <option value="emp-4">Charlie Davis (Supervisory HR)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeActionModal.type === 'bulkNotify' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Broadcast Notice Alert Msg *</label>
                    <textarea
                      required
                      rows={3}
                      value={notifyMsg}
                      onChange={e => setNotifyMsg(e.target.value)}
                      placeholder="Enter system broadcast email/SMS text content here..."
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
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
