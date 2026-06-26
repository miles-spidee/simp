"use client";

import React, { useEffect, useState } from 'react';
import { InsightService } from '@/src/services/insight.service';
import { InsightForecast, StudentRisk } from '@/src/types/insight.types';
import { Lightbulb, Loader2, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';

export default function PredictiveInsightsPage() {
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [forecasts, setForecasts] = useState<InsightForecast[]>([]);
  const [risks, setRisks] = useState<StudentRisk[]>([]);

  useEffect(() => {
    loadData();
  }, []);

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

  if (!hasPermission('insights.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500">
        <p>You do not have permission to view predictive insights.</p>
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-fuchsia-600" />
            Predictive AI Insights
          </h1>
          <p className="text-slate-500 text-sm mt-1">AI-powered forecasting and risk analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forecasts */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            AI Forecasts
          </h2>
          {forecasts.map(forecast => (
            <div key={forecast.id} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 shadow-sm border border-slate-700 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Lightbulb className="w-24 h-24" />
              </div>
              <h3 className="text-slate-300 text-sm font-medium mb-1">{forecast.metric}</h3>
              <div className="text-3xl font-bold mb-4">
                {forecast.predictedValues[0]}{forecast.metric.includes('Revenue') ? 'M' : ''}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-400 font-medium">+15% expected growth</span>
                <span className="text-slate-400 bg-slate-800/50 px-2 py-1 rounded">{forecast.confidence}% Confidence</span>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Analysis */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            High-Risk Students
          </h2>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {risks.slice(0, 5).map(risk => (
                <div key={risk.studentId} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer">
                  <div>
                    <h4 className="font-bold text-slate-800">{risk.name}</h4>
                    <p className="text-xs text-slate-500 mb-2">{risk.program}</p>
                    <div className="flex gap-2">
                      {risk.factors.map(factor => (
                        <span key={factor} className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded text-[10px] font-medium border border-rose-100">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className={`text-xl font-bold ${risk.riskScore >= 80 ? 'text-rose-600' : 'text-amber-600'}`}>
                        {risk.riskScore}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Risk Score</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full p-3 text-sm font-medium text-blue-600 bg-slate-50 hover:bg-slate-100 transition-colors text-center border-t border-slate-100">
              View All At-Risk Students
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
