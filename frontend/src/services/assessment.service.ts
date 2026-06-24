import { Assessment, AssessmentSubmission, MOCK_ASSESSMENTS, MOCK_ASSESSMENT_SUBMISSIONS } from '../data/mock-assessments';

class AssessmentService {
  async getAssessments(): Promise<Assessment[]> {
    return [...MOCK_ASSESSMENTS];
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    return MOCK_ASSESSMENTS.find(a => a.id === id);
  }

  async getSubmissions(assessmentId: string): Promise<AssessmentSubmission[]> {
    return MOCK_ASSESSMENT_SUBMISSIONS.filter(s => s.assessmentId === assessmentId);
  }

  async getAssessmentsByBatch(batchId: string): Promise<Assessment[]> {
    return MOCK_ASSESSMENTS.filter(a => a.batchId === batchId);
  }
}

export const assessmentService = new AssessmentService();
