import { InsightForecast, StudentRisk } from '../types/insight.types';
import { MOCK_FORECASTS, MOCK_STUDENT_RISKS } from '../data/mock-insights';

export const InsightApi = {
  getForecasts: async (): Promise<InsightForecast[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_FORECASTS), 600));
  },
  getStudentRisks: async (): Promise<StudentRisk[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_STUDENT_RISKS), 600));
  }
};
