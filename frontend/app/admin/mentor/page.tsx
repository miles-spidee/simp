"use client";

import React from 'react';
import MentorDashboard from '@/components/dashboards/MentorDashboard';

export default function MentorDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
        <h1 className="text-xl font-bold text-slate-900">Mentor Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of the mentor ecosystem — profiles, assignments, and batch mappings.</p>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <MentorDashboard />
      </div>
    </div>
  );
}
