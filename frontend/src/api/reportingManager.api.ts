import { apiClient } from './api.client';
import {
  ReportingManager,
  ManagerAssignment,
  ManagerEvaluation,
  RMBatch,
  RMStudent,
  RMMentor,
} from '../types/reporting-manager.types';

export const reportingManagerApi = {
  // ── New real endpoints ────────────────────────────────────────────────────

  /** Fetch all batches allocated to the currently logged-in RM by HR. */
  getMyBatches: async (): Promise<RMBatch[]> => {
    try {
      const res = await apiClient.get('/api/v1/reportingManager/my-batches');
      return res.data?.data || [];
    } catch {
      return [];
    }
  },

  /** Fetch all students enrolled in a specific batch. */
  getStudentsInBatch: async (batchId: string): Promise<RMStudent[]> => {
    try {
      const res = await apiClient.get(`/api/v1/reportingManager/batch/${batchId}/students`);
      return res.data?.data || [];
    } catch {
      return [];
    }
  },

  /** Fetch all mentors assigned to students in a specific batch. */
  getMentorsInBatch: async (batchId: string): Promise<RMMentor[]> => {
    try {
      const res = await apiClient.get(`/api/v1/reportingManager/batch/${batchId}/mentors`);
      return res.data?.data || [];
    } catch {
      return [];
    }
  },

  // ── Legacy stubs (kept for backward compat) ───────────────────────────────

  getManagers: async (): Promise<ReportingManager[]> => {
    try {
      const res = await apiClient.get('/api/v1/reportingManager');
      return res.data?.data || [];
    } catch {
      return [];
    }
  },

  getManagerById: async (id: string): Promise<ReportingManager | undefined> => {
    try {
      const res = await apiClient.get('/api/v1/reportingManager');
      return res.data?.data || null;
    } catch {
      return undefined;
    }
  },

  getAssignmentsByManager: async (managerId: string): Promise<ManagerAssignment[]> => {
    return [];
  },

  getEvaluationsByManager: async (managerId: string): Promise<ManagerEvaluation[]> => {
    return [];
  },
};
