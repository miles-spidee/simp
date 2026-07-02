"use client";

import React, { useEffect, useState } from 'react';
import { ReportService } from '@/src/services/report.service';
import { ReportRecord, ReportTemplate } from '@/src/types/report.types';
import { FileBarChart, Loader2, DownloadCloud, Play, Calendar, FileText } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';
import { EnhancedTable } from '@/components/feature/ui/Table';

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
      <div className="flex h-[50vh] items-center justify-center text-text-secondary">
        <p>You do not have permission to view reports.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-text-secondary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <FileBarChart className="w-6 h-6 text-rose-600" />
          Report Center
        </h1>
        <p className="text-text-secondary text-sm mt-1">Generate, schedule, and view system reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {templates.map(tpl => (
          <div key={tpl.id} className="bg-white p-5 rounded-xl border border-border shadow-sm flex flex-col">
            <div className="flex items-center gap-2 text-text-secondary mb-3">
              <FileText className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-bold">{tpl.category}</span>
            </div>
            <h3 className="font-bold text-text-primary mb-1">{tpl.name}</h3>
            <p className="text-xs text-text-secondary mb-4 flex-grow">{tpl.description}</p>
            <button 
              onClick={() => handleGenerate(tpl.id)}
              className="w-full mt-auto flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-border text-text-primary py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3" />
              Generate
            </button>
          </div>
        ))}
      </div>

      <EnhancedTable
        data={reports}
        columns={[
          { key: 'name', label: 'Report Name' },
          { 
            key: 'type', 
            label: 'Category',
            render: (report: ReportRecord) => (
              <span className="bg-slate-100 text-text-secondary px-2 py-1 rounded text-xs font-medium">
                {report.type}
              </span>
            )
          },
          { 
            key: 'generatedDate', 
            label: 'Generated Date',
            render: (report: ReportRecord) => (
              <span className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-text-secondary" />
                {new Date(report.generatedDate).toLocaleDateString()}
              </span>
            )
          },
          { 
            key: 'status', 
            label: 'Status',
            render: (report: ReportRecord) => (
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                report.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                report.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                'bg-rose-100 text-rose-700'
              }`}>
                {report.status}
              </span>
            )
          },
          { 
            key: 'actions', 
            label: 'Actions',
            className: 'text-right',
            render: (report: ReportRecord) => (
              report.status === 'Completed' && hasPermission('report.export') ? (
                <button 
                  onClick={async () => {
                    try {
                      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                      const response = await fetch(`${baseUrl}/api/v1/report/${report.id}/download`);
                      if (!response.ok) throw new Error('Download failed');
                      
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${report.name.toLowerCase().replace(/ /g, '_')}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch (e) {
                      console.error('Download error:', e);
                    }
                  }}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  title="Download PDF"
                >
                  <DownloadCloud className="w-4 h-4" />
                </button>
              ) : null
            )
          }
        ]}
        searchPlaceholder="Search reports..."
        itemsPerPage={10}
        emptyMessage="No reports generated yet"
      />
    </div>
  );
}
