import { AlumniProfile } from '../types/alumni.types';

export const MOCK_ALUMNI: AlumniProfile[] = Array.from({ length: 500 }).map((_, i) => ({
  id: `alumni_${i + 1}`,
  studentId: `std_alumni_${i + 1}`,
  name: `Alumni ${i + 1}`,
  email: `alumni${i+1}@example.com`,
  phone: `+9198765${String(i).padStart(5, '0')}`,
  program: 'Full Stack Web Development',
  batch: `FSD-202${(i % 4) + 1}`,
  graduationYear: 2021 + (i % 4),
  currentCompany: `Company ${(i % 50) + 1}`,
  currentDesignation: i % 2 === 0 ? 'Senior Software Engineer' : 'Tech Lead',
  linkedInUrl: `https://linkedin.com/in/alumni${i+1}`,
  careerHistory: [
    {
      id: `ch_${i}_1`,
      companyName: `Company ${(i % 50) + 1}`,
      designation: i % 2 === 0 ? 'Senior Software Engineer' : 'Tech Lead',
      startDate: '2023-01-01',
      isCurrent: true,
      location: 'Bangalore'
    }
  ],
  achievements: ['Employee of the Year 2024', 'Open Source Contributor'],
  isMentoring: i % 5 === 0,
  referralsProvided: Math.floor(Math.random() * 5),
  lastUpdated: new Date(Date.now() - i * 86400000).toISOString()
}));
