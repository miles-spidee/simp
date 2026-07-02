'use client';
import { useState, useEffect } from 'react';
import PlacementPipeline from './PlacementPipeline';
import { PlacementService } from '@/src/services/placement.service';
import { Company, PlacementOpportunity } from '@/src/types/placement.types';
import { TrendingUp, Users, Building2, Briefcase, Search, Globe, Mail, Plus, Loader2, Trash2, Award, Sparkles, CheckCircle2, AlertCircle, Filter, MapPin } from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { useAuth } from '@/src/context/AuthContext';
import { usePermissions } from '@/src/hooks/usePermissions';

export default function PlacementDashboard() {
  const { user } = useAuth();
  const { isSuperAdmin } = usePermissions();
  
  const [activeTab, setActiveTab] = useState<'pipeline' | 'companies' | 'opportunities'>(
    user?.roleName === 'STUDENT' ? 'opportunities' : 'pipeline'
  );
  
  const [hiredCount, setHiredCount] = useState(0);
  const [topCompanies, setTopCompanies] = useState<[string, number][]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // Add Company Drawer state
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('IT Services');
  const [website, setWebsite] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [activeRoles, setActiveRoles] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Filter partner companies
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');

  // Placement Opportunities state
  const [opportunities, setOpportunities] = useState<PlacementOpportunity[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);
  const [performanceTier, setPerformanceTier] = useState<string>('');
  const [performanceScore, setPerformanceScore] = useState<number | undefined>(undefined);
  const [previewTier, setPreviewTier] = useState<'ALL' | 'TOP' | 'MID' | 'SMALL'>('ALL');

  // Add Opportunity Drawer state
  const [isAddOppOpen, setIsAddOppOpen] = useState(false);
  const [oppTitle, setOppTitle] = useState('');
  const [oppDescription, setOppDescription] = useState('');
  const [oppPackage, setOppPackage] = useState<number>(6.0);
  const [oppLocation, setOppLocation] = useState('Bangalore');
  const [oppTier, setOppTier] = useState<'TOP' | 'MID' | 'SMALL'>('MID');
  const [oppRequirements, setOppRequirements] = useState('');
  const [oppCompanyId, setOppCompanyId] = useState('');
  const [isSubmittingOpp, setIsSubmittingOpp] = useState(false);

  useEffect(() => {
    loadStats();
    loadCompanies();
    loadOpportunities();
  }, [activeTab]);

  const loadStats = async () => {
    const hired = await PlacementService.getStudentsHiredCount();
    const top = await PlacementService.getTopCompanies();
    setHiredCount(hired);
    setTopCompanies(top);
  };

  const loadCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const data = await PlacementService.getCompanies();
      setCompanies(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const loadOpportunities = async () => {
    setLoadingOpportunities(true);
    try {
      const studentId = user?.roleName === 'STUDENT' ? user?.user_id : undefined;
      const res = await PlacementService.getOpportunities(studentId);
      setOpportunities(res.opportunities || []);
      setPerformanceTier(res.performanceTier || 'ALL');
      setPerformanceScore(res.performanceScore);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOpportunities(false);
    }
  };

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppTitle.trim() || !oppDescription.trim()) return;

    setIsSubmittingOpp(true);
    try {
      await PlacementService.createOpportunity({
        companyId: oppCompanyId || undefined,
        title: oppTitle,
        description: oppDescription,
        packageLpa: oppPackage,
        location: oppLocation,
        tier: oppTier,
        requirements: oppRequirements
      });

      // Clear
      setOppTitle('');
      setOppDescription('');
      setOppPackage(6.0);
      setOppLocation('Bangalore');
      setOppTier('MID');
      setOppRequirements('');
      setIsAddOppOpen(false);

      await loadOpportunities();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingOpp(false);
    }
  };

  const handleDeleteOpportunity = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job opportunity?")) return;
    try {
      await PlacementService.deleteOpportunity(id);
      await loadOpportunities();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setIsSubmitting(true);
    try {
      await PlacementService.createCompany({
        name: companyName,
        industry,
        website,
        contactPerson,
        contactEmail,
        activeRoles
      });

      // Reset
      setCompanyName('');
      setWebsite('');
      setContactPerson('');
      setContactEmail('');
      setActiveRoles(1);
      setIsAddCompanyOpen(false);

      // Refresh
      await loadCompanies();
      await loadStats();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCompanies = companies.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          comp.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = industryFilter === 'All' || comp.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-indigo-650" />
            Placement & Hiring
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">Track student interviews, hiring pipelines, and corporate relationships.</p>
        </div>
        {user?.roleName !== 'STUDENT' && (
          <div className="flex gap-3">
            <button 
              onClick={() => setIsAddCompanyOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border text-text-primary rounded-xl hover:bg-slate-50 transition-all font-bold text-sm cursor-pointer animate-fade-in"
            >
              <Building2 className="h-4 w-4" /> Add Company
            </button>
            <button 
              onClick={() => setIsAddOppOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all font-bold text-sm shadow-lg shadow-slate-900/10 cursor-pointer animate-fade-in"
            >
              <Plus className="h-4 w-4" /> Add Opportunity
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Students Hired</p>
            <p className="text-3xl font-extrabold text-text-primary mt-1 font-mono">{hiredCount}</p>
          </div>
          <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Partner Companies</p>
            <p className="text-3xl font-extrabold text-text-primary mt-1 font-mono">{companies.length}</p>
          </div>
          <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-border shadow-sm">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-blue-500" /> Top Hiring Partners
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {topCompanies.length === 0 ? (
              <p className="text-xs text-text-secondary">Loading top companies...</p>
            ) : (
              topCompanies.map(([name, count]) => (
                <div key={name} className="flex flex-col bg-slate-50 border border-border px-3 py-1.5 rounded-xl shrink-0 min-w-[120px] max-w-[150px]">
                  <span className="text-xs font-bold text-text-primary truncate" title={name}>{name}</span>
                  <span className="text-[10px] text-text-secondary font-bold mt-0.5">{count} Placed</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-border">
        {user?.roleName !== 'STUDENT' && (
          <>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`pb-3 text-sm font-bold border-b-2 px-4 transition-all cursor-pointer ${
                activeTab === 'pipeline' 
                  ? 'border-indigo-650 text-indigo-650' 
                  : 'border-transparent text-text-secondary hover:text-indigo-650'
              }`}
            >
              Hiring Pipeline
            </button>
            <button
              onClick={() => setActiveTab('companies')}
              className={`pb-3 text-sm font-bold border-b-2 px-4 transition-all cursor-pointer ${
                activeTab === 'companies' 
                  ? 'border-indigo-650 text-indigo-650' 
                  : 'border-transparent text-text-secondary hover:text-indigo-650'
              }`}
            >
              Partner Companies
            </button>
          </>
        )}
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`pb-3 text-sm font-bold border-b-2 px-4 transition-all cursor-pointer ${
            activeTab === 'opportunities' 
              ? 'border-indigo-650 text-indigo-650' 
              : 'border-transparent text-text-secondary hover:text-indigo-650'
          }`}
        >
          Placement Opportunities
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === 'pipeline' && user?.roleName !== 'STUDENT' && (
        <PlacementPipeline />
      )}
      
      {activeTab === 'companies' && user?.roleName !== 'STUDENT' && (
        <div className="bg-white border border-border rounded-2xl shadow-sm p-6 space-y-5 animate-fade-in">
          {/* Search/Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Search company name or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl pl-9.5 pr-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-all font-medium text-text-primary placeholder-slate-400"
              />
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-text-secondary uppercase tracking-wider">Industry</span>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="bg-slate-50 border border-border rounded-xl px-3 py-2 font-bold text-text-primary focus:outline-none cursor-pointer"
              >
                <option value="All">All Industries</option>
                <option value="IT Services">IT Services</option>
                <option value="Product Development">Product Development</option>
              </select>
            </div>
          </div>

          {/* Companies List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-secondary">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold tracking-wider text-text-secondary border-b border-border">
                <tr>
                  <th className="px-5 py-4">Company Name</th>
                  <th className="px-5 py-4">Industry</th>
                  <th className="px-5 py-4">Website</th>
                  <th className="px-5 py-4">HR Contact</th>
                  <th className="px-5 py-4">Active Openings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loadingCompanies ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-text-secondary">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading partner companies...
                    </td>
                  </tr>
                ) : filteredCompanies.map(comp => (
                  <tr key={comp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-text-primary">{comp.name}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        comp.industry === 'Product Development' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-text-secondary'
                      }`}>
                        {comp.industry}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-text-secondary font-mono font-medium">
                      <a href={comp.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-650 transition-colors">
                        <Globe className="w-3.5 h-3.5" />
                        {comp.website.replace('https://', '')}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-text-primary">{comp.contactPerson}</div>
                      <div className="text-[10px] text-text-secondary flex items-center gap-1 mt-0.5 font-medium">
                        <Mail className="w-3 h-3" />
                        {comp.contactEmail}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-text-primary">
                      {comp.activeRoles} openings
                    </td>
                  </tr>
                ))}
                {filteredCompanies.length === 0 && !loadingCompanies && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-text-secondary font-medium">
                      No partner companies found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'opportunities' && (
        <div className="space-y-6 animate-fade-in">
          {/* Student Status Banner */}
          {user?.roleName === 'STUDENT' && performanceTier && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-150 p-5 rounded-2xl flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl text-indigo-650 shadow-sm shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Academic Performance Audit</h3>
                <p className="text-xs text-text-secondary mt-1 font-medium leading-relaxed">
                  Your current academic performance is rated at <span className="font-bold text-indigo-650">{performanceScore}% ({performanceTier === 'TOP' ? 'High Performer' : performanceTier === 'MID' ? 'Average Performer' : 'Trainee Performer'})</span>.
                  We have dynamically curated the placement opportunities matching your grade bracket. Keep up the high standard!
                </p>
              </div>
            </div>
          )}

          {/* Superadmin Preview Controls */}
          {user?.roleName !== 'STUDENT' && (
            <div className="bg-slate-50 border border-border p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <Filter className="w-4 h-4 text-text-secondary" />
                <span className="font-bold text-text-secondary uppercase tracking-wider">Superadmin Filter Preview:</span>
                <select
                  value={previewTier}
                  onChange={(e) => setPreviewTier(e.target.value as any)}
                  className="bg-white border border-border rounded-xl px-3 py-1.5 font-bold text-text-primary focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Show All Placements</option>
                  <option value="TOP">High Performer Preview (TOP + MID)</option>
                  <option value="MID">Average Performer Preview (MID + SMALL)</option>
                  <option value="SMALL">Low Performer Preview (SMALL only)</option>
                </select>
              </div>
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                Previewing: {previewTier} tier
              </div>
            </div>
          )}

          {/* Opportunities Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingOpportunities ? (
              <div className="col-span-full py-12 text-center text-text-secondary">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-text-secondary" />
                Loading opportunities...
              </div>
            ) : (
              (user?.roleName === 'STUDENT' ? opportunities : 
                opportunities.filter(opp => {
                  if (previewTier === 'ALL') return true;
                  if (previewTier === 'TOP') return opp.tier === 'TOP' || opp.tier === 'MID';
                  if (previewTier === 'MID') return opp.tier === 'MID' || opp.tier === 'SMALL';
                  if (previewTier === 'SMALL') return opp.tier === 'SMALL';
                  return true;
                })
              ).map(opp => {
                const isTop = opp.tier === 'TOP';
                const isMid = opp.tier === 'MID';
                return (
                  <div 
                    key={opp.id} 
                    className={`bg-white rounded-2xl border p-5 flex flex-col justify-between min-h-[220px] transition-all relative overflow-hidden group hover:shadow-md ${
                      isTop ? 'border-violet-250 bg-gradient-to-br from-white to-violet-50/10' : isMid ? 'border-blue-150' : 'border-border'
                    }`}
                  >
                    {isTop && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-500"></div>
                    )}
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isTop ? 'bg-violet-50 text-violet-700' : isMid ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-text-secondary'
                          }`}>
                            {opp.tier} Tier
                          </span>
                          <h3 className="font-bold text-text-primary text-base mt-2 group-hover:text-indigo-650 transition-colors leading-tight">
                            {opp.title}
                          </h3>
                        </div>
                        {user?.roleName !== 'STUDENT' && (
                          <button
                            onClick={() => handleDeleteOpportunity(opp.id)}
                            className="p-1 text-text-secondary hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Opportunity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="mt-4 space-y-1.5 text-xs text-text-secondary">
                        <div className="font-bold text-text-primary text-sm flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-text-secondary" />
                          {opp.companyName}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{opp.location}</span>
                        </div>
                        {opp.requirements && (
                          <div className="bg-slate-50 p-2 rounded-lg text-[10px] font-mono leading-relaxed mt-2 text-slate-650 border border-slate-100 max-h-[50px] overflow-y-auto">
                            {opp.requirements}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-5 pt-3.5 border-t border-border flex justify-between items-center bg-slate-50/50 -mx-5 -mb-5 px-5 py-3 rounded-b-2xl">
                      <span className="text-xs font-bold text-text-secondary">Package / Stipend</span>
                      <span className="text-sm font-extrabold text-indigo-650 font-mono">
                        {opp.packageLpa >= 1000 ? `${opp.packageLpa.toLocaleString()} INR/mo` : `${opp.packageLpa} LPA`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {!loadingOpportunities && opportunities.length === 0 && (
              <div className="col-span-full py-12 text-center text-text-secondary">
                No job placements opportunities available.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- DRAWERS --- */}

      {/* Add Company Drawer */}
      <Drawer
        isOpen={isAddCompanyOpen}
        onClose={() => setIsAddCompanyOpen(false)}
        title="Register New Partner Company"
      >
        <form onSubmit={handleCreateCompany} className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Company Name</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Pinesphere Tech Labs"
              className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary cursor-pointer"
              >
                <option value="IT Services">IT Services</option>
                <option value="Product Development">Product Development</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Active Openings</label>
              <input
                type="number"
                min="1"
                required
                value={activeRoles}
                onChange={(e) => setActiveRoles(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono font-bold text-text-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Website URL</label>
            <input
              type="url"
              required
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="e.g., https://pinesphere.com"
              className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">HR Contact Person</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g., Jane Doe"
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary placeholder-slate-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">HR Contact Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g., hr@pinesphere.com"
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-auto">
            <button
              type="button"
              onClick={() => setIsAddCompanyOpen(false)}
              className="flex-1 py-3 border border-border text-text-primary font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-900/10"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register Company'
              )}
            </button>
          </div>
        </form>
      </Drawer>
      {/* Add Opportunity Drawer */}
      <Drawer
        isOpen={isAddOppOpen}
        onClose={() => setIsAddOppOpen(false)}
        title="Post New Placement Opportunity"
      >
        <form onSubmit={handleCreateOpportunity} className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Opportunity Title</label>
            <input
              type="text"
              required
              value={oppTitle}
              onChange={(e) => setOppTitle(e.target.value)}
              placeholder="e.g., Senior Systems Analyst"
              className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary placeholder-slate-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Role Description</label>
            <textarea
              required
              rows={3}
              value={oppDescription}
              onChange={(e) => setOppDescription(e.target.value)}
              placeholder="Outline role responsibilities and job criteria..."
              className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary placeholder-slate-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Company Partner</label>
              <select
                value={oppCompanyId}
                onChange={(e) => setOppCompanyId(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary cursor-pointer"
              >
                <option value="">-- Select Partner --</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Target Performer Tier</label>
              <select
                value={oppTier}
                onChange={(e) => setOppTier(e.target.value as any)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary cursor-pointer"
              >
                <option value="TOP">High Performer Tier (TOP)</option>
                <option value="MID">Average Performer Tier (MID)</option>
                <option value="SMALL">Trainee Performer Tier (SMALL)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Package (LPA)</label>
              <input
                type="number"
                step="any"
                required
                value={oppPackage}
                onChange={(e) => setOppPackage(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono font-bold text-text-primary"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Job Location</label>
              <input
                type="text"
                required
                value={oppLocation}
                onChange={(e) => setOppLocation(e.target.value)}
                placeholder="e.g., Bangalore"
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Technical Requirements</label>
            <input
              type="text"
              value={oppRequirements}
              onChange={(e) => setOppRequirements(e.target.value)}
              placeholder="e.g., Java, React, SQL"
              className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary placeholder-slate-400"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-auto">
            <button
              type="button"
              onClick={() => setIsAddOppOpen(false)}
              className="flex-1 py-3 border border-border text-text-primary font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingOpp}
              className="flex-1 py-3 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-900/10"
            >
              {isSubmittingOpp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Job'
              )}
            </button>
          </div>
        </form>
      </Drawer>

    </div>
  );
}
