"use client";

import React from 'react';
import { Play, Pause, Search, AlertCircle } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

export default function LMSPage() {
  const {
    courses,
    selectedCourse,
    setSelectedCourse,
    selectedLectureIndex,
    setSelectedLectureIndex,
    isVideoPlaying,
    setIsVideoPlaying,
    lmsSearch,
    setLmsSearch,
    lmsCategoryFilter,
    setLmsCategoryFilter,
    handleSelectCourse,
    handleMarkLectureComplete,
    showToastNotification
  } = useDashboard();

  return (
    <div className="space-y-6 animate-slide-in">
      {selectedCourse ? (
        /* COURSE WORKSPACE VIEW */
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <button
              onClick={() => setSelectedCourse(null)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
            >
              ← Back to Course Catalog
            </button>
            <h4 className="font-black text-xs text-slate-700 uppercase tracking-widest">{selectedCourse.title}</h4>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-200 relative aspect-video overflow-hidden flex flex-col justify-between shadow-sm">
                <video
                  autoPlay={isVideoPlaying}
                  muted
                  loop
                  playsInline
                  src={selectedCourse.lectures[selectedLectureIndex]?.videoUrl}
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                {!isVideoPlaying && (
                  <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center z-20">
                    <button
                      onClick={() => setIsVideoPlaying(true)}
                      className="h-16 w-16 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <Play className="h-8 w-8 fill-current translate-x-0.5" />
                    </button>
                  </div>
                )}
                <div className="relative z-30 mt-auto bg-gradient-to-t from-slate-950 to-transparent p-4 flex items-center justify-between">
                  <button
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="h-8 w-8 bg-slate-900 border border-slate-800 text-white hover:text-blue-400 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    {isVideoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current animate-pulse" />}
                  </button>
                  <span className="text-[10px] font-bold text-slate-300 tracking-wider">
                    Lecture {selectedLectureIndex + 1} of {selectedCourse.lectures.length} ({selectedCourse.lectures[selectedLectureIndex]?.duration})
                  </span>
                  <button
                    onClick={() => handleMarkLectureComplete(selectedCourse.id, selectedLectureIndex)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                      selectedCourse.lectures[selectedLectureIndex]?.completed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500/20'
                    }`}
                  >
                    {selectedCourse.lectures[selectedLectureIndex]?.completed ? 'Completed ✓' : 'Mark Complete'}
                  </button>
                </div>
              </div>

              {/* Lecture Notes */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                  Lecture Syllabus & Notes
                </h3>
                <div className="text-xs leading-relaxed text-slate-600 space-y-4">
                  <h4 className="font-bold text-blue-600 text-sm">
                    {selectedCourse.lectures[selectedLectureIndex]?.title}
                  </h4>
                  <p className="bg-slate-50 p-4 border border-slate-150 font-mono text-slate-500 leading-relaxed">
                    {selectedCourse.lectures[selectedLectureIndex]?.notes}
                  </p>
                </div>
              </div>
            </div>

            {/* Course Content list */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                Course Content
              </h3>
              <div className="space-y-2">
                {selectedCourse.lectures.map((lec, idx) => {
                  const isCurrent = idx === selectedLectureIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedLectureIndex(idx);
                        setIsVideoPlaying(false);
                      }}
                      className={`w-full text-left p-3.5 border transition-all text-xs flex justify-between items-center cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-600 border-blue-600 text-white font-bold'
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="space-y-1 overflow-hidden pr-2">
                        <div className="font-bold truncate">{lec.title}</div>
                        <div className={`text-[9px] font-medium ${isCurrent ? 'text-blue-100' : 'text-slate-400'}`}>
                          {lec.duration}
                        </div>
                      </div>
                      <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 ${
                        lec.completed
                          ? isCurrent ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        {lec.completed ? '✓' : idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* COURSE CATALOG INDEX */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-900 text-white p-6 shadow-md">
            <span className="text-[9px] font-bold text-blue-200 uppercase tracking-widest">Education Terminal</span>
            <h2 className="text-xl font-bold text-white mt-1">LMS Learning Pathways</h2>
            <p className="text-xs text-blue-100 mt-2 max-w-xl">
              Enrolled modules designed by Pinesphere Enterprise. Watch sessions, log modules completed, and verify test components.
            </p>
          </div>

          {/* Filters Toolbar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {[
                { key: 'all', label: 'All Pathways' },
                { key: 'frontend', label: 'Frontend UI' },
                { key: 'backend', label: 'Backend Dev' },
                { key: 'system', label: 'System Ops' }
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setLmsCategoryFilter(cat.key)}
                  className={`px-4 py-2 text-xs font-bold transition-all border cursor-pointer ${
                    lmsCategoryFilter === cat.key
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search modules..."
                value={lmsSearch}
                onChange={(e) => setLmsSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.filter(course => {
              const matchesSearch = course.title.toLowerCase().includes(lmsSearch.toLowerCase()) || course.category.toLowerCase().includes(lmsSearch.toLowerCase());
              const matchesCategory = lmsCategoryFilter === 'all' || course.category.toLowerCase().includes(lmsCategoryFilter);
              return matchesSearch && matchesCategory;
            }).map((course) => (
              <div key={course.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-blue-600/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer">
                <img src={course.image} alt={course.title} className="h-44 w-full object-cover border-b border-slate-100" />
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-2 py-0.5">
                      {course.category}
                    </span>
                    {course.progress === 100 && (
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-2 py-0.5 animate-pulse">
                        ✓ Cleared
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-slate-800 leading-snug line-clamp-2 min-h-[40px]">
                    {course.title
                      .replace('react-next', 'react & next')
                      .replace('node-sys', 'node')
                      .replace('cloud-devops', 'cloud devops')
                    }
                  </h3>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>Progress Complete</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100">
                      <div className="h-full bg-blue-600 transition-all duration-350" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>

                  {course.progress === 100 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Redirect to certificates tab
                        window.location.href = '/dashboard/documents';
                        showToastNotification(`Pathway complete! Certificate is ready.`);
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all uppercase tracking-wider cursor-pointer"
                    >
                      Claim Certificate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectCourse(course)}
                      className="w-full py-2.5 bg-slate-50 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-xs font-bold text-slate-700 transition-all uppercase tracking-wider cursor-pointer"
                    >
                      Open Curriculum
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Empty state */}
            {courses.filter(course => {
              const matchesSearch = course.title.toLowerCase().includes(lmsSearch.toLowerCase()) || course.category.toLowerCase().includes(lmsSearch.toLowerCase());
              const matchesCategory = lmsCategoryFilter === 'all' || course.category.toLowerCase().includes(lmsCategoryFilter);
              return matchesSearch && matchesCategory;
            }).length === 0 && (
              <div className="col-span-full bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 space-y-2">
                <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="text-xs font-medium">No courses found matching criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
