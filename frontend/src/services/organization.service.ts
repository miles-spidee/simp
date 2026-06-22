import { Organization, MOCK_ORGANIZATIONS } from '../data/mock-organizations';

export const organizationService = {
  async getOrganizations(): Promise<Organization[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_ORGANIZATIONS;
  },

  async getOrganization(id: string): Promise<Organization | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_ORGANIZATIONS.find(org => org.id === id);
  }
};
