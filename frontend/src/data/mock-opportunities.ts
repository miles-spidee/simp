export interface Opportunity {
  id: string;
  title: string;
  programId: string;
  openings: number;
  location: string;
  status: 'Open' | 'Closed' | 'Draft';
  postedDate: string;
}

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  { id: 'opp-1', title: 'Frontend Developer Intern', programId: 'prog-1', openings: 5, location: 'Remote', status: 'Open', postedDate: '2023-10-15' },
  { id: 'opp-2', title: 'Backend Developer Intern', programId: 'prog-1', openings: 3, location: 'Remote', status: 'Open', postedDate: '2023-10-16' },
  { id: 'opp-3', title: 'Associate Product Manager', programId: 'prog-2', openings: 2, location: 'San Francisco, CA', status: 'Draft', postedDate: '2023-11-01' },
  { id: 'opp-4', title: 'Sales Executive Trainee', programId: 'prog-3', openings: 15, location: 'New York, NY', status: 'Closed', postedDate: '2023-08-01' },
];
