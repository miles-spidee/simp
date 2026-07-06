import { apiClient } from './api.client';
import { Submission, SubmissionCreate, SubmissionUpdate } from '../types/api/submission.types';

export const submissionApi = {
  getSubmissions: async (): Promise<Submission[]> => {
    const res = await apiClient.get('/api/v1/submission');
    return res.data?.data || [];
  },

  getSubmission: async (id: string): Promise<Submission> => {
    const res = await apiClient.get(`/api/v1/submission/${id}`);
    return res.data?.data;
  },

  createSubmission: async (data: SubmissionCreate): Promise<Submission> => {
    const res = await apiClient.post('/api/v1/submission', data);
    return res.data?.data;
  },

  updateSubmission: async (id: string, updates: SubmissionUpdate): Promise<Submission> => {
    const res = await apiClient.patch(`/api/v1/submission/${id}`, updates);
    return res.data?.data;
  },
};
