import React, { useState } from 'react';
import { StudentAssessment, Role } from '../../../../../src/types/assessment-monitoring.types';
import { Search, Filter, Eye, BarChart2, MoreVertical } from 'lucide-react';

interface StudentAssessmentTableProps {
  data: StudentAssessment[];
  role: Role;
  onViewStudent: (student: StudentAssessment) => void;
}

export function StudentAssessmentTable({ data, role, onViewStudent }: StudentAssessmentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item => 
    item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.assessmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Performance</h3>
        
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <th className="p-4 font-medium">Student</th>
              {(role === 'Super Admin' || role === 'College Coordinator') && (
                <th className="p-4 font-medium">College</th>
              )}
              <th className="p-4 font-medium">Program</th>
              <th className="p-4 font-medium">Assessment</th>
              <th className="p-4 font-medium">Score</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold mr-3">
                      {item.studentName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{item.studentName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Attempt {item.attempt}</div>
                    </div>
                  </div>
                </td>
                {(role === 'Super Admin' || role === 'College Coordinator') && (
                  <td className="p-4 text-gray-600 dark:text-gray-300">{item.college}</td>
                )}
                <td className="p-4">
                  <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-300">
                    {item.program}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-gray-900 dark:text-white font-medium">{item.assessmentName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.completionTime} mins</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center">
                    <span className="font-bold text-gray-900 dark:text-white mr-2">{item.score}%</span>
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.score >= 70 ? 'bg-green-500' : item.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    item.passStatus === 'Pass' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {item.passStatus}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => onViewStudent(item)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-1.5 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded transition-colors"
                      title="Performance Report"
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No students found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
