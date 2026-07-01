import { degreeApi } from '../api/degree.api';
import { DegreeResponse } from '../types/api/degree.types';
import { MOCK_DEGREES } from '../data/mock-degrees';

export const degreeService = {
  async getDegrees(): Promise<DegreeResponse[]> {
    try {
      const data = await degreeApi.getDegrees();
      if (data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.debug("Failed to load degrees from API, falling back to mock data:", e);
    }
    return MOCK_DEGREES;
  }
};
