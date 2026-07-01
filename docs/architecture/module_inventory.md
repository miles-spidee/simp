# Module Inventory

## Activity Module
**Entities:**
- ActivityLog

## Alumni Module
**Entities:**
- CareerProgress
- AlumniProfile

## Analytics Module
**Entities:**
- AnalyticsDataPoint
- AnalyticsSummary
- AnalyticsDimension

## Announcement Module
**Enumerations / Types:**
- AnnouncementCategory: 'General' | 'Academic' | 'Internship' | 'Holiday' | 'Emergency' | 'Placement' | 'Finance' | 'System Update'
- AnnouncementStatus: 'Draft' | 'Published' | 'Archived'
- AnnouncementPriority: 'Normal' | 'High' | 'Urgent'
**Entities:**
- Announcement

## Application Module
**Enumerations / Types:**
- ApplicationProfileResponse: any
**Entities:**
- ApplicationPersonalInformation
- ApplicationAcademicInformation
- ApplicationProfessionalInformation
- ApplicationInternshipSpecificData
- ApplicationDocuments
- ApplicationMotivation
- ApplicationCreate
- ApplicationResponse
- ApplicationReviewRequest

## Assessment Module
**Enumerations / Types:**
- AssessmentType: 'MCQ' | 'Coding' | 'Project'
**Entities:**
- Assessment
- AssessmentSubmission

## Attendance Module
**Enumerations / Types:**
- AttendanceStatusType: 'PRESENT' | 'ABSENT' | 'LATE'
**Entities:**
- AttendanceSession
- AttendanceRecord
- AttendanceStatus

## Auth Module
**Entities:**
- RegisterRequest
- RegisterResponse
- LoginRequest
- LoginResponse
- CurrentUserResponse
- AuthActionResponse
- AssignRoleRequest
- AssignPermissionRequest
- ForgotPasswordRequest
- ForgotPasswordVerify
- ForgotPasswordReset

## Batch Module
**Entities:**
- BatchCreate
- BatchResponse
- BatchStudentCreate
- BatchStudentResponse

## Billing Module
**Enumerations / Types:**
- InvoiceStatus: 'Paid' | 'Unpaid' | 'Overdue' | 'Cancelled'
**Entities:**
- InvoiceItem
- Invoice
- Receipt

## Calendar Module
**Enumerations / Types:**
- EventType: 'Interview' | 'Meeting' | 'Assessment' | 'Assignment' | 'Training' | 'Holiday' | 'Leave' | 'Reminder' | 'Payment Due' | 'Certificate'
- EventStatus: 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled'
**Entities:**
- CalendarEvent

## Certificate Module
**Enumerations / Types:**
- CertificateStatus: 'Draft' | 'Pending Approval' | 'Approved' | 'Issued' | 'Revoked'
- CertificateType: 'Offer Letter' | 'Joining Letter' | 'Internship Letter' | 'Completion Certificate' | 'Recommendation Letter' | 'Experience Certificate' | 'Participation Certificate'
**Entities:**
- Certificate

## Communication Module
**Enumerations / Types:**
- MessageStatus: 'Sent' | 'Delivered' | 'Read' | 'Failed'
- MessagePriority: 'Normal' | 'High'
- ConversationType: 'One-to-One' | 'Group' | 'Broadcast'
**Entities:**
- Message
- Conversation

## Coordinator Module
**Entities:**
- Coordinator
- CollegeReport

## Degree Module
**Entities:**
- DegreeResponse
- DegreeCreate

## Document Module
**Enumerations / Types:**
- DocumentStatus: 'Draft' | 'Generated' | 'Sent' | 'Signed'
- DocumentType: 'Offer Letter' | 'Joining Letter' | 'Internship Letter' | 'Completion Certificate' | 'Recommendation Letter' | 'Evaluation Report' | 'Performance Report' | 'Attendance Report'
**Entities:**
- DocumentTemplate
- GeneratedDocument

## Email Module
**Enumerations / Types:**
- EmailTemplateCategory: 'Registration' | 'Application Approved' | 'Application Rejected' | 'Interview Invitation' | 'Attendance Alert' | 'Assignment Reminder' | 'Assessment Reminder' | 'Certificate Generated' | 'Offer Letter' | 'Payment Reminder' | 'Leave Approval' | 'Placement Offer'
- EmailStatus: 'Draft' | 'Active' | 'Archived'
**Entities:**
- EmailTemplate
- EmailHistory

## Employee Module
**Entities:**
- EmployeeCreate
- EmployeeResponse

## Escalation Module
**Entities:**
- EscalationRule
- EscalationLog

## Executive Module
**Entities:**
- ExecutiveMetric
- RiskIndicator

## Export Module
**Entities:**
- ExportJob
- ExportSchedule

## Fee Module
**Enumerations / Types:**
- FeeType: 'Registration' | 'Internship' | 'Training' | 'Exam' | 'Certificate' | 'Hostel' | 'Transport'
- FeeStatus: 'Active' | 'Inactive'
**Entities:**
- FeeStructure

## Feedback Module
**Enumerations / Types:**
- FeedbackType: 'StudentMentor' | 'StudentCourse' | 'StudentInfrastructure' | 'StudentExperience' | 'MentorStudent' | 'CollegeInternship'
- Feedback: StudentMentorFeedback | MentorStudentFeedback | CollegeFeedback
**Entities:**
- FeedbackBase
- FeedbackCreate

## Finance Module
**Entities:**
- FinanceMetrics

