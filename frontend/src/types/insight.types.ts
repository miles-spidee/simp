export interface InsightForecast {
  id: string;
  metric: string;
  historicalValues: number[];
  predictedValues: number[];
  confidence: number;
}

export interface StudentRisk {
  studentId: string;
  name: string;
  program: string;
  riskScore: number; // 0-100
  factors: string[];
}
