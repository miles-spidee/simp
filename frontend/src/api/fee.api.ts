import { FeeStructure } from '../types/fee.types';
import { MOCK_FEES } from '../data/mock-fees';

export const feeApi = {
  getFees: async (): Promise<FeeStructure[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_FEES]), 600));
  },
  getFeeById: async (id: string): Promise<FeeStructure> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const f = MOCK_FEES.find(x => x.id === id);
        if (f) resolve(f);
        else reject(new Error('Not found'));
      }, 600);
    });
  },
  createFee: async (data: Partial<FeeStructure>): Promise<FeeStructure> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const f = { id: `FEE-${Date.now()}`, ...data } as FeeStructure;
        resolve(f);
      }, 600);
    });
  },
  updateFee: async (id: string, data: Partial<FeeStructure>): Promise<FeeStructure> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const f = MOCK_FEES.find(x => x.id === id) || (data as FeeStructure);
        resolve({ ...f, ...data });
      }, 600);
    });
  },
  deleteFee: async (id: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => resolve(), 600));
  }
};
