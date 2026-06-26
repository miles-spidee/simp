'use client';
import { useState, useEffect } from 'react';
import { AlumniProfile } from '@/src/types/alumni.types';
import { AlumniService } from '@/src/services/alumni.service';
import { GraduationCap, Link, Briefcase, MapPin, Search, Filter } from 'lucide-react';

export default function AlumniDirectory() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlumni() {
      setLoading(true);
      try {
        const data = await AlumniService.getAlumni();
        setAlumni(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadAlumni();
  }, []);

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/50">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-gray-600" /> Global Alumni Network
        </h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search alumni..." 
              className="bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-10 text-center text-gray-500">Loading alumni network...</div>
        ) : (
          alumni.slice(0, 12).map(al => (
            <div key={al.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-600 text-lg shadow-inner">
                  {al.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 leading-tight">{al.name}</h3>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">{al.batch} • Class of {al.graduationYear}</p>
                </div>
                <a href={al.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Link className="h-5 w-5" />
                </a>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{al.currentDesignation} at <span className="font-semibold text-gray-900">{al.currentCompany}</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{al.careerHistory.find(c => c.isCurrent)?.location || 'Global'}</span>
                </div>
              </div>
              
              {al.isMentoring && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-medium">
                    Available for Mentoring
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
