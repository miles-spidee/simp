'use client';
import { useState, useEffect } from 'react';
import PlacementPipeline from './PlacementPipeline';
import { PlacementService } from '@/src/services/placement.service';
import { Company } from '@/src/types/placement.types';
import { TrendingUp, Users, Building2, Briefcase, Search, Globe, Mail, Plus, Loader2 } from 'lucide-react';
import { Drawer } from '../ui/Drawer';

export default function PlacementDashboard() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'companies'>('pipeline');
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

  useEffect(() => {
    loadStats();
    loadCompanies();
  }, []);

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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-indigo-650" />
            Placement & Hiring
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Track student interviews, hiring pipelines, and corporate relationships.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAddCompanyOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all font-bold text-sm shadow-lg shadow-slate-900/10 cursor-pointer animate-fade-in"
          >
            <Building2 className="h-4 w-4" /> Add Company
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students Hired</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-1 font-mono">{hiredCount}</p>
          </div>
          <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Partner Companies</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-1 font-mono">{companies.length}</p>
          </div>
          <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-blue-500" /> Top Hiring Partners
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {topCompanies.length === 0 ? (
              <p className="text-xs text-slate-400">Loading top companies...</p>
            ) : (
              topCompanies.map(([name, count]) => (
                <div key={name} className="flex flex-col bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl shrink-0 min-w-[120px] max-w-[150px]">
                  <span className="text-xs font-bold text-slate-800 truncate" title={name}>{name}</span>
                  <span className="text-[10px] text-slate-500 font-bold mt-0.5">{count} Placed</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`pb-3 text-sm font-bold border-b-2 px-4 transition-all cursor-pointer ${
            activeTab === 'pipeline' 
              ? 'border-indigo-650 text-indigo-650' 
              : 'border-transparent text-slate-400 hover:text-slate-650'
          }`}
        >
          Hiring Pipeline
        </button>
        <button
          onClick={() => setActiveTab('companies')}
          className={`pb-3 text-sm font-bold border-b-2 px-4 transition-all cursor-pointer ${
            activeTab === 'companies' 
              ? 'border-indigo-650 text-indigo-650' 
              : 'border-transparent text-slate-400 hover:text-slate-650'
          }`}
        >
          Partner Companies
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === 'pipeline' ? (
        <PlacementPipeline />
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-5">
          {/* Search/Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search company name or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9.5 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-700 placeholder-slate-400"
              />
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider">Industry</span>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Industries</option>
                <option value="IT Services">IT Services</option>
                <option value="Product Development">Product Development</option>
              </select>
            </div>
          </div>

          {/* Companies List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-4">Company Name</th>
                  <th className="px-5 py-4">Industry</th>
                  <th className="px-5 py-4">Website</th>
                  <th className="px-5 py-4">HR Contact</th>
                  <th className="px-5 py-4">Active Openings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingCompanies ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading partner companies...
                    </td>
                  </tr>
                ) : filteredCompanies.map(comp => (
                  <tr key={comp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">{comp.name}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        comp.industry === 'Product Development' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-650'
                      }`}>
                        {comp.industry}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 font-mono font-medium">
                      <a href={comp.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-650 transition-colors">
                        <Globe className="w-3.5 h-3.5" />
                        {comp.website.replace('https://', '')}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-700">{comp.contactPerson}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                        <Mail className="w-3 h-3" />
                        {comp.contactEmail}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-slate-800">
                      {comp.activeRoles} roles
                    </td>
                  </tr>
                ))}
                {filteredCompanies.length === 0 && !loadingCompanies && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-400 font-medium">
                      No partner companies found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Name</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Pinesphere Tech Labs"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 cursor-pointer"
              >
                <option value="IT Services">IT Services</option>
                <option value="Product Development">Product Development</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Openings</label>
              <input
                type="number"
                min="1"
                required
                value={activeRoles}
                onChange={(e) => setActiveRoles(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-mono font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Website URL</label>
            <input
              type="url"
              required
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="e.g., https://pinesphere.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">HR Contact Person</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g., Jane Doe"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 placeholder-slate-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">HR Contact Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g., hr@pinesphere.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 mt-auto">
            <button
              type="button"
              onClick={() => setIsAddCompanyOpen(false)}
              className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
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

    </div>
  );
}
