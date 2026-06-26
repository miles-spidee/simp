import { EscalationRule, EscalationLog } from '../types/escalation.types';

export const MOCK_ESCALATION_RULES: EscalationRule[] = [
  { id: 'rule-1', type: 'Attendance', condition: 'Absent 3 Days', triggerDays: 3, notifyRoles: ['Reporting Manager'], status: 'Active' },
  { id: 'rule-2', type: 'Attendance', condition: 'Absent 5 Days', triggerDays: 5, notifyRoles: ['HR'], status: 'Active' },
  { id: 'rule-3', type: 'Assignments', condition: 'Missed Deadline', triggerDays: 1, notifyRoles: ['Mentor', 'Reporting Manager'], status: 'Active' },
  { id: 'rule-4', type: 'Leave', condition: 'Pending > 2 days', triggerDays: 2, notifyRoles: ['HR'], status: 'Active' },
];

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
