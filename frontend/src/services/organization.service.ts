import { organizationApi } from '../api/organization.api';
import { CollegeCreate, CollegeResponse, DepartmentResponse, CoordinatorResponse } from '../types/api/organization.types';
import { Organization } from '../types/organizations.types';

export type ExtendedCollege = CollegeResponse & Organization & {
  has_account?: boolean;
  username?: string;
};

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
      status: (col.status === 'Active' || col.status === 'ACTIVE' || col.status === 'Pending Verification') ? 'Active' : 'Inactive',
      logo: 'https://example.com/logo.png',
      university: 'Affiliated University',
      location: col.address_line_1 || 'City, State',
      partnershipStatus: col.status || 'Active',
      partnershipSince: col.created_at || '',
      website: col.website_url || '',
      email: col.college_email || '',
      phone: col.college_phone || '',
      address: col.address_line_2 || '',
      affiliation: '',
      accreditation: col.accreditation || '',
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
    try {
      const current = await this.getOrganization(id);
      
      const payload: any = {};
      if (updates.name !== undefined) payload.college_name = updates.name;
      if (updates.code !== undefined) payload.college_code = updates.code;
      if (updates.partnershipStatus !== undefined) payload.status = updates.partnershipStatus;
      if (updates.email !== undefined) payload.college_email = updates.email;
      if (updates.phone !== undefined) payload.college_phone = updates.phone;
      if (updates.website !== undefined) payload.website_url = updates.website;
      if (updates.location !== undefined) payload.address_line_1 = updates.location;
      if (updates.address !== undefined) payload.address_line_2 = updates.address;
      if (updates.accreditation !== undefined) payload.accreditation = updates.accreditation;

      const res = await organizationApi.updateCollege(id, payload);
      const mapped = this.mapToExtended(res);
      return {
        ...(current || {} as ExtendedCollege),
        ...mapped,
        ...updates,
      } as ExtendedCollege;
    } catch (e) {
      console.debug('Failed to update organization via API:', e);
      return undefined;
    }
  },

  async bulkUpdatePartnership(ids: string[], status: string): Promise<boolean> {
    return await organizationApi.bulkUpdatePartnership(ids, status);
  },

  async bulkAssignCoordinator(ids: string[], coordinatorName: string): Promise<boolean> {
    return await organizationApi.bulkAssignCoordinator(ids, coordinatorName);
  }
};
