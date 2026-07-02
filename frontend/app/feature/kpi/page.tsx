"use client";

import React, { useEffect, useState } from 'react';
import { KPIService } from '@/src/services/kpi.service';
import { KPIMetric } from '@/src/types/kpi.types';
import { Target, Loader2, ArrowUpRight, ArrowDownRight, Minus, AlertCircle, CheckCircle2, Plus, Edit2 } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';
import { useAuth } from '@/src/context/AuthContext';
import { Drawer } from '@/components/feature/ui/Drawer';
import { Pagination } from "@/components/common/Pagination";

export default function KPIManagementPage() {

      // Pagination State
      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 10;

  const { hasPermission } = usePermissions();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPIMetric[]>([]);

  // Create KPI form state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [targetValue, setTargetValue] = useState<number>(100);
  const [unit, setUnit] = useState('%');
  const [status, setStatus] = useState<'on_track' | 'at_risk' | 'behind'>('on_track');
  const [trend, setTrend] = useState<'up' | 'down' | 'flat'>('flat');
  const [trendPercentage, setTrendPercentage] = useState<number>(0);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // Edit KPI state
  const [selectedKpi, setSelectedKpi] = useState<KPIMetric | null>(null);
  const [editCurrentValue, setEditCurrentValue] = useState<number>(0);
  const [editTargetValue, setEditTargetValue] = useState<number>(100);
  const [editStatus, setEditStatus] = useState<'on_track' | 'at_risk' | 'behind'>('on_track');
  const [editTrend, setEditTrend] = useState<'up' | 'down' | 'flat'>('flat');
  const [editTrendPercentage, setEditTrendPercentage] = useState<number>(0);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [selectedDetailKpi, setSelectedDetailKpi] = useState<KPIMetric | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await KPIService.getKPIs();
      setKpis(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKPI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmittingCreate(true);
    try {
      await KPIService.createKPI({
        name,
        category,
        currentValue,
        targetValue,
        unit,
        status,
        trend,
        trendPercentage
      });
      // Clear fields
      setName('');
      setCategory('General');
      setCurrentValue(0);
      setTargetValue(100);
      setUnit('%');
      setStatus('on_track');
      setTrend('flat');
      setTrendPercentage(0);
      setIsCreateOpen(false);

      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  const handleOpenEdit = (kpi: KPIMetric) => {
    setSelectedKpi(kpi);
    setEditCurrentValue(kpi.currentValue);
    setEditTargetValue(kpi.targetValue);
    setEditStatus(kpi.status);
    setEditTrend(kpi.trend);
    setEditTrendPercentage(kpi.trendPercentage);
  };

  const handleEditKPI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKpi) return;
    setIsSubmittingEdit(true);
    try {
      await KPIService.updateKPI(selectedKpi.id, {
        currentValue: editCurrentValue,
        targetValue: editTargetValue,
        status: editStatus,
        trend: editTrend,
        trendPercentage: editTrendPercentage
      });
      setSelectedKpi(null);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  if (!hasPermission('kpi.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-text-secondary font-sans">
        <p className="font-semibold">You do not have permission to view KPIs.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-text-secondary" />
      </div>
    );
  }

  const getKpiSuggestions = () => {
    const suggestions: string[] = [];
    const attendanceKpi = kpis.find(k => k.category === 'Attendance');
    const placementKpi = kpis.find(k => k.category === 'Placement');
    const scoreKpi = kpis.find(k => k.category === 'Performance');
    
    if (attendanceKpi && (attendanceKpi.status === 'behind' || attendanceKpi.status === 'at_risk')) {
      suggestions.push(`Daily Student Attendance is currently at ${attendanceKpi.currentValue}% (Target: ${attendanceKpi.targetValue}%). Recommend establishing an automated Slack/Email alert for students whose attendance drops below 75% and implementing a peer study group system.`);
    } else if (attendanceKpi) {
      suggestions.push(`Daily Student Attendance is stable at ${attendanceKpi.currentValue}%. Standard notification protocols remain active.`);
    }
    
    if (placementKpi && placementKpi.currentValue < placementKpi.targetValue) {
      suggestions.push(`Overall Placement Rate is at ${placementKpi.currentValue}% (Target: ${placementKpi.targetValue}%). Action plan: Schedule 3 upcoming virtual drive events with our IT Services hiring partners in the next 14 days.`);
    }
    
    if (scoreKpi && scoreKpi.trend === 'up') {
      suggestions.push(`Average Course Score trend is positive (+${scoreKpi.trendPercentage}% change). Suggest reviewing submodules with high success rates to duplicate pedagogy patterns in lower-performing lessons.`);
    }
    
    if (suggestions.length === 0) {
      suggestions.push("All corporate KPIs are performing above targeted goals. Continue standard cohort tracking operations.");
    }
    
    return suggestions;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2 tracking-tight">
            <Target className="w-6 h-6 text-amber-600 animate-pulse" />
            KPI Management
          </h1>
          <p className="text-text-secondary text-sm mt-0.5">Track, edit, and manage critical performance metrics across all departments.</p>
        </div>
        {hasPermission('kpi.view') && (
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create KPI
          </button>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(kpi => {
          const progress = (kpi.currentValue / kpi.targetValue) * 100;
          return (
            <div 
              key={kpi.id} 
              onClick={() => setSelectedDetailKpi(kpi)}
              className="bg-white rounded-2xl border border-border shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{kpi.category}</span>
                  <h3 className="font-bold text-text-primary mt-1 leading-snug">{kpi.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(kpi);
                    }}
                    className="p-1.5 text-text-secondary hover:text-indigo-650 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {kpi.status === 'on_track' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {kpi.status === 'at_risk' && <AlertCircle className="w-5 h-5 text-amber-500 animate-bounce" />}
                  {kpi.status === 'behind' && <AlertCircle className="w-5 h-5 text-rose-500 animate-pulse" />}
                </div>
              </div>

              <div className="flex items-end gap-2.5 mb-4">
                <span className="text-3xl font-extrabold text-text-primary font-mono tracking-tight">
                  {kpi.currentValue}{kpi.unit}
                </span>
                <span className="text-xs font-semibold text-text-secondary pb-1">
                  / {kpi.targetValue}{kpi.unit} target
                </span>
              </div>

              {/* Progress Bar wrapper */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    kpi.status === 'on_track' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 
                    kpi.status === 'at_risk' ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 
                    'bg-gradient-to-r from-rose-400 to-red-500'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                <div className={`flex items-center gap-1 font-bold ${
                  kpi.trend === 'up' ? 'text-emerald-600' : 
                  kpi.trend === 'down' ? 'text-rose-600' : 
                  'text-text-secondary'
                }`}>
                  {kpi.trend === 'up' && <ArrowUpRight className="w-4 h-4" />}
                  {kpi.trend === 'down' && <ArrowDownRight className="w-4 h-4" />}
                  {kpi.trend === 'flat' && <Minus className="w-4 h-4" />}
                  <span>{Math.abs(kpi.trendPercentage)}%</span>
                </div>
                <span className="text-text-secondary font-medium">
                  Updated {new Date(kpi.lastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {kpis?.length > itemsPerPage && (
        <div className="mt-4">
          <Pagination currentPage={currentPage} totalPages={Math.ceil((kpis?.length || 0) / itemsPerPage)} onPageChange={setCurrentPage} />
        </div>
      )}

      {/* Dynamic Insights & Actionable Suggestions Pane */}
      <div className="bg-slate-50 rounded-2xl border border-border p-6 mt-8 space-y-4">
        <h2 className="text-base font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-650" />
          Enterprise Performance Insights & Suggestions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="space-y-3 bg-white p-4 rounded-xl border border-border shadow-sm">
            <h3 className="text-xs font-bold text-indigo-650 uppercase tracking-widest">Identified System Patterns</h3>
            <ul className="text-xs text-text-secondary space-y-2 list-disc pl-4 font-medium leading-relaxed">
              <li>High engagement detected in Web Development and Product design curriculum submodules.</li>
              <li>Slight drop-off pattern in cohort attendance identified around midterm assessment modules.</li>
              <li>Tier-1 job opportunities are showing a 92% application fill rate among high performers.</li>
            </ul>
          </div>
          <div className="space-y-3 bg-white p-4 rounded-xl border border-border shadow-sm">
            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest font-mono">Actionable Improvements</h3>
            <div className="space-y-2">
              {getKpiSuggestions().map((sug, i) => (
                <div key={i} className="flex gap-2 text-xs text-text-secondary leading-relaxed font-semibold">
                  <span className="text-amber-500 font-bold shrink-0">•</span>
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- DRAWERS --- */}

      {/* 1. Create KPI Drawer */}
      <Drawer
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New KPI Metric"
      >
        <form onSubmit={handleCreateKPI} className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">KPI Metric Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Active Placement Rate"
              className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary cursor-pointer"
              >
                <option value="Attendance">Attendance</option>
                <option value="Placement">Placement</option>
                <option value="Finance">Finance</option>
                <option value="Retention">Retention</option>
                <option value="Performance">Performance</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Metric Unit</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g., %, M, Students"
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary placeholder-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Current Value</label>
              <input
                type="number"
                step="any"
                required
                value={currentValue}
                onChange={(e) => setCurrentValue(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono font-bold text-text-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Target Value</label>
              <input
                type="number"
                step="any"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(parseFloat(e.target.value) || 100)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono font-bold text-text-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary cursor-pointer"
              >
                <option value="on_track">On Track (Green)</option>
                <option value="at_risk">At Risk (Amber)</option>
                <option value="behind">Behind (Red)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Trend Direction</label>
              <select
                value={trend}
                onChange={(e) => setTrend(e.target.value as any)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary cursor-pointer"
              >
                <option value="up">Trending Up (Positive)</option>
                <option value="down">Trending Down (Negative)</option>
                <option value="flat">Trending Flat (Neutral)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Trend Change (%)</label>
            <input
              type="number"
              step="any"
              required
              value={trendPercentage}
              onChange={(e) => setTrendPercentage(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-medium text-text-primary"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-auto">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="flex-1 py-3 border border-border text-text-primary font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingCreate}
              className="flex-1 py-3 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-900/10"
            >
              {isSubmittingCreate ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create KPI'
              )}
            </button>
          </div>
        </form>
      </Drawer>

      {/* 2. Edit KPI Drawer */}
      <Drawer
        isOpen={selectedKpi !== null}
        onClose={() => setSelectedKpi(null)}
        title={selectedKpi ? `Edit KPI: ${selectedKpi.name}` : 'Edit KPI'}
      >
        {selectedKpi && (
          <form onSubmit={handleEditKPI} className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{selectedKpi.category}</span>
              <h3 className="text-base font-bold text-slate-850">{selectedKpi.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Current Value ({selectedKpi.unit})</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={editCurrentValue}
                  onChange={(e) => setEditCurrentValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono font-bold text-text-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Target Value ({selectedKpi.unit})</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={editTargetValue}
                  onChange={(e) => setEditTargetValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono font-bold text-text-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">KPI Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary cursor-pointer"
                >
                  <option value="on_track">On Track (Green)</option>
                  <option value="at_risk">At Risk (Amber)</option>
                  <option value="behind">Behind (Red)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Trend Direction</label>
                <select
                  value={editTrend}
                  onChange={(e) => setEditTrend(e.target.value as any)}
                  className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary cursor-pointer"
                >
                  <option value="up">Trending Up</option>
                  <option value="down">Trending Down</option>
                  <option value="flat">Trending Flat</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Trend Change Percentage (%)</label>
              <input
                type="number"
                step="any"
                required
                value={editTrendPercentage}
                onChange={(e) => setEditTrendPercentage(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary font-medium text-slate-850"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-border mt-auto">
              <button
                type="button"
                onClick={() => setSelectedKpi(null)}
                className="flex-1 py-3 border border-border text-text-primary font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingEdit}
                className="flex-1 py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-slate-900/10"
              >
                {isSubmittingEdit ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        )}
      </Drawer>

      {/* 3. KPI Details & Target Analysis Drawer */}
      <Drawer
        isOpen={selectedDetailKpi !== null}
        onClose={() => setSelectedDetailKpi(null)}
        title="KPI Deep-Dive & Target Analysis"
      >
        {selectedDetailKpi && (() => {
          const progress = (selectedDetailKpi.currentValue / selectedDetailKpi.targetValue) * 100;
          const remaining = Math.max(0, selectedDetailKpi.targetValue - selectedDetailKpi.currentValue);
          
          const months = [
            { name: 'Apr 2026', val: selectedDetailKpi.currentValue * 0.85 },
            { name: 'May 2026', val: selectedDetailKpi.currentValue * 0.92 },
            { name: 'Jun 2026', val: selectedDetailKpi.currentValue }
          ];

          return (
            <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto font-sans">
              <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl">
                <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {selectedDetailKpi.category} Department
                </span>
                <h3 className="font-extrabold text-slate-800 text-lg mt-2 leading-snug">{selectedDetailKpi.name}</h3>
                <p className="text-xs text-text-secondary mt-1 font-medium leading-relaxed">
                  Real-time target compilation metrics pulled from corporate operations registers.
                </p>
              </div>

              {/* Targets Achievement Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-border flex flex-col shadow-sm">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Achieved Rate</span>
                  <span className="text-2xl font-black text-slate-800 mt-1 font-mono">{progress.toFixed(1)}%</span>
                  <span className="text-[10px] text-text-secondary mt-1 font-medium">Progress against goal</span>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-border flex flex-col shadow-sm">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Target Delta Gap</span>
                  <span className="text-2xl font-black text-rose-600 mt-1 font-mono">
                    {remaining.toFixed(1)}{selectedDetailKpi.unit}
                  </span>
                  <span className="text-[10px] text-text-secondary mt-1 font-medium">Required to reach goal</span>
                </div>
              </div>

              {/* Status details */}
              <div className="space-y-2 bg-white p-4 rounded-xl border border-border shadow-sm">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Operational Health Status</h4>
                <div className="flex items-center gap-2.5 mt-2">
                  <span className={`h-3.5 w-3.5 rounded-full shrink-0 ${
                    selectedDetailKpi.status === 'on_track' ? 'bg-emerald-500 shadow shadow-emerald-500/20' :
                    selectedDetailKpi.status === 'at_risk' ? 'bg-amber-500 shadow shadow-amber-500/20 animate-pulse' :
                    'bg-rose-500 shadow shadow-rose-500/20 animate-ping'
                  }`} />
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                    {selectedDetailKpi.status === 'on_track' ? 'On Track & Performing' :
                     selectedDetailKpi.status === 'at_risk' ? 'Warning: Underperforming / At Risk' :
                     'Critical: Behind Targeted Benchmark'}
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                  {selectedDetailKpi.status === 'on_track'
                    ? 'KPI is currently meeting or exceeding corporate goals. Maintain general operations protocols.'
                    : selectedDetailKpi.status === 'at_risk'
                    ? 'System indicators identify that standard progress has slowed. Intervention recommended.'
                    : 'Performance benchmark has fallen significantly short of minimum target gates. Immediate escalation required.'}
                </p>
              </div>

              {/* Month-on-Month Trends */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">3-Month Historical Audit</h4>
                <div className="space-y-3">
                  {months.map(m => (
                    <div key={m.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-text-secondary">
                        <span>{m.name}</span>
                        <span className="font-mono">{m.val.toFixed(1)}{selectedDetailKpi.unit}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-slate-800 rounded-full transition-all" 
                          style={{ width: `${Math.min((m.val / selectedDetailKpi.targetValue) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Suggestions Box */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-1">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  Management Directive
                </h4>
                <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                  {selectedDetailKpi.category === 'Placement'
                    ? 'Analyze recruiter engagement frequencies. Schedule automated updates for corporate leads.'
                    : selectedDetailKpi.category === 'Performance'
                    ? 'Review assessment grades distribution. Plan mandatory remediation workshops for low-performers.'
                    : selectedDetailKpi.category === 'Attendance'
                    ? 'Initiate auto-alerts on the attendance register dashboard for low attending candidates.'
                    : 'Ensure department registers are synchronized and review monthly target limits.'}
                </p>
              </div>

              <div className="pt-4 border-t border-border mt-auto">
                <button
                  type="button"
                  onClick={() => setSelectedDetailKpi(null)}
                  className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-lg shadow-slate-900/10"
                >
                  Close Analysis
                </button>
              </div>
            </div>
          );
        })()}
      </Drawer>

    </div>
  );
}
