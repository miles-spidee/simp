# Database Dictionary

### Entity: ActivityLog

- **id**: Unique identifier for this record. (Type: string)
- **user_id**: References the related user record. (Type: string)
- **user_name**: Stores the display name for user. (Type: string)
- **role**: Defines the assigned role or role label for access control. (Type: string)
- **module**: Maps the item to a product module or feature area. (Type: 'Login' | 'Attendance' | 'Task' | 'Assessment' | 'Assignment' | 'Leave' | 'Profile' | 'Certificate' | 'Payment')
- **action**: Used to store action for this module. (Type: string)
- **description**: Used to store description for this module. (Type: string)
- **timestamp**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **device**: Used to store device for this module. (Type: string)
- **browser**: Used to store browser for this module. (Type: string)
- **ip**: Used to store ip for this module. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Success' | 'Failed' | 'Warning')
- **severity**: Used to store severity for this module. (Type: 'Info' | 'Low' | 'Medium' | 'High' | 'Critical')

### Entity: CareerProgress

- **id**: Unique identifier for this record. (Type: string)
- **company_name**: Stores the display name for company. (Type: string)
- **designation**: Used to store designation for this module. (Type: string)
- **start_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **end_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **is_current**: Boolean flag used to control state, visibility, or validation. (Type: boolean)
- **location**: Used to store location for this module. (Type: string)

### Entity: AlumniProfile

- **id**: Unique identifier for this record. (Type: string)
- **student_id**: References the related student record. (Type: string)
- **name**: Stores the display name for name. (Type: string)
- **email**: Stores the email address used for communication or identification. (Type: string)
- **phone**: Stores the contact phone number. (Type: string)
- **program**: Used to store program for this module. (Type: string)
- **batch**: Used to store batch for this module. (Type: string)
- **graduation_year**: Used to store graduation year for this module. (Type: number)
- **current_company**: Used to store current company for this module. (Type: string)
- **current_designation**: Used to store current designation for this module. (Type: string)
- **linked_in_url**: Used to store linked in url for this module. (Type: string)
- **career_history**: Collection of career history values used to render lists or related records. (Type: CareerProgress[])
- **achievements**: Collection of achievements values used to render lists or related records. (Type: string[])
- **is_mentoring**: Boolean flag used to control state, visibility, or validation. (Type: boolean)
- **referrals_provided**: Used to store referrals provided for this module. (Type: number)
- **last_updated**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: AnalyticsDataPoint

- **date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **value**: Used to store value for this module. (Type: number)
- **category**: Used to store category for this module. (Type: string)

### Entity: AnalyticsSummary

- **total_students**: Stores an aggregated numeric total used in stats or summaries. (Type: number)
- **active_interns**: Boolean flag used to control state, visibility, or validation. (Type: number)
- **completion_rate**: Stores a calculated percentage or rate metric. (Type: number)
- **attendance_rate**: Stores a calculated percentage or rate metric. (Type: number)
- **average_score**: Used to store average score for this module. (Type: number)
- **placement_rate**: Stores a calculated percentage or rate metric. (Type: number)
- **revenue**: Used to store revenue for this module. (Type: number)
- **certificates_issued**: Used to store certificates issued for this module. (Type: number)

### Entity: AnalyticsDimension

- **id**: Unique identifier for this record. (Type: string)
- **name**: Stores the display name for name. (Type: string)
- **value**: Used to store value for this module. (Type: number)
- **percentage**: Stores a calculated percentage or rate metric. (Type: number)

### Entity: Announcement

- **id**: Unique identifier for this record. (Type: string)
- **title**: Used to store title for this module. (Type: string)
- **description**: Used to store description for this module. (Type: string)
- **audience**: Collection of audience values used to render lists or related records. (Type: string[])
- **category**: Used to store category for this module. (Type: AnnouncementCategory)
- **priority**: Used to store priority for this module. (Type: AnnouncementPriority)
- **attachments**: Collection of attachments values used to render lists or related records. (Type: string[])
- **publish_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **expiry_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: AnnouncementStatus)
- **pinned**: Used to store pinned for this module. (Type: boolean)
- **author**: Used to store author for this module. (Type: string)

### Entity: ApplicationPersonalInformation

- **photo**: Used to store photo for this module. (Type: string)
- **first_name**: Stores the display name for first. (Type: string)
- **last_name**: Stores the display name for last. (Type: string)
- **email**: Stores the email address used for communication or identification. (Type: string)
- **mobile_number**: Used to store mobile number for this module. (Type: string)
- **date_of_birth**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **gender**: Used to store gender for this module. (Type: string)
- **city**: Used to store city for this module. (Type: string)
- **state**: Used to store state for this module. (Type: string)

### Entity: ApplicationAcademicInformation

- **college_name**: Stores the display name for college. (Type: string)
- **department**: Used to store department for this module. (Type: string)
- **degree**: Used to store degree for this module. (Type: string)
- **current_year**: Used to store current year for this module. (Type: string)
- **cgpa_percentage**: Stores a calculated percentage or rate metric. (Type: string)
- **graduation_year**: Used to store graduation year for this module. (Type: string)

### Entity: ApplicationProfessionalInformation

- **skills**: Used to store skills for this module. (Type: string)
- **github_url**: Used to store github url for this module. (Type: string)
- **linkedin_url**: Used to store linkedin url for this module. (Type: string)
- **portfolio_url**: Used to store portfolio url for this module. (Type: string)
- **project_experience**: Used to store project experience for this module. (Type: string)

### Entity: ApplicationInternshipSpecificData

- **payment_mode**: Used to store payment mode for this module. (Type: string)
- **transaction_id**: References the related transaction record. (Type: string)
- **relevant_experience**: Used to store relevant experience for this module. (Type: string)
- **preferred_tech_stack**: Used to store preferred tech stack for this module. (Type: string)
- **relevant_technical_experience**: Used to store relevant technical experience for this module. (Type: string)
- **research_area_of_interest**: Used to store research area of interest for this module. (Type: string)
- **research_interest_statement**: Used to store research interest statement for this module. (Type: string)
- **publication_links**: Used to store publication links for this module. (Type: string)
- **payment_screenshot**: Used to store payment screenshot for this module. (Type: string)

### Entity: ApplicationDocuments

- **resume**: Used to store resume for this module. (Type: string)
- **passbook**: Used to store passbook for this module. (Type: string)

### Entity: ApplicationMotivation

- **why_internship**: Used to store why internship for this module. (Type: string)

### Entity: ApplicationCreate

- **internship_type**: Used to store internship type for this module. (Type: string)
- **personal_information**: Used to store personal information for this module. (Type: ApplicationPersonalInformation)
- **academic_information**: Used to store academic information for this module. (Type: ApplicationAcademicInformation)
- **professional_information**: Used to store professional information for this module. (Type: ApplicationProfessionalInformation)
- **internship_specific_data**: Used to store internship specific data for this module. (Type: ApplicationInternshipSpecificData)
- **documents**: Used to store documents for this module. (Type: ApplicationDocuments)
- **motivation**: Used to store motivation for this module. (Type: ApplicationMotivation)

### Entity: ApplicationResponse

- **opening_id**: References the related opening record. (Type: string)
- **application_id**: References the related application record. (Type: string)
- **applicant_user_id**: References the related applicant_user record. (Type: string)
- **application_status**: Tracks the current lifecycle or processing state. (Type: string)
- **applied_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **reviewed_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **reviewed_by**: Used to store reviewed_by for this module. (Type: string)
- **remarks**: Used to store remarks for this module. (Type: string)
- **profile**: Used to store profile for this module. (Type: ApplicationProfileResponse)

