export interface Application {
  id: string;
  opportunityId: string;
  candidateName: string;
  email: string;
  phone: string;
  status: 'Pending' | 'Interview' | 'Accepted' | 'Rejected';
  appliedDate: string;
}

export const MOCK_APPLICATIONS: Application[] = [
  { id: 'app-1', opportunityId: 'opp-1', candidateName: 'John Doe', email: 'john@example.com', phone: '123-456-7890', status: 'Pending', appliedDate: '2023-10-16' },
  { id: 'app-2', opportunityId: 'opp-1', candidateName: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901', status: 'Interview', appliedDate: '2023-10-18' },
  { id: 'app-3', opportunityId: 'opp-2', candidateName: 'Alice Johnson', email: 'alice.j@example.com', phone: '345-678-9012', status: 'Accepted', appliedDate: '2023-10-19' },
  { id: 'app-4', opportunityId: 'opp-3', candidateName: 'Bob Williams', email: 'bob.w@example.com', phone: '456-789-0123', status: 'Rejected', appliedDate: '2023-11-05' },
];
