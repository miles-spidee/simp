export interface StudentDashboardData {
  fees: {
    total: number;
    balance: number;
  };
  kpiStats: {
    technical: number;
    delivery: number;
    communication: number;
  };
  announcements: Array<{
    date: string;
    title: string;
    content: string;
  }>;
  capstoneStatus: string;
  courses: Array<{
    title: string;
    progress: number;
  }>;
  agenda: Array<{
    id: string;
    task: string;
    time: string;
    completed: boolean;
  }>;
}