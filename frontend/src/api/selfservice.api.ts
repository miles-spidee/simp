import { SelfServiceDashboard } from '../types/selfservice.types';
import { MOCK_SELF_SERVICE } from '../data/mock-self-service';

const DELAY = 500;

export const SelfServiceAPI = {
  getDashboard: async (): Promise<SelfServiceDashboard> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_SELF_SERVICE), DELAY);
    });
  }
};
