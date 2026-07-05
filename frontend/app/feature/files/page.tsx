"use client";

import React, { useEffect, useState } from 'react';
import { AlertTriangle,  HardDrive, File, Clock, Search, Filter, Plus, Upload, Download, Eye, Trash, ArrowRight  } from 'lucide-react';
import { fileService } from '@/src/services/file.service';
import { CommonFile } from '@/src/types/common-files.types';
import { Drawer } from '@/components/feature/ui/Drawer';
import { PermissionGuard } from '@/components/feature/ui/PermissionGuard';
import { EnhancedTable } from '@/components/feature/ui/Table';

export default function CommonFilePage() {

  const [activeView, setActiveView] = useState<'dashboard' | 'directory'>('dashboard');
  const [files, setFiles] = useState<CommonFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<CommonFile | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    const data = await fileService.getFiles();
    setFiles(data);
  };

  const totalSize = files.reduce((acc, f) => acc + f.file_size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

  const filteredFiles = files.filter(f => f.file_name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleFileClick = (file: CommonFile) => {
    setSelectedFile(file);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (fileId: string) => {
    if(confirm('Are you sure you want to delete this file?')) {
      await fileService.deleteFile(fileId);
      setIsDrawerOpen(false);
      loadFiles();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6 font-medium flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        TODO: Waiting for backend endpoint
      </div>

      {/* Header */}
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Common File Module</h1>
          <p className="text-sm text-text-secondary mt-1">Centralized File Storage & References</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-border">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'dashboard' ? 'bg-white text-text-primary shadow-sm border border-border/50' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveView('directory')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'directory' ? 'bg-white text-text-primary shadow-sm border border-border/50' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Repository
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeView === 'dashboard' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><HardDrive className="h-5 w-5" /></div>
                  <h3 className="font-semibold text-text-primary">Storage Usage</h3>
                </div>
                <div className="text-3xl font-black text-text-primary">{totalSizeMB} MB</div>
                <p className="text-sm text-text-secondary mt-1">Total allocated space used</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><File className="h-5 w-5" /></div>
                  <h3 className="font-semibold text-text-primary">File Count</h3>
                </div>
                <div className="text-3xl font-black text-text-primary">{files.length}</div>
                <p className="text-sm text-text-secondary mt-1">Total referenced files</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Clock className="h-5 w-5" /></div>
                  <h3 className="font-semibold text-text-primary">Recent Uploads</h3>
                </div>
                <div className="text-3xl font-black text-text-primary">{files.length > 0 ? 3 : 0}</div>
                <p className="text-sm text-text-secondary mt-1">In the last 24 hours</p>
              </div>
            </div>
            
            {/* Recent Uploads List */}
            <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-slate-50">
                <h2 className="font-bold text-text-primary">Recent Uploads</h2>
                <button onClick={() => setActiveView('directory')} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  View Repository <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="divide-y divide-border">
                {files.slice(0, 5).map(f => (
                  <div key={f.file_id} className="p-4 px-6 hover:bg-slate-50 flex items-center justify-between cursor-pointer" onClick={() => handleFileClick(f)}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 text-text-secondary rounded-lg"><File className="h-4 w-4" /></div>
                      <div>
                        <div className="font-medium text-text-primary">{f.file_name}</div>
                        <div className="text-xs text-text-secondary flex items-center gap-2">
                          <span>{f.file_type}</span> • <span>{(f.file_size / 1024 / 1024).toFixed(2)} MB</span> • <span>{new Date(f.uploaded_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Eye className="h-4 w-4 text-text-secondary" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'directory' && (
          <div className="bg-white border border-border rounded-xl shadow-sm max-w-7xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-border flex items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search files..."
                    className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <button className="p-2 border border-border text-text-secondary rounded-lg hover:bg-slate-50">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
              <PermissionGuard required="common_file.create">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm">
                  <Upload className="h-4 w-4" /> Upload File
                </button>
              </PermissionGuard>
            </div>
            <div className="flex-1 overflow-auto">
              <EnhancedTable
                data={filteredFiles}
                columns={[
                  { key: 'file_name', label: 'File Name', render: (f: CommonFile) => (
                    <span className="flex items-center gap-2 font-medium text-text-primary">
                      <File className="h-4 w-4 text-text-secondary" />
                      {f.file_name}
                    </span>
                  )},
                  { key: 'file_type', label: 'Type', render: (f: CommonFile) => (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-slate-100 text-text-primary">
                      {f.file_type}
                    </span>
                  )},
                  { key: 'file_size', label: 'Size', render: (f: CommonFile) => (
                    <span className="text-text-secondary">{(f.file_size / 1024 / 1024).toFixed(2)} MB</span>
                  )},
                  { key: 'uploaded_by', label: 'Uploaded By' },
                  { key: 'uploaded_at', label: 'Upload Date', render: (f: CommonFile) => (
                    <span className="text-text-secondary">{new Date(f.uploaded_at).toLocaleDateString()}</span>
                  )},
                ]}
                searchPlaceholder="Search files..."
                itemsPerPage={10}
                emptyMessage="No files found."
              />
            </div>
          </div>
        )}
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="File Details" size="md">
        {selectedFile && (
          <div className="flex flex-col h-full bg-slate-50">
            <div className="p-6 bg-white border-b border-border">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <File className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">{selectedFile.file_name}</h3>
                    <p className="text-sm text-text-secondary">ID: {selectedFile.file_id} • v{selectedFile.version}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-border shadow-sm space-y-4">
                  <h4 className="text-sm font-semibold text-text-primary border-b border-border pb-2">File Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Type</span>
                      <span className="font-medium text-text-primary">{selectedFile.file_type}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">MIME</span>
                      <span className="font-medium text-text-primary">{selectedFile.mime_type}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Size</span>
                      <span className="font-medium text-text-primary">{(selectedFile.file_size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Uploaded By</span>
                      <span className="font-medium text-text-primary">{selectedFile.uploaded_by}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Upload Date</span>
                      <span className="font-medium text-text-primary">{new Date(selectedFile.uploaded_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-white border border-border text-text-primary font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
                    <Download className="h-4 w-4" /> Download File
                  </button>
                  <button className="flex-1 bg-blue-600 border border-blue-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                    <Eye className="h-4 w-4" /> Preview
                  </button>
                </div>
                
                <div className="border-t border-border pt-4 mt-6">
                  <PermissionGuard required="common_file.delete">
                    <button onClick={() => handleDelete(selectedFile.file_id)} className="w-full bg-white border border-red-200 text-red-600 font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
                      <Trash className="h-4 w-4" /> Delete File
                    </button>
                  </PermissionGuard>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