## Helpdesk Module
**Enumerations / Types:**
- TicketPriority: 'Low' | 'Medium' | 'High' | 'Critical'
- TicketStatus: 'Open' | 'Assigned' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed'
- TicketCategory: 'Technical Issue' | 'Attendance' | 'Assessment' | 'Payment' | 'Certificate' | 'Placement' | 'Login' | 'Bug Report' | 'Feature Request' | 'Infrastructure'
**Entities:**
- TicketComment
- Ticket
- KnowledgeBaseArticle

## Idcard Module
**Enumerations / Types:**
- IDCardStatus: 'Active' | 'Expired' | 'Suspended'
**Entities:**
- DigitalIDCard

## Insight Module
**Entities:**
- InsightForecast
- StudentRisk

## Kpi Module
**Entities:**
- KPIMetric

## Leave Module
**Entities:**
- LeaveRequest
- LeaveTimelineEvent

## Lms Module
**Enumerations / Types:**
- ResourceType: 'PDF' | 'Video' | 'PPT' | 'ZIP' | 'External Link'
**Entities:**
- LearningResource
- LearningModule

## Marketplace Module
**Enumerations / Types:**
- InternshipType: 'Full Time' | 'Part Time'
- InternshipLocationType: 'Hybrid' | 'Remote' | 'On-Site'
- InternshipCompensation: 'Paid' | 'Free'
**Entities:**
- MarketplaceOpportunity
- MarketplaceApplication

## Mentor Module
**Enumerations / Types:**
- MentorCreate: Omit<MentorProfile, 'mentor_profile_id' | 'created_at' | 'updated_at'>
- MentorUpdate: Partial<Pick<MentorProfile, 'mentor_bio' | 'mentor_expertise' | 'years_of_experience' | 'max_student_capacity' | 'is_available'>>
- MentorAssignmentCreate: Omit<MentorAssignment, 'id'>
- MentorBatchMappingCreate: Omit<MentorBatchMapping, 'id'>
**Entities:**
- MentorProfile
- MentorAssignment
- MentorBatchMapping

## Module Module
**Entities:**
- Module

## Notification Module
**Enumerations / Types:**
- NotificationChannel: 'Email' | 'SMS' | 'WhatsApp' | 'Push Notification' | 'In-App Notification'
- NotificationType: 'Registration' | 'Application' | 'Interview' | 'Attendance' | 'Assessment' | 'Assignment' | 'Payment' | 'Certificate' | 'Placement' | 'Leave' | 'Escalation' | 'Reminder' | 'Announcement'
- NotificationPriority: 'Low' | 'Medium' | 'High' | 'Critical'
- NotificationStatus: 'Draft' | 'Scheduled' | 'Sent' | 'Failed' | 'Delivered' | 'Read'
**Entities:**
- Notification

## Opportunity Module
**Entities:**
- OpeningCreate
- OpeningResponse
- OpeningMentorCreate
- OpeningMentorResponse

## Organization Module
**Entities:**
- CollegeCreate
- CollegeResponse
- DepartmentCreate
- DepartmentResponse
- CoordinatorCreate
- CoordinatorResponse

## Payment Module
**Enumerations / Types:**
- PaymentStatus: 'Pending' | 'Processing' | 'Success' | 'Failed' | 'Refunded' | 'Cancelled'
- PaymentMode: 'UPI' | 'Razorpay' | 'Cash' | 'Card' | 'Bank Transfer' | 'NEFT' | 'Wallet'
**Entities:**
- PaymentTransaction

## Performance Module
**Entities:**
- StudentPerformance
- BatchPerformance

## Placement Module
**Enumerations / Types:**
- PlacementStage: 'Eligible' | 'Applied' | 'Shortlisted' | 'Technical Round' | 'HR Round' | 'Selected' | 'Offer Released' | 'Joined' | 'Rejected'
**Entities:**
- Company
- PlacementRecord

## Productivity Module
**Entities:**
- Bookmark
- StickyNote
- PersonalTask
- ProductivityWorkspace

## Program Module
**Entities:**
- InternshipTypeCreate
- InternshipTypeResponse
- ProgramCreate
- ProgramResponse

## Referral Module
**Enumerations / Types:**
- ReferralStatus: 'Pending' | 'Joined' | 'Completed' | 'Rewarded' | 'Expired'
**Entities:**
- Referral
- ReferralCampaign

## Report Module
**Entities:**
- ReportRecord
- ReportTemplate

## Reporting Manager Module
**Entities:**
- ReportingManager
- ManagerAssignment
- ManagerEvaluation

## Role Module
**Enumerations / Types:**
- RoleCreate: Omit<Role, 'id' | 'modulesCount' | 'usersCount'>
- RoleUpdate: Partial<RoleCreate>
**Entities:**
- Role

## Selfservice Module
**Entities:**
- DocumentRequest
- UserProfile
- SelfServiceDashboard

## Student Module
**Entities:**
- StudentCreate
- StudentResponse
- StudentUpdate

## Submission Module
**Enumerations / Types:**
- SubmissionCreate: Omit<Submission, 'id' | 'status'>
- SubmissionUpdate: Partial<Submission>
**Entities:**
- Subtask
- Commit
- Submission

## Task Module
**Entities:**
- Task
- TaskAssignee

## Verification Module
**Enumerations / Types:**
- VerificationStatus: 'Valid' | 'Invalid' | 'Expired' | 'Revoked'
**Entities:**
- VerificationRequest
- VerificationResult

## Wallet Module
**Enumerations / Types:**
- WalletTransactionType: 'Credit' | 'Debit'
- WalletSource: 'Refund' | 'Incentive' | 'Scholarship' | 'Cashback' | 'Referral Reward' | 'Stipend' | 'Fee Payment'
- WalletStatus: 'Completed' | 'Pending' | 'Failed'
**Entities:**
- WalletTransaction
- WalletSummary

