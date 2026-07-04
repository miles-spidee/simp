"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Briefcase, Plus, ChevronRight, MapPin, Users,
  BarChart3, Clock, CheckCircle2, XCircle, LayoutDashboard, List,
  TrendingUp, UserPlus, FileText, Activity, Building, Calendar,
  UsersRound, ShieldCheck
} from 'lucide-react';

import { opportunitiesService } from '@/src/services/opportunities.service';
import { Opportunity } from '@/src/types/opportunities.types';
import { CreateOpportunityWizard } from '@/components/feature/opportunity/CreateOpportunityWizard';
import { Drawer } from '@/components/feature/ui/Drawer';
import { applicationService } from '@/src/services/application.service';
import { Application } from '@/src/types/applications.types';
import { openingMentorsService } from '@/src/services/opening-mentors.service';
import { OpeningMentor } from '@/src/types/opening-mentors.types';
import { mentorService } from '@/src/services/mentor.service';
import { MentorProfile } from '@/src/types/api/mentor.types';
import { EnhancedTable } from '@/components/feature/ui/Table';

type TabType = 'dashboard' | 'directory';
type DrawerTabType = 'overview' | 'mentors' | 'applications' | 'analytics' | 'timeline';

export default function OpportunityPage() {

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  
  // Drawer state
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<DrawerTabType>('overview');
  const [opportunityMentors, setOpportunityMentors] = useState<OpeningMentor[]>([]);
  
  // Assign Mentor State
  const [isAssignMentorOpen, setIsAssignMentorOpen] = useState(false);
  const [availableMentors, setAvailableMentors] = useState<MentorProfile[]>([]);
  const [assignForm, setAssignForm] = useState({ mentorId: '', role: 'Lead Mentor', workload: 10 });

  const loadData = async () => {
    try {
      setLoading(true);
      const [oppData, appData] = await Promise.all([
        opportunitiesService.getOpportunities(),
        applicationService.getApplications()
      ]);
      setOpportunities(oppData);
      setApplications(appData);
    } catch (err) {
      console.error('Failed to load opportunity data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadMentorsForOpp = async (oppId: string) => {
    try {
      const mentors = await openingMentorsService.getMentorsForOpportunity(oppId);
      setOpportunityMentors(mentors);
    } catch (err) {
      console.error('Failed to load mentors', err);
    }
  };

  const openDrawer = async (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setDrawerTab('overview');
    loadMentorsForOpp(opp.id);
    setIsDrawerOpen(true);
    setIsAssignMentorOpen(false);
    try {
      const mentors = await mentorService.getMentorProfiles();
      setAvailableMentors(mentors);
    } catch (err) {
      console.error('Failed to load mentor profiles', err);
    }
  };

  const handleAssignMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpportunity || !assignForm.mentorId) return;

    try {
      await openingMentorsService.assignMentor({
        opportunityId: selectedOpportunity.id,
        mentorId: assignForm.mentorId,
        role: assignForm.role as any,
        workload: Number(assignForm.workload),
      });

      await loadMentorsForOpp(selectedOpportunity.id);
      setIsAssignMentorOpen(false);
      setAssignForm({ mentorId: '', role: 'Lead Mentor', workload: 10 });
    } catch (err) {
      console.error('Failed to assign mentor', err);
    }
  };

  // KPIs
  const totalOpenings = opportunities.length;
  const openOpenings = opportunities.filter(o => o.status === 'Open').length;
  const closedOpenings = opportunities.filter(o => o.status === 'Closed').length;
  const totalApplications = applications.length;
  
  const totalSeats = opportunities.reduce((acc, curr) => acc + (parseInt(curr.seats) || 0), 0);
  const selectedApps = applications.filter(a => a.status === 'Selected').length;
  const fillRate = totalSeats > 0 ? Math.round((selectedApps / totalSeats) * 100) : 0;
  
  const opportunitiesWithMentors = new Set(opportunityMentors.map(m => m.opportunityId)).size;
  const mentorCoverage = totalOpenings > 0 ? Math.round((opportunitiesWithMentors / totalOpenings) * 100) : 0;

  const getStatusBadge = (status: string = 'Draft') => {
    switch (status) {
      case 'Open': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">Open</span>;
      case 'Closed': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-text-primary">Closed</span>;
      case 'Draft': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700">Draft</span>;
      default: return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-text-primary">{status}</span>;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Openings', value: totalOpenings, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Open Opportunities', value: openOpenings, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Applications', value: totalApplications, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Fill Rate', value: `${fillRate}%`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold text-text-primary">{kpi.value}</div>
                <div className="text-sm font-medium text-text-secondary mt-1">{kpi.label}</div>
              </div>
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Funnel Chart (Mock) */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Application Funnel</h3>
          <div className="space-y-4">
            {[
              { label: 'Applied', value: applications.length, color: 'bg-blue-500' },
              { label: 'Reviewing', value: applications.filter(a => a.status === 'Under Review').length, color: 'bg-indigo-500' },
              { label: 'Shortlisted', value: applications.filter(a => a.status === 'Shortlisted').length, color: 'bg-amber-500' },
              { label: 'Selected', value: selectedApps, color: 'bg-emerald-500' }
            ].map((step, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-text-secondary">{step.label}</div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${step.color} rounded-full transition-all duration-1000`} 
                      style={{ width: `${applications.length > 0 ? (step.value / applications.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-bold text-text-primary">{step.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Opening Status Distribution</h3>
          <div className="flex h-32 items-end gap-2">
            {[
              { label: 'Open', value: openOpenings, color: 'bg-emerald-500' },
              { label: 'Closed', value: closedOpenings, color: 'bg-slate-400' },
              { label: 'Draft', value: opportunities.length - openOpenings - closedOpenings, color: 'bg-amber-400' }
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                <div className="text-xs font-bold text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">{bar.value}</div>
                <div 
                  className={`w-full max-w-[40px] ${bar.color} rounded-t-md transition-all duration-1000`}
                  style={{ height: `${totalOpenings > 0 ? (bar.value / totalOpenings) * 100 : 0}%`, minHeight: '20px' }}
                />
                <div className="text-xs font-medium text-text-secondary">{bar.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const oppColumns = [
    {
      key: 'title',
      label: 'Opportunity',
      render: (opp: Opportunity) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-text-primary">{opp.title}</div>
            <div className="text-xs text-text-secondary">ID: {opp.id} • Posted: {opp.postedDate}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (opp: Opportunity) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-text-primary">{opp.type}</span>
          <span className="text-xs capitalize text-text-secondary">{opp.value}</span>
        </div>
      ),
    },
    {
      key: 'mode',
      label: 'Location',
      render: (opp: Opportunity) => (
        <div className="flex items-center gap-1 text-text-secondary">
          <MapPin className="h-3.5 w-3.5" />
          <span>{opp.mode}</span>
        </div>
      ),
    },
    { key: 'seats', label: 'Seats', className: 'font-medium text-text-primary' },
    {
      key: 'status',
      label: 'Status',
      render: (opp: Opportunity) => getStatusBadge(opp.status),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (opp: Opportunity) => (
        <button
          onClick={() => openDrawer(opp)}
          className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        >
          Manage
        </button>
      ),
    },
  ];

  const renderDirectory = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <EnhancedTable
        data={opportunities}
        columns={oppColumns}
        searchPlaceholder="Search by title, mode, or type..."
        itemsPerPage={10}
        emptyMessage="No opportunities found."
      />
    </div>
  );

  return (
    <>
      <div className="space-y-6 animate-slide-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <span>Enterprise</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-blue-600 font-extrabold">Opportunities</span>
            </div>
            <h2 className="text-2xl font-black text-text-primary mt-2 tracking-tight">Opportunity Management</h2>
            <p className="text-xs text-helper mt-1">
              Create, track, and manage job openings and internships.
            </p>
          </div>
          
          <button 
            onClick={() => setIsCreateWizardOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Post Opportunity</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary'}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'directory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary'}`}
          >
            <List className="h-4 w-4" />
            Directory
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'directory' && renderDirectory()}
          </>
        )}
      </div>

      <CreateOpportunityWizard 
        isOpen={isCreateWizardOpen} 
        onClose={() => setIsCreateWizardOpen(false)} 
        onOpportunityCreated={loadData} 
      />

      {/* Profile Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedOpportunity?.title || 'Opportunity Details'}
        size="lg"
      >
        {selectedOpportunity && (
          <div className="flex flex-col h-full">
            {/* Drawer Header Info */}
            <div className="bg-slate-50 p-6 border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(selectedOpportunity.status)}
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{selectedOpportunity.type}</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">{selectedOpportunity.title}</h3>
                  <div className="flex items-center gap-4 mt-3 text-sm text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-text-secondary" />
                      {selectedOpportunity.mode}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-text-secondary" />
                      {selectedOpportunity.duration}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UsersRound className="h-4 w-4 text-text-secondary" />
                      {selectedOpportunity.seats} Seats
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Tabs */}
            <div className="flex overflow-x-auto border-b border-border px-4">
              {[
                { id: 'overview', label: 'Overview', icon: Briefcase },
                { id: 'mentors', label: 'Mentors', icon: ShieldCheck },
                { id: 'applications', label: 'Applications', icon: FileText },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'timeline', label: 'Timeline', icon: Activity }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setDrawerTab(t.id as DrawerTabType)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${drawerTab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              {drawerTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-border p-5">
                    <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" /> Description
                    </h4>
                    <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{selectedOpportunity.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-border p-5">
                      <div className="text-xs font-semibold text-text-secondary uppercase mb-1">Eligibility</div>
                      <div className="text-sm font-medium text-text-primary">{selectedOpportunity.eligibility}</div>
                    </div>
                    <div className="bg-white rounded-xl border border-border p-5">
                      <div className="text-xs font-semibold text-text-secondary uppercase mb-1">Stipend/Value</div>
                      <div className="text-sm font-medium text-text-primary">{selectedOpportunity.amount || selectedOpportunity.value}</div>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'mentors' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-text-primary">Assigned Mentors</h4>
                    {!isAssignMentorOpen && (
                      <button 
                        onClick={() => setIsAssignMentorOpen(true)}
                        className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100"
                      >
                        + Assign Mentor
                      </button>
                    )}
                  </div>
                  
                  {isAssignMentorOpen && (
                    <form onSubmit={handleAssignMentor} className="bg-slate-50 p-4 rounded-xl border border-border space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-xs font-bold text-text-primary uppercase tracking-wider">Assign New Mentor</h5>
                        <button type="button" onClick={() => setIsAssignMentorOpen(false)} className="text-text-secondary hover:text-text-secondary">
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-text-secondary">Select Mentor *</label>
                          <select 
                            required
                            value={assignForm.mentorId}
                            onChange={(e) => setAssignForm({...assignForm, mentorId: e.target.value})}
                            className="w-full text-sm p-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                          >
                            <option value="">-- Choose Mentor --</option>
                            {availableMentors.map(m => (
                              <option key={m.mentor_profile_id} value={m.mentor_profile_id}>
                                {m.employeeName || 'Unknown Mentor'} ({m.employee_id || m.mentor_profile_id.substring(0, 8)})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-text-secondary">Role</label>
                          <select 
                            required
                            value={assignForm.role}
                            onChange={(e) => setAssignForm({...assignForm, role: e.target.value})}
                            className="w-full text-sm p-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                          >
                            <option value="Lead Mentor">Lead Mentor</option>
                            <option value="Co-Mentor">Co-Mentor</option>
                          </select>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-semibold text-text-secondary">Workload (Max Students)</label>
                          <input 
                            type="number"
                            required
                            min={1}
                            value={assignForm.workload}
                            onChange={(e) => setAssignForm({...assignForm, workload: Number(e.target.value)})}
                            className="w-full text-sm p-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm">
                          Confirm Assignment
                        </button>
                      </div>
                    </form>
                  )}
                  
                  {opportunityMentors.length > 0 ? (
                    <div className="space-y-3">
                      {opportunityMentors.map(mentor => (
                        <div key={mentor.id} className="bg-white p-4 rounded-xl border border-border flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                              {mentor.mentorId.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-text-primary">Mentor {mentor.mentorId}</div>
                              <div className="text-xs text-text-secondary">{mentor.role} • Max {mentor.workload} students</div>
                            </div>
                          </div>
                          <button 
                            className="text-text-secondary hover:text-red-500"
                            onClick={async () => {
                              await openingMentorsService.removeMentor(selectedOpportunity.id, mentor.mentorId);
                              await loadMentorsForOpp(selectedOpportunity.id);
                            }}
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-text-secondary bg-white rounded-xl border border-border border-dashed">
                      <ShieldCheck className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm">No mentors assigned yet.</p>
                    </div>
                  )}
                </div>
              )}

              {drawerTab === 'applications' && (
                <div className="space-y-4">
                  {applications.filter(a => a.opportunityId === selectedOpportunity.id).length > 0 ? (
                    applications.filter(a => a.opportunityId === selectedOpportunity.id).map(app => (
                      <div key={app.id} className="bg-white p-4 rounded-xl border border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-slate-100 text-text-secondary rounded-full flex items-center justify-center font-bold">
                            {app.candidateName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-text-primary">{app.candidateName}</div>
                            <div className="text-xs text-text-secondary">{app.appliedDate}</div>
                          </div>
                        </div>
                        <div className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 text-text-primary">
                          {app.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-text-secondary bg-white rounded-xl border border-border border-dashed">
                      <FileText className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm">No applications received yet.</p>
                    </div>
                  )}
                </div>
              )}

              {drawerTab === 'analytics' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-border">
                      <div className="text-xs text-text-secondary uppercase font-semibold mb-1">Total Views</div>
                      <div className="text-2xl font-bold text-text-primary">1,245</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-border">
                      <div className="text-xs text-text-secondary uppercase font-semibold mb-1">Conversion Rate</div>
                      <div className="text-2xl font-bold text-text-primary">12.4%</div>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-border">
                    <h4 className="text-sm font-semibold text-text-primary mb-4">Application Funnel</h4>
                    {/* Reuse funnel logic here for specific opportunity */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-text-secondary">Applied</span>
                        <span className="font-bold text-text-primary">45</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full"><div className="h-full bg-blue-500 rounded-full w-[100%]"></div></div>
                      
                      <div className="flex justify-between items-center text-sm mt-4">
                        <span className="text-text-secondary">Shortlisted</span>
                        <span className="font-bold text-text-primary">12</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full"><div className="h-full bg-amber-500 rounded-full w-[26%]"></div></div>
                      
                      <div className="flex justify-between items-center text-sm mt-4">
                        <span className="text-text-secondary">Selected</span>
                        <span className="font-bold text-text-primary">4</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full"><div className="h-full bg-emerald-500 rounded-full w-[8%]"></div></div>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'timeline' && (
                <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {[
                    { title: 'Opportunity Posted', date: selectedOpportunity.postedDate, desc: 'Created by Admin', icon: Plus, color: 'text-blue-500', bg: 'bg-blue-100' },
                    { title: 'First Application', date: '2 days after posting', desc: 'System log', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-100' },
                    { title: 'Mentor Assigned', date: '1 week after posting', desc: 'Assigned Lead Mentor', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-100' },
                  ].map((event, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                        <event.icon className={`h-4 w-4 ${event.color}`} />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-sm text-text-primary">{event.title}</div>
                        </div>
                        <div className="text-xs text-text-secondary">{event.desc}</div>
                        <div className="text-xs text-text-secondary mt-2 font-medium">{event.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
