"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, BookOpen, Play, CheckCircle2, Lock, Clock, Calendar, 
  ChevronRight, FileText, Link, File, Award, HelpCircle, AlertCircle, RefreshCw, Download, Loader2, ExternalLink
} from 'lucide-react';
import { lmsService } from '@/src/services/lms.service';
import { CourseItem } from '@/src/api/lms.api';

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

export default function MyLearningPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [activeSub, setActiveSub] = useState<Submodule | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Completion registry: Maps submoduleId -> boolean
  const [completedSubmodules, setCompletedSubmodules] = useState<Record<string, boolean>>({});

  // PDF reading timer state
  const [pdfTimer, setPdfTimer] = useState(0);
  const [isPdfCompleteEnabled, setIsPdfCompleteEnabled] = useState(false);

  // Video player controls
  const [videoProgress, setVideoProgress] = useState(0); // percentage (0 to 100)
  const [videoCurrentTime, setVideoCurrentTime] = useState(0); // seconds
  const [lastWatchedTime, setLastWatchedTime] = useState(0); // seconds
  const [isVideoCompleteEnabled, setIsVideoCompleteEnabled] = useState(false);

  // Inactivity/Idle tracking state
  const [idleTimerCount, setIdleTimerCount] = useState(0);
  const [showIdleWarning, setShowIdleWarning] = useState(false);
  const [idleWarningCountdown, setIdleWarningCountdown] = useState(5);
  const activityTimerRef = useRef<any>(null);
  const warningCountdownRef = useRef<any>(null);

  // Checkpoint MCQs state
  const [showCheckpointMcq, setShowCheckpointMcq] = useState(false);
  const [checkpointAnswered, setCheckpointAnswered] = useState(false);
  const [selectedCheckpointAns, setSelectedCheckpointAns] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch courses from the database
  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      try {
        const data = await lmsService.getCourses();
        setCourses(data);
        
        // Load submodule progress from localStorage (user-specific)
        if (typeof window !== 'undefined') {
          const progressStr = localStorage.getItem('pinesphere_user_course_progress');
          if (progressStr) {
            setCompletedSubmodules(JSON.parse(progressStr));
          }
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  // Update localStorage when completed submodules list changes
  const saveProgressToStorage = (updatedProgress: Record<string, boolean>) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinesphere_user_course_progress', JSON.stringify(updatedProgress));
      
      // Update overall progress percentage of courses
      if (selectedCourse) {
        const totalSubs = selectedCourse.modules.reduce((sum, m) => sum + m.submodules.length, 0);
        if (totalSubs > 0) {
          const completedCount = selectedCourse.modules.reduce((sum, m) => 
            sum + m.submodules.filter(s => updatedProgress[s.id]).length, 0
          );
          const newRate = Math.round((completedCount / totalSubs) * 100);
          
          // Update selected course locally
          const updatedCourse = { ...selectedCourse, progressRate: newRate };
          setSelectedCourse(updatedCourse);
          
          const updatedCourses = courses.map(c => c.id === selectedCourse.id ? updatedCourse : c);
          setCourses(updatedCourses);
        }
      }
    }
  };

  // PDF reading timer countdown
  useEffect(() => {
    let interval: any;
    if (activeSub && (activeSub.type === 'PDF' || activeSub.type === 'Reading') && pdfTimer > 0) {
      interval = setInterval(() => {
        setPdfTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsPdfCompleteEnabled(true);
            triggerToast("Reading timer finished! You can now mark this item as completed.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSub, pdfTimer]);

  // Video Playback and restriction logic
  useEffect(() => {
    let playInterval: any;
    if (activeSub && activeSub.type === 'Video' && isExamActiveState()) {
      playInterval = setInterval(() => {
        setVideoCurrentTime(prev => {
          const newTime = prev + 1;
          const duration = activeSub.videoDuration || 600;

          // Check if we hit the MCQ checkpoint (e.g. 2:30 -> 150 seconds)
          if (activeSub.checkpointMcq && newTime >= activeSub.checkpointMcq.time && !checkpointAnswered) {
            clearInterval(playInterval);
            setShowCheckpointMcq(true);
            return prev;
          }

          // Track last watched time to lock seek restrictions
          if (newTime > lastWatchedTime) {
            setLastWatchedTime(newTime);
          }

          // Progress
          const pct = Math.min(100, Math.round((newTime / duration) * 100));
          setVideoProgress(pct);

          if (newTime >= duration) {
            clearInterval(playInterval);
            setIsVideoCompleteEnabled(true);
            triggerToast("Video watched fully! Mark Complete is now unlocked.");
            return duration;
          }

          return newTime;
        });

        // Track inactivity
        setIdleTimerCount(prev => {
          const newCount = prev + 1;
          const maxIdle = activeSub.idleTimeout || 30;
          if (newCount >= maxIdle) {
            // Trigger inactivity warning
            clearInterval(playInterval);
            triggerIdleWarning();
          }
          return newCount;
        });

      }, 1000);
    }
    return () => {
      clearInterval(playInterval);
    };
  }, [activeSub, videoCurrentTime, checkpointAnswered, showIdleWarning]);

  // Helper checking if video is not paused by popups
  const isExamActiveState = () => {
    return !showIdleWarning && !showCheckpointMcq;
  };

  // Idle warning triggers
  const triggerIdleWarning = () => {
    setShowIdleWarning(true);
    setIdleWarningCountdown(5);

    // Trigger secondary warning countdown
    warningCountdownRef.current = setInterval(() => {
      setIdleWarningCountdown(prev => {
        if (prev <= 1) {
          clearInterval(warningCountdownRef.current);
          handleIdleReset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleIdleReset = () => {
    setShowIdleWarning(false);
    clearInterval(warningCountdownRef.current);
    
    // Reset video back to previous checkpoint or beginning
    setVideoCurrentTime(0);
    setVideoProgress(0);
    setLastWatchedTime(0);
    setIdleTimerCount(0);
    alert("🚨 VIDEO RESET: No activity was registered for 30s. Video has been reset back to 0:00.");
  };

  const handleIdleAcknowledge = () => {
    setShowIdleWarning(false);
    clearInterval(warningCountdownRef.current);
    setIdleTimerCount(0);
    triggerToast("Inactivity acknowledged. Continuing playback.");
  };

  // Reset idle timer count on activity
  const handleUserActivity = () => {
    if (activeSub?.type === 'Video' && !showIdleWarning && !showCheckpointMcq) {
      setIdleTimerCount(0);
    }
  };

  // Seek timeline slider
  const handleSeekVideo = (targetSeconds: number) => {
    if (targetSeconds > lastWatchedTime) {
      // restricted, return back
      triggerToast("🚫 SEEK RESTRICTION: You must watch the curriculum video sequentially.");
      setVideoCurrentTime(lastWatchedTime);
    } else {
      setVideoCurrentTime(targetSeconds);
    }
  };

  const handleCheckpointSubmit = () => {
    if (activeSub?.checkpointMcq && selectedCheckpointAns === activeSub.checkpointMcq.answer) {
      setShowCheckpointMcq(false);
      setCheckpointAnswered(true);
      triggerToast("Correct answer! Resuming video course.");
    } else {
      triggerToast("Incorrect answer. Please try again.");
    }
  };

  const handleSelectSubmodule = (sub: Submodule) => {
    // Clean all players states
    setActiveSub(sub);
    setPdfTimer(sub.minReadingTime || 0);
    setIsPdfCompleteEnabled(sub.minReadingTime === undefined || completedSubmodules[sub.id]);

    setVideoProgress(0);
    setVideoCurrentTime(0);
    setLastWatchedTime(0);
    setIsVideoCompleteEnabled(completedSubmodules[sub.id] || false);
    setCheckpointAnswered(false);
    setShowCheckpointMcq(false);
    setShowIdleWarning(false);
    setIdleTimerCount(0);
  };

  const handleMarkSubmoduleDone = () => {
    if (!activeSub) return;

    const updated = { ...completedSubmodules, [activeSub.id]: true };
    setCompletedSubmodules(updated);
    saveProgressToStorage(updated);
    
    triggerToast(`Submodule "${activeSub.title}" completed!`);
  };

  const formatTimer = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <span className="text-sm font-semibold text-text-secondary">Loading your courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="space-y-6 animate-slide-in select-none" 
      onMouseMove={handleUserActivity}
      onKeyDown={handleUserActivity}
      onClick={handleUserActivity}
    >
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 border border-border text-white rounded-xl shadow-2xl animate-bounce-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">{toastMessage}</div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
            <span>Student Hub</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold text-[10px]">My Learning</span>
          </div>
          <h2 className="text-2xl font-black text-text-primary mt-2 tracking-tight font-display-premium">Learning Pathways</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Watch lectures with interactivity checkpoints and download course certifications.
          </p>
        </div>
      </div>

      {!selectedCourse ? (
        /* Course Grid View */
        courses.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl border border-border shadow-sm text-center">
            <BookOpen className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-text-primary mb-1">No courses available</h3>
            <p className="text-sm text-text-secondary">Courses will appear here once they are published by your organization.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map(crs => {
              const isCertified = crs.progressRate === 100;
              return (
                <div 
                  key={crs.id} 
                  className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col md:flex-row hover:border-secondary transition-all duration-300"
                >
                  <div className="md:w-56 h-44 md:h-auto shrink-0 relative bg-slate-100">
                    <img src={crs.thumbnail} alt={crs.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[9px] font-extrabold text-slate-850 shadow-sm uppercase tracking-wide">
                        {crs.program}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-black text-text-primary leading-tight">{crs.title}</h3>
                      <p className="text-[11px] text-text-secondary line-clamp-2 mt-1 leading-snug">{crs.description}</p>
                    </div>

                    <div className="space-y-4 pt-3 border-t border-border mt-4">
                      <div className="flex justify-between items-center text-xs font-bold text-text-primary">
                        <span>Track Progress</span>
                        <span className="text-indigo-650">{crs.progressRate}%</span>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${crs.progressRate}%` }}></div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedCourse(crs)}
                          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center"
                        >
                          Enter Course
                        </button>
                        
                        {isCertified && (
                          <button 
                            onClick={() => triggerToast("Downloading course certificate PDF...")}
                            className="px-3 bg-emerald-50 border border-emerald-200 text-emerald-650 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center shadow-sm"
                            title="Download Certificate"
                          >
                            <Award className="h-4.5 w-4.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Course Workspace Player */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left panel: Modules Navigation List */}
          <div className="space-y-4 lg:col-span-1">
            <button 
              onClick={() => { setSelectedCourse(null); setActiveSub(null); }}
              className="text-xs font-bold text-indigo-600 hover:underline mb-1 flex items-center gap-1"
            >
              ← Back to Tracks
            </button>

            <div className="bg-white border border-border rounded-2xl p-4 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest border-b pb-2">Course syllabus</h3>
              
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
                {selectedCourse.modules.map((mod, mIdx) => (
                  <div key={mod.id} className="space-y-2">
                    <h4 className="text-xs font-bold text-text-primary leading-tight">{mod.title}</h4>
                    <div className="space-y-1.5 pl-2 border-l border-border">
                      {mod.submodules.map(sub => {
                        const isDone = completedSubmodules[sub.id];
                        const isPlaying = activeSub?.id === sub.id;

                        return (
                          <div 
                            key={sub.id}
                            onClick={() => handleSelectSubmodule(sub as Submodule)}
                            className={`p-2.5 rounded-lg border text-[11px] font-semibold flex items-center justify-between cursor-pointer transition-all ${
                              isPlaying 
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm font-bold' 
                                : isDone 
                                ? 'bg-emerald-50/50 border-emerald-100 text-slate-655 hover:border-emerald-250' 
                                : 'bg-slate-50 border-slate-150 text-text-primary hover:border-secondary'
                            }`}
                          >
                            <span className="truncate mr-2">{sub.title}</span>
                            {isDone ? (
                              <CheckCircle2 className={`h-4 w-4 shrink-0 ${isPlaying ? 'text-white' : 'text-emerald-500'}`} />
                            ) : sub.type === 'Video' ? (
                              <Play className={`h-3.5 w-3.5 shrink-0 ${isPlaying ? 'text-white' : 'text-rose-500'}`} />
                            ) : (
                              <FileText className={`h-3.5 w-3.5 shrink-0 ${isPlaying ? 'text-white' : 'text-blue-500'}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {selectedCourse.modules.length === 0 && (
                  <div className="text-xs text-text-secondary text-center py-6">No modules available for this course.</div>
                )}
              </div>
            </div>
          </div>

          {/* Right panel: Active learning player space */}
          <div className="lg:col-span-3">
            {activeSub ? (
              <div className="bg-white border border-border rounded-3xl p-6 shadow-sm space-y-6 min-h-[460px] flex flex-col justify-between relative overflow-hidden">
                
                {/* Module title/info */}
                <div className="border-b pb-4 flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-sm uppercase tracking-wide">
                      {activeSub.type} COMPONENT
                    </span>
                    <h3 className="text-lg font-black text-text-primary mt-2">{activeSub.title}</h3>
                  </div>
                  {completedSubmodules[activeSub.id] && (
                    <span className="bg-emerald-50 border border-emerald-250 text-emerald-600 font-extrabold text-[10px] px-2.5 py-1 rounded-xl uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  )}
                </div>

                {/* Resource Viewer Frame (Real interactive view!) */}
                {activeSub.url ? (
                  <div className="w-full bg-slate-50 border border-border rounded-2xl overflow-hidden p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs border-b pb-2">
                      <span className="font-bold text-text-primary flex items-center gap-2">
                        <FileText className="h-4 w-4 text-indigo-600" />
                        Interactive Resource Window
                      </span>
                      <div className="flex items-center gap-2">
                        <a 
                          href={activeSub.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-white border text-text-primary hover:bg-slate-50 rounded-lg font-bold flex items-center gap-1.5 shadow-sm text-[10px]"
                        >
                          <ExternalLink className="h-3 w-3" /> View Fullscreen
                        </a>
                        <a 
                          href={activeSub.url} 
                          download
                          className="px-2.5 py-1 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-bold flex items-center gap-1.5 shadow-sm text-[10px]"
                        >
                          <Download className="h-3 w-3" /> Download Resource
                        </a>
                      </div>
                    </div>

                    {activeSub.type === 'Video' ? (
                      <div className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-inner">
                        <video 
                          src={activeSub.url} 
                          controls 
                          className="w-full h-full object-contain"
                          onTimeUpdate={(e) => {
                            const video = e.currentTarget;
                            setVideoCurrentTime(video.currentTime);
                            const duration = video.duration || activeSub.videoDuration || 600;
                            const pct = Math.min(100, Math.round((video.currentTime / duration) * 100));
                            setVideoProgress(pct);

                            if (video.currentTime >= duration) {
                              setIsVideoCompleteEnabled(true);
                            }
                          }}
                        />
                      </div>
                    ) : (activeSub.type === 'PDF' || activeSub.url.toLowerCase().endsWith('.pdf') || activeSub.url.toLowerCase().includes('pdf') || activeSub.url.startsWith('/mock-storage/')) ? (
                      <div className="h-[450px] border border-slate-200 rounded-xl overflow-hidden bg-white shadow-inner">
                        <iframe 
                          src={`${activeSub.url}#toolbar=1`} 
                          className="w-full h-full border-none"
                        />
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-white border rounded-xl space-y-3">
                        <FileText className="h-10 w-10 text-slate-400 mx-auto" />
                        <h5 className="font-bold text-text-primary text-sm">{activeSub.title}</h5>
                        <p className="text-xs text-text-secondary">Click the download button or open in a fullscreen window to review this resource.</p>
                      </div>
                    )}
                  </div>
                ) : null}


                {/* Video Playback restrictions overlay (If url is not present, render simulated player) */}
                {!activeSub.url && activeSub.type === 'Video' && (
                  <div className="flex-1 flex flex-col justify-between py-6 relative">
                    
                    {/* Simulated Player Box */}
                    <div className="bg-slate-950 border border-border rounded-2xl h-64 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden text-white shadow-2xl">
                      {showIdleWarning && (
                        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 z-20 space-y-3">
                          <AlertCircle className="h-10 w-10 text-amber-500 animate-bounce" />
                          <h4 className="font-black text-sm text-white">Are you still watching?</h4>
                          <p className="text-xs text-text-secondary">Please acknowledge within {idleWarningCountdown}s to prevent video reset.</p>
                          <button 
                            type="button"
                            onClick={handleIdleAcknowledge}
                            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                          >
                            Yes, I am watching
                          </button>
                        </div>
                      )}

                      {showCheckpointMcq && activeSub.checkpointMcq && (
                        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 z-20 space-y-4 text-left select-none">
                          <div className="w-full max-w-md bg-[#1e293b] p-5 rounded-2xl border border-border/60 space-y-3">
                            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Learning Checkpoint MCQ</span>
                            <h4 className="text-xs font-bold text-white leading-normal">{activeSub.checkpointMcq.question}</h4>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {activeSub.checkpointMcq.options.map((opt, idx) => {
                                const optChar = String.fromCharCode(65 + idx);
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSelectedCheckpointAns(optChar)}
                                    className={`p-2 border rounded-lg text-left transition-all ${
                                      selectedCheckpointAns === optChar 
                                        ? 'border-indigo-500 bg-indigo-650 text-white font-bold' 
                                        : 'border-border bg-[#151c2c] text-slate-300 hover:border-secondary'
                                    }`}
                                  >
                                    {optChar}. {opt}
                                  </button>
                                );
                              })}
                            </div>
                            
                            <button
                              type="button"
                              onClick={handleCheckpointSubmit}
                              className="w-full py-2 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-[11px] uppercase tracking-wider rounded-xl transition-colors mt-2"
                            >
                              Submit Checkpoint Answer
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Fake Player Content */}
                      <Play className="h-12 w-12 text-text-secondary mb-2 animate-pulse" />
                      <span className="text-xs text-text-secondary">LMS Video Player • Seek Restrictions Enabled</span>
                      <span className="text-[10px] text-text-secondary font-mono mt-1">Watching: {formatTimer(videoCurrentTime)} / {formatTimer(activeSub.videoDuration || 600)}</span>
                    </div>

                    {/* Restricted Timeline Control */}
                    <div className="mt-4 space-y-2.5">
                      <div className="flex justify-between items-center text-xs font-bold text-text-secondary">
                        <span>Video Watch Progress</span>
                        <span>{videoProgress}% Watched</span>
                      </div>
                      
                      <div className="w-full bg-slate-100 rounded-full h-2 relative flex items-center cursor-pointer">
                        {/* Buffer bar showing last watched block */}
                        <div 
                          className="bg-indigo-250 absolute h-full rounded-full" 
                          style={{ width: `${Math.round((lastWatchedTime / (activeSub.videoDuration || 600)) * 100)}%` }} 
                        />
                        {/* Active player timeline indicator */}
                        <div 
                          className="bg-indigo-650 absolute h-full rounded-full" 
                          style={{ width: `${videoProgress}%` }} 
                        />
                      </div>
                      
                      {/* Fake seeks handler */}
                      <div className="flex justify-between text-[10px] text-text-secondary font-bold">
                        <span>0:00</span>
                        <div className="flex gap-2">
                          <button 
                            type="button" 
                            onClick={() => handleSeekVideo(Math.max(0, videoCurrentTime - 10))}
                            className="hover:underline"
                          >
                            Rewind 10s
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleSeekVideo(Math.min(activeSub.videoDuration || 600, videoCurrentTime + 10))}
                            className="hover:underline"
                          >
                            Forward 10s
                          </button>
                        </div>
                        <span>{formatTimer(activeSub.videoDuration || 600)}</span>
                      </div>
                    </div>

                  </div>
                )}

                {/* PDF/Reading Timer restriction console (Simulated only when no url is supplied) */}
                {!activeSub.url && (activeSub.type === 'PDF' || activeSub.type === 'Reading') && (
                  <div className="flex-1 flex flex-col justify-between py-6">
                    <div className="bg-slate-50 border border-border rounded-2xl p-8 text-center space-y-4 h-64 flex flex-col items-center justify-center">
                      <FileText className="h-12 w-12 text-text-secondary mb-1" />
                      <h4 className="text-sm font-black text-text-primary">Reviewing Curriculum PDF Spec</h4>
                      
                      {pdfTimer > 0 ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-800 font-bold rounded-xl text-xs">
                          <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                          <span>Reading constraint timer: {formatTimer(pdfTimer)} remaining</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Verification complete. Mark complete is open.</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* LMS Submodule Completion Buttons */}
                <div className="border-t pt-4 flex justify-end gap-3 mt-4">
                  <button
                    disabled={activeSub.type === 'Video' ? !isVideoCompleteEnabled : !isPdfCompleteEnabled}
                    onClick={handleMarkSubmoduleDone}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-slate-350 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Mark Complete
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-white border border-border rounded-3xl p-16 text-center text-text-secondary italic shadow-sm min-h-[460px] flex flex-col items-center justify-center">
                <BookOpen className="h-12 w-12 text-slate-300 mb-3" />
                Select an active lecture submodule from the syllabus on the left to begin learning.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