### Entity: ApplicationReviewRequest

- **application_status**: Tracks the current lifecycle or processing state. (Type: string)
- **remarks**: Used to store remarks for this module. (Type: string)

### Entity: Assessment

- **id**: Unique identifier for this record. (Type: string)
- **title**: Used to store title for this module. (Type: string)
- **assessment_type**: Used to store assessment type for this module. (Type: AssessmentType)
- **batch_id**: References the related batch record. (Type: string)
- **total_marks**: Stores an aggregated numeric total used in stats or summaries. (Type: number)
- **passing_marks**: Used to store passing marks for this module. (Type: number)
- **date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Upcoming' | 'Active' | 'Completed')
- **file_ids**: Collection of file ids values used to render lists or related records. (Type: string[])

### Entity: AssessmentSubmission

- **id**: Unique identifier for this record. (Type: string)
- **assessment_id**: References the related assessment record. (Type: string)
- **student_id**: References the related student record. (Type: string)
- **score**: Used to store score for this module. (Type: number)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Pending Grading' | 'Graded' | 'Missed')
- **submitted_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **file_ids**: Collection of file ids values used to render lists or related records. (Type: string[])

### Entity: AttendanceSession

- **id**: Unique identifier for this record. (Type: string)
- **batch_id**: References the related batch record. (Type: string)
- **date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **created_by**: Used to store created by for this module. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Open' | 'Closed')

### Entity: AttendanceRecord

- **id**: Unique identifier for this record. (Type: string)
- **session_id**: References the related session record. (Type: string)
- **student_id**: References the related student record. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: AttendanceStatusType)
- **clock_in**: Used to store clock in for this module. (Type: string)
- **clock_out**: Used to store clock out for this module. (Type: string)

### Entity: AttendanceStatus

- **student_id**: References the related student record. (Type: string)
- **present_days**: Used to store present days for this module. (Type: number)
- **absent_days**: Used to store absent days for this module. (Type: number)
- **late_days**: Used to store late days for this module. (Type: number)
- **leave_days**: Used to store leave days for this module. (Type: number)
- **average_attendance**: Used to store average attendance for this module. (Type: number)
- **is_checked_in**: Boolean flag used to control state, visibility, or validation. (Type: boolean)
- **clock_in_time**: Stores the relevant date/time for sorting, auditing, or display. (Type: string | null)

### Entity: RegisterRequest

- **username**: Stores the display name for username. (Type: string)
- **email**: Stores the email address used for communication or identification. (Type: string)
- **password**: Used to store password for this module. (Type: string)

### Entity: RegisterResponse

- **user_id**: References the related user record. (Type: string)
- **username**: Stores the display name for username. (Type: string)
- **email**: Stores the email address used for communication or identification. (Type: string)
- **is_active**: Boolean flag used to control state, visibility, or validation. (Type: boolean)
- **is_email_verified**: Stores the email address used for communication or identification. (Type: boolean)
- **is_first_login**: Boolean flag used to control state, visibility, or validation. (Type: boolean)
- **last_login_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **created_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **updated_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: LoginRequest

- **username**: Stores the display name for username. (Type: string)
- **password**: Used to store password for this module. (Type: string)

### Entity: LoginResponse

- **access_token**: Used to store access_token for this module. (Type: string)
- **refresh_token**: Used to store refresh_token for this module. (Type: string)
- **token_type**: Used to store token_type for this module. (Type: string)

### Entity: CurrentUserResponse

- **user_id**: References the related user record. (Type: string)
- **name**: Stores the display name for name. (Type: string)
- **email**: Stores the email address used for communication or identification. (Type: string)
- **role_name**: Stores the display name for role. (Type: string)
- **role_id**: References the related role record. (Type: string)
- **role_code**: Defines the assigned role or role label for access control. (Type: string)
- **modules**: Maps the item to a product module or feature area. (Type: Module[])
- **permissions**: Defines access rights available to the user or role. (Type: string[])

### Entity: AuthActionResponse

- **message**: Stores the main content rendered or sent to the user. (Type: string)
- **success**: Used to store success for this module. (Type: boolean)

### Entity: AssignRoleRequest

- **user_id**: References the related user record. (Type: string)
- **role_id**: References the related role record. (Type: string)

### Entity: AssignPermissionRequest

- **role_id**: References the related role record. (Type: string)
- **permission_id**: References the related permission record. (Type: string)

### Entity: ForgotPasswordRequest

- **username**: Stores the display name for username. (Type: string)

### Entity: ForgotPasswordVerify

- **username**: Stores the display name for username. (Type: string)
- **otp**: Used to store otp for this module. (Type: string)

### Entity: ForgotPasswordReset

- **username**: Stores the display name for username. (Type: string)
- **otp**: Used to store otp for this module. (Type: string)
- **new_password**: Used to store new password for this module. (Type: string)

### Entity: BatchCreate

- **program_id**: References the related program record. (Type: string)
- **batch_code**: Used to store batch_code for this module. (Type: string)
- **batch_name**: Stores the display name for batch_name. (Type: string)
- **max_capacity**: Used to store max_capacity for this module. (Type: number)
- **start_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **end_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **batch_status**: Tracks the current lifecycle or processing state. (Type: string)

### Entity: BatchResponse

- **batch_id**: References the related batch record. (Type: string)
- **program_id**: References the related program record. (Type: string)
- **batch_code**: Used to store batch_code for this module. (Type: string)
- **batch_name**: Stores the display name for batch_name. (Type: string)
- **max_capacity**: Used to store max_capacity for this module. (Type: number)
- **start_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **end_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **batch_status**: Tracks the current lifecycle or processing state. (Type: string)
- **created_by**: Used to store created_by for this module. (Type: string)
- **created_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **updated_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: BatchStudentCreate

- **student_id**: References the related student record. (Type: string)
- **assigned_by**: Used to store assigned_by for this module. (Type: string)

### Entity: BatchStudentResponse

- **batch_student_id**: References the related batch_student record. (Type: string)
- **batch_id**: References the related batch record. (Type: string)
- **student_id**: References the related student record. (Type: string)
- **assigned_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **assigned_by**: Used to store assigned_by for this module. (Type: string)

### Entity: InvoiceItem

- **description**: Used to store description for this module. (Type: string)
- **amount**: Used to store amount for this module. (Type: number)

### Entity: Invoice

- **id**: Unique identifier for this record. (Type: string)
- **invoice_number**: Used to store invoice number for this module. (Type: string)
- **customer_name**: Stores the display name for customer. (Type: string)
- **items**: Collection of items values used to render lists or related records. (Type: InvoiceItem[])
- **sub_total**: Used to store sub total for this module. (Type: number)
- **tax_amount**: Used to store tax amount for this module. (Type: number)
- **discount**: Stores an aggregated numeric total used in stats or summaries. (Type: number)
- **grand_total**: Used to store grand total for this module. (Type: number)
- **payment_status**: Tracks the current lifecycle or processing state. (Type: InvoiceStatus)
- **issue_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **due_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: Receipt

