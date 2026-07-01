export interface OpeningMentor {
  id: string;
  opportunityId: string;
  mentorId: string;
  role: 'Lead Mentor' | 'Co-Mentor';
  workload: number; // Max students or hours
  assignedDate: string;
}

export const MOCK_OPENING_MENTORS: OpeningMentor[] = [
  {
    id: "om-1",
    opportunityId: "opp-l1",
    mentorId: "mnt-1",
    role: "Lead Mentor",
    workload: 20,
    assignedDate: "2023-10-16"
  },
  {
    id: "om-2",
    opportunityId: "opp-l1",
    mentorId: "mnt-2",
    role: "Co-Mentor",
    workload: 10,
    assignedDate: "2023-10-18"
  }
];
