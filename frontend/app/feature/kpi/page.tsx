"use client";

import React, { useEffect, useState } from 'react';
import { KPIService } from '@/src/services/kpi.service';
import { KPIMetric } from '@/src/types/kpi.types';
import { Target, Loader2, ArrowUpRight, ArrowDownRight, Minus, AlertCircle, CheckCircle2, Plus, Edit2 } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';
import { useAuth } from '@/src/context/AuthContext';
import { Drawer } from '@/components/feature/ui/Drawer';

export default function KPIManagementPage() {
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
      <div className="flex h-[50vh] items-center justify-center text-slate-500 font-sans">
        <p className="font-semibold">You do not have permission to view KPIs.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
            <Target className="w-6 h-6 text-amber-600 animate-pulse" />
            KPI Management
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Track, edit, and manage critical performance metrics across all departments.</p>
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
        {kpis.map(kpi => {
          const progress = (kpi.currentValue / kpi.targetValue) * 100;
          return (
            <div 
              key={kpi.id} 
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.category}</span>
                  <h3 className="font-bold text-slate-800 mt-1 leading-snug">{kpi.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleOpenEdit(kpi)}
                    className="p-1.5 text-slate-400 hover:text-indigo-650 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {kpi.status === 'on_track' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {kpi.status === 'at_risk' && <AlertCircle className="w-5 h-5 text-amber-500 animate-bounce" />}
                  {kpi.status === 'behind' && <AlertCircle className="w-5 h-5 text-rose-500 animate-pulse" />}
                </div>
              </div>

              <div className="flex items-end gap-2.5 mb-4">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {kpi.currentValue}{kpi.unit}
                </span>
                <span className="text-xs font-semibold text-slate-400 pb-1">
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

              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <div className={`flex items-center gap-1 font-bold ${
                  kpi.trend === 'up' ? 'text-emerald-600' : 
                  kpi.trend === 'down' ? 'text-rose-600' : 
                  'text-slate-500'
                }`}>
                  {kpi.trend === 'up' && <ArrowUpRight className="w-4 h-4" />}
                  {kpi.trend === 'down' && <ArrowDownRight className="w-4 h-4" />}
                  {kpi.trend === 'flat' && <Minus className="w-4 h-4" />}
                  <span>{Math.abs(kpi.trendPercentage)}%</span>
                </div>
                <span className="text-slate-400 font-medium">
                  Updated {new Date(kpi.lastUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            </div>
          );
        })}
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
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">KPI Metric Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Active Placement Rate"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 cursor-pointer"
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
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Metric Unit</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g., %, M, Students"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Value</label>
              <input
                type="number"
                step="any"
                required
                value={currentValue}
                onChange={(e) => setCurrentValue(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-mono font-bold text-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Value</label>
              <input
                type="number"
                step="any"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(parseFloat(e.target.value) || 100)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-mono font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 cursor-pointer"
              >
                <option value="on_track">On Track (Green)</option>
                <option value="at_risk">At Risk (Amber)</option>
                <option value="behind">Behind (Red)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trend Direction</label>
              <select
                value={trend}
                onChange={(e) => setTrend(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 cursor-pointer"
              >
                <option value="up">Trending Up (Positive)</option>
                <option value="down">Trending Down (Negative)</option>
                <option value="flat">Trending Flat (Neutral)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trend Change (%)</label>
            <input
              type="number"
              step="any"
              required
              value={trendPercentage}
              onChange={(e) => setTrendPercentage(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 font-medium text-slate-800"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 mt-auto">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedKpi.category}</span>
              <h3 className="text-base font-bold text-slate-850">{selectedKpi.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Value ({selectedKpi.unit})</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={editCurrentValue}
                  onChange={(e) => setEditCurrentValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-mono font-bold text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Value ({selectedKpi.unit})</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={editTargetValue}
                  onChange={(e) => setEditTargetValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-mono font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">KPI Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 cursor-pointer"
                >
                  <option value="on_track">On Track (Green)</option>
                  <option value="at_risk">At Risk (Amber)</option>
                  <option value="behind">Behind (Red)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trend Direction</label>
                <select
                  value={editTrend}
                  onChange={(e) => setEditTrend(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 cursor-pointer"
                >
                  <option value="up">Trending Up</option>
                  <option value="down">Trending Down</option>
                  <option value="flat">Trending Flat</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trend Change Percentage (%)</label>
              <input
                type="number"
                step="any"
                required
                value={editTrendPercentage}
                onChange={(e) => setEditTrendPercentage(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 font-medium text-slate-850"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-auto">
              <button
                type="button"
                onClick={() => setSelectedKpi(null)}
                className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
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

    </div>
  );
}
