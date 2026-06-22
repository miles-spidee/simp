export interface Opportunity {
  id: string;
  title: string;
  programId: string;
  openings: number;
  location: string;
  status: 'Open' | 'Closed' | 'Draft';
  postedDate: string;
  type?: string;
  internshipType?: 'will paid' | 'pay' | 'free' | 'stipend';
  amount?: string;
  value?: string;
  description?: string;
  duration?: string;
  eligibility?: string;
  startDate?: string;
  color?: string;
}

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  { id: 'opp-1', title: 'Frontend Developer Intern', programId: 'prog-1', openings: 5, location: 'Remote', status: 'Open', postedDate: '2023-10-15', type: 'Tech', internshipType: 'stipend', amount: '$500/Month', value: 'High Demand', description: 'Join our core platform team to build scalable microservices using FastAPI and React.', duration: '6 Months', eligibility: 'B.Tech CS/IT', startDate: 'Starts Jan 2024', color: 'from-blue-600/20 to-cyan-600/20 border-blue-500/30 text-blue-400' },
  { id: 'opp-2', title: 'Backend Developer Intern', programId: 'prog-1', openings: 3, location: 'Remote', status: 'Open', postedDate: '2023-10-16', type: 'Tech', internshipType: 'will paid', amount: '$25/Hour', value: 'High Demand', description: 'Join our backend engineering team to scale cloud infrastructures.', duration: '6 Months', eligibility: 'B.Tech CS/IT', startDate: 'Starts Jan 2024', color: 'from-blue-600/20 to-cyan-600/20 border-blue-500/30 text-blue-400' },
  { id: 'opp-3', title: 'Associate Product Manager', programId: 'prog-2', openings: 2, location: 'San Francisco, CA', status: 'Draft', postedDate: '2023-11-01', type: 'Product', internshipType: 'free', value: 'High Demand', description: 'Assist in designing product roadmaps and launching new developer platforms.', duration: '3 Months', eligibility: 'Any Graduate', startDate: 'Starts Feb 2024', color: 'from-purple-600/20 to-pink-600/20 border-purple-500/30 text-purple-400' },
  { id: 'opp-4', title: 'Sales Executive Trainee', programId: 'prog-3', openings: 15, location: 'New York, NY', status: 'Closed', postedDate: '2023-08-01', type: 'Sales', internshipType: 'free', value: 'High Demand', description: 'Acquire new clients and manage outbound enterprise sales cycles.', duration: '3 Months', eligibility: 'MBA or Equivalent', startDate: 'Starts March 2024', color: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-400' },
];

