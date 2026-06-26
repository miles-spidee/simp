"use client";

import React, { useEffect, useState } from 'react';
import { ProductivityService } from '@/src/services/productivity.service';
import { ProductivityWorkspace } from '@/src/types/productivity.types';
import { Zap, Loader2, CheckSquare, Bookmark as BookmarkIcon, StickyNote, Plus, ExternalLink } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';

export default function ProductivityPage() {
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState<ProductivityWorkspace | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await ProductivityService.getWorkspace();
      setWorkspace(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission('productivity.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500">
        <p>You do not have permission to view the productivity center.</p>
      </div>
    );
  }

  if (loading || !workspace) {
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
            <Zap className="w-6 h-6 text-yellow-500" />
            Productivity Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">Your personal workspace for tasks, notes, and quick links.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-slate-400" />
              My Tasks
            </h2>
            <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="p-2 space-y-1 flex-grow">
            {workspace.tasks.map(task => (
              <label key={task.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  readOnly 
                  className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                />
                <div className={task.completed ? 'opacity-50' : ''}>
                  <div className={`text-sm font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                    {task.title}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Sticky Notes Section */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-slate-400" />
              Quick Notes
            </h2>
            <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 grid grid-cols-1 gap-4 flex-grow content-start">
            {workspace.notes.map(note => (
              <div 
                key={note.id} 
                className={`p-4 rounded-lg shadow-sm border ${
                  note.color === 'yellow' ? 'bg-yellow-50 border-yellow-200 text-yellow-900' :
                  note.color === 'blue' ? 'bg-blue-50 border-blue-200 text-blue-900' :
                  note.color === 'green' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                  'bg-pink-50 border-pink-200 text-pink-900'
                }`}
              >
                <p className="text-sm font-medium">{note.content}</p>
                <div className="text-[10px] opacity-60 font-bold uppercase tracking-wider mt-3">
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bookmarks Section */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <BookmarkIcon className="w-4 h-4 text-slate-400" />
              Bookmarks
            </h2>
            <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-100 flex-grow">
            {workspace.bookmarks.map(bm => (
              <a 
                key={bm.id} 
                href={bm.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group block"
              >
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{bm.title}</h3>
                  <div className="text-xs text-slate-500 mt-1">{bm.category}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
