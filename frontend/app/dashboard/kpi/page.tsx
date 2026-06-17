"use client";

import React, { useState } from 'react';
import { Award, Target, TrendingUp, BarChart3, Download } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

export default function KpiPage() {
  const { kpiStats, showToastNotification } = useDashboard();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const weeks = [
    { week: 'W1', score: 75, date: 'May 08', x: 40, y: 65 },
    { week: 'W2', score: 80, date: 'May 15', x: 144, y: 57 },
    { week: 'W3', score: 85, date: 'May 22', x: 248, y: 49 },
    { week: 'W4', score: 92, date: 'May 29', x: 352, y: 38 },
    { week: 'W5', score: 88, date: 'June 05', x: 456, y: 44 },
    { week: 'W6', score: 91, date: 'June 12', x: 560, y: 39 },
  ];

  // SVG parameters
  const viewWidth = 600;
  const viewHeight = 220;

  // Path coordinates
  const linePath = "M 40, 65 C 75, 65, 109, 57, 144, 57 C 179, 57, 213, 49, 248, 49 C 283, 49, 317, 38, 352, 38 C 387, 38, 421, 44, 456, 44 C 491, 44, 525, 39, 560, 39";
  const areaPath = `${linePath} L 560, 185 L 40, 185 Z`;

  // Calculate stats
  const averageScore = (weeks.reduce((acc, w) => acc + w.score, 0) / weeks.length).toFixed(1);
  const consistencyScore = 94; // Mock index based on attendance and task completions
  const improvement = weeks[weeks.length - 1].score - weeks[0].score;

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Top Scorecard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cumulative Score Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between hover:shadow-md hover:border-blue-500/30 transition-all duration-300">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cumulative Avg Score</span>
            <div className="text-2xl font-black text-slate-800 tracking-tight">{averageScore}%</div>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm uppercase tracking-wide">Excellent</span>
          </div>
          <div className="h-12 w-12 bg-blue-50 border border-blue-100 flex items-center justify-center rounded-xl text-blue-600 shadow-sm">
            <Award className="h-6 w-6" />
          </div>
        </div>

        {/* Consistency Index Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between hover:shadow-md hover:border-blue-500/30 transition-all duration-300">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consistency Index</span>
            <div className="text-2xl font-black text-slate-800 tracking-tight">{consistencyScore}/100</div>
            <span className="text-[10px] text-indigo-650 font-bold bg-indigo-50 px-2 py-0.5 rounded-sm uppercase tracking-wide">High Stability</span>
          </div>
          <div className="h-12 w-12 bg-indigo-50 border border-indigo-100 flex items-center justify-center rounded-xl text-indigo-650 shadow-sm">
            <Target className="h-6 w-6" />
          </div>
        </div>

        {/* Improvement Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between hover:shadow-md hover:border-blue-500/30 transition-all duration-300">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Growth Velocity</span>
            <div className="text-2xl font-black text-slate-800 tracking-tight">+{improvement}%</div>
            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-sm uppercase tracking-wide">Upward Trend</span>
          </div>
          <div className="h-12 w-12 bg-emerald-50 border border-emerald-100 flex items-center justify-center rounded-xl text-emerald-600 shadow-sm">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance dimensions */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="h-4.5 w-4.5 text-blue-600" />
                <span>KPI Performance Dimensions</span>
              </h3>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Updated 1 day ago</span>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Technical Implementation (TypeScript, Next.js)', score: kpiStats.technical, color: 'bg-blue-600' },
                { label: 'Task Delivery & Timeline Punctuality', score: kpiStats.delivery, color: 'bg-indigo-600' },
                { label: 'Communication & Active Coordinator Syncs', score: kpiStats.communication, color: 'bg-purple-650' },
                { label: 'Attendance Rate', score: kpiStats.attendance, color: 'bg-emerald-500' },
                { label: 'Collaboration & Team Peer Syncs', score: kpiStats.collaboration, color: 'bg-teal-500' }
              ].map((stat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">{stat.label}</span>
                    <span className="text-slate-850">{stat.score}/100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 overflow-hidden">
                    <div className={`h-full transition-all duration-700 ${stat.color}`} style={{ width: `${stat.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Curved Line chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
                Weekly Progression Trends
              </h3>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5">Rating Averages</span>
            </div>
            
            <div className="relative pt-6 px-2">
              <svg className="w-full h-auto" viewBox={`0 0 ${viewWidth} ${viewHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Gradient fill */}
                  <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#004AC6" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#004AC6" stopOpacity="0.00" />
                  </linearGradient>
                  {/* Grid Lines */}
                  <pattern id="grid" width="104" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 104 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* Grid Pattern Background */}
                <rect x="40" y="25" width="520" height="160" fill="url(#grid)" />
                
                {/* Horizontal Baseline */}
                <line x1="40" y1="185" x2="560" y2="185" stroke="#cbd5e1" strokeWidth="1" />

                {/* Y-Axis Label references */}
                <text x="15" y="30" className="text-[8px] font-bold fill-slate-400 font-mono text-right" textAnchor="end">100%</text>
                <text x="15" y="70" className="text-[8px] font-bold fill-slate-400 font-mono text-right" textAnchor="end">75%</text>
                <text x="15" y="110" className="text-[8px] font-bold fill-slate-400 font-mono text-right" textAnchor="end">50%</text>
                <text x="15" y="150" className="text-[8px] font-bold fill-slate-400 font-mono text-right" textAnchor="end">25%</text>
                <text x="15" y="188" className="text-[8px] font-bold fill-slate-400 font-mono text-right" textAnchor="end">0%</text>

                {/* Gradient area under the line path */}
                <path d={areaPath} fill="url(#chart-gradient)" />

                {/* Main Curved Line */}
                <path d={linePath} stroke="#004AC6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Interactive circles */}
                {weeks.map((node, idx) => {
                  const isHovered = hoveredIndex === idx;
                  return (
                    <g key={idx}>
                      {/* Invisible pointer overlay */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="18"
                        className="cursor-pointer fill-transparent stroke-transparent"
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      />
                      {/* Visual node */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isHovered ? "6" : "4.5"}
                        className="transition-all duration-150 cursor-pointer pointer-events-none"
                        fill="#ffffff"
                        stroke="#004AC6"
                        strokeWidth="3.5"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Dynamic Overlay Tooltip */}
              {hoveredIndex !== null && (
                <div 
                  className="absolute bg-slate-900 border border-slate-700 text-white font-bold p-2.5 shadow-xl pointer-events-none rounded-xl transition-all duration-150 text-center space-y-0.5 animate-slide-in"
                  style={{
                    left: `${(weeks[hoveredIndex].x / viewWidth) * 100}%`,
                    top: `${(weeks[hoveredIndex].y / viewHeight) * 100 - 8}%`,
                    transform: 'translate(-50%, -100%)'
                  }}
                >
                  <div className="text-[9px] text-blue-400 uppercase tracking-widest">{weeks[hoveredIndex].week} Rating</div>
                  <div className="text-sm font-black text-white">{weeks[hoveredIndex].score}%</div>
                  <div className="text-[8px] text-slate-400 font-medium">{weeks[hoveredIndex].date}</div>
                </div>
              )}
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between pl-8 pr-6 text-[9px] text-slate-400 font-bold uppercase pt-1">
              {weeks.map((node, idx) => (
                <div key={idx} className="w-8 text-center">{node.week}</div>
              ))}
            </div>

            <div className="text-[10px] text-slate-400 font-bold text-center mt-2.5">
              Bi-weekly rating averages are calculated from pull requests and assignment reviews.
            </div>
          </div>

          {/* Highlights grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Technical Highlights (Strengths)</span>
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li className="flex items-start gap-2 text-slate-655 leading-relaxed">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Next.js App Routing Layouts</strong>: Excellent structure definitions.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-655 leading-relaxed">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>State Management Interceptors</strong>: Solid handling of local states.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-655 leading-relaxed">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Proctored Exam Focus Checks</strong>: Clean implementation of blur/focus locks.</span>
                </li>
              </ul>
            </div>

            {/* Growth Areas */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Growth Dimensions (Weak Highlights)</span>
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li className="flex items-start gap-2 text-slate-655 leading-relaxed">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><strong>Database Cascade Operations</strong>: Refine delete constraints in nested queries.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-655 leading-relaxed">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><strong>Hydration Mismatch Audits</strong>: Eliminate client side state conflicts on render.</span>
                </li>
                <li className="flex items-start gap-2 text-slate-655 leading-relaxed">
                  <span className="text-amber-500 font-bold">•</span>
                  <span><strong>Message Queue Broker Pools</strong>: Dive deeper into partitioning strategies.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Mentor Reviews */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Mentor Reviews & Sync Logs</span>
            </h3>
            <div className="space-y-4 divide-y divide-slate-150">
              {[
                { reviewer: 'Mr. Anand Jayavel (Senior Architect)', date: 'June 12, 2026', comment: 'Harini showed great technical skill in deploying server components and optimizing API gateways. Work on unit tests next sprint.' },
                { reviewer: 'System Operations Team', date: 'June 05, 2026', comment: 'Punctuality parameters are highly secure. Verified check-in logs show consistent coverage.' }
              ].map((rev, idx) => (
                <div key={idx} className="pt-4 first:pt-0 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-blue-600">{rev.reviewer}</span>
                    <span className="text-slate-400">{rev.date}</span>
                  </div>
                  <p className="text-slate-500 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => showToastNotification("Downloading Harini_KPI_Report.pdf...")}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <Download className="h-4.5 w-4.5" />
              <span>Download Report PDF</span>
            </button>
          </div>

          {/* Self Evaluation checkin */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
              Self-Evaluation Request
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete your monthly self-assessment reviews. Your coordinator Mr. Anand will check it during the sync logs cycle.
            </p>
            <button
              onClick={() => showToastNotification("Evaluation request sent to coordinator.")}
              className="w-full py-2 border border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-xs font-bold text-slate-705 hover:text-blue-600 transition-colors"
            >
              Submit Self-Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
