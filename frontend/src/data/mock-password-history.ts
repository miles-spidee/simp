export interface PasswordHistory {
  id: string;
  userId: string;
  hash: string; // Mock hash
  changedAt: string;
}

export const MOCK_PASSWORD_HISTORY: PasswordHistory[] = [];
