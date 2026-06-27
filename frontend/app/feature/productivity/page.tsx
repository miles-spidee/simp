"use client";

import React, { useEffect, useState } from 'react';
import { ProductivityService } from '@/src/services/productivity.service';
import { ProductivityWorkspace, PersonalTask, StickyNote, Bookmark } from '@/src/types/productivity.types';
import { 
  Zap, Loader2, CheckSquare, Bookmark as BookmarkIcon, StickyNote as NoteIcon, 
  Plus, ExternalLink, Trash2, Edit2, Check, X, Calendar, Link2, FileText
} from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';

export default function ProductivityPage() {
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState<ProductivityWorkspace | null>(null);

  // Modals / Creators active states
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [bookmarkModalOpen, setBookmarkModalOpen] = useState(false);

  // Form states
  const [taskForm, setTaskForm] = useState({ title: '', dueDate: new Date().toISOString().split('T')[0] });
  const [noteForm, setNoteForm] = useState({ id: '', content: '', color: 'yellow' as 'yellow' | 'blue' | 'green' | 'pink' });
  const [bookmarkForm, setBookmarkForm] = useState({ title: '', url: '', category: 'Work' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await ProductivityService.getWorkspace();
      setWorkspace(JSON.parse(JSON.stringify(data))); // deep copy to ensure mutability of state
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // --- TASK ACTIONS ---
  const handleToggleTask = (taskId: string) => {
    if (!workspace) return;
    setWorkspace({
      ...workspace,
      tasks: workspace.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace || !taskForm.title.trim()) return;

    const newTask: PersonalTask = {
      id: `PT-${Date.now()}`,
      title: taskForm.title.trim(),
      completed: false,
      dueDate: new Date(taskForm.dueDate).toISOString()
    };

    setWorkspace({
      ...workspace,
      tasks: [newTask, ...workspace.tasks]
    });
    setTaskForm({ title: '', dueDate: new Date().toISOString().split('T')[0] });
    setTaskModalOpen(false);
  };

  const handleDeleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering row click checkbox toggle
    if (!workspace) return;
    setWorkspace({
      ...workspace,
      tasks: workspace.tasks.filter(t => t.id !== taskId)
    });
  };

  // --- NOTE ACTIONS ---
  const handleOpenNoteModal = (note?: StickyNote) => {
    if (note) {
      setNoteForm({ id: note.id, content: note.content, color: note.color });
    } else {
      setNoteForm({ id: '', content: '', color: 'yellow' });
    }
    setNoteModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace || !noteForm.content.trim()) return;

    if (noteForm.id) {
      // Editing existing note
      setWorkspace({
        ...workspace,
        notes: workspace.notes.map(n => n.id === noteForm.id ? { 
          ...n, 
          content: noteForm.content.trim(), 
          color: noteForm.color 
        } : n)
      });
    } else {
      // Adding new note
      const newNote: StickyNote = {
        id: `NOTE-${Date.now()}`,
        content: noteForm.content.trim(),
        color: noteForm.color,
        createdAt: new Date().toISOString()
      };
      setWorkspace({
        ...workspace,
        notes: [newNote, ...workspace.notes]
      });
    }
    setNoteModalOpen(false);
    setNoteForm({ id: '', content: '', color: 'yellow' });
  };

  const handleDeleteNote = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!workspace) return;
    setWorkspace({
      ...workspace,
      notes: workspace.notes.filter(n => n.id !== noteId)
    });
  };

  // --- BOOKMARK ACTIONS ---
  const handleAddBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace || !bookmarkForm.title.trim() || !bookmarkForm.url.trim()) return;

    let url = bookmarkForm.url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    const newBookmark: Bookmark = {
      id: `BM-${Date.now()}`,
      title: bookmarkForm.title.trim(),
      url: url,
      category: bookmarkForm.category.trim() || 'Work'
    };

    setWorkspace({
      ...workspace,
      bookmarks: [...workspace.bookmarks, newBookmark]
    });
    setBookmarkForm({ title: '', url: '', category: 'Work' });
    setBookmarkModalOpen(false);
  };

  const handleDeleteBookmark = (bookmarkId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!workspace) return;
    setWorkspace({
      ...workspace,
      bookmarks: workspace.bookmarks.filter(b => b.id !== bookmarkId)
    });
  };

  if (!hasPermission('productivity.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500">
        <p className="font-semibold">You do not have permission to view the productivity center.</p>
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
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Productivity Center
          </h1>
          <p className="text-slate-550 text-sm mt-1">Your personal workspace for tasks, notes, and quick links.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden flex flex-col min-h-[480px]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <CheckSquare className="w-4.5 h-4.5 text-slate-400" />
              My Tasks
            </h2>
            <button 
              onClick={() => setTaskModalOpen(true)}
              className="text-teal-650 hover:text-teal-800 hover:bg-teal-50/50 p-1 rounded-lg transition-colors cursor-pointer"
              title="Add task"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="p-3 space-y-1.5 flex-grow overflow-y-auto custom-scrollbar">
            {workspace.tasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No tasks created.</div>
            ) : (
              workspace.tasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => handleToggleTask(task.id)}
                  className="flex items-start justify-between gap-3 p-3 hover:bg-slate-50/80 rounded-xl cursor-pointer group transition-all border border-transparent hover:border-slate-150 select-none"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => {}} // Handled by outer div onClick
                      className="mt-1 h-4 w-4 rounded border-slate-350 text-teal-605 focus:ring-teal-500 cursor-pointer" 
                    />
                    <div className={task.completed ? 'opacity-50' : ''}>
                      <div className={`text-sm font-semibold leading-tight ${task.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                        {task.title}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteTask(task.id, e)}
                    className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sticky Notes Section */}
        <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden flex flex-col min-h-[480px]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <NoteIcon className="w-4.5 h-4.5 text-slate-400" />
              Quick Notes
            </h2>
            <button 
              onClick={() => handleOpenNoteModal()}
              className="text-teal-650 hover:text-teal-800 hover:bg-teal-50/50 p-1 rounded-lg transition-colors cursor-pointer"
              title="Add note"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 space-y-4 flex-grow overflow-y-auto custom-scrollbar">
            {workspace.notes.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No notes created.</div>
            ) : (
              workspace.notes.map(note => (
                <div 
                  key={note.id} 
                  onClick={() => handleOpenNoteModal(note)}
                  className={`p-4 rounded-2xl shadow-sm border cursor-pointer hover:scale-[1.01] hover:shadow transition-all group relative flex flex-col justify-between ${
                    note.color === 'yellow' ? 'bg-amber-50/40 border-amber-200 text-slate-800' :
                    note.color === 'blue' ? 'bg-blue-50/40 border-blue-200 text-slate-850' :
                    note.color === 'green' ? 'bg-emerald-50/40 border-emerald-250 text-slate-850' :
                    'bg-rose-50/40 border-rose-200 text-slate-850'
                  }`}
                >
                  <p className="text-sm font-semibold leading-relaxed whitespace-pre-line">{note.content}</p>
                  
                  <div className="flex justify-between items-center mt-4 pt-2 border-t border-slate-200/40">
                    <span className="text-[9px] opacity-60 font-bold uppercase tracking-wider">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="p-1 rounded bg-white/70 hover:bg-white text-slate-500 hover:text-slate-800 transition-colors shadow-xs">
                        <Edit2 className="w-3.5 h-3.5" />
                      </span>
                      <button 
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="p-1 rounded bg-white/70 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bookmarks Section */}
        <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden flex flex-col min-h-[480px]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <BookmarkIcon className="w-4.5 h-4.5 text-slate-400" />
              Bookmarks
            </h2>
            <button 
              onClick={() => setBookmarkModalOpen(true)}
              className="text-teal-650 hover:text-teal-800 hover:bg-teal-50/50 p-1 rounded-lg transition-colors cursor-pointer"
              title="Add bookmark"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="divide-y divide-slate-100 flex-grow overflow-y-auto custom-scrollbar">
            {workspace.bookmarks.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No bookmarks saved.</div>
            ) : (
              workspace.bookmarks.map(bm => (
                <div 
                  key={bm.id} 
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                >
                  <a 
                    href={bm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-0"
                  >
                    <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors text-sm truncate">{bm.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{bm.category}</span>
                      <span className="text-[9px] text-slate-400 truncate max-w-[150px]">{bm.url}</span>
                    </div>
                  </a>
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={(e) => handleDeleteBookmark(bm.id, e)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ExternalLink className="w-4.5 h-4.5 text-slate-350 group-hover:text-blue-500 transition-colors p-0.5" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* --- ADD TASK MODAL --- */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-150 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-slate-500" />
                Add Personal Task
              </h3>
              <button onClick={() => setTaskModalOpen(false)} className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-50 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddTask} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Task Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="E.g. Complete slides for review"
                  value={taskForm.title}
                  onChange={e => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-650 focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 bg-white placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Due Date *</label>
                <input 
                  type="date" 
                  required
                  value={taskForm.dueDate}
                  onChange={e => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-650 focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-850 bg-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setTaskModalOpen(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT NOTE MODAL --- */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-150 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-500" />
                {noteForm.id ? 'Edit Sticky Note' : 'Create Sticky Note'}
              </h3>
              <button onClick={() => setNoteModalOpen(false)} className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-50 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveNote} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Note Content *</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Write your note content here..."
                  value={noteForm.content}
                  onChange={e => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-650 focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 bg-white placeholder-slate-400 whitespace-pre-wrap font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Note Theme Color</label>
                <div className="flex gap-3">
                  {(['yellow', 'blue', 'green', 'pink'] as const).map(c => {
                    const active = noteForm.color === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNoteForm(prev => ({ ...prev, color: c }))}
                        className={`w-10 h-10 rounded-full border transition-all relative ${
                          c === 'yellow' ? 'bg-amber-50 border-amber-300' :
                          c === 'blue' ? 'bg-blue-50 border-blue-300' :
                          c === 'green' ? 'bg-emerald-50 border-emerald-305' :
                          'bg-rose-50 border-rose-300'
                        } ${active ? 'scale-110 shadow-md ring-2 ring-blue-550' : 'hover:scale-105'}`}
                        title={`${c} color`}
                      >
                        {active && <Check className="w-4 h-4 text-slate-800 absolute inset-0 m-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setNoteModalOpen(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm">
                  {noteForm.id ? 'Save Changes' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD BOOKMARK MODAL --- */}
      {bookmarkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-150 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-slate-500" />
                Add Bookmark
              </h3>
              <button onClick={() => setBookmarkModalOpen(false)} className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-50 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddBookmark} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Bookmark Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="E.g. GitHub Repository"
                  value={bookmarkForm.title}
                  onChange={e => setBookmarkForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-650 focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 bg-white placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">URL *</label>
                <input 
                  type="text" 
                  required
                  placeholder="E.g. github.com/user/project"
                  value={bookmarkForm.url}
                  onChange={e => setBookmarkForm(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-650 focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 bg-white placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Category</label>
                <input 
                  type="text" 
                  placeholder="E.g. Work, Learning, Personal"
                  value={bookmarkForm.category}
                  onChange={e => setBookmarkForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-650 focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 bg-white placeholder-slate-400"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setBookmarkModalOpen(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm">Add Bookmark</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

