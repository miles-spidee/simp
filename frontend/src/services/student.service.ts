import { Student, MOCK_STUDENTS } from '../data/mock-students';

export const studentService = {
  async getStudents(): Promise<Student[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_STUDENTS;
  },

  async getStudent(id: string): Promise<Student | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_STUDENTS.find(stu => stu.id === id);
  }
};
