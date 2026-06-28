import { apiClient } from './api.client';
import { Feedback, FeedbackCreate } from '../types/api/feedback.types';

export const feedbackApi = {
  getFeedback: async (): Promise<Feedback[]> => {
    const res = await apiClient.get<Feedback[]>('/api/v1/feedback');
    return res.data;
  },

  getFeedbackById: async (id: string): Promise<Feedback> => {
    const res = await apiClient.get<Feedback>(`/api/v1/feedback/${id}`);
    return res.data;
  },

  createFeedback: async (data: FeedbackCreate): Promise<Feedback> => {
    const res = await apiClient.post<Feedback>('/api/v1/feedback', data);
    return res.data;
  },
};
