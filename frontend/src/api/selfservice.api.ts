import { SelfServiceDashboard, UserProfile } from '../types/selfservice.types';
import { MOCK_SELF_SERVICE } from '../data/mock-self-service';

const DELAY = 500;

export const SelfServiceAPI = {
  getDashboard: async (): Promise<SelfServiceDashboard> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_SELF_SERVICE), DELAY);
    });
  },
  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        MOCK_SELF_SERVICE.profile = {
          ...MOCK_SELF_SERVICE.profile,
          ...profile
        };
        resolve(MOCK_SELF_SERVICE.profile);
      }, DELAY);
    });
  }
};
