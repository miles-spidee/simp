import { ProductivityWorkspace } from '../types/productivity.types';
import { MOCK_PRODUCTIVITY } from '../data/mock-productivity';

const DELAY = 500;

export const ProductivityAPI = {
  getWorkspace: async (): Promise<ProductivityWorkspace> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_PRODUCTIVITY), DELAY);
    });
  }
};
