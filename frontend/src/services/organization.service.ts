import { organizationApi } from '../api/organization.api';
import { CollegeCreate, CollegeResponse, DepartmentResponse, CoordinatorResponse } from '../types/api/organization.types';
import { Organization } from '../types/organizations.types';

export type ExtendedCollege = CollegeResponse & Organization;

export const organizationService = {
  mapToExtended(col: CollegeResponse): ExtendedCollege {
    return {
      ...col,
      id: col.college_id,
      name: col.college_name,
      code: col.college_code,
      type: 'Engineering',
      headcount: 1000,
      managerId: '',
      status: col.status === 'ACTIVE' ? 'Active' : 'Inactive',
      logo: 'https://example.com/logo.png',
      university: 'Affiliated University',
      location: 'City, State',
      partnershipStatus: col.status === 'ACTIVE' ? 'Active' : 'Inactive',
      partnershipSince: col.created_at || '',
      website: '',
      email: '',
      phone: '',
      address: '',
      affiliation: '',
      accreditation: '',
      establishmentYear: 2000,
      departments: [],
      coordinators: [],
      students: [] as any,
      programs: [],
      placementAnalytics: {
        placementPercentage: 0,
        studentsPlaced: 0,
        companiesParticipated: 0,
        avgPackage: '',
        placementTrend: [],
        deptPlacementRate: [],
        companyHiring: [],
        salaryDistribution: [],
        yoyGrowth: []
      },
      naacGrade: '',
      nbaStatus: 'Applied',
      autonomousStatus: 'Affiliated',
      nationalRanking: 0,
      documents: [],
      timeline: []
    } as any;
  },

  async getOrganizations(): Promise<ExtendedCollege[]> {
    try {
      const data = await organizationApi.getColleges();
      if (data && data.length > 0) {
        return data.map(col => this.mapToExtended(col));
      }
    } catch (e) {
      console.error("Failed to load organizations from API", e);
    }
    return [];
  },

  async getOrganization(id: string): Promise<ExtendedCollege | undefined> {
    const all = await this.getOrganizations();
    return all.find(c => c.college_id === id || c.id === id);
  },

  async createOrganization(data: CollegeCreate): Promise<ExtendedCollege> {
    const res = await organizationApi.createCollege(data);
    return this.mapToExtended(res);
  },

  async updateOrganization(id: string, updates: Partial<ExtendedCollege>): Promise<ExtendedCollege | undefined> {
    const res = await organizationApi.updateCollege(id, {
      college_name: updates.name,
      college_code: updates.code,
      status: updates.partnershipStatus
    });
    return this.mapToExtended(res);
  },

  async bulkUpdatePartnership(ids: string[], status: string): Promise<boolean> {
    return await organizationApi.bulkUpdatePartnership(ids, status);
  },

  async bulkAssignCoordinator(ids: string[], coordinatorName: string): Promise<boolean> {
    return await organizationApi.bulkAssignCoordinator(ids, coordinatorName);
  }
};
