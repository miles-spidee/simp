export interface ExecutiveMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  timeframe: string;
}

export interface RiskIndicator {
  id: string;
  department: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  mitigation: string;
}
