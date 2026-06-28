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
