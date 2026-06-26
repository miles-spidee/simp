import { Company, PlacementRecord } from '../types/placement.types';

export const MOCK_COMPANIES: Company[] = Array.from({ length: 100 }).map((_, i) => ({
  id: `comp_${i + 1}`,
  name: `TechCorp ${i + 1} Solutions`,
  industry: i % 2 === 0 ? 'IT Services' : 'Product Development',
  website: `https://techcorp${i+1}.example.com`,
  contactPerson: `HR Manager ${i + 1}`,
  contactEmail: `hr@techcorp${i+1}.example.com`,
  activeRoles: Math.floor(Math.random() * 10) + 1
}));

export const MOCK_PLACEMENTS: PlacementRecord[] = Array.from({ length: 200 }).map((_, i) => {
  const stages: any[] = ['Eligible', 'Applied', 'Shortlisted', 'Technical Round', 'HR Round', 'Selected', 'Offer Released', 'Joined', 'Rejected'];
  const stage = stages[i % stages.length];
  
  return {
    id: `pl_${i + 1}`,
    studentId: `std_${i + 1}`,
    studentName: `Student ${i + 1}`,
    program: i % 2 === 0 ? 'Full Stack' : 'Data Science',
    companyId: `comp_${(i % 100) + 1}`,
    companyName: `TechCorp ${(i % 100) + 1} Solutions`,
    role: i % 2 === 0 ? 'Software Engineer Intern' : 'Data Analyst',
    package: `${(Math.floor(Math.random() * 8) + 4)} LPA`,
    location: i % 2 === 0 ? 'Bangalore' : 'Remote',
    stage,
    interviewDate: ['Technical Round', 'HR Round'].includes(stage) ? new Date(Date.now() + 86400000 * 2).toISOString() : undefined,
    offerStatus: ['Offer Released', 'Joined'].includes(stage) ? 'Accepted' : undefined,
    joiningDate: stage === 'Joined' ? new Date().toISOString() : undefined,
    remarks: 'Strong technical skills.',
    lastUpdated: new Date().toISOString()
  };
});
