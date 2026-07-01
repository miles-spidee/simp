import { apiClient } from '../api/api.client';
import {} from '../types/tasks.types';
import { Task, TaskAssignee } from '../types/api/task.types';

import { taskApi } from '../api/task.api';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    try {
      const res = await apiClient.get('/api/v1/task');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },

  async getTask(id: string): Promise<Task | undefined> {
    try {
      const res = await apiClient.get('/api/v1/task');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  async getTasksByBatch(batchId: string): Promise<Task[]> {
    try {
      const res = await apiClient.get('/api/v1/task');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },

  async getAssignees(taskId: string): Promise<TaskAssignee[]> {
    try {
      const res = await apiClient.get('/api/v1/task');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }
};