- **id**: Unique identifier for this record. (Type: string)
- **receipt_number**: Used to store receipt number for this module. (Type: string)
- **invoice_number**: Used to store invoice number for this module. (Type: string)
- **customer_name**: Stores the display name for customer. (Type: string)
- **amount_paid**: References the related amount p record. (Type: number)
- **payment_method**: Used to store payment method for this module. (Type: string)
- **payment_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **transaction_id**: References the related transaction record. (Type: string)

### Entity: CalendarEvent

- **id**: Unique identifier for this record. (Type: string)
- **title**: Used to store title for this module. (Type: string)
- **description**: Used to store description for this module. (Type: string)
- **type**: Used to store type for this module. (Type: EventType)
- **start_time**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **end_time**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **participants**: Collection of participants values used to render lists or related records. (Type: string[])
- **location**: Used to store location for this module. (Type: string)
- **meeting_link**: Used to store meeting link for this module. (Type: string)
- **reminder_minutes**: Used to store reminder minutes for this module. (Type: number)
- **repeat_rule**: Used to store repeat rule for this module. (Type: 'None' | 'Daily' | 'Weekly' | 'Monthly')
- **status**: Tracks the current lifecycle or processing state. (Type: EventStatus)

### Entity: Certificate

- **id**: Unique identifier for this record. (Type: string)
- **certificate_number**: Used to store certificate number for this module. (Type: string)
- **student_id**: References the related student record. (Type: string)
- **student_name**: Stores the display name for student. (Type: string)
- **program**: Used to store program for this module. (Type: string)
- **batch**: Used to store batch for this module. (Type: string)
- **mentor_name**: Stores the display name for mentor. (Type: string)
- **type**: Used to store type for this module. (Type: CertificateType)
- **issue_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string | null)
- **expiry_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string | null)
- **status**: Tracks the current lifecycle or processing state. (Type: CertificateStatus)
- **generated_by**: Stores a calculated percentage or rate metric. (Type: string)
- **approved_by**: Used to store approved by for this module. (Type: string)
- **qr_code_url**: Used to store qr code url for this module. (Type: string)
- **verification_url**: Used to store verification url for this module. (Type: string)
- **digital_signature_id**: References the related digital signature record. (Type: string)
- **created_time**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: Message

- **id**: Unique identifier for this record. (Type: string)
- **conversation_id**: References the related conversation record. (Type: string)
- **sender_id**: References the related sender record. (Type: string)
- **sender_name**: Stores the display name for sender. (Type: string)
- **content**: Stores the main content rendered or sent to the user. (Type: string)
- **attachments**: Collection of attachments values used to render lists or related records. (Type: string[])
- **created_time**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **read_time**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: MessageStatus)
- **priority**: Used to store priority for this module. (Type: MessagePriority)

### Entity: Conversation

- **id**: Unique identifier for this record. (Type: string)
- **type**: Used to store type for this module. (Type: ConversationType)
- **name**: Stores the display name for name. (Type: string)
- **participants**: Used to store participants for this module. (Type: { id: string; name: string; role: string)

### Entity: Coordinator

- **id**: Unique identifier for this record. (Type: string)
- **employee_id**: References the related employee record. (Type: string)
- **college_id**: References the related college record. (Type: string)
- **name**: Stores the display name for name. (Type: string)
- **email**: Stores the email address used for communication or identification. (Type: string)
- **phone**: Stores the contact phone number. (Type: string)
- **assigned_students_count**: Stores an aggregated numeric total used in stats or summaries. (Type: number)
- **active_batches_count**: Stores an aggregated numeric total used in stats or summaries. (Type: number)
- **placements_count**: Stores an aggregated numeric total used in stats or summaries. (Type: number)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Active' | 'Inactive')

### Entity: CollegeReport

- **id**: Unique identifier for this record. (Type: string)
- **coordinator_id**: References the related coordinator record. (Type: string)
- **college_id**: References the related college record. (Type: string)
- **month**: Used to store month for this module. (Type: string)
- **year**: Used to store year for this module. (Type: number)
- **file_id**: References the related file record. (Type: string)

### Entity: DegreeResponse

- **degree_id**: References the related degree record. (Type: string)
- **degree_name**: Stores the display name for degree_name. (Type: string)
- **degree_code**: Used to store degree_code for this module. (Type: string)
- **duration_years**: Used to store duration_years for this module. (Type: number)
- **status**: Tracks the current lifecycle or processing state. (Type: string)

### Entity: DegreeCreate

- **degree_name**: Stores the display name for degree_name. (Type: string)
- **degree_code**: Used to store degree_code for this module. (Type: string)
- **duration_years**: Used to store duration_years for this module. (Type: number)

### Entity: DocumentTemplate

- **id**: Unique identifier for this record. (Type: string)
- **name**: Stores the display name for name. (Type: string)
- **type**: Used to store type for this module. (Type: DocumentType)
- **description**: Used to store description for this module. (Type: string)
- **version**: Tracks the revision number for change management. (Type: string)
- **variables**: Lists dynamic placeholders or values injected at runtime. (Type: string[])
- **last_updated**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: GeneratedDocument

- **id**: Unique identifier for this record. (Type: string)
- **template_id**: References the related template record. (Type: string)
- **student_id**: References the related student record. (Type: string)
- **student_name**: Stores the display name for student. (Type: string)
- **program**: Used to store program for this module. (Type: string)
- **type**: Used to store type for this module. (Type: DocumentType)
- **status**: Tracks the current lifecycle or processing state. (Type: DocumentStatus)
- **generated_date**: Stores a calculated percentage or rate metric. (Type: string)
- **version**: Tracks the revision number for change management. (Type: string)
- **file_url**: Used to store file url for this module. (Type: string)
- **metadata**: Used to store metadata for this module. (Type: Record<string, string>)

### Entity: EmailTemplate

- **id**: Unique identifier for this record. (Type: string)
- **name**: Stores the display name for name. (Type: string)
- **category**: Used to store category for this module. (Type: EmailTemplateCategory)
- **subject**: Stores the subject line shown to the recipient. (Type: string)
- **html_body**: Stores the main content rendered or sent to the user. (Type: string)
- **variables**: Lists dynamic placeholders or values injected at runtime. (Type: string[])
- **status**: Tracks the current lifecycle or processing state. (Type: EmailStatus)
- **created_by**: Used to store created by for this module. (Type: string)
- **version**: Tracks the revision number for change management. (Type: number)
- **last_updated**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: EmailHistory

- **id**: Unique identifier for this record. (Type: string)
- **template_id**: References the related template record. (Type: string)
- **recipient_email**: Stores the email address used for communication or identification. (Type: string)
- **sent_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Delivered' | 'Bounced' | 'Opened' | 'Clicked')

### Entity: EmployeeCreate

- **user_id**: References the related user record. (Type: string)
- **employee_code**: Used to store employee_code for this module. (Type: string)
- **first_name**: Stores the display name for first_name. (Type: string)
- **last_name**: Stores the display name for last_name. (Type: string)
- **phone_number**: Stores the contact phone number. (Type: string)
- **official_email**: Stores the email address used for communication or identification. (Type: string)
- **joining_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **designation**: Used to store designation for this module. (Type: string)

### Entity: EmployeeResponse

- **employee_id**: References the related employee record. (Type: string)
- **employee_code**: Used to store employee_code for this module. (Type: string)
- **first_name**: Stores the display name for first_name. (Type: string)
- **last_name**: Stores the display name for last_name. (Type: string)
- **official_email**: Stores the email address used for communication or identification. (Type: string)
- **designation**: Used to store designation for this module. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: string)

