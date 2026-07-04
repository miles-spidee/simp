import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Target, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';

export function AssessmentAnalytics() {
  const sectionData = [
    { name: 'Technical', avgScore: 75, avgTime: 25, failRate: 15 },
    { name: 'Programming', avgScore: 60, avgTime: 45, failRate: 35 },
    { name: 'Aptitude', avgScore: 82, avgTime: 20, failRate: 5 },
    { name: 'Logical', avgScore: 78, avgTime: 15, failRate: 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Target className="w-5 h-5 mr-2 text-indigo-500" /> Section-wise Performance
        </h3>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
              <YAxis yAxisId="right" orientation="right" stroke="#ef4444" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={10} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f3f4f6', opacity: 0.4 }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar yAxisId="left" dataKey="avgScore" name="Avg Score (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar yAxisId="right" dataKey="failRate" name="Fail Rate (%)" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center mb-4">
            <TrendingDown className="w-5 h-5 mr-2 text-red-500" /> Most Difficult Topics
          </h4>
          <div className="space-y-4">
            {[
              { topic: 'Dynamic Programming', errorRate: '68%', assessments: 3 },
              { topic: 'Database Indexing', errorRate: '55%', assessments: 2 },
              { topic: 'React Custom Hooks', errorRate: '42%', assessments: 4 },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{item.topic}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Appears in {item.assessments} assessments</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-red-600 dark:text-red-400 font-bold mb-1">Error Rate</p>
                  <span className="bg-white dark:bg-gray-800 text-red-700 dark:text-red-400 px-2 py-1 rounded shadow-sm text-sm font-bold">
                    {item.errorRate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center mb-4">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-500" /> Frequently Skipped Questions
          </h4>
          <div className="space-y-4">
            {[
              { id: 'Q142', text: 'Implement a LRU Cache...', skipRate: '45%' },
              { id: 'Q089', text: 'Explain the difference between...', skipRate: '32%' },
              { id: 'Q211', text: 'Write a SQL query to find the Nth...', skipRate: '28%' },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-900/30">
                <div className="flex-1 mr-4">
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 mr-2">{item.id}</span>
                  <p className="inline font-medium text-gray-900 dark:text-white text-sm truncate block max-w-[200px]">{item.text}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-bold mb-1">Skip Rate</p>
                  <span className="bg-white dark:bg-gray-800 text-orange-700 dark:text-orange-400 px-2 py-1 rounded shadow-sm text-sm font-bold">
                    {item.skipRate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
