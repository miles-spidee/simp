# Entity Relationships

### ActivityLog
- **Many-to-One:** Belongs to `user` via `userId`

### AlumniProfile
- **Many-to-One:** Belongs to `student` via `studentId`

### ApplicationInternshipSpecificData
- **Many-to-One:** Belongs to `transaction` via `transactionId`

### ApplicationResponse
- **Many-to-One:** Belongs to `opening_` via `opening_id`
- **Many-to-One:** Belongs to `application_` via `application_id`
- **Many-to-One:** Belongs to `applicant_user_` via `applicant_user_id`

### Assessment
- **Many-to-One:** Belongs to `batch` via `batchId`

### AssessmentSubmission
- **Many-to-One:** Belongs to `assessment` via `assessmentId`
- **Many-to-One:** Belongs to `student` via `studentId`

### AttendanceSession
- **Many-to-One:** Belongs to `batch` via `batchId`

### AttendanceRecord
- **Many-to-One:** Belongs to `session` via `sessionId`
- **Many-to-One:** Belongs to `student` via `studentId`

### AttendanceStatus
- **Many-to-One:** Belongs to `student` via `studentId`

### RegisterResponse
- **Many-to-One:** Belongs to `user_` via `user_id`

### CurrentUserResponse
- **Many-to-One:** Belongs to `user_` via `user_id`
- **Many-to-One:** Belongs to `role` via `roleId`

### AssignRoleRequest
- **Many-to-One:** Belongs to `user_` via `user_id`
- **Many-to-One:** Belongs to `role_` via `role_id`

### AssignPermissionRequest
- **Many-to-One:** Belongs to `role_` via `role_id`
- **Many-to-One:** Belongs to `permission_` via `permission_id`

### BatchCreate
- **Many-to-One:** Belongs to `program_` via `program_id`

### BatchResponse
- **Many-to-One:** Belongs to `batch_` via `batch_id`
- **Many-to-One:** Belongs to `program_` via `program_id`

### BatchStudentCreate
- **Many-to-One:** Belongs to `student_` via `student_id`

### BatchStudentResponse
- **Many-to-One:** Belongs to `batch_student_` via `batch_student_id`
- **Many-to-One:** Belongs to `batch_` via `batch_id`
- **Many-to-One:** Belongs to `student_` via `student_id`

### Receipt
- **Many-to-One:** Belongs to `amountPa` via `amountPaid`
- **Many-to-One:** Belongs to `transaction` via `transactionId`

### Certificate
- **Many-to-One:** Belongs to `student` via `studentId`
- **Many-to-One:** Belongs to `digitalSignature` via `digitalSignatureId`

### Message
- **Many-to-One:** Belongs to `conversation` via `conversationId`
- **Many-to-One:** Belongs to `sender` via `senderId`

### Coordinator
- **Many-to-One:** Belongs to `employee` via `employeeId`
- **Many-to-One:** Belongs to `college` via `collegeId`

### CollegeReport
- **Many-to-One:** Belongs to `coordinator` via `coordinatorId`
- **Many-to-One:** Belongs to `college` via `collegeId`
- **Many-to-One:** Belongs to `file` via `fileId`

### DegreeResponse
- **Many-to-One:** Belongs to `degree_` via `degree_id`

### GeneratedDocument
- **Many-to-One:** Belongs to `template` via `templateId`
- **Many-to-One:** Belongs to `student` via `studentId`

### EmailHistory
- **Many-to-One:** Belongs to `template` via `templateId`

### EmployeeCreate
- **Many-to-One:** Belongs to `user_` via `user_id`

### EmployeeResponse
- **Many-to-One:** Belongs to `employee_` via `employee_id`

### EscalationLog
- **Many-to-One:** Belongs to `rule` via `ruleId`
- **Many-to-One:** Belongs to `target` via `targetId`

### FeedbackBase
- **Many-to-One:** Belongs to `provider` via `providerId`
- **Many-to-One:** Belongs to `target` via `targetId`

### FeedbackCreate
- **Many-to-One:** Belongs to `target` via `targetId`

### TicketComment
- **Many-to-One:** Belongs to `ticket` via `ticketId`
- **Many-to-One:** Belongs to `author` via `authorId`

### DigitalIDCard
- **Many-to-One:** Belongs to `student` via `studentId`

### StudentRisk
- **Many-to-One:** Belongs to `student` via `studentId`

### LeaveRequest
- **Many-to-One:** Belongs to `user` via `userId`

### LeaveTimelineEvent
- **Many-to-One:** Belongs to `leave` via `leaveId`

### LearningResource
- **Many-to-One:** Belongs to `module` via `moduleId`
- **Many-to-One:** Belongs to `file_` via `file_id`

### LearningModule
- **Many-to-One:** Belongs to `program` via `programId`

### MarketplaceApplication
- **Many-to-One:** Belongs to `opportunity` via `opportunityId`
- **Many-to-One:** Belongs to `student` via `studentId`

