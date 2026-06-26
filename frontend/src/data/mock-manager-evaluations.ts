import { ManagerEvaluation } from '../types/reporting-manager.types';

export const MOCK_MANAGER_EVALUATIONS: ManagerEvaluation[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `me-${i + 1}`,
  assignmentId: `ma-${(i % 200) + 1}`,
  managerId: `rm-${(i % 20) + 1}`,
  internId: `intern-${(i % 200) + 1}`,
  evaluationDate: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(),
  score: Math.floor(Math.random() * 5) + 5,
  feedback: 'Good progress, needs to focus on practical applications.',
  status: i % 3 === 0 ? 'Draft' : 'Submitted',
}));
