import { Student, MOCK_STUDENTS, StudentDocument, StudentTimelineEvent } from '../data/mock-students';

export const studentService = {
  async getStudents(): Promise<Student[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...MOCK_STUDENTS];
  },

  async getStudent(id: string): Promise<Student | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_STUDENTS.find(stu => stu.id === id);
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const idx = MOCK_STUDENTS.findIndex(s => s.id === id);
    if (idx !== -1) {
      MOCK_STUDENTS[idx] = {
        ...MOCK_STUDENTS[idx],
        ...updates,
        // Deep merge timeline if provided to prevent overwriting
        timeline: updates.timeline ? [...updates.timeline] : MOCK_STUDENTS[idx].timeline
      };
      return MOCK_STUDENTS[idx];
    }
    return undefined;
  },

  async createStudent(
    studentData: Omit<Student, 'id' | 'timeline' | 'documents' | 'credentials' | 'internId'> & { id?: string }
  ): Promise<Student> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const id = studentData.id || `stu-${MOCK_STUDENTS.length + 1}`;
    const internId = `INT-2026-0${MOCK_STUDENTS.length + 1}`;
    
    const newStudent: Student = {
      ...studentData,
      id,
      internId,
      documents: [
        { type: 'Resume', name: 'Resume_Uploaded.pdf', uploadDate: new Date().toISOString().split('T')[0], status: 'Pending', url: '#' },
        { type: 'College ID', name: 'Student_ID_Scan.png', uploadDate: new Date().toISOString().split('T')[0], status: 'Pending', url: '#' }
      ],
      credentials: {
        username: studentData.personalInfo.email.split('@')[0] || 'student',
        portalAccess: true,
        lmsAccess: true,
        assessmentAccess: true
      },
      timeline: [
        {
          date: new Date().toISOString().split('T')[0],
          title: 'Student Profile Created',
          description: `Direct registration profile created for ${studentData.personalInfo.name} with ID ${internId}.`,
          type: 'registration'
        }
      ]
    };

    MOCK_STUDENTS.push(newStudent);
    return newStudent;
  },

  async bulkUpdateStatus(ids: string[], status: Student['status']): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    MOCK_STUDENTS.forEach(stu => {
      if (ids.includes(stu.id)) {
        const oldStatus = stu.status;
        stu.status = status;
        stu.timeline.unshift({
          date: new Date().toISOString().split('T')[0],
          title: 'Status Transition',
          description: `Bulk updated status from ${oldStatus} to ${status}.`,
          type: 'info'
        });
      }
    });
    return true;
  },

  async bulkAssignBatch(ids: string[], batchName: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    MOCK_STUDENTS.forEach(stu => {
      if (ids.includes(stu.id)) {
        stu.batch = {
          ...stu.batch,
          name: batchName,
          status: 'Active'
        };
        stu.internshipInfo = {
          ...stu.internshipInfo,
          batchName: batchName
        };
        stu.timeline.unshift({
          date: new Date().toISOString().split('T')[0],
          title: 'Batch Assignment',
          description: `Assigned to batch "${batchName}" via bulk management.`,
          type: 'batch'
        });
      }
    });
    return true;
  },

  async bulkAssignMentor(ids: string[], mentorId: string, mentorName: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    MOCK_STUDENTS.forEach(stu => {
      if (ids.includes(stu.id)) {
        stu.mentor = {
          name: mentorName,
          department: 'Technical Operations',
          expertise: 'Engineering Mentorship',
          sessionsConducted: 0,
          rating: 5.0,
          feedbackGiven: []
        };
        stu.internshipInfo = {
          ...stu.internshipInfo,
          mentorId,
          mentorName
        };
        stu.timeline.unshift({
          date: new Date().toISOString().split('T')[0],
          title: 'Mentor Remapped',
          description: `Assigned to mentor ${mentorName} via bulk management.`,
          type: 'mentor'
        });
      }
    });
    return true;
  },

  async bulkGenerateCredentials(ids: string[]): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    MOCK_STUDENTS.forEach(stu => {
      if (ids.includes(stu.id)) {
        stu.credentials = {
          username: stu.personalInfo.email.split('@')[0] || stu.internId.toLowerCase(),
          portalAccess: true,
          lmsAccess: true,
          assessmentAccess: true
        };
        stu.timeline.unshift({
          date: new Date().toISOString().split('T')[0],
          title: 'Credentials Refreshed',
          description: 'Regenerated portal credentials and dispatched welcome email.',
          type: 'id_card'
        });
      }
    });
    return true;
  },

  async bulkGenerateCertificates(ids: string[]): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    MOCK_STUDENTS.forEach(stu => {
      if (ids.includes(stu.id)) {
        const hasCert = stu.documents.some(doc => doc.type === 'Completion Certificate');
        if (!hasCert) {
          stu.documents.push({
            type: 'Completion Certificate',
            name: `PineSphere_Certificate_${stu.internId}.pdf`,
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'Verified',
            verifiedBy: 'Academic Operations',
            url: '#'
          });
        }
        stu.status = 'Certified';
        stu.timeline.unshift({
          date: new Date().toISOString().split('T')[0],
          title: 'Certificate Generated',
          description: `PineSphere internship completion certificate generated for ${stu.internId}.`,
          type: 'cert'
        });
      }
    });
    return true;
  }
};
