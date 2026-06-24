import { Application, ApplicationStatus, MOCK_APPLICATIONS } from '../data/mock-applications';

export const applicationService = {
  async getApplications(): Promise<Application[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_APPLICATIONS;
  },

  async getApplication(id: string): Promise<Application | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_APPLICATIONS.find(app => app.id === id);
  },

  async getApplicationsByOpportunity(oppId: string): Promise<Application[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_APPLICATIONS.filter(app => app.opportunityId === oppId);
  },

  async updateApplicationStatus(id: string, newStatus: ApplicationStatus): Promise<Application | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const app = MOCK_APPLICATIONS.find(a => a.id === id);
    if (app) {
      app.status = newStatus;
    }
    return app;
  },

  async createApplication(data: {
    candidateName: string;
    email: string;
    phone: string;
    opportunityId: string;
    status: ApplicationStatus;
  }): Promise<Application> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newApp: Application = {
      ...data,
      firstName: data.candidateName.split(' ')[0] || '',
      lastName: data.candidateName.split(' ').slice(1).join(' ') || '',
      dob: '2000-01-01',
      gender: 'Other',
      city: 'Unknown',
      state: 'N/A',
      college: 'Unknown University',
      department: 'General',
      degree: 'B.S.',
      currentYear: '1st Year',
      cgpa: 8.0,
      graduationYear: new Date().getFullYear().toString(),
      skills: [],
      githubUrl: '',
      linkedinUrl: '',
      portfolioUrl: '',
      projectExperience: '',
      resumeUrl: '',
      whyInternship: '',
      internshipType: 'free',
      assignedReviewer: 'Unassigned',
      id: `app-${MOCK_APPLICATIONS.length + 1}`,
      appliedDate: new Date().toISOString().split('T')[0]
    };
    MOCK_APPLICATIONS.push(newApp);
    return newApp;
  },

  async updateApplicationDetails(id: string, updates: Partial<Application>): Promise<Application | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const idx = MOCK_APPLICATIONS.findIndex(a => a.id === id);
    if (idx !== -1) {
      MOCK_APPLICATIONS[idx] = {
        ...MOCK_APPLICATIONS[idx],
        ...updates
      };
      return MOCK_APPLICATIONS[idx];
    }
    return undefined;
  },

  async bulkUpdateStatus(ids: string[], newStatus: ApplicationStatus): Promise<Application[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const updated: Application[] = [];
    MOCK_APPLICATIONS.forEach(app => {
      if (ids.includes(app.id)) {
        app.status = newStatus;
        updated.push(app);
      }
    });
    return updated;
  },

  async bulkAssignReviewer(ids: string[], reviewer: string): Promise<Application[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const updated: Application[] = [];
    MOCK_APPLICATIONS.forEach(app => {
      if (ids.includes(app.id)) {
        app.assignedReviewer = reviewer;
        updated.push(app);
      }
    });
    return updated;
  }
};
