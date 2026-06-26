export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  role: 'Student' | 'Mentor' | 'Employee';
  leaveType: 'Medical' | 'Casual' | 'Emergency' | 'OD' | 'WFH';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  supportingDocument?: string;
  appliedOn: string;
  approvedBy?: string;
  approvalRemarks?: string;
}

export interface LeaveTimelineEvent {
  id: string;
  leaveId: string;
  action: 'Applied' | 'Reviewed' | 'Approved' | 'Rejected' | 'Escalated';
  actedBy: string;
  actedOn: string;
  remarks?: string;
}
