import { MOCK_TASKS, MOCK_TASK_ASSIGNEES } from '../data/mock-tasks';
import { Task, TaskAssignee } from '../types/api/task.types';

import { taskApi } from '../api/task.api';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    try {
      const data = await taskApi.getTasks();
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug('Failed to fetch tasks via API, returning mock:', e);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_TASKS;
  },

  async getTask(id: string): Promise<Task | undefined> {
    try {
      const data = await taskApi.getTask(id);
      if (data) return data;
    } catch (e) {
      console.debug(`Failed to fetch task ${id} via API, returning mock:`, e);
    }
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_TASKS.find(task => task.id === id);
  },

  async getTasksByBatch(batchId: string): Promise<Task[]> {
    try {
      const data = await taskApi.getTasksByBatch(batchId);
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug(`Failed to fetch tasks for batch ${batchId} via API, returning mock:`, e);
    }
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_TASKS.filter(task => task.batchId === batchId);
  },

  async getAssignees(taskId: string): Promise<TaskAssignee[]> {
    try {
      const data = await taskApi.getAssignees(taskId);
      if (data && data.length > 0) return data;
    } catch (e) {
      console.debug(`Failed to fetch assignees for task ${taskId} via API, returning mock:`, e);
    }
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_TASK_ASSIGNEES.filter(a => a.taskId === taskId);
  }
};
