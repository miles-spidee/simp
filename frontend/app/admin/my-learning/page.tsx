"use client";

import React, { useState, useEffect } from 'react';
import { AlertTriangle,  BookOpen, Play, CheckCircle2, Lock, Clock, Calendar, ChevronRight, FileText, Link, File  } from 'lucide-react';
import { lmsService } from '@/src/services/lms.service';
import { LearningModule, LearningResource } from '@/src/data/mock-learning-modules';

export default function MyLearningPage() {
  const [modules, setModules] = useState<LearningModule[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await lmsService.getModules();
    setModules(data);
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
      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6 font-medium flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        TODO: Waiting for backend endpoint
      </div>

      <div className="bg-white border-b border-slate-200 px-6 py-8 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">My Learning</h1>
        <p className="text-slate-500 mt-1">Continue your learning journey</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {modules.map(mod => (
            <div key={mod.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-64 h-48 md:h-auto shrink-0 relative bg-slate-100">
                <img src={mod.image} alt={mod.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                    {mod.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-slate-900">{mod.title}</h2>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{mod.progress}%</span>
                </div>
                
                <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${mod.progress}%` }}></div>
                </div>

                <div className="space-y-3 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Resources</h3>
                  {mod.resources.map((res, idx) => (
                    <div key={res.id} className={`flex items-center justify-between p-3 rounded-lg border ${res.completed ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'} transition-colors group cursor-pointer hover:border-blue-200`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg flex items-center justify-center shrink-0 ${res.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400 border border-slate-200'}`}>
                          {res.completed ? <CheckCircle2 className="h-4 w-4" /> : getResourceIcon(res.resource_type)}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${res.completed ? 'text-slate-700' : 'text-slate-900'}`}>{res.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            <span>{res.resource_type}</span>
                            {res.duration && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {res.duration}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-blue-600 transition-all rounded-lg hover:bg-blue-50">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
