"use client";

import React, { useState } from 'react';
import { 
  BookOpen, CheckCircle, Circle, Play, Download, ExternalLink, 
  ChevronRight, Award, Clock, ArrowRight, Video, X
} from 'lucide-react';

export default function MyLearningPage() {
  const [courses, setCourses] = useState([
    { 
      id: 'course-101', 
      title: 'Python Basics', 
      category: 'Backend Dev', 
      desc: 'Fundamentals of Python scripting, loops, data structures, and class structures.',
      instructor: 'Dr. Sarah Jenkins'
    },
    { 
      id: 'course-102', 
      title: 'AI Fundamentals', 
      category: 'System Ops', 
      desc: 'Introduction to Artificial Intelligence paradigms, search patterns, and linear models.',
      instructor: 'Prof. Alan Turing'
    },
    { 
      id: 'course-103', 
      title: 'Machine Learning', 
      category: 'System Ops', 
      desc: 'Deep dive into supervised learning, logistic regressions, trees, and clustering.',
      instructor: 'Dr. Andrew Ng'
    }
  ]);

  const [selectedCourseId, setSelectedCourseId] = useState('course-101');

  // Completed resource IDs tracker
  const [completedResourceIds, setCompletedResourceIds] = useState<Record<string, boolean>>({
    'res-1': true
  });

  const [resources, setResources] = useState<Record<string, Array<{ id: string, name: string, type: 'PDF' | 'Video' | 'PPT' | 'Link', file: string }>>>({
    'course-101': [
      { id: 'res-1', name: 'Python Notes.pdf', type: 'PDF', file: '1.2 MB' },
      { id: 'res-2', name: 'Session Recording.mp4', type: 'Video', file: '45 mins' },
      { id: 'res-3', name: 'Practice PPT.pptx', type: 'PPT', file: '2.5 MB' }
    ],
    'course-102': [
      { id: 'res-4', name: 'AI Search Algorithms.pdf', type: 'PDF', file: '0.8 MB' },
      { id: 'res-5', name: 'Intro Video.mp4', type: 'Video', file: '30 mins' }
    ],
    'course-103': [
      { id: 'res-6', name: 'Clustering Handout.pdf', type: 'PDF', file: '1.5 MB' }
    ]
  });

  // Video playback modal state
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const toggleResourceComplete = (resId: string) => {
    setCompletedResourceIds(prev => ({
      ...prev,
      [resId]: !prev[resId]
    }));
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const courseResources = resources[selectedCourseId] || [];
  
  // Calculate completion percentage for active course
  const completedCount = courseResources.filter(r => completedResourceIds[r.id]).length;
  const totalCount = courseResources.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 animate-slide-in select-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Student Hub</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold text-[10px]">My Learning</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">My Workspace & Curriculum</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Access assigned course resources, download materials, watch live recordings and track your progress.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Enrolled Courses */}
        <div className="space-y-4">
          <h3 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Enrolled Courses</h3>
          
          <div className="space-y-3">
            {courses.map((course) => {
              const isSelected = course.id === selectedCourseId;
              const resList = resources[course.id] || [];
              const compCount = resList.filter(r => completedResourceIds[r.id]).length;
              const totCount = resList.length;
              const percent = totCount > 0 ? Math.round((compCount / totCount) * 100) : 0;

              return (
                <div 
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-900 border-slate-800 text-white shadow-xl translate-x-1' 
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-350'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {course.category}
                    </span>
                    <span className="text-[10px] text-slate-450 font-medium">Self-Paced</span>
                  </div>

                  <h4 className="text-sm font-black mt-3 tracking-tight">{course.title}</h4>
                  <p className={`text-[11px] mt-1.5 line-clamp-2 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                    {course.desc}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100/10 space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className={isSelected ? 'text-slate-400' : 'text-slate-500'}>Progress</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Course Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCourse && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Course details header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-sm">
                    {selectedCourse.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">{selectedCourse.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>Instructor: <strong>{selectedCourse.instructor}</strong></span>
                    <span>•</span>
                    <span>{courseResources.length} items</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 shrink-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Syllabus Complete</span>
                  <span className="text-lg font-black text-slate-800">{completionPercentage}%</span>
                </div>
              </div>

              {/* Resource List */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Curriculum Materials</h4>
                
                <div className="grid grid-cols-1 gap-3">
                  {courseResources.map((res) => {
                    const isCompleted = completedResourceIds[res.id];
                    const isPdf = res.type === 'PDF';
                    const isVideo = res.type === 'Video';
                    const isPpt = res.type === 'PPT';

                    return (
                      <div 
                        key={res.id}
                        className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-xl bg-slate-50/50 transition-all ${
                          isCompleted ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => toggleResourceComplete(res.id)}
                            className="text-slate-300 hover:text-emerald-500 transition-colors shrink-0"
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-5.5 w-5.5 text-emerald-500" />
                            ) : (
                              <Circle className="h-5.5 w-5.5 text-slate-350" />
                            )}
                          </button>

                          <div className={`h-9 w-9 rounded flex items-center justify-center font-black text-xs shrink-0 ${
                            isPdf ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            isVideo ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            isPpt ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                            'bg-purple-50 text-purple-600 border border-purple-100'
                          }`}>
                            {res.type}
                          </div>

                          <div>
                            <div className={`text-xs font-bold ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                              {res.name}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] text-slate-400 font-semibold">{res.file}</span>
                              {isCompleted && (
                                <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">Completed</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end md:self-auto">
                          {isVideo ? (
                            <button 
                              onClick={() => setActiveVideoUrl(res.name)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer"
                            >
                              <Play className="h-3 w-3" />
                              <span>Watch video</span>
                            </button>
                          ) : (
                            <a 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                alert(`Downloading ${res.name}...`);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[10px] font-bold uppercase transition-colors"
                            >
                              <Download className="h-3 w-3 text-slate-450" />
                              <span>Download</span>
                            </a>
                          )}

                          <button
                            onClick={() => toggleResourceComplete(res.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              isCompleted 
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/10'
                            }`}
                          >
                            {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {courseResources.length === 0 && (
                    <div className="p-8 text-center text-slate-400 italic bg-slate-50 border border-slate-100 rounded-xl">
                      No resources available in this syllabus folder yet.
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* VIDEO PLAYER MODAL */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-900 bg-slate-900">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Video className="h-4 w-4 text-blue-500 animate-pulse" />
                {activeVideoUrl}
              </span>
              <button 
                onClick={() => setActiveVideoUrl(null)} 
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mock Video Canvas */}
            <div className="aspect-video bg-slate-900 flex flex-col items-center justify-center relative p-8 text-center text-slate-400">
              <div className="h-16 w-16 rounded-full bg-blue-600/15 border border-blue-500/20 flex items-center justify-center mb-4 animate-scale-up">
                <Play className="h-8 w-8 text-blue-450 ml-1 fill-blue-450" />
              </div>
              <h4 className="text-sm font-bold text-white">Streaming Session Video Recording</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Playing resource back inside our client side media canvas frame container.
              </p>
              
              {/* Media Controls Simulation */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 to-transparent flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>0:00 / 45:00</span>
                <span className="px-2 py-0.5 bg-blue-600 text-white rounded font-bold font-sans tracking-wide">1080p HD</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
