"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  Building2, Users, Search, Filter, Plus, ChevronRight, FileDown, 
  Activity, FileText, Check, ExternalLink, Clock, BookOpen, AlertCircle, 
  Layers, Award, Shield, ShieldCheck, Calendar, DollarSign, MapPin, TrendingUp, 
  CheckCircle2, XCircle, AlertTriangle, ArrowUpRight, Send, Trash, Eye, 
  Download, Upload, Briefcase, Star, Edit, Lock, PlusCircle, UserCheck, 
  MoreVertical, RefreshCw
} from 'lucide-react';
import { organizationService } from '@/src/services/organization.service';
import { Organization, OrganizationDepartment, OrganizationCoordinator, OrganizationStudent, OrganizationProgram, OrganizationDocument, OrganizationTimelineEvent } from '@/src/data/mock-organizations';
import { useAuth } from '@/src/context/AuthContext';
import { Drawer } from '@/components/feature/ui/Drawer';

export default function OrganizationManagementPage() {
  const { user } = useAuth();
  
  // App views: dashboard, directory
  const [activeView, setActiveView] = useState<'dashboard' | 'directory'>('dashboard');
  
  // Data state
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selected colleges for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Drawer states
  const [activeProfile, setActiveProfile] = useState<Organization | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'departments' | 'coordinators' | 'students' | 'programs' | 'placements' | 'metadata' | 'timeline' | 'certificates'>('overview');
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  
  // Popovers & Modals
  const [showFilters, setShowFilters] = useState(false);
  const [activeActionModal, setActiveActionModal] = useState<{
    type: 'partnership' | 'coordinator' | 'department' | 'edit' | 'onboard' | 'notify' | 'bulkPartnership' | 'bulkCoordinator' | 'bulkNotify' | 'uploadDoc';
    orgId?: string;
  } | null>(null);
  
  // Filter state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLoc, setFilterLoc] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAccreditation, setFilterAccreditation] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Input fields for actions
  const [partnershipStatusInput, setPartnershipStatusInput] = useState<Organization['partnershipStatus']>('Active');
  const [coordinatorNameInput, setCoordinatorNameInput] = useState('');
  const [notifyMsg, setNotifyMsg] = useState('');
  
  // Department input form
  const [deptForm, setDeptForm] = useState({
    name: '',
    hod: '',
    studentsCount: 100,
    facultyCount: 10,
    internshipsCount: 50,
    placementRate: 90
  });

  // College details edit/onboard form
  const [collegeForm, setCollegeForm] = useState({
    name: '',
    code: '',
    type: 'Engineering',
    location: '',
    university: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    affiliation: '',
    accreditation: '',
    establishmentYear: 2000,
    naacGrade: 'A+',
    nbaStatus: 'Accredited' as Organization['nbaStatus'],
    autonomousStatus: 'Autonomous' as Organization['autonomousStatus'],
    nationalRanking: 50
  });

  // Leaderboard ranking toggle ('students' | 'internships' | 'placement' | 'completion')
  const [leaderboardMetric, setLeaderboardMetric] = useState<'students' | 'internships' | 'placement' | 'completion'>('students');

  // Active document preview in metadata center
  const [previewDoc, setPreviewDoc] = useState<OrganizationDocument | null>(null);
  const [docTypeInput, setDocTypeInput] = useState<OrganizationDocument['type']>('MoU');
  const [docNameInput, setDocNameInput] = useState('');

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load all organizations
  const loadOrganizations = async () => {
    setLoading(true);
    try {
      const data = await organizationService.getOrganizations();
      setOrganizations(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load institutions data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  // Sync activeProfile state from main array
  useEffect(() => {
    if (activeProfile) {
      const refreshed = organizations.find(o => o.id === activeProfile.id);
      if (refreshed) {
        setActiveProfile(refreshed);
      }
    }
  }, [organizations, activeProfile?.id]);

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

  // Filtered organizations calculation
  const filteredOrganizations = useMemo(() => {
    return organizations.filter(org => {
      const matchesSearch = 
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.coordinators.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        org.departments.some(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesLoc = filterLoc === 'all' ? true : org.location.includes(filterLoc);
      const matchesType = filterType === 'all' ? true : org.type === filterType;
      const matchesAccreditation = filterAccreditation === 'all' ? true : org.naacGrade === filterAccreditation;
      const matchesStatus = filterStatus === 'all' ? true : org.partnershipStatus === filterStatus;
      
      return matchesSearch && matchesLoc && matchesType && matchesAccreditation && matchesStatus;
    });
  }, [organizations, searchTerm, filterLoc, filterType, filterAccreditation, filterStatus]);

  // Strategic KPI indicators
  const kpiStats = useMemo(() => {
    const total = organizations.length;
    const active = organizations.filter(o => o.partnershipStatus === 'Active').length;
    const inactive = organizations.filter(o => o.partnershipStatus === 'Inactive' || o.partnershipStatus === 'Partnership Expired' || o.partnershipStatus === 'Blacklisted').length;
    
    let departmentsCount = 0;
    let coordinatorsCount = 0;
    let studentsCount = 0;
    let programsCount = 0;
    
    organizations.forEach(o => {
      departmentsCount += o.departments.length;
      coordinatorsCount += o.coordinators.length;
      studentsCount += o.students.length; // headcount/students
      programsCount += o.programs.length;
    });

    return { total, active, inactive, departmentsCount, coordinatorsCount, studentsCount, programsCount };
  }, [organizations]);

  // Combined Activities Feed
  const recentActivities = useMemo(() => {
    const events: { orgId: string; orgName: string; event: OrganizationTimelineEvent }[] = [];
    organizations.forEach(org => {
      org.timeline.forEach(t => {
        events.push({
          orgId: org.id,
          orgName: org.name,
          event: t
        });
      });
    });
    return events
      .sort((a, b) => new Date(b.event.date).getTime() - new Date(a.event.date).getTime())
      .slice(0, 10);
  }, [organizations]);

  // Leaders rankings for the dashboard
  const leaderboardColleges = useMemo(() => {
    return [...organizations].sort((a, b) => {
      if (leaderboardMetric === 'students') {
        return b.students.length - a.students.length;
      } else if (leaderboardMetric === 'internships') {
        let aCount = 0, bCount = 0;
        a.departments.forEach(d => aCount += d.internshipsCount);
        b.departments.forEach(d => bCount += d.internshipsCount);
        return bCount - aCount;
      } else if (leaderboardMetric === 'placement') {
        return b.placementAnalytics.placementPercentage - a.placementAnalytics.placementPercentage;
      } else {
        // Average programs completion rate
        const aAvg = a.programs.reduce((acc, curr) => acc + curr.analytics.completionRate, 0) / (a.programs.length || 1);
        const bAvg = b.programs.reduce((acc, curr) => acc + curr.analytics.completionRate, 0) / (b.programs.length || 1);
        return bAvg - aAvg;
      }
    }).slice(0, 5);
  }, [organizations, leaderboardMetric]);

  // Aggregate student distribution by department for dashboard chart
  const departmentDistribution = useMemo(() => {
    const dist: Record<string, number> = {
      'CSE': 0, 'IT': 0, 'AI & DS': 0, 'ECE': 0, 'EEE': 0, 'Mechanical': 0, 'Civil': 0, 'MBA': 0
    };
    organizations.forEach(org => {
      org.departments.forEach(dept => {
        const key = Object.keys(dist).find(k => dept.name.includes(k));
        if (key) {
          dist[key] += dept.studentsCount;
        } else {
          dist['CSE'] += dept.studentsCount; // fallback
        }
      });
    });
    return dist;
  }, [organizations]);

  // Type stats for dashboard distribution
  const typeStats = useMemo(() => {
    const counts: Record<string, number> = {};
    organizations.forEach(o => {
      counts[o.type] = (counts[o.type] || 0) + 1;
    });
    return counts;
  }, [organizations]);

  // Open college drawer
  const handleOpenProfile = (org: Organization) => {
    setActiveProfile(org);
    setProfileTab('overview');
    setIsProfileDrawerOpen(true);
    setPreviewDoc(null);
  };

  // Pre-fill forms for editing
  const openEditModal = (org: Organization) => {
    setCollegeForm({
      name: org.name,
      code: org.code,
      type: org.type,
      location: org.location,
      university: org.university,
      website: org.website,
      email: org.email,
      phone: org.phone,
      address: org.address,
      affiliation: org.affiliation,
      accreditation: org.accreditation,
      establishmentYear: org.establishmentYear,
      naacGrade: org.naacGrade,
      nbaStatus: org.nbaStatus,
      autonomousStatus: org.autonomousStatus,
      nationalRanking: org.nationalRanking
    });
    setActiveActionModal({ type: 'edit', orgId: org.id });
  };

  // Pre-fill fields for new entity onboarding
  const openOnboardModal = () => {
    setCollegeForm({
      name: '',
      code: '',
      type: 'Engineering',
      location: 'San Francisco, CA',
      university: 'State University Board',
      website: 'https://',
      email: '',
      phone: '+1 ',
      address: '',
      affiliation: 'State Board',
      accreditation: 'Accredited',
      establishmentYear: 2010,
      naacGrade: 'A+',
      nbaStatus: 'Accredited',
      autonomousStatus: 'Autonomous',
      nationalRanking: 100
    });
    setActiveActionModal({ type: 'onboard' });
  };

  // Handle single action execution forms
  const executeAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionModal) return;
    const { type, orgId } = activeActionModal;
    const targetId = orgId || activeProfile?.id;
    if (!targetId && type !== 'onboard') return;

    try {
      if (type === 'partnership') {
        const updated = await organizationService.updateOrganization(targetId!, { 
          partnershipStatus: partnershipStatusInput,
          status: (partnershipStatusInput === 'Active' || partnershipStatusInput === 'Pending Verification') ? 'Active' : 'Inactive'
        });
        if (updated) {
          updated.timeline.unshift({
            date: new Date().toISOString().split('T')[0],
            title: 'Partnership Updated',
            description: `Partnership status transitioned manually to: ${partnershipStatusInput}`,
            type: 'renewal'
          });
          setOrganizations(organizations.map(o => o.id === targetId ? { ...updated } : o));
          showToast(`Updated partnership status of ${updated.name} to ${partnershipStatusInput}`);
        }
      } else if (type === 'coordinator') {
        const updated = await organizationService.getOrganization(targetId!);
        if (updated) {
          const newCoord: OrganizationCoordinator = {
            id: `coord-${Date.now()}`,
            name: coordinatorNameInput,
            email: `${coordinatorNameInput.toLowerCase().replace(/\s+/g, '_')}@${updated.name.toLowerCase().replace(/\s+/g, '')}.edu`,
            phone: '+1 (555) 012-4859',
            department: 'Institutional Liaison',
            studentsManaged: 0,
            programsManaged: 0,
            status: 'Active',
            kpis: { applicationsProcessed: 0, attendanceApprovals: 0, internshipCompletions: 0, placementSuccess: 0 }
          };
          const coordinators = [...updated.coordinators, newCoord];
          const updatedOrg = await organizationService.updateOrganization(targetId!, { coordinators });
          if (updatedOrg) {
            updatedOrg.timeline.unshift({
              date: new Date().toISOString().split('T')[0],
              title: 'Coordinator Assigned',
              description: `Assigned new coordinator: ${coordinatorNameInput}`,
              type: 'coordinator'
            });
            setOrganizations(organizations.map(o => o.id === targetId ? { ...updatedOrg } : o));
            showToast(`Assigned ${coordinatorNameInput} as institutional coordinator.`);
          }
        }
      } else if (type === 'department') {
        const updated = await organizationService.getOrganization(targetId!);
        if (updated) {
          const newDept: OrganizationDepartment = {
            name: deptForm.name,
            hod: deptForm.hod,
            studentsCount: Number(deptForm.studentsCount),
            facultyCount: Number(deptForm.facultyCount),
            internshipsCount: Number(deptForm.internshipsCount),
            placementRate: Number(deptForm.placementRate),
            status: 'Active'
          };
          const departments = [...updated.departments, newDept];
          const updatedOrg = await organizationService.updateOrganization(targetId!, { departments });
          if (updatedOrg) {
            updatedOrg.timeline.unshift({
              date: new Date().toISOString().split('T')[0],
              title: 'Department Added',
              description: `Created new department organization node: ${deptForm.name}`,
              type: 'dept'
            });
            setOrganizations(organizations.map(o => o.id === targetId ? { ...updatedOrg } : o));
            showToast(`Created department ${deptForm.name} for ${updatedOrg.name}`);
          }
        }
      } else if (type === 'edit') {
        const updated = await organizationService.updateOrganization(targetId!, {
          name: collegeForm.name,
          code: collegeForm.code,
          type: collegeForm.type,
          location: collegeForm.location,
          university: collegeForm.university,
          website: collegeForm.website,
          email: collegeForm.email,
          phone: collegeForm.phone,
          address: collegeForm.address,
          affiliation: collegeForm.affiliation,
          accreditation: collegeForm.accreditation,
          establishmentYear: Number(collegeForm.establishmentYear),
          naacGrade: collegeForm.naacGrade,
          nbaStatus: collegeForm.nbaStatus,
          autonomousStatus: collegeForm.autonomousStatus,
          nationalRanking: Number(collegeForm.nationalRanking)
        });
        if (updated) {
          setOrganizations(organizations.map(o => o.id === targetId ? { ...updated } : o));
          showToast(`Updated institution profiles of ${updated.name}`);
        }
      } else if (type === 'onboard') {
        const newOrg = await organizationService.createOrganization({
          college_name: collegeForm.name,
          college_code: collegeForm.code,
          address_line_1: collegeForm.location,
          address_line_2: collegeForm.address,
          website_url: collegeForm.website,
          college_email: collegeForm.email,
          college_phone: collegeForm.phone,
          accreditation: collegeForm.accreditation,
          city: '',
          state: '',
          country: '',
          postal_code: '',
          status: 'ACTIVE'
        } as any);
        setOrganizations([...organizations, newOrg]);
        showToast(`Successfully onboarded institutional partner: ${newOrg.name}`);
      } else if (type === 'uploadDoc') {
        const updated = await organizationService.getOrganization(targetId!);
        if (updated) {
          const newDoc: OrganizationDocument = {
            type: docTypeInput,
            name: docNameInput || `${docTypeInput.toLowerCase().replace(/\s+/g, '_')}_document.pdf`,
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'Pending',
            version: 'v1.0',
            previewContent: `Accredited digital certificate copy scan uploaded for ${docTypeInput}. Verified checks pending.`
          };
          const docs = [...updated.documents, newDoc];
          const updatedOrg = await organizationService.updateOrganization(targetId!, { documents: docs });
          if (updatedOrg) {
            updatedOrg.timeline.unshift({
              date: new Date().toISOString().split('T')[0],
              title: 'Document Uploaded',
              description: `Uploaded security verification document: ${docTypeInput}`,
              type: 'mou'
            });
            setOrganizations(organizations.map(o => o.id === targetId ? { ...updatedOrg } : o));
            showToast(`Uploaded ${docTypeInput} document file.`);
          }
        }
      } else if (type === 'notify') {
        showToast(`System notification dispatched to coordinators of ${organizations.find(o => o.id === targetId)?.name}: "${notifyMsg}"`, 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to complete action', 'error');
    }
    setActiveActionModal(null);
  };

  // Bulk operation actions
  const executeBulkAction = async (type: 'partnership' | 'coordinator' | 'notify') => {
    if (selectedIds.length === 0) return;
    
    try {
      if (type === 'partnership') {
        await organizationService.bulkUpdatePartnership(selectedIds, partnershipStatusInput);
        setOrganizations(organizations.map(org => 
          selectedIds.includes(org.id) 
            ? { ...org, partnershipStatus: partnershipStatusInput, status: (partnershipStatusInput === 'Active' || partnershipStatusInput === 'Pending Verification') ? 'Active' : 'Inactive', timeline: [
                { date: new Date().toISOString().split('T')[0], title: 'Bulk Partnership Update', description: `Partnership status bulk-updated to ${partnershipStatusInput}`, type: 'renewal' },
                ...org.timeline
              ]} 
            : org
        ));
        showToast(`Bulk updated partnership status to ${partnershipStatusInput} for ${selectedIds.length} institutions`);
      } else if (type === 'coordinator') {
        await organizationService.bulkAssignCoordinator(selectedIds, coordinatorNameInput);
        setOrganizations(organizations.map(org => {
          if (selectedIds.includes(org.id)) {
            const newCoord = {
              id: `coord-${Date.now()}`,
              name: coordinatorNameInput,
              email: `${coordinatorNameInput.toLowerCase().replace(/\s+/g, '_')}@${org.name.toLowerCase().replace(/\s+/g, '')}.edu`,
              phone: '+1 (555) 012-3849',
              department: 'General Liaison',
              studentsManaged: 0,
              programsManaged: 0,
              status: 'Active' as const,
              kpis: { applicationsProcessed: 0, attendanceApprovals: 0, internshipCompletions: 0, placementSuccess: 0 }
            };
            return {
              ...org,
              coordinators: [...org.coordinators, newCoord],
              timeline: [
                { date: new Date().toISOString().split('T')[0], title: 'Coordinator Assigned', description: `Assigned new coordinator ${coordinatorNameInput} via bulk operations.`, type: 'coordinator' },
                ...org.timeline
              ]
            };
          }
          return org;
        }));
        showToast(`Bulk assigned coordinator ${coordinatorNameInput} to ${selectedIds.length} institutions`);
      } else if (type === 'notify') {
        showToast(`Bulk notification dispatched to ${selectedIds.length} selected institutions: "${notifyMsg}"`, 'info');
      }
      setSelectedIds([]);
      setActiveActionModal(null);
    } catch (err) {
      console.error(err);
      showToast('Error executing bulk operation', 'error');
    }
  };

  // Toggle checklist selectors
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const filteredIds = filteredOrganizations.map(o => o.id);
    const allSelected = filteredIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  // Document verification actions
  const handleVerifyDocument = async (orgId: string, docIndex: number, newStatus: 'Verified' | 'Rejected') => {
    const org = organizations.find(o => o.id === orgId);
    if (!org) return;

    const docs = [...org.documents];
    docs[docIndex] = {
      ...docs[docIndex],
      status: newStatus,
      verifiedBy: user?.name || 'Academic Administrator'
    };

    try {
      const updated = await organizationService.updateOrganization(orgId, { documents: docs });
      if (updated) {
        updated.timeline.unshift({
          date: new Date().toISOString().split('T')[0],
          title: 'Document Verified',
          description: `Accreditation document ${docs[docIndex].type} status set to ${newStatus}.`,
          type: 'mou'
        });
        setOrganizations(organizations.map(o => o.id === orgId ? { ...updated } : o));
        showToast(`MoU Document verified as ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Data Export of College Directory
  const handleExportData = () => {
    const headers = ['ID', 'College Name', 'Code', 'Type', 'University', 'Location', 'Students Count', 'Status'];
    const rows = organizations.map(org => [
      org.id,
      org.name,
      org.code,
      org.type,
      org.university,
      org.location,
      org.students.length,
      org.partnershipStatus
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "institutions_directory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Partnership directory CSV downloaded successfully');
  };

  return (
    <div className={`space-y-6 select-none ${
      (activeActionModal?.type === 'edit' || activeActionModal?.type === 'onboard') 
        ? 'h-[calc(100vh-80px)] overflow-hidden relative' 
        : 'animate-slide-in'
    }`}>
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-5 right-5 z-[9999] flex items-center gap-3 px-4 py-3 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl animate-bounce-in max-w-sm">
          {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <XCircle className="h-5 w-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <AlertCircle className="h-5 w-5 text-blue-400 shrink-0" />}
          <div className="text-xs font-semibold leading-relaxed">{toast.message}</div>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 bg-white/60 backdrop-blur-md sticky top-0 z-40">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Institutional Relations</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold">Academic Organizations</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight flex items-center gap-2">
            IRM Center
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">v1.2 (Executive)</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveView('dashboard')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'dashboard' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Executive Dashboard
            </button>
            <button 
              onClick={() => setActiveView('directory')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeView === 'directory' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              College Directory ({filteredOrganizations.length})
            </button>
          </div>

          <button 
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white rounded-lg text-xs font-bold text-slate-700 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>Export Chart</span>
          </button>
          
          <button 
            onClick={openOnboardModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Onboard College</span>
          </button>
        </div>
      </div>

      {/* ------------------ VIEW 1: EXECUTIVE DASHBOARD ------------------ */}
      {activeView === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* KPI Dashboard Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Colleges', val: kpiStats.total, icon: Building2, color: 'bg-blue-50 text-blue-600 border-blue-100', filter: { name: 'status', val: 'all' } },
              { label: 'Active Partnerships', val: kpiStats.active, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', filter: { name: 'status', val: 'Active' } },
              { label: 'Total Departments', val: kpiStats.departmentsCount, icon: Layers, color: 'bg-purple-50 text-purple-600 border-purple-100', filter: { name: 'status', val: 'all' } },
              { label: 'Coordinators Mapped', val: kpiStats.coordinatorsCount, icon: UserCheck, color: 'bg-indigo-50 text-indigo-600 border-indigo-100', filter: { name: 'status', val: 'all' } },
              { label: 'Active Students', val: kpiStats.studentsCount, icon: Users, color: 'bg-sky-50 text-sky-600 border-sky-100', filter: { name: 'status', val: 'all' } },
              { label: 'Internship Programs', val: kpiStats.programsCount, icon: Briefcase, color: 'bg-amber-50 text-amber-600 border-amber-100', filter: { name: 'status', val: 'all' } },
              { label: 'Inactive / Expired', val: kpiStats.inactive, icon: XCircle, color: 'bg-rose-50 text-rose-600 border-rose-100', filter: { name: 'status', val: 'Partnership Expired' } },
              { label: 'New This Month', val: 1, icon: Calendar, color: 'bg-slate-100 text-slate-800 border-slate-200', filter: { name: 'status', val: 'all' } }
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
                className="bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-xl p-4 shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="text-2xl font-black text-slate-800 tracking-tight">{kpi.val}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{kpi.label}</div>
                </div>
                <div className={`h-10 w-10 rounded-lg ${kpi.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>

          {/* Analytics Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Chart 1: College Distribution by Type & Departments */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Building2 className="h-4.5 w-4.5 text-blue-600" />
                Colleges by Category & Depts
              </h3>

              <div className="space-y-3">
                {[
                  { type: 'Engineering Colleges', count: typeStats['Engineering'] || 0, color: 'bg-blue-600' },
                  { type: 'Science Colleges', count: typeStats['Science'] || 0, color: 'bg-emerald-600' },
                  { type: 'Management Colleges', count: typeStats['Management'] || 0, color: 'bg-purple-600' },
                  { type: 'Arts Colleges', count: typeStats['Arts'] || 0, color: 'bg-amber-500' },
                  { type: 'Polytechnic Colleges', count: typeStats['Polytechnic'] || 0, color: 'bg-cyan-600' }
                ].map((item, index) => {
                  const percent = Math.round((item.count / organizations.length) * 100) || 0;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
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

              {/* Department Aggregations */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Student Enrolment by Course Node</div>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                  {Object.entries(departmentDistribution).map(([dept, count], idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-2 flex justify-between">
                      <span className="text-slate-500">{dept}</span>
                      <span className="text-slate-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 2: Top Colleges performance leaderboard */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <Award className="h-4.5 w-4.5 text-emerald-600" />
                  Top Colleges Leaderboard
                </h3>
                
                {/* Ranking toggle */}
                <select 
                  value={leaderboardMetric}
                  onChange={(e) => setLeaderboardMetric(e.target.value as any)}
                  className="text-[10px] font-bold border border-slate-200 rounded p-1 bg-white focus:outline-none"
                >
                  <option value="students">Student Count</option>
                  <option value="internships">Internships</option>
                  <option value="placement">Placement Rate</option>
                  <option value="completion">Completion Rate</option>
                </select>
              </div>

              <div className="divide-y divide-slate-100">
                {leaderboardColleges.map((org, index) => {
                  let scoreLabel = '';
                  if (leaderboardMetric === 'students') {
                    scoreLabel = `${org.students.length} Students`;
                  } else if (leaderboardMetric === 'internships') {
                    let totalInt = 0;
                    org.departments.forEach(d => totalInt += d.internshipsCount);
                    scoreLabel = `${totalInt} Internships`;
                  } else if (leaderboardMetric === 'placement') {
                    scoreLabel = `${org.placementAnalytics.placementPercentage}% Placement`;
                  } else {
                    const avgComp = Math.round(org.programs.reduce((acc, curr) => acc + curr.analytics.completionRate, 0) / (org.programs.length || 1));
                    scoreLabel = `${avgComp}% Completion`;
                  }

                  return (
                    <div 
                      key={org.id} 
                      onClick={() => handleOpenProfile(org)}
                      className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-black text-slate-400 w-4">{index + 1}</span>
                        <div className="h-7 w-7 rounded bg-slate-900 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                          {org.logo}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{org.name}</div>
                          <div className="text-[10px] text-slate-500 font-semibold">{org.location}</div>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-blue-600">{scoreLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 3: Coordinator Performance Scorecard */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Users className="h-4.5 w-4.5 text-indigo-600" />
                Coordinator Operational Performance
              </h3>

              <div className="max-h-[280px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {organizations.flatMap(o => o.coordinators.map(c => ({ collegeName: o.name, ...c }))).slice(0, 6).map((coord, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 leading-none">{coord.name}</div>
                        <div className="text-[9px] font-bold text-slate-400 mt-1">{coord.collegeName} ({coord.department})</div>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[8px] font-bold border border-emerald-100">
                        {coord.kpis.placementSuccess}% Success
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] font-bold text-slate-600 border-t border-slate-200/60 pt-1.5">
                      <div>
                        <div className="text-slate-900">{coord.studentsManaged}</div>
                        <div className="text-[7px] text-slate-400 uppercase">Managed</div>
                      </div>
                      <div>
                        <div className="text-slate-900">{coord.kpis.applicationsProcessed}</div>
                        <div className="text-[7px] text-slate-400 uppercase">Processed</div>
                      </div>
                      <div>
                        <div className="text-slate-900">{coord.programsManaged}</div>
                        <div className="text-[7px] text-slate-400 uppercase">Programs</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Combined Operations Activity Timeline */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-slate-800" />
              Partnership & Relationship timeline
            </h3>

            <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto pr-1">
              {recentActivities.map((act, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    const match = organizations.find(o => o.id === act.orgId);
                    if (match) handleOpenProfile(match);
                  }}
                  className="py-3 flex items-start gap-4 hover:bg-slate-50/50 px-2 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="h-8 w-8 rounded bg-slate-900 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0">
                    {act.orgName.split(' ').map(n => n[0]).join('').slice(0, 3)}
                  </div>
                  
                  <div className="flex-1 space-y-0.5 text-xs">
                    <div className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{act.orgName}</div>
                    <div className="text-slate-700 font-semibold leading-relaxed">
                      {act.event.title} — <span className="text-slate-500 font-normal">{act.event.description}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-bold shrink-0">{act.event.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------ VIEW 2: COLLEGE DIRECTORY ------------------ */}
      {activeView === 'directory' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Query search and advanced filter bars */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              
              {/* Search bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by name, code, dept, coordinator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Advanced filter toggle button */}
              <div className="flex items-center gap-2 justify-end w-full md:w-auto">
                {searchTerm || filterLoc !== 'all' || filterType !== 'all' || filterAccreditation !== 'all' || filterStatus !== 'all' ? (
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setFilterLoc('all');
                      setFilterType('all');
                      setFilterAccreditation('all');
                      setFilterStatus('all');
                      showToast('Cleared all active filters', 'info');
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline mr-2"
                  >
                    Clear Filters
                  </button>
                ) : null}

                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    showFilters 
                      ? 'border-blue-600 bg-blue-50/50 text-blue-600' 
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span>Advanced Filters</span>
                </button>
              </div>

            </div>

            {/* Filter expansion cards */}
            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100 animate-slide-down">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Office Location</label>
                  <select 
                    value={filterLoc} 
                    onChange={(e) => setFilterLoc(e.target.value)}
                    className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Locations</option>
                    {Array.from(new Set(organizations.map(o => o.location))).map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">College Type</label>
                  <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Science">Science</option>
                    <option value="Management">Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">NAAC Grade</label>
                  <select 
                    value={filterAccreditation} 
                    onChange={(e) => setFilterAccreditation(e.target.value)}
                    className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Grades</option>
                    <option value="A++">A++ Grade</option>
                    <option value="A+">A+ Grade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Partnership Status</label>
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Active">Active Partner</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Partnership Expired">Partnership Expired</option>
                    <option value="Blacklisted">Blacklisted</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Directory data table grid */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 w-8">
                      <input 
                        type="checkbox" 
                        checked={filteredOrganizations.length > 0 && filteredOrganizations.every(o => selectedIds.includes(o.id))}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3 font-bold text-slate-600">Logo</th>
                    <th className="px-4 py-3 font-bold text-slate-600">College Name</th>
                    <th className="px-4 py-3 font-bold text-slate-600">College Code</th>
                    <th className="px-4 py-3 font-bold text-slate-600">Institution Type</th>
                    <th className="px-4 py-3 font-bold text-slate-600">University Affiliation</th>
                    <th className="px-4 py-3 font-bold text-slate-600">Location</th>
                    <th className="px-4 py-3 font-bold text-slate-600">Departments</th>
                    <th className="px-4 py-3 font-bold text-slate-600">Students Enrolled</th>
                    <th className="px-4 py-3 font-bold text-slate-600">Coordinators</th>
                    <th className="px-4 py-3 font-bold text-slate-600">Partnership Status</th>
                    <th className="px-4 py-3 font-bold text-slate-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrganizations.length > 0 ? (
                    filteredOrganizations.map((org) => {
                      const isSelected = selectedIds.includes(org.id);
                      return (
                        <tr 
                          key={org.id} 
                          className={`hover:bg-slate-50/50 transition-colors cursor-pointer group ${
                            isSelected ? 'bg-blue-50/20' : ''
                          }`}
                          onClick={() => handleOpenProfile(org)}
                        >
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => toggleSelect(org.id)}
                              className="rounded border-slate-300 h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-7 w-7 rounded bg-slate-900 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0">
                              {org.logo}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{org.name}</div>
                            <div className="text-[10px] text-slate-500 font-semibold">{org.website}</div>
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-500">{org.code}</td>
                          <td className="px-4 py-3 text-slate-700 font-bold">{org.type}</td>
                          <td className="px-4 py-3 text-slate-500 font-medium">{org.university}</td>
                          <td className="px-4 py-3 text-slate-600 font-medium">{org.location}</td>
                          <td className="px-4 py-3 text-slate-800 font-bold">{org.departments.length}</td>
                          <td className="px-4 py-3 text-slate-800 font-bold">{org.students.length || org.headcount}</td>
                          <td className="px-4 py-3 text-slate-800 font-bold">{org.coordinators.length}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black ${
                              org.partnershipStatus === 'Active' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : org.partnershipStatus === 'Pending Verification'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : org.partnershipStatus === 'Partnership Expired'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {org.partnershipStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleOpenProfile(org)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 cursor-pointer"
                                title="Open Profile File"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                onClick={() => openEditModal(org)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 cursor-pointer"
                                title="Edit Organization"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={12} className="px-4 py-12 text-center text-slate-500 bg-white">
                        <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-600">No institutions match this search query</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ------------------ BULK ACTIONS PANEL ------------------ */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl px-6 py-4 flex flex-col md:flex-row items-center gap-4 animate-slide-up max-w-4xl w-[90%]">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white h-6 w-6 rounded-full flex items-center justify-center font-extrabold text-xs">
              {selectedIds.length}
            </div>
            <span className="text-xs font-bold">Colleges selected</span>
          </div>

          <div className="h-px md:h-6 w-full md:w-px bg-slate-800 my-1 md:my-0" />

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2.5 items-center justify-center w-full md:w-auto">
            <button 
              onClick={() => {
                setPartnershipStatusInput('Active');
                setActiveActionModal({ type: 'bulkPartnership' });
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              Bulk Change Status
            </button>
            
            <button 
              onClick={() => {
                setCoordinatorNameInput('');
                setActiveActionModal({ type: 'bulkCoordinator' });
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              Assign Coordinator
            </button>
            
            <button 
              onClick={() => {
                setNotifyMsg('');
                setActiveActionModal({ type: 'bulkNotify' });
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors text-blue-400"
            >
              Send Notification
            </button>

            <button 
              onClick={() => {
                showToast(`Requesting document verification from ${selectedIds.length} colleges`, 'info');
                setSelectedIds([]);
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors text-amber-400"
            >
              Request MoU renewal
            </button>
          </div>

          <button 
            onClick={() => setSelectedIds([])}
            className="text-xs font-bold text-slate-400 hover:text-white underline shrink-0 cursor-pointer ml-auto"
          >
            Cancel Selection
          </button>
        </div>
      )}

      {/* ------------------ PROFILE DRAWER (RIGHT PANEL SPLIT VIEW) ------------------ */}
      <Drawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        title="Institutional Command Center"
      >
        {activeProfile ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 text-slate-700 select-none">
            
            {/* STICKY ACCENTED ACTIONS PANEL */}
            <div className="bg-slate-900 text-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-lg border-b border-slate-800">
              
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center font-black text-lg shrink-0 shadow-md">
                  {activeProfile.logo}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white tracking-tight">{activeProfile.name}</h3>
                    <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold border border-slate-700">
                      {activeProfile.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-none mt-1 font-semibold">
                    {activeProfile.type} — <span className="text-slate-300 font-bold">{activeProfile.location}</span>
                  </p>
                </div>
              </div>

              {/* Sticky action buttons list */}
              <div className="flex items-center flex-wrap gap-2">
                <button 
                  onClick={() => openEditModal(activeProfile)}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-2.5 py-1.5 rounded text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  <span>Edit Info</span>
                </button>
                <button 
                  onClick={() => {
                    setPartnershipStatusInput(activeProfile.partnershipStatus);
                    setActiveActionModal({ type: 'partnership' });
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-2.5 py-1.5 rounded text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3 text-emerald-400" />
                  <span>Partnership</span>
                </button>
                <button 
                  onClick={() => {
                    setDeptForm({ name: '', hod: '', studentsCount: 120, facultyCount: 15, internshipsCount: 80, placementRate: 92 });
                    setActiveActionModal({ type: 'department' });
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-2.5 py-1.5 rounded text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center gap-1 text-purple-400"
                >
                  <PlusCircle className="h-3 w-3" />
                  <span>Add Dept</span>
                </button>
                <button 
                  onClick={() => {
                    setCoordinatorNameInput('');
                    setActiveActionModal({ type: 'coordinator' });
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-2.5 py-1.5 rounded text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center gap-1 text-sky-400"
                >
                  <UserCheck className="h-3 w-3" />
                  <span>Liaison</span>
                </button>
                <button 
                  onClick={() => {
                    setNotifyMsg('');
                    setActiveActionModal({ type: 'notify' });
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-2.5 py-1.5 rounded text-[11px] font-bold transition-all duration-150 cursor-pointer flex items-center gap-1 text-blue-400"
                >
                  <Send className="h-3 w-3" />
                  <span>Notify</span>
                </button>
                <button 
                  onClick={() => {
                    showToast(`Single College placement audit compiled & exported for ${activeProfile.name}`);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white p-1.5 rounded cursor-pointer"
                  title="Export Data Summary"
                >
                  <FileDown className="h-4 w-4" />
                </button>
              </div>

            </div>

            {/* TAB STRIP */}
            <div className="bg-white border-b border-slate-200 px-6 overflow-x-auto flex shrink-0 scrollbar-none">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'departments', label: 'Departments Management' },
                { id: 'coordinators', label: 'Coordinators & Staff' },
                { id: 'students', label: 'Student Relationships' },
                { id: 'programs', label: 'Internship Programs' },
                { id: 'placements', label: 'Placement Analytics' },
                { id: 'metadata', label: 'Metadata & MoU Center' },
                { id: 'timeline', label: 'Timeline log' },
                { id: 'certificates', label: 'Certificate Verification' }
              ].map((tab) => {
                const isActive = profileTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setProfileTab(tab.id as any)}
                    className={`py-3 px-4 font-bold text-xs border-b-2 transition-all shrink-0 cursor-pointer ${
                      isActive 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
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
                    
                    {/* Institutional Profile */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-blue-600" />
                        Institutional Information
                      </h4>
                      
                      <div className="divide-y divide-slate-100 text-xs font-semibold">
                        {[
                          { label: 'Official Name', val: activeProfile.name },
                          { label: 'Website Portal', val: activeProfile.website, isLink: true },
                          { label: 'Liaison Email', val: activeProfile.email },
                          { label: 'Registrar Phone', val: activeProfile.phone },
                          { label: 'Campus Address', val: activeProfile.address },
                          { label: 'Accrediting Board', val: activeProfile.affiliation }
                        ].map((row, idx) => (
                          <div key={idx} className="py-2.5 flex justify-between">
                            <span className="text-slate-500">{row.label}</span>
                            {row.isLink ? (
                              <a href={row.val} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-0.5">
                                {row.val}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              <span className="text-slate-900 text-right max-w-[60%] leading-relaxed">{row.val}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational performance snapshot */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-emerald-600" />
                        Performance Snapshot
                      </h4>

                      <div className="divide-y divide-slate-100 text-xs font-semibold">
                        {[
                          { label: 'Total Enrolled Students', val: activeProfile.students.length },
                          { label: 'Active Programs Count', val: activeProfile.programs.length },
                          { label: 'Placement Percentage', val: `${activeProfile.placementAnalytics.placementPercentage}%` },
                          { label: 'Course Completion Rate', val: `${Math.round(activeProfile.programs.reduce((acc, curr) => acc + curr.analytics.completionRate, 0) / (activeProfile.programs.length || 1))}%` },
                          { label: 'Assigned Coordinators', val: activeProfile.coordinators.length },
                          { label: 'Departments Count', val: activeProfile.departments.length }
                        ].map((row, idx) => (
                          <div key={idx} className="py-2.5 flex justify-between">
                            <span className="text-slate-500">{row.label}</span>
                            <span className="text-slate-900 font-extrabold">{row.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 2: DEPARTMENT MANAGEMENT */}
              {profileTab === 'departments' && (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                      Departments list
                    </h4>
                    
                    <button 
                      onClick={() => {
                        setDeptForm({ name: '', hod: '', studentsCount: 120, facultyCount: 15, internshipsCount: 80, placementRate: 92 });
                        setActiveActionModal({ type: 'department' });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-150 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Create Department</span>
                    </button>
                  </div>

                  {/* Departments Table */}
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Department Name</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Head of Department (HOD)</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Students Count</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Faculty Count</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Active Internships</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600 text-right">Placement Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeProfile.departments.length > 0 ? (
                          activeProfile.departments.map((dept, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3 font-bold text-slate-900">{dept.name}</td>
                              <td className="px-4 py-3 text-slate-600 font-semibold">{dept.hod}</td>
                              <td className="px-4 py-3 text-slate-800 font-bold">{dept.studentsCount}</td>
                              <td className="px-4 py-3 text-slate-500 font-medium">{dept.facultyCount}</td>
                              <td className="px-4 py-3 text-slate-500 font-medium">{dept.internshipsCount}</td>
                              <td className="px-4 py-3 text-right font-black text-blue-600">{dept.placementRate}%</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-slate-400 bg-white">
                              No departments configured for this college.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* TAB 3: COORDINATOR MANAGEMENT */}
              {profileTab === 'coordinators' && (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                      Institutional Coordinators
                    </h4>
                    
                    <button 
                      onClick={() => {
                        setCoordinatorNameInput('');
                        setActiveActionModal({ type: 'coordinator' });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-150 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Coordinator Liaison</span>
                    </button>
                  </div>

                  {/* Coordinators Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeProfile.coordinators.map((coord) => (
                      <div key={coord.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-extrabold text-slate-950 text-xs leading-none">{coord.name}</h5>
                            <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider">{coord.department}</p>
                          </div>
                          
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                            coord.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {coord.status}
                          </span>
                        </div>

                        <div className="text-[10px] font-semibold text-slate-500 space-y-1">
                          <div>Email: <span className="text-slate-800">{coord.email}</span></div>
                          <div>Phone: <span className="text-slate-800">{coord.phone}</span></div>
                        </div>

                        <div className="border-t border-slate-100 pt-3.5 grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                          <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5">
                            <div className="text-slate-900">{coord.studentsManaged}</div>
                            <div className="text-[8px] text-slate-400 uppercase mt-0.5">Students</div>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5">
                            <div className="text-slate-900">{coord.kpis.applicationsProcessed}</div>
                            <div className="text-[8px] text-slate-400 uppercase mt-0.5">Processed</div>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5">
                            <div className="text-emerald-600">{coord.kpis.placementSuccess}%</div>
                            <div className="text-[8px] text-slate-400 uppercase mt-0.5">Placement</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 4: STUDENT RELATIONSHIPS */}
              {profileTab === 'students' && (
                <div className="space-y-6 animate-fade-in">
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                    {[
                      { label: 'Total Students', val: activeProfile.students.length },
                      { label: 'Active Students', val: activeProfile.students.filter(s => s.status === 'Active').length },
                      { label: 'Completions', val: activeProfile.students.filter(s => s.status === 'Completed').length },
                      { label: 'Placement Ready', val: activeProfile.students.filter(s => s.status === 'Placement Ready').length },
                      { label: 'Placed Students', val: activeProfile.students.filter(s => s.status === 'Placed').length }
                    ].map((card, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                        <div className="text-lg font-black text-slate-950">{card.val}</div>
                        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">{card.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Students Table */}
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Student ID</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Student Name</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Department</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Academic Year</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Internship Program</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Status</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600 text-right">Liaison</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeProfile.students.length > 0 ? (
                          activeProfile.students.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3 font-mono font-bold text-slate-500">{student.id}</td>
                              <td className="px-4 py-3 font-bold text-slate-950">{student.name}</td>
                              <td className="px-4 py-3 text-slate-600 font-semibold">{student.department}</td>
                              <td className="px-4 py-3 text-slate-500 font-medium">Year {student.year}</td>
                              <td className="px-4 py-3 text-slate-500 font-medium">{student.program}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                                  student.status === 'Placed' 
                                    ? 'bg-emerald-50 text-emerald-700' 
                                    : student.status === 'Placement Ready'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}>
                                  {student.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right text-slate-500 font-semibold">{student.coordinatorName}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-4 py-6 text-center text-slate-400 bg-white">
                              No students registered to this institution account.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* TAB 5: INTERNSHIP PROGRAMS */}
              {profileTab === 'programs' && (
                <div className="space-y-6 animate-fade-in animate-slide-down">
                  
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                    University Placement Programs
                  </h4>

                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Program Course Name</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Duration</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Students Enrolled</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Program Status</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Completion Rate</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600">Attendance Health</th>
                          <th className="px-4 py-2.5 font-bold text-slate-600 text-right">Satisfaction</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeProfile.programs.length > 0 ? (
                          activeProfile.programs.map((prog, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                {prog.name}
                              </td>
                              <td className="px-4 py-3 text-slate-600 font-semibold">{prog.duration}</td>
                              <td className="px-4 py-3 text-slate-800 font-extrabold">{prog.enrolledCount}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  prog.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {prog.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-black text-slate-900">{prog.analytics.completionRate}%</td>
                              <td className="px-4 py-3 font-black text-slate-900">{prog.analytics.attendanceRate}%</td>
                              <td className="px-4 py-3 text-right font-bold text-amber-500 flex items-center justify-end gap-0.5">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                {prog.analytics.satisfactionScore} / 5
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-4 py-6 text-center text-slate-400 bg-white">
                              No active programs registered.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* TAB 6: PLACEMENT ANALYTICS */}
              {profileTab === 'placements' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Performance Indicators */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    {[
                      { label: 'Overall Placement Rate', val: `${activeProfile.placementAnalytics.placementPercentage}%`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50/40' },
                      { label: 'Students Placed Count', val: activeProfile.placementAnalytics.studentsPlaced, icon: Users, color: 'text-blue-600 bg-blue-50/40' },
                      { label: 'Hiring Partners', val: activeProfile.placementAnalytics.companiesParticipated, icon: Building2, color: 'text-purple-600 bg-purple-50/40' },
                      { label: 'Average Package LPA', val: activeProfile.placementAnalytics.avgPackage, icon: DollarSign, color: 'text-amber-600 bg-amber-50/40' }
                    ].map((kpi, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${kpi.color}`}>
                          <kpi.icon className="h-5 w-5" />
                        </div>
                        <div className="text-left leading-none">
                          <div className="text-lg font-black text-slate-900">{kpi.val}</div>
                          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mt-1">{kpi.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Placement Trend Chart & Company leaderboards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* SVG placement rate line chart */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                      <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Historical Placement Rate Trend</h5>
                      
                      <div className="h-44 w-full bg-slate-50 border border-slate-100 rounded-lg p-4 flex flex-col justify-between">
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold border-b border-slate-200 pb-1">
                          <span>Placement Rate (%)</span>
                          <span>Trend Range: 3 Years</span>
                        </div>
                        
                        <div className="relative flex-1 flex items-end justify-between px-6 pt-6">
                          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50 py-3">
                            <div className="border-b border-dashed border-slate-200 w-full" />
                            <div className="border-b border-dashed border-slate-200 w-full" />
                          </div>

                          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path 
                              d="M 10,85 L 50,60 L 90,30" 
                              fill="none" 
                              stroke="#10b981" 
                              strokeWidth="3" 
                              strokeLinecap="round"
                            />
                            <circle cx="10" cy="85" r="4" fill="#10b981" />
                            <circle cx="50" cy="60" r="4" fill="#10b981" />
                            <circle cx="90" cy="30" r="4" fill="#10b981" />
                          </svg>

                          {activeProfile.placementAnalytics.placementTrend.map((t, idx) => (
                            <div key={idx} className="z-10 flex flex-col items-center">
                              <span className="text-[10px] font-black text-slate-900 bg-white border border-slate-200 rounded px-1 shadow-sm mb-1">{t.rate}%</span>
                              <span className="text-[10px] font-bold text-slate-400">{t.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Company hire table */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                      <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Top Recruiter Companies</h5>
                      
                      <div className="divide-y divide-slate-100">
                        {activeProfile.placementAnalytics.companyHiring.map((c, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-900 font-extrabold">{c.companyName}</span>
                            <div className="flex gap-4">
                              <span className="text-slate-500">{c.hiredCount} Hired</span>
                              <span className="text-blue-600 font-black">{c.avgPackage}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 7: METADATA CENTER & MOU DOCUMENTS */}
              {profileTab === 'metadata' && (
                <div className="space-y-6 animate-fade-in animate-slide-down">
                  
                  {/* Accreditation indicators */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-blue-600" />
                      Accreditation Parameters
                    </h4>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-[10px] text-slate-400 uppercase mb-0.5">NAAC Grade Rating</div>
                        <div className="text-slate-900 font-black text-lg">{activeProfile.naacGrade}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-[10px] text-slate-400 uppercase mb-0.5">NBA Accreditation</div>
                        <div className="text-slate-900 font-black text-sm">{activeProfile.nbaStatus}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-[10px] text-slate-400 uppercase mb-0.5">Autonomy Status</div>
                        <div className="text-slate-900 font-black text-sm">{activeProfile.autonomousStatus}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-[10px] text-slate-400 uppercase mb-0.5">National Ranking</div>
                        <div className="text-blue-600 font-black text-lg">#{activeProfile.nationalRanking}</div>
                      </div>
                    </div>
                  </div>

                  {/* MoU Document Center */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-purple-600" />
                        Accredited documents (MoUs)
                      </h4>
                      
                      <button 
                        onClick={() => {
                          setDocTypeInput('MoU');
                          setDocNameInput('');
                          setActiveActionModal({ type: 'uploadDoc' });
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Upload MoU File
                      </button>
                    </div>

                    {/* MoU Documents Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeProfile.documents.map((doc, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setPreviewDoc(doc)}
                          className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-4 flex flex-col justify-between h-36 cursor-pointer shadow-sm transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <FileText className="h-8 w-8 text-purple-500 shrink-0" />
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                              doc.status === 'Verified' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : doc.status === 'Rejected'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {doc.status}
                            </span>
                          </div>

                          <div className="mt-2.5">
                            <h6 className="font-extrabold text-xs text-slate-900 leading-none">{doc.type}</h6>
                            <p className="text-[10px] text-slate-500 mt-1 truncate">{doc.name}</p>
                          </div>

                          <div className="border-t border-slate-100 pt-2 flex justify-between text-[9px] font-semibold text-slate-400 mt-2">
                            <span>Uploaded: {doc.uploadDate}</span>
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                              {doc.status !== 'Verified' && (
                                <button 
                                  onClick={() => handleVerifyDocument(activeProfile.id, idx, 'Verified')}
                                  className="text-emerald-600 hover:text-emerald-700 cursor-pointer font-bold"
                                >
                                  Verify
                                </button>
                              )}
                              {doc.status !== 'Rejected' && (
                                <button 
                                  onClick={() => handleVerifyDocument(activeProfile.id, idx, 'Rejected')}
                                  className="text-rose-600 hover:text-rose-700 cursor-pointer font-bold"
                                >
                                  Reject
                                </button>
                              )}
                              <a 
                                href="#" 
                                onClick={e => {
                                  e.preventDefault();
                                  showToast(`Downloading: ${doc.name}`);
                                }}
                                className="text-slate-500 hover:text-slate-800"
                              >
                                Download
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Previews */}
                    {previewDoc && (
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-inner text-white animate-slide-down">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3">
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">MoU Workspace Previews</div>
                            <h5 className="font-extrabold text-sm text-blue-400">{previewDoc.type} — {previewDoc.name}</h5>
                          </div>
                          <button 
                            onClick={() => setPreviewDoc(null)}
                            className="text-xs font-bold text-slate-400 hover:text-white underline cursor-pointer"
                          >
                            Close Workspace
                          </button>
                        </div>
                        
                        <div className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-lg border border-slate-900 min-h-[100px] leading-relaxed whitespace-pre-wrap">
                          {previewDoc.previewContent || `Digital MoU validation check. Academic credentials audit log signature matched.`}
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              )}

              {/* TAB 8: PARTNERSHIP TIMELINE */}
              {profileTab === 'timeline' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-lg mb-1 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      Interaction Timeline
                    </h3>      
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                    Partnership Timeline Audit Log
                  </h4>

                  <div className="relative border-l-2 border-slate-200 pl-6 space-y-6 ml-2 py-2">
                    {activeProfile.timeline.map((evt, idx) => (
                      <div key={idx} className="relative">
                        
                        <div className={`absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-white flex items-center justify-center ${
                          evt.type === 'added' ? 'bg-blue-600' :
                          evt.type === 'mou' ? 'bg-purple-600' :
                          evt.type === 'coordinator' ? 'bg-sky-500' :
                          evt.type === 'dept' ? 'bg-emerald-500' :
                          evt.type === 'program' ? 'bg-amber-500' :
                          evt.type === 'placement' ? 'bg-indigo-600' :
                          'bg-slate-400'
                        }`} />
                        
                        <div className="text-xs">
                          <span className="font-mono font-bold text-slate-400">{evt.date}</span>
                          <h5 className="font-extrabold text-slate-900 mt-0.5">{evt.title}</h5>
                          <p className="text-slate-600 mt-0.5 font-medium leading-relaxed">
                            {evt.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )}

              {/* TAB 9: CERTIFICATES & VERIFICATION */}
              {profileTab === 'certificates' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center justify-center py-12">
                    <ShieldCheck className="w-16 h-16 text-indigo-200 mb-4" />
                    <h3 className="font-bold text-slate-800 text-lg mb-1">Verify Student Certificates</h3>
                    <p className="text-xs text-slate-500 max-w-md">Enter the Verification Code (Hash Number) found on the student's certificate to instantly verify its authenticity on the network.</p>
                    <div className="flex gap-3 mt-6">
                      <a 
                        href="/feature/college-certificates" 
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <Award className="w-4 h-4" /> College Certificate Dashboard
                      </a>
                      <a 
                        href="/verify" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Search className="w-4 h-4" /> Public Verification Portal
                      </a>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Select an institution account from the directory to inspect.
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
              : 'border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full animate-bounce-in'
          }`}>
            
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                {activeActionModal.type === 'partnership' && 'Configure Partnership Status'}
                {activeActionModal.type === 'coordinator' && 'Map New Coordinator Liaison'}
                {activeActionModal.type === 'department' && 'Create Academic Department'}
                {activeActionModal.type === 'edit' && 'Edit College Information'}
                {activeActionModal.type === 'onboard' && 'Onboard New Partner College'}
                {activeActionModal.type === 'notify' && 'Dispatch System Notification'}
                {activeActionModal.type === 'uploadDoc' && 'Upload Institutional Documents'}
                
                {/* Bulk actions */}
                {activeActionModal.type === 'bulkPartnership' && 'Bulk Partnership Status Update'}
                {activeActionModal.type === 'bulkCoordinator' && 'Bulk Map Coordinator Liaison'}
                {activeActionModal.type === 'bulkNotify' && 'Bulk Dispatch Notifications'}
              </h3>
              
              <button 
                onClick={() => setActiveActionModal(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>

            {/* Forms body */}
            <form 
              onSubmit={executeAction} 
              className={`text-xs font-semibold text-slate-700 flex flex-col min-h-0 ${
                (activeActionModal.type === 'edit' || activeActionModal.type === 'onboard') 
                  ? 'p-8 space-y-6 flex-1 h-full justify-between' 
                  : 'p-6 space-y-4'
              }`}
            >
              
              {/* Form 1: Partnership status */}
              {(activeActionModal.type === 'partnership' || activeActionModal.type === 'bulkPartnership') && (
                <div className="space-y-3">
                  <label className="block text-slate-500">Configure Institutional Partnership Status</label>
                  <select
                    value={partnershipStatusInput}
                    onChange={(e) => setPartnershipStatusInput(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Active">Active Partner</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Partnership Expired">Partnership Term Expired</option>
                    <option value="Blacklisted">Blacklisted Entity</option>
                  </select>
                  
                  {activeActionModal.type === 'bulkPartnership' ? (
                    <button 
                      type="button"
                      onClick={() => executeBulkAction('partnership')}
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                    >
                      Apply Bulk Status Change ({selectedIds.length} colleges)
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                    >
                      Save Partnership Status
                    </button>
                  )}
                </div>
              )}

              {/* Form 2: Coordinator Liaison assignment */}
              {(activeActionModal.type === 'coordinator' || activeActionModal.type === 'bulkCoordinator') && (
                <div className="space-y-3">
                  <label className="block text-slate-500">Name of Coordinator Liaison</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Richard Feynman"
                    value={coordinatorNameInput}
                    onChange={(e) => setCoordinatorNameInput(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
                  />
                  
                  {activeActionModal.type === 'bulkCoordinator' ? (
                    <button 
                      type="button"
                      onClick={() => executeBulkAction('coordinator')}
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                    >
                      Map Liaison to Selected ({selectedIds.length} colleges)
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                    >
                      Confirm Mapping
                    </button>
                  )}
                </div>
              )}

              {/* Form 3: Notification dispatcher */}
              {(activeActionModal.type === 'notify' || activeActionModal.type === 'bulkNotify') && (
                <div className="space-y-3">
                  <label className="block text-slate-500">System Notification Content Message</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Dispatches global notifications to institutional coordinators..."
                    value={notifyMsg}
                    onChange={(e) => setNotifyMsg(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none text-xs font-semibold leading-relaxed"
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

              {/* Form 4: Add Department */}
              {activeActionModal.type === 'department' && (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  <div className="space-y-1">
                    <label className="block text-slate-500">Department Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Mechanical Engineering"
                      value={deptForm.name}
                      onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded focus:outline-none"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-slate-500">Head of Department (HOD)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Dr. Jane Smith"
                      value={deptForm.hod}
                      onChange={(e) => setDeptForm({ ...deptForm, hod: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-slate-500">Student Intake Count</label>
                      <input 
                        type="number" 
                        required
                        value={deptForm.studentsCount}
                        onChange={(e) => setDeptForm({ ...deptForm, studentsCount: Number(e.target.value) })}
                        className="w-full p-2 border border-slate-200 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-slate-500">Faculty Intake Count</label>
                      <input 
                        type="number" 
                        required
                        value={deptForm.facultyCount}
                        onChange={(e) => setDeptForm({ ...deptForm, facultyCount: Number(e.target.value) })}
                        className="w-full p-2 border border-slate-200 rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-slate-500">Active Internships</label>
                      <input 
                        type="number" 
                        required
                        value={deptForm.internshipsCount}
                        onChange={(e) => setDeptForm({ ...deptForm, internshipsCount: Number(e.target.value) })}
                        className="w-full p-2 border border-slate-200 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-slate-500">Placement Target Rate (%)</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        max="100"
                        value={deptForm.placementRate}
                        onChange={(e) => setDeptForm({ ...deptForm, placementRate: Number(e.target.value) })}
                        className="w-full p-2 border border-slate-200 rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-2 cursor-pointer"
                  >
                    Create Department Node
                  </button>
                </div>
              )}

              {/* Form 5: Document Upload */}
              {activeActionModal.type === 'uploadDoc' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-slate-500">Accreditation Document Category</label>
                    <select
                      value={docTypeInput}
                      onChange={(e) => setDocTypeInput(e.target.value as any)}
                      className="w-full p-2 border border-slate-200 rounded bg-white focus:outline-none"
                    >
                      <option value="MoU">MoU Agreement</option>
                      <option value="Partnership Agreement">Partnership Contract</option>
                      <option value="Approval Letter">Approval Affiliation Letter</option>
                      <option value="College Brochure">Institutional Brochure</option>
                      <option value="Accreditation Certificates">NAAC/NBA Certificate</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-500">Filename (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. affiliation_certificate_2026.pdf"
                      value={docNameInput}
                      onChange={(e) => setDocNameInput(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded focus:outline-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold shadow transition-all mt-4 cursor-pointer"
                  >
                    Confirm MoU Registration
                  </button>
                </div>
              )}

              {/* Form 6 & 7: Onboard / Edit Institution details */}
              {(activeActionModal.type === 'edit' || activeActionModal.type === 'onboard') && (
                <div className="space-y-6 max-w-5xl mx-auto w-full flex-1 flex flex-col justify-start overflow-hidden pt-4">
                  
                  {/* Section 1 */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                      Section 1: College Registry Info
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="block text-slate-500 text-[10px]">College Name</label>
                        <input 
                          type="text" 
                          required
                          value={collegeForm.name}
                          onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 text-[10px]">Unique Code</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. MIT"
                          value={collegeForm.code}
                          onChange={(e) => setCollegeForm({ ...collegeForm, code: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 text-[10px]">Institution Type</label>
                        <select 
                          value={collegeForm.type}
                          onChange={(e) => setCollegeForm({ ...collegeForm, type: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded bg-white text-xs focus:outline-none"
                        >
                          <option value="Engineering">Engineering College</option>
                          <option value="Science">Science College</option>
                          <option value="Management">Management College</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 text-[10px]">University Affiliation</label>
                        <input 
                          type="text" 
                          required
                          value={collegeForm.university}
                          onChange={(e) => setCollegeForm({ ...collegeForm, university: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 text-[10px]">Campus Location</label>
                        <input 
                          type="text" 
                          required
                          value={collegeForm.location}
                          onChange={(e) => setCollegeForm({ ...collegeForm, location: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 text-[10px]">Establishment Year</label>
                        <input 
                          type="number" 
                          required
                          value={collegeForm.establishmentYear}
                          onChange={(e) => setCollegeForm({ ...collegeForm, establishmentYear: Number(e.target.value) })}
                          className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                      Section 2: Accreditations & Rankings
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="block text-slate-500 text-[10px]">NAAC Grade</label>
                        <input 
                          type="text" 
                          value={collegeForm.naacGrade}
                          onChange={(e) => setCollegeForm({ ...collegeForm, naacGrade: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 text-[10px]">National Ranking</label>
                        <input 
                          type="number" 
                          value={collegeForm.nationalRanking}
                          onChange={(e) => setCollegeForm({ ...collegeForm, nationalRanking: Number(e.target.value) })}
                          className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 text-[10px]">NBA Status</label>
                        <select 
                          value={collegeForm.nbaStatus}
                          onChange={(e) => setCollegeForm({ ...collegeForm, nbaStatus: e.target.value as any })}
                          className="w-full p-2 border border-slate-200 rounded bg-white text-xs focus:outline-none"
                        >
                          <option value="Accredited">Accredited</option>
                          <option value="Not Accredited">Not Accredited</option>
                          <option value="Applied">Applied for Accreditation</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 text-[10px]">Autonomous Status</label>
                        <select 
                          value={collegeForm.autonomousStatus}
                          onChange={(e) => setCollegeForm({ ...collegeForm, autonomousStatus: e.target.value as any })}
                          className="w-full p-2 border border-slate-200 rounded bg-white text-xs focus:outline-none"
                        >
                          <option value="Autonomous">Autonomous</option>
                          <option value="Affiliated">Affiliated</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                      Section 3: Communication & Address
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="block text-slate-500 text-[10px]">Website Portal</label>
                        <input 
                          type="url" 
                          required
                          value={collegeForm.website}
                          onChange={(e) => setCollegeForm({ ...collegeForm, website: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 text-[10px]">Registrar Email</label>
                        <input 
                          type="email" 
                          required
                          value={collegeForm.email}
                          onChange={(e) => setCollegeForm({ ...collegeForm, email: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 text-[10px]">Contact Phone</label>
                        <input 
                          type="text" 
                          required
                          value={collegeForm.phone}
                          onChange={(e) => setCollegeForm({ ...collegeForm, phone: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 text-[10px]">Affiliation Accreditation</label>
                        <input 
                          type="text" 
                          required
                          value={collegeForm.affiliation}
                          onChange={(e) => setCollegeForm({ ...collegeForm, affiliation: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="block text-slate-500 text-[10px]">Campus Address</label>
                        <input 
                          type="text" 
                          required
                          value={collegeForm.address}
                          onChange={(e) => setCollegeForm({ ...collegeForm, address: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none"
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
                      {activeActionModal.type === 'edit' ? 'Save College Details' : 'Confirm College Registration'}
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
