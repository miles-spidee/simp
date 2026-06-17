"use client";

import React from 'react';
import { useDashboard } from '../DashboardContext';

export default function CapstonePage() {
  const {
    capstoneStatus,
    capstoneSubtasks,
    handleToggleSubtask,
    capstoneCommits,
    isEditingCapstone,
    setIsEditingCapstone,
    capstoneRepoLink,
    setCapstoneRepoLink,
    capstoneLiveLink,
    setCapstoneLiveLink,
    handleSaveCapstone,
    lintLogs,
    isLintingActive,
    runDiagnostics,
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
            <span className="text-blue-600 font-extrabold">Projects</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Capstone Projects</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track your milestones, subtasks progression, guide reviews and commits history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Workspace Info */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-2 py-0.5">
              Active Workspace Project
            </span>
            <h2 className="text-xl font-bold text-slate-800 mt-1">Pinesphere Intern ERP & Assessment Client</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              The Capstone project is a critical component of graduation parameters. Complete building the ERP Client interfaces, test integrations, and submit repository connections.
            </p>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Guide / Mentor</span>
                <span className="text-slate-800 font-semibold mt-1 block">Mr. Anand Jayavel (Senior Architect)</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Submission Status</span>
                <span className="text-amber-605 font-semibold mt-1 block">{capstoneStatus}</span>
              </div>
            </div>
          </div>

          {/* Capstone Phase Roadmap */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
              Capstone Phase Roadmap
            </h3>

            <div className="relative pl-6 space-y-6 border-l border-slate-200">
              {[
                { title: 'Phase 1: Project Outline Proposal', desc: 'Define functional features and database structures.', status: 'completed' },
                { title: 'Phase 2: UI Wireframes & Mockups', desc: 'Deliver Figma layout designs and theme configurations.', status: 'completed' },
                { title: 'Phase 3: Frontend Development & State Layouts', desc: 'Build Next.js client pages and state controls.', status: 'active' },
                { title: 'Phase 4: API Integrations & Database Tests', desc: 'Sync API middlewares and log tables.', status: 'pending' },
                { title: 'Phase 5: Deployment & Proctored Client Audits', desc: 'Final launch checks and verification reviews.', status: 'pending' },
              ].map((ph, idx) => (
                <div key={idx} className="relative" style={{ contentVisibility: 'auto' }}>
                  <span className={`absolute -left-9 top-0.5 h-6 w-6 rounded-none flex items-center justify-center text-[10px] font-bold border ${ph.status === 'completed'
                      ? 'bg-emerald-500 border-emerald-600 text-white'
                      : ph.status === 'active'
                        ? 'bg-blue-650 border-blue-600 text-white animate-pulse'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}>
                    {idx + 1}
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                      <span>{ph.title}</span>
                      {ph.status === 'completed' && <span className="text-[8px] bg-emerald-50 border border-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-sm uppercase">Cleared</span>}
                      {ph.status === 'active' && <span className="text-[8px] bg-blue-50 border border-blue-100 text-blue-600 px-1.5 py-0.5 rounded-sm uppercase">Active Development</span>}
                    </h4>
                    <p className="text-[11px] text-slate-500">{ph.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Checklist of Subtasks for Phase 3 and Phase 4 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
                Phase 3 & 4 Subtask Verification
              </h3>
              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 border border-blue-100">
                {capstoneSubtasks.filter(t => t.completed).length} / {capstoneSubtasks.length} Completed
              </span>
            </div>
            <div className="space-y-3">
              {capstoneSubtasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between gap-4 text-xs">
                  <button
                    onClick={() => handleToggleSubtask(task.id)}
                    className="flex items-start gap-3 text-left focus:outline-none group mt-0.5 cursor-pointer"
                  >
                    <span className={`h-4.5 w-4.5 border flex items-center justify-center transition-all shrink-0 ${task.completed
                        ? 'bg-emerald-500 border-emerald-600 text-white'
                        : 'bg-white border-slate-300 group-hover:border-blue-500 text-transparent'
                      }`}>
                      ✓
                    </span>
                    <div className="space-y-0.5">
                      <span className={task.completed ? 'line-through text-slate-400' : 'text-slate-655 font-medium'}>
                        {task.task}
                      </span>
                      <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                        Phase {task.phase} check
                      </span>
                    </div>
                  </button>
                  <span className={`text-[8px] font-bold uppercase tracking-wider border px-1.5 py-0.5 shrink-0 ${task.completed
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                    : 'bg-amber-50 border-amber-100 text-amber-600'
                  }`}>
                    {task.completed ? 'Passed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Guide Review Syncs & Commits logs */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
              Guide Code Review Comments & Commits Log
            </h3>
            <div className="space-y-4">
              {capstoneCommits.map((item, idx) => (
                <div key={idx} className="border-l-2 border-blue-500 pl-4 py-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 border border-slate-200 text-[10px]">
                        {item.commit}
                      </span>
                      <span className="font-bold text-slate-800">{item.message}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{item.date}</span>
                  </div>
                  <div className="text-[11px] text-slate-450">
                    Authored by: <strong className="text-slate-500">{item.author}</strong>
                  </div>
                  {item.guideComment ? (
                    <div className="bg-blue-50/50 border border-blue-100 p-3 text-xs text-blue-700 italic">
                      💬 <strong>{item.guideComment.split(':')[0]}:</strong>
                      <span>{item.guideComment.split(':').slice(1).join(':')}</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 italic">No feedback comments logged on this commit.</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Project Link Submission */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
              Project Link Submission
            </h3>

            {isEditingCapstone ? (
              <form onSubmit={handleSaveCapstone} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">GitHub Code Link</label>
                  <input
                    type="url"
                    required
                    value={capstoneRepoLink}
                    onChange={(e) => setCapstoneRepoLink(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Live Deployment Link</label>
                  <input
                    type="url"
                    placeholder="https://my-app.vercel.app"
                    value={capstoneLiveLink}
                    onChange={(e) => setCapstoneLiveLink(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Submit Project Links
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1 bg-slate-50 p-3.5 border border-slate-150">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">GitHub Code Repository</span>
                  <span className="text-xs text-blue-650 font-semibold truncate block hover:underline cursor-pointer">{capstoneRepoLink || 'Not Linked'}</span>
                </div>
                <div className="space-y-1 bg-slate-50 p-3.5 border border-slate-150">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Live Deploy Link</span>
                  <span className="text-xs text-blue-650 font-semibold truncate block hover:underline cursor-pointer">{capstoneLiveLink || 'Not Linked'}</span>
                </div>
                <button
                  onClick={() => setIsEditingCapstone(true)}
                  className="w-full py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-850 text-xs font-bold text-slate-655 uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Modify Submissions
                </button>
              </div>
            )}

            <div className="bg-slate-50 p-4 border border-slate-150 text-xs text-slate-500 space-y-2">
              <div className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">Syllabus Criteria:</div>
              <p className="leading-relaxed">
                • Verified deployment in Vercel<br />
                • JWT authorization modules active<br />
                • Validated check-in/out logs synced
              </p>
            </div>
          </div>

          {/* Staging Build diagnostics preview logs */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
              Staging Build Diagnostics
            </h3>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Deploy Target:</span>
                <span className="text-slate-850 font-bold bg-blue-50 border border-blue-100 text-blue-600 px-1.5 py-0.5">Vercel Serverless</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Active Branch:</span>
                <span className="text-slate-800 font-mono font-bold">main</span>
              </div>

              {/* Diagnostics Log Screen */}
              <div className="bg-slate-900 text-slate-200 p-3.5 font-mono text-[10px] h-32 overflow-y-auto space-y-1.5 rounded-sm">
                {lintLogs.length === 0 ? (
                  <span className="text-slate-500 italic">No diagnostics logs parsed. Click trigger button to run.</span>
                ) : (
                  lintLogs.map((log, lIdx) => (
                    <div key={lIdx} className={log.startsWith('✓') || log.includes('Passed') ? 'text-emerald-450' : 'text-blue-300'}>
                      {log}
                    </div>
                  ))
                )}
              </div>

              <button
                disabled={isLintingActive}
                onClick={runDiagnostics}
                className="w-full py-2 border border-blue-600 hover:bg-blue-650 hover:text-white text-blue-650 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLintingActive ? 'Running Diagnostics...' : 'Trigger Staging Rebuild'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
