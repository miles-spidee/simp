import { ExecutiveMetric, RiskIndicator } from '../types/executive.types';

export const MOCK_EXECUTIVE_METRICS: ExecutiveMetric[] = [
  { id: 'em_1', title: 'Total Annual Revenue', value: '$12.5M', change: 15.4, changeType: 'increase', timeframe: 'vs Last Year' },
  { id: 'em_2', title: 'Enterprise Profitability', value: '28.4%', change: 2.1, changeType: 'increase', timeframe: 'vs Last Year' },
  { id: 'em_3', title: 'Operating Costs', value: '$8.2M', change: -4.5, changeType: 'decrease', timeframe: 'vs Last Year' },
  { id: 'em_4', title: 'Student Enrollment', value: '12,500', change: 8.2, changeType: 'increase', timeframe: 'vs Last Year' },
];

export const MOCK_RISK_INDICATORS: RiskIndicator[] = [
  { id: 'ri_1', department: 'Placements', riskLevel: 'Medium', description: 'Decrease in IT Services hiring volume', mitigation: 'Expand outreach to Product companies.' },
  { id: 'ri_2', department: 'Finance', riskLevel: 'Low', description: 'Slight delay in fee collection', mitigation: 'Automated reminders enabled.' },
  { id: 'ri_3', department: 'Academics', riskLevel: 'High', description: 'Dropout rate increasing in Cyber Security', mitigation: 'Assigning more mentors to the program.' },
];
