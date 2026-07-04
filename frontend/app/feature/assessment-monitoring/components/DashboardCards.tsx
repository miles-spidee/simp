import React from 'react';
import { Users, FileText, CheckCircle, Clock, BarChart2, ShieldAlert, Award, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Role, DashboardStats } from '../../../../../src/types/assessment-monitoring.types';

interface DashboardCardsProps {
  role: Role;
  stats: DashboardStats;
}

export function DashboardCards({ role, stats }: DashboardCardsProps) {
  const mentorStats = [
    { label: 'Assigned Students', value: stats.mentor.assignedStudents, icon: Users, color: 'bg-blue-500' },
    { label: 'Active Assessments', value: stats.mentor.activeAssessments, icon: FileText, color: 'bg-purple-500' },
    { label: 'Completed Assessments', value: stats.mentor.completedAssessments, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Pending Attempts', value: stats.mentor.pendingAttempts, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Average Score', value: `${stats.mentor.averageScore}%`, icon: BarChart2, color: 'bg-indigo-500' },
    { label: 'Pass Rate', value: `${stats.mentor.passRate}%`, icon: TrendingUp, color: 'bg-emerald-500' },
    { label: 'Highest Score', value: stats.mentor.highestScore, icon: Award, color: 'bg-amber-500' },
    { label: 'Lowest Score', value: stats.mentor.lowestScore, icon: TrendingDown, color: 'bg-red-400' },
    { label: 'Avg Completion (min)', value: stats.mentor.avgCompletionTime, icon: Clock, color: 'bg-teal-500' },
    { label: 'Students at Risk', value: stats.mentor.studentsAtRisk, icon: AlertTriangle, color: 'bg-red-600' },
  ];

  const coordinatorStats = [
    { label: 'College Students', value: stats.coordinator.collegeStudents, icon: Users, color: 'bg-blue-600' },
    { label: 'Active Assessments', value: stats.coordinator.activeAssessments, icon: FileText, color: 'bg-purple-600' },
    { label: 'Completed', value: stats.coordinator.completedAssessments, icon: CheckCircle, color: 'bg-green-600' },
    { label: 'Avg College Score', value: `${stats.coordinator.averageCollegeScore}%`, icon: BarChart2, color: 'bg-indigo-600' },
    { label: 'College Pass Rate', value: `${stats.coordinator.collegePassRate}%`, icon: TrendingUp, color: 'bg-emerald-600' },
    { label: 'Top Batch', value: stats.coordinator.topPerformingBatch, icon: Award, color: 'bg-amber-600' },
    { label: 'Weakest Batch', value: stats.coordinator.weakestBatch, icon: ShieldAlert, color: 'bg-orange-600' },
    { label: 'Students Pending', value: stats.coordinator.studentsPending, icon: Clock, color: 'bg-yellow-600' },
    { label: 'Highest Scorer', value: stats.coordinator.highestScorer, icon: Award, color: 'bg-teal-600' },
    { label: 'Lowest Scorer', value: stats.coordinator.lowestScorer, icon: TrendingDown, color: 'bg-red-500' },
  ];

  const adminStats = [
    { label: 'Total Assessments', value: stats.admin.totalAssessments, icon: FileText, color: 'bg-blue-700' },
    { label: 'Total Attempts', value: stats.admin.totalAttempts, icon: CheckCircle, color: 'bg-purple-700' },
    { label: 'Active Exams', value: stats.admin.activeExams, icon: Clock, color: 'bg-indigo-700' },
    { label: 'Platform Avg', value: `${stats.admin.platformAverage}%`, icon: BarChart2, color: 'bg-emerald-700' },
    { label: 'Overall Pass Rate', value: `${stats.admin.overallPassRate}%`, icon: TrendingUp, color: 'bg-teal-700' },
    { label: 'Total Students', value: stats.admin.totalStudents, icon: Users, color: 'bg-cyan-700' },
    { label: 'Top College', value: stats.admin.topPerformingCollege, icon: Award, color: 'bg-amber-700' },
    { label: 'Weakest College', value: stats.admin.weakestCollege, icon: ShieldAlert, color: 'bg-orange-700' },
    { label: 'Highest Score', value: stats.admin.highestScore, icon: TrendingUp, color: 'bg-green-700' },
    { label: 'Lowest Score', value: stats.admin.lowestScore, icon: TrendingDown, color: 'bg-red-600' },
  ];

  let displayStats = mentorStats;
  if (role === 'College Coordinator') displayStats = coordinatorStats;
  if (role === 'Super Admin') displayStats = adminStats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {displayStats.map((stat, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg text-white ${stat.color} bg-opacity-90`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
