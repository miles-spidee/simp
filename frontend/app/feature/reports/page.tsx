"use client";

import React, { useEffect, useState } from 'react';
import { ReportService } from '@/src/services/report.service';
import { ReportRecord, ReportTemplate } from '@/src/types/report.types';
import { FileBarChart, Loader2, DownloadCloud, Play, Calendar, FileText } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';

export default function ReportCenterPage() {
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [reports, setReports] = useState<ReportRecord[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tpls, reps] = await Promise.all([
        ReportService.getTemplates(),
        ReportService.getReports()
      ]);
      setTemplates(tpls);
      setReports(reps);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (templateId: string) => {
    const newReport = await ReportService.generateReport(templateId);
    setReports([newReport, ...reports]);
  };

  if (!hasPermission('report.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500">
        <p>You do not have permission to view reports.</p>
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileBarChart className="w-6 h-6 text-rose-600" />
          Report Center
        </h1>
        <p className="text-slate-500 text-sm mt-1">Generate, schedule, and view system reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {templates.map(tpl => (
          <div key={tpl.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 text-slate-400 mb-3">
              <FileText className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-bold">{tpl.category}</span>
            </div>
            <h3 className="font-bold text-slate-800 mb-1">{tpl.name}</h3>
            <p className="text-xs text-slate-500 mb-4 flex-grow">{tpl.description}</p>
            <button 
              onClick={() => handleGenerate(tpl.id)}
              className="w-full mt-auto flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3" />
              Generate
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Generated Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Report Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Generated Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{report.name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {new Date(report.generatedDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      report.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      report.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {report.status === 'Completed' && hasPermission('report.export') && (
                      <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
                        <DownloadCloud className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
