import { MOCK_ASSESSMENTS, MOCK_ASSESSMENT_SUBMISSIONS } from '../data/mock-assessments';
import { Assessment, AssessmentSubmission } from '../types/api/assessment.types';
import { assessmentApi } from '../api/assessment.api';

class AssessmentService {
  async getAssessments(): Promise<Assessment[]> {
    try {
      const data = await assessmentApi.getAssessments();
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug('Failed to fetch assessments, using mock:', e);
    }
    return [...MOCK_ASSESSMENTS];
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    try {
      const data = await assessmentApi.getAssessment(id);
      if (data) return data;
    } catch (e) {
      console.debug(`Failed to fetch assessment ${id}, using mock:`, e);
    }
    return MOCK_ASSESSMENTS.find(a => a.id === id);
  }

  async getSubmissions(assessmentId: string): Promise<AssessmentSubmission[]> {
    try {
      const data = await assessmentApi.getSubmissions(assessmentId);
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug(`Failed to fetch submissions for ${assessmentId}, using mock:`, e);
    }
    return MOCK_ASSESSMENT_SUBMISSIONS.filter(s => s.assessmentId === assessmentId);
  }

  async getAssessmentsByBatch(batchId: string): Promise<Assessment[]> {
    try {
      const data = await assessmentApi.getAssessmentsByBatch(batchId);
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug(`Failed to fetch assessments for batch ${batchId}, using mock:`, e);
    }
    return MOCK_ASSESSMENTS.filter(a => a.batchId === batchId);
  }
}

export const assessmentService = new AssessmentService();
