import { AlumniProfile } from '../types/alumni.types';
import { MOCK_ALUMNI } from '../data/mock-alumni';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const AlumniApi = {
  getAlumni: async (): Promise<AlumniProfile[]> => {
    await delay(500);
    return MOCK_ALUMNI;
  }
};
