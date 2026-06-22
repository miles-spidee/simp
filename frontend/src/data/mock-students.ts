export interface Student {
  id: string;
  userId: string;
  applicationId?: string;
  enrollmentDate: string;
  status: 'Active' | 'Graduated' | 'Dropped';
}

export const MOCK_STUDENTS: Student[] = [
  { id: 'stu-1', userId: '1', applicationId: 'app-3', enrollmentDate: '2023-10-24', status: 'Active' },
  { id: 'stu-2', userId: '5', enrollmentDate: '2023-01-10', status: 'Graduated' },
];
