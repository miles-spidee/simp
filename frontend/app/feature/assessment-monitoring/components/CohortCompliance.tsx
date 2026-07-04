import React from 'react';
import { Role } from '../../../../../src/types/assessment-monitoring.types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface CohortComplianceProps {
  role: Role;
}

export function CohortCompliance({ role }: CohortComplianceProps) {
  // Mock Data tailored for compliance
  const complianceData = [
    { name: 'Completed', value: 75, color: '#10b981' }, // green-500
    { name: 'Pending', value: 15, color: '#f59e0b' },   // yellow-500
    { name: 'Late', value: 10, color: '#ef4444' },      // red-500
  ];

  const breakdownData = [
    { label: 'Total Assigned', value: 120, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Completed On-Time', value: 90, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Pending Action', value: 18, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Overdue/Late', value: 12, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Cohort Compliance</h3>
      
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="w-full md:w-1/2 h-[200px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={complianceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {complianceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#1f2937', fontWeight: 500 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">75%</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Completion</span>
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          {breakdownData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <div className={`p-2 rounded-md ${item.bg} dark:bg-opacity-10 mr-3`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
