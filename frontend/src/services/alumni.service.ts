import { AlumniApi } from '../api/alumni.api';

export const AlumniService = {
  getAlumni: async () => {
    return await AlumniApi.getAlumni();
  },
  
  getTotalAlumniCount: async () => {
    const al = await AlumniApi.getAlumni();
    return al.length;
  }
};
