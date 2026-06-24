"use client";

import React, { useState } from 'react';
import { 
  BookOpen, FolderOpen, Plus, PlusCircle, CheckCircle2, 
  Search, Edit, Ban, FileText, Video, HelpCircle, ChevronRight, Save
} from 'lucide-react';

export default function LMSManagementPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mock Courses State
  const [courses, setCourses] = useState([
    { id: 'course-101', title: 'Python Basics', category: 'Backend Dev', desc: 'Fundamentals of Python scripting, loops, data structures, and class structures.' },
    { id: 'course-102', title: 'AI Fundamentals', category: 'System Ops', desc: 'Introduction to Artificial Intelligence paradigms, search patterns, and linear models.' },
    { id: 'course-103', title: 'Machine Learning', category: 'System Ops', desc: 'Deep dive into supervised learning, logistic regressions, trees, and clustering.' }
  ]);

  // Mock Resources mapped per course
  const [resources, setResources] = useState<Record<string, Array<{ id: string, name: string, type: 'PDF' | 'Video' | 'PPT' | 'Link', file: string, status: 'Active' | 'Disabled' }>>>({
    'course-101': [
      { id: 'res-1', name: 'Python Notes.pdf', type: 'PDF', file: '1.2 MB', status: 'Active' },
      { id: 'res-2', name: 'Session Recording.mp4', type: 'Video', file: '45 mins', status: 'Active' },
      { id: 'res-3', name: 'Practice PPT.pptx', type: 'PPT', file: '2.5 MB', status: 'Active' }
    ],
    'course-102': [
      { id: 'res-4', name: 'AI Search Algorithms.pdf', type: 'PDF', file: '0.8 MB', status: 'Active' },
      { id: 'res-5', name: 'Intro Video.mp4', type: 'Video', file: '30 mins', status: 'Active' }
    ],
    'course-103': [
      { id: 'res-6', name: 'Clustering Handout.pdf', type: 'PDF', file: '1.5 MB', status: 'Active' }
    ]
  });

  const [selectedCourseId, setSelectedCourseId] = useState('course-101');

  // Course Onboarding Form State
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseInput, setCourseInput] = useState({ title: '', category: 'Backend Dev', desc: '' });

  // Resource Onboarding Form State
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [resourceInput, setResourceInput] = useState({ name: '', type: 'PDF' as 'PDF' | 'Video' | 'PPT' | 'Link', file: '' });

  // Edit Course Mode State
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [editCourseInput, setEditCourseInput] = useState({ title: '', category: '', desc: '' });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseInput.title || !courseInput.desc) {
      triggerToast('Please complete all course fields.');
      return;
    }
    const newId = `course-${Date.now()}`;
    const newCourse = {
      id: newId,
      title: courseInput.title,
      category: courseInput.category,
      desc: courseInput.desc
    };
    setCourses([...courses, newCourse]);
    setResources(prev => ({ ...prev, [newId]: [] }));
    setSelectedCourseId(newId);
    setShowCourseForm(false);
    triggerToast(`Course "${courseInput.title}" created successfully!`);
    setCourseInput({ title: '', category: 'Backend Dev', desc: '' });
  };

  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceInput.name || !resourceInput.file) {
      triggerToast('Please complete all resource fields.');
      return;
    }
    const newRes = {
      id: `res-${Date.now()}`,
      name: resourceInput.name,
      type: resourceInput.type,
      file: resourceInput.file,
      status: 'Active' as const
    };
    setResources(prev => ({
      ...prev,
      [selectedCourseId]: [...(prev[selectedCourseId] || []), newRes]
    }));
    setShowResourceForm(false);
    triggerToast(`Resource "${resourceInput.name}" uploaded to course.`);
    setResourceInput({ name: '', type: 'PDF', file: '' });
  };

  const handleToggleResource = (resId: string) => {
    setResources(prev => {
      const courseList = prev[selectedCourseId] || [];
      const updated = courseList.map(r => {
        if (r.id === resId) {
          const nextStatus: 'Active' | 'Disabled' = r.status === 'Active' ? 'Disabled' : 'Active';
          triggerToast(`Resource status set to ${nextStatus}.`);
          return { ...r, status: nextStatus };
        }
        return r;
      });
      return { ...prev, [selectedCourseId]: updated };
    });
  };

  const handleStartEditCourse = () => {
    const course = courses.find(c => c.id === selectedCourseId);
    if (course) {
      setEditCourseInput({ title: course.title, category: course.category, desc: course.desc });
      setIsEditingCourse(true);
    }
  };

  const handleSaveEditCourse = (e: React.FormEvent) => {
    e.preventDefault();
    setCourses(prev => prev.map(c => {
      if (c.id === selectedCourseId) {
        return {
          ...c,
          title: editCourseInput.title,
          category: editCourseInput.category,
          desc: editCourseInput.desc
        };
      }
      return c;
    }));
    setIsEditingCourse(false);
    triggerToast('Course details updated.');
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const activeResources = resources[selectedCourseId] || [];

  return (
    <div className="space-y-6 animate-slide-in select-none">
      
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl animate-bounce-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">{toastMessage}</div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Operational Panel</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold text-[10px]">LMS Management</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">LMS Resource Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create courses, upload materials, edit guidelines, and manage student curriculum files.
          </p>
        </div>

        <button
          onClick={() => setShowCourseForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Course</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Courses List */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-fit">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Syllabus Courses</h3>
          </div>
          <div className="divide-y divide-slate-100 flex flex-col">
            {courses.map((course) => {
              const isActive = selectedCourseId === course.id;
              return (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setIsEditingCourse(false);
                  }}
                  className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer ${
                    isActive ? 'bg-blue-50/40 text-blue-600 font-bold border-l-4 border-blue-600' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">{course.title}</div>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">{course.category}</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Course details & attached resources */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCourse && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Course Info */}
              {isEditingCourse ? (
                <form onSubmit={handleSaveEditCourse} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Course Title</label>
                    <input 
                      type="text" 
                      value={editCourseInput.title}
                      onChange={(e) => setEditCourseInput({ ...editCourseInput, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-255 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Category</label>
                    <input 
                      type="text" 
                      value={editCourseInput.category}
                      onChange={(e) => setEditCourseInput({ ...editCourseInput, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-255 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Description</label>
                    <textarea 
                      rows={3}
                      value={editCourseInput.desc}
                      onChange={(e) => setEditCourseInput({ ...editCourseInput, desc: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-255 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white font-bold text-[10px] rounded hover:bg-blue-700 cursor-pointer">Save Changes</button>
                    <button type="button" onClick={() => setIsEditingCourse(false)} className="px-3 py-1.5 bg-slate-100 text-slate-600 font-bold text-[10px] rounded hover:bg-slate-200 cursor-pointer">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-sm">{selectedCourse.category}</span>
                    <h3 className="text-lg font-bold text-slate-850 mt-2">{selectedCourse.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{selectedCourse.desc}</p>
                  </div>
                  <button 
                    onClick={handleStartEditCourse}
                    className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-[10px] font-bold text-slate-600 cursor-pointer transition-colors"
                  >
                    <Edit className="h-3 w-3 inline mr-1" />
                    Edit Course
                  </button>
                </div>
              )}

              {/* Resources list */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Attached Curriculum Resources</h4>
                  <button
                    onClick={() => setShowResourceForm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-[10px] font-bold text-blue-600 transition-colors cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Upload Resource</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {activeResources.map((res) => {
                    const isPdf = res.type === 'PDF';
                    const isVideo = res.type === 'Video';
                    const isPpt = res.type === 'PPT';
                    const activeStyle = res.status === 'Active';

                    return (
                      <div 
                        key={res.id} 
                        className={`flex items-center justify-between p-3.5 border rounded-xl bg-slate-50/50 transition-opacity ${
                          activeStyle ? 'border-slate-200 opacity-100' : 'border-rose-100 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded flex items-center justify-center font-bold text-xs shrink-0 ${
                            isPdf ? 'bg-rose-50 text-rose-600' :
                            isVideo ? 'bg-blue-50 text-blue-600' :
                            isPpt ? 'bg-amber-50 text-amber-600' : 'bg-purple-50 text-purple-600'
                          }`}>
                            {res.type}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{res.name}</div>
                            <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">{res.file}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleResource(res.id)}
                            className={`px-2 py-1 rounded text-[9px] font-bold border transition-colors cursor-pointer ${
                              activeStyle 
                                ? 'bg-white border-rose-200 text-rose-600 hover:bg-rose-50' 
                                : 'bg-blue-600 border-blue-600 text-white'
                            }`}
                          >
                            <Ban className="h-3 w-3 inline mr-1" />
                            {activeStyle ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {activeResources.length === 0 && (
                    <div className="p-8 text-center text-slate-400 italic bg-slate-50 border border-slate-100 rounded-xl">No resources uploaded to this course curriculum yet.</div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* CREATE COURSE MODAL OVERLAY */}
      {showCourseForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateCourse} className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Create New Course Syllabus</h3>
            
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Course Title</label>
              <input 
                type="text" 
                required 
                placeholder="Python Basics" 
                value={courseInput.title}
                onChange={(e) => setCourseInput({ ...courseInput, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Category Topic</label>
              <select 
                value={courseInput.category}
                onChange={(e) => setCourseInput({ ...courseInput, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
              >
                <option value="Backend Dev">Backend Dev</option>
                <option value="System Ops">System Ops</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Guidelines / Description</label>
              <textarea 
                required
                rows={3} 
                placeholder="Write summary notes..." 
                value={courseInput.desc}
                onChange={(e) => setCourseInput({ ...courseInput, desc: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer">Create Course</button>
              <button type="button" onClick={() => setShowCourseForm(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-655 rounded text-xs font-bold uppercase tracking-wider cursor-pointer">Close</button>
            </div>
          </form>
        </div>
      )}

      {/* UPLOAD RESOURCE MODAL OVERLAY */}
      {showResourceForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUploadResource} className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Upload Course Resource</h3>
            
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Resource File Name</label>
              <input 
                type="text" 
                required 
                placeholder="Python Notes.pdf" 
                value={resourceInput.name}
                onChange={(e) => setResourceInput({ ...resourceInput, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Format Type</label>
              <select 
                value={resourceInput.type}
                onChange={(e) => setResourceInput({ ...resourceInput, type: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
              >
                <option value="PDF">PDF Document</option>
                <option value="Video">MP4/Video Recording</option>
                <option value="PPT">PPT Slide deck</option>
                <option value="Link">External Website Link</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase block">Size or Duration Info</label>
              <input 
                type="text" 
                required 
                placeholder="Eg: 1.5 MB or 30 mins" 
                value={resourceInput.file}
                onChange={(e) => setResourceInput({ ...resourceInput, file: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer">Upload Resource</button>
              <button type="button" onClick={() => setShowResourceForm(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-655 rounded text-xs font-bold uppercase tracking-wider cursor-pointer">Close</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