### Entity: EscalationRule

- **id**: Unique identifier for this record. (Type: string)
- **type**: Used to store type for this module. (Type: 'Attendance' | 'Assignments' | 'Leave' | 'Assessments' | 'Performance' | 'Payment' | 'Certificate Approval')
- **condition**: Used to store condition for this module. (Type: string)
- **trigger_days**: Used to store trigger days for this module. (Type: number)
- **notify_roles**: Defines the assigned role or role label for access control. (Type: string[])
- **status**: Tracks the current lifecycle or processing state. (Type: 'Active' | 'Inactive')

### Entity: EscalationLog

- **id**: Unique identifier for this record. (Type: string)
- **rule_id**: References the related rule record. (Type: string)
- **target_id**: References the related target record. (Type: string)
- **target_name**: Stores the display name for target. (Type: string)
- **type**: Used to store type for this module. (Type: 'Attendance' | 'Assignments' | 'Leave' | 'Assessments' | 'Performance' | 'Payment' | 'Certificate Approval')
- **triggered_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Pending' | 'Resolved' | 'Ignored')
- **notified_users**: Used to store notified users for this module. (Type: { userId: string; role: string; name: string)

### Entity: ExecutiveMetric

- **id**: Unique identifier for this record. (Type: string)
- **title**: Used to store title for this module. (Type: string)
- **value**: Used to store value for this module. (Type: string)
- **change**: Used to store change for this module. (Type: number)
- **change_type**: Used to store change type for this module. (Type: 'increase' | 'decrease' | 'neutral')
- **timeframe**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: RiskIndicator

- **id**: Unique identifier for this record. (Type: string)
- **department**: Used to store department for this module. (Type: string)
- **risk_level**: Used to store risk level for this module. (Type: 'Low' | 'Medium' | 'High' | 'Critical')
- **description**: Used to store description for this module. (Type: string)
- **mitigation**: Used to store mitigation for this module. (Type: string)

### Entity: ExportJob

- **id**: Unique identifier for this record. (Type: string)
- **module**: Maps the item to a product module or feature area. (Type: string)
- **format**: Stores the relevant date/time for sorting, auditing, or display. (Type: 'PDF' | 'Excel' | 'CSV' | 'JSON')
- **requested_by**: Used to store requested by for this module. (Type: string)
- **requested_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Pending' | 'Processing' | 'Completed' | 'Failed')
- **file_url**: Used to store file url for this module. (Type: string)

### Entity: ExportSchedule

- **id**: Unique identifier for this record. (Type: string)
- **name**: Stores the display name for name. (Type: string)
- **module**: Maps the item to a product module or feature area. (Type: string)
- **frequency**: Used to store frequency for this module. (Type: 'Daily' | 'Weekly' | 'Monthly')
- **format**: Stores the relevant date/time for sorting, auditing, or display. (Type: 'PDF' | 'Excel' | 'CSV')
- **recipients**: Collection of recipients values used to render lists or related records. (Type: string[])
- **next_run**: Used to store next run for this module. (Type: string)

### Entity: FeeStructure

- **id**: Unique identifier for this record. (Type: string)
- **fee_name**: Stores the display name for fee. (Type: string)
- **fee_type**: Used to store fee type for this module. (Type: FeeType)
- **amount**: Used to store amount for this module. (Type: number)
- **program**: Used to store program for this module. (Type: string)
- **department**: Used to store department for this module. (Type: string)
- **duration**: Used to store duration for this module. (Type: string)
- **applicable_batch**: Used to store applicable batch for this module. (Type: string)
- **installments**: Used to store installments for this module. (Type: number)
- **late_fee**: Used to store late fee for this module. (Type: number)
- **status**: Tracks the current lifecycle or processing state. (Type: FeeStatus)

### Entity: FeedbackBase

- **id**: Unique identifier for this record. (Type: string)
- **type**: Used to store type for this module. (Type: FeedbackType)
- **provider_id**: References the related provider record. (Type: string)
- **provider_role**: Defines the assigned role or role label for access control. (Type: 'Student' | 'Mentor' | 'College')
- **target_id**: References the related target record. (Type: string)
- **date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **rating**: Used to store rating for this module. (Type: number)
- **comments**: Used to store comments for this module. (Type: string)

### Entity: FeedbackCreate

- **type**: Used to store type for this module. (Type: FeedbackType)
- **target_id**: References the related target record. (Type: string)
- **rating**: Used to store rating for this module. (Type: number)
- **comments**: Used to store comments for this module. (Type: string)

### Entity: FinanceMetrics

- **todays_collection**: Used to store todays collection for this module. (Type: number)
- **monthly_revenue**: Used to store monthly revenue for this module. (Type: number)
- **pending_payments**: Used to store pending payments for this module. (Type: number)
- **total_transactions**: Stores an aggregated numeric total used in stats or summaries. (Type: number)
- **refund_requests**: Used to store refund requests for this module. (Type: number)
- **wallet_balance**: Used to store wallet balance for this module. (Type: number)
- **revenue_growth**: Used to store revenue growth for this module. (Type: number)

### Entity: TicketComment

- **id**: Unique identifier for this record. (Type: string)
- **ticket_id**: References the related ticket record. (Type: string)
- **author_id**: References the related author record. (Type: string)
- **author_name**: Stores the display name for author. (Type: string)
- **author_avatar**: Used to store author avatar for this module. (Type: string)
- **content**: Stores the main content rendered or sent to the user. (Type: string)
- **timestamp**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **is_internal**: Boolean flag used to control state, visibility, or validation. (Type: boolean)

### Entity: Ticket

- **id**: Unique identifier for this record. (Type: string)
- **ticket_number**: Used to store ticket number for this module. (Type: string)
- **title**: Used to store title for this module. (Type: string)
- **description**: Used to store description for this module. (Type: string)
- **category**: Used to store category for this module. (Type: TicketCategory)
- **priority**: Used to store priority for this module. (Type: TicketPriority)
- **status**: Tracks the current lifecycle or processing state. (Type: TicketStatus)
- **created_by**: Used to store created by for this module. (Type: string)
- **creator_name**: Stores the display name for creator. (Type: string)
- **assigned_to**: Used to store assigned to for this module. (Type: string)
- **assignee_name**: Stores the display name for assignee. (Type: string)
- **department**: Used to store department for this module. (Type: string)
- **created_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **updated_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **resolved_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **sla_breach**: Used to store sla breach for this module. (Type: boolean)
- **sla_due_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **comments**: Collection of comments values used to render lists or related records. (Type: TicketComment[])

### Entity: KnowledgeBaseArticle

- **id**: Unique identifier for this record. (Type: string)
- **title**: Used to store title for this module. (Type: string)
- **category**: Used to store category for this module. (Type: string)
- **content**: Stores the main content rendered or sent to the user. (Type: string)
- **views**: Used to store views for this module. (Type: number)
- **helpful_count**: Stores an aggregated numeric total used in stats or summaries. (Type: number)

### Entity: DigitalIDCard

- **id**: Unique identifier for this record. (Type: string)
- **card_number**: Used to store card number for this module. (Type: string)
- **student_id**: References the related student record. (Type: string)
- **student_name**: Stores the display name for student. (Type: string)
- **department**: Used to store department for this module. (Type: string)
- **program**: Used to store program for this module. (Type: string)
- **batch**: Used to store batch for this module. (Type: string)
- **photo_url**: Used to store photo url for this module. (Type: string)
- **qr_code_data**: Used to store qr code data for this module. (Type: string)
- **issue_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **expiry_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: IDCardStatus)
- **blood_group**: Used to store blood group for this module. (Type: string)
- **emergency_contact**: Used to store emergency contact for this module. (Type: string)

