"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  Users, Search, Filter, Plus, ChevronRight, FileDown, MoreVertical, 
  Building, MapPin, TrendingUp, CheckCircle2, XCircle, AlertTriangle, 
  Award, Shield, Calendar, DollarSign, Activity, FileText, Check, 
  ExternalLink, Clock, BookOpen, AlertCircle, Layers, ArrowUpRight, 
  ArrowDownRight, RefreshCw, Send, Trash, Eye, Download, Upload, 
  Briefcase, UserCheck, ShieldCheck, Star, Edit, ArrowRight, MessageSquare,
  Lock, CheckSquare
} from 'lucide-react';
import { employeeService } from '@/src/services/employee.service';
import { Employee, EmployeeDocument, TimelineEvent, EmployeeProject } from '@/src/types/employees.types';
import { useAuth } from '@/src/context/AuthContext';
import { Drawer } from '@/components/feature/ui/Drawer';
import { useRouter } from 'next/navigation';
import { PermissionGuard } from '@/components/feature/ui/PermissionGuard';
import { EnhancedTable } from '@/components/feature/ui/Table';

export default function EmployeeManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // App views: dashboard, directory
  const [activeView, setActiveView] = useState<'dashboard' | 'directory'>('dashboard');
  
  // Data state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selected employees for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Drawer states
  const [activeProfile, setActiveProfile] = useState<Employee | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'documents' | 'hr' | 'mentor' | 'access' | 'performance' | 'projects' | 'timeline'>('overview');
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  
  // Popover / Modal states
  const [showFilters, setShowFilters] = useState(false);
  const [activeActionModal, setActiveActionModal] = useState<{
    type: 'status' | 'dept' | 'mentor' | 'promote' | 'doc' | 'edit' | 'onboard' | 'review' | 'notify' | 'bulkStatus' | 'bulkDept' | 'bulkMentor' | 'bulkNotify';
    empId?: string;
  } | null>(null);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterExperience, setFilterExperience] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Action Form states
  const [statusInput, setStatusInput] = useState<Employee['status']>('Active');
  const [deptInput, setDeptInput] = useState('');
  const [mentorInput, setMentorInput] = useState('');
  const [promoTitle, setPromoTitle] = useState('');
  const [promoGrade, setPromoGrade] = useState('');
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('');
  const [notifyMsg, setNotifyMsg] = useState('');
  
  // Edit & Onboard Form states
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: '',
    designation: '',
    location: '',
    experienceLevel: 'Junior' as Employee['experienceLevel'],
    employmentType: 'Full-time' as Employee['employmentType'],
    salaryGrade: '',
    band: '',
    shift: '',
  });

  // Performance Review form states
  const [reviewForm, setReviewForm] = useState({
    score: 5,
    comment: '',
    role: 'HR' as 'HR' | 'Manager' | 'Mentor'
  });

  // Active document preview in documents center
  const [previewDoc, setPreviewDoc] = useState<EmployeeDocument | null>(null);
  
  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load all employees
  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load employees data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone.includes(searchTerm) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesDept = filterDept === 'all' || emp.organizationId === filterDept;
      const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
      const matchesLoc = filterLocation === 'all' || emp.location === filterLocation;
      const matchesExp = filterExperience === 'all' || emp.experienceLevel === filterExperience;
      const matchesType = filterType === 'all' || emp.employmentType === filterType;
      
      return matchesSearch && matchesDept && matchesStatus && matchesLoc && matchesExp && matchesType;
    });
  }, [employees, searchTerm, filterDept, filterStatus, filterLocation, filterExperience, filterType]);

  // Strategic KPI Totals
  const kpiStats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'Active').length;
    const leave = employees.filter(e => e.status === 'On Leave').length;
    const probation = employees.filter(e => e.status === 'Probation').length;
    const mentors = employees.filter(e => e.roleName === 'Mentor').length;
    const hr = employees.filter(e => e.roleName === 'HR').length;
    const admins = employees.filter(e => e.roleName === 'Super Admin').length;
    const inactive = employees.filter(e => e.status === 'Inactive' || e.status === 'Resigned' || e.status === 'Terminated').length;
    
    return { total, active, leave, probation, mentors, hr, admins, inactive };
  }, [employees]);

  // Department distribution numbers
  const deptStats = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach(e => {
      counts[e.organizationId] = (counts[e.organizationId] || 0) + 1;
    });
    return counts;
  }, [employees]);

  // Location distribution numbers
  const locationStats = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach(e => {
      counts[e.location] = (counts[e.location] || 0) + 1;
    });
    return counts;
  }, [employees]);

  // Employment Type distribution
  const typeStats = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach(e => {
      counts[e.employmentType] = (counts[e.employmentType] || 0) + 1;
    });
    return counts;
  }, [employees]);

  // Status distribution numbers (for Donut Chart)
  const statusStats = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach(e => {
      counts[e.status] = (counts[e.status] || 0) + 1;
    });
    return counts;
  }, [employees]);

  // Aggregated Recent activities
  const recentActivities = useMemo(() => {
    const allEvents: { empId: string; empName: string; empAvatar: string; event: TimelineEvent }[] = [];
    employees.forEach(emp => {
      emp.timeline.forEach(evt => {
        allEvents.push({
          empId: emp.id,
          empName: emp.name,
          empAvatar: emp.avatar,
          event: evt
        });
      });
    });
    // Sort chronologically descending
    return allEvents
      .sort((a, b) => new Date(b.event.date).getTime() - new Date(a.event.date).getTime())
      .slice(0, 10);
  }, [employees]);

  // Open the profile drawer
  const handleOpenProfile = (emp: Employee) => {
    setActiveProfile(emp);
    setProfileTab('overview');
    setIsProfileDrawerOpen(true);
    setPreviewDoc(null);
  };

  // Sync activeProfile state from main employee array
  useEffect(() => {
    if (activeProfile) {
      const refreshed = employees.find(e => e.id === activeProfile.id);
      if (refreshed) {
        setActiveProfile(refreshed);
      }
    }
  }, [employees, activeProfile?.id]);

  // Handle single action dispatchers
  const executeAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionModal) return;
    const { type, empId } = activeActionModal;
    const targetId = empId || activeProfile?.id;
    if (!targetId && type !== 'onboard') return;

    try {
      if (type === 'status') {
        const updated = await employeeService.updateEmployee(targetId, { status: statusInput });
        if (updated) {
          // Log timeline event
          updated.timeline.unshift({
            date: new Date().toISOString().split('T')[0],
            title: 'Status Transitioned',
            description: `Employee lifecycle stage changed manually to ${statusInput}.`,
            type: 'status'
          });
          setEmployees(employees.map(emp => emp.id === targetId ? { ...updated } : emp));
          showToast(`Updated status of ${updated.name} to ${statusInput}`);
        }
      } else if (type === 'dept') {
        const updated = await employeeService.updateEmployee(targetId, { organizationId: deptInput });
        if (updated) {
          updated.timeline.unshift({
            date: new Date().toISOString().split('T')[0],
            title: 'Department Transferred',
            description: `Transferred to department: ${deptInput}`,
            type: 'transfer'
          });
          setEmployees(employees.map(emp => emp.id === targetId ? { ...updated } : emp));
          showToast(`Transferred ${updated.name} to ${deptInput}`);
        }
      } else if (type === 'mentor') {
        const updated = await employeeService.updateEmployee(targetId, { mentorId: mentorInput });
        if (updated) {
          const mentorName = employees.find(emp => emp.id === mentorInput)?.name || 'None';
          updated.timeline.unshift({
            date: new Date().toISOString().split('T')[0],
            title: 'Mentor Assigned',
            description: `Assigned mentor: ${mentorName}`,
            type: 'mentor'
          });
          setEmployees(employees.map(emp => emp.id === targetId ? { ...updated } : emp));
          showToast(`Assigned ${mentorName} as mentor to ${updated.name}`);
        }
      } else if (type === 'promote') {
        const updated = await employeeService.updateEmployee(targetId, { 
          designation: promoTitle, 
          salaryGrade: promoGrade 
        });
        if (updated) {
          updated.timeline.unshift({
            date: new Date().toISOString().split('T')[0],
            title: 'Promotion Received',
            description: `Promoted to ${promoTitle} (${promoGrade})`,
            type: 'promotion'
          });
          setEmployees(employees.map(emp => emp.id === targetId ? { ...updated } : emp));
          showToast(`Promoted ${updated.name} to ${promoTitle}`);
        }
      } else if (type === 'doc') {
        const updated = await employeeService.getEmployee(targetId);
        if (updated) {
          const newDoc: EmployeeDocument = {
            type: docType,
            name: docName || `${docType.toLowerCase().replace(/\s+/g, '_')}.pdf`,
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'Pending',
            version: 'v1.0',
            previewContent: `Document preview for ${docType}: Submitted file verified as secure scan.`
          };
          const docs = [...(updated.documents || []), newDoc];
          const updatedEmp = await employeeService.updateEmployee(targetId, { 
            documents: docs 
          });
          if (updatedEmp) {
            updatedEmp.timeline.unshift({
              date: new Date().toISOString().split('T')[0],
              title: 'Document Uploaded',
              description: `Uploaded new document: ${docType}`,
              type: 'document'
            });
            setEmployees(employees.map(emp => emp.id === targetId ? { ...updatedEmp } : emp));
            showToast(`Uploaded ${docType} for ${updatedEmp.name}. Verification pending.`);
          }
        }
      } else if (type === 'edit') {
        const updated = await employeeService.updateEmployee(targetId, {
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          dob: editForm.dob,
          gender: editForm.gender,
          address: editForm.address,
          emergencyContact: {
            name: editForm.emergencyName,
            relation: editForm.emergencyRelation,
            phone: editForm.emergencyPhone,
          },
          designation: editForm.designation,
          location: editForm.location,
          experienceLevel: editForm.experienceLevel,
          employmentType: editForm.employmentType,
          salaryGrade: editForm.salaryGrade,
          band: editForm.band,
          shift: editForm.shift,
        });
        if (updated) {
          setEmployees(employees.map(emp => emp.id === targetId ? { ...updated } : emp));
          showToast(`Updated profile information for ${updated.name}`);
        }
      } else if (type === 'onboard') {
        const newEmp = await employeeService.createEmployee({
          user_id: `user-${Date.now()}`,
          employee_code: `EMP-${Date.now()}`,
          first_name: editForm.name.split(' ')[0] || '',
          last_name: editForm.name.split(' ')[1] || '',
          phone_number: editForm.phone,
          official_email: editForm.email,
          joining_date: new Date().toISOString(),
          designation: editForm.designation
        } as any);
        setEmployees([...employees, newEmp]);
        showToast(`Successfully onboarded ${newEmp.name} as ${newEmp.designation}`);
      } else if (type === 'review') {
        const emp = employees.find(e => e.id === targetId);
        if (emp) {
          const newReview = {
            reviewerName: user?.name || 'HR Recruiter',
            role: reviewForm.role,
            score: reviewForm.score,
            comment: reviewForm.comment,
            date: new Date().toISOString().split('T')[0]
          };
          const reviews = [...(emp.performanceReviews || []), newReview];
          
          // Re-calculate mock productivity/leadership scores slightly based on reviews
          const perf = emp.performanceMetrics ? {
            ...emp.performanceMetrics,
            productivity: Math.min(100, Math.round(emp.performanceMetrics.productivity * 0.95 + reviewForm.score * 10 * 0.05))
          } : undefined;

          const updated = await employeeService.updateEmployee(targetId, {
            performanceReviews: reviews,
            performanceMetrics: perf
          });
          if (updated) {
            updated.timeline.unshift({
              date: new Date().toISOString().split('T')[0],
              title: 'Performance Review Submitted',
              description: `Submitted review rating: ${reviewForm.score}/5 by ${newReview.reviewerName}.`,
              type: 'review'
            });
            setEmployees(employees.map(e => e.id === targetId ? { ...updated } : e));
            showToast(`Submitted review for ${updated.name}`);
          }
        }
      } else if (type === 'notify') {
        showToast(`Notification sent to ${employees.find(e => e.id === targetId)?.name}: "${notifyMsg}"`, 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Error executing action', 'error');
    }
    
    // Close modal
    setActiveActionModal(null);
  };

  // Bulk Operations dispatchers
  const executeBulkAction = async (type: 'status' | 'dept' | 'mentor' | 'notify') => {
    if (selectedIds.length === 0) return;
    
    try {
      if (type === 'status') {
        await employeeService.bulkChangeStatus(selectedIds, statusInput);
        setEmployees(employees.map(emp => 
          selectedIds.includes(emp.id) 
            ? { ...emp, status: statusInput, timeline: [
                { date: new Date().toISOString().split('T')[0], title: 'Bulk Status Change', description: `Lifecycle status bulk updated to ${statusInput}`, type: 'status' },
                ...emp.timeline
              ]} 
            : emp
        ));
        showToast(`Bulk updated status to ${statusInput} for ${selectedIds.length} employees`);
      } else if (type === 'dept') {
        await employeeService.bulkTransferDepartment(selectedIds, deptInput);
        setEmployees(employees.map(emp => 
          selectedIds.includes(emp.id) 
            ? { ...emp, organizationId: deptInput, timeline: [
                { date: new Date().toISOString().split('T')[0], title: 'Bulk Department Transfer', description: `Bulk transferred to department: ${deptInput}`, type: 'transfer' },
                ...emp.timeline
              ]} 
            : emp
        ));
        showToast(`Bulk transferred ${selectedIds.length} employees to ${deptInput}`);
      } else if (type === 'mentor') {
        await employeeService.bulkAssignMentor(selectedIds, mentorInput);
        const mentorName = employees.find(e => e.id === mentorInput)?.name || 'Selected Mentor';
        setEmployees(employees.map(emp => 
          selectedIds.includes(emp.id) 
            ? { ...emp, mentorId: mentorInput, timeline: [
                { date: new Date().toISOString().split('T')[0], title: 'Bulk Mentor Assignment', description: `Bulk assigned mentor: ${mentorName}`, type: 'mentor' },
                ...emp.timeline
              ]} 
            : emp
        ));
        showToast(`Bulk assigned mentor ${mentorName} to ${selectedIds.length} employees`);
      } else if (type === 'notify') {
        showToast(`Bulk notification sent to ${selectedIds.length} selected employees: "${notifyMsg}"`, 'info');
      }
      setSelectedIds([]);
      setActiveActionModal(null);
    } catch (err) {
      console.error(err);
      showToast('Error executing bulk action', 'error');
    }
  };

  // Toggle checkbox selection of employee row
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Toggle selection of all filtered employees
  const toggleSelectAll = () => {
    const filteredIds = filteredEmployees.map(e => e.id);
    const allSelected = filteredIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  // Document verification updates
  const handleVerifyDocument = async (empId: string, docIndex: number, newStatus: 'Verified' | 'Rejected') => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const docs = [...emp.documents];
    docs[docIndex] = {
      ...docs[docIndex],
      status: newStatus,
      verifiedBy: user?.name || 'HR Recruiter'
    };

    try {
      const updated = await employeeService.updateEmployee(empId, { documents: docs });
      if (updated) {
        updated.timeline.unshift({
          date: new Date().toISOString().split('T')[0],
          title: 'Document Verified',
          description: `Verification status of ${docs[docIndex].type} changed to ${newStatus}.`,
          type: 'document'
        });
        setEmployees(employees.map(e => e.id === empId ? { ...updated } : e));
        showToast(`Document ${docs[docIndex].type} marked as ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Pre-fill fields for editing
  const openEditModal = (emp: Employee) => {
    setEditForm({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      dob: emp.dob,
      gender: emp.gender,
      address: emp.address,
      emergencyName: emp.emergencyContact.name,
      emergencyRelation: emp.emergencyContact.relation,
      emergencyPhone: emp.emergencyContact.phone,
      designation: emp.designation,
      location: emp.location,
      experienceLevel: emp.experienceLevel,
      employmentType: emp.employmentType,
      salaryGrade: emp.salaryGrade,
      band: emp.band,
      shift: emp.shift,
    });
    setActiveActionModal({ type: 'edit', empId: emp.id });
  };

  // Pre-fill fields for new employee
  const openOnboardModal = () => {
    setEditForm({
      name: '',
      email: '',
      phone: '',
      dob: '2000-01-01',
      gender: 'Male',
      address: '',
      emergencyName: '',
      emergencyRelation: '',
      emergencyPhone: '',
      designation: '',
      location: 'San Francisco, CA',
      experienceLevel: 'Intern',
      employmentType: 'Internship',
      salaryGrade: 'Grade 1',
      band: 'Band I1',
      shift: 'General (09:00 - 18:00)',
    });
    setActiveActionModal({ type: 'onboard' });
  };

  // Export Roster (CSV)
  const handleExportRoster = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Department', 'Designation', 'Joining Date', 'Status', 'Location'];
    const rows = employees.map(emp => [
      emp.id,
      emp.name,
      emp.email,
      emp.phone,
      emp.organizationId,
      emp.designation,
      emp.joinDate,
      emp.status,
      emp.location
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employee_roster_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Employee roster CSV downloaded successfully');
  };

  // Keyboard listener for shortcuts (Escape to close modals/drawers)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileDrawerOpen(false);
        setActiveActionModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeActionModal]);

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
            <span>People Operations</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold">Employees Lifecycle</span>
          </div>
          <h2 className="text-2xl font-black text-text-primary mt-1 tracking-tight flex items-center gap-2">
            Workforce Portal
            <span className="text-[10px] bg-slate-100 text-text-secondary px-2 py-0.5 rounded font-mono font-medium">v2.4 (Enterprise)</span>
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
              Strategic Dashboard
            </button>
            <button 
              onClick={() => setActiveView('directory')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'directory' 
                  ? 'bg-white text-text-primary shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Employee Directory ({filteredEmployees.length})
            </button>
          </div>

          <PermissionGuard required="employee.export">
            <button 
              onClick={handleExportRoster}
              className="flex items-center gap-1.5 px-3 py-2 border border-border hover:border-secondary hover:bg-slate-50 bg-white rounded-lg text-xs font-bold text-text-primary shadow-sm transition-all duration-200 cursor-pointer"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>Export Roster</span>
            </button>
          </PermissionGuard>
          
          <PermissionGuard required="employee.create">
            <button 
              onClick={openOnboardModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Onboard Employee</span>
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* ------------------ VIEW 1: STRATEGIC DASHBOARD ------------------ */}
      {activeView === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* KPI Dashboard Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Employees', val: kpiStats.total, icon: Users, color: 'bg-blue-50 text-blue-600 border-blue-100', filter: { name: 'status', val: 'all' } },
              { label: 'Active Employees', val: kpiStats.active, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', filter: { name: 'status', val: 'Active' } },
              { label: 'Employees On Leave', val: kpiStats.leave, icon: Clock, color: 'bg-amber-50 text-amber-600 border-amber-100', filter: { name: 'status', val: 'On Leave' } },
              { label: 'Probation Stages', val: kpiStats.probation, icon: AlertCircle, color: 'bg-purple-50 text-purple-600 border-purple-100', filter: { name: 'status', val: 'Probation' } },
              { label: 'Registered Mentors', val: kpiStats.mentors, icon: Award, color: 'bg-sky-50 text-text-secondary border-border', filter: { name: 'role', val: 'Mentor' } },
              { label: 'HR Staff Operations', val: kpiStats.hr, icon: Building, color: 'bg-indigo-50 text-indigo-600 border-indigo-100', filter: { name: 'role', val: 'HR' } },
              { label: 'Super Administrators', val: kpiStats.admins, icon: Shield, color: 'bg-slate-100 text-text-primary border-border', filter: { name: 'role', val: 'Super Admin' } },
              { label: 'Inactive / Exited', val: kpiStats.inactive, icon: XCircle, color: 'bg-rose-50 text-rose-600 border-rose-100', filter: { name: 'status', val: 'Notice Period' } },
            ].map((kpi, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  if (kpi.filter.name === 'status') {
                    setFilterStatus(kpi.filter.val);
                  } else if (kpi.filter.name === 'role') {
                    // Quick pre-filter by matching designation/role if possible or resetting
                    setFilterStatus('all');
                  }
                  setActiveView('directory');
                  showToast(`Filtered roster by: ${kpi.label}`);
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

          {/* Analytics Graphs (Grid layout of custom high fidelity SVGs) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Chart 1: Department & Employment Type Distribution */}
            <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-text-primary tracking-tight flex items-center gap-1.5">
                <Building className="h-4 w-4 text-blue-600" />
                Workforce by Department & Type
              </h3>
              
              <div className="space-y-3">
                {[
                  { dept: 'HR / Operations (org-1)', count: deptStats['org-1'] || 0, color: 'bg-blue-600' },
                  { dept: 'Mentors / Engineering (org-2)', count: deptStats['org-2'] || 0, color: 'bg-emerald-600' },
                  { dept: 'Coordination / Relations (org-3)', count: deptStats['org-3'] || 0, color: 'bg-purple-600' },
                ].map((item, index) => {
                  const percent = Math.round((item.count / employees.length) * 100) || 0;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-text-primary">
                        <span>{item.dept}</span>
                        <span>{item.count} ({percent}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="text-xs font-bold text-text-secondary uppercase tracking-widest">Employment Type</div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(typeStats).map(([type, val], idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-border flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-secondary">{type}</span>
                      <span className="text-xs font-extrabold text-text-primary">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 2: Status Distribution (Interactive Donut Chart) */}
            <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-text-primary tracking-tight flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-emerald-600" />
                Workforce Status Distribution
              </h3>

              {/* High Fidelity SVG Donut Chart */}
              <div className="flex items-center justify-center gap-6 py-2">
                <div className="relative h-32 w-32 shrink-0">
                  <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                    
                    {/* Active: emp-1, emp-2, emp-3, emp-6 = 4. 4/8 = 50% */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3.2" 
                      strokeDasharray="50 100" strokeDashoffset="0" />
                    
                    {/* On Leave: emp-4 = 1. 1/8 = 12.5% */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3.2" 
                      strokeDasharray="12.5 100" strokeDashoffset="-50" />
                    
                    {/* Probation: emp-5 = 1. 1/8 = 12.5% */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="3.2" 
                      strokeDasharray="12.5 100" strokeDashoffset="-62.5" />
                    
                    {/* Notice Period: emp-7 = 1. 1/8 = 12.5% */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="3.2" 
                      strokeDasharray="12.5 100" strokeDashoffset="-75" />

                    {/* Training: emp-8 = 1. 1/8 = 12.5% */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#06b6d4" strokeWidth="3.2" 
                      strokeDasharray="12.5 100" strokeDashoffset="-87.5" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-3 shadow-inner">
                    <span className="text-xl font-black text-text-primary">{employees.length}</span>
                    <span className="text-[8px] font-bold text-text-secondary uppercase tracking-widest">Total</span>
                  </div>
                </div>

                <div className="space-y-1.5 flex-1">
                  {[
                    { label: 'Active', count: statusStats['Active'] || 0, color: 'bg-emerald-500' },
                    { label: 'On Leave', count: statusStats['On Leave'] || 0, color: 'bg-amber-500' },
                    { label: 'Probation', count: statusStats['Probation'] || 0, color: 'bg-purple-500' },
                    { label: 'Notice Period', count: statusStats['Notice Period'] || 0, color: 'bg-rose-500' },
                    { label: 'Training', count: statusStats['Training'] || 0, color: 'bg-cyan-500' },
                  ].map((status, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-text-secondary">
                        <span className={`h-2.5 w-2.5 rounded-full ${status.color}`} />
                        <span>{status.label}</span>
                      </div>
                      <span className="font-bold text-text-primary">{status.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 3: Location & Experience Metrics */}
            <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-text-primary tracking-tight flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-rose-500" />
                Workforce Locations & Level
              </h3>
              
              <div className="max-h-[120px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {Object.entries(locationStats).map(([loc, count], idx) => {
                  const pct = Math.round((count / employees.length) * 100);
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 px-2.5 py-1.5 rounded-lg border border-border">
                      <span className="font-semibold text-text-primary">{loc}</span>
                      <span className="font-black text-text-primary">{count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-3">
                <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Experience Levels</div>
                <div className="flex flex-wrap gap-1.5">
                  {['Intern', 'Junior', 'Mid', 'Senior', 'Lead', 'Director'].map((lvl) => {
                    const count = employees.filter(e => e.experienceLevel === lvl).length;
                    if (count === 0) return null;
                    return (
                      <span key={lvl} className="inline-flex items-center gap-1 bg-slate-100 text-text-primary text-[10px] font-bold px-2 py-1 rounded">
                        {lvl}: <span className="text-blue-600">{count}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Recent Operations Activity Timeline Feed */}
          <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-text-primary tracking-tight flex items-center gap-1.5">
                <Activity className="h-4.5 w-4.5 text-text-primary" />
                Recent Workforce Activities
              </h3>
              <button 
                onClick={loadEmployees}
                className="text-text-secondary hover:text-text-secondary p-1 rounded-md hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            <div className="divide-y divide-border max-h-[400px] overflow-y-auto pr-1">
              {recentActivities.map((act, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    const empObj = employees.find(e => e.id === act.empId);
                    if (empObj) handleOpenProfile(empObj);
                  }}
                  className="py-3 flex items-start gap-4 hover:bg-slate-50/50 px-2 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-100 text-text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {act.empAvatar}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="text-xs font-bold text-text-primary group-hover:text-blue-600 transition-colors">
                      {act.empName}
                    </div>
                    <div className="text-xs text-text-primary font-medium">
                      {act.event.title} — <span className="text-text-secondary font-normal">{act.event.description}</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-semibold text-text-secondary shrink-0">
                    {act.event.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------ VIEW 2: EMPLOYEE DIRECTORY ------------------ */}
      {activeView === 'directory' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Search, filters, and filters drawer toggles */}
          <div className="bg-white border border-border rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              
              {/* Query Input */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <input 
                  type="text" 
                  placeholder="Search by name, ID, phone, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-border rounded-lg text-xs font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Quick filter badges and popover trigger */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                {searchTerm || filterDept !== 'all' || filterStatus !== 'all' || filterLocation !== 'all' || filterExperience !== 'all' || filterType !== 'all' ? (
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setFilterDept('all');
                      setFilterStatus('all');
                      setFilterLocation('all');
                      setFilterExperience('all');
                      setFilterType('all');
                      showToast('Cleared all active roster filters', 'info');
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer mr-2"
                  >
                    Clear Filters
                  </button>
                ) : null}

                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    showFilters 
                      ? 'border-blue-600 bg-blue-50/50 text-blue-600' 
                      : 'border-border bg-white text-text-secondary hover:bg-slate-50'
                  }`}
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span>Advanced Filters</span>
                </button>
              </div>
            </div>

            {/* Dropdown Filters Expansion Panel */}
            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-border animate-slide-down">
                <div>
                  <label className="block text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mb-1">Department</label>
                  <select 
                    value={filterDept} 
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="w-full text-xs font-semibold p-2 border border-border rounded-lg bg-white focus:outline-none focus:border-primary"
                  >
                    <option value="all">All Departments</option>
                    <option value="org-1">HR / Operations (org-1)</option>
                    <option value="org-2">Mentors / Engineering (org-2)</option>
                    <option value="org-3">Coordination (org-3)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mb-1">Status</label>
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full text-xs font-semibold p-2 border border-border rounded-lg bg-white focus:outline-none focus:border-primary"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Probation">Probation</option>
                    <option value="Training">Training</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Notice Period">Notice Period</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mb-1">Location</label>
                  <select 
                    value={filterLocation} 
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full text-xs font-semibold p-2 border border-border rounded-lg bg-white focus:outline-none focus:border-primary"
                  >
                    <option value="all">All Locations</option>
                    {Array.from(new Set(employees.map(e => e.location))).map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mb-1">Exp Level</label>
                  <select 
                    value={filterExperience} 
                    onChange={(e) => setFilterExperience(e.target.value)}
                    className="w-full text-xs font-semibold p-2 border border-border rounded-lg bg-white focus:outline-none focus:border-primary"
                  >
                    <option value="all">All Experience Levels</option>
                    <option value="Intern">Intern</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                    <option value="Director">Director</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-text-secondary uppercase tracking-wider mb-1">Employment Type</label>
                  <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full text-xs font-semibold p-2 border border-border rounded-lg bg-white focus:outline-none focus:border-primary"
                  >
                    <option value="all">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Training">Training</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* High-density employee table */}
          <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
            <EnhancedTable
              data={filteredEmployees}
              columns={[
                { key: 'checkbox', label: '', render: (emp: Employee) => (
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(emp.id)}
                    onChange={() => toggleSelect(emp.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-border h-3.5 w-3.5 text-blue-600 focus:ring-primary cursor-pointer"
                  />
                )},
                { key: 'id', label: 'Employee ID', render: (emp: Employee) => (
                  <span className="font-mono font-bold text-text-secondary">{emp.id}</span>
                )},
                { key: 'name', label: 'Employee Name', render: (emp: Employee) => (
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-slate-100 text-text-primary font-extrabold text-xs flex items-center justify-center shrink-0">
                      {emp.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-text-primary">{emp.name}</div>
                      <div className="text-[10px] text-text-secondary">{emp.email}</div>
                    </div>
                  </div>
                )},
                { key: 'organizationId', label: 'Department', render: (emp: Employee) => (
                  <span className="font-semibold text-text-primary bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                    {emp.organizationId}
                  </span>
                )},
                { key: 'designation', label: 'Designation', render: (emp: Employee) => (
                  <span className="text-text-primary font-bold">{emp.designation}</span>
                )},
                { key: 'roleName', label: 'Role', render: (emp: Employee) => (
                  <span className="text-text-secondary font-semibold">{emp.roleName}</span>
                )},
                { key: 'managerId', label: 'Reporting Manager', render: (emp: Employee) => (
                  <span className="text-text-secondary font-medium">{employees.find(e => e.id === emp.managerId)?.name || 'None'}</span>
                )},
                { key: 'mentorId', label: 'Assigned Mentor', render: (emp: Employee) => (
                  <span className="text-text-secondary font-medium">{employees.find(e => e.id === emp.mentorId)?.name || 'None'}</span>
                )},
                { key: 'joinDate', label: 'Joining Date', render: (emp: Employee) => (
                  <span className="text-text-secondary font-medium">{emp.joinDate}</span>
                )},
                { key: 'employmentType', label: 'Type', render: (emp: Employee) => (
                  <span className="text-text-secondary font-bold">{emp.employmentType}</span>
                )},
                { key: 'status', label: 'Current Status', render: (emp: Employee) => (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${
                    emp.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : emp.status === 'On Leave'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : emp.status === 'Probation'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : emp.status === 'Notice Period'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : emp.status === 'Training'
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                      : 'bg-slate-100 text-text-secondary border border-border'
                  }`}>
                    {emp.status}
                  </span>
                )},
                { key: 'actions', label: 'Actions', render: (emp: Employee) => (
                  <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => handleOpenProfile(emp)}
                      className="p-1 hover:bg-slate-100 rounded text-text-secondary hover:text-text-primary cursor-pointer"
                      title="View Record Profile"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <PermissionGuard required="employee.edit">
                      <button 
                        onClick={() => openEditModal(emp)}
                        className="p-1 hover:bg-slate-100 rounded text-text-secondary hover:text-text-primary cursor-pointer"
                        title="Edit Employee"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                    </PermissionGuard>
                  </div>
                )},
              ]}
              searchPlaceholder="Search by name, ID, phone, email..."
              itemsPerPage={10}
              emptyMessage="No employees match this selection."
            />
            {filteredEmployees.length > 10 && (
              <div className="px-4 py-3 border-t border-border text-xs text-text-secondary font-semibold">
                Showing {filteredEmployees.length} employees total
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------ BULK OPERATIONS DRAWER/ACTION BAR ------------------ */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-border text-white rounded-xl shadow-2xl px-6 py-4 flex flex-col md:flex-row items-center gap-4 animate-slide-up max-w-4xl w-[90%]">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white h-6 w-6 rounded-full flex items-center justify-center font-extrabold text-xs">
              {selectedIds.length}
            </div>
            <span className="text-xs font-bold">Employees selected</span>
          </div>

          <div className="h-px md:h-6 w-full md:w-px bg-slate-800 my-1 md:my-0" />

          {/* Bulk Action Buttons Grid */}
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
                setDeptInput('org-1');
                setActiveActionModal({ type: 'bulkDept' });
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-border px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              Bulk Transfer Dept
            </button>
            <button 
              onClick={() => {
                setMentorInput('');
                setActiveActionModal({ type: 'bulkMentor' });
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-border px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              Bulk Assign Mentor
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
                showToast(`Requesting document verification scans for ${selectedIds.length} employees`, 'info');
                setSelectedIds([]);
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-border px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors text-amber-400"
            >
              Request Documents
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
        title="Employee File & Operations"
      >
        {activeProfile ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 select-none">
            
            {/* STICKY TOP ACTIONS HEADER PANEL */}
            <div className="bg-slate-900 text-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-lg border-b border-border">
              
              {/* Employee Summary Card */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-800 text-slate-200 border-2 border-border flex items-center justify-center font-black text-lg shrink-0 shadow-md">
                  {activeProfile.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white tracking-tight">{activeProfile.name}</h3>
                    <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold border border-border">
                      {activeProfile.id}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-none mt-1 font-semibold">
                    {activeProfile.designation} — <span className="text-slate-300 font-bold">{activeProfile.organizationId}</span>
                  </p>
                </div>
              </div>

              {/* Action Operations Button bar */}
              <div className="flex items-center flex-wrap gap-2">
                <PermissionGuard required="employee.edit">
                  <button 
                    onClick={() => openEditModal(activeProfile)}
                    className="bg-slate-800 hover:bg-slate-700 border border-border text-white px-2.5 py-1.5 rounded text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                </PermissionGuard>
                <button 
                  onClick={() => {
                    setMentorInput(activeProfile.mentorId || '');
                    setActiveActionModal({ type: 'mentor' });
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-border text-white px-2.5 py-1.5 rounded text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center gap-1"
                >
                  <Award className="h-3 w-3 text-text-secondary" />
                  <span>Mentor</span>
                </button>
                <button 
                  onClick={() => {
                    setStatusInput(activeProfile.status);
                    setActiveActionModal({ type: 'status' });
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-border text-white px-2.5 py-1.5 rounded text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3 text-emerald-400" />
                  <span>Status</span>
                </button>
                <button 
                  onClick={() => {
                    setPromoTitle(activeProfile.designation);
                    setPromoGrade(activeProfile.salaryGrade);
                    setActiveActionModal({ type: 'promote' });
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-border text-white px-2.5 py-1.5 rounded text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center gap-1 text-amber-400"
                >
                  <TrendingUp className="h-3 w-3" />
                  <span>Promote</span>
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
                
                {/* Export single record */}
                <button 
                  onClick={() => {
                    showToast(`Single Employee record compiled & exported for ${activeProfile.name}`);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-border text-slate-300 hover:text-white p-1.5 rounded cursor-pointer"
                  title="Export Record Summary"
                >
                  <FileDown className="h-4 w-4" />
                </button>
              </div>

            </div>

            {/* TAB SELECTOR STRIP */}
            <div className="bg-white border-b border-border px-6 overflow-x-auto flex shrink-0 scrollbar-none">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'documents', label: 'Documents Center' },
                { id: 'hr', label: 'HR Operations' },
                { id: 'mentor', label: 'Mentor Metrics', mentorOnly: true },
                { id: 'access', label: 'Access Control', adminOnly: true },
                { id: 'performance', label: 'Performance Center' },
                { id: 'projects', label: 'Projects & Work' },
                { id: 'timeline', label: 'Timeline History' },
              ].map((tab) => {
                // Check if mentor role
                if (tab.mentorOnly && activeProfile.roleName !== 'Mentor') return null;
                // Check if admin only
                if (tab.adminOnly && user?.roleName !== 'Super Admin') return null;

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

            {/* TAB CONTENT SPACE (SCROLLABLE) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: OVERVIEW */}
              {profileTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Persona Row cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Card A: Personal details */}
                    <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-3">
                      <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-blue-600" />
                        Personal Information
                      </h4>
                      <div className="divide-y divide-border">
                        {[
                          { label: 'Full Name', val: activeProfile.name },
                          { label: 'Primary Email', val: activeProfile.email },
                          { label: 'Phone Number', val: activeProfile.phone },
                          { label: 'Date of Birth', val: activeProfile.dob },
                          { label: 'Gender', val: activeProfile.gender },
                          { label: 'Current Address', val: activeProfile.address },
                        ].map((row, rIdx) => (
                          <div key={rIdx} className="py-2.5 flex justify-between text-xs font-semibold">
                            <span className="text-text-secondary">{row.label}</span>
                            <span className="text-text-primary text-right">{row.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card B: Professional settings */}
                    <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-3">
                      <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5 text-emerald-600" />
                        Professional Record
                      </h4>
                      <div className="divide-y divide-border">
                        {[
                          { label: 'Employee ID', val: activeProfile.id },
                          { label: 'Department Code', val: activeProfile.organizationId },
                          { label: 'Designation', val: activeProfile.designation },
                          { label: 'Employment Level', val: activeProfile.experienceLevel },
                          { label: 'Employment Type', val: activeProfile.employmentType },
                          { label: 'Joining Date', val: activeProfile.joinDate },
                        ].map((row, rIdx) => (
                          <div key={rIdx} className="py-2.5 flex justify-between text-xs font-semibold">
                            <span className="text-text-secondary">{row.label}</span>
                            <span className="text-text-primary">{row.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Card C: Emergency contacts */}
                  <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-3">
                    <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      Emergency Contact Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                      <div className="bg-slate-50 p-3 rounded-lg border border-border">
                        <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-0.5">Contact Name</div>
                        <div className="text-text-primary font-extrabold">{activeProfile.emergencyContact.name}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-border">
                        <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-0.5">Relationship</div>
                        <div className="text-text-primary font-extrabold">{activeProfile.emergencyContact.relation}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-border">
                        <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-0.5">Phone Number</div>
                        <div className="text-text-primary font-extrabold">{activeProfile.emergencyContact.phone}</div>
                      </div>
                    </div>
                  </div>

                  {/* Employment stage timeline flow bar */}
                  <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">
                      Lifecycle Stage Status
                    </h4>
                    <div className="flex items-center justify-between relative mt-2">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                      
                      {[
                        { title: 'Recruit', date: activeProfile.joinDate, active: true },
                        { title: 'Onboard', date: activeProfile.joinDate, active: true },
                        { title: 'Probation', date: activeProfile.status === 'Probation' ? 'Current' : 'Completed', active: activeProfile.status !== 'Training' },
                        { title: 'Active Duty', date: activeProfile.status === 'Active' ? 'Current' : '', active: activeProfile.status === 'Active' || activeProfile.status === 'Notice Period' },
                        { title: 'Exit', date: activeProfile.status === 'Notice Period' ? 'In notice' : '', active: activeProfile.status === 'Notice Period' || activeProfile.status === 'Resigned' }
                      ].map((stage, sIdx) => (
                        <div key={sIdx} className="flex flex-col items-center z-10">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                            stage.active 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                              : 'bg-white border-border text-text-secondary'
                          }`}>
                            {sIdx + 1}
                          </div>
                          <span className="text-[10px] font-bold text-text-primary mt-1">{stage.title}</span>
                          <span className="text-[8px] text-text-secondary font-semibold">{stage.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: DOCUMENTS CENTER */}
              {profileTab === 'documents' && (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">
                      Employee Document Folders
                    </h4>
                    
                    <button 
                      onClick={() => {
                        setDocType('PAN Card');
                        setDocName('');
                        setActiveActionModal({ type: 'doc' });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-150 cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload New Document</span>
                    </button>
                  </div>

                  {/* Documents Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      'Resume', 'Offer Letter', 'Government ID', 'PAN Card', 
                      'Aadhaar', 'Degree Certificates', 'Experience Certificates', 
                      'NDA', 'Employment Agreement'
                    ].map((type) => {
                      // Find if employee has this doc uploaded
                      const doc = activeProfile.documents.find(d => d.type === type);

                      return (
                        <div 
                          key={type}
                          onClick={() => {
                            if (doc) setPreviewDoc(doc);
                          }}
                          className={`bg-white border rounded-xl p-4.5 shadow-sm flex flex-col justify-between h-40 transition-all duration-150 ${
                            doc 
                              ? 'border-border hover:border-secondary hover:shadow-md cursor-pointer' 
                              : 'border-border border-dashed opacity-65'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <FileText className={`h-8 w-8 ${doc ? 'text-blue-600' : 'text-slate-300'}`} />
                              {doc ? (
                                <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                                  doc.status === 'Verified' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                    : doc.status === 'Rejected'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {doc.status}
                                </span>
                              ) : (
                                <span className="text-[8px] bg-slate-100 text-text-secondary px-1.5 py-0.5 rounded font-bold">
                                  Not Uploaded
                                </span>
                              )}
                            </div>
                            
                            <h5 className="font-bold text-xs text-text-primary mt-3">{type}</h5>
                            <p className="text-[10px] text-text-secondary mt-1 truncate">
                              {doc ? doc.name : 'Missing file reference'}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-border pt-2.5 mt-2 text-[10px] font-semibold text-text-secondary">
                            <span>{doc ? `v${doc.version} - ${doc.uploadDate}` : 'No date'}</span>
                            {doc && (
                              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                {/* Verify actions */}
                                {doc.status !== 'Verified' && (
                                  <button 
                                    onClick={() => {
                                      const docIdx = activeProfile.documents.findIndex(d => d.type === type);
                                      handleVerifyDocument(activeProfile.id, docIdx, 'Verified');
                                    }}
                                    className="p-1 hover:bg-slate-100 rounded text-emerald-600 hover:text-emerald-700 cursor-pointer"
                                    title="Verify Document"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </button>
                                )}
                                {doc.status !== 'Rejected' && (
                                  <PermissionGuard required="employee.edit">
                                    <button 
                                      onClick={() => {
                                        const docIdx = activeProfile.documents.findIndex(d => d.type === type);
                                        handleVerifyDocument(activeProfile.id, docIdx, 'Rejected');
                                      }}
                                      className="p-1 hover:bg-slate-100 rounded text-rose-600 hover:text-rose-700 cursor-pointer"
                                      title="Reject Verification"
                                    >
                                      <Trash className="h-3.5 w-3.5" />
                                    </button>
                                  </PermissionGuard>
                                )}
                                <a 
                                  href="#" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    showToast(`Downloading file: ${doc.name}`);
                                  }}
                                  className="p-1 hover:bg-slate-100 rounded text-text-secondary hover:text-text-primary"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Document preview block */}
                  {previewDoc && (
                    <div className="bg-slate-900 border border-border rounded-xl p-5 shadow-inner text-white animate-slide-down">
                      <div className="flex justify-between items-center border-b border-border pb-3 mb-3">
                        <div>
                          <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Document Preview Workspace</div>
                          <h5 className="font-extrabold text-sm text-blue-400">{previewDoc.type} — {previewDoc.name}</h5>
                        </div>
                        <button 
                          onClick={() => setPreviewDoc(null)}
                          className="text-xs font-bold text-text-secondary hover:text-white underline cursor-pointer"
                        >
                          Close Preview
                        </button>
                      </div>
                      
                      <div className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-lg border border-border min-h-[100px] leading-relaxed whitespace-pre-wrap">
                        {previewDoc.previewContent || `PDF File Content Binary Simulator. Standardized enterprise document header verified. Verified by Charlie Davis.`}
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-text-secondary font-semibold mt-3">
                        <span>Version History: {previewDoc.version} (Latest)</span>
                        <span>Verification Sign-off: {previewDoc.verifiedBy || 'Pending'}</span>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 3: HR OPERATIONS */}
              {profileTab === 'hr' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Grade, bands, shifts layout */}
                  <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-blue-600" />
                      Employment Administration & Grades
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
                      <div className="bg-slate-50 p-3 rounded-lg border border-border">
                        <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-0.5">Salary Grade</div>
                        <div className="text-text-primary font-extrabold">{activeProfile.salaryGrade}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-border">
                        <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-0.5">Salary Band</div>
                        <div className="text-text-primary font-extrabold">{activeProfile.band}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-border">
                        <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-0.5">Operations Shift</div>
                        <div className="text-text-primary font-extrabold">{activeProfile.shift}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-border">
                        <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-0.5">Work Location</div>
                        <div className="text-text-primary font-extrabold">{activeProfile.location}</div>
                      </div>
                    </div>
                  </div>

                  {/* Attendance tracker */}
                  <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-emerald-600" />
                      Attendance Summary Tracker
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-3 bg-slate-50 border border-border rounded-lg">
                        <div className="text-xl font-black text-text-primary">{activeProfile.attendance.presentDays}</div>
                        <div className="text-[9px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">Present Days</div>
                      </div>
                      <div className="p-3 bg-slate-50 border border-border rounded-lg">
                        <div className="text-xl font-black text-text-primary">{activeProfile.attendance.absentDays}</div>
                        <div className="text-[9px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">Absent Days</div>
                      </div>
                      <div className="p-3 bg-slate-50 border border-border rounded-lg">
                        <div className="text-xl font-black text-amber-600">{activeProfile.attendance.lateArrivals}</div>
                        <div className="text-[9px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">Late Arrivals</div>
                      </div>
                      <div className="p-3 bg-slate-50 border border-border rounded-lg">
                        <div className="text-xl font-black text-blue-600">{activeProfile.attendance.totalHours} hr</div>
                        <div className="text-[9px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">Total Worked</div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-semibold text-text-primary">
                        <span>Workplace Attendance Health</span>
                        <span>{Math.round((activeProfile.attendance.presentDays / (activeProfile.attendance.presentDays + activeProfile.attendance.absentDays)) * 100)}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${Math.round((activeProfile.attendance.presentDays / (activeProfile.attendance.presentDays + activeProfile.attendance.absentDays)) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Leave tracking */}
                  <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-purple-600" />
                      Annual Paid Leaves Balance
                    </h4>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-lg">
                        <div className="text-xl font-black text-purple-700">{activeProfile.leave.available}</div>
                        <div className="text-[9px] font-bold text-purple-500 uppercase tracking-wider mt-0.5">Available Leaves</div>
                      </div>
                      <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                        <div className="text-xl font-black text-emerald-700">{activeProfile.leave.used}</div>
                        <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider mt-0.5">Used Leaves</div>
                      </div>
                      <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-lg">
                        <div className="text-xl font-black text-amber-700">{activeProfile.leave.pending}</div>
                        <div className="text-[9px] font-bold text-amber-500 uppercase tracking-wider mt-0.5">Pending Approvals</div>
                      </div>
                      <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                        <div className="text-xl font-black text-blue-700">{activeProfile.leave.approved}</div>
                        <div className="text-[9px] font-bold text-blue-500 uppercase tracking-wider mt-0.5">Approved Requests</div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: MENTOR MANAGEMENT */}
              {profileTab === 'mentor' && activeProfile.mentorMetrics && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Mentor KPIs */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    {[
                      { label: 'Assigned Interns', val: activeProfile.mentorMetrics.assignedInterns, color: 'text-blue-600 bg-blue-50/40' },
                      { label: 'Assigned Employees', val: activeProfile.mentorMetrics.assignedEmployees, color: 'text-emerald-600 bg-emerald-50/40' },
                      { label: 'Active Projects', val: activeProfile.mentorMetrics.activeProjects, color: 'text-purple-600 bg-purple-50/40' },
                      { label: 'Training Sessions', val: activeProfile.mentorMetrics.trainingSessions, color: 'text-cyan-600 bg-cyan-50/40' },
                    ].map((kpi, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border border-border shadow-sm ${kpi.color}`}>
                        <div className="text-2xl font-black">{kpi.val}</div>
                        <div className="text-[9px] font-bold text-text-secondary uppercase tracking-wider mt-1">{kpi.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Assigned Resources Lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Intern list */}
                    <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-3">
                      <h5 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">Assigned Interns</h5>
                      <div className="divide-y divide-border max-h-[200px] overflow-y-auto pr-1">
                        {activeProfile.mentorMetrics.interns.map((intern) => (
                          <div 
                            key={intern.id} 
                            onClick={() => {
                              const matchObj = employees.find(e => e.id === intern.id);
                              if (matchObj) handleOpenProfile(matchObj);
                            }}
                            className="py-2.5 flex justify-between items-center text-xs font-semibold hover:text-blue-600 cursor-pointer"
                          >
                            <span>{intern.name} <span className="font-mono text-[9px] text-text-secondary">({intern.id})</span></span>
                            <span className="text-text-secondary">{intern.batch}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Employee list */}
                    <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-3">
                      <h5 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">Assigned Employees</h5>
                      <div className="divide-y divide-border max-h-[200px] overflow-y-auto pr-1">
                        {activeProfile.mentorMetrics.employees.map((staff) => (
                          <div 
                            key={staff.id} 
                            onClick={() => {
                              const matchObj = employees.find(e => e.id === staff.id);
                              if (matchObj) handleOpenProfile(matchObj);
                            }}
                            className="py-2.5 flex justify-between items-center text-xs font-semibold hover:text-blue-600 cursor-pointer"
                          >
                            <span>{staff.name} <span className="font-mono text-[9px] text-text-secondary">({staff.id})</span></span>
                            <span className="text-text-secondary">{staff.department}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Mentor analytics */}
                  <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
                    <h5 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">Mentorship Analytics</h5>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
                      <div className="bg-slate-50 p-3 rounded-lg border border-border">
                        <div className="text-[10px] text-text-secondary uppercase tracking-wider">Success Rate</div>
                        <div className="text-emerald-600 text-lg font-black">{activeProfile.mentorMetrics.successRate}%</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-border">
                        <div className="text-[10px] text-text-secondary uppercase tracking-wider">Total Training Hours</div>
                        <div className="text-text-primary text-lg font-black">{activeProfile.mentorMetrics.trainingHours} hrs</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-border">
                        <div className="text-[10px] text-text-secondary uppercase tracking-wider">Average Intern Rating</div>
                        <div className="text-amber-500 text-lg font-black flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                          {activeProfile.mentorMetrics.avgRating}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-border">
                        <div className="text-[10px] text-text-secondary uppercase tracking-wider">Retention Success</div>
                        <div className="text-blue-600 text-lg font-black">{activeProfile.mentorMetrics.retentionRate}%</div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 5: ACCESS & ADMINISTRATION */}
              {profileTab === 'access' && user?.roleName === 'Super Admin' && activeProfile.accessControl && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Role & permissions summary */}
                  <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-rose-500" />
                      Role & Systems Permissions
                    </h4>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-border text-xs">
                        <span className="font-bold text-text-secondary">Security Access Level Role</span>
                        <span className="font-extrabold text-text-primary bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                          {activeProfile.accessControl.role}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Assigned Permissions</div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeProfile.accessControl.permissions.map((p, idx) => (
                            <span key={idx} className="bg-slate-100 text-text-primary text-[10px] font-bold px-2 py-0.5 rounded">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Allowed ERP Modules</div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeProfile.accessControl.moduleAccess.map((m, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*Traceable activity audits */}
                  <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-3">
                    <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Activity Audit Trail log (ISO Standardized)
                    </h4>

                    <div className="divide-y divide-border">
                      {activeProfile.auditTrail?.map((entry) => (
                        <div key={entry.id} className="py-2.5 text-xs">
                          <div className="flex justify-between items-center font-bold text-text-primary">
                            <span>{entry.action}</span>
                            <span className="text-[10px] text-text-secondary">{entry.date}</span>
                          </div>
                          <p className="text-text-secondary mt-0.5 leading-relaxed font-medium">
                            {entry.details} — <span className="text-text-secondary">Performed by: {entry.performedBy}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 6: PERFORMANCE CENTER */}
              {profileTab === 'performance' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Skill Progress levels */}
                  {activeProfile.performanceMetrics && (
                    <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
                      <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">
                        Review Core Skill Metrics
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { label: 'Productivity Level', val: activeProfile.performanceMetrics.productivity, color: 'bg-blue-500' },
                          { label: 'Team Communication', val: activeProfile.performanceMetrics.communication, color: 'bg-emerald-500' },
                          { label: 'Leadership Qualities', val: activeProfile.performanceMetrics.leadership, color: 'bg-purple-500' },
                          { label: 'Technical Depth', val: activeProfile.performanceMetrics.technical, color: 'bg-cyan-500' },
                          { label: 'Work Attendance', val: activeProfile.performanceMetrics.attendance, color: 'bg-teal-500' },
                          { label: 'Learning Progress Rate', val: activeProfile.performanceMetrics.learningProgress, color: 'bg-indigo-500' },
                        ].map((metric, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-text-primary">
                              <span>{metric.label}</span>
                              <span className="font-bold text-text-primary">{metric.val}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${metric.color} rounded-full`} style={{ width: `${metric.val}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rating Line Trend SVG Widget */}
                  {activeProfile.performanceTrend && (
                    <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
                      <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">
                        Historical Monthly Rating Trend
                      </h4>

                      {/* Custom SVG line chart */}
                      <div className="h-44 w-full bg-slate-50 border border-border rounded-lg p-4 flex flex-col justify-between">
                        <div className="flex justify-between text-[10px] text-text-secondary font-bold border-b border-border pb-1">
                          <span>Rating (out of 5.0)</span>
                          <span>Trend Range: {activeProfile.performanceTrend.length} Months</span>
                        </div>
                        
                        <div className="relative flex-1 flex items-end justify-between px-6 pt-6">
                          {/* Grid line paths */}
                          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50 py-3">
                            <div className="border-b border-dashed border-border w-full" />
                            <div className="border-b border-dashed border-border w-full" />
                            <div className="border-b border-dashed border-border w-full" />
                          </div>

                          {(() => {
                            const pts = activeProfile.performanceTrend;
                            if (pts.length === 0) return null;
                            const spacingX = 100 / Math.max(1, pts.length - 1);
                            // Map rating (0-5) to Y (90 to 10)
                            const getY = (rating: number) => 90 - (rating / 5) * 80;
                            const pathData = pts.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${i * spacingX},${getY(pt.rating)}`).join(' ');
                            return (
                              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                {/* Path representing rating scores */}
                                <path 
                                  d={pathData} 
                                  fill="none" 
                                  stroke="#2563eb" 
                                  strokeWidth="3" 
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path 
                                  d={`${pathData} L 100,100 L 0,100 Z`} 
                                  fill="url(#trend-grad)" 
                                  opacity="0.1"
                                />
                                <defs>
                                  <linearGradient id="trend-grad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2563eb" />
                                    <stop offset="100%" stopColor="#ffffff" />
                                  </linearGradient>
                                </defs>
                              </svg>
                            );
                          })()}

                          {activeProfile.performanceTrend.map((t, idx) => (
                            <div key={idx} className="z-10 flex flex-col items-center">
                              <span className="text-[10px] font-black text-text-primary bg-white border border-border rounded px-1 shadow-sm mb-1">{t.rating}</span>
                              <span className="text-[10px] font-bold text-text-secondary">{t.month}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reviews lists with New review submissions */}
                  <div className="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">
                        Submit Reviews & HR Feedback
                      </h4>
                      <button 
                        onClick={() => {
                          setReviewForm({ score: 5, comment: '', role: 'HR' });
                          setActiveActionModal({ type: 'review' });
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Write Review
                      </button>
                    </div>

                    <div className="space-y-4">
                      {activeProfile.performanceReviews?.map((rev, idx) => (
                        <div key={idx} className="bg-slate-50 border border-border rounded-xl p-3.5 text-xs">
                          <div className="flex justify-between items-center font-bold text-text-primary">
                            <span className="text-text-primary">{rev.reviewerName} ({rev.role})</span>
                            <span className="text-amber-500 font-extrabold flex items-center gap-0.5">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                              {rev.score} / 5
                            </span>
                          </div>
                          <p className="text-text-secondary mt-1 font-medium leading-relaxed italic">
                            "{rev.comment}"
                          </p>
                          <div className="text-[9px] font-bold text-text-secondary mt-2 text-right">
                            {rev.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 7: PROJECTS & ASSIGNMENTS */}
              {profileTab === 'projects' && (
                <div className="space-y-6 animate-fade-in animate-slide-down">
                  
                  <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">
                    Assigned Project Assignments
                  </h4>

                  <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
                    <EnhancedTable
                      data={activeProfile.projects || []}
                      columns={[
                        { key: 'name', label: 'Project Name', render: (proj: EmployeeProject) => (
                          <span className="flex items-center gap-1.5 font-bold text-text-primary">
                            <Briefcase className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            {proj.name}
                          </span>
                        )},
                        { key: 'role', label: 'Project Role', render: (proj: EmployeeProject) => (
                          <span className="text-text-secondary font-semibold">{proj.role}</span>
                        )},
                        { key: 'startDate', label: 'Start Date', render: (proj: EmployeeProject) => (
                          <span className="text-text-secondary font-medium">{proj.startDate}</span>
                        )},
                        { key: 'endDate', label: 'End Date', render: (proj: EmployeeProject) => (
                          <span className="text-text-secondary font-medium">{proj.endDate}</span>
                        )},
                        { key: 'status', label: 'Status', render: (proj: EmployeeProject) => (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            proj.status === 'Completed' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : proj.status === 'Active'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {proj.status}
                          </span>
                        )},
                        { key: 'score', label: 'Performance Score', render: (proj: EmployeeProject) => (
                          <span className="text-right font-black text-text-primary">{proj.score} / 100</span>
                        )},
                      ]}
                      itemsPerPage={10}
                      emptyMessage="No active project assignments."
                    />
                  </div>

                </div>
              )}

              {/* TAB 8: EMPLOYEE TIMELINE */}
              {profileTab === 'timeline' && (
                <div className="space-y-6 animate-fade-in">
                  
                  <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest">
                    Complete Organizational History timeline
                  </h4>

                  <div className="relative border-l-2 border-border pl-6 space-y-6 ml-2 py-2">
                    {activeProfile.timeline.map((evt, idx) => (
                      <div key={idx} className="relative">
                        
                        {/* Dot indicator matching event type */}
                        <div className={`absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-white flex items-center justify-center ${
                          evt.type === 'onboarding' ? 'bg-blue-600' :
                          evt.type === 'promotion' ? 'bg-amber-500' :
                          evt.type === 'transfer' ? 'bg-purple-600' :
                          evt.type === 'mentor' ? 'bg-sky-500' :
                          evt.type === 'review' ? 'bg-indigo-600' :
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
            Select an employee from the roster to inspect file records.
          </div>
        )}
      </Drawer>

      {/* ------------------ MODALS FOR OPERATIONAL ACTIONS ------------------ */}
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
                {activeActionModal.type === 'status' && 'Transition Employee Lifecycle Status'}
                {activeActionModal.type === 'dept' && 'Department Organization Transfer'}
                {activeActionModal.type === 'mentor' && 'Assign Advisor / Mentor'}
                {activeActionModal.type === 'promote' && 'Promote Employee Grade'}
                {activeActionModal.type === 'doc' && 'Upload Document Scans'}
                {activeActionModal.type === 'edit' && 'Modify Employee File'}
                {activeActionModal.type === 'onboard' && 'Onboard New Workforce Employee'}
                {activeActionModal.type === 'review' && 'Submit Professional Assessment Review'}
                {activeActionModal.type === 'notify' && 'Send Operational Notification'}
                
                {/* Bulk Actions */}
                {activeActionModal.type === 'bulkStatus' && 'Bulk Status Change Stage'}
                {activeActionModal.type === 'bulkDept' && 'Bulk Department Organization Transfer'}
                {activeActionModal.type === 'bulkMentor' && 'Bulk Assign Mentorship Connection'}
                {activeActionModal.type === 'bulkNotify' && 'Bulk Dispatch Notifications'}
              </h3>
              <button 
                onClick={() => setActiveActionModal(null)}
                className="text-xs font-bold text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
            </div>

            {/* Modal forms */}
            <form 
              onSubmit={executeAction} 
              className={`text-xs font-semibold text-text-primary flex flex-col min-h-0 ${
                (activeActionModal.type === 'edit' || activeActionModal.type === 'onboard') 
                  ? 'p-8 space-y-6 flex-1 h-full justify-between' 
                  : 'p-6 space-y-4'
              }`}
            >
              
              {/* Form 1: Status change */}
              {(activeActionModal.type === 'status' || activeActionModal.type === 'bulkStatus') && (
                <div className="space-y-3">
                  <label className="block text-text-secondary">Select lifecycle state status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as any)}
                    className="w-full p-2.5 border border-border rounded-lg bg-white font-semibold text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="Active">Active Duty</option>
                    <option value="Probation">Probation Stage</option>
                    <option value="Training">Training Stage</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Notice Period">Notice Period</option>
                    <option value="Resigned">Resigned / Exit Completed</option>
                    <option value="Terminated">Terminated / Term completed</option>
                  </select>
                  
                  {activeActionModal.type === 'bulkStatus' ? (
                    <button 
                      type="button"
                      onClick={() => executeBulkAction('status')}
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                    >
                      Apply Bulk Status Change ({selectedIds.length} employees)
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                    >
                      Save Status Transition
                    </button>
                  )}
                </div>
              )}

              {/* Form 2: Department transfer */}
              {(activeActionModal.type === 'dept' || activeActionModal.type === 'bulkDept') && (
                <div className="space-y-3">
                  <label className="block text-text-secondary">Target Organization Department Code</label>
                  <select
                    value={deptInput}
                    onChange={(e) => setDeptInput(e.target.value)}
                    className="w-full p-2.5 border border-border rounded-lg bg-white font-semibold text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="org-1">HR / Operations (org-1)</option>
                    <option value="org-2">Mentors / Engineering (org-2)</option>
                    <option value="org-3">Coordination / Relations (org-3)</option>
                  </select>
                  
                  {activeActionModal.type === 'bulkDept' ? (
                    <button 
                      type="button"
                      onClick={() => executeBulkAction('dept')}
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                    >
                      Transfer Selected ({selectedIds.length} employees)
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                    >
                      Execute Transfer
                    </button>
                  )}
                </div>
              )}

              {/* Form 3: Mentor Assignment */}
              {(activeActionModal.type === 'mentor' || activeActionModal.type === 'bulkMentor') && (
                <div className="space-y-3">
                  <label className="block text-text-secondary">Select Professional Mentor</label>
                  <select
                    value={mentorInput}
                    onChange={(e) => setMentorInput(e.target.value)}
                    className="w-full p-2.5 border border-border rounded-lg bg-white font-semibold text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="">No Assigned Mentor (Clear mentor)</option>
                    {employees.filter(e => e.roleName === 'Mentor').map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.designation})</option>
                    ))}
                  </select>
                  
                  {activeActionModal.type === 'bulkMentor' ? (
                    <button 
                      type="button"
                      onClick={() => executeBulkAction('mentor')}
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                    >
                      Assign Mentor to Group ({selectedIds.length} employees)
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                    >
                      Assign Mentor
                    </button>
                  )}
                </div>
              )}

              {/* Form 4: Promote */}
              {activeActionModal.type === 'promote' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-text-secondary">New Designation Title</label>
                    <input 
                      type="text" 
                      required
                      value={promoTitle}
                      onChange={(e) => setPromoTitle(e.target.value)}
                      className="w-full p-2.5 border border-border rounded-lg bg-white focus:outline-none"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-text-secondary">New Salary Grade Band</label>
                    <select
                      value={promoGrade}
                      onChange={(e) => setPromoGrade(e.target.value)}
                      className="w-full p-2.5 border border-border rounded-lg bg-white focus:outline-none"
                    >
                      <option value="Grade 1">Grade 1 (Intern)</option>
                      <option value="Grade 2">Grade 2 (Junior Analyst)</option>
                      <option value="Grade 4">Grade 4 (Staff Engineer)</option>
                      <option value="Grade 6">Grade 6 (Senior Analyst)</option>
                      <option value="Grade 8">Grade 8 (Lead Architect)</option>
                      <option value="Grade 9">Grade 9 (Senior Manager)</option>
                      <option value="Grade 12">Grade 12 (VP Technology)</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all cursor-pointer"
                  >
                    Confirm Promotion
                  </button>
                </div>
              )}

              {/* Form 5: Document Upload */}
              {activeActionModal.type === 'doc' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-text-secondary">Select Document Category Type</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full p-2.5 border border-border rounded-lg bg-white focus:outline-none"
                    >
                      <option value="Resume">Resume</option>
                      <option value="Offer Letter">Offer Letter</option>
                      <option value="Government ID">Government ID</option>
                      <option value="PAN Card">PAN Card</option>
                      <option value="Aadhaar">Aadhaar scan</option>
                      <option value="Degree Certificates">Degree Certificates</option>
                      <option value="Experience Certificates">Experience Certificates</option>
                      <option value="NDA">NDA agreement</option>
                      <option value="Employment Agreement">Employment Agreement</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-text-secondary">File Name (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. adhaar_scan_final.pdf"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      className="w-full p-2.5 border border-border rounded-lg bg-white focus:outline-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all cursor-pointer"
                  >
                    Confirm Upload Details
                  </button>
                </div>
              )}

              {/* Form 6: Performance Review Submission */}
              {activeActionModal.type === 'review' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-text-secondary">Rating Evaluation Score</label>
                    <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-black border border-amber-200 flex items-center gap-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {reviewForm.score} / 5
                    </span>
                  </div>
                  
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    step="1"
                    value={reviewForm.score}
                    onChange={(e) => setReviewForm({ ...reviewForm, score: Number(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer"
                  />

                  <div className="space-y-1">
                    <label className="block text-text-secondary">Reviewer Perspective Role</label>
                    <select
                      value={reviewForm.role}
                      onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value as any })}
                      className="w-full p-2.5 border border-border rounded-lg bg-white focus:outline-none"
                    >
                      <option value="HR">HR Feedback</option>
                      <option value="Manager">Manager Assessment Review</option>
                      <option value="Mentor">Mentor Review</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-text-secondary">Assessment feedback Comments</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Input comprehensive feedback about productivity, leadership, and technical contribution."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full p-2.5 border border-border rounded-lg bg-white focus:outline-none font-semibold text-xs leading-relaxed"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all cursor-pointer"
                  >
                    Submit Performance Rating
                  </button>
                </div>
              )}

              {/* Form 7: Notification dispatcher */}
              {(activeActionModal.type === 'notify' || activeActionModal.type === 'bulkNotify') && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-text-secondary">Notification Message Content</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Input employee dashboard notification details..."
                      value={notifyMsg}
                      onChange={(e) => setNotifyMsg(e.target.value)}
                      className="w-full p-2.5 border border-border rounded-lg bg-white focus:outline-none font-semibold text-xs"
                    />
                  </div>

                  {activeActionModal.type === 'bulkNotify' ? (
                    <button 
                      type="button"
                      onClick={() => executeBulkAction('notify')}
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all cursor-pointer"
                    >
                      Dispatch Bulk Notifications ({selectedIds.length} selected)
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all cursor-pointer"
                    >
                      Send Notification
                    </button>
                  )}
                </div>
              )}

              {/* Form 8 & 9: Edit Profile & Onboarding wizard (Combined Form Layout) */}
              {(activeActionModal.type === 'edit' || activeActionModal.type === 'onboard') && (
                <div className="space-y-6 max-w-5xl mx-auto w-full flex-1 flex flex-col justify-start overflow-hidden pt-4">
                  
                  {/* Section 1 */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-border pb-1">
                      Section 1: Identity & Credentials
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Primary Phone</label>
                        <input 
                          type="text" 
                          required
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Date of Birth</label>
                        <input 
                          type="date" 
                          required
                          value={editForm.dob}
                          onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Gender</label>
                        <select 
                          value={editForm.gender}
                          onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Office Location</label>
                        <input 
                          type="text" 
                          required
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="block text-text-secondary text-[10px]">Home Address</label>
                        <input 
                          type="text" 
                          required
                          value={editForm.address}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Section 2 */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-border pb-1">
                      Section 2: Professional Details
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Designation Title</label>
                        <input 
                          type="text" 
                          required
                          value={editForm.designation}
                          onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Employment Type</label>
                        <select 
                          value={editForm.employmentType}
                          onChange={(e) => setEditForm({ ...editForm, employmentType: e.target.value as any })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract Scope</option>
                          <option value="Internship">Internship Training</option>
                          <option value="Training">Training Cohort</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Salary Grade</label>
                        <input 
                          type="text" 
                          required
                          value={editForm.salaryGrade}
                          onChange={(e) => setEditForm({ ...editForm, salaryGrade: e.target.value })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Salary Band</label>
                        <input 
                          type="text" 
                          required
                          value={editForm.band}
                          onChange={(e) => setEditForm({ ...editForm, band: e.target.value })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Shift Schedule</label>
                        <input 
                          type="text" 
                          required
                          value={editForm.shift}
                          onChange={(e) => setEditForm({ ...editForm, shift: e.target.value })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Experience Level</label>
                        <select 
                          value={editForm.experienceLevel}
                          onChange={(e) => setEditForm({ ...editForm, experienceLevel: e.target.value as any })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        >
                          <option value="Intern">Intern</option>
                          <option value="Junior">Junior Staff</option>
                          <option value="Mid">Mid Level</option>
                          <option value="Senior">Senior Level</option>
                          <option value="Lead">Lead Level</option>
                          <option value="Director">Director Level</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section 3 */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-border pb-1">
                      Section 3: Emergency Contact
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Contact Name</label>
                        <input 
                          type="text" 
                          required
                          value={editForm.emergencyName}
                          onChange={(e) => setEditForm({ ...editForm, emergencyName: e.target.value })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Relationship</label>
                        <input 
                          type="text" 
                          required
                          value={editForm.emergencyRelation}
                          onChange={(e) => setEditForm({ ...editForm, emergencyRelation: e.target.value })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-text-secondary text-[10px]">Phone</label>
                        <input 
                          type="text" 
                          required
                          value={editForm.emergencyPhone}
                          onChange={(e) => setEditForm({ ...editForm, emergencyPhone: e.target.value })}
                          className="w-full p-2 border border-border rounded bg-white text-xs focus:outline-none"
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
                      {activeActionModal.type === 'edit' ? 'Save Changes' : 'Confirm Onboard Employee'}
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
