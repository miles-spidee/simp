import { Feedback, FeedbackCreate } from '../types/api/feedback.types';
import { MOCK_FEEDBACK } from '../data/mock-feedback';
import { feedbackApi } from '../api/feedback.api';

export const feedbackService = {
  async getFeedback(): Promise<Feedback[]> {
    try {
      const data = await feedbackApi.getFeedback();
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug('Failed to fetch feedback, using mock data:', e);
    }
    return [...MOCK_FEEDBACK];
  },

  async getFeedbackById(id: string): Promise<Feedback | undefined> {
    try {
      const data = await feedbackApi.getFeedbackById(id);
      if (data) return data;
    } catch (e) {
      console.debug(`Failed to fetch feedback ${id}, using mock data:`, e);
    }
    return MOCK_FEEDBACK.find((f) => f.id === id);
  },

  async createFeedback(data: FeedbackCreate): Promise<Feedback> {
    try {
      const result = await feedbackApi.createFeedback(data);
      if (result) return result;
    } catch (e) {
      console.debug('Failed to create feedback, creating mock:', e);
    }
    const newFeedback = {
      ...data,
      id: `fb-${MOCK_FEEDBACK.length + 1}`,
      providerId: 'current-user', // Mock value
      providerRole: 'Student', // Mock value
      date: new Date().toISOString(),
    } as Feedback;
    
    MOCK_FEEDBACK.push(newFeedback);
    return newFeedback;
  },
};
