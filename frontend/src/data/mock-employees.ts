export interface Employee {
  id: string;
  userId: string;
  organizationId: string;
  designation: string;
  joinDate: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  managerId?: string;
}

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'emp-1', userId: '3', organizationId: 'org-1', designation: 'Senior HR Manager', joinDate: '2022-01-15', status: 'Active' },
  { id: 'emp-2', userId: '2', organizationId: 'org-2', designation: 'Engineering Mentor', joinDate: '2023-03-10', status: 'Active', managerId: 'emp-1' },
  { id: 'emp-3', userId: '4', organizationId: 'org-3', designation: 'College Coordinator', joinDate: '2023-06-20', status: 'Active' },
  { id: 'emp-4', userId: '1', organizationId: 'org-1', designation: 'Junior Developer', joinDate: '2023-10-24', status: 'On Leave', managerId: 'emp-2' },
];
