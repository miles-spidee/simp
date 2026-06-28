'use client';
import { useState, useEffect } from 'react';
import AlumniDirectory from './AlumniDirectory';
import { AlumniService } from '@/src/services/alumni.service';
import { GraduationCap, Users } from 'lucide-react';

export default function AlumniDashboard() {
  const [totalAlumni, setTotalAlumni] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const total = await AlumniService.getTotalAlumniCount();
      setTotalAlumni(total);
    }
    loadStats();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Alumni Management</h1>
          <p className="text-sm text-text-secondary mt-1">Engage with past interns, track career progression, and foster mentoring.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">Total Alumni Network</p>
            <p className="text-3xl font-bold text-text-primary mt-1">{totalAlumni}</p>
          </div>
          <Users className="h-10 w-10 text-blue-100" />
        </div>
      </div>

      <AlumniDirectory />
    </div>
  );
}
