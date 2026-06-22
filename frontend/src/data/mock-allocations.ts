export interface Allocation {
  id: string;
  studentId: string;
  batchId: string;
  allocationDate: string;
  status: 'Allocated' | 'Transferred' | 'Dropped';
}

export const MOCK_ALLOCATIONS: Allocation[] = [
  { id: 'alloc-1', studentId: 'stu-1', batchId: 'batch-1', allocationDate: '2023-08-15', status: 'Allocated' },
  { id: 'alloc-2', studentId: 'stu-2', batchId: 'batch-3', allocationDate: '2023-05-10', status: 'Transferred' },
];
