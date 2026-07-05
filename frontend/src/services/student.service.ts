import { studentApi } from '../api/student.api';
import { StudentCreate, StudentResponse, StudentUpdate } from '../types/api/student.types';
import { Student, MOCK_STUDENTS } from '../data/mock-students';

export type ExtendedStudent = StudentResponse & Student & {
  name?: string;
  email?: string;
  phone?: string;
  official_email?: string;
  designation?: string;
  has_account?: boolean;
  username?: string;
};

export const studentService = {
  mapToExtended(stu: any): ExtendedStudent {
    const personalInfo = stu.personal_info || {
      name: stu.name || `Student ${stu.student_id.substring(0, 4)}`,
      email: stu.email || 'student@example.com',
      phone: stu.phone || '',
      dob: stu.dob || '',
      gender: stu.gender || 'Male',
      address: stu.address || '',
      avatar: ''
    };

    const academicInfo = stu.academic_info || {
      college: '',
      department: stu.department || 'CSE',
      degree: 'B.Tech',
      year: stu.year || 4,
      cgpa: stu.cgpa || 8.0,
      graduationYear: stu.graduation_year || 2024
    };

    const internshipInfo = stu.internship_info || {
      program: stu.program || '',
      internshipType: stu.internship_type || 'Free Internship',
      batchName: stu.batch_name || '',
      mentorId: stu.mentor_id || '',
      mentorName: stu.mentor_name || '',
      joiningDate: stu.joined_at || '',
      expectedCompletion: stu.completed_at || ''
    };

    return {
      ...stu,
      id: stu.student_id,
      userId: stu.user_id || 'USR-000',
      internId: stu.intern_id || `INT-${stu.student_id.substring(0, 4)}`,
      enrollmentDate: stu.created_at || new Date().toISOString(),
      status: (stu.student_status || 'Applied') as any,
      name: personalInfo.name,
      email: personalInfo.email,
      phone: personalInfo.phone,
      official_email: personalInfo.email,
      designation: 'Student',

      personalInfo: {
        ...personalInfo,
        avatar: personalInfo.avatar || personalInfo.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
      },
      academicInfo,
      internshipInfo,

      documents: stu.documents || [],
      credentials: stu.credentials || {
        username: personalInfo.email,
        password: '',
        portalAccess: true,
        lmsAccess: true,
        assessmentAccess: true
      },
      batch: stu.batch || {
        id: stu.batch_id || '',
        name: internshipInfo.batchName || 'Unassigned',
        startDate: internshipInfo.joiningDate || '',
        status: 'Active'
      },
      mentor: stu.mentor || {
        id: internshipInfo.mentorId || '',
        name: internshipInfo.mentorName || 'Unassigned',
        department: 'CSE',
        expertise: 'Python',
        sessionsConducted: 5,
        rating: 4.8,
        feedbackGiven: []
      },
      performance: stu.performance || {
        attendanceScore: 90,
        assessmentScore: 82.5,
        projectScore: 85,
        mentorRating: 4.5,
        overallPerformance: 85.8,
        attendanceTrend: [],
        assessmentTrend: [],
        skills: [],
        pendingTasks: 0,
        lmsInactiveDays: 0
      },
      placement: stu.placement || {
        status: 'Eligible'
      },
      timeline: stu.timeline || []
    } as any;
  },

  async getStudents(): Promise<ExtendedStudent[]> {
    try {
      const data = await studentApi.getStudents();
      if (data && data.length > 0) {
        return data.map(stu => this.mapToExtended(stu));
      }
    } catch (e) {
      console.debug("Failed to load students from API, falling back to mock data:", e);
    }
    return MOCK_STUDENTS.map((stu: any) => ({
      ...stu,
      student_id: stu.id,
      student_status: stu.status,
      name: stu.personalInfo?.name || '',
      email: stu.personalInfo?.email || '',
      phone: stu.personalInfo?.phone || '',
      official_email: stu.personalInfo?.email || '',
      designation: 'Student'
    })) as ExtendedStudent[];
  },

  async getStudent(id: string): Promise<ExtendedStudent | undefined> {
    try {
      const stu = await studentApi.getStudent(id);
      return this.mapToExtended(stu);
    } catch (e) {
      console.debug(e);
      return undefined;
    }
  },

  async updateStudent(id: string, updates: Partial<ExtendedStudent>): Promise<ExtendedStudent | undefined> {
    try {
      const payload: StudentUpdate = {};
      if (updates.personalInfo) {
        payload.name = updates.personalInfo.name;
        payload.email = updates.personalInfo.email;
        payload.phone = updates.personalInfo.phone;
        payload.dob = updates.personalInfo.dob;
        payload.gender = updates.personalInfo.gender;
        payload.address = updates.personalInfo.address;
      }
      if (updates.academicInfo) {
        payload.department = updates.academicInfo.department;
        payload.cgpa = updates.academicInfo.cgpa;
        payload.year = updates.academicInfo.year;
        payload.graduation_year = updates.academicInfo.graduationYear;
      }
      if (updates.internshipInfo) {
        payload.batch_name = updates.internshipInfo.batchName;
        payload.mentor_id = updates.internshipInfo.mentorId;
        payload.internship_type = updates.internshipInfo.internshipType;
      }
      if (updates.status) {
        payload.status = updates.status;
        payload.student_status = updates.status;
      }

      const res = await studentApi.updateStudent(id, payload);
      return this.mapToExtended(res);
    } catch (e) {
      console.debug(e);
      return undefined;
    }
  },

  async createStudent(data: StudentCreate): Promise<ExtendedStudent> {
    const res = await studentApi.createStudent(data);
    return this.mapToExtended(res);
  },

  async deleteStudent(id: string): Promise<boolean> {
    try {
      await studentApi.deleteStudent(id);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async bulkUpdateStatus(ids: string[], status: string): Promise<boolean> {
    try {
      for (const id of ids) {
        await studentApi.updateStudent(id, { status, student_status: status });
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async bulkAssignBatch(ids: string[], batchName: string): Promise<boolean> {
    try {
      for (const id of ids) {
        await studentApi.updateStudent(id, { batch_name: batchName });
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async bulkAssignMentor(ids: string[], mentorId: string, mentorName: string): Promise<boolean> {
    try {
      for (const id of ids) {
        await studentApi.updateStudent(id, { mentor_id: mentorId });
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async bulkGenerateCredentials(ids: string[]): Promise<boolean> {
    return true;
  },

  async bulkGenerateCertificates(ids: string[]): Promise<boolean> {
    return true;
  }
};
