export interface Opportunity {
  id: string;
  title: string;
  type: string;
  value: "free" | "paid" | "stipend" | "industrial" | "corporate" | "research";
  description: string;
  duration: string;
  mode: string;
  seats: string;
  eligibility: string;
  startDate: string;
  color: string;
  internshipType?: "free" | "paid" | "stipend" | "industrial" | "corporate" | "research";
  amountType?: string;
  amount?: string;
  
  // Enterprise properties
  programId?: string;
  status?: 'Open' | 'Closed' | 'Draft';
  postedDate?: string;
}

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-l1",
    title: "Software Engineering Intern",
    type: "Tech",
    value: "stipend",
    description: "Join our core platform team to build scalable microservices using FastAPI and React. You will be paired with a senior mentor.",
    duration: "6 Months",
    mode: "Remote",
    seats: "5",
    eligibility: "B.Tech CS/IT (3rd or 4th Year)",
    startDate: "Starts Jan 2024",
    color: "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-500/30 text-blue-600",
    internshipType: "stipend",
    amountType: "stipend",
    amount: "$500/Month",
    programId: 'prog-1',
    status: 'Open',
    postedDate: '2023-10-15'
  },
  {
    id: "opp-l2",
    title: "UI/UX Design Intern",
    type: "Design",
    value: "free",
    description: "Work on the next generation of our ERP platform. Create wireframes, interactive prototypes, and design systems.",
    duration: "3 Months",
    mode: "Hybrid",
    seats: "2",
    eligibility: "Any Degree with Design Portfolio",
    startDate: "Starts Feb 2024",
    color: "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 text-purple-600",
    internshipType: "free",
    programId: 'prog-2',
    status: 'Open',
    postedDate: '2023-10-16'
  },
  {
    id: "opp-l3",
    title: "Data Science Intern",
    type: "Analytics",
    value: "paid",
    description: "Analyze large educational datasets to build predictive models for student performance and drop-out risks.",
    duration: "6 Months",
    mode: "Remote",
    seats: "3",
    eligibility: "M.Tech / B.Tech CS with ML knowledge",
    startDate: "Starts March 2024",
    color: "bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-600",
    internshipType: "paid",
    amountType: "paid",
    amount: "$25/Hour",
    programId: 'prog-1',
    status: 'Draft',
    postedDate: '2023-11-01'
  },
  {
    id: "opp-l4",
    title: "Sales Executive Trainee",
    type: "Sales",
    value: "free",
    description: "Acquire new clients and manage outbound enterprise sales cycles.",
    duration: "3 Months",
    mode: "New York, NY",
    seats: "15",
    eligibility: "MBA or Equivalent",
    startDate: "Starts March 2024",
    color: "bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-600",
    internshipType: "free",
    programId: 'prog-3',
    status: 'Closed',
    postedDate: '2023-08-01'
  }
];
