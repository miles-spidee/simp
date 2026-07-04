import React from 'react';
import { Award, Zap, TrendingUp, Star } from 'lucide-react';
import { Role } from '../../../../../src/types/assessment-monitoring.types';

interface LeaderboardProps {
  role: Role;
}

export function Leaderboard({ role }: LeaderboardProps) {
  const topPerformers = [
    { name: 'Diana Prince', program: 'Cloud Computing', score: 98, badge: 'Highest Score', icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { name: 'Alice Smith', program: 'Full Stack Engineering', score: 95, badge: 'Fastest Completion', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { name: 'Charlie Brown', program: 'Full Stack Engineering', score: 92, badge: 'Most Improved', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { name: 'Eve Adams', program: 'Data Science', score: 100, badge: 'Perfect Score', icon: Star, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Award className="w-5 h-5 mr-2 text-amber-500" /> Leaderboard
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {role === 'Mentor' ? 'My Students' : role === 'College Coordinator' ? 'My College' : 'Global'}
        </span>
      </div>

      <div className="space-y-4 flex-1">
        {topPerformers.map((student, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 relative">
                {student.name.charAt(0)}
                {idx === 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-800" />}
                {idx === 1 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-300 rounded-full border-2 border-white dark:border-gray-800" />}
                {idx === 2 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 rounded-full border-2 border-white dark:border-gray-800" />}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{student.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{student.program}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${student.bg} ${student.color} mb-1`}>
                  <student.icon className="w-3 h-3 mr-1" />
                  {student.badge}
                </span>
                <p className="font-bold text-gray-900 dark:text-white">{student.score}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
