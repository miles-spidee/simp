import { Allocation, MOCK_ALLOCATIONS } from '../data/mock-allocations';

export const allocationService = {
  async getAllocations(): Promise<Allocation[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_ALLOCATIONS;
  },

  async getAllocation(id: string): Promise<Allocation | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_ALLOCATIONS.find(alloc => alloc.id === id);
  },

  async getAllocationsByBatch(batchId: string): Promise<Allocation[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_ALLOCATIONS.filter(alloc => alloc.batchId === batchId);
  }
};
