import { ManagerAssignment } from '../types/reporting-manager.types';

export const MOCK_MANAGER_ASSIGNMENTS: ManagerAssignment[] = Array.from({ length: 200 }).map((_, i) => ({
  id: `ma-${i + 1}`,
  managerId: `rm-${(i % 20) + 1}`,
  internId: `intern-${i + 1}`,
  assignedDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  status: 'Active',
  internName: `Intern ${i + 1}`,
  batch: `B${2023 + (i % 3)}`,
  college: `College ${1 + (i % 5)}`,
  attendancePercent: Math.floor(Math.random() * 30) + 70,
  assessmentPercent: Math.floor(Math.random() * 40) + 60,
  taskCompletionPercent: Math.floor(Math.random() * 50) + 50,
  performanceScore: Math.floor(Math.random() * 4) + 6,
  riskLevel: ['Low', 'Low', 'Low', 'Medium', 'High'][i % 5] as 'Low' | 'Medium' | 'High',
}));
