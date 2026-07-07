import { reportingManagerApi } from '../api/reportingManager.api';
import {
  ReportingManager,
  ManagerAssignment,
  ManagerEvaluation,
  RMBatch,
  RMStudent,
  RMMentor,
} from '../types/reporting-manager.types';

export const reportingManagerService = {
  // ── New real service methods ──────────────────────────────────────────────

  /** Return all batches the logged-in RM is allocated to by HR. */
  getMyBatches: async (): Promise<RMBatch[]> => {
    return reportingManagerApi.getMyBatches();
  },

  /** Return all students in a given batch. */
  getStudentsInBatch: async (batchId: string): Promise<RMStudent[]> => {
    return reportingManagerApi.getStudentsInBatch(batchId);
  },

  /** Return all mentors assigned to students in a given batch. */
  getMentorsInBatch: async (batchId: string): Promise<RMMentor[]> => {
    return reportingManagerApi.getMentorsInBatch(batchId);
  },

  // ── Legacy methods (kept for backward compat) ─────────────────────────────

  getDashboardKPIs: async (_managerId: string) => {
    return { totalInterns: 0, averagePerformance: 0, highRiskInterns: 0 };
  },

  getInternAssignments: async (_managerId: string): Promise<ManagerAssignment[]> => {
    return [];
  },

  getEvaluations: async (_managerId: string): Promise<ManagerEvaluation[]> => {
    return [];
  },
};
