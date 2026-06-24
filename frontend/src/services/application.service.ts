import { applicationApi } from '../api/application.api';
import { ApplicationCreate, ApplicationResponse, ApplicationReviewRequest } from '../types/api/application.types';
import { Application } from '../data/mock-applications';

export type ExtendedApplication = ApplicationResponse & Application;

export const applicationService = {
  mapToExtended(app: ApplicationResponse): ExtendedApplication {
    const firstName = app.profile?.first_name || '';
    const lastName = app.profile?.last_name || '';
    return {
      ...app,
      id: app.application_id,
      candidateName: `${firstName} ${lastName}`.trim(),
      firstName,
      lastName,
      email: app.profile?.email || '',
      phone: app.profile?.mobile_number || '',
      dob: '',
      gender: '',
      city: '',
      state: '',
      college: '',
      department: '',
      degree: '',
      currentYear: '',
      cgpa: 0,
      graduationYear: '',
      skills: [],
      githubUrl: '',
      linkedinUrl: '',
      portfolioUrl: '',
      projectExperience: '',
      resumeUrl: '',
      whyInternship: '',
      internshipType: 'free',
      opportunityId: app.opening_id,
      status: app.application_status as any,
      appliedDate: app.applied_at?.split('T')[0] || '',
      assignedReviewer: app.reviewed_by || 'Unassigned',
      reviewScore: 0,
      technicalScore: 0,
      communicationScore: 0,
      academicScore: 0,
      cultureFitScore: 0,
      overallRecommendation: 'Hold',
      aiMatchPercentage: 0
    } as any;
  },

  async getApplications(): Promise<ExtendedApplication[]> {
    try {
      const data = await applicationApi.getAllApplications();
      return data.map(app => this.mapToExtended(app));
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getApplication(id: string): Promise<ExtendedApplication | undefined> {
    try {
      const app = await applicationApi.getApplication(id);
      return this.mapToExtended(app);
    } catch (e) {
      console.error(e);
      return undefined;
    }
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
      console.error(e);
      return undefined;
    }
  },

  async updateApplicationDetails(id: string, updates: Partial<ExtendedApplication>): Promise<ExtendedApplication | undefined> {
    return this.getApplication(id);
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
