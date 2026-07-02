import { AlumniApi } from '../api/alumni.api';

export const AlumniService = {
  getAlumni: async () => {
    return await AlumniApi.getAlumni();
  },
  
  getTotalAlumniCount: async () => {
    const al = await AlumniApi.getAlumni();
    return al.length;
  },

  createAlumni: async (alumni: any) => {
    return await AlumniApi.createAlumni(alumni);
  },

  deleteAlumni: async (id: string) => {
    return await AlumniApi.deleteAlumni(id);
  }
};
