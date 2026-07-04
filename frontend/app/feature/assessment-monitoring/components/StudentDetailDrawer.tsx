import React, { useState } from 'react';
import { StudentAssessment } from '../../../../../src/types/assessment-monitoring.types';
import { X, User, Book, MapPin, Award, CheckCircle, XCircle, Clock, Zap, Target, BrainCircuit, AlertTriangle, PlayCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface StudentDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studentAssessment: StudentAssessment | null;
}

export function StudentDetailDrawer({ isOpen, onClose, studentAssessment }: StudentDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'insights'>('overview');

  if (!isOpen || !studentAssessment) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
  };

  const scoreTrendData = [
    { name: 'Attempt 1', score: 40 },
    { name: 'Attempt 2', score: 65 },
    { name: 'Attempt 3', score: studentAssessment.score },
  ];

  const radarData = studentAssessment.sections.map(sec => ({
    subject: sec.name,
    A: Math.round((sec.score / sec.max) * 100),
    fullMark: 100,
  }));

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[600px] lg:w-[800px] bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xl font-bold shadow-sm">
              {studentAssessment.studentName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{studentAssessment.studentName}</h2>
              <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" /> {studentAssessment.studentId}</span>
                <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {studentAssessment.college}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 px-6">
          {(['overview', 'analysis', 'insights'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/30 dark:bg-gray-900/50">
          
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Assessment Summary Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Assessment</p>
                  <p className="font-semibold text-gray-900 dark:text-white truncate" title={studentAssessment.assessmentName}>{studentAssessment.assessmentName}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Score</p>
                  <p className={`font-bold text-lg ${studentAssessment.score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    {studentAssessment.score}% <span className="text-xs font-normal text-gray-500">({studentAssessment.passStatus})</span>
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Time Taken</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{studentAssessment.completionTime} mins</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Rank</p>
                  <p className="font-semibold text-gray-900 dark:text-white">#{studentAssessment.rank}</p>
                </div>
              </div>

              {/* Score Breakdown (Progress Bars) */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-blue-500" /> Score Breakdown
                </h3>
                <div className="space-y-5">
                  {studentAssessment.sections.map((section, idx) => {
                    const percentage = Math.round((section.score / section.max) * 100);
                    return (
                      <div key={idx}>
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{section.name}</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{section.score}/{section.max} <span className="text-gray-500 font-normal">({percentage}%)</span></span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className={`h-2.5 rounded-full ${percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Performance Radar Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-indigo-500" /> Skill Radar
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Student" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                      <RechartsTooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-500" /> Question-by-Question Analysis
              </h3>
              
              <div className="space-y-4">
                {studentAssessment.questions.map((q, idx) => {
                  const isCorrect = q.selectedAnswer === q.correctAnswer;
                  return (
                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex space-x-3">
                          <div className="mt-0.5">
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Q{idx + 1}. {q.questionText}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">{q.topic}</span>
                              <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">{q.difficulty}</span>
                              <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">{q.timeTaken}s</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-bold ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {q.marksAwarded} Marks
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Student's Answer</p>
                          <p className={`font-medium ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                            {q.selectedAnswer}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Correct Answer</p>
                          <p className="font-medium text-gray-900 dark:text-white">{q.correctAnswer}</p>
                        </div>
                      </div>

                      {!isCorrect && q.explanation && (
                        <div className="ml-8 mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1 flex items-center">
                            <BrainCircuit className="w-3.5 h-3.5 mr-1" /> Explanation
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* AI Insights Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800/30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap className="w-24 h-24 text-indigo-500" />
                </div>
                
                <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 mb-5 flex items-center relative z-10">
                  <BrainCircuit className="w-5 h-5 mr-2" /> AI Learning Insights
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-green-700 dark:text-green-400 uppercase tracking-wider flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" /> Strengths
                    </h4>
                    <ul className="space-y-2">
                      <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start"><span className="mr-2 text-green-500">•</span> Excellent logical reasoning capabilities</li>
                      <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start"><span className="mr-2 text-green-500">•</span> Fast completion speed on theoretical questions</li>
                      <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start"><span className="mr-2 text-green-500">•</span> High accuracy in Frontend (React) module</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-wider flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" /> Needs Improvement
                    </h4>
                    <ul className="space-y-2">
                      <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start"><span className="mr-2 text-red-500">•</span> Struggles with Database concepts and indexing</li>
                      <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start"><span className="mr-2 text-red-500">•</span> Excessive time spent on complex array algorithms</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-indigo-200/50 dark:border-indigo-800/50 relative z-10">
                  <h4 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 mb-3 flex items-center">
                    <PlayCircle className="w-4 h-4 mr-2" /> Recommended Actions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-sm text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-800/30 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors">
                      Assign SQL Practice Module
                    </span>
                    <span className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-sm text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-800/30 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors">
                      Recommend Data Structures Review
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" /> Score Trend
                </h3>
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scoreTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
