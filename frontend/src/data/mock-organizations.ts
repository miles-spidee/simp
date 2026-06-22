export interface Organization {
  id: string;
  name: string;
  code: string;
  type: 'Department' | 'Branch' | 'Subsidiary';
  headcount: number;
  managerId: string;
  status: 'Active' | 'Inactive';
}

export const MOCK_ORGANIZATIONS: Organization[] = [
  { id: 'org-1', name: 'Engineering', code: 'ENG', type: 'Department', headcount: 120, managerId: 'mgr-1', status: 'Active' },
  { id: 'org-2', name: 'Product', code: 'PRD', type: 'Department', headcount: 45, managerId: 'mgr-2', status: 'Active' },
  { id: 'org-3', name: 'Sales', code: 'SLS', type: 'Department', headcount: 200, managerId: 'mgr-3', status: 'Active' },
  { id: 'org-4', name: 'Pinesphere APAC', code: 'APAC', type: 'Branch', headcount: 350, managerId: 'mgr-4', status: 'Active' },
  { id: 'org-5', name: 'Pinesphere EMEA', code: 'EMEA', type: 'Branch', headcount: 150, managerId: 'mgr-5', status: 'Inactive' },
];
