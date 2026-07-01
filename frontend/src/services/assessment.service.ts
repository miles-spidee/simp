import { apiClient } from '../api/api.client';
import {} from '../types/assessments.types';
import { Assessment, AssessmentSubmission } from '../types/api/assessment.types';
import { assessmentApi } from '../api/assessment.api';

class AssessmentService {
  async getAssessments(): Promise<Assessment[]> {
    try {
      const res = await apiClient.get('/api/v1/assessment');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    try {
      const res = await apiClient.get('/api/v1/assessment');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }

  async getSubmissions(assessmentId: string): Promise<AssessmentSubmission[]> {
    try {
      const res = await apiClient.get('/api/v1/assessment');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }

  async getAssessmentsByBatch(batchId: string): Promise<Assessment[]> {
    try {
      const res = await apiClient.get('/api/v1/assessment');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }
}

export const assessmentService = new AssessmentService();
