export type EmailTemplateCategory = 'Registration' | 'Application Approved' | 'Application Rejected' | 'Interview Invitation' | 'Attendance Alert' | 'Assignment Reminder' | 'Assessment Reminder' | 'Certificate Generated' | 'Offer Letter' | 'Payment Reminder' | 'Leave Approval' | 'Placement Offer';
export type EmailStatus = 'Draft' | 'Active' | 'Archived';

export interface EmailTemplate {
  id: string;
  name: string;
  category: EmailTemplateCategory;
  subject: string;
  htmlBody: string;
  variables: string[];
  status: EmailStatus;
  createdBy: string;
  version: number;
  lastUpdated: string;
}

export interface EmailHistory {
  id: string;
  templateId: string;
  recipientEmail: string;
  sentAt: string;
  status: 'Delivered' | 'Bounced' | 'Opened' | 'Clicked';
}
