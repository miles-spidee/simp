import { apiClient } from '../api/api.client';
import { Feedback, FeedbackCreate } from '../types/api/feedback.types';
import {} from '../types/feedback.types';
import { feedbackApi } from '../api/feedback.api';

export const feedbackService = {
  async getFeedback(): Promise<Feedback[]> {
    try {
      const res = await apiClient.get('/api/v1/feedback');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },

  async getFeedbackById(id: string): Promise<Feedback | undefined> {
    try {
      const res = await apiClient.get('/api/v1/feedback');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  async createFeedback(data: FeedbackCreate): Promise<Feedback> {
    try {
      const res = await apiClient.post('/api/v1/feedback');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },
};
