import { ReportingManager } from '../types/reporting-manager.types';

export const MOCK_REPORTING_MANAGERS: ReportingManager[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `rm-${i + 1}`,
  userId: `user-${100 + i}`,
  name: `Reporting Manager ${i + 1}`,
  email: `manager${i + 1}@pinesphere.com`,
  department: ['Engineering', 'Design', 'Marketing', 'Sales'][i % 4],
  designation: 'Senior Manager',
  assignedInternsCount: Math.floor(Math.random() * 15) + 5,
  status: 'Active',
}));
