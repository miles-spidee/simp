"use client";

import React, { useEffect, useState } from 'react';
import { InsightService } from '@/src/services/insight.service';
import { InsightForecast, StudentRisk } from '@/src/types/insight.types';
import { 
  Lightbulb, Loader2, TrendingUp, AlertTriangle, ChevronRight, 
  Search, Filter, CheckCircle2, AlertCircle, ArrowUpRight, 
  Users, Briefcase, DollarSign, Calendar, MessageSquare, Mail, 
  Check, Play, UserCheck, ShieldAlert 
} from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';
import { useAuth } from '@/src/context/AuthContext';
import { Drawer } from '@/components/feature/ui/Drawer';
import { Pagination } from "@/components/common/Pagination";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'High Impact' | 'Medium Impact' | 'Critical Impact';
  status: 'Pending' | 'Applied';
  category: 'Academics' | 'Attendance' | 'Placement';
}

const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  { 
    id: 'rec_1', 
    title: 'Schedule remedial assessments for low performance students', 
    description: 'AI detected 15 students who scored below 60% in JavaScript basics. Providing a refresher will raise overall placement readiness by 8%.', 
    impact: 'High Impact', 
    status: 'Pending', 
    category: 'Academics' 
  },
  { 
    id: 'rec_2', 
    title: 'Trigger automated warning SMS for attendance defaulters', 
    description: 'Attendance rates for the Engineering batch dropped by 12% last week. Activating attendance counseling is expected to restore rates back to 90%+', 
    impact: 'Medium Impact', 
    status: 'Pending', 
    category: 'Attendance' 
  },
  { 
    id: 'rec_3', 
    title: 'Conduct resume building workshop for placement batch', 
    description: 'AI prediction shows 22 students are at risk of missing the upcoming placement drive due to incomplete profiles.', 
    impact: 'Critical Impact', 
    status: 'Pending', 
    category: 'Placement' 
  }
];

