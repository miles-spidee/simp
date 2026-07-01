"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, Play, FileText, Trash2, Save, CheckCircle2, GripVertical, ChevronLeft, Image, FolderOpen, UploadCloud
} from 'lucide-react';
import { CommonFile } from '@/src/types/common-files.types';
import { fileService } from '@/src/services/file.service';

interface Submodule {
  id: string;
  title: string;
  type: 'Video' | 'PDF' | 'Reading' | 'Assignment' | 'Quiz' | 'External Link';
  url: string;
  minReadingTime?: number; // seconds
  videoDuration?: number; // seconds
  idleTimeout?: number; // seconds
  checkpointMcq?: {
    time: number; // seconds
    question: string;
    options: string[];
    answer: string;
  };
}

interface Module {
  id: string;
  title: string;
  description: string;
  submodules: Submodule[];
}

interface CourseItem {
  id: string;
  title: string;
  program: string;
  description: string;
  thumbnail: string;
  progressRate: number;
  studentsCompleted: number;
  modules: Module[];
}

interface BatchLms {
  id: string;
  name: string;
  coursesCount: number;
  resourcesCount: number;
  completedRate: number;
  courses: CourseItem[];
}

const INITIAL_COURSES: CourseItem[] = [
  {
    id: 'CRS-501',
    title: 'Python Programming Basics',
    program: 'Software Engineering',
    description: 'Master core Python variables, flow control, tuples, dictionaries, and functional patterns.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop',
    progressRate: 92,
    studentsCompleted: 38,
    modules: [
      {
        id: 'MOD-501-1',
        title: 'Module 1: Introduction',
        description: 'Introduction to standard interpreter setups and scripting.',
        submodules: [
          {
            id: 'SUB-501-1-1',
            title: 'Python Notes Specification',
            type: 'PDF',
            url: 'python_basics_notes.pdf',
            minReadingTime: 120
          }
        ]
      }
    ]
  }
];

