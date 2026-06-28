import { batchApi } from '../api/batch.api';
import { BatchCreate, BatchResponse, BatchStudentCreate } from '../types/api/batch.types';
import { Batch, MOCK_BATCHES } from '../data/mock-batches';

export type ExtendedBatch = BatchResponse & Batch;

export const batchService = {
  async getBatches(): Promise<ExtendedBatch[]> {
    try {
      const data = await batchApi.getBatches();
      if (data && data.length > 0) {
        return data.map(b => this.mapToExtended(b));
      }
    } catch (e) {
      console.warn('Backend API unavailable, falling back to mock batches.');
    }
    return MOCK_BATCHES as unknown as ExtendedBatch[];
  },

  async getBatch(id: string): Promise<ExtendedBatch | undefined> {
    try {
      const data = await batchApi.getBatch(id);
      return this.mapToExtended(data);
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
      const req: BatchCreate = {
        program_id: current.program_id,
        batch_code: updates.code || current.batch_code,
        batch_name: updates.name || current.batch_name,
        max_capacity: updates.capacity || current.max_capacity,
        start_date: current.start_date,
        end_date: current.end_date,
        batch_status: updates.status || current.batch_status
      };
      const res = await batchApi.updateBatch(id, req);
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
      programName: 'Sample Program',
      internshipType: 'Paid Internship',
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
