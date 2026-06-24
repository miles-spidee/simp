"use client";

import React, { useEffect, useState } from 'react';
import { BookOpen, Search, Filter, Plus, File, Eye, Play, Link, FileText, CheckCircle2 } from 'lucide-react';
import { lmsService } from '@/src/services/lms.service';
import { LearningModule, LearningResource } from '@/src/data/mock-learning-modules';
import { Drawer } from '@/components/admin/ui/Drawer';

export default function LMSManagementPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'modules'>('dashboard');
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await lmsService.getModules();
    setModules(data);
  };

  const filteredModules = modules.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleModuleClick = (mod: LearningModule) => {
    setSelectedModule(mod);
    setActiveTab('overview');
    setIsDrawerOpen(true);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="h-4 w-4" />;
      case 'Video': return <Play className="h-4 w-4" />;
      case 'PPT': return <File className="h-4 w-4" />;
      case 'ZIP': return <File className="h-4 w-4" />;
      case 'External Link': return <Link className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900">LMS Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage learning modules and resources.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'dashboard' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveView('modules')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeView === 'modules' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Learning Modules
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeView === 'dashboard' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Total Modules</p>
                <h3 className="text-2xl font-bold text-slate-900">{modules.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Total Resources</p>
                <h3 className="text-2xl font-bold text-slate-900">{modules.reduce((acc, m) => acc + m.resources.length, 0)}</h3>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Student Access</p>
                <h3 className="text-2xl font-bold text-slate-900">85%</h3>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Completion Rate</p>
                <h3 className="text-2xl font-bold text-slate-900">42%</h3>
              </div>
            </div>
          </div>
        )}

        {activeView === 'modules' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm max-w-7xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search modules..."
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm">
                <Plus className="h-4 w-4" /> Create Module
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Module</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Resources</th>
                    <th className="px-6 py-3">Avg Progress</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredModules.map(m => (
                    <tr key={m.id} className="hover:bg-blue-50/50 cursor-pointer transition-colors" onClick={() => handleModuleClick(m)}>
                      <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-blue-500" />
                        {m.title}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{m.category}</td>
                      <td className="px-6 py-4 text-slate-600">{m.resources.length} items</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                            <div className="h-full bg-blue-500" style={{ width: `${m.progress}%` }} />
                          </div>
                          <span className="text-xs text-slate-500">{m.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Module Details" size="lg">
        {selectedModule && (
          <div className="flex flex-col h-full bg-slate-50 min-h-0">
            <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedModule.title}</h2>
                  <p className="text-sm text-slate-500">Program ID: {selectedModule.programId}</p>
                </div>
              </div>
            </div>

            <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-6 shrink-0">
              {['overview', 'resources', 'analytics'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="capitalize">{t}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Module Info</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</span>
                        <span className="font-medium text-slate-800">{selectedModule.category}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Resources Count</span>
                        <span className="font-medium text-slate-800">{selectedModule.resources.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-4">
                  <div className="flex justify-end mb-4">
                    <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Add Resource
                    </button>
                  </div>
                  {selectedModule.resources.map(res => (
                    <div key={res.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 text-slate-600 rounded-lg shrink-0">
                          {getResourceIcon(res.resource_type)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{res.title}</div>
                          <div className="text-xs text-slate-500">{res.resource_type} • {res.duration || 'No duration'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center text-slate-500">
                  Analytics for {selectedModule.title} will appear here.
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
