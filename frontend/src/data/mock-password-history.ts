export interface PasswordHistory {
  id: string;
  userId: string;
  hash: string; // Mock hash
  changedAt: string;
}

export const MOCK_PASSWORD_HISTORY: PasswordHistory[] = [
  {
    id: "ph-1",
    userId: "usr-1",
    hash: "argon2id$v=19$m=65536,t=3,p=4$somehash1",
    changedAt: "2023-11-01T10:00:00Z"
  },
  {
    id: "ph-2",
    userId: "usr-5",
    hash: "argon2id$v=19$m=65536,t=3,p=4$somehash2",
    changedAt: "2023-09-15T08:30:00Z"
  }
];
