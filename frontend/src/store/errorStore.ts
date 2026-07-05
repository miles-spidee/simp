import { create } from 'zustand';
import { ApiErrorData } from '../lib/errorUtils';

export interface SuccessData {
  message: string;
}

interface ErrorStore {
  isOpen: boolean;
  errorData: ApiErrorData | null;
  showError: (errorData: ApiErrorData) => void;
  hideError: () => void;

  isSuccessOpen: boolean;
  successData: SuccessData | null;
  showSuccess: (message: string) => void;
  hideSuccess: () => void;
}

export const useErrorStore = create<ErrorStore>((set) => ({
  isOpen: false,
  errorData: null,
  showError: (errorData) => set({ isOpen: true, errorData }),
  hideError: () => set({ isOpen: false }),

  isSuccessOpen: false,
  successData: null,
  showSuccess: (message) => {
    set({ isSuccessOpen: true, successData: { message } });
    setTimeout(() => {
      set({ isSuccessOpen: false });
    }, 4000);
  },
  hideSuccess: () => set({ isSuccessOpen: false }),
}));
