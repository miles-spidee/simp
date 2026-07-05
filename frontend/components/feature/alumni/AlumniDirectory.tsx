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
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniProfile | null>(null);
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
            <div 
              key={al.id} 
              onClick={() => setSelectedAlumni(al)}
              className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(99,102,241,0.12)] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden flex flex-col justify-between min-h-[200px] cursor-pointer"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center font-extrabold text-indigo-600 text-lg shadow-sm border border-white/50 group-hover:scale-110 transition-transform duration-300">
                    {al.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="font-extrabold text-slate-800 leading-tight truncate group-hover:text-indigo-600 transition-colors text-[15px]">{al.name}</h3>
                    <p className="text-[10px] text-indigo-500 font-bold mt-1 uppercase tracking-wider">{al.batch} • Class of {al.graduationYear}</p>
                  </div>
                  <div className="flex gap-2">
                    {al.linkedInUrl && (
                      <a href={al.linkedInUrl} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 hover:bg-indigo-50 p-1.5 rounded-lg">
                        <Link className="h-4 w-4" />
                      </a>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteAlumni(al.id); }}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer bg-slate-50 hover:bg-rose-50 p-1.5 rounded-lg"
                      title="Delete Profile"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
                    <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center shrink-0">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <span className="truncate">
                      {al.currentDesignation} at <span className="font-bold text-slate-700">{al.currentCompany}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
                    <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center shrink-0">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <span>{al.careerHistory?.[0]?.location || 'Bangalore'}</span>
                  </div>
                </div>
              </div>
              
              {al.isMentoring && (
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
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

      {/* View Alumni Drawer */}
      <Drawer
        isOpen={!!selectedAlumni}
        onClose={() => setSelectedAlumni(null)}
        title="Alumni Profile Details"
      >
        {selectedAlumni && (
          <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto bg-slate-50">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center font-extrabold text-indigo-700 text-2xl shadow-sm border-2 border-white">
                {selectedAlumni.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-text-primary">{selectedAlumni.name}</h3>
                <p className="text-sm text-indigo-650 font-bold uppercase tracking-wider">{selectedAlumni.batch} • {selectedAlumni.graduationYear}</p>
                {selectedAlumni.isMentoring && (
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                    Active Peer Mentor
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Professional Details</h4>
              
              <div className="bg-white rounded-xl p-4 border border-border shadow-sm flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-text-secondary font-semibold">Current Role</p>
                  <p className="text-sm font-bold text-text-primary">{selectedAlumni.currentDesignation}</p>
                  <p className="text-sm text-text-secondary">{selectedAlumni.currentCompany}</p>
                </div>
              </div>

              {selectedAlumni.careerHistory && selectedAlumni.careerHistory.length > 0 && (
                <div className="bg-white rounded-xl p-4 border border-border shadow-sm flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-secondary font-semibold">Location</p>
                    <p className="text-sm font-bold text-text-primary">{selectedAlumni.careerHistory[0].location}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Contact & Links</h4>
              
              {selectedAlumni.email && (
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-border shadow-sm">
                  <Mail className="h-4.5 w-4.5 text-text-secondary" />
                  <a href={`mailto:${selectedAlumni.email}`} className="text-sm font-medium text-text-primary hover:text-indigo-650 transition-colors">
                    {selectedAlumni.email}
                  </a>
                </div>
              )}

              {selectedAlumni.linkedInUrl && (
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-border shadow-sm">
                  <Link className="h-4.5 w-4.5 text-text-secondary" />
                  <a href={selectedAlumni.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors truncate">
                    {selectedAlumni.linkedInUrl}
                  </a>
                </div>
              )}
            </div>
            
            <div className="mt-auto pt-6">
              <button
                onClick={() => setSelectedAlumni(null)}
                className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-slate-900/10 cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