### Entity: InsightForecast

- **id**: Unique identifier for this record. (Type: string)
- **metric**: Used to store metric for this module. (Type: string)
- **historical_values**: Collection of historical values values used to render lists or related records. (Type: number[])
- **predicted_values**: Collection of predicted values values used to render lists or related records. (Type: number[])
- **confidence**: Used to store confidence for this module. (Type: number)

### Entity: StudentRisk

- **student_id**: References the related student record. (Type: string)
- **name**: Stores the display name for name. (Type: string)
- **program**: Used to store program for this module. (Type: string)
- **risk_score**: Used to store risk score for this module. (Type: number)
- **factors**: Collection of factors values used to render lists or related records. (Type: string[])

### Entity: KPIMetric

- **id**: Unique identifier for this record. (Type: string)
- **name**: Stores the display name for name. (Type: string)
- **category**: Used to store category for this module. (Type: string)
- **current_value**: Used to store current value for this module. (Type: number)
- **target_value**: Used to store target value for this module. (Type: number)
- **unit**: Used to store unit for this module. (Type: string)
- **trend**: Used to store trend for this module. (Type: 'up' | 'down' | 'flat')
- **trend_percentage**: Stores a calculated percentage or rate metric. (Type: number)
- **status**: Tracks the current lifecycle or processing state. (Type: 'on_track' | 'at_risk' | 'behind')
- **last_updated**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: LeaveRequest

- **id**: Unique identifier for this record. (Type: string)
- **user_id**: References the related user record. (Type: string)
- **user_name**: Stores the display name for user. (Type: string)
- **role**: Defines the assigned role or role label for access control. (Type: 'Student' | 'Mentor' | 'Employee')
- **leave_type**: Used to store leave type for this module. (Type: 'Medical' | 'Casual' | 'Emergency' | 'OD' | 'WFH')
- **start_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **end_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **reason**: Used to store reason for this module. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Pending' | 'Approved' | 'Rejected')
- **supporting_document**: Used to store supporting document for this module. (Type: string)
- **applied_on**: Used to store applied on for this module. (Type: string)
- **approved_by**: Used to store approved by for this module. (Type: string)
- **approval_remarks**: Used to store approval remarks for this module. (Type: string)

### Entity: LeaveTimelineEvent

- **id**: Unique identifier for this record. (Type: string)
- **leave_id**: References the related leave record. (Type: string)
- **action**: Used to store action for this module. (Type: 'Applied' | 'Reviewed' | 'Approved' | 'Rejected' | 'Escalated')
- **acted_by**: Used to store acted by for this module. (Type: string)
- **acted_on**: Used to store acted on for this module. (Type: string)
- **remarks**: Used to store remarks for this module. (Type: string)

### Entity: LearningResource

- **id**: Unique identifier for this record. (Type: string)
- **module_id**: References the related module record. (Type: string)
- **title**: Used to store title for this module. (Type: string)
- **resource_type**: Used to store resource_type for this module. (Type: ResourceType)
- **file_id**: References the related file record. (Type: string)
- **external_url**: Used to store external_url for this module. (Type: string)
- **duration**: Used to store duration for this module. (Type: string)
- **completed**: Used to store completed for this module. (Type: boolean)

### Entity: LearningModule

- **id**: Unique identifier for this record. (Type: string)
- **program_id**: References the related program record. (Type: string)
- **title**: Used to store title for this module. (Type: string)
- **category**: Used to store category for this module. (Type: string)
- **image**: Used to store image for this module. (Type: string)
- **progress**: Used to store progress for this module. (Type: number)
- **resources**: Collection of resources values used to render lists or related records. (Type: LearningResource[])

### Entity: MarketplaceOpportunity

- **id**: Unique identifier for this record. (Type: string)
- **title**: Used to store title for this module. (Type: string)
- **company_name**: Stores the display name for company. (Type: string)
- **department**: Used to store department for this module. (Type: string)
- **location**: Used to store location for this module. (Type: string)
- **location_type**: Used to store location type for this module. (Type: InternshipLocationType)
- **type**: Used to store type for this module. (Type: InternshipType)
- **compensation**: Used to store compensation for this module. (Type: InternshipCompensation)
- **stipend**: Used to store stipend for this module. (Type: string)
- **duration_months**: Used to store duration months for this module. (Type: number)
- **skills**: Collection of skills values used to render lists or related records. (Type: string[])
- **description**: Used to store description for this module. (Type: string)
- **requirements**: Collection of requirements values used to render lists or related records. (Type: string[])
- **posted_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **deadline_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **is_active**: Boolean flag used to control state, visibility, or validation. (Type: boolean)
- **applicants_count**: Stores an aggregated numeric total used in stats or summaries. (Type: number)

### Entity: MarketplaceApplication

- **id**: Unique identifier for this record. (Type: string)
- **opportunity_id**: References the related opportunity record. (Type: string)
- **student_id**: References the related student record. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Pending' | 'Under Review' | 'Interview' | 'Offered' | 'Rejected')
- **applied_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **match_score**: Used to store match score for this module. (Type: number)

### Entity: MentorProfile

- **mentor_profile_id**: References the related mentor_profile record. (Type: string)
- **employee_id**: References the related employee record. (Type: string)
- **employee_name**: Stores the display name for employee. (Type: string)
- **mentor_bio**: Used to store mentor_bio for this module. (Type: string)
- **mentor_expertise**: Collection of mentor_expertise values used to render lists or related records. (Type: string[])
- **years_of_experience**: Used to store years_of_experience for this module. (Type: number)
- **max_student_capacity**: Used to store max_student_capacity for this module. (Type: number)
- **current_student_count**: Stores an aggregated numeric total used in stats or summaries. (Type: number)
- **is_available**: Boolean flag used to control state, visibility, or validation. (Type: boolean)
- **created_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **updated_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: MentorAssignment

- **id**: Unique identifier for this record. (Type: string)
- **mentor_profile_id**: References the related mentor profile record. (Type: string)
- **mentor_name**: Stores the display name for mentor. (Type: string)
- **employee_id**: References the related employee record. (Type: string)
- **student_id**: References the related student record. (Type: string)
- **student_name**: Stores the display name for student. (Type: string)
- **intern_id**: References the related intern record. (Type: string)
- **batch_id**: References the related batch record. (Type: string)
- **batch_name**: Stores the display name for batch. (Type: string)
- **assigned_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Active' | 'Completed' | 'Transferred')
- **assigned_by**: Used to store assigned by for this module. (Type: string)

### Entity: MentorBatchMapping

- **id**: Unique identifier for this record. (Type: string)
- **mentor_profile_id**: References the related mentor profile record. (Type: string)
- **mentor_name**: Stores the display name for mentor. (Type: string)
- **employee_id**: References the related employee record. (Type: string)
- **batch_id**: References the related batch record. (Type: string)
- **batch_name**: Stores the display name for batch. (Type: string)
- **batch_code**: Used to store batch code for this module. (Type: string)
- **program_name**: Stores the display name for program. (Type: string)
- **student_count**: Stores an aggregated numeric total used in stats or summaries. (Type: number)
- **batch_capacity**: Used to store batch capacity for this module. (Type: number)
- **mapped_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Active' | 'Completed' | 'Upcoming')
- **mapped_by**: Used to store mapped by for this module. (Type: string)

