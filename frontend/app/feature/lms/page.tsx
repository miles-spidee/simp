"use client";

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Play, FileText, Award, ChevronRight, Users, UserCheck, Loader2
} from 'lucide-react';
import {  Student } from '@/src/types/students.types';
import { Pagination } from '@/components/common/Pagination';
import { lmsService } from '@/src/services/lms.service';
import { CourseItem } from '@/src/api/lms.api';

const MOCK_STUDENTS: any[] = [];

interface Submodule {
  id: string;
  title: string;
  type: 'Video' | 'PDF' | 'Reading' | 'Assignment' | 'Quiz' | 'External Link';
  url: string;
  minReadingTime?: number;
  videoDuration?: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  submodules: Submodule[];
}

interface BatchLms {
  id: string;
  name: string;
  coursesCount: number;
  resourcesCount: number;
  completedRate: number;
  courses: CourseItem[];
}

export default function LMSDashboardPage() {
  const [batches, setBatches] = useState<BatchLms[]>([]);
  const [loading, setLoading] = useState(true);

  // Drill-down states
  const [selectedBatch, setSelectedBatch] = useState<BatchLms | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset pagination on batch change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBatch?.id]);

  // Fetch courses from the database on mount
  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      try {
        const courses = await lmsService.getCourses();
        
        // Build batch structure dynamically from courses
        const totalResources = courses.reduce((sum, c) => 
          sum + c.modules.reduce((mSum, m) => mSum + m.submodules.length, 0), 0
        );

        const batch: BatchLms = {
          id: 'batch-all',
          name: 'All Courses',
          coursesCount: courses.length,
          resourcesCount: totalResources,
          completedRate: courses.length > 0 
            ? Math.round(courses.reduce((sum, c) => sum + c.progressRate, 0) / courses.length) 
            : 0,
          courses,
        };

        setBatches(courses.length > 0 ? [batch] : []);
      } catch (err) {
        console.error('Failed to load LMS courses:', err);
        setBatches([]);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const totalCourses = batches.reduce((sum, b) => sum + b.courses.length, 0);
  const totalResources = batches.reduce((sum, b) => sum + b.resourcesCount, 0);
  const avgCompletionRate = batches.length > 0 
    ? Math.round(batches.reduce((sum, b) => sum + b.completedRate, 0) / batches.length) 
    : 0;

  const getStudentCourseProgress = (course: CourseItem, studentId: string) => {
    if (!(course as any).studentProgress) return 0;
    const progress = (course as any).studentProgress.find((p: any) => p.studentId === studentId);
    return progress ? progress.completionRate : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <span className="text-sm font-semibold text-text-secondary">Loading LMS data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in select-none">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-text-primary tracking-tight">LMS Dashboard</h2>
        <p className="text-sm text-text-secondary mt-1">Audit learning paths progress, view curriculum completion stats, and verify certificates.</p>
      </div>

      {!selectedBatch ? (
        <>
          {/* Metrics Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Active Courses</span>
              <h3 className="text-3xl font-black text-text-primary mt-1">{totalCourses}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Resources Count</span>
              <h3 className="text-3xl font-black text-emerald-600 mt-1">{totalResources}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Completion Rate</span>
              <h3 className="text-3xl font-black text-indigo-650 mt-1">{avgCompletionRate}%</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-405 uppercase tracking-widest">Certificates Issued</span>
                <h3 className="text-3xl font-black text-amber-600 mt-1">0</h3>
              </div>
              <Award className="h-9 w-9 text-amber-500 shrink-0" />
            </div>
          </div>

          {/* Batch list cards */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs text-text-secondary uppercase tracking-widest">Curriculum Progress by Batch</h3>
            {batches.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-border shadow-sm text-center">
                <BookOpen className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-text-secondary">No courses found in the database. Create courses from LMS Management.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {batches.map(b => (
                  <div 
                    key={b.id}
                    onClick={() => setSelectedBatch(b)}
                    className="bg-white p-6 rounded-2xl border border-border hover:border-secondary transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg flex flex-col justify-between space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-bold text-text-secondary uppercase">COHORT</span>
                        <h4 className="text-lg font-black text-text-primary mt-1">{b.name}</h4>
                      </div>
                      <span className="bg-indigo-55/15 text-indigo-650 font-black px-3 py-1 rounded-full text-xs">
                        {b.courses.length} Tracks
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold text-text-secondary pt-2 border-t border-border">
                      <span>Resources Count: <strong className="text-text-primary">{b.resourcesCount}</strong></span>
                      <span>Completed Rate: <strong className="text-indigo-600">{b.completedRate}%</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : !selectedStudent ? (
        /* Students inside Batch */
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <button 
                onClick={() => setSelectedBatch(null)} 
                className="text-xs font-bold text-indigo-600 hover:underline mb-1 block"
              >
                ← Back to Cohorts
              </button>
              <h3 className="text-lg font-black text-text-primary">{selectedBatch.name} - Students</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {MOCK_STUDENTS.length === 0 ? (
              <div className="text-center py-10 text-sm text-text-secondary">
                <Users className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                No students enrolled yet.
              </div>
            ) : (
              MOCK_STUDENTS.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(student => (
                <div 
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className="p-5 border border-border hover:border-secondary hover:shadow-md rounded-2xl transition-all cursor-pointer bg-slate-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                      {student.personalInfo.avatar}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-text-primary">{student.personalInfo.name}</h4>
                      <p className="text-xs text-text-secondary">{student.academicInfo.college} • {student.academicInfo.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 text-xs font-bold text-text-secondary">
                    <div className="text-right">
                      <span>Overall Performance: <strong className="text-indigo-600">{student.performance.overallPerformance}%</strong></span>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs uppercase tracking-wider rounded-xl">
                      View LMS Progress
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {MOCK_STUDENTS.length > itemsPerPage && (
            <div className="mt-4">
              <Pagination 
                currentPage={currentPage} 
                totalPages={Math.ceil(MOCK_STUDENTS.length / itemsPerPage)} 
                onPageChange={setCurrentPage} 
              />
            </div>
          )}
        </div>
      ) : !selectedCourse ? (
        /* Courses inside Batch for Selected Student */
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="text-xs font-bold text-indigo-600 hover:underline mb-1 block"
              >
                ← Back to Students
              </button>
              <h3 className="text-lg font-black text-text-primary">{selectedStudent.personalInfo.name}'s LMS Progress</h3>
              <p className="text-xs text-text-secondary mt-1">{selectedBatch.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {selectedBatch.courses.map(crs => {
              const studentProgressRate = getStudentCourseProgress(crs, selectedStudent.id);
              return (
                <div 
                  key={crs.id}
                  onClick={() => setSelectedCourse(crs)}
                  className="p-5 border border-border hover:border-secondary hover:shadow-md rounded-2xl transition-all cursor-pointer bg-slate-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img src={crs.thumbnail} alt={crs.title} className="h-16 w-24 rounded-lg object-cover bg-slate-100 border shrink-0" />
                    <div className="space-y-1.5">
                      <h4 className="text-base font-black text-text-primary">{crs.title}</h4>
                      <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{crs.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 text-xs font-bold text-text-secondary">
                    <div className="text-right">
                      <span>Completion: <strong className="text-indigo-600">{studentProgressRate}%</strong></span>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs uppercase tracking-wider rounded-xl">
                      View Modules
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Syllabus modules */
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-5">
            <div>
              <button 
                onClick={() => setSelectedCourse(null)} 
                className="text-xs font-bold text-indigo-650 hover:underline mb-1 block"
              >
                ← Back to {selectedStudent.personalInfo.name}'s Courses
              </button>
              <h3 className="text-lg font-black text-text-primary">{selectedCourse.title}</h3>
            </div>
          </div>

          <div className="space-y-6 max-w-4xl">
            {selectedCourse.modules.map(mod => (
              <div key={mod.id} className="border border-slate-150 rounded-2xl overflow-hidden shadow-sm bg-slate-50/20">
                <div className="bg-slate-50 px-5 py-3 border-b flex justify-between items-center text-xs font-bold text-text-primary">
                  <span>{mod.title}</span>
                  <span className="text-[10px] text-text-secondary">{mod.submodules.length} Assets</span>
                </div>
                
                <div className="divide-y divide-border bg-white">
                  {mod.submodules.map(sub => (
                    <div key={sub.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/40">
                      <div className="flex items-center gap-3 font-semibold text-text-primary">
                        {sub.type === 'Video' ? (
                          <Play className="h-4.5 w-4.5 text-rose-500" />
                        ) : (
                          <FileText className="h-4.5 w-4.5 text-blue-500" />
                        )}
                        <span>{sub.title}</span>
                      </div>
                      <span className="bg-indigo-50 border border-indigo-100 text-indigo-650 font-bold px-2 py-0.5 rounded text-[9px] uppercase">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {selectedCourse.modules.length === 0 && (
              <div className="text-sm text-text-secondary text-center py-10">No modules found for this course.</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
