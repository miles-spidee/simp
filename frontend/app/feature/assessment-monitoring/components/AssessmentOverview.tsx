import React from 'react';
import { Assessment } from '@/src/types/assessment-monitoring.types';
import { Calendar, Clock, Users, CheckCircle, HelpCircle, BarChart, ChevronRight } from 'lucide-react';

interface AssessmentOverviewProps {
  assessments: Assessment[];
}

export function AssessmentOverview({ assessments }: AssessmentOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Assessments</h2>
        <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center">
          View All <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((asm) => (
          <div key={asm.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {asm.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs mr-2">{asm.program}</span>
                  <span className="text-xs">{asm.batch}</span>
                </p>
              </div>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                asm.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                asm.status === 'Upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {asm.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-4 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Users className="w-4 h-4 mr-2 text-gray-400" />
                <span>{asm.assignedStudents} Assigned</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <span>{asm.duration} mins</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>{asm.completedAttempts} Completed</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <HelpCircle className="w-4 h-4 mr-2 text-orange-400" />
                <span>{asm.pendingAttempts} Pending</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Average Score</p>
                <div className="flex items-center">
                  <BarChart className="w-4 h-4 mr-1 text-indigo-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">{asm.averageScore}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pass Rate</p>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-1.5 ${asm.passPercentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="font-semibold text-gray-900 dark:text-white">{asm.passPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
