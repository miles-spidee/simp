import { EscalationRule, EscalationLog } from '../types/escalation.types';

export const MOCK_ESCALATION_RULES: EscalationRule[] = [];

export const MOCK_ESCALATIONS: EscalationLog[] = Array.from({ length: 25 }).map((_, i) => {
  const types = ['Attendance', 'Assignments', 'Leave', 'Assessments', 'Performance'];
  const statuses = ['Pending', 'Resolved', 'Ignored'];
  return {
    id: `esc-${i + 1}`,
    ruleId: `rule-${(i % 4) + 1}`,
    targetId: `target-${100 + i}`,
    targetName: `Target ${100 + i}`,
    type: types[i % types.length] as any,
    triggeredDate: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(),
    status: statuses[i % statuses.length] as any,
    notifiedUsers: [
      { userId: 'admin-1', role: 'HR', name: 'Admin 1' },
    ],
    resolutionNotes: i % 2 === 0 ? 'Discussed with student.' : undefined,
    resolvedBy: i % 2 === 0 ? 'admin-1' : undefined,
    resolvedDate: i % 2 === 0 ? new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString() : undefined,
  };
});
