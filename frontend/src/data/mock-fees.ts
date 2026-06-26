import { FeeStructure, FeeType, FeeStatus } from '../types/fee.types';

export const MOCK_FEES: FeeStructure[] = Array.from({ length: 25 }).map((_, i) => {
  const types: FeeType[] = ['Registration', 'Internship', 'Training', 'Exam', 'Certificate', 'Hostel', 'Transport'];
  const programs = ['B.Tech CSE', 'M.Tech Data Science', 'MBA Finance', 'BBA', 'BCA'];
  
  return {
    id: `fee-${i + 1}`,
    feeName: `${programs[i % programs.length]} ${types[i % types.length]} Fee`,
    feeType: types[i % types.length],
    amount: Math.floor(Math.random() * 50000) + 5000,
    program: programs[i % programs.length],
    department: 'Engineering',
    duration: '6 Months',
    applicableBatch: `202${3 + (i % 3)}`,
    installments: (i % 3) + 1,
    lateFee: 500,
    status: (i % 5 === 0) ? 'Inactive' : 'Active',
  };
});