### Entity: Module

- **id**: Unique identifier for this record. (Type: string)
- **code**: Used to store code for this module. (Type: string)
- **name**: Stores the display name for name. (Type: string)
- **route**: Defines the navigation target or URL path. (Type: string)
- **active**: Boolean flag used to control state, visibility, or validation. (Type: boolean)
- **desc**: Used to store desc for this module. (Type: string)

### Entity: Notification

- **id**: Unique identifier for this record. (Type: string)
- **title**: Used to store title for this module. (Type: string)
- **message**: Stores the main content rendered or sent to the user. (Type: string)
- **recipient**: Used to store recipient for this module. (Type: string)
- **role**: Defines the assigned role or role label for access control. (Type: string)
- **module**: Maps the item to a product module or feature area. (Type: string)
- **channel**: Used to store channel for this module. (Type: NotificationChannel)
- **priority**: Used to store priority for this module. (Type: NotificationPriority)
- **status**: Tracks the current lifecycle or processing state. (Type: NotificationStatus)
- **scheduled_time**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **delivered_time**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **read_status**: Tracks the current lifecycle or processing state. (Type: boolean)
- **retry_count**: Stores an aggregated numeric total used in stats or summaries. (Type: number)
- **created_time**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: OpeningCreate

- **program_id**: References the related program record. (Type: string)
- **role_name**: Stores the display name for role_name. (Type: string)
- **role_description**: Defines the assigned role or role label for access control. (Type: string)
- **project_title**: Used to store project_title for this module. (Type: string)
- **duration_weeks**: Used to store duration_weeks for this module. (Type: number)
- **stipend_amount**: Used to store stipend_amount for this module. (Type: number)
- **fee_amount**: Used to store fee_amount for this module. (Type: number)
- **total_openings**: Stores an aggregated numeric total used in stats or summaries. (Type: number)
- **application_deadline**: Used to store application_deadline for this module. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: string)

### Entity: OpeningResponse

- **opening_id**: References the related opening record. (Type: string)
- **program_id**: References the related program record. (Type: string)
- **role_name**: Stores the display name for role_name. (Type: string)
- **role_description**: Defines the assigned role or role label for access control. (Type: string)
- **project_title**: Used to store project_title for this module. (Type: string)
- **duration_weeks**: Used to store duration_weeks for this module. (Type: number)
- **stipend_amount**: Used to store stipend_amount for this module. (Type: number)
- **fee_amount**: Used to store fee_amount for this module. (Type: number)
- **total_openings**: Stores an aggregated numeric total used in stats or summaries. (Type: number)
- **application_deadline**: Used to store application_deadline for this module. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: string)
- **created_by**: Used to store created_by for this module. (Type: string)
- **created_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **updated_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: OpeningMentorCreate

- **employee_id**: References the related employee record. (Type: string)

### Entity: OpeningMentorResponse

- **opening_mentor_id**: References the related opening_mentor record. (Type: string)
- **opening_id**: References the related opening record. (Type: string)
- **employee_id**: References the related employee record. (Type: string)
- **assigned_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: CollegeCreate

- **college_code**: Used to store college_code for this module. (Type: string)
- **college_name**: Stores the display name for college_name. (Type: string)
- **college_email**: Stores the email address used for communication or identification. (Type: string)
- **college_phone**: Stores the contact phone number. (Type: string)
- **website_url**: Used to store website_url for this module. (Type: string)
- **address_line_1**: Used to store address_line_1 for this module. (Type: string)
- **address_line_2**: Used to store address_line_2 for this module. (Type: string)
- **city**: Used to store city for this module. (Type: string)
- **state**: Used to store state for this module. (Type: string)
- **country**: Stores an aggregated numeric total used in stats or summaries. (Type: string)
- **postal_code**: Used to store postal_code for this module. (Type: string)
- **accreditation**: Used to store accreditation for this module. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: string)

### Entity: CollegeResponse

- **college_id**: References the related college record. (Type: string)
- **college_code**: Used to store college_code for this module. (Type: string)
- **college_name**: Stores the display name for college_name. (Type: string)
- **college_email**: Stores the email address used for communication or identification. (Type: string)
- **college_phone**: Stores the contact phone number. (Type: string)
- **website_url**: Used to store website_url for this module. (Type: string)
- **address_line_1**: Used to store address_line_1 for this module. (Type: string)
- **address_line_2**: Used to store address_line_2 for this module. (Type: string)
- **city**: Used to store city for this module. (Type: string)
- **state**: Used to store state for this module. (Type: string)
- **country**: Stores an aggregated numeric total used in stats or summaries. (Type: string)
- **postal_code**: Used to store postal_code for this module. (Type: string)
- **accreditation**: Used to store accreditation for this module. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: string)
- **created_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **updated_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: DepartmentCreate

- **college_id**: References the related college record. (Type: string)
- **department_code**: Used to store department_code for this module. (Type: string)
- **department_name**: Stores the display name for department_name. (Type: string)
- **hod_name**: Stores the display name for hod_name. (Type: string)
- **department_email**: Stores the email address used for communication or identification. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: string)

### Entity: DepartmentResponse

- **department_id**: References the related department record. (Type: string)
- **college_id**: References the related college record. (Type: string)
- **department_code**: Used to store department_code for this module. (Type: string)
- **department_name**: Stores the display name for department_name. (Type: string)
- **hod_name**: Stores the display name for hod_name. (Type: string)
- **department_email**: Stores the email address used for communication or identification. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: string)
- **created_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **updated_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: CoordinatorCreate

- **employee_id**: References the related employee record. (Type: string)
- **college_id**: References the related college record. (Type: string)
- **assigned_from**: Used to store assigned_from for this module. (Type: string)
- **assigned_to**: Used to store assigned_to for this module. (Type: string)

### Entity: CoordinatorResponse

- **coordinator_mapping_id**: References the related coordinator_mapping record. (Type: string)
- **employee_id**: References the related employee record. (Type: string)
- **college_id**: References the related college record. (Type: string)
- **assigned_from**: Used to store assigned_from for this module. (Type: string)
- **assigned_to**: Used to store assigned_to for this module. (Type: string)
- **is_active**: Boolean flag used to control state, visibility, or validation. (Type: boolean)
- **created_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: PaymentTransaction

- **id**: Unique identifier for this record. (Type: string)
- **transaction_id**: References the related transaction record. (Type: string)
- **invoice_number**: Used to store invoice number for this module. (Type: string)
- **student_id**: References the related student record. (Type: string)
- **student_name**: Stores the display name for student. (Type: string)
- **program**: Used to store program for this module. (Type: string)
- **amount**: Used to store amount for this module. (Type: number)
- **gst**: Used to store gst for this module. (Type: number)
- **discount**: Stores an aggregated numeric total used in stats or summaries. (Type: number)
- **fine**: Used to store fine for this module. (Type: number)
- **net_amount**: Used to store net amount for this module. (Type: number)
- **payment_method**: Used to store payment method for this module. (Type: PaymentMode)
- **reference_number**: Used to store reference number for this module. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: PaymentStatus)
- **created_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **paid_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **verified_by**: Used to store verified by for this module. (Type: string)

### Entity: StudentPerformance

