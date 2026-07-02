import { lmsApi, CourseItem, CourseCreatePayload } from '../api/lms.api';

class LMSService {
  async getCourses(): Promise<CourseItem[]> {
    try {
      return await lmsApi.getCourses();
    } catch (error) {
      console.error('Failed to fetch LMS courses:', error);
      return [];
    }
  }

  async createCourse(payload: CourseCreatePayload): Promise<CourseItem | null> {
    try {
      return await lmsApi.createCourse(payload);
    } catch (error) {
      console.error('Failed to create course:', error);
      return null;
    }
  }

  async updateCourse(courseId: string, payload: CourseCreatePayload): Promise<CourseItem | null> {
    try {
      return await lmsApi.updateCourse(courseId, payload);
    } catch (error) {
      console.error('Failed to update course:', error);
      return null;
    }
  }

  async deleteCourse(courseId: string): Promise<boolean> {
    try {
      await lmsApi.deleteCourse(courseId);
      return true;
    } catch (error) {
      console.error('Failed to delete course:', error);
      return false;
    }
  }
}


export const lmsService = new LMSService();
