import { FeeStructure } from '../types/fee.types';
import { MOCK_FEES } from '../data/mock-fees';

export const feeApi = {
  getFees: async (): Promise<FeeStructure[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_FEES), 500));
  }
};
