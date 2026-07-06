import { mentorApi } from '../api/mentor.api';
import { batchApi } from '../api/batch.api';
import { BatchCreate, BatchResponse, BatchStudentCreate } from '../types/api/batch.types';
import { Batch, MOCK_BATCHES } from '../data/mock-batches';

export type ExtendedBatch = BatchResponse & Batch;

export const batchService = {
  async getBatches(): Promise<ExtendedBatch[]> {
    try {
      const data = await batchApi.getBatches();
      if (Array.isArray(data)) {
        let mappings: any[] = [];
        try {
            mappings = (await mentorApi.getBatchMappings()) as any[];
        } catch(e) {}
        
        let mentorsMap: any = {};
        if (mappings && mappings.length > 0) {
            try {
                const mentorsData = await mentorApi.getMentorProfiles();
                mentorsMap = mentorsData.reduce((acc: any, m: any) => {
                    acc[m.mentor_profile_id] = m;
                    return acc;
                }, {});
            } catch(e) {}
        }

        return data.map(b => {
           const ext = this.mapToExtended(b);
           const mapping = mappings.find((m: any) => m.batch_id === b.batch_id);
           if (mapping) {
               const mentorProfile = mentorsMap[mapping.mentor_id];
               ext.mentor.id = mapping.mentor_id;
               if (mentorProfile) {
                   ext.mentor.name = mentorProfile.employeeName || mentorProfile.user_id;
                   ext.mentor.expertise = mentorProfile.mentor_expertise?.join(', ') || mentorProfile.mentor_bio || '';
               }
           }
           return ext;
        });
      }
    } catch (e) {
      console.warn('Backend API unavailable or failed.', e);
    }
    return [];
  },

  async getBatch(id: string): Promise<ExtendedBatch | undefined> {
    try {
      const data = await batchApi.getBatch(id);
      const ext = this.mapToExtended(data);
      try {
          const mappings = (await mentorApi.getBatchMappings()) as any[];
          const mapping = mappings.find((m: any) => m.batch_id === id);
          if (mapping) {
              ext.mentor.id = mapping.mentor_id;
              const mentorProfile = await mentorApi.getMentorProfile(mapping.mentor_id);
              if (mentorProfile) {
                   ext.mentor.name = mentorProfile.employeeName || mentorProfile.user_id;
                   ext.mentor.expertise = mentorProfile.mentor_expertise?.join(', ') || mentorProfile.mentor_bio || '';
              }
          }
      } catch (e) {}
      
      return ext;
    } catch (e) {
      console.debug(e);
      return undefined;
    }
  },

  async getBatchesByProgram(progId: string): Promise<ExtendedBatch[]> {
    const all = await this.getBatches();
    return all.filter(b => b.program_id === progId);
  },

  async updateBatch(id: string, updates: Partial<ExtendedBatch>): Promise<ExtendedBatch | undefined> {
    try {
      const current = await batchApi.getBatch(id);
      const req: any = {
        program_id: current.program_id,
        batch_code: updates.code || current.batch_code,
        batch_name: updates.name || current.batch_name,
        max_capacity: updates.capacity || current.max_capacity,
        start_date: current.start_date,
        end_date: current.end_date,
        batch_status: updates.status || current.batch_status,
        internship_type: updates.internshipType || (updates as any).internship_type || (current as any).internship_type
      };
      
      const res = await batchApi.updateBatch(id, req);
      
      if (updates.mentor?.id) {
         try {
             await mentorApi.createBatchMapping({
                 mentorProfileId: updates.mentor.id,
                 batchId: id
             } as any);
         } catch(e) { console.error("Error mapping mentor to batch", e); }
      }
      
      return this.mapToExtended(res);
    } catch (e) {
      console.debug(e);
      return undefined;
    }
  },

  async createBatch(data: BatchCreate): Promise<ExtendedBatch> {
    const res = await batchApi.createBatch(data);
    return this.mapToExtended(res);
  },

  async deleteBatch(id: string): Promise<boolean> {
    try {
      await batchApi.deleteBatch(id);
      return true;
    } catch (e) {
      console.debug(e);
      return false;
    }
  },

  async bulkUpdateStatus(ids: string[], status: string): Promise<boolean> {
    return true;
  },

  async bulkAssignMentor(ids: string[], mentorId: string, mentorName: string): Promise<boolean> {
    return true;
  },

  async bulkUpdateCapacity(ids: string[], maxCapacity: number): Promise<boolean> {
    return true;
  },

  async bulkStudentAllocate(ids: string[], studentData: any): Promise<boolean> {
    return true;
  },

  mapToExtended(b: BatchResponse): ExtendedBatch {
    return {
      ...b,
      id: b.batch_id,
      code: b.batch_code,
      name: b.batch_name,
      capacity: b.max_capacity,
      status: b.batch_status as any,
      programId: b.program_id,
      programName: (b as any).program_name || 'Sample Program',
      internshipType: (b as any).internship_type || (b as any).internshipType ,
      startDate: b.start_date,
      endDate: b.end_date || new Date().toISOString().split('T')[0],
      completionRate: 0,
      students: [],
      mentor: {
        id: '', name: '', department: '', expertise: '', rating: 0, sessionsConducted: 0, studentSatisfaction: 0, successRate: 0, completionContribution: 0
      },
      projects: [],
      performance: {
        attendanceRate: 0,
        assessmentAverage: 0,
        placementConversion: 0,
        satisfactionScore: 0,
        attendanceTrend: [],
        assessmentTrend: [],
        performanceTrend: [],
        completionTrend: []
      },
      metadata: {
        type: '', category: '', domain: '', techStack: [], tags: [], priority: 'Medium', academicYear: ''
      },
      timeline: []
    } as any;
  }
};
