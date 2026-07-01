import { apiClient } from '../api/api.client';
import { degreeApi } from '../api/degree.api';
import { DegreeResponse } from '../types/api/degree.types';
import {} from '../types/degrees.types';

export const degreeService = {
  async getDegrees(): Promise<DegreeResponse[]> {
    try {
      const res = await apiClient.get('/api/v1/degree');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }
};
