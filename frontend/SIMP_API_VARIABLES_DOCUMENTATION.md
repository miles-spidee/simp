# SIMP Frontend Backend Integration Audit

Generated from source on 2026-06-29T09:12:17.157Z.

## Executive Summary
- Routes scanned: 72
- API modules scanned: 51
- Service modules scanned: 59
- Files still importing mock data: 88
- Page files with direct mock imports: 21
- Service files with mock fallbacks: 29
- API files returning mock data: 29

## Production Blockers
- Shared API client force-cancels requests: No
- Authentication API contains hardcoded dev credentials/tokens: No
- Mock imports remain in codebase: Yes

## Global Mock Usage
- `app/feature/allocation/page.tsx`: @/src/data/mock-allocations, @/src/data/mock-students, @/src/data/mock-batches
- `app/feature/application/page.tsx`: @/src/data/mock-applications, @/src/data/mock-opportunities
- `app/feature/batch/page.tsx`: @/src/data/mock-batches
- `app/feature/employee/page.tsx`: @/src/data/mock-employees
- `app/feature/files/page.tsx`: @/src/data/mock-common-files
- `app/feature/lms/page.tsx`: @/src/data/mock-students
- `app/feature/lms-management/page.tsx`: @/src/data/mock-common-files
- `app/feature/mentor/profile/BatchMappingView.tsx`: @/src/data/mock-mentor-batch-mappings
- `app/feature/mentor/profile/page.tsx`: @/src/data/mock-mentors
- `app/feature/modules/page.tsx`: @/src/data/mock-modules
- `app/feature/opportunity/page.tsx`: @/src/data/mock-opportunities, @/src/data/mock-applications, @/src/data/mock-opening-mentors
- `app/feature/organization/page.tsx`: @/src/data/mock-organizations
- `app/feature/performance/page.tsx`: @/src/data/mock-performance
- `app/feature/program/page.tsx`: @/src/data/mock-programs, @/src/data/mock-organizations
- `app/feature/roles/page.tsx`: @/src/data/mock-roles
- `app/feature/security/page.tsx`: @/src/data/mock-user-sessions
- `app/feature/student/page.tsx`: @/src/data/mock-students
- `app/feature/submissions/page.tsx`: @/src/data/mock-submissions
- `app/feature/super-admin/page.tsx`: @/src/data/mock-super-admin
- `app/feature/users/page.tsx`: @/src/data/mock-users
- `app/page.tsx`: @/src/data/mock-opportunities
- `components/feature/announcement/CreateAnnouncementModal.tsx`: @/src/data/mock-users
- `components/feature/application/AddCandidateDrawer.tsx`: @/src/data/mock-opportunities
- `components/feature/application/ReviewApplicationDrawer.tsx`: @/src/data/mock-applications, @/src/data/mock-opportunities
- `components/feature/opportunity/CreateOpportunityWizard.tsx`: @/src/data/mock-opportunities
- `components/feature/roles/CreateRoleWizard.tsx`: @/src/data/mock-modules, @/src/data/mock-roles
- `components/feature/users/CreateUserWizard.tsx`: @/src/data/mock-roles, @/src/data/mock-modules, @/src/data/mock-users
- `src/api/activity.api.ts`: ../data/mock-activities
- `src/api/alumni.api.ts`: ../data/mock-alumni
- `src/api/analytics.api.ts`: ../data/mock-analytics
- `src/api/announcement.api.ts`: ../data/mock-announcements
- `src/api/billing.api.ts`: ../data/mock-invoices, ../data/mock-receipts
- `src/api/calendar.api.ts`: ../data/mock-events
- `src/api/certificate.api.ts`: ../data/mock-certificates
- `src/api/communication.api.ts`: ../data/mock-conversations
- `src/api/document.api.ts`: ../data/mock-documents
- `src/api/email.api.ts`: ../data/mock-email-templates
- `src/api/escalation.api.ts`: ../data/mock-escalations
- `src/api/executive.api.ts`: ../data/mock-executive
- `src/api/export.api.ts`: ../data/mock-exports
- `src/api/fee.api.ts`: ../data/mock-fees
- `src/api/helpdesk.api.ts`: ../data/mock-tickets
- `src/api/idcard.api.ts`: ../data/mock-idcards
- `src/api/insight.api.ts`: ../data/mock-insights
- `src/api/kpi.api.ts`: ../data/mock-kpis
- `src/api/marketplace.api.ts`: ../data/mock-marketplace
- `src/api/notification.api.ts`: ../data/mock-notifications
- `src/api/organization.api.ts`: ../data/mock-organizations
- `src/api/placement.api.ts`: ../data/mock-placement
- `src/api/productivity.api.ts`: ../data/mock-productivity
- `src/api/referral.api.ts`: ../data/mock-referrals
- `src/api/report.api.ts`: ../data/mock-reports
- `src/api/reportingManager.api.ts`: ../data/mock-reporting-managers, ../data/mock-manager-assignments, ../data/mock-manager-evaluations
- `src/api/selfservice.api.ts`: ../data/mock-self-service
- `src/api/verification.api.ts`: ../data/mock-verifications, ../data/mock-certificates
- `src/api/wallet.api.ts`: ../data/mock-wallet
- `src/context/PermissionContext.tsx`: ../data/mock-permissions
- `src/core/security/ScopeResolver.ts`: @/src/data/mock-users
- `src/data/mock-receipts.ts`: ./mock-invoices
- `src/services/allocation.service.ts`: ../data/mock-allocations
- `src/services/application.service.ts`: ../data/mock-applications
- `src/services/assessment.service.ts`: ../data/mock-assessments
- `src/services/attendance.service.ts`: ../data/mock-attendance
- `src/services/batch.service.ts`: ../data/mock-batches
- `src/services/coordinator.service.ts`: ../data/mock-coordinators
- `src/services/degree.service.ts`: ../data/mock-degrees
- `src/services/employee.service.ts`: ../data/mock-employees
- `src/services/feedback.service.ts`: ../data/mock-feedback
- `src/services/file.service.ts`: ../data/mock-common-files
- `src/services/leave.service.ts`: ../data/mock-leaves
- `src/services/lms.service.ts`: ../data/mock-learning-modules
- `src/services/mentor.service.ts`: ../data/mock-mentors, ../data/mock-mentor-assignments, ../data/mock-mentor-batch-mappings
- `src/services/module.service.ts`: ../data/mock-modules
- `src/services/opening-mentors.service.ts`: ../data/mock-opening-mentors
- `src/services/opportunities.service.ts`: ../data/mock-opportunities
- `src/services/organization.service.ts`: ../data/mock-organizations
- `src/services/payment.service.ts`: ../data/mock-payments
- `src/services/performance.service.ts`: ../data/mock-performance
- `src/services/permission.service.ts`: ../data/mock-permissions
- `src/services/program.service.ts`: ../data/mock-programs
- `src/services/role.service.ts`: ../data/mock-roles
- `src/services/session.service.ts`: ../data/mock-user-sessions
- `src/services/student.service.ts`: ../data/mock-students
- `src/services/studentDashboard.service.ts`: ../data/mock-student-dashboard
- `src/services/submission.service.ts`: ../data/mock-submissions
- `src/services/super-admin.service.ts`: ../data/mock-super-admin
- `src/services/task.service.ts`: ../data/mock-tasks
- `src/services/user.service.ts`: ../data/mock-users, ../data/mock-modules

