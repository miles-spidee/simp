import { applicationApi } from '../api/application.api';
import { ApplicationCreate, ApplicationResponse, ApplicationReviewRequest } from '../types/api/application.types';
import { Application, MOCK_APPLICATIONS } from '../data/mock-applications';

export type ExtendedApplication = ApplicationResponse & Application;

export const applicationService = {
  mapToExtended(app: ApplicationResponse): ExtendedApplication {
    const firstName = app.profile?.first_name || '';
    const lastName = app.profile?.last_name || '';
    const ad = app.application_data || {};
    const rd = app.review_data || {};
    const ac = ad.academicInformation || {};
    const pr = ad.professionalInformation || {};
    const mo = ad.motivation || {};
    const pc = ad.personalInformation || {};

    return {
      ...app,
      id: app.application_id,
      candidateName: `${firstName} ${lastName}`.trim(),
      firstName,
      lastName,
      email: app.profile?.email || pc.email || '',
      phone: app.profile?.mobile_number || pc.mobileNumber || '',
      dob: pc.dateOfBirth || '',
      gender: pc.gender || '',
      city: pc.city || '',
      state: pc.state || '',
      college: ac.collegeName || '',
      department: ac.department || '',
      degree: ac.degree || '',
      currentYear: ac.currentYear || '',
      cgpa: parseFloat(ac.cgpaPercentage) || 0,
      graduationYear: ac.graduationYear || '',
      skills: pr.skills ? pr.skills.split(',').map((s: string) => s.trim()) : [],
      githubUrl: pr.githubUrl || '',
      linkedinUrl: pr.linkedinUrl || '',
      portfolioUrl: pr.portfolioUrl || '',
      projectExperience: pr.projectExperience || '',
      resumeUrl: ad.resume_url || (ad.documents && ad.documents.resume) || '',
      whyInternship: mo.whyInternship || '',
      internshipType: ad.internshipType || 'free',
      opportunityId: app.opening_id,
      status: app.application_status as any,
      appliedDate: app.applied_at?.split('T')[0] || '',
      assignedReviewer: app.reviewed_by || 'Unassigned',
      reviewScore: ((rd.technical_score || 0) + (rd.communication_score || 0) + (rd.academic_score || 0) + (rd.culture_fit_score || 0)) / 4,
      technicalScore: rd.technical_score || 0,
      communicationScore: rd.communication_score || 0,
      academicScore: rd.academic_score || 0,
      cultureFitScore: rd.culture_fit_score || 0,
      overallRecommendation: rd.overall_recommendation || 'Hold',
      reviewerNotes: rd.reviewer_notes || '',
      reviewerFeedback: rd.reviewer_feedback || app.remarks || '',
      aiMatchPercentage: 0
    } as any;
  },

  async getApplications(): Promise<ExtendedApplication[]> {
    try {
      const data = await applicationApi.getAllApplications();
      if (data && data.length > 0) {
        return data.map(app => this.mapToExtended(app));
      }
    } catch (e) {
      console.debug('Failed to fetch applications, falling back to mock data', e);
    }
    return MOCK_APPLICATIONS as unknown as ExtendedApplication[];
  },

  async getApplication(id: string): Promise<ExtendedApplication | undefined> {
    try {
      const app = await applicationApi.getApplication(id);
      if (app) {
        return this.mapToExtended(app);
      }
    } catch (e) {
      console.debug('Failed to fetch application, falling back to mock data', e);
    }
    return MOCK_APPLICATIONS.find(a => a.id === id) as unknown as ExtendedApplication;
  },

  async getApplicationsByOpportunity(oppId: string): Promise<ExtendedApplication[]> {
    const all = await this.getApplications();
    return all.filter(a => a.opening_id === oppId);
  },

  async updateApplicationStatus(id: string, newStatus: string): Promise<ExtendedApplication | undefined> {
    const req: ApplicationReviewRequest = { application_status: newStatus, remarks: '' };
    try {
      const res = await applicationApi.reviewApplication(id, req);
      return this.mapToExtended(res);
    } catch (e) {
      console.debug(e);
      return undefined;
    }
  },

  async updateApplicationDetails(id: string, updates: Partial<ExtendedApplication>): Promise<ExtendedApplication | undefined> {
    const req: ApplicationReviewRequest = {
      application_status: updates.status || 'Under Review',
      remarks: updates.reviewerFeedback || '',
      technical_score: updates.technicalScore,
      communication_score: updates.communicationScore,
      academic_score: updates.academicScore,
      culture_fit_score: updates.cultureFitScore,
      overall_recommendation: updates.overallRecommendation,
      reviewer_notes: updates.reviewerNotes,
      reviewer_feedback: updates.reviewerFeedback
    };
    try {
      const res = await applicationApi.reviewApplication(id, req);
      return this.mapToExtended(res);
    } catch (e) {
      console.debug(e);
      return undefined;
    }
  },

  async createApplication(data: ApplicationCreate): Promise<ExtendedApplication> {
    const res = await applicationApi.submitApplication(data);
    return this.mapToExtended(res);
  },

  async bulkUpdateStatus(ids: string[], newStatus: string): Promise<ExtendedApplication[]> {
    return [];
  },

  async bulkAssignReviewer(ids: string[], reviewer: string): Promise<ExtendedApplication[]> {
    return [];
  }
};
