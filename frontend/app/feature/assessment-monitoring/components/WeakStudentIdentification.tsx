import React from 'react';
import { AlertTriangle, TrendingDown, Clock, ShieldAlert } from 'lucide-react';

export function WeakStudentIdentification() {
  const weakStudents = [
    { name: 'Bob Johnson', reason: 'Score below 40%', detail: 'Scored 35% on React Fundamentals', risk: 'High Risk', color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30' },
    { name: 'Frank Castle', reason: 'Multiple failed assessments', detail: 'Failed 3 assessments this month', risk: 'Critical', color: 'text-red-700 bg-red-200 dark:text-red-300 dark:bg-red-900/50' },
    { name: 'Grace Hopper', reason: 'Assessment overdue', detail: 'Database Systems overdue by 5 days', risk: 'Needs Attention', color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30' },
  ];

  return (
    <div className="bg-red-50 dark:bg-red-900/10 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 flex items-center">
          <ShieldAlert className="w-5 h-5 mr-2" /> At-Risk Students
        </h3>
        <button className="text-sm font-medium text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
          View All
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {weakStudents.map((student, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-red-100 dark:border-red-900/30 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">{student.name}</h4>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${student.color}`}>
                {student.risk}
              </span>
            </div>
            
            <div className="flex items-start mt-2 space-x-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800 dark:text-red-300">{student.reason}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">{student.detail}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded transition-colors">
                Intervene / Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
