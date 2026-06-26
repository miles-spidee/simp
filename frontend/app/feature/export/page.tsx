"use client";

import React, { useEffect, useState } from 'react';
import { ExportService } from '@/src/services/export.service';
import { ExportJob, ExportSchedule } from '@/src/types/export.types';
import { DownloadCloud, Loader2, Clock, CheckCircle2, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';

export default function ExportCenterPage() {
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [schedules, setSchedules] = useState<ExportSchedule[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsData, schedulesData] = await Promise.all([
        ExportService.getExportJobs(),
        ExportService.getExportSchedules()
      ]);
      setJobs(jobsData);
      setSchedules(schedulesData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission('export.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500">
        <p>You do not have permission to view export jobs.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <DownloadCloud className="w-6 h-6 text-emerald-600" />
            Data Export Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage bulk data exports and scheduled deliveries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Jobs */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-800">Recent Export Jobs</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 cursor-pointer">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {jobs.slice(0, 5).map(job => (
              <div key={job.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800">{job.module} Export</span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      {job.format}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Requested {new Date(job.requestedAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {job.status === 'Completed' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {job.status === 'Processing' && <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />}
                  {job.status === 'Failed' && <AlertCircle className="w-5 h-5 text-rose-500" />}
                  
                  {job.status === 'Completed' && job.fileUrl && (
                    <a href={job.fileUrl} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Download</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Exports */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-800">Scheduled Deliveries</h2>
            {hasPermission('export.manage') && (
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 cursor-pointer">
                <Plus className="w-4 h-4" />
                New Schedule
              </button>
            )}
          </div>
          <div className="divide-y divide-slate-100">
            {schedules.map(schedule => (
              <div key={schedule.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-800">{schedule.name}</h3>
                    <p className="text-sm text-slate-500">{schedule.module} • {schedule.format}</p>
                  </div>
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border border-blue-100">
                    {schedule.frequency}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-4">
                  <span>To: {schedule.recipients.join(', ')}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Next: {new Date(schedule.nextRun).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
