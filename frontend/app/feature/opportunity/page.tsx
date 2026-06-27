"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Briefcase, Search, Filter, Plus, ChevronRight, MapPin, Users,
  BarChart3, Clock, CheckCircle2, XCircle, LayoutDashboard, List,
  TrendingUp, UserPlus, FileText, Activity, Building, Calendar,
  UsersRound, ShieldCheck
} from 'lucide-react';
import { opportunitiesService } from '@/src/services/opportunities.service';
import { Opportunity } from '@/src/data/mock-opportunities';
import { CreateOpportunityWizard } from '@/components/feature/opportunity/CreateOpportunityWizard';
import { Drawer } from '@/components/feature/ui/Drawer';
import { applicationService } from '@/src/services/application.service';
import { Application } from '@/src/data/mock-applications';
import { openingMentorsService } from '@/src/services/opening-mentors.service';
import { OpeningMentor } from '@/src/data/mock-opening-mentors';

type TabType = 'dashboard' | 'directory';
type DrawerTabType = 'overview' | 'mentors' | 'applications' | 'analytics' | 'timeline';

export default function OpportunityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Drawer state
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<DrawerTabType>('overview');
  const [opportunityMentors, setOpportunityMentors] = useState<OpeningMentor[]>([]);

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

  const openDrawer = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setDrawerTab('overview');
    loadMentorsForOpp(opp.id);
    setIsDrawerOpen(true);
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

  const filteredOpportunities = opportunities.filter(opp => 
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    opp.mode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string = 'Draft') => {
    switch (status) {
      case 'Open': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">Open</span>;
      case 'Closed': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">Closed</span>;
      case 'Draft': return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700">Draft</span>;
      default: return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">{status}</span>;
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
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
                <div className="text-sm font-medium text-slate-500 mt-1">{kpi.label}</div>
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
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Application Funnel</h3>
          <div className="space-y-4">
            {[
              { label: 'Applied', value: applications.length, color: 'bg-blue-500' },
              { label: 'Reviewing', value: applications.filter(a => a.status === 'Under Review').length, color: 'bg-indigo-500' },
              { label: 'Shortlisted', value: applications.filter(a => a.status === 'Shortlisted').length, color: 'bg-amber-500' },
              { label: 'Selected', value: selectedApps, color: 'bg-emerald-500' }
            ].map((step, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-slate-600">{step.label}</div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${step.color} rounded-full transition-all duration-1000`} 
                      style={{ width: `${applications.length > 0 ? (step.value / applications.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-bold text-slate-900">{step.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Opening Status Distribution</h3>
          <div className="flex h-32 items-end gap-2">
            {[
              { label: 'Open', value: openOpenings, color: 'bg-emerald-500' },
              { label: 'Closed', value: closedOpenings, color: 'bg-slate-400' },
              { label: 'Draft', value: opportunities.length - openOpenings - closedOpenings, color: 'bg-amber-400' }
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                <div className="text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{bar.value}</div>
                <div 
                  className={`w-full max-w-[40px] ${bar.color} rounded-t-md transition-all duration-1000`}
                  style={{ height: `${totalOpenings > 0 ? (bar.value / totalOpenings) * 100 : 0}%`, minHeight: '20px' }}
                />
                <div className="text-xs font-medium text-slate-500">{bar.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDirectory = () => (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title, mode, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Opportunity</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Seats</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOpportunities.map(opp => (
              <tr key={opp.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{opp.title}</div>
                      <div className="text-xs text-slate-500">ID: {opp.id} • Posted: {opp.postedDate}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-slate-700">{opp.type}</span>
                    <span className="text-xs capitalize text-slate-500">{opp.value}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-slate-600">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{opp.mode}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">{opp.seats}</td>
                <td className="px-6 py-4">{getStatusBadge(opp.status)}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => openDrawer(opp)}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
            {filteredOpportunities.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <Briefcase className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                  <p>No opportunities found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-6 animate-slide-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>Enterprise</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-blue-600 font-extrabold">Opportunities</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Opportunity Management</h2>
            <p className="text-xs text-slate-500 mt-1">
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
        <div className="flex items-center gap-1 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'directory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
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
            <div className="bg-slate-50 p-6 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(selectedOpportunity.status)}
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{selectedOpportunity.type}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedOpportunity.title}</h3>
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {selectedOpportunity.mode}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-slate-400" />
                      {selectedOpportunity.duration}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UsersRound className="h-4 w-4 text-slate-400" />
                      {selectedOpportunity.seats} Seats
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-200 px-4">
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
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${drawerTab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
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
                  <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" /> Description
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedOpportunity.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Eligibility</div>
                      <div className="text-sm font-medium text-slate-900">{selectedOpportunity.eligibility}</div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Stipend/Value</div>
                      <div className="text-sm font-medium text-slate-900">{selectedOpportunity.amount || selectedOpportunity.value}</div>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'mentors' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-slate-900">Assigned Mentors</h4>
                    <button className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100">
                      + Assign Mentor
                    </button>
                  </div>
                  
                  {opportunityMentors.length > 0 ? (
                    <div className="space-y-3">
                      {opportunityMentors.map(mentor => (
                        <div key={mentor.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                              {mentor.mentorId.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-slate-900">Mentor {mentor.mentorId}</div>
                              <div className="text-xs text-slate-500">{mentor.role} • Max {mentor.workload} students</div>
                            </div>
                          </div>
                          <button className="text-slate-400 hover:text-red-500">
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
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
                      <div key={app.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold">
                            {app.candidateName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-slate-900">{app.candidateName}</div>
                            <div className="text-xs text-slate-500">{app.appliedDate}</div>
                          </div>
                        </div>
                        <div className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-700">
                          {app.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
                      <FileText className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm">No applications received yet.</p>
                    </div>
                  )}
                </div>
              )}

              {drawerTab === 'analytics' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Total Views</div>
                      <div className="text-2xl font-bold text-slate-900">1,245</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Conversion Rate</div>
                      <div className="text-2xl font-bold text-slate-900">12.4%</div>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">Application Funnel</h4>
                    {/* Reuse funnel logic here for specific opportunity */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Applied</span>
                        <span className="font-bold text-slate-900">45</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full"><div className="h-full bg-blue-500 rounded-full w-[100%]"></div></div>
                      
                      <div className="flex justify-between items-center text-sm mt-4">
                        <span className="text-slate-600">Shortlisted</span>
                        <span className="font-bold text-slate-900">12</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full"><div className="h-full bg-amber-500 rounded-full w-[26%]"></div></div>
                      
                      <div className="flex justify-between items-center text-sm mt-4">
                        <span className="text-slate-600">Selected</span>
                        <span className="font-bold text-slate-900">4</span>
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
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-sm text-slate-900">{event.title}</div>
                        </div>
                        <div className="text-xs text-slate-500">{event.desc}</div>
                        <div className="text-xs text-slate-400 mt-2 font-medium">{event.date}</div>
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
