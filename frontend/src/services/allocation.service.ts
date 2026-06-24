import { Allocation, MOCK_ALLOCATIONS } from '../data/mock-allocations';

export const allocationService = {
  async getAllocations(): Promise<Allocation[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...MOCK_ALLOCATIONS];
  },

  async getAllocation(id: string): Promise<Allocation | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_ALLOCATIONS.find(alloc => alloc.id === id);
  },

  async getAllocationsByBatch(batchId: string): Promise<Allocation[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_ALLOCATIONS.filter(alloc => alloc.batchId === batchId);
  },

  async updateAllocation(id: string, updates: Partial<Allocation>): Promise<Allocation | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const idx = MOCK_ALLOCATIONS.findIndex(a => a.id === id);
    if (idx !== -1) {
      MOCK_ALLOCATIONS[idx] = {
        ...MOCK_ALLOCATIONS[idx],
        ...updates,
        timeline: updates.timeline ? [...updates.timeline] : MOCK_ALLOCATIONS[idx].timeline
      };
      return MOCK_ALLOCATIONS[idx];
    }
    return undefined;
  },

  async createAllocation(
    allocData: Omit<Allocation, 'id' | 'timeline'> & { id?: string }
  ): Promise<Allocation> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const id = allocData.id || `alloc-${MOCK_ALLOCATIONS.length + 1}`;
    
    const newAlloc: Allocation = {
      ...allocData,
      id,
      timeline: [
        {
          date: new Date().toISOString().split('T')[0],
          title: 'Relationship Allocated',
          description: `Assigned candidate ${allocData.studentName} to program "${allocData.programName}".`,
          type: 'create'
        }
      ]
    };

    MOCK_ALLOCATIONS.push(newAlloc);
    return newAlloc;
  },

  async bulkUpdateStatus(ids: string[], status: Allocation['status']): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    MOCK_ALLOCATIONS.forEach(alloc => {
      if (ids.includes(alloc.id)) {
        const oldStatus = alloc.status;
        alloc.status = status;
        alloc.timeline.unshift({
          date: new Date().toISOString().split('T')[0],
          title: 'Status Updated',
          description: `Bulk updated status from "${oldStatus}" to "${status}".`,
          type: 'info'
        });
      }
    });
    return true;
  },

  async bulkReallocate(ids: string[], fields: Partial<Allocation>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    MOCK_ALLOCATIONS.forEach(alloc => {
      if (ids.includes(alloc.id)) {
        if (fields.programName) {
          alloc.programId = fields.programId || alloc.programId;
          alloc.programName = fields.programName;
          alloc.timeline.unshift({
            date: new Date().toISOString().split('T')[0],
            title: 'Program Re-allocated',
            description: `Transferred to program "${fields.programName}".`,
            type: 'program'
          });
        }
        if (fields.batchName) {
          alloc.batchId = fields.batchId || alloc.batchId;
          alloc.batchName = fields.batchName;
          alloc.timeline.unshift({
            date: new Date().toISOString().split('T')[0],
            title: 'Batch Re-assigned',
            description: `Transferred to batch "${fields.batchName}".`,
            type: 'batch'
          });
        }
        if (fields.mentorName) {
          alloc.mentorId = fields.mentorId || alloc.mentorId;
          alloc.mentorName = fields.mentorName;
          alloc.timeline.unshift({
            date: new Date().toISOString().split('T')[0],
            title: 'Mentor Remapped',
            description: `Lead coach updated to ${fields.mentorName}.`,
            type: 'mentor'
          });
        }
        if (fields.status) {
          alloc.status = fields.status;
        }
      }
    });
    return true;
  },

  async autoResolveConflicts(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 600));
    MOCK_ALLOCATIONS.forEach(alloc => {
      let resolved = false;
      const timelineEvents: any[] = [];

      // Conflict 1: Student without batch (empty batchId)
      if (!alloc.batchId || alloc.batchId === '') {
        alloc.batchId = 'batch-1';
        alloc.batchName = 'Alpha Cohort 2026';
        timelineEvents.push({
          date: new Date().toISOString().split('T')[0],
          title: 'Batch Auto-Allocated',
          description: 'Automatically assigned to "Alpha Cohort 2026" based on program mappings.',
          type: 'resolve'
        });
        resolved = true;
      }

      // Conflict 2: Student without mentor (empty mentorId)
      if (!alloc.mentorId || alloc.mentorId === '') {
        alloc.mentorId = 'emp-2';
        alloc.mentorName = 'Bob Johnson';
        timelineEvents.push({
          date: new Date().toISOString().split('T')[0],
          title: 'Mentor Auto-Assigned',
          description: 'Automatically mapped to lead coach Bob Johnson.',
          type: 'resolve'
        });
        resolved = true;
      }

      // Conflict 3: Waitlisted/Pending status update
      if (alloc.status === 'Pending' || alloc.status === 'Waitlisted') {
        alloc.status = 'Allocated';
        timelineEvents.push({
          date: new Date().toISOString().split('T')[0],
          title: 'Lifecycle Conflict Resolved',
          description: 'Verified allocation status updated to Allocated.',
          type: 'resolve'
        });
        resolved = true;
      }

      if (resolved) {
        alloc.timeline = [...timelineEvents, ...alloc.timeline];
      }
    });
    return true;
  }
};
