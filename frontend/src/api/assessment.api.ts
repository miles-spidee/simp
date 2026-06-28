import { apiClient } from './api.client';
import { Assessment, AssessmentSubmission } from '../types/api/assessment.types';

export const assessmentApi = {
  getAssessments: async (): Promise<Assessment[]> => {
    const res = await apiClient.get<Assessment[]>('/api/v1/assessments');
    return res.data;
  },

  getAssessment: async (id: string): Promise<Assessment> => {
    const res = await apiClient.get<Assessment>(`/api/v1/assessments/${id}`);
    return res.data;
  },

  getSubmissions: async (assessmentId: string): Promise<AssessmentSubmission[]> => {
    const res = await apiClient.get<AssessmentSubmission[]>(`/api/v1/assessments/${assessmentId}/submissions`);
    return res.data;
  },

  getAssessmentsByBatch: async (batchId: string): Promise<Assessment[]> => {
    const res = await apiClient.get<Assessment[]>(`/api/v1/batches/${batchId}/assessments`);
    return res.data;
  }
};
