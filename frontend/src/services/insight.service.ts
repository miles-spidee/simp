import { InsightApi } from '../api/insight.api';

export const InsightService = {
  getInsightsDashboard: async () => {
    const [forecasts, studentRisks] = await Promise.all([
      InsightApi.getForecasts(),
      InsightApi.getStudentRisks()
    ]);
    return { forecasts, studentRisks };
  }
};
