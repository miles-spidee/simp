import { Submission } from '../types/api/submission.types';
import { submissionApi } from '../api/submission.api';

export const submissionService = {
  async getSubmissions(): Promise<Submission[]> {
    try {
      const data = await submissionApi.getSubmissions();
      return data || [];
    } catch (e) {
      console.debug(e);
      return [];
    }
  },

  async getSubmission(id: string): Promise<Submission | undefined> {
    try {
      const data = await submissionApi.getSubmission(id);
      return data;
    } catch (e) {
      console.debug(e);
      return undefined;
    }
  }
};
