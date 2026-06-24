import { Batch, MOCK_BATCHES, BatchStudent, BatchTimelineEvent } from '../data/mock-batches';

export const batchService = {
  async getBatches(): Promise<Batch[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...MOCK_BATCHES];
  },

  async getBatch(id: string): Promise<Batch | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_BATCHES.find(batch => batch.id === id);
  },

  async getBatchesByProgram(progId: string): Promise<Batch[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_BATCHES.filter(batch => batch.programId === progId);
  },

  async updateBatch(id: string, updates: Partial<Batch>): Promise<Batch | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const idx = MOCK_BATCHES.findIndex(b => b.id === id);
    if (idx !== -1) {
      MOCK_BATCHES[idx] = {
        ...MOCK_BATCHES[idx],
        ...updates,
        timeline: updates.timeline ? [...updates.timeline] : MOCK_BATCHES[idx].timeline
      };
      return MOCK_BATCHES[idx];
    }
    return undefined;
  },

  async createBatch(
    batchData: Omit<Batch, 'id' | 'timeline' | 'students' | 'projects' | 'performance' | 'code' | 'completionRate'> & { id?: string }
  ): Promise<Batch> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const id = batchData.id || `batch-${MOCK_BATCHES.length + 1}`;
    const code = `BTC-2026-0${MOCK_BATCHES.length + 1}`;
    
    const newBatch: Batch = {
      ...batchData,
      id,
      code,
      completionRate: 0,
      students: [],
      projects: [
        { name: 'Initial Integration Capstone', submissionRate: 0, evaluationStatus: 'Pending' }
      ],
      performance: {
        attendanceRate: 100,
        assessmentAverage: 100,
        placementConversion: 0,
        satisfactionScore: 5.0,
        attendanceTrend: [],
        assessmentTrend: [],
        performanceTrend: [],
        completionTrend: []
      },
      timeline: [
        {
          date: new Date().toISOString().split('T')[0],
          title: 'Batch Roster Created',
          description: `Direct registration profile created for "${batchData.name}" with Code ${code}.`,
          type: 'create'
        }
      ]
    };

    MOCK_BATCHES.push(newBatch);
    return newBatch;
  },

  async bulkUpdateStatus(ids: string[], status: Batch['status']): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    MOCK_BATCHES.forEach(batch => {
      if (ids.includes(batch.id)) {
        const oldStatus = batch.status;
        batch.status = status;
        batch.timeline.unshift({
          date: new Date().toISOString().split('T')[0],
          title: 'Status Transition',
          description: `Bulk updated cohort status from "${oldStatus}" to "${status}".`,
          type: 'info'
        });
      }
    });
    return true;
  },

  async bulkAssignMentor(ids: string[], mentorId: string, mentorName: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    MOCK_BATCHES.forEach(batch => {
      if (ids.includes(batch.id)) {
        batch.mentor = {
          id: mentorId,
          name: mentorName,
          department: 'Technical Coaching Operations',
          expertise: 'Domain Specific Coaching',
          rating: 5.0,
          sessionsConducted: 0,
          studentSatisfaction: 5.0,
          successRate: 100,
          completionContribution: 100
        };
        batch.timeline.unshift({
          date: new Date().toISOString().split('T')[0],
          title: 'Mentor Remapped',
          description: `Assigned lead cohort mentor "${mentorName}" via bulk operations.`,
          type: 'mentor'
        });
      }
    });
    return true;
  },

  async bulkUpdateCapacity(ids: string[], maxCapacity: number): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    MOCK_BATCHES.forEach(batch => {
      if (ids.includes(batch.id)) {
        const oldCapacity = batch.capacity;
        batch.capacity = maxCapacity;
        batch.timeline.unshift({
          date: new Date().toISOString().split('T')[0],
          title: 'Capacity Rescaled',
          description: `Adjusted maximum seats count from ${oldCapacity} to ${maxCapacity} via bulk operations.`,
          type: 'capacity'
        });
      }
    });
    return true;
  },

  async bulkStudentAllocate(ids: string[], studentData: any): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Allocate a student to multiple batches for testing
    MOCK_BATCHES.forEach(batch => {
      if (ids.includes(batch.id)) {
        const hasStudent = batch.students.some(s => s.id === studentData.id);
        if (!hasStudent) {
          batch.students.push({
            id: studentData.id,
            name: studentData.name,
            internId: studentData.internId || `INT-M-${Date.now()}`,
            college: studentData.college || 'Stanford University',
            department: studentData.department || 'CSE',
            performanceScore: studentData.performanceScore || 85,
            status: 'Active'
          });
          batch.timeline.unshift({
            date: new Date().toISOString().split('T')[0],
            title: 'Student Roster Allocated',
            description: `Allocated candidate ${studentData.name} to cohort batch roster.`,
            type: 'student'
          });
        }
      }
    });
    return true;
  }
};
