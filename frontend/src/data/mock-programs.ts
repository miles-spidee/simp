export interface Program {
  id: string;
  title: string;
  code: string;
  durationWeeks: number;
  organizationId: string;
  status: 'Draft' | 'Active' | 'Completed';
}

export const MOCK_PROGRAMS: Program[] = [
  { id: 'prog-1', title: 'Summer Software Engineering Internship', code: 'SEI-2023', durationWeeks: 12, organizationId: 'org-1', status: 'Active' },
  { id: 'prog-2', title: 'Product Management Fellowship', code: 'PMF-2024', durationWeeks: 24, organizationId: 'org-2', status: 'Draft' },
  { id: 'prog-3', title: 'Sales Boot Camp', code: 'SBC-101', durationWeeks: 4, organizationId: 'org-3', status: 'Completed' },
  { id: 'prog-4', title: 'Pinesphere Global Leadership', code: 'PGL-24', durationWeeks: 52, organizationId: 'org-4', status: 'Active' },
];