function ForecastChart({ forecast }: { forecast: InsightForecast }) {
  const allValues = [...forecast.historicalValues, ...forecast.predictedValues];
  const maxVal = Math.max(...allValues) * 1.15;
  const minVal = Math.min(...allValues) * 0.85;
  const range = maxVal - minVal;
  
  const width = 500;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  const getX = (index: number) => {
    return paddingLeft + (index / (allValues.length - 1)) * chartWidth;
  };
  
  const getY = (val: number) => {
    return paddingTop + chartHeight - ((val - minVal) / range) * chartHeight;
  };
  
  let histPath = '';
  const histLen = forecast.historicalValues.length;
  for (let i = 0; i < histLen; i++) {
    const x = getX(i);
    const y = getY(forecast.historicalValues[i]);
    if (i === 0) histPath += `M ${x} ${y}`;
    else histPath += ` L ${x} ${y}`;
  }
  
  let predPath = '';
  for (let i = histLen - 1; i < allValues.length; i++) {
    const x = getX(i);
    const y = getY(allValues[i]);
    if (i === histLen - 1) predPath += `M ${x} ${y}`;
    else predPath += ` L ${x} ${y}`;
  }

  let areaPath = `${histPath}`;
  for (let i = histLen; i < allValues.length; i++) {
    areaPath += ` L ${getX(i)} ${getY(allValues[i])}`;
  }
  areaPath += ` L ${getX(allValues.length - 1)} ${paddingTop + chartHeight}`;
  areaPath += ` L ${getX(0)} ${paddingTop + chartHeight} Z`;

  const isRevenue = forecast.metric.includes('Revenue');

  return (
    <div className="w-full bg-slate-900 border border-border rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-650/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-fuchsia-400 tracking-widest">AI Forecast Model</span>
          <h4 className="text-base font-bold text-slate-100 mt-0.5">{forecast.metric} Timeline</h4>
        </div>
        <div className="flex gap-4 text-[9px] font-bold uppercase tracking-wider text-text-secondary">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
            <span>Historical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-500" />
            <span>AI Projected</span>
          </div>
        </div>
      </div>

      <div className="relative h-[180px] w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0"/>
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="100%" stopColor="#8b5cf6"/>
            </linearGradient>
            <linearGradient id="predGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6"/>
              <stop offset="100%" stopColor="#d946ef"/>
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {Array.from({ length: 4 }).map((_, idx) => {
            const val = minVal + (range / 3) * idx;
            const y = getY(val);
            return (
              <g key={idx}>
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                <text x={paddingLeft - 8} y={y + 3} fill="#64748b" fontSize="8" textAnchor="end" className="font-mono">
                  {isRevenue ? `$${val.toFixed(1)}M` : Math.round(val)}
                </text>
              </g>
            );
          })}

          {/* X Axis Grid and Labels */}
          {allValues.map((val, idx) => {
            const x = getX(idx);
            const isPred = idx >= histLen;
            return (
              <g key={idx}>
                <line x1={x} y1={paddingTop} x2={x} y2={paddingTop + chartHeight} stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                <text x={x} y={height - 6} fill={isPred ? "#d946ef" : "#94a3b8"} fontSize="8" textAnchor="middle" className="font-bold">
                  {isPred ? `Q${idx - histLen + 2} (P)` : `Q${idx + 1}`}
                </text>
              </g>
            );
          })}

          {/* Shaded Area */}
          <path d={areaPath} fill="url(#areaGrad)" />

          {/* Lines */}
          <path d={histPath} fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" />
          <path d={predPath} fill="none" stroke="url(#predGrad)" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" />

          {/* Data Points and Tooltips */}
          {allValues.map((val, idx) => {
            const x = getX(idx);
            const y = getY(val);
            const isPred = idx >= histLen - 1;
            return (
              <g key={idx} className="group cursor-pointer">
                <circle 
                  cx={x} 
                  cy={y} 
                  r={idx === allValues.length - 1 || idx === histLen - 1 ? "5.5" : "4.5"} 
                  fill={isPred ? "#d946ef" : "#6366f1"} 
                  stroke="#0f172a" 
                  strokeWidth="2" 
                />
                
                {/* Tooltip background & text on hover */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <rect 
                    x={x - 30} 
                    y={y - 28} 
                    width="60" 
                    height="18" 
                    rx="6" 
                    fill="#0f172a" 
                    stroke="#334155" 
                    strokeWidth="1" 
                  />
                  <text 
                    x={x} 
                    y={y - 16} 
                    fill="#ffffff" 
                    fontSize="8" 
                    fontWeight="bold" 
                    textAnchor="middle"
                  >
                    {isRevenue ? `$${val.toFixed(1)}M` : Math.round(val)}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-border text-[10px] text-text-secondary font-medium">
        <span>Model: ARIMA-LSTM Fusion</span>
        <span>Confidence Interval: {forecast.confidence}%</span>
      </div>
    </div>
  );
}

export default function PredictiveInsightsPage() {

      // Pagination State
      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 10;

  const { hasPermission } = usePermissions();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [forecasts, setForecasts] = useState<InsightForecast[]>([]);
  const [risks, setRisks] = useState<StudentRisk[]>([]);
  const [selectedForecastIndex, setSelectedForecastIndex] = useState(0);

  // Recommendations state
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [applyingRecId, setApplyingRecId] = useState<string | null>(null);

  // Search & Filter state for risk directory
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | 'Critical' | 'High' | 'Medium'>('All');
  const [factorFilter, setFactorFilter] = useState<'All' | 'Low Attendance' | 'Missed Assessments'>('All');

  // Detail Modal / Drawer state for at-risk students
  const [selectedStudent, setSelectedStudent] = useState<StudentRisk | null>(null);
  const [counselAction, setCounselAction] = useState('Schedule Counseling');
  const [counselNote, setCounselNote] = useState('');
  const [isCounselingSubmitting, setIsCounselingSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await InsightService.getInsightsDashboard();
      setForecasts(data.forecasts);
      setRisks(data.studentRisks);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Apply a recommendation
  const handleApplyRec = (id: string) => {
    setApplyingRecId(id);
    setTimeout(() => {
      setRecommendations(prev => prev.map(rec => {
        if (rec.id === id) {
          return { ...rec, status: 'Applied' as const };
        }
        return rec;
      }));
      setApplyingRecId(null);
    }, 1200);
  };

  // Submit Counseling Action
  const handleCounselSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setIsCounselingSubmitting(true);
    setTimeout(() => {
      // Remove from list or lower risk score
      setRisks(prev => prev.map(s => {
        if (s.studentId === selectedStudent.studentId) {
          return {
            ...s,
            riskScore: Math.max(30, s.riskScore - 25), // Drop the score significantly
            factors: s.factors.filter((_, idx) => idx > 0) // Remove one factor as addressed
          };
        }
        return s;
      }));

      setIsCounselingSubmitting(false);
      setSelectedStudent(null);
      setCounselNote('');
    }, 1500);
  };

  // Filtered risks selector
  const filteredRisks = risks.filter(risk => {
    const matchesSearch = risk.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          risk.program.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesRisk = true;
    if (riskFilter === 'Critical') matchesRisk = risk.riskScore >= 85;
    else if (riskFilter === 'High') matchesRisk = risk.riskScore >= 70 && risk.riskScore < 85;
    else if (riskFilter === 'Medium') matchesRisk = risk.riskScore >= 60 && risk.riskScore < 70;

    let matchesFactor = true;
    if (factorFilter !== 'All') matchesFactor = risk.factors.includes(factorFilter);

    return matchesSearch && matchesRisk && matchesFactor;
  });

  if (!hasPermission('insights.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-text-secondary font-sans">
        <p className="font-semibold">You do not have permission to view predictive insights.</p>
      </div>
    );
  }

  if (loading || forecasts.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-405" />
      </div>
    );
  }

  const currentForecast = forecasts[selectedForecastIndex];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header Area */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2 tracking-tight">
            <Lightbulb className="w-6 h-6 text-fuchsia-600 animate-pulse" />
            Predictive AI Insights
          </h1>
          <p className="text-text-secondary text-sm mt-0.5">Machine learning forecasts, enrollment trends, and academic student risk matrix.</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-border rounded-xl px-4 py-2 text-text-secondary font-medium">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
          <span>Model Updated: Just now</span>
        </div>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div 
          onClick={() => setSelectedForecastIndex(0)}
          className={`cursor-pointer rounded-2xl p-5 border transition-all ${
            selectedForecastIndex === 0 
              ? 'bg-fuchsia-50/50 border-fuchsia-200 shadow-md ring-1 ring-fuchsia-300/30' 
              : 'bg-white border-border hover:shadow-md'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 bg-fuchsia-100 text-fuchsia-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">+15% Predicted</span>
          </div>
          <h3 className="text-text-secondary text-xs font-bold uppercase tracking-wider mt-4">Next Quarter Revenue</h3>
          <p className="text-2xl font-bold text-text-primary mt-1">${forecasts[0].predictedValues[0]}M</p>
          <p className="text-[11px] text-text-secondary mt-2 font-medium">Confidence Score: {forecasts[0].confidence}%</p>
        </div>

        <div 
          onClick={() => setSelectedForecastIndex(1)}
          className={`cursor-pointer rounded-2xl p-5 border transition-all ${
            selectedForecastIndex === 1 
              ? 'bg-fuchsia-50/50 border-fuchsia-200 shadow-md ring-1 ring-fuchsia-300/30' 
              : 'bg-white border-border hover:shadow-md'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 bg-indigo-100 text-indigo-650 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">+8% Predicted</span>
          </div>
          <h3 className="text-text-secondary text-xs font-bold uppercase tracking-wider mt-4">Expected Placements</h3>
          <p className="text-2xl font-bold text-text-primary mt-1">{forecasts[1].predictedValues[0]} Students</p>
          <p className="text-[11px] text-text-secondary mt-2 font-medium">Confidence Score: {forecasts[1].confidence}%</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-border">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">Requires Review</span>
          </div>
          <h3 className="text-text-secondary text-xs font-bold uppercase tracking-wider mt-4">High Risk Students</h3>
          <p className="text-2xl font-bold text-text-primary mt-1">
            {risks.filter(r => r.riskScore >= 80).length} Defaulters
          </p>
          <p className="text-[11px] text-text-secondary mt-2 font-medium">Based on Attendance & Assessments</p>
        </div>
      </div>

      {/* Main Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Forecast Visualizer & AI Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active SVG Line Chart */}
          <ForecastChart forecast={currentForecast} />

          {/* AI Prescriptive Recommendations */}
          <div className="bg-white border border-border shadow-sm rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 pb-1.5 border-b border-border">
              <Lightbulb className="w-5 h-5 text-indigo-650 animate-bounce" />
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">AI Recommendations Engine</h3>
            </div>

            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div 
                  key={rec.id} 
                  className={`border rounded-xl p-4.5 transition-all flex flex-col sm:flex-row sm:items-start gap-4 justify-between ${
                    rec.status === 'Applied' ? 'bg-slate-50 border-border opacity-70' : 'bg-white border-border hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        rec.category === 'Placement' ? 'bg-indigo-100 text-indigo-700' :
                        rec.category === 'Attendance' ? 'bg-amber-100 text-amber-700' :
                        'bg-fuchsia-100 text-fuchsia-700'
                      }`}>
                        {rec.category}
                      </span>
                      <span className={`text-[9px] font-bold ${
                        rec.impact === 'Critical Impact' ? 'text-rose-600' :
                        rec.impact === 'High Impact' ? 'text-orange-500' :
                        'text-text-secondary'
                      }`}>
                        {rec.impact}
                      </span>
                    </div>
                    <h4 className="font-bold text-text-primary text-sm leading-snug">{rec.title}</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">{rec.description}</p>
                  </div>

                  <div className="shrink-0 flex items-center">
                    {rec.status === 'Applied' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg">
                        <Check className="w-3.5 h-3.5" />
                        Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApplyRec(rec.id)}
                        disabled={applyingRecId === rec.id}
                        className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white disabled:bg-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        {applyingRecId === rec.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                        <span>Run Action</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Student Risk Matrix */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-border shadow-sm rounded-2xl p-6 space-y-5">
            <div className="flex justify-between items-center pb-1.5 border-b border-border">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Student Risk Directory
              </h3>
              <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-text-secondary">
                {filteredRisks.length} Students
              </span>
            </div>

            {/* Filters Box */}
            <div className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search name or program..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-border rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-fuchsia-500 transition-all font-medium text-text-primary placeholder-slate-400"
                />
              </div>

              {/* Select Category filters */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Severity</span>
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value as any)}
                    className="w-full bg-slate-50 border border-border rounded-lg px-2 py-1.5 text-[10px] font-bold text-text-secondary focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Severity</option>
                    <option value="Critical">Critical (85+)</option>
                    <option value="High">High (70-84)</option>
                    <option value="Medium">Medium (60-69)</option>
                  </select>
                </div>
                
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Risk Driver</span>
                  <select
                    value={factorFilter}
                    onChange={(e) => setFactorFilter(e.target.value as any)}
                    className="w-full bg-slate-50 border border-border rounded-lg px-2 py-1.5 text-[10px] font-bold text-text-secondary focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Factors</option>
                    <option value="Low Attendance">Low Attendance</option>
                    <option value="Missed Assessments">Missed Assessments</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Student Directory List */}
            <div className="divide-y divide-border max-h-[350px] overflow-y-auto pr-1">
              {filteredRisks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((risk) => (
                <div 
                  key={risk.studentId} 
                  onClick={() => setSelectedStudent(risk)}
                  className="py-3.5 hover:bg-slate-50/50 rounded-xl px-2 cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-text-primary text-xs group-hover:text-fuchsia-600 transition-colors">{risk.name}</h4>
                    <p className="text-[10px] text-text-secondary font-medium">{risk.program}</p>
                    <div className="flex gap-1.5 mt-1">
                      {risk.factors.map(f => (
                        <span key={f} className="bg-rose-50 text-rose-600 border border-rose-100 rounded text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        risk.riskScore >= 85 ? 'text-rose-600 animate-pulse' :
                        risk.riskScore >= 70 ? 'text-orange-500' :
                        'text-amber-500'
                      }`}>
                        {risk.riskScore}
                      </div>
                      <div className="text-[8px] font-bold text-text-secondary uppercase tracking-widest">Score</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-text-secondary transition-colors" />
                  </div>
                </div>
              ))}

              {filteredRisks.length === 0 && (
                <div className="text-center py-10 text-text-secondary">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-semibold text-xs">No high risk students found matching filters.</p>
                </div>
              )}
            </div>
            {filteredRisks.length > itemsPerPage && (
              <div className="mt-4">
                <Pagination currentPage={currentPage} totalPages={Math.ceil((filteredRisks.length || 0) / itemsPerPage)} onPageChange={setCurrentPage} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- DRAWERS --- */}
      
      {/* Risk Actions & Details Drawer */}
      <Drawer
        isOpen={selectedStudent !== null}
        onClose={() => setSelectedStudent(null)}
        title={selectedStudent ? `Risk Intervention: ${selectedStudent.name}` : 'Student Risk Detail'}
      >
        {selectedStudent && (
          <form onSubmit={handleCounselSubmit} className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
            {/* Header info */}
            <div>
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Enrollment Details</span>
              <h3 className="text-base font-bold text-text-primary">{selectedStudent.name}</h3>
              <p className="text-xs text-text-secondary font-semibold">{selectedStudent.program}</p>
            </div>

            {/* Risk factors status indicator */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-border space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-text-secondary uppercase">AI Severity Grade</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  selectedStudent.riskScore >= 85 ? 'bg-rose-100 text-rose-700' :
                  selectedStudent.riskScore >= 70 ? 'bg-orange-100 text-orange-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {selectedStudent.riskScore >= 85 ? 'Critical Risk' : selectedStudent.riskScore >= 70 ? 'High Risk' : 'Medium Risk'}
                </span>
              </div>

              {/* Progress gauge */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-text-secondary">Current Risk Index</span>
                  <span className={selectedStudent.riskScore >= 85 ? 'text-rose-600' : 'text-orange-500'}>
                    {selectedStudent.riskScore} / 100
                  </span>
                </div>
                <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      selectedStudent.riskScore >= 85 ? 'bg-rose-600' : 'bg-orange-500'
                    }`}
                    style={{ width: `${selectedStudent.riskScore}%` }}
                  />
                </div>
              </div>

              {/* Drivers list */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Risk Drivers Detected</span>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.factors.map(f => (
                    <span key={f} className="inline-flex items-center gap-1 bg-white border border-rose-200 text-rose-600 font-bold text-[9px] px-2 py-1 rounded-lg">
                      <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions panel */}
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 pb-1 border-b border-border">
                <UserCheck className="w-4 h-4 text-indigo-650" />
                <h4 className="text-xs font-bold text-text-primary uppercase">Intervention Action Form</h4>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Action Type</label>
                <select
                  value={counselAction}
                  onChange={(e) => setCounselAction(e.target.value)}
                  className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2.5 text-xs font-bold text-text-primary cursor-pointer"
                >
                  <option value="Schedule Counseling">Schedule Counseling Interview</option>
                  <option value="Send Warning Notification">Send Warning Notification (SMS/Email)</option>
                  <option value="Assign Peer Mentor">Assign Peer Mentor Assistance</option>
                  <option value="Academic Review">Schedule Course Remedial Exam</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Counseling Notes / Action Log</label>
                <textarea
                  required
                  rows={4}
                  value={counselNote}
                  onChange={(e) => setCounselNote(e.target.value)}
                  placeholder="Record intervention details, communication logs, or recommendations here..."
                  className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-xs font-medium text-text-primary focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 pt-4 border-t border-border mt-auto">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="flex-1 py-3 border border-border text-text-primary font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isCounselingSubmitting}
                className="flex-1 py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-slate-900/10"
              >
                {isCounselingSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Resolve Intervention'
                )}
              </button>
            </div>
          </form>
        )}
      </Drawer>

    </div>
  );
}