- **student_id**: References the related student record. (Type: string)
- **batch_id**: References the related batch record. (Type: string)
- **average_score**: Used to store average_score for this module. (Type: number)
- **attendance_rate**: Stores a calculated percentage or rate metric. (Type: number)
- **task_completion_rate**: Stores a calculated percentage or rate metric. (Type: number)
- **assessment_score**: Used to store assessment_score for this module. (Type: number)
- **is_at_risk**: Boolean flag used to control state, visibility, or validation. (Type: boolean)

### Entity: BatchPerformance

- **batch_id**: References the related batch record. (Type: string)
- **average_score**: Used to store average_score for this module. (Type: number)
- **attendance_rate**: Stores a calculated percentage or rate metric. (Type: number)
- **task_completion_rate**: Stores a calculated percentage or rate metric. (Type: number)
- **assessment_score**: Used to store assessment_score for this module. (Type: number)

### Entity: Company

- **id**: Unique identifier for this record. (Type: string)
- **name**: Stores the display name for name. (Type: string)
- **industry**: Used to store industry for this module. (Type: string)
- **logo_url**: Used to store logo url for this module. (Type: string)
- **website**: Used to store website for this module. (Type: string)
- **contact_person**: Used to store contact person for this module. (Type: string)
- **contact_email**: Stores the email address used for communication or identification. (Type: string)
- **active_roles**: Defines the assigned role or role label for access control. (Type: number)

### Entity: PlacementRecord

- **id**: Unique identifier for this record. (Type: string)
- **student_id**: References the related student record. (Type: string)
- **student_name**: Stores the display name for student. (Type: string)
- **program**: Used to store program for this module. (Type: string)
- **company_id**: References the related company record. (Type: string)
- **company_name**: Stores the display name for company. (Type: string)
- **role**: Defines the assigned role or role label for access control. (Type: string)
- **package**: Used to store package for this module. (Type: string)
- **location**: Used to store location for this module. (Type: string)
- **stage**: Used to store stage for this module. (Type: PlacementStage)
- **interview_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **offer_status**: Tracks the current lifecycle or processing state. (Type: 'Pending' | 'Accepted' | 'Declined')
- **joining_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **remarks**: Used to store remarks for this module. (Type: string)
- **last_updated**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: Bookmark

- **id**: Unique identifier for this record. (Type: string)
- **title**: Used to store title for this module. (Type: string)
- **url**: Used to store url for this module. (Type: string)
- **category**: Used to store category for this module. (Type: string)

### Entity: StickyNote

- **id**: Unique identifier for this record. (Type: string)
- **content**: Stores the main content rendered or sent to the user. (Type: string)
- **color**: Used to store color for this module. (Type: 'yellow' | 'blue' | 'green' | 'pink')
- **created_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: PersonalTask

- **id**: Unique identifier for this record. (Type: string)
- **title**: Used to store title for this module. (Type: string)
- **completed**: Used to store completed for this module. (Type: boolean)
- **due_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: ProductivityWorkspace

- **bookmarks**: Collection of bookmarks values used to render lists or related records. (Type: Bookmark[])
- **notes**: Collection of notes values used to render lists or related records. (Type: StickyNote[])
- **tasks**: Collection of tasks values used to render lists or related records. (Type: PersonalTask[])

### Entity: InternshipTypeCreate

- **type_code**: Used to store type_code for this module. (Type: string)
- **type_name**: Stores the display name for type_name. (Type: string)
- **description**: Used to store description for this module. (Type: string)

### Entity: InternshipTypeResponse

- **internship_type_id**: References the related internship_type record. (Type: string)
- **type_code**: Used to store type_code for this module. (Type: string)
- **type_name**: Stores the display name for type_name. (Type: string)
- **description**: Used to store description for this module. (Type: string)
- **is_active**: Boolean flag used to control state, visibility, or validation. (Type: boolean)

### Entity: ProgramCreate

- **internship_type_id**: References the related internship_type record. (Type: string)
- **program_code**: Used to store program_code for this module. (Type: string)
- **program_name**: Stores the display name for program_name. (Type: string)
- **program_description**: Used to store program_description for this module. (Type: string)
- **duration_weeks**: Used to store duration_weeks for this module. (Type: number)
- **certificate_available**: Used to store certificate_available for this module. (Type: boolean)
- **status**: Tracks the current lifecycle or processing state. (Type: string)

### Entity: ProgramResponse

- **program_id**: References the related program record. (Type: string)
- **internship_type_id**: References the related internship_type record. (Type: string)
- **program_code**: Used to store program_code for this module. (Type: string)
- **program_name**: Stores the display name for program_name. (Type: string)
- **program_description**: Used to store program_description for this module. (Type: string)
- **duration_weeks**: Used to store duration_weeks for this module. (Type: number)
- **certificate_available**: Used to store certificate_available for this module. (Type: boolean)
- **status**: Tracks the current lifecycle or processing state. (Type: string)

### Entity: Referral

- **id**: Unique identifier for this record. (Type: string)
- **referral_code**: Used to store referral code for this module. (Type: string)
- **referrer_id**: References the related referrer record. (Type: string)
- **referrer_name**: Stores the display name for referrer. (Type: string)
- **candidate_name**: Stores the display name for candidate. (Type: string)
- **candidate_email**: Stores the email address used for communication or identification. (Type: string)
- **program**: Used to store program for this module. (Type: string)
- **reward_points**: Used to store reward points for this module. (Type: number)
- **status**: Tracks the current lifecycle or processing state. (Type: ReferralStatus)
- **created_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **joined_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **reward_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: ReferralCampaign

- **id**: Unique identifier for this record. (Type: string)
- **title**: Used to store title for this module. (Type: string)
- **description**: Used to store description for this module. (Type: string)
- **reward_multiplier**: Used to store reward multiplier for this module. (Type: number)
- **end_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: ReportRecord

- **id**: Unique identifier for this record. (Type: string)
- **name**: Stores the display name for name. (Type: string)
- **type**: Used to store type for this module. (Type: string)
- **generated_by**: Stores a calculated percentage or rate metric. (Type: string)
- **generated_date**: Stores a calculated percentage or rate metric. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Completed' | 'Processing' | 'Failed')
- **format**: Stores the relevant date/time for sorting, auditing, or display. (Type: 'PDF' | 'Excel' | 'CSV')
- **size_bytes**: Used to store size bytes for this module. (Type: number)
- **download_url**: Used to store download url for this module. (Type: string)

### Entity: ReportTemplate

- **id**: Unique identifier for this record. (Type: string)
- **name**: Stores the display name for name. (Type: string)
- **category**: Used to store category for this module. (Type: string)
- **description**: Used to store description for this module. (Type: string)

### Entity: ReportingManager

- **id**: Unique identifier for this record. (Type: string)
- **user_id**: References the related user record. (Type: string)
- **name**: Stores the display name for name. (Type: string)
- **email**: Stores the email address used for communication or identification. (Type: string)
- **department**: Used to store department for this module. (Type: string)
- **designation**: Used to store designation for this module. (Type: string)
- **assigned_interns_count**: Stores an aggregated numeric total used in stats or summaries. (Type: number)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Active' | 'Inactive')

### Entity: ManagerAssignment

