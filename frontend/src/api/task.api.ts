import { apiClient } from './api.client';
import { Task, TaskAssignee } from '../types/api/task.types';

export const taskApi = {
  getTasks: async (): Promise<Task[]> => {
    const res = await apiClient.get<Task[]>('/api/v1/tasks');
    return res.data;
  },

  getTask: async (id: string): Promise<Task> => {
    const res = await apiClient.get<Task>(`/api/v1/tasks/${id}`);
    return res.data;
  },

  getTasksByBatch: async (batchId: string): Promise<Task[]> => {
    const res = await apiClient.get<Task[]>(`/api/v1/batches/${batchId}/tasks`);
    return res.data;
  },

  getAssignees: async (taskId: string): Promise<TaskAssignee[]> => {
    const res = await apiClient.get<TaskAssignee[]>(`/api/v1/tasks/${taskId}/assignees`);
    return res.data;
  }
};
