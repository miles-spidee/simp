"use client";

import React, { useEffect, useState } from 'react';
import { ReportService } from '@/src/services/report.service';
import { ReportRecord, ReportTemplate } from '@/src/types/report.types';
import { FileBarChart, Loader2, DownloadCloud, Play, Calendar, FileText, User as UserIcon, HardDrive } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';
import { EnhancedTable } from '@/components/feature/ui/Table';

export default function ReportCenterPage() {

  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [reports, setReports] = useState<ReportRecord[]>([]);
  
  // Track selected format for each template card
  const [formats, setFormats] = useState<Record<string, string>>({});

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

  const handleGenerate = async (templateId: string, format: string) => {
    try {
      const newReport = await ReportService.generateReport(templateId, format);
      if (newReport) {
        setReports([newReport, ...reports]);
      }
    } catch (e) {
      console.error('Error generating report:', e);
    }
  };

  if (!hasPermission('reports.view') && !hasPermission('report.view')) {
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
        <p className="text-text-secondary text-sm mt-1">Generate, view, and export system reports with custom parameters.</p>
      </div>

      {/* Report Templates Section */}
      <h2 className="text-lg font-bold text-text-primary mb-3">Available Report Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {templates.map(tpl => (
          <div key={tpl.id} className="bg-white p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-2 text-rose-600 mb-3">
                <FileText className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-bold">{tpl.category}</span>
              </div>
              <h3 className="font-bold text-text-primary mb-1">{tpl.name}</h3>
              <p className="text-xs text-text-secondary mb-4">{tpl.description}</p>
            </div>
            
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border w-full">
              <select 
                value={formats[tpl.id] || 'PDF'} 
                onChange={(e) => setFormats({...formats, [tpl.id]: e.target.value})}
                className="bg-slate-50 border border-border text-text-secondary text-xs rounded-lg p-2 focus:ring-rose-500 focus:border-rose-500 font-medium cursor-pointer"
              >
                <option value="PDF">PDF Document</option>
                <option value="Excel">Excel Spreadsheet</option>
                <option value="CSV">CSV Comma Separated</option>
              </select>
              <button 
                onClick={() => handleGenerate(tpl.id, formats[tpl.id] || 'PDF')}
                className="flex-grow flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                Generate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Generated Reports Section */}
      <h2 className="text-lg font-bold text-text-primary mb-3">Report Generation History</h2>
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
            key: 'format', 
            label: 'Format',
            render: (report: ReportRecord) => (
              <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-xs font-bold border border-rose-100">
                {report.format || 'PDF'}
              </span>
            )
          },
          { 
            key: 'sizeBytes', 
            label: 'Size',
            render: (report: ReportRecord) => {
              const size = report.sizeBytes || 0;
              if (size === 0) return <span className="text-text-secondary text-xs">—</span>;
              const kb = size / 1024;
              const sizeText = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
              return (
                <span className="flex items-center gap-1 text-text-secondary text-xs">
                  <HardDrive className="w-3 h-3" />
                  {sizeText}
                </span>
              );
            }
          },
          { 
            key: 'generatedBy', 
            label: 'Generated By',
            render: (report: ReportRecord) => (
              <span className="flex items-center gap-1 text-text-secondary text-xs">
                <UserIcon className="w-3 h-3 text-slate-400" />
                {report.generatedBy}
              </span>
            )
          },
          { 
            key: 'generatedDate', 
            label: 'Generated Date',
            render: (report: ReportRecord) => (
              <span className="flex items-center gap-1.5 text-text-secondary text-xs">
                <Calendar className="w-3 h-3" />
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
              report.status === 'Completed' && (hasPermission('reports.export') || hasPermission('report.export')) ? (
                <button 
                  onClick={async () => {
                    try {
                      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                      const response = await fetch(`${baseUrl}/api/v1/report/${report.id}/download`, {
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                        }
                      });
                      if (!response.ok) throw new Error('Download failed');
                      
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      
                      const format = (report.format || 'PDF').toLowerCase();
                      const ext = format === 'pdf' ? 'pdf' : (format === 'csv' ? 'csv' : 'xlsx');
                      link.download = `${report.name.toLowerCase().replace(/ /g, '_')}.${ext}`;
                      
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch (e) {
                      console.error('Download error:', e);
                    }
                  }}
                  className="text-rose-600 hover:text-rose-800 cursor-pointer flex items-center justify-end w-full"
                  title={`Download ${report.format || 'PDF'}`}
                >
                  <DownloadCloud className="w-4 h-4" />
                </button>
              ) : null
            )
          }
        ]}
        searchPlaceholder="Search report history..."
        itemsPerPage={10}
        emptyMessage="No reports generated yet"
      />
    </div>
  );
}
