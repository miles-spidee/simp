import { MarketplaceOpportunity, MarketplaceApplication } from '../types/marketplace.types';

export const MOCK_MARKETPLACE: MarketplaceOpportunity[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `OPP-${5000 + i}`,
  title: ['Frontend Developer Intern', 'Backend Engineer Intern', 'Data Science Intern', 'Product Design Intern', 'Marketing Intern'][i % 5],
  companyName: ['Pinesphere Labs', 'TechFlow Inc.', 'DataViz Corp', 'DesignMind', 'CloudScale'][i % 5],
  department: ['Engineering', 'Data', 'Design', 'Marketing'][i % 4],
  location: ['New York, NY', 'San Francisco, CA', 'London, UK', 'Austin, TX'][i % 4],
  locationType: ['Hybrid', 'Remote', 'On-Site'][i % 3] as any,
  type: ['Full Time', 'Part Time'][i % 2] as any,
  compensation: ['Paid', 'Free'][i % 2] as any,
  stipend: i % 2 === 0 ? '$3,000/mo' : undefined,
  durationMonths: [3, 6, 12][i % 3],
  skills: ['React', 'TypeScript', 'Node.js', 'Figma', 'Python'].slice(0, 3 + (i % 3)),
  description: 'Join our team to build scalable enterprise solutions. You will be working directly with senior mentors.',
  requirements: ['Currently pursuing a CS degree', 'Strong problem-solving skills', 'Experience with web technologies'],
  postedDate: new Date(Date.now() - Math.random() * 10000000).toISOString(),
  deadlineDate: new Date(Date.now() + 2592000000).toISOString(), // +30 days
  isActive: true,
  applicantsCount: Math.floor(Math.random() * 200)
}));

export const MOCK_MARKETPLACE_APPLICATIONS: MarketplaceApplication[] = [
  {
    id: 'APP-1001',
    opportunityId: 'OPP-5000',
    studentId: 'STU-123',
    status: 'Interview',
    appliedDate: new Date().toISOString(),
    matchScore: 92
  },
  {
    id: 'APP-1002',
    opportunityId: 'OPP-5002',
    studentId: 'STU-123',
    status: 'Under Review',
    appliedDate: new Date(Date.now() - 86400000).toISOString(),
    matchScore: 85
  }
];
