export interface Opportunity {
  id: string;
  title: string;
  type: string;
  value: string;
  description: string;
  duration: string;
  mode: string;
  seats: string;
  eligibility: string;
  startDate: string;
  color: string;
}

export const MOCK_LANDING_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-l1",
    title: "Software Engineering Intern",
    type: "Tech",
    value: "High Demand",
    description: "Join our core platform team to build scalable microservices using FastAPI and React. You will be paired with a senior mentor.",
    duration: "6 Months",
    mode: "Remote",
    seats: "5 Openings",
    eligibility: "B.Tech CS/IT (3rd or 4th Year)",
    startDate: "Starts Jan 2024",
    color: "from-blue-600/20 to-cyan-600/20 border-blue-500/30 text-blue-400"
  },
  {
    id: "opp-l2",
    title: "UI/UX Design Intern",
    type: "Design",
    value: "Creative",
    description: "Work on the next generation of our ERP platform. Create wireframes, interactive prototypes, and design systems.",
    duration: "3 Months",
    mode: "Hybrid",
    seats: "2 Openings",
    eligibility: "Any Degree with Design Portfolio",
    startDate: "Starts Feb 2024",
    color: "from-purple-600/20 to-pink-600/20 border-purple-500/30 text-purple-400"
  },
  {
    id: "opp-l3",
    title: "Data Science Intern",
    type: "Analytics",
    value: "Research",
    description: "Analyze large educational datasets to build predictive models for student performance and drop-out risks.",
    duration: "6 Months",
    mode: "Remote",
    seats: "3 Openings",
    eligibility: "M.Tech / B.Tech CS with ML knowledge",
    startDate: "Starts March 2024",
    color: "from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-400"
  }
];
