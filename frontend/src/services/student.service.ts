import { studentApi } from '../api/student.api';
import { StudentCreate, StudentResponse, StudentUpdate } from '../types/api/student.types';
import { Student } from '../data/mock-students';

export type ExtendedStudent = StudentResponse & Student;

export const studentService = {
  mapToExtended(stu: StudentResponse): ExtendedStudent {
    return {
      ...stu,
      id: stu.student_id,
      userId: 'USR-000',
      internId: stu.intern_id || `INT-${stu.student_id.substring(0, 4)}`,
      enrollmentDate: stu.created_at || new Date().toISOString(),
      status: stu.student_status as any,
      
      personalInfo: {
        name: `Student ${stu.student_id.substring(0, 4)}`,
        email: 'student@example.com',
        phone: '',
        dob: '',
        gender: '',
        address: '',
        avatar: ''
      },

      academicInfo: {
        college: '',
        department: 'CSE',
        degree: '',
        year: 4,
        cgpa: 0,
        graduationYear: 2024
      },

      internshipInfo: {
        program: '',
        internshipType: 'Free Internship',
        batchName: '',
        mentorId: '',
        mentorName: '',
        joiningDate: stu.joined_at || '',
        expectedCompletion: stu.completed_at || ''
      },

      documents: [],
      credentials: {
        username: 'student@example.com',
        password: '',
        portalAccess: true,
        lmsAccess: false,
        assessmentAccess: false
      },
      batch: {
        id: '',
        name: 'Unassigned',
        startDate: '',
        status: 'Pending'
      },
      mentor: {
        id: '',
        name: 'Unassigned',
        department: '',
        expertise: '',
        sessionsConducted: 0,
        rating: 0,
        feedbackGiven: []
      },
      performance: {
        attendanceScore: 0,
        assessmentScore: 0,
        projectScore: 0,
        mentorRating: 0,
        overallPerformance: 0,
        attendanceTrend: [],
        assessmentTrend: [],
        skills: []
      },
      placement: {
        status: 'Eligible'
      },
      timeline: []
    } as any;
  },

  async getStudents(): Promise<ExtendedStudent[]> {
    try {
      const data = await studentApi.getStudents();
      return data.map(stu => this.mapToExtended(stu));
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getStudent(id: string): Promise<ExtendedStudent | undefined> {
    try {
      const stu = await studentApi.getStudent(id);
      return this.mapToExtended(stu);
    } catch (e) {
      console.error(e);
      return undefined;
    }
  },

  async updateStudent(id: string, updates: Partial<ExtendedStudent>): Promise<ExtendedStudent | undefined> {
    try {
      if (updates.status) {
        const res = await studentApi.updateStudent(id, { student_status: updates.status as any });
        return this.mapToExtended(res);
      }
      return undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  },

  async createStudent(data: StudentCreate): Promise<ExtendedStudent> {
    const res = await studentApi.createStudent(data);
    return this.mapToExtended(res);
  },

  async bulkUpdateStatus(ids: string[], status: string): Promise<boolean> {
    return true;
  },

  async bulkAssignBatch(ids: string[], batchName: string): Promise<boolean> {
    return true;
  },

  async bulkAssignMentor(ids: string[], mentorId: string, mentorName: string): Promise<boolean> {
    return true;
  },

  async bulkGenerateCredentials(ids: string[]): Promise<boolean> {
    return true;
  },

  async bulkGenerateCertificates(ids: string[]): Promise<boolean> {
    return true;
  }
};
