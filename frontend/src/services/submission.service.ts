import { Submission, MOCK_SUBMISSIONS } from '../data/mock-submissions';
import { submissionApi } from '../api/submission.api';

export const submissionService = {
  async getSubmissions(): Promise<Submission[]> {
    try {
      const data = await submissionApi.getSubmissions();
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug(e);
    }
    return MOCK_SUBMISSIONS;
  },

  async getSubmission(id: string): Promise<Submission | undefined> {
    try {
      const data = await submissionApi.getSubmission(id);
      if (data) return data;
    } catch (e) {
      console.debug(e);
    }
    return MOCK_SUBMISSIONS.find(sub => sub.id === id);
  }
};
