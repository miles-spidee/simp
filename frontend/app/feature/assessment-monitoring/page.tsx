"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Role,
  StudentAssessment,
  Assessment,
  DashboardStats
} from '@/src/types/assessment-monitoring.types';
import { fetchMonitoringData } from '@/src/api/assessment-monitoring.api';
import { DashboardCards } from './components/DashboardCards';
import { AssessmentOverview } from './components/AssessmentOverview';
import { StudentAssessmentTable } from './components/StudentAssessmentTable';
import { StudentDetailDrawer } from './components/StudentDetailDrawer';
import { CohortCompliance } from './components/CohortCompliance';
import { Leaderboard } from './components/Leaderboard';
import { WeakStudentIdentification } from './components/WeakStudentIdentification';
import { AssessmentAnalytics } from './components/AssessmentAnalytics';
import { Download, RefreshCw, Settings, LayoutDashboard, BarChart3, Users } from 'lucide-react';

export default function AssessmentMonitoringPage() {
  const [currentRole, setCurrentRole] = useState<Role>('Mentor');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'analytics'>('overview');
  const [selectedStudent, setSelectedStudent] = useState<StudentAssessment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch data using React Query based on currentRole
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['assessmentMonitoring', currentRole],
    queryFn: () => fetchMonitoringData(currentRole)
  });

  const handleViewStudent = (student: StudentAssessment) => {
    setSelectedStudent(student);
    setIsDrawerOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (isError || !data) {
    return <div className="p-6 text-red-500">Failed to load monitoring data. Please try again.</div>;
  }

  const { assessments, studentAssessments, dashboardStats } = data;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header & Role Switcher (Mock) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Assessment Monitoring & Evaluation</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track, analyze, and evaluate student assessments.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Role Switcher for Demo Purposes */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 flex shadow-sm">
            {(['Mentor', 'College Coordinator', 'Super Admin'] as Role[]).map(r => (
              <button
                key={r}
                onClick={() => setCurrentRole(r)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentRole === r 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button className="p-2 text-gray-500 hover:text-blue-600 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:border-blue-300 transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <DashboardCards role={currentRole} stats={dashboardStats} />

      {/* Main Navigation Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
            activeTab === 'overview' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mr-2" /> Overview
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
            activeTab === 'students' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <Users className="w-4 h-4 mr-2" /> Student Performance
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
            activeTab === 'analytics' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <BarChart3 className="w-4 h-4 mr-2" /> Assessment Analytics
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <AssessmentOverview assessments={assessments} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <CohortCompliance role={currentRole} />
              </div>
              <div className="lg:col-span-1">
                <Leaderboard role={currentRole} />
              </div>
              <div className="lg:col-span-1">
                <WeakStudentIdentification />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <StudentAssessmentTable 
            data={studentAssessments} 
            role={currentRole} 
            onViewStudent={handleViewStudent} 
          />
        )}

        {activeTab === 'analytics' && (
          <AssessmentAnalytics />
        )}
      </div>

      {/* Detail Drawer */}
      <StudentDetailDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        studentAssessment={selectedStudent} 
      />

    </div>
  );
}