- **id**: Unique identifier for this record. (Type: string)
- **manager_id**: References the related manager record. (Type: string)
- **intern_id**: References the related intern record. (Type: string)
- **assigned_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Active' | 'Completed' | 'Revoked')
- **intern_name**: Stores the display name for intern. (Type: string)
- **batch**: Used to store batch for this module. (Type: string)
- **college**: Used to store college for this module. (Type: string)
- **attendance_percent**: Stores a calculated percentage or rate metric. (Type: number)
- **assessment_percent**: Stores a calculated percentage or rate metric. (Type: number)
- **task_completion_percent**: Stores a calculated percentage or rate metric. (Type: number)
- **performance_score**: Used to store performance score for this module. (Type: number)
- **risk_level**: Used to store risk level for this module. (Type: 'Low' | 'Medium' | 'High')

### Entity: ManagerEvaluation

- **id**: Unique identifier for this record. (Type: string)
- **assignment_id**: References the related assignment record. (Type: string)
- **manager_id**: References the related manager record. (Type: string)
- **intern_id**: References the related intern record. (Type: string)
- **evaluation_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **score**: Used to store score for this module. (Type: number)
- **feedback**: Used to store feedback for this module. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Draft' | 'Submitted')

### Entity: Role

- **id**: Unique identifier for this record. (Type: string)
- **name**: Stores the display name for name. (Type: string)
- **code**: Used to store code for this module. (Type: string)
- **desc**: Used to store desc for this module. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Active' | 'Inactive')
- **modules_count**: Maps the item to a product module or feature area. (Type: number)
- **users_count**: Stores an aggregated numeric total used in stats or summaries. (Type: number)
- **color**: Used to store color for this module. (Type: string)
- **bg**: Used to store bg for this module. (Type: string)
- **module_ids**: Maps the item to a product module or feature area. (Type: string[])
- **permissions**: Defines access rights available to the user or role. (Type: string[])

### Entity: DocumentRequest

- **id**: Unique identifier for this record. (Type: string)
- **type**: Used to store type for this module. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'Pending' | 'Approved' | 'Rejected' | 'Ready')
- **request_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **completion_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: UserProfile

- **id**: Unique identifier for this record. (Type: string)
- **name**: Stores the display name for name. (Type: string)
- **email**: Stores the email address used for communication or identification. (Type: string)
- **phone**: Stores the contact phone number. (Type: string)
- **address**: Used to store address for this module. (Type: string)
- **role**: Defines the assigned role or role label for access control. (Type: string)
- **join_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: SelfServiceDashboard

- **profile**: Used to store profile for this module. (Type: UserProfile)
- **recent_requests**: Collection of recent requests values used to render lists or related records. (Type: DocumentRequest[])
- **pending_actions**: Used to store pending actions for this module. (Type: number)

### Entity: StudentCreate

- **application_id**: References the related application record. (Type: string)
- **program_id**: References the related program record. (Type: string)

### Entity: StudentResponse

- **student_id**: References the related student record. (Type: string)
- **application_id**: References the related application record. (Type: string)
- **program_id**: References the related program record. (Type: string)
- **intern_id**: References the related intern record. (Type: string)
- **student_status**: Tracks the current lifecycle or processing state. (Type: string)
- **joined_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **completed_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **created_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **updated_at**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: StudentUpdate

- **student_status**: Tracks the current lifecycle or processing state. (Type: string)

### Entity: Subtask

- **id**: Unique identifier for this record. (Type: string)
- **phase**: Used to store phase for this module. (Type: number)
- **task**: Used to store task for this module. (Type: string)
- **completed**: Used to store completed for this module. (Type: boolean)

### Entity: Commit

- **commit**: Used to store commit for this module. (Type: string)
- **message**: Stores the main content rendered or sent to the user. (Type: string)
- **author**: Used to store author for this module. (Type: string)
- **date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **guide_comment**: Used to store guide comment for this module. (Type: string)

### Entity: Submission

- **id**: Unique identifier for this record. (Type: string)
- **student_id**: References the related student record. (Type: string)
- **task_id**: References the related task record. (Type: string)
- **assessment_id**: References the related assessment record. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'PENDING' | 'APPROVED' | 'REJECTED')
- **repo_link**: Used to store repo link for this module. (Type: string)
- **live_link**: Used to store live link for this module. (Type: string)
- **subtasks**: Collection of subtasks values used to render lists or related records. (Type: Subtask[])
- **commits**: Collection of commits values used to render lists or related records. (Type: Commit[])
- **submission_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **marks_obtained**: Used to store marks obtained for this module. (Type: number)
- **file_ids**: Collection of file ids values used to render lists or related records. (Type: string[])

### Entity: Task

- **id**: Unique identifier for this record. (Type: string)
- **title**: Used to store title for this module. (Type: string)
- **description**: Used to store description for this module. (Type: string)
- **batch_id**: References the related batch record. (Type: string)
- **assigned_by**: Used to store assigned by for this module. (Type: string)
- **assigned_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **due_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'pending' | 'review' | 'completed')
- **is_overdue**: Boolean flag used to control state, visibility, or validation. (Type: boolean)
- **is_locked**: Boolean flag used to control state, visibility, or validation. (Type: boolean)
- **alert**: Used to store alert for this module. (Type: string)
- **file_ids**: Collection of file ids values used to render lists or related records. (Type: string[])

### Entity: TaskAssignee

- **task_id**: References the related task record. (Type: string)
- **student_id**: References the related student record. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: 'pending' | 'submitted' | 'graded')

### Entity: VerificationRequest

- **id**: Unique identifier for this record. (Type: string)
- **certificate_number**: Used to store certificate number for this module. (Type: string)
- **requested_by_ip**: Used to store requested by ip for this module. (Type: string)
- **request_time**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **method**: Used to store method for this module. (Type: 'Certificate Number' | 'QR Code' | 'Verification Token')
- **result**: Used to store result for this module. (Type: VerificationStatus)

### Entity: VerificationResult

- **status**: Tracks the current lifecycle or processing state. (Type: VerificationStatus)
- **student_name**: Stores the display name for student. (Type: string)
- **program**: Used to store program for this module. (Type: string)
- **batch**: Used to store batch for this module. (Type: string)
- **issue_date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)
- **organization**: Used to store organization for this module. (Type: string)
- **certificate_type**: Used to store certificate type for this module. (Type: string)
- **message**: Stores the main content rendered or sent to the user. (Type: string)
- **preview_url**: Used to store preview url for this module. (Type: string)

### Entity: WalletTransaction

- **id**: Unique identifier for this record. (Type: string)
- **wallet_id**: References the related wallet record. (Type: string)
- **student_id**: References the related student record. (Type: string)
- **student_name**: Stores the display name for student. (Type: string)
- **type**: Used to store type for this module. (Type: WalletTransactionType)
- **amount**: Used to store amount for this module. (Type: number)
- **source**: Used to store source for this module. (Type: WalletSource)
- **reference**: Used to store reference for this module. (Type: string)
- **status**: Tracks the current lifecycle or processing state. (Type: WalletStatus)
- **date**: Stores the relevant date/time for sorting, auditing, or display. (Type: string)

### Entity: WalletSummary

- **wallet_id**: References the related wallet record. (Type: string)
- **student_id**: References the related student record. (Type: string)
- **student_name**: Stores the display name for student. (Type: string)
- **balance**: Used to store balance for this module. (Type: number)
- **total_credits**: Stores an aggregated numeric total used in stats or summaries. (Type: number)
- **total_debits**: Stores an aggregated numeric total used in stats or summaries. (Type: number)

