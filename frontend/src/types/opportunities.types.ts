export interface Opportunity {
  id: string;
  title: string;
  type: string;
  value: "free" | "paid" | "stipend" | "industrial" | "corporate" | "research";
  description: string;
  duration: string;
  mode: string;
  seats: string;
  eligibility: string;
  startDate: string;
  color: string;
  internshipType?: "free" | "paid" | "stipend" | "industrial" | "corporate" | "research";
  amountType?: string;
  amount?: string;
  
  // Enterprise properties
  programId?: string;
  status?: 'Open' | 'Closed' | 'Draft';
  postedDate?: string;
}