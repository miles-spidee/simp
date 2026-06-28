import { programApi } from '../api/program.api';
import { ProgramCreate, ProgramResponse } from '../types/api/program.types';
import { Program } from '../data/mock-programs';

export type ExtendedProgram = ProgramResponse & Program;

export const programService = {
  mapToExtended(prog: ProgramResponse): ExtendedProgram {
    return {
      ...prog,
      id: prog.program_id,
      title: prog.program_name,
      code: prog.program_code,
      organizationId: 'ORG-000',
      durationWeeks: 12,
      status: 'Active',
      type: 'Free Internship',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      studentsEnrolled: 0,
      mentorsAssigned: 0,
      completionRate: 0,
      description: prog.program_description,
      capacity: 100,
      eligibility: 'All students',
      curriculum: [],
      enrollments: [],
      mentors: [],
      analytics: {
        completionRate: 0,
        attendanceRate: 0,
        avgScore: 0,
        placementRate: 0,
        satisfactionScore: 0,
        enrollmentTrend: [],
        completionTrend: [],
        attendanceTrend: [],
        assessmentPerformance: []
      },
      certifications: { generated: 0, issued: 0, pending: 0, list: [] },
      metadata: { category: '', level: 'Intermediate', domain: '', tags: [], techStack: [], skills: [], certType: '' },
      timeline: []
    } as any;
  },

  async getPrograms(): Promise<ExtendedProgram[]> {
    try {
      const data = await programApi.getPrograms();
      return data.map(prog => this.mapToExtended(prog));
    } catch (e) {
      console.debug(e);
      return [];
    }
  },

  async getProgram(id: string): Promise<ExtendedProgram | undefined> {
    const all = await this.getPrograms();
    return all.find(p => p.program_id === id || p.id === id);
  },

  async createProgram(data: ProgramCreate): Promise<ExtendedProgram> {
    const res = await programApi.createProgram(data);
    return this.mapToExtended(res);
  },

  async updateProgram(id: string, updates: Partial<ExtendedProgram>): Promise<ExtendedProgram | undefined> {
    return undefined;
  },

  async bulkUpdateStatus(ids: string[], status: string): Promise<boolean> {
    return true;
  },

  async bulkAssignMentor(ids: string[], mentorId: string): Promise<boolean> {
    return true;
  }
};