export default function LMSManagementPage() {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);
  
  // Course creator states
  const [courseName, setCourseName] = useState('');
  const [courseProgram, setCourseProgram] = useState('Software Engineering');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseThumbnail, setCourseThumbnail] = useState('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop');
  const [targetBatchId, setTargetBatchId] = useState('batch-ai-2026');

  // Modules Builder states
  const [modules, setModules] = useState<Module[]>([]);
  const [newModTitle, setNewModTitle] = useState('');
  const [newModDesc, setNewModDesc] = useState('');

  // Submodule creator states
  const [activeModIdForSub, setActiveModIdForSub] = useState<string | null>(null);
  const [subTitle, setSubTitle] = useState('');
  const [subType, setSubType] = useState<'Video' | 'PDF' | 'Reading' | 'Assignment' | 'Quiz' | 'External Link'>('PDF');
  const [subUrl, setSubUrl] = useState('');
  const [selectedFileId, setSelectedFileId] = useState('');

  // Timer configurations
  const [minReadTime, setMinReadTime] = useState(120);
  const [videoDuration, setVideoDuration] = useState(600);
  const [idleTime, setIdleTime] = useState(30);
  const [enableCheckpoint, setEnableCheckpoint] = useState(false);
  const [checkpointTime, setCheckpointTime] = useState(150);
  const [chkQuestion, setChkQuestion] = useState('What was the main concept just explained?');
  const [chkOptA, setChkOptA] = useState('Variables');
  const [chkOptB, setChkOptB] = useState('Loops');
  const [chkOptC, setChkOptC] = useState('Functions');
  const [chkOptD, setChkOptD] = useState('None');
  const [chkAns, setChkAns] = useState('A');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [commonFiles, setCommonFiles] = useState<CommonFile[]>([]);

  useEffect(() => {
    async function loadFiles() {
      try {
        const files = await fileService.getFiles();
        setCommonFiles(files as any);
      } catch (err) {
        console.error("Failed to load files", err);
      }
    }
    loadFiles();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pinesphere_courses');
      if (stored) {
        setCourses(JSON.parse(stored));
      }
    }
  }, []);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName || !courseDesc) {
      triggerToast("Please complete the course details.");
      return;
    }

    const newCourse: CourseItem = {
      id: `CRS-${Date.now().toString().slice(-3)}`,
      title: courseName,
      program: courseProgram,
      description: courseDesc,
      thumbnail: courseThumbnail,
      progressRate: 0,
      studentsCompleted: 0,
      modules: modules
    };

    const updated = [newCourse, ...courses];
    setCourses(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinesphere_courses', JSON.stringify(updated));
    }

    triggerToast(`Course "${courseName}" published successfully!`);
    setCourseName('');
    setCourseDesc('');
    setModules([]);
    setViewMode('list');
  };

  const handleAddModule = () => {
    if (!newModTitle) {
      triggerToast("Please enter a module title.");
      return;
    }

    const newModule: Module = {
      id: `MOD-${Date.now().toString().slice(-4)}`,
      title: newModTitle,
      description: newModDesc,
      submodules: []
    };

    setModules(prev => [...prev, newModule]);
    setNewModTitle('');
    setNewModDesc('');
    triggerToast(`Added module: ${newModTitle}`);
  };

  const handleAddSubmodule = () => {
    if (!activeModIdForSub || !subTitle) {
      triggerToast("Please fill sub-module details.");
      return;
    }

    const customSub: Submodule = {
      id: `SUB-${Date.now().toString().slice(-4)}`,
      title: subTitle,
      type: subType,
      url: subUrl || 'sample_content_link',
      minReadingTime: subType === 'PDF' || subType === 'Reading' ? minReadTime : undefined,
      videoDuration: subType === 'Video' ? videoDuration : undefined,
      idleTimeout: subType === 'Video' ? idleTime : undefined,
      checkpointMcq: (subType === 'Video' && enableCheckpoint) ? {
        time: checkpointTime,
        question: chkQuestion,
        options: [chkOptA, chkOptB, chkOptC, chkOptD],
        answer: chkAns
      } : undefined
    };

    setModules(prev => prev.map(m => {
      if (m.id === activeModIdForSub) {
        return {
          ...m,
          submodules: [...m.submodules, customSub]
        };
      }
      return m;
    }));

    setSubTitle('');
    setSubUrl('');
    setActiveModIdForSub(null);
    triggerToast("Sub-module added to drafting layout!");
  };

  const handleMoveModuleUp = (index: number) => {
    if (index === 0) return;
    setModules(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  const handleDeleteModule = (modId: string) => {
    setModules(prev => prev.filter(m => m.id !== modId));
  };

  return (
    <div className="space-y-6 animate-slide-in select-none">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 border border-border text-white rounded-xl shadow-2xl animate-bounce-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">{toastMessage}</div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-text-primary tracking-tight">LMS Management</h2>
          <p className="text-sm text-text-secondary mt-1">Configure pathways, publish course items, and apply player seeking timers.</p>
        </div>
        {viewMode === 'list' && (
          <button 
            onClick={() => setViewMode('create')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </button>
        )}
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-32 bg-slate-100 relative">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image className="h-8 w-8 text-slate-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-text-primary">
                  {course.modules.length} Modules
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">
                    {course.program}
                  </span>
                  <h3 className="font-bold text-text-primary mt-2 line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-helper mt-1 line-clamp-2">{course.description}</p>
                </div>
                <div className="pt-3 border-t border-border flex justify-between items-center text-xs text-text-secondary font-medium">
                  <span>{course.studentsCompleted} Completions</span>
                  <span>{course.progressRate}% Avg</span>
                </div>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <div className="col-span-full py-12 text-center text-text-secondary">
              <FolderOpen className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              <p>No courses published yet.</p>
            </div>
          )}
        </div>
      ) : (
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm max-w-4xl space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <button 
            onClick={() => setViewMode('list')}
            className="flex items-center gap-1 text-xs font-bold text-text-secondary hover:text-text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Courses
          </button>
        </div>
        <form onSubmit={handleCreateCourse} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Target Batch</label>
              <select 
                value={targetBatchId}
                onChange={(e) => setTargetBatchId(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none cursor-pointer font-bold"
              >
                <option value="batch-ai-2026">AI Batch 2026</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Program Category</label>
              <select 
                value={courseProgram}
                onChange={(e) => setCourseProgram(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none cursor-pointer font-bold"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Cloud Infrastructure">Cloud Infrastructure</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Thumbnail Link</label>
              <input 
                type="text"
                value={courseThumbnail}
                onChange={(e) => setCourseThumbnail(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Course Name</label>
              <input 
                type="text"
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g. Master Advanced Neural Architectures"
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Description Summary</label>
              <textarea 
                rows={3}
                required
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
                placeholder="Detail the modules stack, language prerequisites, and graduation certificate criteria."
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Module list */}
          <div className="border-t border-slate-150 pt-5 space-y-4">
            <h4 className="font-bold text-xs text-text-secondary uppercase tracking-widest">Syllabus Outline Builder</h4>
            
            <div className="space-y-4">
              {modules.map((mod, mIdx) => (
                <div key={mod.id} className="p-4 border border-border rounded-xl bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-text-secondary bg-slate-200/50 px-2 py-0.5 rounded">Module #{mIdx + 1}</span>
                      <span className="font-bold text-xs text-text-primary">{mod.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => handleMoveModuleUp(mIdx)} className="text-[10px] font-bold text-text-secondary hover:text-indigo-650 bg-white border px-2 py-0.5 rounded">Move Up</button>
                      <button type="button" onClick={() => setActiveModIdForSub(mod.id)} className="text-[10px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded">Add Submodule</button>
                      <button type="button" onClick={() => handleDeleteModule(mod.id)} className="text-rose-600 hover:text-rose-800 p-1"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>

                  <div className="space-y-1.5 pl-4 border-l-2 border-border">
                    {mod.submodules.map((sub, sIdx) => (
                      <div key={sub.id} className="flex justify-between items-center text-[11px] p-2 bg-white rounded border border-border">
                        <span className="font-semibold text-text-secondary">{sIdx + 1}. {sub.title} ({sub.type})</span>
                        <span className="text-[10px] text-text-secondary font-bold">
                          {sub.minReadingTime ? `Timer: ${sub.minReadingTime}s` : ''} {sub.videoDuration ? `Video: ${sub.videoDuration}s` : ''}
                        </span>
                      </div>
                    ))}
                  </div>

                  {activeModIdForSub === mod.id && (
                    <div className="bg-white border border-border rounded-xl p-4 space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-[10px] font-bold text-text-secondary uppercase">Submodule Parameter Locks</span>
                        <button type="button" onClick={() => setActiveModIdForSub(null)} className="text-text-secondary hover:text-text-secondary">Close</button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[9px] font-bold text-text-secondary uppercase mb-1">Title</label>
                          <input 
                            type="text"
                            value={subTitle}
                            onChange={(e) => setSubTitle(e.target.value)}
                            placeholder="e.g. Master Loops Spec"
                            className="w-full bg-slate-50 border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-text-secondary uppercase mb-1">Type</label>
                          <select 
                            value={subType}
                            onChange={(e) => setSubType(e.target.value as any)}
                            className="w-full bg-slate-50 border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none cursor-pointer font-bold"
                          >
                            <option value="PDF">PDF document</option>
                            <option value="Video">Video player</option>
                            <option value="Reading">Text Reading spec</option>
                            <option value="Assignment">Task Link</option>
                            <option value="Quiz">Assessment Link</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-text-secondary uppercase mb-1">Common File OR URL</label>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <select
                                value={selectedFileId}
                                onChange={(e) => {
                                  setSelectedFileId(e.target.value);
                                  const file = commonFiles.find(f => f.file_id === e.target.value);
                                  if (file) {
                                    setSubUrl(file.storage_url);
                                  }
                                }}
                                className="flex-1 bg-slate-50 border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none font-bold"
                              >
                                <option value="">-- Select from Common Files --</option>
                                {commonFiles.map(file => (
                                  <option key={file.file_id} value={file.file_id}>
                                    {file.file_name} ({file.file_type})
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => triggerToast("Upload Modal Opened")}
                                className="bg-indigo-50 border border-indigo-200 text-indigo-650 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5"
                              >
                                <UploadCloud className="h-3.5 w-3.5" />
                                Upload
                              </button>
                            </div>
                            <input 
                              type="text"
                              value={subUrl}
                              onChange={(e) => setSubUrl(e.target.value)}
                              placeholder="Or manually enter URL..."
                              className="w-full bg-slate-50 border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {(subType === 'PDF' || subType === 'Reading') && (
                        <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl space-y-1.5">
                          <span className="text-[10px] font-bold text-amber-800 uppercase block">Reading countdown</span>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-text-secondary font-semibold">Min Reading time:</span>
                            <input 
                              type="number"
                              value={minReadTime}
                              onChange={(e) => setMinReadTime(parseInt(e.target.value) || 30)}
                              className="w-24 bg-white border border-border rounded px-2 py-1 text-xs text-text-primary outline-none font-bold"
                            />
                            <span className="text-xs text-text-secondary">Seconds</span>
                          </div>
                        </div>
                      )}

                      {subType === 'Video' && (
                        <div className="p-3 bg-indigo-50/30 border border-indigo-100 rounded-xl space-y-4">
                          <span className="text-[10px] font-bold text-indigo-850 uppercase block">Video playbacks controls</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-505 font-semibold">Duration:</span>
                              <input 
                                type="number"
                                value={videoDuration}
                                onChange={(e) => setVideoDuration(parseInt(e.target.value) || 120)}
                                className="w-24 bg-white border border-border rounded px-2 py-1 text-xs text-text-primary outline-none font-bold"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-505 font-semibold">Inactivity threshold:</span>
                              <input 
                                type="number"
                                value={idleTime}
                                onChange={(e) => setIdleTime(parseInt(e.target.value) || 10)}
                                className="w-24 bg-white border border-border rounded px-2 py-1 text-xs text-text-primary outline-none font-bold"
                              />
                            </div>
                          </div>

                          <div className="border-t pt-3 space-y-3">
                            <div className="flex items-center gap-2">
                              <input 
                                type="checkbox"
                                id="checkpointCheck"
                                checked={enableCheckpoint}
                                onChange={(e) => setEnableCheckpoint(e.target.checked)}
                                className="h-3.5 w-3.5 text-indigo-655 rounded border-slate-350 cursor-pointer"
                              />
                              <label htmlFor="checkpointCheck" className="text-xs font-bold text-label cursor-pointer select-none">
                                Embed MCQ Checkpoint (Pauses playback)
                              </label>
                            </div>

                            {enableCheckpoint && (
                              <div className="pl-6 space-y-3 text-xs">
                                <div className="flex items-center gap-4">
                                  <span className="font-semibold text-text-secondary">Trigger at:</span>
                                  <input 
                                    type="number"
                                    value={checkpointTime}
                                    onChange={(e) => setCheckpointTime(parseInt(e.target.value) || 60)}
                                    className="w-20 bg-white border border-border rounded px-2 py-1 text-xs text-text-primary font-bold"
                                  />
                                  <span>Seconds</span>
                                </div>
                                
                                <div className="space-y-1">
                                  <span>Question:</span>
                                  <input 
                                    type="text"
                                    value={chkQuestion}
                                    onChange={(e) => setChkQuestion(e.target.value)}
                                    className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-slate-805"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  {([
                                    ['A', chkOptA, setChkOptA],
                                    ['B', chkOptB, setChkOptB],
                                    ['C', chkOptC, setChkOptC],
                                    ['D', chkOptD, setChkOptD]
                                  ] as [string, string, React.Dispatch<React.SetStateAction<string>>][]).map((o, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5">
                                      <span className="font-bold text-text-secondary">{o[0]}:</span>
                                      <input 
                                        type="text"
                                        value={o[1]}
                                        onChange={(e) => o[2](e.target.value)}
                                        className="w-full bg-white border border-border rounded px-2 py-1 text-xs text-text-primary"
                                      />
                                    </div>
                                  ))}
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-505">Correct Option:</span>
                                  <select 
                                    value={chkAns}
                                    onChange={(e) => setChkAns(e.target.value)}
                                    className="bg-white border rounded px-2 py-1 text-xs cursor-pointer outline-none font-bold"
                                  >
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <button 
                        type="button"
                        onClick={handleAddSubmodule}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer text-center"
                      >
                        Publish Submodule Asset
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Module Box */}
            <div className="p-4 border border-dashed border-slate-305 rounded-xl bg-slate-50/20 space-y-4">
              <span className="text-xs font-bold text-text-secondary uppercase block">Define New Module Wrapper</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-text-secondary uppercase mb-1">Module Name</label>
                  <input 
                    type="text"
                    value={newModTitle}
                    onChange={(e) => setNewModTitle(e.target.value)}
                    placeholder="e.g. Module 3: Advanced OOP Patterns"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-xs text-text-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-text-secondary uppercase mb-1">Description Summary</label>
                  <input 
                    type="text"
                    value={newModDesc}
                    onChange={(e) => setNewModDesc(e.target.value)}
                    placeholder="e.g. Class definitions, inheritance structures"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-xs text-text-primary outline-none"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddModule}
                className="px-4 py-2 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-750 font-bold text-xs rounded-xl"
              >
                + Append Module
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button 
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Publish Course Track
            </button>
          </div>
        </form>
      </div>
      )}

    </div>
  );
}