## Table of Contents
1. [Activity Module](#activity-module)
2. [Alumni Module](#alumni-module)
3. [Analytics Module](#analytics-module)
4. [Announcement Module](#announcement-module)
5. [Application Module](#application-module)
6. [Assessment Module](#assessment-module)
7. [Attendance Module](#attendance-module)
8. [Auth Module](#auth-module)
9. [Batch Module](#batch-module)
10. [Billing Module](#billing-module)
11. [Calendar Module](#calendar-module)
12. [Certificate Module](#certificate-module)
13. [Communication Module](#communication-module)
14. [Coordinator Module](#coordinator-module)
15. [Degree Module](#degree-module)
16. [Document Module](#document-module)
17. [Email Module](#email-module)
18. [Employee Module](#employee-module)
19. [Escalation Module](#escalation-module)
20. [Executive Module](#executive-module)
21. [Export Module](#export-module)
22. [Fee Module](#fee-module)
23. [Feedback Module](#feedback-module)
24. [Finance Module](#finance-module)
25. [Helpdesk Module](#helpdesk-module)
26. [Idcard Module](#idcard-module)
27. [Insight Module](#insight-module)
28. [Kpi Module](#kpi-module)
29. [Leave Module](#leave-module)
30. [Lms Module](#lms-module)
31. [Marketplace Module](#marketplace-module)
32. [Mentor Module](#mentor-module)
33. [Module Module](#module-module)
34. [Notification Module](#notification-module)
35. [Opportunity Module](#opportunity-module)
36. [Organization Module](#organization-module)
37. [Payment Module](#payment-module)
38. [Performance Module](#performance-module)
39. [Placement Module](#placement-module)
40. [Productivity Module](#productivity-module)
41. [Program Module](#program-module)
42. [Referral Module](#referral-module)
43. [Report Module](#report-module)
44. [Reporting Manager Module](#reportingmanager-module)
45. [Role Module](#role-module)
46. [Selfservice Module](#selfservice-module)
47. [Student Module](#student-module)
48. [Submission Module](#submission-module)
49. [Task Module](#task-module)
50. [Verification Module](#verification-module)
51. [Wallet Module](#wallet-module)

---

## Activity Module

- API file: `src/api/activity.api.ts`
- Service file: `src/services/activity.service.ts`
- Type files: `src/types/activity.types.ts`
- API functions: `getAllActivities`, `getActivityById`, `getActivitiesByUser`
- Service localStorage keys: None
- Routes:
  - `/feature/activity` (app/feature/activity/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-activities

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/activity.types.ts`


#### Interface `ActivityLog`

- `id` (`string`): Unique identifier for this record.
- `userId` (`string`): References the related user record.
- `userName` (`string`): Stores the display name for user.
- `role` (`string`): Defines the assigned role or role label for access control.
- `module` (`'Login' | 'Attendance' | 'Task' | 'Assessment' | 'Assignment' | 'Leave' | 'Profile' | 'Certificate' | 'Payment'`): Maps the item to a product module or feature area.
- `action` (`string`): Used to store action for this module.
- `description` (`string`): Used to store description for this module.
- `timestamp` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `device` (`string`): Used to store device for this module.
- `browser` (`string`): Used to store browser for this module.
- `ip` (`string`): Used to store ip for this module.
- `status` (`'Success' | 'Failed' | 'Warning'`): Tracks the current lifecycle or processing state.
- `severity` (`'Info' | 'Low' | 'Medium' | 'High' | 'Critical'`): Used to store severity for this module.

---

## Alumni Module

- API file: `src/api/alumni.api.ts`
- Service file: `src/services/alumni.service.ts`
- Type files: `src/types/alumni.types.ts`
- API functions: `getAlumni`, `createAlumni`
- Service localStorage keys: None
- Routes:
  - `/feature/alumni` (app/feature/alumni/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-alumni

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/alumni.types.ts`


#### Interface `CareerProgress`

- `id` (`string`): Unique identifier for this record.
- `companyName` (`string`): Stores the display name for company.
- `designation` (`string`): Used to store designation for this module.
- `startDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `endDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `isCurrent` (`boolean`): Boolean flag used to control state, visibility, or validation.
- `location` (`string`): Used to store location for this module.

#### Interface `AlumniProfile`

- `id` (`string`): Unique identifier for this record.
- `studentId` (`string`): References the related student record.
- `name` (`string`): Stores the display name for name.
- `email` (`string`): Stores the email address used for communication or identification.
- `phone` (`string`): Stores the contact phone number.
- `program` (`string`): Used to store program for this module.
- `batch` (`string`): Used to store batch for this module.
- `graduationYear` (`number`): Used to store graduation year for this module.
- `currentCompany` (`string`): Used to store current company for this module.
- `currentDesignation` (`string`): Used to store current designation for this module.
- `linkedInUrl` (`string`): Used to store linked in url for this module.
- `careerHistory` (`CareerProgress[]`): Collection of career history values used to render lists or related records.
- `achievements` (`string[]`): Collection of achievements values used to render lists or related records.
- `isMentoring` (`boolean`): Boolean flag used to control state, visibility, or validation.
- `referralsProvided` (`number`): Used to store referrals provided for this module.
- `lastUpdated` (`string`): Stores the relevant date/time for sorting, auditing, or display.

---

## Analytics Module

- API file: `src/api/analytics.api.ts`
- Service file: `src/services/analytics.service.ts`
- Type files: `src/types/analytics.types.ts`
- API functions: `getSummary`, `getAttendanceTrend`, `getTopPrograms`
- Service localStorage keys: None
- Routes:
  - `/feature/analytics` (app/feature/analytics/page.tsx)
  - `/feature/finance-analytics` (app/feature/finance-analytics/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-analytics

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/analytics.types.ts`


#### Interface `AnalyticsDataPoint`

- `date` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `value` (`number`): Used to store value for this module.
- `category` (`string`): Used to store category for this module.

#### Interface `AnalyticsSummary`

- `totalStudents` (`number`): Stores an aggregated numeric total used in stats or summaries.
- `activeInterns` (`number`): Boolean flag used to control state, visibility, or validation.
- `completionRate` (`number`): Stores a calculated percentage or rate metric.
- `attendanceRate` (`number`): Stores a calculated percentage or rate metric.
- `averageScore` (`number`): Used to store average score for this module.
- `placementRate` (`number`): Stores a calculated percentage or rate metric.
- `revenue` (`number`): Used to store revenue for this module.
- `certificatesIssued` (`number`): Used to store certificates issued for this module.

#### Interface `AnalyticsDimension`

- `id` (`string`): Unique identifier for this record.
- `name` (`string`): Stores the display name for name.
- `value` (`number`): Used to store value for this module.
- `percentage` (`number`): Stores a calculated percentage or rate metric.

---

## Announcement Module

- API file: `src/api/announcement.api.ts`
- Service file: `src/services/announcement.service.ts`
- Type files: `src/types/announcement.types.ts`
- API functions: `getAnnouncements`, `createAnnouncement`
- Service localStorage keys: None
- Routes:
  - `/feature/announcements` (app/feature/announcements/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-announcements

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/announcement.types.ts`

- Type aliases:
  - `AnnouncementCategory`: `'General' | 'Academic' | 'Internship' | 'Holiday' | 'Emergency' | 'Placement' | 'Finance' | 'System Update'`
  - `AnnouncementStatus`: `'Draft' | 'Published' | 'Archived'`
  - `AnnouncementPriority`: `'Normal' | 'High' | 'Urgent'`

#### Interface `Announcement`

- `id` (`string`): Unique identifier for this record.
- `title` (`string`): Used to store title for this module.
- `description` (`string`): Used to store description for this module.
- `audience` (`string[]`): Collection of audience values used to render lists or related records.
- `category` (`AnnouncementCategory`): Used to store category for this module.
- `priority` (`AnnouncementPriority`): Used to store priority for this module.
- `attachments` (`string[]`): Collection of attachments values used to render lists or related records.
- `publishDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `expiryDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `status` (`AnnouncementStatus`): Tracks the current lifecycle or processing state.
- `pinned` (`boolean`): Used to store pinned for this module.
- `author` (`string`): Used to store author for this module.

---

## Application Module

- API file: `src/api/application.api.ts`
- Service file: `src/services/application.service.ts`
- Type files: `src/types/api/application.types.ts`
- API functions: `submitApplication`, `getApplication`, `getMyApplications`, `getAllApplications`, `reviewApplication`, `withdrawApplication`
- Service localStorage keys: None
- Routes:
  - `/feature/application` (app/feature/application/page.tsx)
  - `/feature/opportunity` (app/feature/opportunity/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-applications
  - Route /feature/application uses @/src/data/mock-applications
  - Route /feature/application uses @/src/data/mock-opportunities
  - Route /feature/opportunity uses @/src/data/mock-opportunities
  - Route /feature/opportunity uses @/src/data/mock-applications
  - Route /feature/opportunity uses @/src/data/mock-opening-mentors

### Endpoints

#### POST '/applications/', data
- Response type: `ApplicationResponse`
- Payload: `None`

#### GET `/applications/${id}`
- Response type: `ApplicationResponse`
- Payload: `None`

#### GET '/applications/me/list'
- Response type: `ApplicationResponse[]`
- Payload: `None`

#### GET '/applications/admin/all'
- Response type: `ApplicationResponse[]`
- Payload: `None`

#### PATCH `/applications/${id}/review`, data
- Response type: `ApplicationResponse`
- Payload: `None`

#### PATCH `/applications/${id}/withdraw`
- Response type: `ApplicationResponse`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/application.types.ts`

- Type aliases:
  - `ApplicationProfileResponse`: `any`

#### Interface `ApplicationPersonalInformation`

- `photo` (`string`): Used to store photo for this module.
- `firstName` (`string`): Stores the display name for first.
- `lastName` (`string`): Stores the display name for last.
- `email` (`string`): Stores the email address used for communication or identification.
- `mobileNumber` (`string`): Used to store mobile number for this module.
- `dateOfBirth` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `gender` (`string`): Used to store gender for this module.
- `city` (`string`): Used to store city for this module.
- `state` (`string`): Used to store state for this module.

#### Interface `ApplicationAcademicInformation`

- `collegeName` (`string`): Stores the display name for college.
- `department` (`string`): Used to store department for this module.
- `degree` (`string`): Used to store degree for this module.
- `currentYear` (`string`): Used to store current year for this module.
- `cgpaPercentage` (`string`): Stores a calculated percentage or rate metric.
- `graduationYear` (`string`): Used to store graduation year for this module.

#### Interface `ApplicationProfessionalInformation`

- `skills` (`string`): Used to store skills for this module.
- `githubUrl` (`string`): Used to store github url for this module.
- `linkedinUrl` (`string`): Used to store linkedin url for this module.
- `portfolioUrl` (`string`): Used to store portfolio url for this module.
- `projectExperience` (`string`): Used to store project experience for this module.

#### Interface `ApplicationInternshipSpecificData`

- `paymentMode` (`string`): Used to store payment mode for this module.
- `transactionId` (`string`): References the related transaction record.
- `relevantExperience` (`string`): Used to store relevant experience for this module.
- `preferredTechStack` (`string`): Used to store preferred tech stack for this module.
- `relevantTechnicalExperience` (`string`): Used to store relevant technical experience for this module.
- `researchAreaOfInterest` (`string`): Used to store research area of interest for this module.
- `researchInterestStatement` (`string`): Used to store research interest statement for this module.
- `publicationLinks` (`string`): Used to store publication links for this module.
- `paymentScreenshot` (`string`): Used to store payment screenshot for this module.

#### Interface `ApplicationDocuments`

- `resume` (`string`): Used to store resume for this module.
- `passbook` (`string`): Used to store passbook for this module.

#### Interface `ApplicationMotivation`

- `whyInternship` (`string`): Used to store why internship for this module.

#### Interface `ApplicationCreate`

- `internshipType` (`string`): Used to store internship type for this module.
- `personalInformation` (`ApplicationPersonalInformation`): Used to store personal information for this module.
- `academicInformation` (`ApplicationAcademicInformation`): Used to store academic information for this module.
- `professionalInformation` (`ApplicationProfessionalInformation`): Used to store professional information for this module.
- `internshipSpecificData` (`ApplicationInternshipSpecificData`): Used to store internship specific data for this module.
- `documents` (`ApplicationDocuments`): Used to store documents for this module.
- `motivation` (`ApplicationMotivation`): Used to store motivation for this module.

#### Interface `ApplicationResponse`

- `opening_id` (`string`): References the related opening record.
- `application_id` (`string`): References the related application record.
- `applicant_user_id` (`string`): References the related applicant_user record.
- `application_status` (`string`): Tracks the current lifecycle or processing state.
- `applied_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `reviewed_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `reviewed_by` (`string`): Used to store reviewed_by for this module.
- `remarks` (`string`): Used to store remarks for this module.
- `profile` (`ApplicationProfileResponse`): Used to store profile for this module.

#### Interface `ApplicationReviewRequest`

- `application_status` (`string`): Tracks the current lifecycle or processing state.
- `remarks` (`string`): Used to store remarks for this module.

---

## Assessment Module

- API file: `src/api/assessment.api.ts`
- Service file: `src/services/assessment.service.ts`
- Type files: `src/types/api/assessment.types.ts`
- API functions: `getAssessments`, `getAssessment`, `getSubmissions`, `getAssessmentsByBatch`
- Service localStorage keys: None
- Routes:
  - `/feature/assessment-management` (app/feature/assessment-management/page.tsx)
  - `/feature/assessment` (app/feature/assessment/page.tsx)
  - `/feature/my-assessments` (app/feature/my-assessments/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-assessments

### Endpoints

#### GET '/api/v1/assessments'
- Response type: `Assessment[]`
- Payload: `None`

#### GET `/api/v1/assessments/${id}`
- Response type: `Assessment`
- Payload: `None`

#### GET `/api/v1/assessments/${assessmentId}/submissions`
- Response type: `AssessmentSubmission[]`
- Payload: `None`

#### GET `/api/v1/batches/${batchId}/assessments`
- Response type: `Assessment[]`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/assessment.types.ts`

- Type aliases:
  - `AssessmentType`: `'MCQ' | 'Coding' | 'Project'`

#### Interface `Assessment`

- `id` (`string`): Unique identifier for this record.
- `title` (`string`): Used to store title for this module.
- `assessmentType` (`AssessmentType`): Used to store assessment type for this module.
- `batchId` (`string`): References the related batch record.
- `totalMarks` (`number`): Stores an aggregated numeric total used in stats or summaries.
- `passingMarks` (`number`): Used to store passing marks for this module.
- `date` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `status` (`'Upcoming' | 'Active' | 'Completed'`): Tracks the current lifecycle or processing state.
- `fileIds` (`string[]`): Collection of file ids values used to render lists or related records.

#### Interface `AssessmentSubmission`

- `id` (`string`): Unique identifier for this record.
- `assessmentId` (`string`): References the related assessment record.
- `studentId` (`string`): References the related student record.
- `score` (`number`): Used to store score for this module.
- `status` (`'Pending Grading' | 'Graded' | 'Missed'`): Tracks the current lifecycle or processing state.
- `submittedAt` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `fileIds` (`string[]`): Collection of file ids values used to render lists or related records.

---

## Attendance Module

- API file: `src/api/attendance.api.ts`
- Service file: `src/services/attendance.service.ts`
- Type files: `src/types/api/attendance.types.ts`
- API functions: `getSessions`, `getRecordsForSession`, `getStudentStatus`, `createSession`, `markAttendance`
- Service localStorage keys: None
- Routes:
  - `/feature/attendance-management` (app/feature/attendance-management/page.tsx)
  - `/feature/attendance` (app/feature/attendance/page.tsx)
  - `/feature/my-attendance` (app/feature/my-attendance/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-attendance

### Endpoints

#### GET '/api/v1/attendance/sessions'
- Response type: `AttendanceSession[]`
- Payload: `None`

#### GET `/api/v1/attendance/sessions/${sessionId}/records`
- Response type: `AttendanceRecord[]`
- Payload: `None`

#### GET `/api/v1/attendance/students/${studentId}/status`
- Response type: `AttendanceStatus`
- Payload: `None`

#### POST '/api/v1/attendance/sessions', data
- Response type: `AttendanceSession`
- Payload: `None`

#### POST `/api/v1/attendance/sessions/${sessionId}/mark`, { studentId, status }
- Response type: `Unknown`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/attendance.types.ts`

- Type aliases:
  - `AttendanceStatusType`: `'PRESENT' | 'ABSENT' | 'LATE'`

#### Interface `AttendanceSession`

- `id` (`string`): Unique identifier for this record.
- `batchId` (`string`): References the related batch record.
- `date` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `createdBy` (`string`): Used to store created by for this module.
- `status` (`'Open' | 'Closed'`): Tracks the current lifecycle or processing state.

#### Interface `AttendanceRecord`

- `id` (`string`): Unique identifier for this record.
- `sessionId` (`string`): References the related session record.
- `studentId` (`string`): References the related student record.
- `status` (`AttendanceStatusType`): Tracks the current lifecycle or processing state.
- `clockIn` (`string`): Used to store clock in for this module.
- `clockOut` (`string`): Used to store clock out for this module.

#### Interface `AttendanceStatus`

- `studentId` (`string`): References the related student record.
- `presentDays` (`number`): Used to store present days for this module.
- `absentDays` (`number`): Used to store absent days for this module.
- `lateDays` (`number`): Used to store late days for this module.
- `leaveDays` (`number`): Used to store leave days for this module.
- `averageAttendance` (`number`): Used to store average attendance for this module.
- `isCheckedIn` (`boolean`): Boolean flag used to control state, visibility, or validation.
- `clockInTime` (`string | null`): Stores the relevant date/time for sorting, auditing, or display.

---

## Auth Module

- API file: `src/api/auth.api.ts`
- Service file: `src/services/auth.service.ts`
- Type files: `src/types/api/auth.types.ts`
- API functions: `register`, `login`, `getCurrentUser`, `assignRole`, `assignPermission`, `requestPasswordReset`, `verifyResetOtp`, `resetPassword`
- Service localStorage keys: None
- Routes:
  - `/login` (app/login/page.tsx)
- Mock dependencies:
  - None detected in API/service/routes

### Endpoints

#### POST '/api/v1/auth/register', data
- Response type: `RegisterResponse`
- Payload: `None`

#### POST '/api/v1/auth/login', data
- Response type: `LoginResponse`
- Payload: `None`

#### GET '/api/v1/auth/me'
- Response type: `CurrentUserResponse`
- Payload: `None`

#### POST '/api/v1/auth/assign-role', data
- Response type: `Unknown`
- Payload: `None`

#### POST '/api/v1/auth/assign-permission', data
- Response type: `Unknown`
- Payload: `None`

#### POST '/api/v1/auth/forgot-password/request', data
- Response type: `AuthActionResponse`
- Payload: `None`

#### POST '/api/v1/auth/forgot-password/verify', data
- Response type: `AuthActionResponse`
- Payload: `None`

#### POST '/api/v1/auth/forgot-password/reset', data
- Response type: `AuthActionResponse`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/auth.types.ts`


#### Interface `RegisterRequest`

- `username` (`string`): Stores the display name for username.
- `email` (`string`): Stores the email address used for communication or identification.
- `password` (`string`): Used to store password for this module.

#### Interface `RegisterResponse`

- `user_id` (`string`): References the related user record.
- `username` (`string`): Stores the display name for username.
- `email` (`string`): Stores the email address used for communication or identification.
- `is_active` (`boolean`): Boolean flag used to control state, visibility, or validation.
- `is_email_verified` (`boolean`): Stores the email address used for communication or identification.
- `is_first_login` (`boolean`): Boolean flag used to control state, visibility, or validation.
- `last_login_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `created_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `updated_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `LoginRequest`

- `username` (`string`): Stores the display name for username.
- `password` (`string`): Used to store password for this module.

#### Interface `LoginResponse`

- `access_token` (`string`): Used to store access_token for this module.
- `refresh_token` (`string`): Used to store refresh_token for this module.
- `token_type` (`string`): Used to store token_type for this module.

#### Interface `CurrentUserResponse`

- `user_id` (`string`): References the related user record.
- `name` (`string`): Stores the display name for name.
- `email` (`string`): Stores the email address used for communication or identification.
- `roleName` (`string`): Stores the display name for role.
- `roleId` (`string`): References the related role record.
- `roleCode` (`string`): Defines the assigned role or role label for access control.
- `modules` (`Module[]`): Maps the item to a product module or feature area.
- `permissions` (`string[]`): Defines access rights available to the user or role.

#### Interface `AuthActionResponse`

- `message` (`string`): Stores the main content rendered or sent to the user.
- `success` (`boolean`): Used to store success for this module.

#### Interface `AssignRoleRequest`

- `user_id` (`string`): References the related user record.
- `role_id` (`string`): References the related role record.

#### Interface `AssignPermissionRequest`

- `role_id` (`string`): References the related role record.
- `permission_id` (`string`): References the related permission record.

#### Interface `ForgotPasswordRequest`

- `username` (`string`): Stores the display name for username.

#### Interface `ForgotPasswordVerify`

- `username` (`string`): Stores the display name for username.
- `otp` (`string`): Used to store otp for this module.

#### Interface `ForgotPasswordReset`

- `username` (`string`): Stores the display name for username.
- `otp` (`string`): Used to store otp for this module.
- `newPassword` (`string`): Used to store new password for this module.

---

## Batch Module

- API file: `src/api/batch.api.ts`
- Service file: `src/services/batch.service.ts`
- Type files: `src/types/api/batch.types.ts`
- API functions: `getBatches`, `createBatch`, `getBatch`, `updateBatch`, `deleteBatch`, `getBatchStudents`, `assignStudent`, `removeStudent`
- Service localStorage keys: None
- Routes:
  - `/feature/allocation` (app/feature/allocation/page.tsx)
  - `/feature/batch` (app/feature/batch/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-batches
  - Route /feature/allocation uses @/src/data/mock-allocations
  - Route /feature/allocation uses @/src/data/mock-students
  - Route /feature/allocation uses @/src/data/mock-batches
  - Route /feature/batch uses @/src/data/mock-batches

### Endpoints

#### GET '/api/v1/batches'
- Response type: `BatchResponse[]`
- Payload: `None`

#### POST '/api/v1/batches', data
- Response type: `BatchResponse`
- Payload: `None`

#### GET `/api/v1/batches/${id}`
- Response type: `BatchResponse`
- Payload: `None`

#### PUT `/api/v1/batches/${id}`, data
- Response type: `BatchResponse`
- Payload: `None`

#### DELETE `/api/v1/batches/${id}`
- Response type: `Unknown`
- Payload: `None`

#### GET '/api/v1/batch-students'
- Response type: `BatchStudentResponse[]`
- Payload: `None`

#### POST '/api/v1/batch-students', data
- Response type: `BatchStudentResponse`
- Payload: `None`

#### DELETE `/api/v1/batch-students/${batchStudentId}`
- Response type: `Unknown`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/batch.types.ts`


#### Interface `BatchCreate`

- `program_id` (`string`): References the related program record.
- `batch_code` (`string`): Used to store batch_code for this module.
- `batch_name` (`string`): Stores the display name for batch_name.
- `max_capacity` (`number`): Used to store max_capacity for this module.
- `start_date` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `end_date` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `batch_status` (`string`): Tracks the current lifecycle or processing state.

#### Interface `BatchResponse`

- `batch_id` (`string`): References the related batch record.
- `program_id` (`string`): References the related program record.
- `batch_code` (`string`): Used to store batch_code for this module.
- `batch_name` (`string`): Stores the display name for batch_name.
- `max_capacity` (`number`): Used to store max_capacity for this module.
- `start_date` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `end_date` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `batch_status` (`string`): Tracks the current lifecycle or processing state.
- `created_by` (`string`): Used to store created_by for this module.
- `created_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `updated_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `BatchStudentCreate`

- `student_id` (`string`): References the related student record.
- `assigned_by` (`string`): Used to store assigned_by for this module.

#### Interface `BatchStudentResponse`

- `batch_student_id` (`string`): References the related batch_student record.
- `batch_id` (`string`): References the related batch record.
- `student_id` (`string`): References the related student record.
- `assigned_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `assigned_by` (`string`): Used to store assigned_by for this module.

---

## Billing Module

- API file: `src/api/billing.api.ts`
- Service file: `src/services/billing.service.ts`
- Type files: `src/types/billing.types.ts`
- API functions: `getInvoices`, `getReceipts`
- Service localStorage keys: None
- Routes:
  - `/feature/billing` (app/feature/billing/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-invoices
  - API uses ../data/mock-receipts

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/billing.types.ts`

- Type aliases:
  - `InvoiceStatus`: `'Paid' | 'Unpaid' | 'Overdue' | 'Cancelled'`

#### Interface `InvoiceItem`

- `description` (`string`): Used to store description for this module.
- `amount` (`number`): Used to store amount for this module.

#### Interface `Invoice`

- `id` (`string`): Unique identifier for this record.
- `invoiceNumber` (`string`): Used to store invoice number for this module.
- `customerName` (`string`): Stores the display name for customer.
- `items` (`InvoiceItem[]`): Collection of items values used to render lists or related records.
- `subTotal` (`number`): Used to store sub total for this module.
- `taxAmount` (`number`): Used to store tax amount for this module.
- `discount` (`number`): Stores an aggregated numeric total used in stats or summaries.
- `grandTotal` (`number`): Used to store grand total for this module.
- `paymentStatus` (`InvoiceStatus`): Tracks the current lifecycle or processing state.
- `issueDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `dueDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `Receipt`

- `id` (`string`): Unique identifier for this record.
- `receiptNumber` (`string`): Used to store receipt number for this module.
- `invoiceNumber` (`string`): Used to store invoice number for this module.
- `customerName` (`string`): Stores the display name for customer.
- `amountPaid` (`number`): References the related amount p record.
- `paymentMethod` (`string`): Used to store payment method for this module.
- `paymentDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `transactionId` (`string`): References the related transaction record.

---

## Calendar Module

- API file: `src/api/calendar.api.ts`
- Service file: `src/services/calendar.service.ts`
- Type files: `src/types/calendar.types.ts`
- API functions: `getEvents`, `createEvent`
- Service localStorage keys: None
- Routes:
  - `/feature/calendar` (app/feature/calendar/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-events

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/calendar.types.ts`

- Type aliases:
  - `EventType`: `'Interview' | 'Meeting' | 'Assessment' | 'Assignment' | 'Training' | 'Holiday' | 'Leave' | 'Reminder' | 'Payment Due' | 'Certificate'`
  - `EventStatus`: `'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled'`

#### Interface `CalendarEvent`

- `id` (`string`): Unique identifier for this record.
- `title` (`string`): Used to store title for this module.
- `description` (`string`): Used to store description for this module.
- `type` (`EventType`): Used to store type for this module.
- `startTime` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `endTime` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `participants` (`string[]`): Collection of participants values used to render lists or related records.
- `location` (`string`): Used to store location for this module.
- `meetingLink` (`string`): Used to store meeting link for this module.
- `reminderMinutes` (`number`): Used to store reminder minutes for this module.
- `repeatRule` (`'None' | 'Daily' | 'Weekly' | 'Monthly'`): Used to store repeat rule for this module.
- `status` (`EventStatus`): Tracks the current lifecycle or processing state.

---

## Certificate Module

- API file: `src/api/certificate.api.ts`
- Service file: `src/services/certificate.service.ts`
- Type files: `src/types/certificate.types.ts`
- API functions: `getCertificates`, `getCertificateById`, `createCertificate`, `updateCertificateStatus`
- Service localStorage keys: None
- Routes:
  - `/feature/certificates` (app/feature/certificates/page.tsx)
  - `/feature/college-certificates` (app/feature/college-certificates/page.tsx)
  - `/feature/self-service` (app/feature/self-service/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-certificates

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/certificate.types.ts`

- Type aliases:
  - `CertificateStatus`: `'Draft' | 'Pending Approval' | 'Approved' | 'Issued' | 'Revoked'`
  - `CertificateType`: `'Offer Letter' | 'Joining Letter' | 'Internship Letter' | 'Completion Certificate' | 'Recommendation Letter' | 'Experience Certificate' | 'Participation Certificate'`

#### Interface `Certificate`

- `id` (`string`): Unique identifier for this record.
- `certificateNumber` (`string`): Used to store certificate number for this module.
- `studentId` (`string`): References the related student record.
- `studentName` (`string`): Stores the display name for student.
- `program` (`string`): Used to store program for this module.
- `batch` (`string`): Used to store batch for this module.
- `mentorName` (`string`): Stores the display name for mentor.
- `type` (`CertificateType`): Used to store type for this module.
- `issueDate` (`string | null`): Stores the relevant date/time for sorting, auditing, or display.
- `expiryDate` (`string | null`): Stores the relevant date/time for sorting, auditing, or display.
- `status` (`CertificateStatus`): Tracks the current lifecycle or processing state.
- `generatedBy` (`string`): Stores a calculated percentage or rate metric.
- `approvedBy` (`string`): Used to store approved by for this module.
- `qrCodeUrl` (`string`): Used to store qr code url for this module.
- `verificationUrl` (`string`): Used to store verification url for this module.
- `digitalSignatureId` (`string`): References the related digital signature record.
- `createdTime` (`string`): Stores the relevant date/time for sorting, auditing, or display.

---

## Communication Module

- API file: `src/api/communication.api.ts`
- Service file: `src/services/communication.service.ts`
- Type files: `src/types/communication.types.ts`
- API functions: `getConversations`, `getMessages`, `sendMessage`, `createConversation`
- Service localStorage keys: None
- Routes:
  - `/feature/communication` (app/feature/communication/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-conversations

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/communication.types.ts`

- Type aliases:
  - `MessageStatus`: `'Sent' | 'Delivered' | 'Read' | 'Failed'`
  - `MessagePriority`: `'Normal' | 'High'`
  - `ConversationType`: `'One-to-One' | 'Group' | 'Broadcast'`

#### Interface `Message`

- `id` (`string`): Unique identifier for this record.
- `conversationId` (`string`): References the related conversation record.
- `senderId` (`string`): References the related sender record.
- `senderName` (`string`): Stores the display name for sender.
- `content` (`string`): Stores the main content rendered or sent to the user.
- `attachments` (`string[]`): Collection of attachments values used to render lists or related records.
- `createdTime` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `readTime` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `status` (`MessageStatus`): Tracks the current lifecycle or processing state.
- `priority` (`MessagePriority`): Used to store priority for this module.

#### Interface `Conversation`

- `id` (`string`): Unique identifier for this record.
- `type` (`ConversationType`): Used to store type for this module.
- `name` (`string`): Stores the display name for name.
- `participants` (`{ id: string; name: string; role: string`): Used to store participants for this module.

---

## Coordinator Module

- API file: `src/api/coordinator.api.ts`
- Service file: `src/services/coordinator.service.ts`
- Type files: `src/types/api/coordinator.types.ts`
- API functions: `getCoordinators`, `getCoordinator`, `getReports`
- Service localStorage keys: None
- Routes:
  - `/feature/coordinator` (app/feature/coordinator/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-coordinators

### Endpoints

#### GET '/api/v1/coordinators'
- Response type: `Coordinator[]`
- Payload: `None`

#### GET `/api/v1/coordinators/${id}`
- Response type: `Coordinator`
- Payload: `None`

#### GET `/api/v1/coordinators/${coordinatorId}/reports`
- Response type: `CollegeReport[]`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/coordinator.types.ts`


#### Interface `Coordinator`

- `id` (`string`): Unique identifier for this record.
- `employeeId` (`string`): References the related employee record.
- `collegeId` (`string`): References the related college record.
- `name` (`string`): Stores the display name for name.
- `email` (`string`): Stores the email address used for communication or identification.
- `phone` (`string`): Stores the contact phone number.
- `assignedStudentsCount` (`number`): Stores an aggregated numeric total used in stats or summaries.
- `activeBatchesCount` (`number`): Stores an aggregated numeric total used in stats or summaries.
- `placementsCount` (`number`): Stores an aggregated numeric total used in stats or summaries.
- `status` (`'Active' | 'Inactive'`): Tracks the current lifecycle or processing state.

#### Interface `CollegeReport`

- `id` (`string`): Unique identifier for this record.
- `coordinatorId` (`string`): References the related coordinator record.
- `collegeId` (`string`): References the related college record.
- `month` (`string`): Used to store month for this module.
- `year` (`number`): Used to store year for this module.
- `fileId` (`string`): References the related file record.

---

## Degree Module

- API file: `src/api/degree.api.ts`
- Service file: `src/services/degree.service.ts`
- Type files: `src/types/api/degree.types.ts`
- API functions: `getDegrees`, `createDegree`
- Service localStorage keys: None
- Routes:
  - None mapped automatically
- Mock dependencies:
  - Service uses ../data/mock-degrees

### Endpoints

#### GET '/api/v1/degrees'
- Response type: `DegreeResponse[]`
- Payload: `None`

#### POST '/api/v1/degrees', data
- Response type: `DegreeResponse`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/degree.types.ts`


#### Interface `DegreeResponse`

- `degree_id` (`string`): References the related degree record.
- `degree_name` (`string`): Stores the display name for degree_name.
- `degree_code` (`string`): Used to store degree_code for this module.
- `duration_years` (`number`): Used to store duration_years for this module.
- `status` (`string`): Tracks the current lifecycle or processing state.

#### Interface `DegreeCreate`

- `degree_name` (`string`): Stores the display name for degree_name.
- `degree_code` (`string`): Used to store degree_code for this module.
- `duration_years` (`number`): Used to store duration_years for this module.

---

## Document Module

- API file: `src/api/document.api.ts`
- Service file: `src/services/document.service.ts`
- Type files: `src/types/document.types.ts`
- API functions: `getGeneratedDocuments`, `getTemplates`, `createGeneratedDocument`, `updateDocumentStatus`
- Service localStorage keys: None
- Routes:
  - `/feature/documents` (app/feature/documents/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-documents

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/document.types.ts`

- Type aliases:
  - `DocumentStatus`: `'Draft' | 'Generated' | 'Sent' | 'Signed'`
  - `DocumentType`: `'Offer Letter' | 'Joining Letter' | 'Internship Letter' | 'Completion Certificate' | 'Recommendation Letter' | 'Evaluation Report' | 'Performance Report' | 'Attendance Report'`

#### Interface `DocumentTemplate`

- `id` (`string`): Unique identifier for this record.
- `name` (`string`): Stores the display name for name.
- `type` (`DocumentType`): Used to store type for this module.
- `description` (`string`): Used to store description for this module.
- `version` (`string`): Tracks the revision number for change management.
- `variables` (`string[]`): Lists dynamic placeholders or values injected at runtime.
- `lastUpdated` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `GeneratedDocument`

- `id` (`string`): Unique identifier for this record.
- `templateId` (`string`): References the related template record.
- `studentId` (`string`): References the related student record.
- `studentName` (`string`): Stores the display name for student.
- `program` (`string`): Used to store program for this module.
- `type` (`DocumentType`): Used to store type for this module.
- `status` (`DocumentStatus`): Tracks the current lifecycle or processing state.
- `generatedDate` (`string`): Stores a calculated percentage or rate metric.
- `version` (`string`): Tracks the revision number for change management.
- `fileUrl` (`string`): Used to store file url for this module.
- `metadata` (`Record<string, string>`): Used to store metadata for this module.

---

## Email Module

- API file: `src/api/email.api.ts`
- Service file: `src/services/email.service.ts`
- Type files: `src/types/email.types.ts`
- API functions: `getTemplates`, `getHistory`, `saveTemplate`
- Service localStorage keys: None
- Routes:
  - `/feature/email` (app/feature/email/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-email-templates

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/email.types.ts`

- Type aliases:
  - `EmailTemplateCategory`: `'Registration' | 'Application Approved' | 'Application Rejected' | 'Interview Invitation' | 'Attendance Alert' | 'Assignment Reminder' | 'Assessment Reminder' | 'Certificate Generated' | 'Offer Letter' | 'Payment Reminder' | 'Leave Approval' | 'Placement Offer'`
  - `EmailStatus`: `'Draft' | 'Active' | 'Archived'`

#### Interface `EmailTemplate`

- `id` (`string`): Unique identifier for this record.
- `name` (`string`): Stores the display name for name.
- `category` (`EmailTemplateCategory`): Used to store category for this module.
- `subject` (`string`): Stores the subject line shown to the recipient.
- `htmlBody` (`string`): Stores the main content rendered or sent to the user.
- `variables` (`string[]`): Lists dynamic placeholders or values injected at runtime.
- `status` (`EmailStatus`): Tracks the current lifecycle or processing state.
- `createdBy` (`string`): Used to store created by for this module.
- `version` (`number`): Tracks the revision number for change management.
- `lastUpdated` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `EmailHistory`

- `id` (`string`): Unique identifier for this record.
- `templateId` (`string`): References the related template record.
- `recipientEmail` (`string`): Stores the email address used for communication or identification.
- `sentAt` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `status` (`'Delivered' | 'Bounced' | 'Opened' | 'Clicked'`): Tracks the current lifecycle or processing state.

---

## Employee Module

- API file: `src/api/employee.api.ts`
- Service file: `src/services/employee.service.ts`
- Type files: `src/types/api/employee.types.ts`
- API functions: `getEmployees`, `createEmployee`
- Service localStorage keys: None
- Routes:
  - `/feature/employee` (app/feature/employee/page.tsx)
  - `/feature/mentor/profile` (app/feature/mentor/profile/page.tsx)
  - `/feature/users` (app/feature/users/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-employees
  - Route /feature/employee uses @/src/data/mock-employees
  - Route /feature/mentor/profile uses @/src/data/mock-mentors
  - Route /feature/users uses @/src/data/mock-users

### Endpoints

#### GET '/employees'
- Response type: `EmployeeResponse[]`
- Payload: `None`

#### POST '/employees', data
- Response type: `EmployeeResponse`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/employee.types.ts`


#### Interface `EmployeeCreate`

- `user_id` (`string`): References the related user record.
- `employee_code` (`string`): Used to store employee_code for this module.
- `first_name` (`string`): Stores the display name for first_name.
- `last_name` (`string`): Stores the display name for last_name.
- `phone_number` (`string`): Stores the contact phone number.
- `official_email` (`string`): Stores the email address used for communication or identification.
- `joining_date` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `designation` (`string`): Used to store designation for this module.

#### Interface `EmployeeResponse`

- `employee_id` (`string`): References the related employee record.
- `employee_code` (`string`): Used to store employee_code for this module.
- `first_name` (`string`): Stores the display name for first_name.
- `last_name` (`string`): Stores the display name for last_name.
- `official_email` (`string`): Stores the email address used for communication or identification.
- `designation` (`string`): Used to store designation for this module.
- `status` (`string`): Tracks the current lifecycle or processing state.

---

## Escalation Module

- API file: `src/api/escalation.api.ts`
- Service file: `src/services/escalation.service.ts`
- Type files: `src/types/escalation.types.ts`
- API functions: `getRules`, `getEscalations`, `getEscalationById`, `updateEscalationStatus`
- Service localStorage keys: None
- Routes:
  - `/feature/escalation` (app/feature/escalation/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-escalations

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/escalation.types.ts`


#### Interface `EscalationRule`

- `id` (`string`): Unique identifier for this record.
- `type` (`'Attendance' | 'Assignments' | 'Leave' | 'Assessments' | 'Performance' | 'Payment' | 'Certificate Approval'`): Used to store type for this module.
- `condition` (`string`): Used to store condition for this module.
- `triggerDays` (`number`): Used to store trigger days for this module.
- `notifyRoles` (`string[]`): Defines the assigned role or role label for access control.
- `status` (`'Active' | 'Inactive'`): Tracks the current lifecycle or processing state.

#### Interface `EscalationLog`

- `id` (`string`): Unique identifier for this record.
- `ruleId` (`string`): References the related rule record.
- `targetId` (`string`): References the related target record.
- `targetName` (`string`): Stores the display name for target.
- `type` (`'Attendance' | 'Assignments' | 'Leave' | 'Assessments' | 'Performance' | 'Payment' | 'Certificate Approval'`): Used to store type for this module.
- `triggeredDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `status` (`'Pending' | 'Resolved' | 'Ignored'`): Tracks the current lifecycle or processing state.
- `notifiedUsers` (`{ userId: string; role: string; name: string`): Used to store notified users for this module.

---

## Executive Module

- API file: `src/api/executive.api.ts`
- Service file: `src/services/executive.service.ts`
- Type files: `src/types/executive.types.ts`
- API functions: `getMetrics`, `getRiskIndicators`
- Service localStorage keys: None
- Routes:
  - `/feature/executive` (app/feature/executive/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-executive

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/executive.types.ts`


#### Interface `ExecutiveMetric`

- `id` (`string`): Unique identifier for this record.
- `title` (`string`): Used to store title for this module.
- `value` (`string`): Used to store value for this module.
- `change` (`number`): Used to store change for this module.
- `changeType` (`'increase' | 'decrease' | 'neutral'`): Used to store change type for this module.
- `timeframe` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `RiskIndicator`

- `id` (`string`): Unique identifier for this record.
- `department` (`string`): Used to store department for this module.
- `riskLevel` (`'Low' | 'Medium' | 'High' | 'Critical'`): Used to store risk level for this module.
- `description` (`string`): Used to store description for this module.
- `mitigation` (`string`): Used to store mitigation for this module.

---

## Export Module

- API file: `src/api/export.api.ts`
- Service file: `src/services/export.service.ts`
- Type files: `src/types/export.types.ts`
- API functions: `getExportJobs`, `getExportSchedules`
- Service localStorage keys: None
- Routes:
  - `/feature/export` (app/feature/export/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-exports

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/export.types.ts`


#### Interface `ExportJob`

- `id` (`string`): Unique identifier for this record.
- `module` (`string`): Maps the item to a product module or feature area.
- `format` (`'PDF' | 'Excel' | 'CSV' | 'JSON'`): Stores the relevant date/time for sorting, auditing, or display.
- `requestedBy` (`string`): Used to store requested by for this module.
- `requestedAt` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `status` (`'Pending' | 'Processing' | 'Completed' | 'Failed'`): Tracks the current lifecycle or processing state.
- `fileUrl` (`string`): Used to store file url for this module.

#### Interface `ExportSchedule`

- `id` (`string`): Unique identifier for this record.
- `name` (`string`): Stores the display name for name.
- `module` (`string`): Maps the item to a product module or feature area.
- `frequency` (`'Daily' | 'Weekly' | 'Monthly'`): Used to store frequency for this module.
- `format` (`'PDF' | 'Excel' | 'CSV'`): Stores the relevant date/time for sorting, auditing, or display.
- `recipients` (`string[]`): Collection of recipients values used to render lists or related records.
- `nextRun` (`string`): Used to store next run for this module.

---

## Fee Module

- API file: `src/api/fee.api.ts`
- Service file: `src/services/fee.service.ts`
- Type files: `src/types/fee.types.ts`
- API functions: `getFees`
- Service localStorage keys: None
- Routes:
  - `/feature/fees` (app/feature/fees/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-fees

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/fee.types.ts`

- Type aliases:
  - `FeeType`: `'Registration' | 'Internship' | 'Training' | 'Exam' | 'Certificate' | 'Hostel' | 'Transport'`
  - `FeeStatus`: `'Active' | 'Inactive'`

#### Interface `FeeStructure`

- `id` (`string`): Unique identifier for this record.
- `feeName` (`string`): Stores the display name for fee.
- `feeType` (`FeeType`): Used to store fee type for this module.
- `amount` (`number`): Used to store amount for this module.
- `program` (`string`): Used to store program for this module.
- `department` (`string`): Used to store department for this module.
- `duration` (`string`): Used to store duration for this module.
- `applicableBatch` (`string`): Used to store applicable batch for this module.
- `installments` (`number`): Used to store installments for this module.
- `lateFee` (`number`): Used to store late fee for this module.
- `status` (`FeeStatus`): Tracks the current lifecycle or processing state.

---

## Feedback Module

- API file: `src/api/feedback.api.ts`
- Service file: `src/services/feedback.service.ts`
- Type files: `src/types/api/feedback.types.ts`
- API functions: `getFeedback`, `getFeedbackById`, `createFeedback`
- Service localStorage keys: None
- Routes:
  - None mapped automatically
- Mock dependencies:
  - Service uses ../data/mock-feedback

### Endpoints

#### GET '/api/v1/feedback'
- Response type: `Feedback[]`
- Payload: `None`

#### GET `/api/v1/feedback/${id}`
- Response type: `Feedback`
- Payload: `None`

#### POST '/api/v1/feedback', data
- Response type: `Feedback`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/feedback.types.ts`

- Type aliases:
  - `FeedbackType`: `'StudentMentor' | 'StudentCourse' | 'StudentInfrastructure' | 'StudentExperience' | 'MentorStudent' | 'CollegeInternship'`
  - `Feedback`: `StudentMentorFeedback | MentorStudentFeedback | CollegeFeedback`

#### Interface `FeedbackBase`

- `id` (`string`): Unique identifier for this record.
- `type` (`FeedbackType`): Used to store type for this module.
- `providerId` (`string`): References the related provider record.
- `providerRole` (`'Student' | 'Mentor' | 'College'`): Defines the assigned role or role label for access control.
- `targetId` (`string`): References the related target record.
- `date` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `rating` (`number`): Used to store rating for this module.
- `comments` (`string`): Used to store comments for this module.

#### Interface `FeedbackCreate`

- `type` (`FeedbackType`): Used to store type for this module.
- `targetId` (`string`): References the related target record.
- `rating` (`number`): Used to store rating for this module.
- `comments` (`string`): Used to store comments for this module.

---

## Finance Module

- API file: `src/api/finance.api.ts`
- Service file: `src/services/finance.service.ts`
- Type files: `src/types/finance.types.ts`
- API functions: `getDashboardMetrics`
- Service localStorage keys: None
- Routes:
  - `/feature/finance-analytics` (app/feature/finance-analytics/page.tsx)
  - `/feature/finance-dashboard` (app/feature/finance-dashboard/page.tsx)
- Mock dependencies:
  - None detected in API/service/routes

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/finance.types.ts`


#### Interface `FinanceMetrics`

- `todaysCollection` (`number`): Used to store todays collection for this module.
- `monthlyRevenue` (`number`): Used to store monthly revenue for this module.
- `pendingPayments` (`number`): Used to store pending payments for this module.
- `totalTransactions` (`number`): Stores an aggregated numeric total used in stats or summaries.
- `refundRequests` (`number`): Used to store refund requests for this module.
- `walletBalance` (`number`): Used to store wallet balance for this module.
- `revenueGrowth` (`number`): Used to store revenue growth for this module.

---

## Helpdesk Module

- API file: `src/api/helpdesk.api.ts`
- Service file: `src/services/helpdesk.service.ts`
- Type files: `src/types/helpdesk.types.ts`
- API functions: `getTickets`, `getTicketById`, `getKBArticles`, `createTicket`, `addComment`, `updateTicketStatus`
- Service localStorage keys: None
- Routes:
  - `/feature/helpdesk` (app/feature/helpdesk/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-tickets

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/helpdesk.types.ts`

- Type aliases:
  - `TicketPriority`: `'Low' | 'Medium' | 'High' | 'Critical'`
  - `TicketStatus`: `'Open' | 'Assigned' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed'`
  - `TicketCategory`: `'Technical Issue' | 'Attendance' | 'Assessment' | 'Payment' | 'Certificate' | 'Placement' | 'Login' | 'Bug Report' | 'Feature Request' | 'Infrastructure'`

#### Interface `TicketComment`

- `id` (`string`): Unique identifier for this record.
- `ticketId` (`string`): References the related ticket record.
- `authorId` (`string`): References the related author record.
- `authorName` (`string`): Stores the display name for author.
- `authorAvatar` (`string`): Used to store author avatar for this module.
- `content` (`string`): Stores the main content rendered or sent to the user.
- `timestamp` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `isInternal` (`boolean`): Boolean flag used to control state, visibility, or validation.

#### Interface `Ticket`

- `id` (`string`): Unique identifier for this record.
- `ticketNumber` (`string`): Used to store ticket number for this module.
- `title` (`string`): Used to store title for this module.
- `description` (`string`): Used to store description for this module.
- `category` (`TicketCategory`): Used to store category for this module.
- `priority` (`TicketPriority`): Used to store priority for this module.
- `status` (`TicketStatus`): Tracks the current lifecycle or processing state.
- `createdBy` (`string`): Used to store created by for this module.
- `creatorName` (`string`): Stores the display name for creator.
- `assignedTo` (`string`): Used to store assigned to for this module.
- `assigneeName` (`string`): Stores the display name for assignee.
- `department` (`string`): Used to store department for this module.
- `createdAt` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `updatedAt` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `resolvedAt` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `slaBreach` (`boolean`): Used to store sla breach for this module.
- `slaDueDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `comments` (`TicketComment[]`): Collection of comments values used to render lists or related records.

#### Interface `KnowledgeBaseArticle`

- `id` (`string`): Unique identifier for this record.
- `title` (`string`): Used to store title for this module.
- `category` (`string`): Used to store category for this module.
- `content` (`string`): Stores the main content rendered or sent to the user.
- `views` (`number`): Used to store views for this module.
- `helpfulCount` (`number`): Stores an aggregated numeric total used in stats or summaries.

---

## Idcard Module

- API file: `src/api/idcard.api.ts`
- Service file: `src/services/idcard.service.ts`
- Type files: `src/types/idcard.types.ts`
- API functions: `getIDCards`, `getMyIDCard`
- Service localStorage keys: None
- Routes:
  - `/feature/id-builder` (app/feature/id-builder/page.tsx)
  - `/feature/id-card` (app/feature/id-card/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-idcards

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/idcard.types.ts`

- Type aliases:
  - `IDCardStatus`: `'Active' | 'Expired' | 'Suspended'`

#### Interface `DigitalIDCard`

- `id` (`string`): Unique identifier for this record.
- `cardNumber` (`string`): Used to store card number for this module.
- `studentId` (`string`): References the related student record.
- `studentName` (`string`): Stores the display name for student.
- `department` (`string`): Used to store department for this module.
- `program` (`string`): Used to store program for this module.
- `batch` (`string`): Used to store batch for this module.
- `photoUrl` (`string`): Used to store photo url for this module.
- `qrCodeData` (`string`): Used to store qr code data for this module.
- `issueDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `expiryDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `status` (`IDCardStatus`): Tracks the current lifecycle or processing state.
- `bloodGroup` (`string`): Used to store blood group for this module.
- `emergencyContact` (`string`): Used to store emergency contact for this module.

---

## Insight Module

- API file: `src/api/insight.api.ts`
- Service file: `src/services/insight.service.ts`
- Type files: `src/types/insight.types.ts`
- API functions: `getForecasts`, `getStudentRisks`
- Service localStorage keys: None
- Routes:
  - `/feature/insights` (app/feature/insights/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-insights

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/insight.types.ts`


#### Interface `InsightForecast`

- `id` (`string`): Unique identifier for this record.
- `metric` (`string`): Used to store metric for this module.
- `historicalValues` (`number[]`): Collection of historical values values used to render lists or related records.
- `predictedValues` (`number[]`): Collection of predicted values values used to render lists or related records.
- `confidence` (`number`): Used to store confidence for this module.

#### Interface `StudentRisk`

- `studentId` (`string`): References the related student record.
- `name` (`string`): Stores the display name for name.
- `program` (`string`): Used to store program for this module.
- `riskScore` (`number`): Used to store risk score for this module.
- `factors` (`string[]`): Collection of factors values used to render lists or related records.

---

## Kpi Module

- API file: `src/api/kpi.api.ts`
- Service file: `src/services/kpi.service.ts`
- Type files: `src/types/kpi.types.ts`
- API functions: `getKPIs`, `createKPI`, `updateKPI`
- Service localStorage keys: None
- Routes:
  - `/feature/kpi` (app/feature/kpi/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-kpis

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/kpi.types.ts`


#### Interface `KPIMetric`

- `id` (`string`): Unique identifier for this record.
- `name` (`string`): Stores the display name for name.
- `category` (`string`): Used to store category for this module.
- `currentValue` (`number`): Used to store current value for this module.
- `targetValue` (`number`): Used to store target value for this module.
- `unit` (`string`): Used to store unit for this module.
- `trend` (`'up' | 'down' | 'flat'`): Used to store trend for this module.
- `trendPercentage` (`number`): Stores a calculated percentage or rate metric.
- `status` (`'on_track' | 'at_risk' | 'behind'`): Tracks the current lifecycle or processing state.
- `lastUpdated` (`string`): Stores the relevant date/time for sorting, auditing, or display.

---

## Leave Module

- API file: `src/api/leave.api.ts`
- Service file: `src/services/leave.service.ts`
- Type files: `src/types/leave.types.ts`
- API functions: `getAllLeaves`, `getLeaveById`, `getLeavesByUser`, `createLeave`
- Service localStorage keys: `pinesphere_local_leaves`
- Routes:
  - `/feature/leave` (app/feature/leave/page.tsx)
  - `/feature/my-attendance` (app/feature/my-attendance/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-leaves

### Endpoints

#### GET '/leaves'
- Response type: `LeaveRequest[]`
- Payload: `None`

#### GET `/leaves/${id}`
- Response type: `LeaveRequest`
- Payload: `None`

#### GET `/users/${userId}/leaves`
- Response type: `LeaveRequest[]`
- Payload: `None`

#### POST '/leaves', leave
- Response type: `LeaveRequest`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/leave.types.ts`


#### Interface `LeaveRequest`

- `id` (`string`): Unique identifier for this record.
- `userId` (`string`): References the related user record.
- `userName` (`string`): Stores the display name for user.
- `role` (`'Student' | 'Mentor' | 'Employee'`): Defines the assigned role or role label for access control.
- `leaveType` (`'Medical' | 'Casual' | 'Emergency' | 'OD' | 'WFH'`): Used to store leave type for this module.
- `startDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `endDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `reason` (`string`): Used to store reason for this module.
- `status` (`'Pending' | 'Approved' | 'Rejected'`): Tracks the current lifecycle or processing state.
- `supportingDocument` (`string`): Used to store supporting document for this module.
- `appliedOn` (`string`): Used to store applied on for this module.
- `approvedBy` (`string`): Used to store approved by for this module.
- `approvalRemarks` (`string`): Used to store approval remarks for this module.

#### Interface `LeaveTimelineEvent`

- `id` (`string`): Unique identifier for this record.
- `leaveId` (`string`): References the related leave record.
- `action` (`'Applied' | 'Reviewed' | 'Approved' | 'Rejected' | 'Escalated'`): Used to store action for this module.
- `actedBy` (`string`): Used to store acted by for this module.
- `actedOn` (`string`): Used to store acted on for this module.
- `remarks` (`string`): Used to store remarks for this module.

---

## Lms Module

- API file: `src/api/lms.api.ts`
- Service file: `src/services/lms.service.ts`
- Type files: `src/types/api/lms.types.ts`
- API functions: `getModules`, `getModule`, `getModulesForProgram`
- Service localStorage keys: None
- Routes:
  - `/feature/lms-management` (app/feature/lms-management/page.tsx)
  - `/feature/lms` (app/feature/lms/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-learning-modules
  - Route /feature/lms-management uses @/src/data/mock-common-files
  - Route /feature/lms uses @/src/data/mock-students

### Endpoints

#### GET '/api/v1/lms/modules'
- Response type: `LearningModule[]`
- Payload: `None`

#### GET `/api/v1/lms/modules/${id}`
- Response type: `LearningModule`
- Payload: `None`

#### GET `/api/v1/lms/programs/${programId}/modules`
- Response type: `LearningModule[]`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/lms.types.ts`

- Type aliases:
  - `ResourceType`: `'PDF' | 'Video' | 'PPT' | 'ZIP' | 'External Link'`

#### Interface `LearningResource`

- `id` (`string`): Unique identifier for this record.
- `moduleId` (`string`): References the related module record.
- `title` (`string`): Used to store title for this module.
- `resource_type` (`ResourceType`): Used to store resource_type for this module.
- `file_id` (`string`): References the related file record.
- `external_url` (`string`): Used to store external_url for this module.
- `duration` (`string`): Used to store duration for this module.
- `completed` (`boolean`): Used to store completed for this module.

#### Interface `LearningModule`

- `id` (`string`): Unique identifier for this record.
- `programId` (`string`): References the related program record.
- `title` (`string`): Used to store title for this module.
- `category` (`string`): Used to store category for this module.
- `image` (`string`): Used to store image for this module.
- `progress` (`number`): Used to store progress for this module.
- `resources` (`LearningResource[]`): Collection of resources values used to render lists or related records.

---

## Marketplace Module

- API file: `src/api/marketplace.api.ts`
- Service file: `src/services/marketplace.service.ts`
- Type files: `src/types/marketplace.types.ts`
- API functions: `getOpportunities`, `getApplications`
- Service localStorage keys: None
- Routes:
  - None mapped automatically
- Mock dependencies:
  - API uses ../data/mock-marketplace

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/marketplace.types.ts`

- Type aliases:
  - `InternshipType`: `'Full Time' | 'Part Time'`
  - `InternshipLocationType`: `'Hybrid' | 'Remote' | 'On-Site'`
  - `InternshipCompensation`: `'Paid' | 'Free'`

#### Interface `MarketplaceOpportunity`

- `id` (`string`): Unique identifier for this record.
- `title` (`string`): Used to store title for this module.
- `companyName` (`string`): Stores the display name for company.
- `department` (`string`): Used to store department for this module.
- `location` (`string`): Used to store location for this module.
- `locationType` (`InternshipLocationType`): Used to store location type for this module.
- `type` (`InternshipType`): Used to store type for this module.
- `compensation` (`InternshipCompensation`): Used to store compensation for this module.
- `stipend` (`string`): Used to store stipend for this module.
- `durationMonths` (`number`): Used to store duration months for this module.
- `skills` (`string[]`): Collection of skills values used to render lists or related records.
- `description` (`string`): Used to store description for this module.
- `requirements` (`string[]`): Collection of requirements values used to render lists or related records.
- `postedDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `deadlineDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `isActive` (`boolean`): Boolean flag used to control state, visibility, or validation.
- `applicantsCount` (`number`): Stores an aggregated numeric total used in stats or summaries.

#### Interface `MarketplaceApplication`

- `id` (`string`): Unique identifier for this record.
- `opportunityId` (`string`): References the related opportunity record.
- `studentId` (`string`): References the related student record.
- `status` (`'Pending' | 'Under Review' | 'Interview' | 'Offered' | 'Rejected'`): Tracks the current lifecycle or processing state.
- `appliedDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `matchScore` (`number`): Used to store match score for this module.

---

## Mentor Module

- API file: `src/api/mentor.api.ts`
- Service file: `src/services/mentor.service.ts`
- Type files: `src/types/api/mentor.types.ts`
- API functions: `getMentorProfiles`, `getMentorProfile`, `createMentorProfile`, `updateMentorProfile`, `getAssignments`, `createAssignment`, `getBatchMappings`, `createBatchMapping`
- Service localStorage keys: None
- Routes:
  - `/feature/mentor/profile` (app/feature/mentor/profile/page.tsx)
  - `/feature/opportunity` (app/feature/opportunity/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-mentors
  - Service uses ../data/mock-mentor-assignments
  - Service uses ../data/mock-mentor-batch-mappings
  - Route /feature/mentor/profile uses @/src/data/mock-mentors
  - Route /feature/opportunity uses @/src/data/mock-opportunities
  - Route /feature/opportunity uses @/src/data/mock-applications
  - Route /feature/opportunity uses @/src/data/mock-opening-mentors

### Endpoints

#### GET '/mentors/profiles'
- Response type: `MentorProfile[]`
- Payload: `None`

#### GET `/mentors/profiles/${id}`
- Response type: `MentorProfile`
- Payload: `None`

#### POST '/mentors/profiles', data
- Response type: `MentorProfile`
- Payload: `None`

#### PATCH `/mentors/profiles/${id}`, updates
- Response type: `MentorProfile`
- Payload: `None`

#### GET '/mentors/assignments'
- Response type: `MentorAssignment[]`
- Payload: `None`

#### POST '/mentors/assignments', data
- Response type: `MentorAssignment`
- Payload: `None`

#### GET '/mentors/batch-mappings'
- Response type: `MentorBatchMapping[]`
- Payload: `None`

#### POST '/mentors/batch-mappings', data
- Response type: `MentorBatchMapping`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/mentor.types.ts`

- Type aliases:
  - `MentorCreate`: `Omit<MentorProfile, 'mentor_profile_id' | 'created_at' | 'updated_at'>`
  - `MentorUpdate`: `Partial<Pick<MentorProfile, 'mentor_bio' | 'mentor_expertise' | 'years_of_experience' | 'max_student_capacity' | 'is_available'>>`
  - `MentorAssignmentCreate`: `Omit<MentorAssignment, 'id'>`
  - `MentorBatchMappingCreate`: `Omit<MentorBatchMapping, 'id'>`

#### Interface `MentorProfile`

- `mentor_profile_id` (`string`): References the related mentor_profile record.
- `employee_id` (`string`): References the related employee record.
- `employeeName` (`string`): Stores the display name for employee.
- `mentor_bio` (`string`): Used to store mentor_bio for this module.
- `mentor_expertise` (`string[]`): Collection of mentor_expertise values used to render lists or related records.
- `years_of_experience` (`number`): Used to store years_of_experience for this module.
- `max_student_capacity` (`number`): Used to store max_student_capacity for this module.
- `current_student_count` (`number`): Stores an aggregated numeric total used in stats or summaries.
- `is_available` (`boolean`): Boolean flag used to control state, visibility, or validation.
- `created_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `updated_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `MentorAssignment`

- `id` (`string`): Unique identifier for this record.
- `mentorProfileId` (`string`): References the related mentor profile record.
- `mentorName` (`string`): Stores the display name for mentor.
- `employeeId` (`string`): References the related employee record.
- `studentId` (`string`): References the related student record.
- `studentName` (`string`): Stores the display name for student.
- `internId` (`string`): References the related intern record.
- `batchId` (`string`): References the related batch record.
- `batchName` (`string`): Stores the display name for batch.
- `assignedDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `status` (`'Active' | 'Completed' | 'Transferred'`): Tracks the current lifecycle or processing state.
- `assignedBy` (`string`): Used to store assigned by for this module.

#### Interface `MentorBatchMapping`

- `id` (`string`): Unique identifier for this record.
- `mentorProfileId` (`string`): References the related mentor profile record.
- `mentorName` (`string`): Stores the display name for mentor.
- `employeeId` (`string`): References the related employee record.
- `batchId` (`string`): References the related batch record.
- `batchName` (`string`): Stores the display name for batch.
- `batchCode` (`string`): Used to store batch code for this module.
- `programName` (`string`): Stores the display name for program.
- `studentCount` (`number`): Stores an aggregated numeric total used in stats or summaries.
- `batchCapacity` (`number`): Used to store batch capacity for this module.
- `mappedDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `status` (`'Active' | 'Completed' | 'Upcoming'`): Tracks the current lifecycle or processing state.
- `mappedBy` (`string`): Used to store mapped by for this module.

---

## Module Module

- API file: `src/api/module.api.ts`
- Service file: `src/services/module.service.ts`
- Type files: `src/types/api/module.types.ts`
- API functions: `getModules`, `getModule`, `createModule`, `updateModule`
- Service localStorage keys: None
- Routes:
  - `/feature/modules` (app/feature/modules/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-modules
  - Route /feature/modules uses @/src/data/mock-modules

### Endpoints

#### GET '/api/v1/modules'
- Response type: `Module[]`
- Payload: `None`

#### GET `/api/v1/modules/${id}`
- Response type: `Module`
- Payload: `None`

#### POST '/api/v1/modules', data
- Response type: `Module`
- Payload: `None`

#### PUT `/api/v1/modules/${id}`, updates
- Response type: `Module`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/module.types.ts`


#### Interface `Module`

- `id` (`string`): Unique identifier for this record.
- `code` (`string`): Used to store code for this module.
- `name` (`string`): Stores the display name for name.
- `route` (`string`): Defines the navigation target or URL path.
- `active` (`boolean`): Boolean flag used to control state, visibility, or validation.
- `desc` (`string`): Used to store desc for this module.

---

## Notification Module

- API file: `src/api/notification.api.ts`
- Service file: `src/services/notification.service.ts`
- Type files: `src/types/notification.types.ts`
- API functions: `getNotifications`, `getNotificationById`, `markAsRead`, `createNotification`
- Service localStorage keys: None
- Routes:
  - `/feature/notifications` (app/feature/notifications/page.tsx)
  - `/feature/self-service` (app/feature/self-service/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-notifications

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/notification.types.ts`

- Type aliases:
  - `NotificationChannel`: `'Email' | 'SMS' | 'WhatsApp' | 'Push Notification' | 'In-App Notification'`
  - `NotificationType`: `'Registration' | 'Application' | 'Interview' | 'Attendance' | 'Assessment' | 'Assignment' | 'Payment' | 'Certificate' | 'Placement' | 'Leave' | 'Escalation' | 'Reminder' | 'Announcement'`
  - `NotificationPriority`: `'Low' | 'Medium' | 'High' | 'Critical'`
  - `NotificationStatus`: `'Draft' | 'Scheduled' | 'Sent' | 'Failed' | 'Delivered' | 'Read'`

#### Interface `Notification`

- `id` (`string`): Unique identifier for this record.
- `title` (`string`): Used to store title for this module.
- `message` (`string`): Stores the main content rendered or sent to the user.
- `recipient` (`string`): Used to store recipient for this module.
- `role` (`string`): Defines the assigned role or role label for access control.
- `module` (`string`): Maps the item to a product module or feature area.
- `channel` (`NotificationChannel`): Used to store channel for this module.
- `priority` (`NotificationPriority`): Used to store priority for this module.
- `status` (`NotificationStatus`): Tracks the current lifecycle or processing state.
- `scheduledTime` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `deliveredTime` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `readStatus` (`boolean`): Tracks the current lifecycle or processing state.
- `retryCount` (`number`): Stores an aggregated numeric total used in stats or summaries.
- `createdTime` (`string`): Stores the relevant date/time for sorting, auditing, or display.

---

## Opportunity Module

- API file: `src/api/opportunity.api.ts`
- Service file: `Not found`
- Type files: `src/types/api/opportunity.types.ts`
- API functions: `getOpenings`, `createOpening`, `getOpening`, `updateOpening`, `deleteOpening`, `getOpeningMentors`, `assignMentor`, `removeMentor`
- Service localStorage keys: None
- Routes:
  - `/feature/opportunity` (app/feature/opportunity/page.tsx)
- Mock dependencies:
  - Route /feature/opportunity uses @/src/data/mock-opportunities
  - Route /feature/opportunity uses @/src/data/mock-applications
  - Route /feature/opportunity uses @/src/data/mock-opening-mentors

### Endpoints

#### GET '/openings'
- Response type: `OpeningResponse[]`
- Payload: `None`

#### POST '/openings', data
- Response type: `OpeningResponse`
- Payload: `None`

#### GET `/openings/${id}`
- Response type: `OpeningResponse`
- Payload: `None`

#### PUT `/openings/${id}`, data
- Response type: `OpeningResponse`
- Payload: `None`

#### DELETE `/openings/${id}`
- Response type: `Unknown`
- Payload: `None`

#### GET `/openings/${openingId}/mentors`
- Response type: `OpeningMentorResponse[]`
- Payload: `None`

#### POST `/openings/${openingId}/mentors`, data
- Response type: `OpeningMentorResponse`
- Payload: `None`

#### DELETE `/openings/${openingId}/mentors/${employeeId}`
- Response type: `Unknown`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/opportunity.types.ts`


#### Interface `OpeningCreate`

- `program_id` (`string`): References the related program record.
- `role_name` (`string`): Stores the display name for role_name.
- `role_description` (`string`): Defines the assigned role or role label for access control.
- `project_title` (`string`): Used to store project_title for this module.
- `duration_weeks` (`number`): Used to store duration_weeks for this module.
- `stipend_amount` (`number`): Used to store stipend_amount for this module.
- `fee_amount` (`number`): Used to store fee_amount for this module.
- `total_openings` (`number`): Stores an aggregated numeric total used in stats or summaries.
- `application_deadline` (`string`): Used to store application_deadline for this module.
- `status` (`string`): Tracks the current lifecycle or processing state.

#### Interface `OpeningResponse`

- `opening_id` (`string`): References the related opening record.
- `program_id` (`string`): References the related program record.
- `role_name` (`string`): Stores the display name for role_name.
- `role_description` (`string`): Defines the assigned role or role label for access control.
- `project_title` (`string`): Used to store project_title for this module.
- `duration_weeks` (`number`): Used to store duration_weeks for this module.
- `stipend_amount` (`number`): Used to store stipend_amount for this module.
- `fee_amount` (`number`): Used to store fee_amount for this module.
- `total_openings` (`number`): Stores an aggregated numeric total used in stats or summaries.
- `application_deadline` (`string`): Used to store application_deadline for this module.
- `status` (`string`): Tracks the current lifecycle or processing state.
- `created_by` (`string`): Used to store created_by for this module.
- `created_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `updated_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `OpeningMentorCreate`

- `employee_id` (`string`): References the related employee record.

#### Interface `OpeningMentorResponse`

- `opening_mentor_id` (`string`): References the related opening_mentor record.
- `opening_id` (`string`): References the related opening record.
- `employee_id` (`string`): References the related employee record.
- `assigned_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.

---

## Organization Module

- API file: `src/api/organization.api.ts`
- Service file: `src/services/organization.service.ts`
- Type files: `src/types/api/organization.types.ts`
- API functions: `getColleges`, `createCollege`, `getDepartments`, `createDepartment`, `getCoordinators`, `createCoordinator`
- Service localStorage keys: None
- Routes:
  - `/feature/organization` (app/feature/organization/page.tsx)
  - `/feature/program` (app/feature/program/page.tsx)
  - `/feature/users` (app/feature/users/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-organizations
  - Service uses ../data/mock-organizations
  - Route /feature/organization uses @/src/data/mock-organizations
  - Route /feature/program uses @/src/data/mock-programs
  - Route /feature/program uses @/src/data/mock-organizations
  - Route /feature/users uses @/src/data/mock-users

### Endpoints

#### GET '/api/v1/colleges'
- Response type: `CollegeResponse[]`
- Payload: `None`

#### POST '/api/v1/colleges', data
- Response type: `CollegeResponse`
- Payload: `None`

#### GET '/api/v1/departments'
- Response type: `DepartmentResponse[]`
- Payload: `None`

#### POST '/api/v1/departments', data
- Response type: `DepartmentResponse`
- Payload: `None`

#### GET '/api/v1/college-coordinators'
- Response type: `CoordinatorResponse[]`
- Payload: `None`

#### POST '/api/v1/college-coordinators', data
- Response type: `CoordinatorResponse`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/organization.types.ts`


#### Interface `CollegeCreate`

- `college_code` (`string`): Used to store college_code for this module.
- `college_name` (`string`): Stores the display name for college_name.
- `college_email` (`string`): Stores the email address used for communication or identification.
- `college_phone` (`string`): Stores the contact phone number.
- `website_url` (`string`): Used to store website_url for this module.
- `address_line_1` (`string`): Used to store address_line_1 for this module.
- `address_line_2` (`string`): Used to store address_line_2 for this module.
- `city` (`string`): Used to store city for this module.
- `state` (`string`): Used to store state for this module.
- `country` (`string`): Stores an aggregated numeric total used in stats or summaries.
- `postal_code` (`string`): Used to store postal_code for this module.
- `accreditation` (`string`): Used to store accreditation for this module.
- `status` (`string`): Tracks the current lifecycle or processing state.

#### Interface `CollegeResponse`

- `college_id` (`string`): References the related college record.
- `college_code` (`string`): Used to store college_code for this module.
- `college_name` (`string`): Stores the display name for college_name.
- `college_email` (`string`): Stores the email address used for communication or identification.
- `college_phone` (`string`): Stores the contact phone number.
- `website_url` (`string`): Used to store website_url for this module.
- `address_line_1` (`string`): Used to store address_line_1 for this module.
- `address_line_2` (`string`): Used to store address_line_2 for this module.
- `city` (`string`): Used to store city for this module.
- `state` (`string`): Used to store state for this module.
- `country` (`string`): Stores an aggregated numeric total used in stats or summaries.
- `postal_code` (`string`): Used to store postal_code for this module.
- `accreditation` (`string`): Used to store accreditation for this module.
- `status` (`string`): Tracks the current lifecycle or processing state.
- `created_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `updated_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `DepartmentCreate`

- `college_id` (`string`): References the related college record.
- `department_code` (`string`): Used to store department_code for this module.
- `department_name` (`string`): Stores the display name for department_name.
- `hod_name` (`string`): Stores the display name for hod_name.
- `department_email` (`string`): Stores the email address used for communication or identification.
- `status` (`string`): Tracks the current lifecycle or processing state.

#### Interface `DepartmentResponse`

- `department_id` (`string`): References the related department record.
- `college_id` (`string`): References the related college record.
- `department_code` (`string`): Used to store department_code for this module.
- `department_name` (`string`): Stores the display name for department_name.
- `hod_name` (`string`): Stores the display name for hod_name.
- `department_email` (`string`): Stores the email address used for communication or identification.
- `status` (`string`): Tracks the current lifecycle or processing state.
- `created_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `updated_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `CoordinatorCreate`

- `employee_id` (`string`): References the related employee record.
- `college_id` (`string`): References the related college record.
- `assigned_from` (`string`): Used to store assigned_from for this module.
- `assigned_to` (`string`): Used to store assigned_to for this module.

#### Interface `CoordinatorResponse`

- `coordinator_mapping_id` (`string`): References the related coordinator_mapping record.
- `employee_id` (`string`): References the related employee record.
- `college_id` (`string`): References the related college record.
- `assigned_from` (`string`): Used to store assigned_from for this module.
- `assigned_to` (`string`): Used to store assigned_to for this module.
- `is_active` (`boolean`): Boolean flag used to control state, visibility, or validation.
- `created_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.

---

## Payment Module

- API file: `src/api/payment.api.ts`
- Service file: `src/services/payment.service.ts`
- Type files: `src/types/payment.types.ts`
- API functions: `getPayments`, `getPaymentById`
- Service localStorage keys: None
- Routes:
  - `/feature/payments` (app/feature/payments/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-payments

### Endpoints

#### GET '/payments'
- Response type: `PaymentTransaction[]`
- Payload: `None`

#### GET `/payments/${id}`
- Response type: `PaymentTransaction`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/payment.types.ts`

- Type aliases:
  - `PaymentStatus`: `'Pending' | 'Processing' | 'Success' | 'Failed' | 'Refunded' | 'Cancelled'`
  - `PaymentMode`: `'UPI' | 'Razorpay' | 'Cash' | 'Card' | 'Bank Transfer' | 'NEFT' | 'Wallet'`

#### Interface `PaymentTransaction`

- `id` (`string`): Unique identifier for this record.
- `transactionId` (`string`): References the related transaction record.
- `invoiceNumber` (`string`): Used to store invoice number for this module.
- `studentId` (`string`): References the related student record.
- `studentName` (`string`): Stores the display name for student.
- `program` (`string`): Used to store program for this module.
- `amount` (`number`): Used to store amount for this module.
- `gst` (`number`): Used to store gst for this module.
- `discount` (`number`): Stores an aggregated numeric total used in stats or summaries.
- `fine` (`number`): Used to store fine for this module.
- `netAmount` (`number`): Used to store net amount for this module.
- `paymentMethod` (`PaymentMode`): Used to store payment method for this module.
- `referenceNumber` (`string`): Used to store reference number for this module.
- `status` (`PaymentStatus`): Tracks the current lifecycle or processing state.
- `createdDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `paidDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `verifiedBy` (`string`): Used to store verified by for this module.

---

## Performance Module

- API file: `src/api/performance.api.ts`
- Service file: `src/services/performance.service.ts`
- Type files: `src/types/api/performance.types.ts`
- API functions: `getStudentPerformances`, `getBatchPerformances`, `getStudentPerformance`
- Service localStorage keys: None
- Routes:
  - `/feature/performance` (app/feature/performance/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-performance
  - Route /feature/performance uses @/src/data/mock-performance

### Endpoints

#### GET '/api/v1/performance/students'
- Response type: `StudentPerformance[]`
- Payload: `None`

#### GET '/api/v1/performance/batches'
- Response type: `BatchPerformance[]`
- Payload: `None`

#### GET `/api/v1/performance/students/${studentId}`
- Response type: `StudentPerformance`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/performance.types.ts`


#### Interface `StudentPerformance`

- `studentId` (`string`): References the related student record.
- `batchId` (`string`): References the related batch record.
- `average_score` (`number`): Used to store average_score for this module.
- `attendance_rate` (`number`): Stores a calculated percentage or rate metric.
- `task_completion_rate` (`number`): Stores a calculated percentage or rate metric.
- `assessment_score` (`number`): Used to store assessment_score for this module.
- `isAtRisk` (`boolean`): Boolean flag used to control state, visibility, or validation.

#### Interface `BatchPerformance`

- `batchId` (`string`): References the related batch record.
- `average_score` (`number`): Used to store average_score for this module.
- `attendance_rate` (`number`): Stores a calculated percentage or rate metric.
- `task_completion_rate` (`number`): Stores a calculated percentage or rate metric.
- `assessment_score` (`number`): Used to store assessment_score for this module.

---

## Placement Module

- API file: `src/api/placement.api.ts`
- Service file: `src/services/placement.service.ts`
- Type files: `src/types/placement.types.ts`
- API functions: `getPlacements`, `getCompanies`, `createCompany`
- Service localStorage keys: None
- Routes:
  - `/feature/placement` (app/feature/placement/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-placement

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/placement.types.ts`

- Type aliases:
  - `PlacementStage`: `'Eligible' | 'Applied' | 'Shortlisted' | 'Technical Round' | 'HR Round' | 'Selected' | 'Offer Released' | 'Joined' | 'Rejected'`

#### Interface `Company`

- `id` (`string`): Unique identifier for this record.
- `name` (`string`): Stores the display name for name.
- `industry` (`string`): Used to store industry for this module.
- `logoUrl` (`string`): Used to store logo url for this module.
- `website` (`string`): Used to store website for this module.
- `contactPerson` (`string`): Used to store contact person for this module.
- `contactEmail` (`string`): Stores the email address used for communication or identification.
- `activeRoles` (`number`): Defines the assigned role or role label for access control.

#### Interface `PlacementRecord`

- `id` (`string`): Unique identifier for this record.
- `studentId` (`string`): References the related student record.
- `studentName` (`string`): Stores the display name for student.
- `program` (`string`): Used to store program for this module.
- `companyId` (`string`): References the related company record.
- `companyName` (`string`): Stores the display name for company.
- `role` (`string`): Defines the assigned role or role label for access control.
- `package` (`string`): Used to store package for this module.
- `location` (`string`): Used to store location for this module.
- `stage` (`PlacementStage`): Used to store stage for this module.
- `interviewDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `offerStatus` (`'Pending' | 'Accepted' | 'Declined'`): Tracks the current lifecycle or processing state.
- `joiningDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `remarks` (`string`): Used to store remarks for this module.
- `lastUpdated` (`string`): Stores the relevant date/time for sorting, auditing, or display.

---

## Productivity Module

- API file: `src/api/productivity.api.ts`
- Service file: `src/services/productivity.service.ts`
- Type files: `src/types/productivity.types.ts`
- API functions: `getWorkspace`
- Service localStorage keys: None
- Routes:
  - `/feature/productivity` (app/feature/productivity/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-productivity

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/productivity.types.ts`


#### Interface `Bookmark`

- `id` (`string`): Unique identifier for this record.
- `title` (`string`): Used to store title for this module.
- `url` (`string`): Used to store url for this module.
- `category` (`string`): Used to store category for this module.

#### Interface `StickyNote`

- `id` (`string`): Unique identifier for this record.
- `content` (`string`): Stores the main content rendered or sent to the user.
- `color` (`'yellow' | 'blue' | 'green' | 'pink'`): Used to store color for this module.
- `createdAt` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `PersonalTask`

- `id` (`string`): Unique identifier for this record.
- `title` (`string`): Used to store title for this module.
- `completed` (`boolean`): Used to store completed for this module.
- `dueDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `ProductivityWorkspace`

- `bookmarks` (`Bookmark[]`): Collection of bookmarks values used to render lists or related records.
- `notes` (`StickyNote[]`): Collection of notes values used to render lists or related records.
- `tasks` (`PersonalTask[]`): Collection of tasks values used to render lists or related records.

---

## Program Module

- API file: `src/api/program.api.ts`
- Service file: `src/services/program.service.ts`
- Type files: `src/types/api/program.types.ts`
- API functions: `getInternshipTypes`, `createInternshipType`, `getPrograms`, `createProgram`
- Service localStorage keys: None
- Routes:
  - `/feature/program` (app/feature/program/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-programs
  - Route /feature/program uses @/src/data/mock-programs
  - Route /feature/program uses @/src/data/mock-organizations

### Endpoints

#### GET '/programs/internship-types'
- Response type: `InternshipTypeResponse[]`
- Payload: `None`

#### POST '/programs/internship-types', data
- Response type: `InternshipTypeResponse`
- Payload: `None`

#### GET '/programs'
- Response type: `ProgramResponse[]`
- Payload: `None`

#### POST '/programs', data
- Response type: `ProgramResponse`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/program.types.ts`


#### Interface `InternshipTypeCreate`

- `type_code` (`string`): Used to store type_code for this module.
- `type_name` (`string`): Stores the display name for type_name.
- `description` (`string`): Used to store description for this module.

#### Interface `InternshipTypeResponse`

- `internship_type_id` (`string`): References the related internship_type record.
- `type_code` (`string`): Used to store type_code for this module.
- `type_name` (`string`): Stores the display name for type_name.
- `description` (`string`): Used to store description for this module.
- `is_active` (`boolean`): Boolean flag used to control state, visibility, or validation.

#### Interface `ProgramCreate`

- `internship_type_id` (`string`): References the related internship_type record.
- `program_code` (`string`): Used to store program_code for this module.
- `program_name` (`string`): Stores the display name for program_name.
- `program_description` (`string`): Used to store program_description for this module.
- `duration_weeks` (`number`): Used to store duration_weeks for this module.
- `certificate_available` (`boolean`): Used to store certificate_available for this module.
- `status` (`string`): Tracks the current lifecycle or processing state.

#### Interface `ProgramResponse`

- `program_id` (`string`): References the related program record.
- `internship_type_id` (`string`): References the related internship_type record.
- `program_code` (`string`): Used to store program_code for this module.
- `program_name` (`string`): Stores the display name for program_name.
- `program_description` (`string`): Used to store program_description for this module.
- `duration_weeks` (`number`): Used to store duration_weeks for this module.
- `certificate_available` (`boolean`): Used to store certificate_available for this module.
- `status` (`string`): Tracks the current lifecycle or processing state.

---

## Referral Module

- API file: `src/api/referral.api.ts`
- Service file: `src/services/referral.service.ts`
- Type files: `src/types/referral.types.ts`
- API functions: `getReferrals`, `getCampaigns`
- Service localStorage keys: None
- Routes:
  - `/feature/referrals` (app/feature/referrals/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-referrals

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/referral.types.ts`

- Type aliases:
  - `ReferralStatus`: `'Pending' | 'Joined' | 'Completed' | 'Rewarded' | 'Expired'`

#### Interface `Referral`

- `id` (`string`): Unique identifier for this record.
- `referralCode` (`string`): Used to store referral code for this module.
- `referrerId` (`string`): References the related referrer record.
- `referrerName` (`string`): Stores the display name for referrer.
- `candidateName` (`string`): Stores the display name for candidate.
- `candidateEmail` (`string`): Stores the email address used for communication or identification.
- `program` (`string`): Used to store program for this module.
- `rewardPoints` (`number`): Used to store reward points for this module.
- `status` (`ReferralStatus`): Tracks the current lifecycle or processing state.
- `createdAt` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `joinedDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `rewardDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `ReferralCampaign`

- `id` (`string`): Unique identifier for this record.
- `title` (`string`): Used to store title for this module.
- `description` (`string`): Used to store description for this module.
- `rewardMultiplier` (`number`): Used to store reward multiplier for this module.
- `endDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.

---

## Report Module

- API file: `src/api/report.api.ts`
- Service file: `src/services/report.service.ts`
- Type files: `src/types/report.types.ts`
- API functions: `getTemplates`, `getReports`, `generateReport`
- Service localStorage keys: None
- Routes:
  - `/feature/reporting-manager` (app/feature/reporting-manager/page.tsx)
  - `/feature/reports` (app/feature/reports/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-reports

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/report.types.ts`


#### Interface `ReportRecord`

- `id` (`string`): Unique identifier for this record.
- `name` (`string`): Stores the display name for name.
- `type` (`string`): Used to store type for this module.
- `generatedBy` (`string`): Stores a calculated percentage or rate metric.
- `generatedDate` (`string`): Stores a calculated percentage or rate metric.
- `status` (`'Completed' | 'Processing' | 'Failed'`): Tracks the current lifecycle or processing state.
- `format` (`'PDF' | 'Excel' | 'CSV'`): Stores the relevant date/time for sorting, auditing, or display.
- `sizeBytes` (`number`): Used to store size bytes for this module.
- `downloadUrl` (`string`): Used to store download url for this module.

#### Interface `ReportTemplate`

- `id` (`string`): Unique identifier for this record.
- `name` (`string`): Stores the display name for name.
- `category` (`string`): Used to store category for this module.
- `description` (`string`): Used to store description for this module.

---

## Reporting Manager Module

- API file: `src/api/reportingManager.api.ts`
- Service file: `src/services/reportingManager.service.ts`
- Type files: `src/types/reporting-manager.types.ts`
- API functions: `getManagers`, `getManagerById`, `getAssignmentsByManager`, `getEvaluationsByManager`
- Service localStorage keys: None
- Routes:
  - `/feature/reporting-manager` (app/feature/reporting-manager/page.tsx)
  - `/feature/reports` (app/feature/reports/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-reporting-managers
  - API uses ../data/mock-manager-assignments
  - API uses ../data/mock-manager-evaluations

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/reporting-manager.types.ts`


#### Interface `ReportingManager`

- `id` (`string`): Unique identifier for this record.
- `userId` (`string`): References the related user record.
- `name` (`string`): Stores the display name for name.
- `email` (`string`): Stores the email address used for communication or identification.
- `department` (`string`): Used to store department for this module.
- `designation` (`string`): Used to store designation for this module.
- `assignedInternsCount` (`number`): Stores an aggregated numeric total used in stats or summaries.
- `status` (`'Active' | 'Inactive'`): Tracks the current lifecycle or processing state.

#### Interface `ManagerAssignment`

- `id` (`string`): Unique identifier for this record.
- `managerId` (`string`): References the related manager record.
- `internId` (`string`): References the related intern record.
- `assignedDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `status` (`'Active' | 'Completed' | 'Revoked'`): Tracks the current lifecycle or processing state.
- `internName` (`string`): Stores the display name for intern.
- `batch` (`string`): Used to store batch for this module.
- `college` (`string`): Used to store college for this module.
- `attendancePercent` (`number`): Stores a calculated percentage or rate metric.
- `assessmentPercent` (`number`): Stores a calculated percentage or rate metric.
- `taskCompletionPercent` (`number`): Stores a calculated percentage or rate metric.
- `performanceScore` (`number`): Used to store performance score for this module.
- `riskLevel` (`'Low' | 'Medium' | 'High'`): Used to store risk level for this module.

#### Interface `ManagerEvaluation`

- `id` (`string`): Unique identifier for this record.
- `assignmentId` (`string`): References the related assignment record.
- `managerId` (`string`): References the related manager record.
- `internId` (`string`): References the related intern record.
- `evaluationDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `score` (`number`): Used to store score for this module.
- `feedback` (`string`): Used to store feedback for this module.
- `status` (`'Draft' | 'Submitted'`): Tracks the current lifecycle or processing state.

---

## Role Module

- API file: `src/api/role.api.ts`
- Service file: `src/services/role.service.ts`
- Type files: `src/types/api/role.types.ts`
- API functions: `getRoles`, `getRoleById`, `createRole`, `updateRole`, `deleteRole`
- Service localStorage keys: None
- Routes:
  - `/feature/roles` (app/feature/roles/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-roles
  - Route /feature/roles uses @/src/data/mock-roles

### Endpoints

#### GET '/roles'
- Response type: `Role[]`
- Payload: `None`

#### GET `/roles/${id}`
- Response type: `Role`
- Payload: `None`

#### POST '/roles', data
- Response type: `Role`
- Payload: `None`

#### PATCH `/roles/${id}`, updates
- Response type: `Role`
- Payload: `None`

#### DELETE `/roles/${id}`
- Response type: `boolean`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/role.types.ts`

- Type aliases:
  - `RoleCreate`: `Omit<Role, 'id' | 'modulesCount' | 'usersCount'>`
  - `RoleUpdate`: `Partial<RoleCreate>`

#### Interface `Role`

- `id` (`string`): Unique identifier for this record.
- `name` (`string`): Stores the display name for name.
- `code` (`string`): Used to store code for this module.
- `desc` (`string`): Used to store desc for this module.
- `status` (`'Active' | 'Inactive'`): Tracks the current lifecycle or processing state.
- `modulesCount` (`number`): Maps the item to a product module or feature area.
- `usersCount` (`number`): Stores an aggregated numeric total used in stats or summaries.
- `color` (`string`): Used to store color for this module.
- `bg` (`string`): Used to store bg for this module.
- `moduleIds` (`string[]`): Maps the item to a product module or feature area.
- `permissions` (`string[]`): Defines access rights available to the user or role.

---

## Selfservice Module

- API file: `src/api/selfservice.api.ts`
- Service file: `src/services/selfservice.service.ts`
- Type files: `src/types/selfservice.types.ts`
- API functions: `getDashboard`, `updateProfile`
- Service localStorage keys: None
- Routes:
  - `/feature/self-service` (app/feature/self-service/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-self-service

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/selfservice.types.ts`


#### Interface `DocumentRequest`

- `id` (`string`): Unique identifier for this record.
- `type` (`string`): Used to store type for this module.
- `status` (`'Pending' | 'Approved' | 'Rejected' | 'Ready'`): Tracks the current lifecycle or processing state.
- `requestDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `completionDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `UserProfile`

- `id` (`string`): Unique identifier for this record.
- `name` (`string`): Stores the display name for name.
- `email` (`string`): Stores the email address used for communication or identification.
- `phone` (`string`): Stores the contact phone number.
- `address` (`string`): Used to store address for this module.
- `role` (`string`): Defines the assigned role or role label for access control.
- `joinDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `SelfServiceDashboard`

- `profile` (`UserProfile`): Used to store profile for this module.
- `recentRequests` (`DocumentRequest[]`): Collection of recent requests values used to render lists or related records.
- `pendingActions` (`number`): Used to store pending actions for this module.

---

## Student Module

- API file: `src/api/student.api.ts`
- Service file: `src/services/student.service.ts`
- Type files: `src/types/api/student.types.ts`
- API functions: `getStudents`, `createStudent`, `getStudent`, `updateStudent`, `deleteStudent`
- Service localStorage keys: None
- Routes:
  - `/feature/allocation` (app/feature/allocation/page.tsx)
  - `/feature/student` (app/feature/student/page.tsx)
  - `/feature/submissions` (app/feature/submissions/page.tsx)
  - `/feature/users` (app/feature/users/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-students
  - Route /feature/allocation uses @/src/data/mock-allocations
  - Route /feature/allocation uses @/src/data/mock-students
  - Route /feature/allocation uses @/src/data/mock-batches
  - Route /feature/student uses @/src/data/mock-students
  - Route /feature/submissions uses @/src/data/mock-submissions
  - Route /feature/users uses @/src/data/mock-users

### Endpoints

#### GET '/students/'
- Response type: `StudentResponse[]`
- Payload: `None`

#### POST '/students/', data
- Response type: `StudentResponse`
- Payload: `None`

#### GET `/students/${id}`
- Response type: `StudentResponse`
- Payload: `None`

#### PUT `/students/${id}`, data
- Response type: `StudentResponse`
- Payload: `None`

#### DELETE `/students/${id}`
- Response type: `Unknown`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/student.types.ts`


#### Interface `StudentCreate`

- `application_id` (`string`): References the related application record.
- `program_id` (`string`): References the related program record.

#### Interface `StudentResponse`

- `student_id` (`string`): References the related student record.
- `application_id` (`string`): References the related application record.
- `program_id` (`string`): References the related program record.
- `intern_id` (`string`): References the related intern record.
- `student_status` (`string`): Tracks the current lifecycle or processing state.
- `joined_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `completed_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `created_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `updated_at` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `StudentUpdate`

- `student_status` (`string`): Tracks the current lifecycle or processing state.

---

## Submission Module

- API file: `src/api/submission.api.ts`
- Service file: `src/services/submission.service.ts`
- Type files: `src/types/api/submission.types.ts`
- API functions: `getSubmissions`, `getSubmission`, `createSubmission`, `updateSubmission`
- Service localStorage keys: None
- Routes:
  - `/feature/submissions` (app/feature/submissions/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-submissions
  - Route /feature/submissions uses @/src/data/mock-submissions

### Endpoints

#### GET '/submissions'
- Response type: `Submission[]`
- Payload: `None`

#### GET `/submissions/${id}`
- Response type: `Submission`
- Payload: `None`

#### POST '/submissions', data
- Response type: `Submission`
- Payload: `None`

#### PATCH `/submissions/${id}`, updates
- Response type: `Submission`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/submission.types.ts`

- Type aliases:
  - `SubmissionCreate`: `Omit<Submission, 'id' | 'status'>`
  - `SubmissionUpdate`: `Partial<Submission>`

#### Interface `Subtask`

- `id` (`string`): Unique identifier for this record.
- `phase` (`number`): Used to store phase for this module.
- `task` (`string`): Used to store task for this module.
- `completed` (`boolean`): Used to store completed for this module.

#### Interface `Commit`

- `commit` (`string`): Used to store commit for this module.
- `message` (`string`): Stores the main content rendered or sent to the user.
- `author` (`string`): Used to store author for this module.
- `date` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `guideComment` (`string`): Used to store guide comment for this module.

#### Interface `Submission`

- `id` (`string`): Unique identifier for this record.
- `studentId` (`string`): References the related student record.
- `taskId` (`string`): References the related task record.
- `assessmentId` (`string`): References the related assessment record.
- `status` (`'PENDING' | 'APPROVED' | 'REJECTED'`): Tracks the current lifecycle or processing state.
- `repoLink` (`string`): Used to store repo link for this module.
- `liveLink` (`string`): Used to store live link for this module.
- `subtasks` (`Subtask[]`): Collection of subtasks values used to render lists or related records.
- `commits` (`Commit[]`): Collection of commits values used to render lists or related records.
- `submissionDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `marksObtained` (`number`): Used to store marks obtained for this module.
- `fileIds` (`string[]`): Collection of file ids values used to render lists or related records.

---

## Task Module

- API file: `src/api/task.api.ts`
- Service file: `src/services/task.service.ts`
- Type files: `src/types/api/task.types.ts`
- API functions: `getTasks`, `getTask`, `getTasksByBatch`, `getAssignees`
- Service localStorage keys: None
- Routes:
  - `/feature/management` (app/feature/management/page.tsx)
  - `/feature/my-tasks` (app/feature/my-tasks/page.tsx)
  - `/feature/task-management` (app/feature/task-management/page.tsx)
  - `/feature/task` (app/feature/task/page.tsx)
- Mock dependencies:
  - Service uses ../data/mock-tasks

### Endpoints

#### GET '/api/v1/tasks'
- Response type: `Task[]`
- Payload: `None`

#### GET `/api/v1/tasks/${id}`
- Response type: `Task`
- Payload: `None`

#### GET `/api/v1/batches/${batchId}/tasks`
- Response type: `Task[]`
- Payload: `None`

#### GET `/api/v1/tasks/${taskId}/assignees`
- Response type: `TaskAssignee[]`
- Payload: `None`

### Variables And Their Use

#### Types From `src/types/api/task.types.ts`


#### Interface `Task`

- `id` (`string`): Unique identifier for this record.
- `title` (`string`): Used to store title for this module.
- `description` (`string`): Used to store description for this module.
- `batchId` (`string`): References the related batch record.
- `assignedBy` (`string`): Used to store assigned by for this module.
- `assignedDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `dueDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `status` (`'pending' | 'review' | 'completed'`): Tracks the current lifecycle or processing state.
- `isOverdue` (`boolean`): Boolean flag used to control state, visibility, or validation.
- `isLocked` (`boolean`): Boolean flag used to control state, visibility, or validation.
- `alert` (`string`): Used to store alert for this module.
- `fileIds` (`string[]`): Collection of file ids values used to render lists or related records.

#### Interface `TaskAssignee`

- `taskId` (`string`): References the related task record.
- `studentId` (`string`): References the related student record.
- `status` (`'pending' | 'submitted' | 'graded'`): Tracks the current lifecycle or processing state.

---

## Verification Module

- API file: `src/api/verification.api.ts`
- Service file: `src/services/verification.service.ts`
- Type files: `src/types/verification.types.ts`
- API functions: `getRequests`, `verifyCertificate`
- Service localStorage keys: None
- Routes:
  - None mapped automatically
- Mock dependencies:
  - API uses ../data/mock-verifications
  - API uses ../data/mock-certificates

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/verification.types.ts`

- Type aliases:
  - `VerificationStatus`: `'Valid' | 'Invalid' | 'Expired' | 'Revoked'`

#### Interface `VerificationRequest`

- `id` (`string`): Unique identifier for this record.
- `certificateNumber` (`string`): Used to store certificate number for this module.
- `requestedByIp` (`string`): Used to store requested by ip for this module.
- `requestTime` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `method` (`'Certificate Number' | 'QR Code' | 'Verification Token'`): Used to store method for this module.
- `result` (`VerificationStatus`): Used to store result for this module.

#### Interface `VerificationResult`

- `status` (`VerificationStatus`): Tracks the current lifecycle or processing state.
- `studentName` (`string`): Stores the display name for student.
- `program` (`string`): Used to store program for this module.
- `batch` (`string`): Used to store batch for this module.
- `issueDate` (`string`): Stores the relevant date/time for sorting, auditing, or display.
- `organization` (`string`): Used to store organization for this module.
- `certificateType` (`string`): Used to store certificate type for this module.
- `message` (`string`): Stores the main content rendered or sent to the user.
- `previewUrl` (`string`): Used to store preview url for this module.

---

## Wallet Module

- API file: `src/api/wallet.api.ts`
- Service file: `src/services/wallet.service.ts`
- Type files: `src/types/wallet.types.ts`
- API functions: `getTransactions`
- Service localStorage keys: None
- Routes:
  - `/feature/wallet` (app/feature/wallet/page.tsx)
- Mock dependencies:
  - API uses ../data/mock-wallet

### Endpoints

*No apiClient endpoints extracted.*

### Variables And Their Use

#### Types From `src/types/wallet.types.ts`

- Type aliases:
  - `WalletTransactionType`: `'Credit' | 'Debit'`
  - `WalletSource`: `'Refund' | 'Incentive' | 'Scholarship' | 'Cashback' | 'Referral Reward' | 'Stipend' | 'Fee Payment'`
  - `WalletStatus`: `'Completed' | 'Pending' | 'Failed'`

#### Interface `WalletTransaction`

- `id` (`string`): Unique identifier for this record.
- `walletId` (`string`): References the related wallet record.
- `studentId` (`string`): References the related student record.
- `studentName` (`string`): Stores the display name for student.
- `type` (`WalletTransactionType`): Used to store type for this module.
- `amount` (`number`): Used to store amount for this module.
- `source` (`WalletSource`): Used to store source for this module.
- `reference` (`string`): Used to store reference for this module.
- `status` (`WalletStatus`): Tracks the current lifecycle or processing state.
- `date` (`string`): Stores the relevant date/time for sorting, auditing, or display.

#### Interface `WalletSummary`

- `walletId` (`string`): References the related wallet record.
- `studentId` (`string`): References the related student record.
- `studentName` (`string`): Stores the display name for student.
- `balance` (`number`): Used to store balance for this module.
- `totalCredits` (`number`): Stores an aggregated numeric total used in stats or summaries.
- `totalDebits` (`number`): Stores an aggregated numeric total used in stats or summaries.

---

