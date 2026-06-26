"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { 
  FileText, Search, Filter, Plus, ChevronRight, Briefcase, User, 
  CheckCircle2, XCircle, AlertTriangle, TrendingUp, Download, 
  ExternalLink, FileSpreadsheet, Check, Users, BarChart3, 
  Sparkles, MapPin, GraduationCap, Eye, BookOpen, AlertCircle, Layers
} from 'lucide-react';
import { applicationService } from '@/src/services/application.service';
import { Application, ApplicationStatus } from '@/src/data/mock-applications';
import { opportunitiesService } from '@/src/services/opportunities.service';
import { Opportunity } from '@/src/data/mock-opportunities';
import { AddCandidateDrawer } from '@/components/admin/application/AddCandidateDrawer';
import { Drawer } from '@/components/admin/ui/Drawer';
import { useRouter } from 'next/navigation';
import { PermissionGuard } from '@/components/admin/ui/PermissionGuard';

type TabType = 'dashboard' | 'applications' | 'pipeline' | 'reports';

export default function ApplicationPage() {
  const router = useRouter();

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('applications');
  
  // Data State
  const [applications, setApplications] = useState<Application[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reviewApp, setReviewApp] = useState<Application | null>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  
  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [showFiltersPopover, setShowFiltersPopover] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCgpa, setFilterCgpa] = useState<string>('all');
  const [filterReviewer, setFilterReviewer] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [filterCollege, setFilterCollege] = useState<string>('all');

  // Evaluation Workspace State
  const [techScore, setTechScore] = useState<number>(5);
  const [commScore, setCommScore] = useState<number>(5);
  const [acadScore, setAcadScore] = useState<number>(5);
  const [cultureScore, setCultureScore] = useState<number>(5);
  const [overallRec, setOverallRec] = useState<string>('Hold');
  const [notesText, setNotesText] = useState<string>('');
  const [feedbackText, setFeedbackText] = useState<string>('');
  
  // Bulk actions popups
  const [bulkReviewerName, setBulkReviewerName] = useState('');
  const [showBulkReviewerInput, setShowBulkReviewerInput] = useState(false);

  // Resume Fullscreen State
  const [showResumeFullScreen, setShowResumeFullScreen] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; title: string; message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerToast = (title: string, message: string, type: 'success' | 'info' | 'warning') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, title, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Load Data
  const loadData = React.useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const appData = await applicationService.getApplications();
      const oppData = await opportunitiesService.getOpportunities();
      setApplications([...appData]);
      setOpportunities(oppData);
    } catch (err) {
      console.error('Failed to load applications data', err);
      triggerToast('Error', 'Failed to retrieve application records.', 'warning');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        loadData(true);
      }
    });
    return () => {
      isMounted = false;
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [loadData]);

  // Handle opening review workspace
  const handleOpenReview = (app: Application) => {
    setReviewApp(app);
    setTechScore(app.technicalScore || 5);
    setCommScore(app.communicationScore || 5);
    setAcadScore(app.academicScore || 5);
    setCultureScore(app.cultureFitScore || 5);
    setOverallRec(app.overallRecommendation || 'Hold');
    setNotesText(app.reviewerNotes || '');
    setFeedbackText(app.reviewerFeedback || '');
  };

  // Handle Scorecard submission
  const handleSaveEvaluation = async () => {
    if (!reviewApp) return;
    try {
      const avgScore = Math.round((techScore + commScore + acadScore + cultureScore) * 2.5); // normalized to 100
      const updates = {
        technicalScore: techScore,
        communicationScore: commScore,
        academicScore: acadScore,
        cultureFitScore: cultureScore,
        reviewScore: avgScore,
        overallRecommendation: overallRec as Application['overallRecommendation'],
        reviewerNotes: notesText,
        reviewerFeedback: feedbackText
      };
      
      const updated = await applicationService.updateApplicationDetails(reviewApp.id, updates);
      if (updated) {
        setReviewApp(updated);
        // Refresh local cache
        setApplications(applications.map(a => a.id === reviewApp.id ? updated : a));
        triggerToast('Evaluation Saved', `Successfully updated review score for ${reviewApp.candidateName}.`, 'success');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error', 'Failed to save candidate evaluation details.', 'warning');
    }
  };

  // Quick Action Buttons
  const handleQuickStatus = async (id: string, status: ApplicationStatus) => {
    try {
      const updated = await applicationService.updateApplicationStatus(id, status);
      if (updated) {
        setApplications(applications.map(a => a.id === id ? updated : a));
        if (reviewApp && reviewApp.id === id) {
          setReviewApp(updated);
        }
        triggerToast('Status Updated', `Candidate is now set to ${status}.`, 'success');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error', 'Failed to update pipeline stage.', 'warning');
    }
  };

  const handleApproveAndCreateUser = async (app: Application) => {
    try {
      const updated = await applicationService.updateApplicationStatus(app.id, 'Selected');
      if (updated) {
        setApplications(applications.map(a => a.id === app.id ? updated : a));
        if (reviewApp && reviewApp.id === app.id) {
          setReviewApp(updated);
        }
        triggerToast('Candidate Approved', 'Directing to system user account creation workspace.', 'success');
        router.push(`/admin/users?autofill=true&name=${encodeURIComponent(app.candidateName)}&email=${encodeURIComponent(app.email)}&phone=${encodeURIComponent(app.phone)}`);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error', 'Failed to approve candidate application.', 'warning');
    }
  };

  // Payment Quick Actions
  const handlePaymentVerification = async (id: string, verify: 'Verified' | 'Rejected') => {
    try {
      const statusUpdate: ApplicationStatus = verify === 'Verified' ? 'Under Review' : 'Hold';
      const updates = {
        paymentVerified: verify,
        status: statusUpdate
      };
      const updated = await applicationService.updateApplicationDetails(id, updates);
      if (updated) {
        setApplications(applications.map(a => a.id === id ? updated : a));
        if (reviewApp && reviewApp.id === id) {
          setReviewApp(updated);
        }
        triggerToast('Payment Processed', `Payment verified as: ${verify}. Status set to ${statusUpdate}.`, 'success');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error', 'Failed to change payment check.', 'warning');
    }
  };

  // Bulk Operations
  const handleBulkStatus = async (status: ApplicationStatus) => {
    if (selectedIds.length === 0) return;
    try {
      await applicationService.bulkUpdateStatus(selectedIds, status);
      setApplications(applications.map(app => 
        selectedIds.includes(app.id) ? { ...app, status } : app
      ));
      setSelectedIds([]);
      triggerToast('Bulk Status Success', `Moved ${selectedIds.length} candidates to ${status}.`, 'success');
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkAssign = async () => {
    if (selectedIds.length === 0 || !bulkReviewerName.trim()) return;
    try {
      await applicationService.bulkAssignReviewer(selectedIds, bulkReviewerName.trim());
      setApplications(applications.map(app => 
        selectedIds.includes(app.id) ? { ...app, assignedReviewer: bulkReviewerName.trim() } : app
      ));
      setSelectedIds([]);
      setBulkReviewerName('');
      setShowBulkReviewerInput(false);
      triggerToast('Bulk Assignment Success', `Assigned ${selectedIds.length} candidates to ${bulkReviewerName}.`, 'success');
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Applications Calculation
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (app.researchArea && app.researchArea.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = filterType === 'all' ? true : app.internshipType === filterType;
      const matchesStatus = filterStatus === 'all' ? true : app.status === filterStatus;
      const matchesReviewer = filterReviewer === 'all' ? true : app.assignedReviewer === filterReviewer;
      const matchesCollege = filterCollege === 'all' ? true : app.college === filterCollege;
      
      let matchesCgpa = true;
      if (filterCgpa === '9+') matchesCgpa = app.cgpa >= 9.0;
      else if (filterCgpa === '8-9') matchesCgpa = app.cgpa >= 8.0 && app.cgpa < 9.0;
      else if (filterCgpa === 'sub8') matchesCgpa = app.cgpa < 8.0;

      let matchesPayment = true;
      if (filterPayment === 'verified') matchesPayment = app.paymentVerified === 'Verified';
      else if (filterPayment === 'pending') matchesPayment = app.paymentVerified === 'Pending';
      else if (filterPayment === 'rejected') matchesPayment = app.paymentVerified === 'Rejected';

      return matchesSearch && matchesType && matchesStatus && matchesCgpa && matchesReviewer && matchesPayment && matchesCollege;
    });
  }, [applications, searchTerm, filterType, filterStatus, filterCgpa, filterReviewer, filterPayment, filterCollege]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => a.status === 'New' || a.status === 'Under Review' || a.status === 'Pending').length;
    const shortlisted = applications.filter(a => a.status === 'Shortlisted').length;
    const interviews = applications.filter(a => a.status === 'Interview Scheduled' || a.status === 'Interview').length;
    const selected = applications.filter(a => a.status === 'Selected' || a.status === 'Accepted').length;
    const rejected = applications.filter(a => a.status === 'Rejected').length;
    
    // Calculate applications by type
    const types: Record<string, number> = {};
    applications.forEach(a => {
      types[a.internshipType] = (types[a.internshipType] || 0) + 1;
    });

    // Calculate applications by college
    const colleges: Record<string, number> = {};
    applications.forEach(a => {
      colleges[a.college] = (colleges[a.college] || 0) + 1;
    });

    // Skills aggregation
    const skills: Record<string, number> = {};
    applications.forEach(a => {
      a.skills.forEach(s => {
        skills[s] = (skills[s] || 0) + 1;
      });
    });
    const topSkills = Object.entries(skills)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return {
      total,
      pending,
      shortlisted,
      interviews,
      selected,
      rejected,
      types,
      colleges,
      topSkills
    };
  }, [applications]);

  // Unique reviewers & colleges for filter options
  const filterOptions = useMemo(() => {
    const reviewers = Array.from(new Set(applications.map(a => a.assignedReviewer))).filter(Boolean);
    const colleges = Array.from(new Set(applications.map(a => a.college))).filter(Boolean);
    return { reviewers, colleges };
  }, [applications]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"></div>
          <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading Recruitment System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in min-h-[calc(100vh-120px)] pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3.5 shadow-2xl animate-slide-in ring-1 ring-black/5 max-w-sm">
          <div className={`p-1.5 rounded-lg shrink-0 ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
            toast.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> :
             toast.type === 'warning' ? <AlertTriangle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 leading-snug">{toast.title}</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Main Page Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>Recruitment Lifecycle</span>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <span className="text-blue-600 font-extrabold">Applications Workspace</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">Intern Pipeline Hub</h2>
            <p className="text-xs text-slate-500 mt-1">
              Linear-styled candidate evaluation dashboard with real-time analytics, Kanban views, and scorecard controls.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <PermissionGuard required="application.review">
              <button 
                onClick={() => setIsAddDrawerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Candidate</span>
              </button>
            </PermissionGuard>
            <PermissionGuard required="application.export">
              <button 
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8,ID,Name,College,Type,Status,CGPA\n" + 
                    applications.map(a => `"${a.id}","${a.candidateName}","${a.college}","${a.internshipType}","${a.status}",${a.cgpa}`).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", `applications_report_${new Date().toISOString().split('T')[0]}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  triggerToast('Export Complete', 'Exported applications database to CSV successfully.', 'success');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
            </PermissionGuard>
          </div>
        </div>

        {/* Dashboard Sub Tabs Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-100/70 border border-slate-200/50 p-1.5 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              Dashboard Overview
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'applications' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Applications Table
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('pipeline')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pipeline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              Kanban Pipeline
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'reports' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              Funnel Reports
            </span>
          </button>
        </div>
      </div>

      {/* VIEW 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-slide-in">
          {/* KPI grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[96px] hover:border-slate-300 transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Active</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-800">{stats.total}</span>
                <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-black">Apps</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[96px] hover:border-slate-300 transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Review</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-800">{stats.pending}</span>
                <span className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-black">In Queue</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[96px] hover:border-slate-300 transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shortlisted</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-800">{stats.shortlisted}</span>
                <span className="text-[9px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-black">Cleared</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[96px] hover:border-slate-300 transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interviews</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-800">{stats.interviews}</span>
                <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-black">Talks</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[96px] hover:border-slate-300 transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-800">{stats.selected}</span>
                <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-black">Offers</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[96px] hover:border-slate-300 transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Review Time</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-800">1.8d</span>
                <span className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded font-black">Optimal</span>
              </div>
            </div>
          </div>

          {/* Core Analytics Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Bar chart of Internship type distributions */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Applications by Internship Type</h3>
              <div className="space-y-3.5 pt-2">
                {Object.entries(stats.types).map(([type, count]) => {
                  const pct = Math.round((count / stats.total) * 100);
                  const barColor = 
                    type === 'research' ? 'bg-purple-500' :
                    type === 'paid' ? 'bg-amber-500' :
                    type === 'stipend' ? 'bg-blue-500' :
                    type === 'industrial' ? 'bg-emerald-500' : 'bg-slate-500';
                  return (
                    <div key={type} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span className="capitalize">{type} Internship</span>
                        <span>{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Colleges */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Applications by College</h3>
              <div className="space-y-3 pt-2">
                {Object.entries(stats.colleges).map(([college, count]) => (
                  <div key={college} className="flex items-center justify-between text-xs border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                    <span className="font-semibold text-slate-700 max-w-[200px] truncate">{college}</span>
                    <span className="bg-slate-100 font-bold px-2 py-0.5 rounded-full text-slate-600 text-[10px]">
                      {count} {count === 1 ? 'applicant' : 'applicants'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Skills Tags */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Top Skills Distribution</h3>
              <div className="flex flex-wrap gap-2.5 pt-2">
                {stats.topSkills.map(([skill, count]) => {
                  const pct = Math.round((count / stats.total) * 100);
                  return (
                    <div key={skill} title={`${pct}% of applicants have this skill`} className="flex items-center gap-1.5 bg-blue-50/50 border border-blue-100 px-3 py-1.5 rounded-xl">
                      <span className="text-xs font-bold text-blue-700">{skill}</span>
                      <span className="bg-blue-100 text-blue-800 text-[9px] font-black px-1.5 py-0.5 rounded-lg">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Submissions Feed */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Recent Applications Feed</h3>
            <div className="divide-y divide-slate-100">
              {applications.slice(0, 4).map((app) => (
                <div key={app.id} className="flex items-center justify-between py-4.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {app.candidateName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{app.candidateName}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{app.college}</span>
                        <span>•</span>
                        <span className="capitalize text-slate-600 font-semibold">{app.internshipType} Internship</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 font-medium">{app.appliedDate}</span>
                    <PermissionGuard required="application.review">
                      <button 
                        onClick={() => handleOpenReview(app)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Review
                      </button>
                    </PermissionGuard>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: APPLICATIONS LIST VIEW */}
      {activeTab === 'applications' && (
        <div className="space-y-4 animate-slide-in">
          {/* Filters, Search & Toolbar Area */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search candidates, skills, colleges, etc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium placeholder-slate-400"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <button 
                  onClick={() => setShowFiltersPopover(!showFiltersPopover)}
                  className={`flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer bg-white ${
                    showFiltersPopover ? 'bg-slate-50 text-blue-600 border-blue-300' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span>Advanced Filters</span>
                  {(filterType !== 'all' || filterStatus !== 'all' || filterCgpa !== 'all' || filterReviewer !== 'all' || filterPayment !== 'all' || filterCollege !== 'all') && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0 ml-0.5"></span>
                  )}
                </button>
                
                {/* Advanced Filters Panel */}
                {showFiltersPopover && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl z-40 p-4 space-y-3.5 animate-slide-in">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Refine Pipeline</span>
                      <button 
                        onClick={() => {
                          setFilterType('all');
                          setFilterStatus('all');
                          setFilterCgpa('all');
                          setFilterReviewer('all');
                          setFilterPayment('all');
                          setFilterCollege('all');
                          setShowFiltersPopover(false);
                          triggerToast('Filters Cleared', 'Reset all pipeline options to default.', 'info');
                        }}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                      >
                        Reset All
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Internship Type</label>
                      <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-1.5 bg-white"
                      >
                        <option value="all">All Types</option>
                        <option value="free">Free</option>
                        <option value="paid">Paid</option>
                        <option value="stipend">Stipend</option>
                        <option value="industrial">Industrial</option>
                        <option value="research">Research</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
                      <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-1.5 bg-white"
                      >
                        <option value="all">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Hold">Hold</option>
                        <option value="Documents Missing">Documents Missing</option>
                        <option value="Payment Verification Pending">Payment verification pending</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CGPA Range</label>
                      <select 
                        value={filterCgpa}
                        onChange={(e) => setFilterCgpa(e.target.value)}
                        className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-1.5 bg-white"
                      >
                        <option value="all">All Grades</option>
                        <option value="9+">Outstanding (&gt;= 9.0)</option>
                        <option value="8-9">Excellent (8.0 - 9.0)</option>
                        <option value="sub8">Average (&lt; 8.0)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reviewer</label>
                      <select 
                        value={filterReviewer}
                        onChange={(e) => setFilterReviewer(e.target.value)}
                        className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-1.5 bg-white"
                      >
                        <option value="all">All Reviewers</option>
                        {filterOptions.reviewers.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">College</label>
                      <select 
                        value={filterCollege}
                        onChange={(e) => setFilterCollege(e.target.value)}
                        className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-1.5 bg-white truncate"
                      >
                        <option value="all">All Colleges</option>
                        {filterOptions.colleges.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Payment Verification</label>
                      <select 
                        value={filterPayment}
                        onChange={(e) => setFilterPayment(e.target.value)}
                        className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-1.5 bg-white"
                      >
                        <option value="all">All Payments</option>
                        <option value="verified">Verified</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <button 
                      onClick={() => setShowFiltersPopover(false)}
                      className="w-full py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm"
                    >
                      Apply Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* High Density Candidates Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5 w-10">
                      <input 
                        type="checkbox"
                        checked={selectedIds.length === filteredApplications.length && filteredApplications.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(filteredApplications.map(a => a.id));
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer h-3.5 w-3.5"
                      />
                    </th>
                    <th className="px-4 py-3.5">ID</th>
                    <th className="px-4 py-3.5">Applicant</th>
                    <th className="px-4 py-3.5">Academic details</th>
                    <th className="px-4 py-3.5">Internship Type</th>
                    <th className="px-4 py-3.5">CGPA</th>
                    <th className="px-4 py-3.5">Resume</th>
                    <th className="px-4 py-3.5 text-center">Score</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Reviewer</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => {
                      const isSelected = selectedIds.includes(app.id);
                      return (
                        <tr 
                          key={app.id} 
                          className={`hover:bg-slate-50/50 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}
                        >
                          <td className="px-4 py-4">
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedIds([...selectedIds, app.id]);
                                } else {
                                  setSelectedIds(selectedIds.filter(id => id !== app.id));
                                }
                              }}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer h-3.5 w-3.5"
                            />
                          </td>
                          <td className="px-4 py-4 font-mono font-bold text-slate-500 text-[10px]">
                            {app.id}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-black shrink-0">
                                {app.candidateName.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-slate-800 block leading-tight">{app.candidateName}</span>
                                <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">
                                  {opportunities.find(o => o.id === app.opportunityId)?.title || app.opportunityId}
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">{app.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <span className="font-semibold text-slate-700 block leading-tight truncate max-w-[180px]">{app.college}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">{app.department}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                              app.internshipType === 'research' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                              app.internshipType === 'paid' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              app.internshipType === 'stipend' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              app.internshipType === 'industrial' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              'bg-slate-50 text-slate-700 border border-slate-200'
                            }`}>
                              {app.internshipType}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded font-mono font-bold ${
                              app.cgpa >= 9.0 ? 'bg-emerald-50 text-emerald-700' :
                              app.cgpa >= 8.0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-600'
                            }`}>
                              {app.cgpa.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                              <FileText className={`h-4 w-4 shrink-0 ${app.resumeUrl ? 'text-emerald-500' : 'text-rose-500'}`} />
                              <span>{app.resumeUrl ? 'Attached' : 'Missing'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {app.reviewScore ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <span className={`font-mono font-bold ${
                                  app.reviewScore >= 85 ? 'text-emerald-600' :
                                  app.reviewScore >= 70 ? 'text-blue-600' : 'text-amber-600'
                                }`}>
                                  {app.reviewScore}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-bold italic">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                              app.status === 'Accepted' || app.status === 'Selected' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              app.status === 'Pending' || app.status === 'New' ? 'bg-slate-50 text-slate-700 border-slate-200' :
                              app.status === 'Under Review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              app.status === 'Shortlisted' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              app.status === 'Interview Scheduled' || app.status === 'Interview' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                              app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              app.status === 'Payment Verification Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-slate-600 font-medium">
                            {app.assignedReviewer || <span className="italic text-slate-400">Unassigned</span>}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <PermissionGuard required="application.review">
                              <button 
                                onClick={() => handleOpenReview(app)}
                                className="text-blue-600 hover:text-blue-800 font-black text-xs cursor-pointer inline-flex items-center gap-0.5"
                              >
                                <span>Review Workspace</span>
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            </PermissionGuard>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={11} className="px-6 py-16 text-center text-slate-500 bg-white">
                        <div className="max-w-sm mx-auto space-y-3">
                          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                            <Search className="h-6 w-6" />
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm">No Applicants Match the Filter Query</h4>
                          <p className="text-xs text-slate-400">Try adjusting your advanced filter metrics or resetting search parameters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sticky Bulk Action Panel */}
          {selectedIds.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-5 z-40 border border-slate-800 animate-slide-in">
              <span className="text-xs font-bold text-slate-300">
                Selected <span className="text-white font-black">{selectedIds.length}</span> candidates
              </span>
              <div className="h-4 w-px bg-slate-800 shrink-0"></div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleBulkStatus('Shortlisted')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Shortlist
                </button>
                <button 
                  onClick={() => handleBulkStatus('Rejected')}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Reject
                </button>

                {showBulkReviewerInput ? (
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="text" 
                      placeholder="Reviewer Name" 
                      value={bulkReviewerName}
                      onChange={(e) => setBulkReviewerName(e.target.value)}
                      className="bg-slate-800 text-white border border-slate-700 rounded px-2 py-1 text-[10px] w-28 focus:outline-none"
                    />
                    <button 
                      onClick={handleBulkAssign}
                      className="p-1 bg-emerald-600 rounded text-white hover:bg-emerald-700"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowBulkReviewerInput(true)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer border border-slate-700"
                  >
                    Assign
                  </button>
                )}
              </div>
              <button 
                onClick={() => setSelectedIds([])}
                className="text-slate-500 hover:text-slate-300 text-xs font-semibold ml-2"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: KANBAN WORKFLOW PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-6 animate-slide-in">
          {(['New', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'] as ApplicationStatus[]).map((col) => {
            const colApps = applications.filter(a => a.status === col);
            return (
              <div key={col} className="bg-slate-100/60 rounded-xl p-3 border border-slate-200/50 flex flex-col min-w-[200px] h-[550px]">
                {/* Column Title */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest truncate">{col}</span>
                  <span className="bg-slate-200/80 font-mono font-bold text-[9px] px-2 py-0.5 rounded-full text-slate-600">
                    {colApps.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="flex-1 overflow-y-auto space-y-3 mt-3 pr-1">
                  {colApps.length > 0 ? (
                    colApps.map(app => (
                      <div 
                        key={app.id} 
                        className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-3 hover:border-slate-300 hover:shadow transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] bg-slate-100 text-slate-500 font-mono px-1 rounded">{app.id}</span>
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                            app.internshipType === 'research' ? 'bg-purple-50 text-purple-700' :
                            app.internshipType === 'paid' ? 'bg-amber-50 text-amber-700' :
                            app.internshipType === 'stipend' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50'
                          }`}>
                            {app.internshipType}
                          </span>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{app.candidateName}</h4>
                          <p className="text-[10px] text-blue-600 font-semibold mt-0.5 truncate">
                            {opportunities.find(o => o.id === app.opportunityId)?.title || app.opportunityId}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">{app.college}</p>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-[9px] font-semibold text-slate-500 border-t border-slate-100">
                          <span>GPA: {app.cgpa.toFixed(1)}</span>
                          {app.aiMatchPercentage && (
                            <span className="text-blue-600 flex items-center gap-0.5">
                              <Sparkles className="h-3 w-3 shrink-0" />
                              {app.aiMatchPercentage}%
                            </span>
                          )}
                        </div>

                        {/* Interactive Drag Stage Quick Move controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-100 group-hover:block hidden">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Stage Ops</span>
                          <div className="flex gap-1.5">
                            {col !== 'Shortlisted' && col !== 'Selected' && (
                              <button 
                                onClick={() => handleQuickStatus(app.id, 'Shortlisted')}
                                className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold cursor-pointer"
                              >
                                Shortlist
                              </button>
                            )}
                            {col !== 'Interview Scheduled' && (
                              <button 
                                onClick={() => handleQuickStatus(app.id, 'Interview Scheduled')}
                                className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-bold cursor-pointer"
                              >
                                Interview
                              </button>
                            )}
                            {col !== 'Rejected' && (
                              <button 
                                onClick={() => handleQuickStatus(app.id, 'Rejected')}
                                className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded text-[9px] font-bold cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </div>

                        <button 
                          onClick={() => handleOpenReview(app)}
                          className="w-full text-center py-1.5 mt-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                        >
                          Open Review
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                      <p className="text-[10px] text-slate-400 italic">No candidates at this stage</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 4: REPORTS & ANALYTICS */}
      {activeTab === 'reports' && (
        <div className="space-y-6 animate-slide-in">
          {/* Conversion Funnel */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Recruitment Conversion Funnel</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-3">
              {[
                { stage: 'Total Apps', count: stats.total, color: 'bg-slate-900 text-white', pct: 100 },
                { stage: 'Under Review', count: applications.filter(a => a.status !== 'New').length, color: 'bg-blue-600 text-white', pct: Math.round((applications.filter(a => a.status !== 'New').length / stats.total) * 100) },
                { stage: 'Shortlisted', count: stats.shortlisted, color: 'bg-purple-600 text-white', pct: Math.round((stats.shortlisted / stats.total) * 100) },
                { stage: 'Interviewed', count: stats.interviews, color: 'bg-indigo-600 text-white', pct: Math.round((stats.interviews / stats.total) * 100) },
                { stage: 'Offers Extended', count: stats.selected, color: 'bg-emerald-600 text-white', pct: Math.round((stats.selected / stats.total) * 100) }
              ].map((step, idx) => (
                <div key={step.stage} className="relative flex flex-col justify-between border border-slate-200 rounded-xl p-4 h-32 hover:border-slate-300">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {idx + 1}</span>
                    <h4 className="text-xs font-bold text-slate-800 mt-1">{step.stage}</h4>
                  </div>
                  <div className="flex items-baseline justify-between mt-4">
                    <span className="text-2xl font-black text-slate-900">{step.count}</span>
                    <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {step.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recruiter Speed & Volume */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Recruiter Review Speed & Volume</h3>
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                    <tr>
                      <th className="px-4 py-2.5">Reviewer</th>
                      <th className="px-4 py-2.5">Reviewed Count</th>
                      <th className="px-4 py-2.5">Average Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {['Alice Vance', 'David Miller', 'Sarah Connor'].map(rev => {
                      const revApps = applications.filter(a => a.assignedReviewer === rev);
                      const scores = revApps.map(a => a.reviewScore).filter(Boolean) as number[];
                      const avg = scores.length > 0 ? Math.round(scores.reduce((a,b)=>a+b, 0) / scores.length) : '-';
                      return (
                        <tr key={rev} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-semibold text-slate-800">{rev}</td>
                          <td className="px-4 py-3 font-bold text-slate-600">{revApps.length} applications</td>
                          <td className="px-4 py-3 font-mono font-bold text-blue-600">{avg}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Geographical Distribution */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Applications by Location</h3>
              <div className="divide-y divide-slate-100 pt-2">
                {Array.from(new Set(applications.map(a => `${a.city}, ${a.state}`))).map(loc => {
                  const locCount = applications.filter(a => `${a.city}, ${a.state}` === loc).length;
                  return (
                    <div key={loc} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 text-xs font-semibold text-slate-700">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{loc}</span>
                      </div>
                      <span className="bg-slate-50 border border-slate-200 font-bold px-2 py-0.5 rounded text-slate-600 font-mono">
                        {locCount} app
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN SIDE EVALUATION DRAWER */}
      <Drawer 
        isOpen={!!reviewApp} 
        onClose={() => setReviewApp(null)} 
        title="Candidate Profile & Scorecard Workspace"
      >
        {reviewApp && (
          <div className="flex flex-col h-full bg-slate-50/50">
            {/* Sticky Actions Header */}
            <div className="shrink-0 bg-white border-b border-slate-200 p-4.5 flex items-center justify-between shadow-sm z-30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-black text-base shrink-0">
                  {reviewApp.candidateName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">{reviewApp.candidateName}</h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {reviewApp.id} • {reviewApp.email} • {opportunities.find(o => o.id === reviewApp.opportunityId)?.title || reviewApp.opportunityId}
                  </span>
                </div>
              </div>

              {/* Status transition fast click actions */}
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => handleQuickStatus(reviewApp.id, 'Shortlisted')}
                  disabled={reviewApp.status === 'Shortlisted'}
                  className="px-3.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Shortlist
                </button>
                <button 
                  onClick={() => handleQuickStatus(reviewApp.id, 'Interview Scheduled')}
                  disabled={reviewApp.status === 'Interview Scheduled'}
                  className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Schedule Interview
                </button>
                <button 
                  onClick={() => handleApproveAndCreateUser(reviewApp)}
                  disabled={reviewApp.status === 'Selected' || reviewApp.status === 'Accepted'}
                  className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Approve / Select
                </button>
                <button 
                  onClick={() => handleQuickStatus(reviewApp.id, 'Rejected')}
                  disabled={reviewApp.status === 'Rejected'}
                  className="px-3.5 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>

            {/* Split layout review screen */}
            <div className="flex-1 flex overflow-hidden min-h-0">
              {/* Left Column: Applicant Details Portfolio */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Section 1: Personal Info */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <User className="h-4 w-4 text-slate-400" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">First Name</span>
                      <span className="text-slate-800 font-bold block mt-0.5">{reviewApp.firstName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Last Name</span>
                      <span className="text-slate-800 font-bold block mt-0.5">{reviewApp.lastName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Email Address</span>
                      <span className="text-slate-800 font-bold block mt-0.5 select-all">{reviewApp.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Mobile Phone</span>
                      <span className="text-slate-800 font-bold block mt-0.5 select-all">{reviewApp.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Date of Birth</span>
                      <span className="text-slate-800 font-bold block mt-0.5">{reviewApp.dob}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Gender</span>
                      <span className="text-slate-800 font-bold block mt-0.5">{reviewApp.gender}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">City</span>
                      <span className="text-slate-800 font-bold block mt-0.5">{reviewApp.city}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">State</span>
                      <span className="text-slate-800 font-bold block mt-0.5">{reviewApp.state}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Academic Info */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    Academic Credentials
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div className="col-span-2 md:col-span-3">
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">College / University Name</span>
                      <span className="text-slate-800 font-bold block mt-0.5">{reviewApp.college}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Department</span>
                      <span className="text-slate-800 font-bold block mt-0.5">{reviewApp.department}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Degree</span>
                      <span className="text-slate-800 font-bold block mt-0.5">{reviewApp.degree}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Current Year</span>
                      <span className="text-slate-800 font-bold block mt-0.5">{reviewApp.currentYear}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">CGPA Percentage</span>
                      <span className="text-slate-800 font-bold block mt-0.5">{reviewApp.cgpa.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Graduation Year</span>
                      <span className="text-slate-800 font-bold block mt-0.5">{reviewApp.graduationYear}</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Professional Portfolio */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    Professional Portfolio
                  </h4>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px] mb-1.5">Tech Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {reviewApp.skills.map(s => (
                          <span key={s} className="bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <span className="text-slate-400 font-semibold block uppercase text-[10px]">Github URL</span>
                        <a href={reviewApp.githubUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 mt-1">
                          <span>View Profile</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block uppercase text-[10px]">Linkedin URL</span>
                        <a href={reviewApp.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 mt-1">
                          <span>View Profile</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block uppercase text-[10px]">Portfolio Website</span>
                        <a href={reviewApp.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 mt-1">
                          <span>Open Site</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Project Work Experience</span>
                      <p className="text-slate-700 leading-relaxed mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        {reviewApp.projectExperience}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 4: Internship Specific Dynamics */}
                {reviewApp.internshipType === 'paid' && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Paid Internship Verification
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-2">
                        <div>
                          <span className="text-slate-400 font-semibold block uppercase text-[10px]">Payment Mode</span>
                          <span className="text-slate-800 font-bold block mt-0.5">{reviewApp.paymentMode || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block uppercase text-[10px]">Transaction ID</span>
                          <span className="text-slate-800 font-mono font-bold block mt-0.5 select-all">{reviewApp.transactionId || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block uppercase text-[10px]">Receipt Check Status</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded font-black text-[9px] mt-1 ${
                            reviewApp.paymentVerified === 'Verified' ? 'bg-emerald-50 text-emerald-700' :
                            reviewApp.paymentVerified === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {reviewApp.paymentVerified || 'Pending Check'}
                          </span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button 
                            onClick={() => handlePaymentVerification(reviewApp.id, 'Verified')}
                            disabled={reviewApp.paymentVerified === 'Verified'}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase cursor-pointer transition-colors"
                          >
                            Approve Payment
                          </button>
                          <button 
                            onClick={() => handlePaymentVerification(reviewApp.id, 'Rejected')}
                            disabled={reviewApp.paymentVerified === 'Rejected'}
                            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-black uppercase cursor-pointer transition-colors border border-rose-200"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                      
                      {/* Simulated Payment Receipt Attachment Preview */}
                      <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 flex flex-col justify-between h-40">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                          <span>Screenshot Preview</span>
                          <Eye className="h-4 w-4" />
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <FileText className="h-10 w-10 text-slate-300" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 truncate text-center">{reviewApp.paymentScreenshot || 'No receipt screenshot uploaded'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {reviewApp.internshipType === 'stipend' && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <Sparkles className="h-4 w-4 text-blue-500" />
                      Stipend Specific Experience
                    </h4>
                    <div className="text-xs space-y-3.5">
                      <div>
                        <span className="text-slate-400 font-semibold block uppercase text-[10px]">Candidate Relevant Experience</span>
                        <p className="text-slate-700 leading-relaxed mt-1 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">{reviewApp.relevantExperience || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block uppercase text-[10px]">AI-Generated Experience Evaluation</span>
                        <p className="text-blue-700 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 mt-1 leading-relaxed">{reviewApp.aiExperienceSummary || 'Pending AI evaluation.'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {reviewApp.internshipType === 'industrial' && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <Layers className="h-4 w-4 text-emerald-500" />
                      Industrial Specifics
                    </h4>
                    <div className="text-xs space-y-3.5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-400 font-semibold block uppercase text-[10px]">Preferred Stack Choice</span>
                          <span className="text-slate-800 font-bold block mt-0.5 bg-slate-50 p-1.5 rounded">{reviewApp.preferredTechStack || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block uppercase text-[10px]">Skill Match Accuracy</span>
                          <span className="text-blue-600 font-black text-sm block mt-0.5">{reviewApp.aiSkillMatchPercentage || 0}% match</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block uppercase text-[10px]">Prior Tech Environment History</span>
                        <p className="text-slate-700 leading-relaxed mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{reviewApp.technicalExperience || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {reviewApp.internshipType === 'research' && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <BookOpen className="h-4 w-4 text-purple-500" />
                      Research Details
                    </h4>
                    <div className="text-xs space-y-3.5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-400 font-semibold block uppercase text-[10px]">Focus Research Area</span>
                          <span className="text-slate-800 font-bold block mt-0.5 bg-slate-50 p-2 rounded">{reviewApp.researchArea || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block uppercase text-[10px]">Publications Index</span>
                          <span className="text-slate-700 font-bold block mt-0.5">{reviewApp.publications || 'No publications listed.'}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block uppercase text-[10px]">Research Statement Summary</span>
                        <p className="text-slate-700 leading-relaxed mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{reviewApp.researchStatement || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 5: Resume Embedded Frame placeholder */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-slate-400" />
                      Resume Documents
                    </h4>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowResumeFullScreen(true)}
                        className="text-blue-600 hover:text-blue-800 text-[10px] font-bold inline-flex items-center gap-0.5 cursor-pointer"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Preview Fullscreen</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Simulated document PDF wrapper */}
                    <div className="md:col-span-2 border border-slate-200 rounded-xl p-4 bg-slate-100 flex flex-col items-center justify-center min-h-[140px]">
                      <FileText className="h-12 w-12 text-slate-300" />
                      <span className="font-bold text-slate-700 mt-2">{reviewApp.resumeUrl}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Mock Resume Document Attached</span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">AI Resume Parser Summary</span>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{reviewApp.aiResumeSummary || 'Resume parsing text pending.'}</p>
                    </div>
                  </div>
                </div>

                {/* Section 6: Motivation Statement */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    Motivation & AI Assessment
                  </h4>
                  <div className="text-xs space-y-3">
                    <div>
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Why do you want this Internship?</span>
                      <p className="text-slate-700 leading-relaxed mt-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{reviewApp.whyInternship}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-1 text-[11px]">
                      <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                        <span className="text-slate-400 block text-[9px] uppercase">Sentiment Analysis</span>
                        <span className={`font-bold block mt-0.5 ${reviewApp.aiSentiment === 'Positive' ? 'text-emerald-600' : 'text-slate-600'}`}>
                          {reviewApp.aiSentiment || 'Neutral'}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                        <span className="text-slate-400 block text-[9px] uppercase">Commitment Score</span>
                        <span className="font-bold text-slate-800 block mt-0.5">{reviewApp.aiCommitmentScore || 0}/100</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                        <span className="text-slate-400 block text-[9px] uppercase">Comms Score</span>
                        <span className="font-bold text-slate-800 block mt-0.5">{reviewApp.aiCommunicationScore || 0}/100</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Scorecard & AI assistance panel */}
              <div className="w-[340px] border-l border-slate-200 bg-white overflow-y-auto p-5 space-y-5 shrink-0">
                {/* AI assistance assessment overview */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      AI Assistant Insight
                    </h4>
                    <span className="bg-blue-100 text-blue-800 font-mono font-black px-2 py-0.5 rounded text-xs">
                      {reviewApp.aiMatchPercentage}% match
                    </span>
                  </div>

                  <div className="space-y-2.5 text-[11px]">
                    {reviewApp.aiStrengths && (
                      <div>
                        <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest block mb-1">Key Strengths</span>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                          {reviewApp.aiStrengths.map((str, idx) => (
                            <li key={idx}>{str}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {reviewApp.aiWeaknesses && reviewApp.aiWeaknesses.length > 0 && (
                      <div>
                        <span className="text-[10px] font-black text-rose-800 uppercase tracking-widest block mb-1">Weaknesses</span>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                          {reviewApp.aiWeaknesses.map((wk, idx) => (
                            <li key={idx} className="text-slate-600">{wk}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {reviewApp.aiRiskFlags && reviewApp.aiRiskFlags.length > 0 && (
                      <div className="bg-rose-50 border border-rose-100 rounded-lg p-2 flex gap-1.5 text-rose-700">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
                        <div>
                          <span className="text-[9px] font-black uppercase block">Risk Alert Flags</span>
                          <span className="text-[10px] font-semibold">{reviewApp.aiRiskFlags.join(', ')}</span>
                        </div>
                      </div>
                    )}

                    {reviewApp.aiSuggestedQuestions && (
                      <div className="pt-2 border-t border-blue-100/60">
                        <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest block mb-1">Suggested Interview Qs</span>
                        <ul className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1 leading-snug">
                          {reviewApp.aiSuggestedQuestions.map((q, idx) => (
                            <li key={idx} className="pl-0.5">{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Scorecard Inputs Workspace */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Recruiter Scorecard
                  </h4>

                  {/* Sliders */}
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Technical Evaluation</span>
                        <span className="font-mono text-blue-600 font-bold">{techScore}/10</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" 
                        value={techScore} 
                        onChange={(e) => setTechScore(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Communication</span>
                        <span className="font-mono text-blue-600 font-bold">{commScore}/10</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" 
                        value={commScore} 
                        onChange={(e) => setCommScore(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Academic Records</span>
                        <span className="font-mono text-blue-600 font-bold">{acadScore}/10</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" 
                        value={acadScore} 
                        onChange={(e) => setAcadScore(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Culture Alignment</span>
                        <span className="font-mono text-blue-600 font-bold">{cultureScore}/10</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" 
                        value={cultureScore} 
                        onChange={(e) => setCultureScore(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  {/* Recommendation dropdown */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Recruiter Recommendation</label>
                    <select 
                      value={overallRec}
                      onChange={(e) => setOverallRec(e.target.value)}
                      className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2 bg-white"
                    >
                      <option value="Strong Hire">Strong Hire</option>
                      <option value="Hire">Hire</option>
                      <option value="Hold">Hold / Waitlist</option>
                      <option value="No Hire">No Hire</option>
                      <option value="Strong No Hire">Strong No Hire</option>
                    </select>
                  </div>

                  {/* Notes & feedback text areas */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Internal Reviewer Notes</label>
                    <textarea 
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      rows={3}
                      placeholder="Enter technical interview thoughts, logic check outcomes..."
                      className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:border-blue-500 placeholder-slate-300"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Candidate Feedback (Sendable)</label>
                    <textarea 
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      rows={3}
                      placeholder="Strengths to maintain, gaps to fill for next cycle..."
                      className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:border-blue-500 placeholder-slate-300"
                    ></textarea>
                  </div>

                  <button 
                    onClick={handleSaveEvaluation}
                    className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="h-4 w-4" />
                    <span>Save Evaluation Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Embedded Resume Fullscreen Preview Modal */}
      {showResumeFullScreen && reviewApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl animate-slide-in">
            <div className="shrink-0 p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">Resume Preview: {reviewApp.candidateName}</h3>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">{reviewApp.resumeUrl}</span>
              </div>
              <button 
                onClick={() => setShowResumeFullScreen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-lg"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 overflow-y-auto p-12 flex flex-col items-center justify-center">
              <FileText className="h-20 w-20 text-slate-300" />
              <span className="font-bold text-slate-700 text-lg mt-4">{reviewApp.resumeUrl}</span>
              <p className="text-sm text-slate-400 max-w-md text-center mt-2">
                This is a simulated document view container representing candidate resume records. Recruiter tools allow downloading or exporting this file dynamically.
              </p>
              <button 
                onClick={() => {
                  triggerToast('Download Started', `Downloading file ${reviewApp.resumeUrl}...`, 'success');
                  setShowResumeFullScreen(false);
                }}
                className="mt-6 px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" />
                Download Document
              </button>
            </div>
          </div>
        </div>
      )}

      <AddCandidateDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onCandidateAdded={() => loadData(false)}
        opportunities={opportunities}
      />
    </div>
  );
}
