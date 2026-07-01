export interface OpeningMentor {
  id: string;
  opportunityId: string;
  mentorId: string;
  role: 'Lead Mentor' | 'Co-Mentor';
  workload: number; // Max students or hours
  assignedDate: string;
}