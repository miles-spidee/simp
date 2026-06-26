import { EmailTemplate, EmailTemplateCategory, EmailStatus, EmailHistory } from '../types/email.types';

export const MOCK_EMAIL_TEMPLATES: EmailTemplate[] = Array.from({ length: 50 }).map((_, i) => {
  const categories: EmailTemplateCategory[] = ['Registration', 'Application Approved', 'Application Rejected', 'Interview Invitation', 'Attendance Alert', 'Assignment Reminder', 'Assessment Reminder', 'Certificate Generated', 'Offer Letter', 'Payment Reminder', 'Leave Approval', 'Placement Offer'];
  const statuses: EmailStatus[] = ['Draft', 'Active', 'Archived'];
  
  return {
    id: `tpl-${i + 1}`,
    name: `${categories[i % categories.length]} Template v${Math.floor(i / 10) + 1}`,
    category: categories[i % categories.length],
    subject: `Important Update Regarding Your ${categories[i % categories.length]}`,
    htmlBody: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Hello {{userName}},</h2>
        <p>This is an automated message regarding your {{category}}.</p>
        <p>Please log in to your dashboard to view more details.</p>
        <br/>
        <p>Regards,<br/>The Team</p>
      </div>
    `,
    variables: ['userName', 'category', 'date'],
    status: statuses[i % statuses.length],
    createdBy: 'System Admin',
    version: Math.floor(Math.random() * 5) + 1,
    lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString()
  };
});

export const MOCK_EMAIL_HISTORY: EmailHistory[] = Array.from({ length: 500 }).map((_, i) => ({
  id: `eml-hist-${i + 1}`,
  templateId: `tpl-${(i % 50) + 1}`,
  recipientEmail: `student${i % 100}@example.com`,
  sentAt: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(),
  status: ['Delivered', 'Bounced', 'Opened', 'Clicked'][i % 4] as 'Delivered' | 'Bounced' | 'Opened' | 'Clicked'
}));
