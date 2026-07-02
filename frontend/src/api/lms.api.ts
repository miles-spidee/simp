import { apiClient } from './api.client';

export interface SubmodulePayload {
  title: string;
  type: 'Video' | 'PDF' | 'Reading' | 'Assignment' | 'Quiz' | 'External Link';
  url: string;
  minReadingTime?: number;
  videoDuration?: number;
}

export interface ModulePayload {
  title: string;
  description: string;
  submodules: SubmodulePayload[];
}

export interface CourseCreatePayload {
  title: string;
  program: string;
  description: string;
  thumbnail: string;
  modules: ModulePayload[];
}

export interface Submodule {
  id: string;
  title: string;
  type: 'Video' | 'PDF' | 'Reading' | 'Assignment' | 'Quiz' | 'External Link';
  url: string;
  minReadingTime?: number;
  videoDuration?: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  submodules: Submodule[];
}

export interface CourseItem {
  id: string;
  title: string;
  program: string;
  description: string;
  thumbnail: string;
  progressRate: number;
  studentsCompleted: number;
  modules: Module[];
}

export const lmsApi = {
  getCourses: async (): Promise<CourseItem[]> => {
    const res = await apiClient.get<CourseItem[]>('/api/v1/lms/courses');
    return res.data;
  },

  createCourse: async (payload: CourseCreatePayload): Promise<CourseItem> => {
    const res = await apiClient.post<CourseItem>('/api/v1/lms/courses', payload);
    return res.data;
  },

  updateCourse: async (courseId: string, payload: CourseCreatePayload): Promise<CourseItem> => {
    const res = await apiClient.put<CourseItem>(`/api/v1/lms/courses/${courseId}`, payload);
    return res.data;
  },

  deleteCourse: async (courseId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/lms/courses/${courseId}`);
  },
};

