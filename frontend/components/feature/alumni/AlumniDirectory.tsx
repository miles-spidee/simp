'use client';
import { useState, useEffect } from 'react';
import { AlumniProfile } from '@/src/types/alumni.types';
import { AlumniService } from '@/src/services/alumni.service';
import { GraduationCap, Link, Briefcase, MapPin, Search, Filter, Plus, Loader2, Mail, CheckCircle, Trash2 } from 'lucide-react';
import { Drawer } from '../ui/Drawer';

export default function AlumniDirectory() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Alumni Drawer state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [batch, setBatch] = useState('Class of 2025');
  const [graduationYear, setGraduationYear] = useState<number>(2025);
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentDesignation, setCurrentDesignation] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [isMentoring, setIsMentoring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [mentoringFilter, setMentoringFilter] = useState<'All' | 'Mentoring' | 'Not Mentoring'>('All');
  const [yearFilter, setYearFilter] = useState<'All' | '2026' | '2025' | '2024' | '2023'>('All');

  useEffect(() => {
    loadAlumni();
  }, []);

  const loadAlumni = async () => {
    setLoading(true);
    try {
      const data = await AlumniService.getAlumni();
      setAlumni(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await AlumniService.createAlumni({
        name,
        email,
        phone,
        batch,
        graduationYear,
        currentCompany: currentCompany || 'Self-Employed',
        currentDesignation: currentDesignation || 'Software Engineer',
        linkedInUrl,
        isMentoring
      });

      // Clear fields
      setName('');
      setEmail('');
      setPhone('');
      setBatch('Class of 2025');
      setGraduationYear(2025);
      setCurrentCompany('');
      setCurrentDesignation('');
      setLinkedInUrl('');
      setIsMentoring(false);
      setIsAddOpen(false);

      // Refresh
      await loadAlumni();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAlumni = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this alumni profile? This action will permanently remove the record from the database.")) return;
    try {
      await AlumniService.deleteAlumni(id);
      await loadAlumni();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered alumni profiles
  const filteredAlumni = alumni.filter(al => {
    const matchesSearch = al.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          al.currentCompany.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          al.currentDesignation.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesMentoring = true;
    if (mentoringFilter === 'Mentoring') matchesMentoring = al.isMentoring;
    else if (mentoringFilter === 'Not Mentoring') matchesMentoring = !al.isMentoring;

    let matchesYear = true;
    if (yearFilter !== 'All') matchesYear = String(al.graduationYear) === yearFilter;

    return matchesSearch && matchesMentoring && matchesYear;
  });

  return (
    <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden mt-6 font-sans">
      
      {/* Header section with search filters and Add Profile button */}
      <div className="p-5 border-b border-border flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-text-primary tracking-tight flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-650" /> Global Alumni Network
          </h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-grow sm:w-64">
            <Search className="h-4 w-4 text-text-secondary absolute left-3 top-3.5" />
            <input 
              type="text" 
              placeholder="Search alumni..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-border rounded-xl pl-9.5 pr-4 py-2.5 text-xs focus:outline-none focus:border-primary font-medium text-text-primary"
            />
          </div>

          {/* Mentoring Filter selector */}
          <select
            value={mentoringFilter}
            onChange={(e) => setMentoringFilter(e.target.value as any)}
            className="bg-white border border-border rounded-xl px-3 py-2 text-xs font-bold text-text-primary focus:outline-none cursor-pointer"
          >
            <option value="All">All Mentoring Status</option>
            <option value="Mentoring">Active Mentors Only</option>
            <option value="Not Mentoring">Not Mentoring</option>
          </select>

          {/* Graduation Year selector */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value as any)}
            className="bg-white border border-border rounded-xl px-3 py-2 text-xs font-bold text-text-primary focus:outline-none cursor-pointer"
          >
            <option value="All">All Class Years</option>
            <option value="2026">Class of 2026</option>
            <option value="2025">Class of 2025</option>
            <option value="2024">Class of 2024</option>
            <option value="2023">Class of 2023</option>
          </select>

          <button 
            onClick={() => setIsAddOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all font-bold text-xs cursor-pointer shadow-md shadow-slate-900/10"
          >
            <Plus className="h-4 w-4" /> Add Alumni
          </button>
        </div>
      </div>

      {/* Alumni Cards Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-text-secondary font-semibold">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading alumni network directory...
          </div>
        ) : (
          filteredAlumni.slice(0, 12).map(al => (
            <div key={al.id} className="bg-white rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col justify-between min-h-[190px]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div>
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center font-extrabold text-indigo-650 text-base shadow-sm">
                    {al.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text-primary leading-tight truncate group-hover:text-indigo-650 transition-colors">{al.name}</h3>
                    <p className="text-[10px] text-indigo-650 font-bold mt-0.5 uppercase tracking-wider">{al.batch} • Class of {al.graduationYear}</p>
                  </div>
                  <div className="flex gap-2">
                    {al.linkedInUrl && (
                      <a href={al.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-indigo-650 transition-colors">
                        <Link className="h-4.5 w-4.5" />
                      </a>
                    )}
                    <button 
                      onClick={() => handleDeleteAlumni(al.id)}
                      className="text-text-secondary hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Profile"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
                    <Briefcase className="h-4 w-4 text-text-secondary shrink-0" />
                    <span className="truncate">
                      {al.currentDesignation} at <span className="font-bold text-text-primary">{al.currentCompany}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
                    <MapPin className="h-4 w-4 text-text-secondary shrink-0" />
                    <span>{al.careerHistory?.[0]?.location || 'Bangalore'}</span>
                  </div>
                </div>
              </div>
              
              {al.isMentoring && (
                <div className="mt-4 pt-3.5 border-t border-border flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                    Active Peer Mentor
                  </span>
                </div>
              )}
            </div>
          ))
        )}

        {filteredAlumni.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-text-secondary font-medium">
            No alumni match current search filters.
          </div>
        )}
      </div>

      {/* --- DRAWERS --- */}

      {/* Add Alumni Drawer */}
      <Drawer
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Alumni Directory Profile"
      >
        <form onSubmit={handleCreateAlumni} className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., John Doe"
              className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Batch Name</label>
              <input
                type="text"
                required
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                placeholder="e.g., Class of 2025"
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Graduation Year</label>
              <input
                type="number"
                required
                value={graduationYear}
                onChange={(e) => setGraduationYear(parseInt(e.target.value) || 2025)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono font-bold text-text-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Contact Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., john@example.com"
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Phone number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., 9876543210"
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Current Company</label>
              <input
                type="text"
                required
                value={currentCompany}
                onChange={(e) => setCurrentCompany(e.target.value)}
                placeholder="e.g., Google"
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Designation</label>
              <input
                type="text"
                required
                value={currentDesignation}
                onChange={(e) => setCurrentDesignation(e.target.value)}
                placeholder="e.g., Senior Developer"
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">LinkedIn Profile URL</label>
            <input
              type="url"
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
              placeholder="e.g., https://linkedin.com/in/username"
              className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isMentoring"
              checked={isMentoring}
              onChange={(e) => setIsMentoring(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-border text-indigo-650 focus:ring-primary cursor-pointer"
            />
            <label htmlFor="isMentoring" className="text-xs font-bold text-text-secondary cursor-pointer">
              Available for Student Mentoring
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-auto">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="flex-1 py-3 border border-border text-text-primary font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-slate-900/10"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Adding Profile...
                </>
              ) : (
                'Add Alumni Profile'
              )}
            </button>
          </div>
        </form>
      </Drawer>

    </div>
  );
}
