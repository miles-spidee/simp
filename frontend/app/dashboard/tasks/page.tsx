"use client";

import React from 'react';
import { Filter, Download, User, CalendarDays, Clock, Lock, Upload, UploadCloud, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

export default function TasksPage() {
  const {
    assignments,
    assignmentFilter,
    setAssignmentFilter,
    activeUploadAssignmentId,
    setActiveUploadAssignmentId,
    uploadedFiles,
    handleSimulateBrowse,
    handleRemoveFile,
    handleSimulateSubmit,
    showToastNotification
  } = useDashboard();

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Curriculum</span>
            <span>&gt;</span>
            <span className="text-blue-600 font-extrabold">Assignments</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Project Assignments & Tasks</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track your academic progress and deliverable milestones across all modules.
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => showToastNotification("Filter options: All, Pending, Under Review, Completed.")}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-blue-600 hover:text-blue-600 bg-white rounded-lg text-xs font-bold text-slate-700 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filter</span>
          </button>
          <button 
            onClick={() => showToastNotification("Exporting assignments to CSV...")}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-blue-600 hover:text-blue-600 bg-white rounded-lg text-xs font-bold text-slate-700 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tab Filters Navigation Bar */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-xs font-bold tracking-wide">
        {[
          { key: 'all', label: `All Tasks (${assignments.length})` },
          { 
            key: 'pending', 
            label: `Pending Submission`, 
            badge: assignments.filter(a => a.status === 'pending').length 
          },
          { 
            key: 'review', 
            label: `Under Review`, 
            badge: assignments.filter(a => a.status === 'review').length 
          },
          { 
            key: 'completed', 
            label: `Completed`, 
            badge: assignments.filter(a => a.status === 'completed').length 
          }
        ].map((tab) => {
          const isActive = assignmentFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setAssignmentFilter(tab.key as any)}
              className={`py-3 relative flex items-center gap-2 transition-all cursor-pointer ${
                isActive ? 'text-blue-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`h-4.5 min-w-4.5 px-1.5 flex items-center justify-center text-[9px] font-black rounded-full ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-6 flex flex-col">
        {assignments
          .filter((asg) => {
            if (assignmentFilter === 'all') return true;
            return asg.status === assignmentFilter;
          })
          .map((asg) => {
            const { isOverdue, isLocked } = asg;
            const hasUploadedFile = uploadedFiles[asg.id];

            return (
              <div
                key={asg.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300 relative"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    {/* Header Pill & ID */}
                    <div className="flex items-center gap-2 text-xs">
                      {isOverdue ? (
                        <span className="bg-[#004AC6] text-white font-extrabold text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wide flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                          OVERDUE - LEVEL 1 ESCALATION ACTIVE
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 font-extrabold text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wide">
                          PENDING
                        </span>
                      )}
                      <span className="text-slate-400 font-medium">• ID: {asg.id}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-800 tracking-tight leading-snug">
                      {asg.title}
                    </h3>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium pt-1">
                      {asg.assignedBy && (
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span>Assigned by: <strong className="text-slate-655 font-semibold">{asg.assignedBy}</strong></span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        {isOverdue ? (
                          <>
                            <CalendarDays className="h-3.5 w-3.5 text-red-500" />
                            <span className="text-red-500 font-bold">
                              Due Date: {asg.dueDate}
                            </span>
                          </>
                        ) : asg.id === 'Pr-2026-3Px' ? (
                          <>
                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                            <span className="text-amber-500 font-bold">
                              Due Date: {asg.dueDate}
                            </span>
                          </>
                        ) : (
                          <>
                            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                            <span>
                              Due Date: {asg.dueDate}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Overdue Warning Alert Box */}
                    {isOverdue && asg.alert && (
                      <div className="bg-red-50/70 border border-red-100 rounded-lg p-3.5 mt-4 flex items-start gap-2.5">
                        <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-red-750 font-medium leading-relaxed">
                          Alert: This overdue assignment has automatically notified your Reporting Manager. High-priority resolution required to avoid academic credit deduction.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action block on the right */}
                  <div className="flex flex-col items-end justify-start gap-2 shrink-0 md:self-stretch md:justify-between">
                    {isLocked ? (
                      <div className="flex items-center justify-center h-full pr-2">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                    ) : asg.status === 'pending' ? (
                      <div className="flex flex-col items-end gap-2 w-full md:w-auto mt-2 md:mt-0">
                        <button
                          onClick={() => {
                            if (activeUploadAssignmentId === asg.id) {
                              setActiveUploadAssignmentId(null);
                            } else {
                              setActiveUploadAssignmentId(asg.id);
                            }
                          }}
                          className={`w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer ${
                            asg.id === 'PS-2026-W3'
                              ? 'bg-blue-600 hover:bg-blue-700 text-white animate-pulse'
                              : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-655'
                          }`}
                        >
                          {asg.id === 'Pr-2026-3Px' && <Upload className="h-3.5 w-3.5" />}
                          <span>{asg.id === 'PS-2026-W3' ? 'Submit Work Now' : 'Upload Deliverables'}</span>
                        </button>
                        {asg.id === 'PS-2026-W3' && (
                          <button
                            onClick={() => showToastNotification("Viewing instruction PDF...")}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <span>View Instructions</span>
                            <span className="text-sm">→</span>
                          </button>
                        )}
                      </div>
                    ) : asg.status === 'review' ? (
                      <span className="bg-blue-50 border border-blue-100 text-blue-600 font-extrabold text-[10px] px-3 py-1.5 uppercase tracking-wide rounded-sm mt-2 md:mt-0">
                        Under Review
                      </span>
                    ) : (
                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 font-extrabold text-[10px] px-3 py-1.5 uppercase tracking-wide rounded-sm mt-2 md:mt-0">
                        Completed ✓
                      </span>
                    )}
                  </div>
                </div>

                {/* Expandable Dotted Dropzone */}
                {activeUploadAssignmentId === asg.id && !isLocked && asg.status === 'pending' && (
                  <div className="border-t border-slate-100 pt-5 mt-5 animate-slide-in">
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-700">Drag and drop your files here</h4>
                      <p className="text-[10px] text-slate-400 font-semibold max-w-md mt-1 leading-relaxed">
                        Upload your submission deliverables. Code files max 10MB (.zip, .py) | Reports max 50MB (PDF only).
                      </p>
                      
                      {hasUploadedFile ? (
                        <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-3 max-w-sm">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                          <div className="text-left overflow-hidden">
                            <div className="text-xs font-bold text-slate-700 truncate">{hasUploadedFile}</div>
                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Ready to upload</div>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(asg.id)}
                            className="text-red-500 hover:text-red-750 font-bold text-xs p-1 ml-auto cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ) : null}

                      <div className="flex items-center gap-3 mt-4">
                        <button
                          onClick={() => handleSimulateBrowse(asg.id)}
                          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-655 font-bold text-xs px-4 py-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          Browse Files
                        </button>
                        {hasUploadedFile && (
                          <button
                            onClick={() => handleSimulateSubmit(asg.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-1.5 shadow-sm transition-colors cursor-pointer"
                          >
                            Simulate Upload
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
