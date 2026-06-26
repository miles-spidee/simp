export interface EscalationRule {
  id: string;
  type: 'Attendance' | 'Assignments' | 'Leave' | 'Assessments' | 'Performance' | 'Payment' | 'Certificate Approval';
  condition: string;
  triggerDays: number;
  notifyRoles: string[];
  status: 'Active' | 'Inactive';
}

export interface EscalationLog {
  id: string;
  ruleId: string;
  targetId: string; // ID of the entity that triggered escalation (e.g., Leave ID, User ID)
  targetName: string;
  type: 'Attendance' | 'Assignments' | 'Leave' | 'Assessments' | 'Performance' | 'Payment' | 'Certificate Approval';
  triggeredDate: string;
  status: 'Pending' | 'Resolved' | 'Ignored';
  notifiedUsers: { userId: string; role: string; name: string }[];
  resolutionNotes?: string;
  resolvedBy?: string;
  resolvedDate?: string;
}
