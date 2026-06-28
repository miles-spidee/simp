import { Feedback } from '../types/api/feedback.types';

export const MOCK_FEEDBACK: Feedback[] = [
  {
    id: 'fb-1',
    type: 'StudentMentor',
    providerId: 'stu-1',
    providerRole: 'Student',
    targetId: 'men-1',
    date: '2026-06-15T10:00:00Z',
    rating: 5,
    comments: 'Great mentor, explains concepts very clearly.',
  },
  {
    id: 'fb-2',
    type: 'MentorStudent',
    providerId: 'men-1',
    providerRole: 'Mentor',
    targetId: 'stu-1',
    date: '2026-06-16T14:30:00Z',
    rating: 4,
    comments: 'Good progress, needs to focus on practical applications.',
    technicalSkillsRating: 4,
    communicationRating: 4,
    teamworkRating: 5,
    disciplineRating: 5,
  },
  {
    id: 'fb-3',
    type: 'CollegeInternship',
    providerId: 'col-1',
    providerRole: 'College',
    targetId: 'prog-1',
    date: '2026-06-20T09:15:00Z',
    rating: 5,
    comments: 'Excellent program, our students are very satisfied.',
    studentSatisfactionRating: 5,
    futureCollaborationInterest: true,
  }
];
