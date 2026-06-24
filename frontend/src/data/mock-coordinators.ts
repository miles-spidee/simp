export interface Coordinator {
  id: string;
  employeeId: string;
  collegeId: string;
  name: string;
  email: string;
  phone: string;
  assignedStudentsCount: number;
  activeBatchesCount: number;
  placementsCount: number;
  status: 'Active' | 'Inactive';
}

export interface CollegeReport {
  id: string;
  coordinatorId: string;
  collegeId: string;
  month: string;
  year: number;
  fileId: string;
}

export const MOCK_COORDINATORS: Coordinator[] = [
  { id: 'coord-1', employeeId: 'emp-5', collegeId: 'col-1', name: 'Alice Smith', email: 'alice.s@example.com', phone: '1234567890', assignedStudentsCount: 150, activeBatchesCount: 3, placementsCount: 45, status: 'Active' },
  { id: 'coord-2', employeeId: 'emp-6', collegeId: 'col-2', name: 'Bob Johnson', email: 'bob.j@example.com', phone: '0987654321', assignedStudentsCount: 200, activeBatchesCount: 4, placementsCount: 60, status: 'Active' }
];

export const MOCK_COLLEGE_REPORTS: CollegeReport[] = [
  { id: 'rep-1', coordinatorId: 'coord-1', collegeId: 'col-1', month: 'November', year: 2023, fileId: 'file-1' },
];