### MentorProfile
- **Many-to-One:** Belongs to `mentor_profile_` via `mentor_profile_id`
- **Many-to-One:** Belongs to `employee_` via `employee_id`

### MentorAssignment
- **Many-to-One:** Belongs to `mentorProfile` via `mentorProfileId`
- **Many-to-One:** Belongs to `employee` via `employeeId`
- **Many-to-One:** Belongs to `student` via `studentId`
- **Many-to-One:** Belongs to `intern` via `internId`
- **Many-to-One:** Belongs to `batch` via `batchId`

### MentorBatchMapping
- **Many-to-One:** Belongs to `mentorProfile` via `mentorProfileId`
- **Many-to-One:** Belongs to `employee` via `employeeId`
- **Many-to-One:** Belongs to `batch` via `batchId`

### OpeningCreate
- **Many-to-One:** Belongs to `program_` via `program_id`

### OpeningResponse
- **Many-to-One:** Belongs to `opening_` via `opening_id`
- **Many-to-One:** Belongs to `program_` via `program_id`

### OpeningMentorCreate
- **Many-to-One:** Belongs to `employee_` via `employee_id`

### OpeningMentorResponse
- **Many-to-One:** Belongs to `opening_mentor_` via `opening_mentor_id`
- **Many-to-One:** Belongs to `opening_` via `opening_id`
- **Many-to-One:** Belongs to `employee_` via `employee_id`

### CollegeResponse
- **Many-to-One:** Belongs to `college_` via `college_id`

### DepartmentCreate
- **Many-to-One:** Belongs to `college_` via `college_id`

### DepartmentResponse
- **Many-to-One:** Belongs to `department_` via `department_id`
- **Many-to-One:** Belongs to `college_` via `college_id`

### CoordinatorCreate
- **Many-to-One:** Belongs to `employee_` via `employee_id`
- **Many-to-One:** Belongs to `college_` via `college_id`

### CoordinatorResponse
- **Many-to-One:** Belongs to `coordinator_mapping_` via `coordinator_mapping_id`
- **Many-to-One:** Belongs to `employee_` via `employee_id`
- **Many-to-One:** Belongs to `college_` via `college_id`

### PaymentTransaction
- **Many-to-One:** Belongs to `transaction` via `transactionId`
- **Many-to-One:** Belongs to `student` via `studentId`

### StudentPerformance
- **Many-to-One:** Belongs to `student` via `studentId`
- **Many-to-One:** Belongs to `batch` via `batchId`

### BatchPerformance
- **Many-to-One:** Belongs to `batch` via `batchId`

### PlacementRecord
- **Many-to-One:** Belongs to `student` via `studentId`
- **Many-to-One:** Belongs to `company` via `companyId`

### InternshipTypeResponse
- **Many-to-One:** Belongs to `internship_type_` via `internship_type_id`

### ProgramCreate
- **Many-to-One:** Belongs to `internship_type_` via `internship_type_id`

### ProgramResponse
- **Many-to-One:** Belongs to `program_` via `program_id`
- **Many-to-One:** Belongs to `internship_type_` via `internship_type_id`

### Referral
- **Many-to-One:** Belongs to `referrer` via `referrerId`

### ReportingManager
- **Many-to-One:** Belongs to `user` via `userId`

### ManagerAssignment
- **Many-to-One:** Belongs to `manager` via `managerId`
- **Many-to-One:** Belongs to `intern` via `internId`

### ManagerEvaluation
- **Many-to-One:** Belongs to `assignment` via `assignmentId`
- **Many-to-One:** Belongs to `manager` via `managerId`
- **Many-to-One:** Belongs to `intern` via `internId`

### StudentCreate
- **Many-to-One:** Belongs to `application_` via `application_id`
- **Many-to-One:** Belongs to `program_` via `program_id`

### StudentResponse
- **Many-to-One:** Belongs to `student_` via `student_id`
- **Many-to-One:** Belongs to `application_` via `application_id`
- **Many-to-One:** Belongs to `program_` via `program_id`
- **Many-to-One:** Belongs to `intern_` via `intern_id`

### Submission
- **Many-to-One:** Belongs to `student` via `studentId`
- **Many-to-One:** Belongs to `task` via `taskId`
- **Many-to-One:** Belongs to `assessment` via `assessmentId`

### Task
- **Many-to-One:** Belongs to `batch` via `batchId`

### TaskAssignee
- **Many-to-One:** Belongs to `task` via `taskId`
- **Many-to-One:** Belongs to `student` via `studentId`

### WalletTransaction
- **Many-to-One:** Belongs to `wallet` via `walletId`
- **Many-to-One:** Belongs to `student` via `studentId`

### WalletSummary
- **Many-to-One:** Belongs to `wallet` via `walletId`
- **Many-to-One:** Belongs to `student` via `studentId`

