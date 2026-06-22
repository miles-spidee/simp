export interface Batch {
  id: string;
  name: string;
  programId: string;
  startDate: string;
  endDate: string;
  capacity: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export const MOCK_BATCHES: Batch[] = [
  { id: 'batch-1', name: 'Fall 2023 Engineering Cohort', programId: 'prog-1', startDate: '2023-09-01', endDate: '2023-11-30', capacity: 30, status: 'Ongoing' },
  { id: 'batch-2', name: 'Winter 2024 Product Fellows', programId: 'prog-2', startDate: '2024-01-15', endDate: '2024-06-30', capacity: 15, status: 'Upcoming' },
  { id: 'batch-3', name: 'Summer 2023 Sales Camp', programId: 'prog-3', startDate: '2023-06-01', endDate: '2023-06-30', capacity: 50, status: 'Completed' },
];
