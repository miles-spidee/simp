import { organizationApi } from '../api/organization.api';
import { CollegeCreate, CollegeResponse, DepartmentResponse, CoordinatorResponse } from '../types/api/organization.types';
import { Organization, MOCK_ORGANIZATIONS } from '../data/mock-organizations';

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
      console.debug("Failed to load organizations from API, falling back to mock data:", e);
    }
    return MOCK_ORGANIZATIONS.map((org: any) => ({
      ...org,
      college_id: org.id,
      college_name: org.name,
      college_code: org.code,
      designation: 'Organization'
    })) as ExtendedCollege[];
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
    return undefined;
  },

  async bulkUpdatePartnership(ids: string[], status: string): Promise<boolean> {
    return true;
  },

  async bulkAssignCoordinator(ids: string[], coordinatorName: string): Promise<boolean> {
    return true;
  }
};
