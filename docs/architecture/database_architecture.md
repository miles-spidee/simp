# Database Architecture

## Activity Schema

### Table: `activity_log`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `user_id` | `VARCHAR(255)` | FOREIGN KEY | References the related user record. |
| `user_name` | `VARCHAR(255)` |  | Stores the display name for user. |
| `role` | `VARCHAR(255)` |  | Defines the assigned role or role label for access control. |
| `module` | `VARCHAR(50)` | CHECK IN ('Login' | 'Attendance' | 'Task' | 'Assessment' | 'Assignment' | 'Leave' | 'Profile' | 'Certificate' | 'Payment') | Maps the item to a product module or feature area. |
| `action` | `VARCHAR(255)` |  | Used to store action for this module. |
| `description` | `VARCHAR(255)` |  | Used to store description for this module. |
| `timestamp` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `device` | `VARCHAR(255)` |  | Used to store device for this module. |
| `browser` | `VARCHAR(255)` |  | Used to store browser for this module. |
| `ip` | `VARCHAR(255)` |  | Used to store ip for this module. |
| `status` | `VARCHAR(50)` | CHECK IN ('Success' | 'Failed' | 'Warning') | Tracks the current lifecycle or processing state. |
| `severity` | `VARCHAR(50)` | CHECK IN ('Info' | 'Low' | 'Medium' | 'High' | 'Critical') | Used to store severity for this module. |

## Alumni Schema

### Table: `career_progress`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `company_name` | `VARCHAR(255)` |  | Stores the display name for company. |
| `designation` | `VARCHAR(255)` |  | Used to store designation for this module. |
| `start_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `end_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `is_current` | `BOOLEAN` |  | Boolean flag used to control state, visibility, or validation. |
| `location` | `VARCHAR(255)` |  | Used to store location for this module. |

### Table: `alumni_profile`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `email` | `VARCHAR(255)` | UNIQUE | Stores the email address used for communication or identification. |
| `phone` | `VARCHAR(255)` |  | Stores the contact phone number. |
| `program` | `VARCHAR(255)` |  | Used to store program for this module. |
| `batch` | `VARCHAR(255)` |  | Used to store batch for this module. |
| `graduation_year` | `NUMERIC` |  | Used to store graduation year for this module. |
| `current_company` | `VARCHAR(255)` |  | Used to store current company for this module. |
| `current_designation` | `VARCHAR(255)` |  | Used to store current designation for this module. |
| `linked_in_url` | `VARCHAR(255)` |  | Used to store linked in url for this module. |
| `career_history` | `JSONB` |  | Collection of career history values used to render lists or related records. |
| `achievements` | `JSONB` |  | Collection of achievements values used to render lists or related records. |
| `is_mentoring` | `BOOLEAN` |  | Boolean flag used to control state, visibility, or validation. |
| `referrals_provided` | `NUMERIC` |  | Used to store referrals provided for this module. |
| `last_updated` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

## Analytics Schema

### Table: `analytics_data_point`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `value` | `NUMERIC` |  | Used to store value for this module. |
| `category` | `VARCHAR(255)` |  | Used to store category for this module. |

### Table: `analytics_summary`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `total_students` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |
| `active_interns` | `NUMERIC` |  | Boolean flag used to control state, visibility, or validation. |
| `completion_rate` | `NUMERIC` |  | Stores a calculated percentage or rate metric. |
| `attendance_rate` | `NUMERIC` |  | Stores a calculated percentage or rate metric. |
| `average_score` | `NUMERIC` |  | Used to store average score for this module. |
| `placement_rate` | `NUMERIC` |  | Stores a calculated percentage or rate metric. |
| `revenue` | `NUMERIC` |  | Used to store revenue for this module. |
| `certificates_issued` | `NUMERIC` |  | Used to store certificates issued for this module. |

### Table: `analytics_dimension`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `value` | `NUMERIC` |  | Used to store value for this module. |
| `percentage` | `NUMERIC` |  | Stores a calculated percentage or rate metric. |

## Announcement Schema

### Table: `announcement`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `title` | `VARCHAR(255)` |  | Used to store title for this module. |
| `description` | `VARCHAR(255)` |  | Used to store description for this module. |
| `audience` | `JSONB` |  | Collection of audience values used to render lists or related records. |
| `category` | `VARCHAR(255)` |  | Used to store category for this module. |
| `priority` | `VARCHAR(255)` |  | Used to store priority for this module. |
| `attachments` | `JSONB` |  | Collection of attachments values used to render lists or related records. |
| `publish_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `expiry_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `pinned` | `BOOLEAN` |  | Used to store pinned for this module. |
| `author` | `VARCHAR(255)` |  | Used to store author for this module. |

## Application Schema

### Table: `application_personal_information`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `photo` | `VARCHAR(255)` |  | Used to store photo for this module. |
| `first_name` | `VARCHAR(255)` |  | Stores the display name for first. |
| `last_name` | `VARCHAR(255)` |  | Stores the display name for last. |
| `email` | `VARCHAR(255)` | UNIQUE | Stores the email address used for communication or identification. |
| `mobile_number` | `VARCHAR(255)` |  | Used to store mobile number for this module. |
| `date_of_birth` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `gender` | `VARCHAR(255)` |  | Used to store gender for this module. |
| `city` | `VARCHAR(255)` |  | Used to store city for this module. |
| `state` | `VARCHAR(255)` |  | Used to store state for this module. |

### Table: `application_academic_information`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `college_name` | `VARCHAR(255)` |  | Stores the display name for college. |
| `department` | `VARCHAR(255)` |  | Used to store department for this module. |
| `degree` | `VARCHAR(255)` |  | Used to store degree for this module. |
| `current_year` | `VARCHAR(255)` |  | Used to store current year for this module. |
| `cgpa_percentage` | `VARCHAR(255)` |  | Stores a calculated percentage or rate metric. |
| `graduation_year` | `VARCHAR(255)` |  | Used to store graduation year for this module. |

### Table: `application_professional_information`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `skills` | `VARCHAR(255)` |  | Used to store skills for this module. |
| `github_url` | `VARCHAR(255)` |  | Used to store github url for this module. |
| `linkedin_url` | `VARCHAR(255)` |  | Used to store linkedin url for this module. |
| `portfolio_url` | `VARCHAR(255)` |  | Used to store portfolio url for this module. |
| `project_experience` | `VARCHAR(255)` |  | Used to store project experience for this module. |

### Table: `application_internship_specific_data`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `payment_mode` | `VARCHAR(255)` |  | Used to store payment mode for this module. |
| `transaction_id` | `VARCHAR(255)` | FOREIGN KEY | References the related transaction record. |
| `relevant_experience` | `VARCHAR(255)` |  | Used to store relevant experience for this module. |
| `preferred_tech_stack` | `VARCHAR(255)` |  | Used to store preferred tech stack for this module. |
| `relevant_technical_experience` | `VARCHAR(255)` |  | Used to store relevant technical experience for this module. |
| `research_area_of_interest` | `VARCHAR(255)` |  | Used to store research area of interest for this module. |
| `research_interest_statement` | `VARCHAR(255)` |  | Used to store research interest statement for this module. |
| `publication_links` | `VARCHAR(255)` |  | Used to store publication links for this module. |
| `payment_screenshot` | `VARCHAR(255)` |  | Used to store payment screenshot for this module. |

### Table: `application_documents`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `resume` | `VARCHAR(255)` |  | Used to store resume for this module. |
| `passbook` | `VARCHAR(255)` |  | Used to store passbook for this module. |

### Table: `application_motivation`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `why_internship` | `VARCHAR(255)` |  | Used to store why internship for this module. |

### Table: `application_create`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `internship_type` | `VARCHAR(255)` |  | Used to store internship type for this module. |
| `personal_information` | `VARCHAR(255)` |  | Used to store personal information for this module. |
| `academic_information` | `VARCHAR(255)` |  | Used to store academic information for this module. |
| `professional_information` | `VARCHAR(255)` |  | Used to store professional information for this module. |
| `internship_specific_data` | `VARCHAR(255)` |  | Used to store internship specific data for this module. |
| `documents` | `VARCHAR(255)` |  | Used to store documents for this module. |
| `motivation` | `VARCHAR(255)` |  | Used to store motivation for this module. |

### Table: `application_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `opening_id` | `VARCHAR(255)` | FOREIGN KEY | References the related opening record. |
| `application_id` | `VARCHAR(255)` | FOREIGN KEY | References the related application record. |
| `applicant_user_id` | `VARCHAR(255)` | FOREIGN KEY | References the related applicant_user record. |
| `application_status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `applied_at` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `reviewed_at` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `reviewed_by` | `VARCHAR(255)` |  | Used to store reviewed_by for this module. |
| `remarks` | `VARCHAR(255)` |  | Used to store remarks for this module. |
| `profile` | `VARCHAR(255)` |  | Used to store profile for this module. |

### Table: `application_review_request`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `application_status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `remarks` | `VARCHAR(255)` |  | Used to store remarks for this module. |

## Assessment Schema

### Table: `assessment`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `title` | `VARCHAR(255)` |  | Used to store title for this module. |
| `assessment_type` | `VARCHAR(255)` |  | Used to store assessment type for this module. |
| `batch_id` | `VARCHAR(255)` | FOREIGN KEY | References the related batch record. |
| `total_marks` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |
| `passing_marks` | `NUMERIC` |  | Used to store passing marks for this module. |
| `date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `status` | `VARCHAR(50)` | CHECK IN ('Upcoming' | 'Active' | 'Completed') | Tracks the current lifecycle or processing state. |
| `file_ids` | `JSONB` |  | Collection of file ids values used to render lists or related records. |

### Table: `assessment_submission`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `assessment_id` | `VARCHAR(255)` | FOREIGN KEY | References the related assessment record. |
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `score` | `NUMERIC` |  | Used to store score for this module. |
| `status` | `VARCHAR(50)` | CHECK IN ('Pending Grading' | 'Graded' | 'Missed') | Tracks the current lifecycle or processing state. |
| `submitted_at` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `file_ids` | `JSONB` |  | Collection of file ids values used to render lists or related records. |

## Attendance Schema

### Table: `attendance_session`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `batch_id` | `VARCHAR(255)` | FOREIGN KEY | References the related batch record. |
| `date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `created_by` | `VARCHAR(255)` |  | Used to store created by for this module. |
| `status` | `VARCHAR(50)` | CHECK IN ('Open' | 'Closed') | Tracks the current lifecycle or processing state. |

### Table: `attendance_record`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `session_id` | `VARCHAR(255)` | FOREIGN KEY | References the related session record. |
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `clock_in` | `VARCHAR(255)` |  | Used to store clock in for this module. |
| `clock_out` | `VARCHAR(255)` |  | Used to store clock out for this module. |

### Table: `attendance_status`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `present_days` | `NUMERIC` |  | Used to store present days for this module. |
| `absent_days` | `NUMERIC` |  | Used to store absent days for this module. |
| `late_days` | `NUMERIC` |  | Used to store late days for this module. |
| `leave_days` | `NUMERIC` |  | Used to store leave days for this module. |
| `average_attendance` | `NUMERIC` |  | Used to store average attendance for this module. |
| `is_checked_in` | `BOOLEAN` |  | Boolean flag used to control state, visibility, or validation. |
| `clock_in_time` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

## Auth Schema

### Table: `register_request`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `username` | `VARCHAR(255)` |  | Stores the display name for username. |
| `email` | `VARCHAR(255)` | UNIQUE | Stores the email address used for communication or identification. |
| `password` | `VARCHAR(255)` |  | Used to store password for this module. |

### Table: `register_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `user_id` | `VARCHAR(255)` | FOREIGN KEY | References the related user record. |
| `username` | `VARCHAR(255)` |  | Stores the display name for username. |
| `email` | `VARCHAR(255)` | UNIQUE | Stores the email address used for communication or identification. |
| `is_active` | `BOOLEAN` |  | Boolean flag used to control state, visibility, or validation. |
| `is_email_verified` | `BOOLEAN` |  | Stores the email address used for communication or identification. |
| `is_first_login` | `BOOLEAN` |  | Boolean flag used to control state, visibility, or validation. |
| `last_login_at` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `created_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |
| `updated_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `login_request`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `username` | `VARCHAR(255)` |  | Stores the display name for username. |
| `password` | `VARCHAR(255)` |  | Used to store password for this module. |

### Table: `login_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `access_token` | `VARCHAR(255)` |  | Used to store access_token for this module. |
| `refresh_token` | `VARCHAR(255)` |  | Used to store refresh_token for this module. |
| `token_type` | `VARCHAR(255)` |  | Used to store token_type for this module. |

### Table: `current_user_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `user_id` | `VARCHAR(255)` | FOREIGN KEY | References the related user record. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `email` | `VARCHAR(255)` | UNIQUE | Stores the email address used for communication or identification. |
| `role_name` | `VARCHAR(255)` |  | Stores the display name for role. |
| `role_id` | `VARCHAR(255)` | FOREIGN KEY | References the related role record. |
| `role_code` | `VARCHAR(255)` |  | Defines the assigned role or role label for access control. |
| `modules` | `JSONB` |  | Maps the item to a product module or feature area. |
| `permissions` | `JSONB` |  | Defines access rights available to the user or role. |

### Table: `auth_action_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `message` | `VARCHAR(255)` |  | Stores the main content rendered or sent to the user. |
| `success` | `BOOLEAN` |  | Used to store success for this module. |

### Table: `assign_role_request`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `user_id` | `VARCHAR(255)` | FOREIGN KEY | References the related user record. |
| `role_id` | `VARCHAR(255)` | FOREIGN KEY | References the related role record. |

### Table: `assign_permission_request`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `role_id` | `VARCHAR(255)` | FOREIGN KEY | References the related role record. |
| `permission_id` | `VARCHAR(255)` | FOREIGN KEY | References the related permission record. |

### Table: `forgot_password_request`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `username` | `VARCHAR(255)` |  | Stores the display name for username. |

### Table: `forgot_password_verify`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `username` | `VARCHAR(255)` |  | Stores the display name for username. |
| `otp` | `VARCHAR(255)` |  | Used to store otp for this module. |

### Table: `forgot_password_reset`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `username` | `VARCHAR(255)` |  | Stores the display name for username. |
| `otp` | `VARCHAR(255)` |  | Used to store otp for this module. |
| `new_password` | `VARCHAR(255)` |  | Used to store new password for this module. |

## Batch Schema

### Table: `batch_create`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `program_id` | `VARCHAR(255)` | FOREIGN KEY | References the related program record. |
| `batch_code` | `VARCHAR(255)` |  | Used to store batch_code for this module. |
| `batch_name` | `VARCHAR(255)` |  | Stores the display name for batch_name. |
| `max_capacity` | `NUMERIC` |  | Used to store max_capacity for this module. |
| `start_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `end_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `batch_status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |

### Table: `batch_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `batch_id` | `VARCHAR(255)` | FOREIGN KEY | References the related batch record. |
| `program_id` | `VARCHAR(255)` | FOREIGN KEY | References the related program record. |
| `batch_code` | `VARCHAR(255)` |  | Used to store batch_code for this module. |
| `batch_name` | `VARCHAR(255)` |  | Stores the display name for batch_name. |
| `max_capacity` | `NUMERIC` |  | Used to store max_capacity for this module. |
| `start_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `end_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `batch_status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `created_by` | `VARCHAR(255)` |  | Used to store created_by for this module. |
| `created_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |
| `updated_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `batch_student_create`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `assigned_by` | `VARCHAR(255)` |  | Used to store assigned_by for this module. |

### Table: `batch_student_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `batch_student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related batch_student record. |
| `batch_id` | `VARCHAR(255)` | FOREIGN KEY | References the related batch record. |
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `assigned_at` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `assigned_by` | `VARCHAR(255)` |  | Used to store assigned_by for this module. |

## Billing Schema

### Table: `invoice_item`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `description` | `VARCHAR(255)` |  | Used to store description for this module. |
| `amount` | `NUMERIC` |  | Used to store amount for this module. |

### Table: `invoice`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `invoice_number` | `VARCHAR(255)` |  | Used to store invoice number for this module. |
| `customer_name` | `VARCHAR(255)` |  | Stores the display name for customer. |
| `items` | `JSONB` |  | Collection of items values used to render lists or related records. |
| `sub_total` | `NUMERIC` |  | Used to store sub total for this module. |
| `tax_amount` | `NUMERIC` |  | Used to store tax amount for this module. |
| `discount` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |
| `grand_total` | `NUMERIC` |  | Used to store grand total for this module. |
| `payment_status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `issue_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `due_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `receipt`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `receipt_number` | `VARCHAR(255)` |  | Used to store receipt number for this module. |
| `invoice_number` | `VARCHAR(255)` |  | Used to store invoice number for this module. |
| `customer_name` | `VARCHAR(255)` |  | Stores the display name for customer. |
| `amount_paid` | `NUMERIC` |  | References the related amount p record. |
| `payment_method` | `VARCHAR(255)` |  | Used to store payment method for this module. |
| `payment_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `transaction_id` | `VARCHAR(255)` | FOREIGN KEY | References the related transaction record. |

## Calendar Schema

### Table: `calendar_event`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `title` | `VARCHAR(255)` |  | Used to store title for this module. |
| `description` | `VARCHAR(255)` |  | Used to store description for this module. |
| `type` | `VARCHAR(255)` |  | Used to store type for this module. |
| `start_time` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `end_time` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `participants` | `JSONB` |  | Collection of participants values used to render lists or related records. |
| `location` | `VARCHAR(255)` |  | Used to store location for this module. |
| `meeting_link` | `VARCHAR(255)` |  | Used to store meeting link for this module. |
| `reminder_minutes` | `NUMERIC` |  | Used to store reminder minutes for this module. |
| `repeat_rule` | `VARCHAR(50)` | CHECK IN ('None' | 'Daily' | 'Weekly' | 'Monthly') | Used to store repeat rule for this module. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |

## Certificate Schema

### Table: `certificate`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `certificate_number` | `VARCHAR(255)` |  | Used to store certificate number for this module. |
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `student_name` | `VARCHAR(255)` |  | Stores the display name for student. |
| `program` | `VARCHAR(255)` |  | Used to store program for this module. |
| `batch` | `VARCHAR(255)` |  | Used to store batch for this module. |
| `mentor_name` | `VARCHAR(255)` |  | Stores the display name for mentor. |
| `type` | `VARCHAR(255)` |  | Used to store type for this module. |
| `issue_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `expiry_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `generated_by` | `VARCHAR(255)` |  | Stores a calculated percentage or rate metric. |
| `approved_by` | `VARCHAR(255)` |  | Used to store approved by for this module. |
| `qr_code_url` | `VARCHAR(255)` |  | Used to store qr code url for this module. |
| `verification_url` | `VARCHAR(255)` |  | Used to store verification url for this module. |
| `digital_signature_id` | `VARCHAR(255)` | FOREIGN KEY | References the related digital signature record. |
| `created_time` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

## Communication Schema

### Table: `message`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `conversation_id` | `VARCHAR(255)` | FOREIGN KEY | References the related conversation record. |
| `sender_id` | `VARCHAR(255)` | FOREIGN KEY | References the related sender record. |
| `sender_name` | `VARCHAR(255)` |  | Stores the display name for sender. |
| `content` | `VARCHAR(255)` |  | Stores the main content rendered or sent to the user. |
| `attachments` | `JSONB` |  | Collection of attachments values used to render lists or related records. |
| `created_time` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `read_time` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `priority` | `VARCHAR(255)` |  | Used to store priority for this module. |

### Table: `conversation`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `type` | `VARCHAR(255)` |  | Used to store type for this module. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `participants` | `VARCHAR(255)` |  | Used to store participants for this module. |

## Coordinator Schema

### Table: `coordinator`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `employee_id` | `VARCHAR(255)` | FOREIGN KEY | References the related employee record. |
| `college_id` | `VARCHAR(255)` | FOREIGN KEY | References the related college record. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `email` | `VARCHAR(255)` | UNIQUE | Stores the email address used for communication or identification. |
| `phone` | `VARCHAR(255)` |  | Stores the contact phone number. |
| `assigned_students_count` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |
| `active_batches_count` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |
| `placements_count` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |
| `status` | `VARCHAR(50)` | CHECK IN ('Active' | 'Inactive') | Tracks the current lifecycle or processing state. |

### Table: `college_report`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `coordinator_id` | `VARCHAR(255)` | FOREIGN KEY | References the related coordinator record. |
| `college_id` | `VARCHAR(255)` | FOREIGN KEY | References the related college record. |
| `month` | `VARCHAR(255)` |  | Used to store month for this module. |
| `year` | `NUMERIC` |  | Used to store year for this module. |
| `file_id` | `VARCHAR(255)` | FOREIGN KEY | References the related file record. |

## Degree Schema

### Table: `degree_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `degree_id` | `VARCHAR(255)` | FOREIGN KEY | References the related degree record. |
| `degree_name` | `VARCHAR(255)` |  | Stores the display name for degree_name. |
| `degree_code` | `VARCHAR(255)` |  | Used to store degree_code for this module. |
| `duration_years` | `NUMERIC` |  | Used to store duration_years for this module. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |

### Table: `degree_create`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `degree_name` | `VARCHAR(255)` |  | Stores the display name for degree_name. |
| `degree_code` | `VARCHAR(255)` |  | Used to store degree_code for this module. |
| `duration_years` | `NUMERIC` |  | Used to store duration_years for this module. |

## Document Schema

### Table: `document_template`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `type` | `VARCHAR(255)` |  | Used to store type for this module. |
| `description` | `VARCHAR(255)` |  | Used to store description for this module. |
| `version` | `VARCHAR(255)` |  | Tracks the revision number for change management. |
| `variables` | `JSONB` |  | Lists dynamic placeholders or values injected at runtime. |
| `last_updated` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `generated_document`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `template_id` | `VARCHAR(255)` | FOREIGN KEY | References the related template record. |
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `student_name` | `VARCHAR(255)` |  | Stores the display name for student. |
| `program` | `VARCHAR(255)` |  | Used to store program for this module. |
| `type` | `VARCHAR(255)` |  | Used to store type for this module. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `generated_date` | `VARCHAR(255)` |  | Stores a calculated percentage or rate metric. |
| `version` | `VARCHAR(255)` |  | Tracks the revision number for change management. |
| `file_url` | `VARCHAR(255)` |  | Used to store file url for this module. |
| `metadata` | `JSONB` |  | Used to store metadata for this module. |

## Email Schema

### Table: `email_template`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `category` | `VARCHAR(255)` |  | Used to store category for this module. |
| `subject` | `VARCHAR(255)` |  | Stores the subject line shown to the recipient. |
| `html_body` | `VARCHAR(255)` |  | Stores the main content rendered or sent to the user. |
| `variables` | `JSONB` |  | Lists dynamic placeholders or values injected at runtime. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `created_by` | `VARCHAR(255)` |  | Used to store created by for this module. |
| `version` | `NUMERIC` |  | Tracks the revision number for change management. |
| `last_updated` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `email_history`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `template_id` | `VARCHAR(255)` | FOREIGN KEY | References the related template record. |
| `recipient_email` | `VARCHAR(255)` |  | Stores the email address used for communication or identification. |
| `sent_at` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `status` | `VARCHAR(50)` | CHECK IN ('Delivered' | 'Bounced' | 'Opened' | 'Clicked') | Tracks the current lifecycle or processing state. |

## Employee Schema

### Table: `employee_create`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `user_id` | `VARCHAR(255)` | FOREIGN KEY | References the related user record. |
| `employee_code` | `VARCHAR(255)` |  | Used to store employee_code for this module. |
| `first_name` | `VARCHAR(255)` |  | Stores the display name for first_name. |
| `last_name` | `VARCHAR(255)` |  | Stores the display name for last_name. |
| `phone_number` | `VARCHAR(255)` |  | Stores the contact phone number. |
| `official_email` | `VARCHAR(255)` |  | Stores the email address used for communication or identification. |
| `joining_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `designation` | `VARCHAR(255)` |  | Used to store designation for this module. |

### Table: `employee_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `employee_id` | `VARCHAR(255)` | FOREIGN KEY | References the related employee record. |
| `employee_code` | `VARCHAR(255)` |  | Used to store employee_code for this module. |
| `first_name` | `VARCHAR(255)` |  | Stores the display name for first_name. |
| `last_name` | `VARCHAR(255)` |  | Stores the display name for last_name. |
| `official_email` | `VARCHAR(255)` |  | Stores the email address used for communication or identification. |
| `designation` | `VARCHAR(255)` |  | Used to store designation for this module. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |

## Escalation Schema

### Table: `escalation_rule`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `type` | `VARCHAR(50)` | CHECK IN ('Attendance' | 'Assignments' | 'Leave' | 'Assessments' | 'Performance' | 'Payment' | 'Certificate Approval') | Used to store type for this module. |
| `condition` | `VARCHAR(255)` |  | Used to store condition for this module. |
| `trigger_days` | `NUMERIC` |  | Used to store trigger days for this module. |
| `notify_roles` | `JSONB` |  | Defines the assigned role or role label for access control. |
| `status` | `VARCHAR(50)` | CHECK IN ('Active' | 'Inactive') | Tracks the current lifecycle or processing state. |

### Table: `escalation_log`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `rule_id` | `VARCHAR(255)` | FOREIGN KEY | References the related rule record. |
| `target_id` | `VARCHAR(255)` | FOREIGN KEY | References the related target record. |
| `target_name` | `VARCHAR(255)` |  | Stores the display name for target. |
| `type` | `VARCHAR(50)` | CHECK IN ('Attendance' | 'Assignments' | 'Leave' | 'Assessments' | 'Performance' | 'Payment' | 'Certificate Approval') | Used to store type for this module. |
| `triggered_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `status` | `VARCHAR(50)` | CHECK IN ('Pending' | 'Resolved' | 'Ignored') | Tracks the current lifecycle or processing state. |
| `notified_users` | `VARCHAR(255)` |  | Used to store notified users for this module. |

## Executive Schema

### Table: `executive_metric`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `title` | `VARCHAR(255)` |  | Used to store title for this module. |
| `value` | `VARCHAR(255)` |  | Used to store value for this module. |
| `change` | `NUMERIC` |  | Used to store change for this module. |
| `change_type` | `VARCHAR(50)` | CHECK IN ('increase' | 'decrease' | 'neutral') | Used to store change type for this module. |
| `timeframe` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `risk_indicator`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `department` | `VARCHAR(255)` |  | Used to store department for this module. |
| `risk_level` | `VARCHAR(50)` | CHECK IN ('Low' | 'Medium' | 'High' | 'Critical') | Used to store risk level for this module. |
| `description` | `VARCHAR(255)` |  | Used to store description for this module. |
| `mitigation` | `VARCHAR(255)` |  | Used to store mitigation for this module. |

## Export Schema

### Table: `export_job`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `module` | `VARCHAR(255)` |  | Maps the item to a product module or feature area. |
| `format` | `VARCHAR(50)` | CHECK IN ('PDF' | 'Excel' | 'CSV' | 'JSON') | Stores the relevant date/time for sorting, auditing, or display. |
| `requested_by` | `VARCHAR(255)` |  | Used to store requested by for this module. |
| `requested_at` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `status` | `VARCHAR(50)` | CHECK IN ('Pending' | 'Processing' | 'Completed' | 'Failed') | Tracks the current lifecycle or processing state. |
| `file_url` | `VARCHAR(255)` |  | Used to store file url for this module. |

### Table: `export_schedule`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `module` | `VARCHAR(255)` |  | Maps the item to a product module or feature area. |
| `frequency` | `VARCHAR(50)` | CHECK IN ('Daily' | 'Weekly' | 'Monthly') | Used to store frequency for this module. |
| `format` | `VARCHAR(50)` | CHECK IN ('PDF' | 'Excel' | 'CSV') | Stores the relevant date/time for sorting, auditing, or display. |
| `recipients` | `JSONB` |  | Collection of recipients values used to render lists or related records. |
| `next_run` | `VARCHAR(255)` |  | Used to store next run for this module. |

## Fee Schema

### Table: `fee_structure`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `fee_name` | `VARCHAR(255)` |  | Stores the display name for fee. |
| `fee_type` | `VARCHAR(255)` |  | Used to store fee type for this module. |
| `amount` | `NUMERIC` |  | Used to store amount for this module. |
| `program` | `VARCHAR(255)` |  | Used to store program for this module. |
| `department` | `VARCHAR(255)` |  | Used to store department for this module. |
| `duration` | `VARCHAR(255)` |  | Used to store duration for this module. |
| `applicable_batch` | `VARCHAR(255)` |  | Used to store applicable batch for this module. |
| `installments` | `NUMERIC` |  | Used to store installments for this module. |
| `late_fee` | `NUMERIC` |  | Used to store late fee for this module. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |

## Feedback Schema

### Table: `feedback_base`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `type` | `VARCHAR(255)` |  | Used to store type for this module. |
| `provider_id` | `VARCHAR(255)` | FOREIGN KEY | References the related provider record. |
| `provider_role` | `VARCHAR(50)` | CHECK IN ('Student' | 'Mentor' | 'College') | Defines the assigned role or role label for access control. |
| `target_id` | `VARCHAR(255)` | FOREIGN KEY | References the related target record. |
| `date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `rating` | `NUMERIC` |  | Used to store rating for this module. |
| `comments` | `VARCHAR(255)` |  | Used to store comments for this module. |

### Table: `feedback_create`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `type` | `VARCHAR(255)` |  | Used to store type for this module. |
| `target_id` | `VARCHAR(255)` | FOREIGN KEY | References the related target record. |
| `rating` | `NUMERIC` |  | Used to store rating for this module. |
| `comments` | `VARCHAR(255)` |  | Used to store comments for this module. |

## Finance Schema

### Table: `finance_metrics`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `todays_collection` | `NUMERIC` |  | Used to store todays collection for this module. |
| `monthly_revenue` | `NUMERIC` |  | Used to store monthly revenue for this module. |
| `pending_payments` | `NUMERIC` |  | Used to store pending payments for this module. |
| `total_transactions` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |
| `refund_requests` | `NUMERIC` |  | Used to store refund requests for this module. |
| `wallet_balance` | `NUMERIC` |  | Used to store wallet balance for this module. |
| `revenue_growth` | `NUMERIC` |  | Used to store revenue growth for this module. |

## Helpdesk Schema

### Table: `ticket_comment`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `ticket_id` | `VARCHAR(255)` | FOREIGN KEY | References the related ticket record. |
| `author_id` | `VARCHAR(255)` | FOREIGN KEY | References the related author record. |
| `author_name` | `VARCHAR(255)` |  | Stores the display name for author. |
| `author_avatar` | `VARCHAR(255)` |  | Used to store author avatar for this module. |
| `content` | `VARCHAR(255)` |  | Stores the main content rendered or sent to the user. |
| `timestamp` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `is_internal` | `BOOLEAN` |  | Boolean flag used to control state, visibility, or validation. |

### Table: `ticket`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `ticket_number` | `VARCHAR(255)` |  | Used to store ticket number for this module. |
| `title` | `VARCHAR(255)` |  | Used to store title for this module. |
| `description` | `VARCHAR(255)` |  | Used to store description for this module. |
| `category` | `VARCHAR(255)` |  | Used to store category for this module. |
| `priority` | `VARCHAR(255)` |  | Used to store priority for this module. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `created_by` | `VARCHAR(255)` |  | Used to store created by for this module. |
| `creator_name` | `VARCHAR(255)` |  | Stores the display name for creator. |
| `assigned_to` | `VARCHAR(255)` |  | Used to store assigned to for this module. |
| `assignee_name` | `VARCHAR(255)` |  | Stores the display name for assignee. |
| `department` | `VARCHAR(255)` |  | Used to store department for this module. |
| `created_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |
| `updated_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |
| `resolved_at` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `sla_breach` | `BOOLEAN` |  | Used to store sla breach for this module. |
| `sla_due_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `comments` | `JSONB` |  | Collection of comments values used to render lists or related records. |

### Table: `knowledge_base_article`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `title` | `VARCHAR(255)` |  | Used to store title for this module. |
| `category` | `VARCHAR(255)` |  | Used to store category for this module. |
| `content` | `VARCHAR(255)` |  | Stores the main content rendered or sent to the user. |
| `views` | `NUMERIC` |  | Used to store views for this module. |
| `helpful_count` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |

## Idcard Schema

### Table: `digital_i_d_card`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `card_number` | `VARCHAR(255)` |  | Used to store card number for this module. |
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `student_name` | `VARCHAR(255)` |  | Stores the display name for student. |
| `department` | `VARCHAR(255)` |  | Used to store department for this module. |
| `program` | `VARCHAR(255)` |  | Used to store program for this module. |
| `batch` | `VARCHAR(255)` |  | Used to store batch for this module. |
| `photo_url` | `VARCHAR(255)` |  | Used to store photo url for this module. |
| `qr_code_data` | `VARCHAR(255)` |  | Used to store qr code data for this module. |
| `issue_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `expiry_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `blood_group` | `VARCHAR(255)` |  | Used to store blood group for this module. |
| `emergency_contact` | `VARCHAR(255)` |  | Used to store emergency contact for this module. |

## Insight Schema

### Table: `insight_forecast`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `metric` | `VARCHAR(255)` |  | Used to store metric for this module. |
| `historical_values` | `JSONB` |  | Collection of historical values values used to render lists or related records. |
| `predicted_values` | `JSONB` |  | Collection of predicted values values used to render lists or related records. |
| `confidence` | `NUMERIC` |  | Used to store confidence for this module. |

### Table: `student_risk`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `program` | `VARCHAR(255)` |  | Used to store program for this module. |
| `risk_score` | `NUMERIC` |  | Used to store risk score for this module. |
| `factors` | `JSONB` |  | Collection of factors values used to render lists or related records. |

## Kpi Schema

### Table: `k_p_i_metric`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `category` | `VARCHAR(255)` |  | Used to store category for this module. |
| `current_value` | `NUMERIC` |  | Used to store current value for this module. |
| `target_value` | `NUMERIC` |  | Used to store target value for this module. |
| `unit` | `VARCHAR(255)` |  | Used to store unit for this module. |
| `trend` | `VARCHAR(50)` | CHECK IN ('up' | 'down' | 'flat') | Used to store trend for this module. |
| `trend_percentage` | `NUMERIC` |  | Stores a calculated percentage or rate metric. |
| `status` | `VARCHAR(50)` | CHECK IN ('on_track' | 'at_risk' | 'behind') | Tracks the current lifecycle or processing state. |
| `last_updated` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

## Leave Schema

### Table: `leave_request`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `user_id` | `VARCHAR(255)` | FOREIGN KEY | References the related user record. |
| `user_name` | `VARCHAR(255)` |  | Stores the display name for user. |
| `role` | `VARCHAR(50)` | CHECK IN ('Student' | 'Mentor' | 'Employee') | Defines the assigned role or role label for access control. |
| `leave_type` | `VARCHAR(50)` | CHECK IN ('Medical' | 'Casual' | 'Emergency' | 'OD' | 'WFH') | Used to store leave type for this module. |
| `start_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `end_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `reason` | `VARCHAR(255)` |  | Used to store reason for this module. |
| `status` | `VARCHAR(50)` | CHECK IN ('Pending' | 'Approved' | 'Rejected') | Tracks the current lifecycle or processing state. |
| `supporting_document` | `VARCHAR(255)` |  | Used to store supporting document for this module. |
| `applied_on` | `VARCHAR(255)` |  | Used to store applied on for this module. |
| `approved_by` | `VARCHAR(255)` |  | Used to store approved by for this module. |
| `approval_remarks` | `VARCHAR(255)` |  | Used to store approval remarks for this module. |

### Table: `leave_timeline_event`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `leave_id` | `VARCHAR(255)` | FOREIGN KEY | References the related leave record. |
| `action` | `VARCHAR(50)` | CHECK IN ('Applied' | 'Reviewed' | 'Approved' | 'Rejected' | 'Escalated') | Used to store action for this module. |
| `acted_by` | `VARCHAR(255)` |  | Used to store acted by for this module. |
| `acted_on` | `VARCHAR(255)` |  | Used to store acted on for this module. |
| `remarks` | `VARCHAR(255)` |  | Used to store remarks for this module. |

## Lms Schema

### Table: `learning_resource`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `module_id` | `VARCHAR(255)` | FOREIGN KEY | References the related module record. |
| `title` | `VARCHAR(255)` |  | Used to store title for this module. |
| `resource_type` | `VARCHAR(255)` |  | Used to store resource_type for this module. |
| `file_id` | `VARCHAR(255)` | FOREIGN KEY | References the related file record. |
| `external_url` | `VARCHAR(255)` |  | Used to store external_url for this module. |
| `duration` | `VARCHAR(255)` |  | Used to store duration for this module. |
| `completed` | `BOOLEAN` |  | Used to store completed for this module. |

### Table: `learning_module`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `program_id` | `VARCHAR(255)` | FOREIGN KEY | References the related program record. |
| `title` | `VARCHAR(255)` |  | Used to store title for this module. |
| `category` | `VARCHAR(255)` |  | Used to store category for this module. |
| `image` | `VARCHAR(255)` |  | Used to store image for this module. |
| `progress` | `NUMERIC` |  | Used to store progress for this module. |
| `resources` | `JSONB` |  | Collection of resources values used to render lists or related records. |

## Marketplace Schema

### Table: `marketplace_opportunity`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `title` | `VARCHAR(255)` |  | Used to store title for this module. |
| `company_name` | `VARCHAR(255)` |  | Stores the display name for company. |
| `department` | `VARCHAR(255)` |  | Used to store department for this module. |
| `location` | `VARCHAR(255)` |  | Used to store location for this module. |
| `location_type` | `VARCHAR(255)` |  | Used to store location type for this module. |
| `type` | `VARCHAR(255)` |  | Used to store type for this module. |
| `compensation` | `VARCHAR(255)` |  | Used to store compensation for this module. |
| `stipend` | `VARCHAR(255)` |  | Used to store stipend for this module. |
| `duration_months` | `NUMERIC` |  | Used to store duration months for this module. |
| `skills` | `JSONB` |  | Collection of skills values used to render lists or related records. |
| `description` | `VARCHAR(255)` |  | Used to store description for this module. |
| `requirements` | `JSONB` |  | Collection of requirements values used to render lists or related records. |
| `posted_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `deadline_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `is_active` | `BOOLEAN` |  | Boolean flag used to control state, visibility, or validation. |
| `applicants_count` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |

### Table: `marketplace_application`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `opportunity_id` | `VARCHAR(255)` | FOREIGN KEY | References the related opportunity record. |
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `status` | `VARCHAR(50)` | CHECK IN ('Pending' | 'Under Review' | 'Interview' | 'Offered' | 'Rejected') | Tracks the current lifecycle or processing state. |
| `applied_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `match_score` | `NUMERIC` |  | Used to store match score for this module. |

## Mentor Schema

### Table: `mentor_profile`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `mentor_profile_id` | `VARCHAR(255)` | FOREIGN KEY | References the related mentor_profile record. |
| `employee_id` | `VARCHAR(255)` | FOREIGN KEY | References the related employee record. |
| `employee_name` | `VARCHAR(255)` |  | Stores the display name for employee. |
| `mentor_bio` | `VARCHAR(255)` |  | Used to store mentor_bio for this module. |
| `mentor_expertise` | `JSONB` |  | Collection of mentor_expertise values used to render lists or related records. |
| `years_of_experience` | `NUMERIC` |  | Used to store years_of_experience for this module. |
| `max_student_capacity` | `NUMERIC` |  | Used to store max_student_capacity for this module. |
| `current_student_count` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |
| `is_available` | `BOOLEAN` |  | Boolean flag used to control state, visibility, or validation. |
| `created_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |
| `updated_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `mentor_assignment`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `mentor_profile_id` | `VARCHAR(255)` | FOREIGN KEY | References the related mentor profile record. |
| `mentor_name` | `VARCHAR(255)` |  | Stores the display name for mentor. |
| `employee_id` | `VARCHAR(255)` | FOREIGN KEY | References the related employee record. |
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `student_name` | `VARCHAR(255)` |  | Stores the display name for student. |
| `intern_id` | `VARCHAR(255)` | FOREIGN KEY | References the related intern record. |
| `batch_id` | `VARCHAR(255)` | FOREIGN KEY | References the related batch record. |
| `batch_name` | `VARCHAR(255)` |  | Stores the display name for batch. |
| `assigned_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `status` | `VARCHAR(50)` | CHECK IN ('Active' | 'Completed' | 'Transferred') | Tracks the current lifecycle or processing state. |
| `assigned_by` | `VARCHAR(255)` |  | Used to store assigned by for this module. |

### Table: `mentor_batch_mapping`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `mentor_profile_id` | `VARCHAR(255)` | FOREIGN KEY | References the related mentor profile record. |
| `mentor_name` | `VARCHAR(255)` |  | Stores the display name for mentor. |
| `employee_id` | `VARCHAR(255)` | FOREIGN KEY | References the related employee record. |
| `batch_id` | `VARCHAR(255)` | FOREIGN KEY | References the related batch record. |
| `batch_name` | `VARCHAR(255)` |  | Stores the display name for batch. |
| `batch_code` | `VARCHAR(255)` |  | Used to store batch code for this module. |
| `program_name` | `VARCHAR(255)` |  | Stores the display name for program. |
| `student_count` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |
| `batch_capacity` | `NUMERIC` |  | Used to store batch capacity for this module. |
| `mapped_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `status` | `VARCHAR(50)` | CHECK IN ('Active' | 'Completed' | 'Upcoming') | Tracks the current lifecycle or processing state. |
| `mapped_by` | `VARCHAR(255)` |  | Used to store mapped by for this module. |

## Module Schema

### Table: `module`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `code` | `VARCHAR(255)` |  | Used to store code for this module. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `route` | `VARCHAR(255)` |  | Defines the navigation target or URL path. |
| `active` | `BOOLEAN` |  | Boolean flag used to control state, visibility, or validation. |
| `desc` | `VARCHAR(255)` |  | Used to store desc for this module. |

## Notification Schema

### Table: `notification`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `title` | `VARCHAR(255)` |  | Used to store title for this module. |
| `message` | `VARCHAR(255)` |  | Stores the main content rendered or sent to the user. |
| `recipient` | `VARCHAR(255)` |  | Used to store recipient for this module. |
| `role` | `VARCHAR(255)` |  | Defines the assigned role or role label for access control. |
| `module` | `VARCHAR(255)` |  | Maps the item to a product module or feature area. |
| `channel` | `VARCHAR(255)` |  | Used to store channel for this module. |
| `priority` | `VARCHAR(255)` |  | Used to store priority for this module. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `scheduled_time` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `delivered_time` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `read_status` | `BOOLEAN` |  | Tracks the current lifecycle or processing state. |
| `retry_count` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |
| `created_time` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

## Opportunity Schema

### Table: `opening_create`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `program_id` | `VARCHAR(255)` | FOREIGN KEY | References the related program record. |
| `role_name` | `VARCHAR(255)` |  | Stores the display name for role_name. |
| `role_description` | `VARCHAR(255)` |  | Defines the assigned role or role label for access control. |
| `project_title` | `VARCHAR(255)` |  | Used to store project_title for this module. |
| `duration_weeks` | `NUMERIC` |  | Used to store duration_weeks for this module. |
| `stipend_amount` | `NUMERIC` |  | Used to store stipend_amount for this module. |
| `fee_amount` | `NUMERIC` |  | Used to store fee_amount for this module. |
| `total_openings` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |
| `application_deadline` | `VARCHAR(255)` |  | Used to store application_deadline for this module. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |

### Table: `opening_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `opening_id` | `VARCHAR(255)` | FOREIGN KEY | References the related opening record. |
| `program_id` | `VARCHAR(255)` | FOREIGN KEY | References the related program record. |
| `role_name` | `VARCHAR(255)` |  | Stores the display name for role_name. |
| `role_description` | `VARCHAR(255)` |  | Defines the assigned role or role label for access control. |
| `project_title` | `VARCHAR(255)` |  | Used to store project_title for this module. |
| `duration_weeks` | `NUMERIC` |  | Used to store duration_weeks for this module. |
| `stipend_amount` | `NUMERIC` |  | Used to store stipend_amount for this module. |
| `fee_amount` | `NUMERIC` |  | Used to store fee_amount for this module. |
| `total_openings` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |
| `application_deadline` | `VARCHAR(255)` |  | Used to store application_deadline for this module. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `created_by` | `VARCHAR(255)` |  | Used to store created_by for this module. |
| `created_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |
| `updated_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `opening_mentor_create`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `employee_id` | `VARCHAR(255)` | FOREIGN KEY | References the related employee record. |

### Table: `opening_mentor_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `opening_mentor_id` | `VARCHAR(255)` | FOREIGN KEY | References the related opening_mentor record. |
| `opening_id` | `VARCHAR(255)` | FOREIGN KEY | References the related opening record. |
| `employee_id` | `VARCHAR(255)` | FOREIGN KEY | References the related employee record. |
| `assigned_at` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

## Organization Schema

### Table: `college_create`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `college_code` | `VARCHAR(255)` |  | Used to store college_code for this module. |
| `college_name` | `VARCHAR(255)` |  | Stores the display name for college_name. |
| `college_email` | `VARCHAR(255)` |  | Stores the email address used for communication or identification. |
| `college_phone` | `VARCHAR(255)` |  | Stores the contact phone number. |
| `website_url` | `VARCHAR(255)` |  | Used to store website_url for this module. |
| `address_line_1` | `VARCHAR(255)` |  | Used to store address_line_1 for this module. |
| `address_line_2` | `VARCHAR(255)` |  | Used to store address_line_2 for this module. |
| `city` | `VARCHAR(255)` |  | Used to store city for this module. |
| `state` | `VARCHAR(255)` |  | Used to store state for this module. |
| `country` | `VARCHAR(255)` |  | Stores an aggregated numeric total used in stats or summaries. |
| `postal_code` | `VARCHAR(255)` |  | Used to store postal_code for this module. |
| `accreditation` | `VARCHAR(255)` |  | Used to store accreditation for this module. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |

### Table: `college_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `college_id` | `VARCHAR(255)` | FOREIGN KEY | References the related college record. |
| `college_code` | `VARCHAR(255)` |  | Used to store college_code for this module. |
| `college_name` | `VARCHAR(255)` |  | Stores the display name for college_name. |
| `college_email` | `VARCHAR(255)` |  | Stores the email address used for communication or identification. |
| `college_phone` | `VARCHAR(255)` |  | Stores the contact phone number. |
| `website_url` | `VARCHAR(255)` |  | Used to store website_url for this module. |
| `address_line_1` | `VARCHAR(255)` |  | Used to store address_line_1 for this module. |
| `address_line_2` | `VARCHAR(255)` |  | Used to store address_line_2 for this module. |
| `city` | `VARCHAR(255)` |  | Used to store city for this module. |
| `state` | `VARCHAR(255)` |  | Used to store state for this module. |
| `country` | `VARCHAR(255)` |  | Stores an aggregated numeric total used in stats or summaries. |
| `postal_code` | `VARCHAR(255)` |  | Used to store postal_code for this module. |
| `accreditation` | `VARCHAR(255)` |  | Used to store accreditation for this module. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `created_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |
| `updated_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `department_create`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `college_id` | `VARCHAR(255)` | FOREIGN KEY | References the related college record. |
| `department_code` | `VARCHAR(255)` |  | Used to store department_code for this module. |
| `department_name` | `VARCHAR(255)` |  | Stores the display name for department_name. |
| `hod_name` | `VARCHAR(255)` |  | Stores the display name for hod_name. |
| `department_email` | `VARCHAR(255)` |  | Stores the email address used for communication or identification. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |

### Table: `department_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `department_id` | `VARCHAR(255)` | FOREIGN KEY | References the related department record. |
| `college_id` | `VARCHAR(255)` | FOREIGN KEY | References the related college record. |
| `department_code` | `VARCHAR(255)` |  | Used to store department_code for this module. |
| `department_name` | `VARCHAR(255)` |  | Stores the display name for department_name. |
| `hod_name` | `VARCHAR(255)` |  | Stores the display name for hod_name. |
| `department_email` | `VARCHAR(255)` |  | Stores the email address used for communication or identification. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `created_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |
| `updated_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `coordinator_create`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `employee_id` | `VARCHAR(255)` | FOREIGN KEY | References the related employee record. |
| `college_id` | `VARCHAR(255)` | FOREIGN KEY | References the related college record. |
| `assigned_from` | `VARCHAR(255)` |  | Used to store assigned_from for this module. |
| `assigned_to` | `VARCHAR(255)` |  | Used to store assigned_to for this module. |

### Table: `coordinator_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `coordinator_mapping_id` | `VARCHAR(255)` | FOREIGN KEY | References the related coordinator_mapping record. |
| `employee_id` | `VARCHAR(255)` | FOREIGN KEY | References the related employee record. |
| `college_id` | `VARCHAR(255)` | FOREIGN KEY | References the related college record. |
| `assigned_from` | `VARCHAR(255)` |  | Used to store assigned_from for this module. |
| `assigned_to` | `VARCHAR(255)` |  | Used to store assigned_to for this module. |
| `is_active` | `BOOLEAN` |  | Boolean flag used to control state, visibility, or validation. |
| `created_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |

## Payment Schema

### Table: `payment_transaction`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `transaction_id` | `VARCHAR(255)` | FOREIGN KEY | References the related transaction record. |
| `invoice_number` | `VARCHAR(255)` |  | Used to store invoice number for this module. |
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `student_name` | `VARCHAR(255)` |  | Stores the display name for student. |
| `program` | `VARCHAR(255)` |  | Used to store program for this module. |
| `amount` | `NUMERIC` |  | Used to store amount for this module. |
| `gst` | `NUMERIC` |  | Used to store gst for this module. |
| `discount` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |
| `fine` | `NUMERIC` |  | Used to store fine for this module. |
| `net_amount` | `NUMERIC` |  | Used to store net amount for this module. |
| `payment_method` | `VARCHAR(255)` |  | Used to store payment method for this module. |
| `reference_number` | `VARCHAR(255)` |  | Used to store reference number for this module. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `created_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `paid_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `verified_by` | `VARCHAR(255)` |  | Used to store verified by for this module. |

## Performance Schema

### Table: `student_performance`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `batch_id` | `VARCHAR(255)` | FOREIGN KEY | References the related batch record. |
| `average_score` | `NUMERIC` |  | Used to store average_score for this module. |
| `attendance_rate` | `NUMERIC` |  | Stores a calculated percentage or rate metric. |
| `task_completion_rate` | `NUMERIC` |  | Stores a calculated percentage or rate metric. |
| `assessment_score` | `NUMERIC` |  | Used to store assessment_score for this module. |
| `is_at_risk` | `BOOLEAN` |  | Boolean flag used to control state, visibility, or validation. |

### Table: `batch_performance`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `batch_id` | `VARCHAR(255)` | FOREIGN KEY | References the related batch record. |
| `average_score` | `NUMERIC` |  | Used to store average_score for this module. |
| `attendance_rate` | `NUMERIC` |  | Stores a calculated percentage or rate metric. |
| `task_completion_rate` | `NUMERIC` |  | Stores a calculated percentage or rate metric. |
| `assessment_score` | `NUMERIC` |  | Used to store assessment_score for this module. |

## Placement Schema

### Table: `company`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `industry` | `VARCHAR(255)` |  | Used to store industry for this module. |
| `logo_url` | `VARCHAR(255)` |  | Used to store logo url for this module. |
| `website` | `VARCHAR(255)` |  | Used to store website for this module. |
| `contact_person` | `VARCHAR(255)` |  | Used to store contact person for this module. |
| `contact_email` | `VARCHAR(255)` |  | Stores the email address used for communication or identification. |
| `active_roles` | `NUMERIC` |  | Defines the assigned role or role label for access control. |

### Table: `placement_record`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `student_name` | `VARCHAR(255)` |  | Stores the display name for student. |
| `program` | `VARCHAR(255)` |  | Used to store program for this module. |
| `company_id` | `VARCHAR(255)` | FOREIGN KEY | References the related company record. |
| `company_name` | `VARCHAR(255)` |  | Stores the display name for company. |
| `role` | `VARCHAR(255)` |  | Defines the assigned role or role label for access control. |
| `package` | `VARCHAR(255)` |  | Used to store package for this module. |
| `location` | `VARCHAR(255)` |  | Used to store location for this module. |
| `stage` | `VARCHAR(255)` |  | Used to store stage for this module. |
| `interview_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `offer_status` | `VARCHAR(50)` | CHECK IN ('Pending' | 'Accepted' | 'Declined') | Tracks the current lifecycle or processing state. |
| `joining_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `remarks` | `VARCHAR(255)` |  | Used to store remarks for this module. |
| `last_updated` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

## Productivity Schema

### Table: `bookmark`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `title` | `VARCHAR(255)` |  | Used to store title for this module. |
| `url` | `VARCHAR(255)` |  | Used to store url for this module. |
| `category` | `VARCHAR(255)` |  | Used to store category for this module. |

### Table: `sticky_note`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `content` | `VARCHAR(255)` |  | Stores the main content rendered or sent to the user. |
| `color` | `VARCHAR(50)` | CHECK IN ('yellow' | 'blue' | 'green' | 'pink') | Used to store color for this module. |
| `created_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `personal_task`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `title` | `VARCHAR(255)` |  | Used to store title for this module. |
| `completed` | `BOOLEAN` |  | Used to store completed for this module. |
| `due_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `productivity_workspace`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `bookmarks` | `JSONB` |  | Collection of bookmarks values used to render lists or related records. |
| `notes` | `JSONB` |  | Collection of notes values used to render lists or related records. |
| `tasks` | `JSONB` |  | Collection of tasks values used to render lists or related records. |

## Program Schema

### Table: `internship_type_create`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `type_code` | `VARCHAR(255)` |  | Used to store type_code for this module. |
| `type_name` | `VARCHAR(255)` |  | Stores the display name for type_name. |
| `description` | `VARCHAR(255)` |  | Used to store description for this module. |

### Table: `internship_type_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `internship_type_id` | `VARCHAR(255)` | FOREIGN KEY | References the related internship_type record. |
| `type_code` | `VARCHAR(255)` |  | Used to store type_code for this module. |
| `type_name` | `VARCHAR(255)` |  | Stores the display name for type_name. |
| `description` | `VARCHAR(255)` |  | Used to store description for this module. |
| `is_active` | `BOOLEAN` |  | Boolean flag used to control state, visibility, or validation. |

### Table: `program_create`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `internship_type_id` | `VARCHAR(255)` | FOREIGN KEY | References the related internship_type record. |
| `program_code` | `VARCHAR(255)` |  | Used to store program_code for this module. |
| `program_name` | `VARCHAR(255)` |  | Stores the display name for program_name. |
| `program_description` | `VARCHAR(255)` |  | Used to store program_description for this module. |
| `duration_weeks` | `NUMERIC` |  | Used to store duration_weeks for this module. |
| `certificate_available` | `BOOLEAN` |  | Used to store certificate_available for this module. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |

### Table: `program_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `program_id` | `VARCHAR(255)` | FOREIGN KEY | References the related program record. |
| `internship_type_id` | `VARCHAR(255)` | FOREIGN KEY | References the related internship_type record. |
| `program_code` | `VARCHAR(255)` |  | Used to store program_code for this module. |
| `program_name` | `VARCHAR(255)` |  | Stores the display name for program_name. |
| `program_description` | `VARCHAR(255)` |  | Used to store program_description for this module. |
| `duration_weeks` | `NUMERIC` |  | Used to store duration_weeks for this module. |
| `certificate_available` | `BOOLEAN` |  | Used to store certificate_available for this module. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |

## Referral Schema

### Table: `referral`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `referral_code` | `VARCHAR(255)` |  | Used to store referral code for this module. |
| `referrer_id` | `VARCHAR(255)` | FOREIGN KEY | References the related referrer record. |
| `referrer_name` | `VARCHAR(255)` |  | Stores the display name for referrer. |
| `candidate_name` | `VARCHAR(255)` |  | Stores the display name for candidate. |
| `candidate_email` | `VARCHAR(255)` |  | Stores the email address used for communication or identification. |
| `program` | `VARCHAR(255)` |  | Used to store program for this module. |
| `reward_points` | `NUMERIC` |  | Used to store reward points for this module. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `created_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |
| `joined_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `reward_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `referral_campaign`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `title` | `VARCHAR(255)` |  | Used to store title for this module. |
| `description` | `VARCHAR(255)` |  | Used to store description for this module. |
| `reward_multiplier` | `NUMERIC` |  | Used to store reward multiplier for this module. |
| `end_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

## Report Schema

### Table: `report_record`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `type` | `VARCHAR(255)` |  | Used to store type for this module. |
| `generated_by` | `VARCHAR(255)` |  | Stores a calculated percentage or rate metric. |
| `generated_date` | `VARCHAR(255)` |  | Stores a calculated percentage or rate metric. |
| `status` | `VARCHAR(50)` | CHECK IN ('Completed' | 'Processing' | 'Failed') | Tracks the current lifecycle or processing state. |
| `format` | `VARCHAR(50)` | CHECK IN ('PDF' | 'Excel' | 'CSV') | Stores the relevant date/time for sorting, auditing, or display. |
| `size_bytes` | `NUMERIC` |  | Used to store size bytes for this module. |
| `download_url` | `VARCHAR(255)` |  | Used to store download url for this module. |

### Table: `report_template`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `category` | `VARCHAR(255)` |  | Used to store category for this module. |
| `description` | `VARCHAR(255)` |  | Used to store description for this module. |

## Reporting Manager Schema

### Table: `reporting_manager`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `user_id` | `VARCHAR(255)` | FOREIGN KEY | References the related user record. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `email` | `VARCHAR(255)` | UNIQUE | Stores the email address used for communication or identification. |
| `department` | `VARCHAR(255)` |  | Used to store department for this module. |
| `designation` | `VARCHAR(255)` |  | Used to store designation for this module. |
| `assigned_interns_count` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |
| `status` | `VARCHAR(50)` | CHECK IN ('Active' | 'Inactive') | Tracks the current lifecycle or processing state. |

### Table: `manager_assignment`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `manager_id` | `VARCHAR(255)` | FOREIGN KEY | References the related manager record. |
| `intern_id` | `VARCHAR(255)` | FOREIGN KEY | References the related intern record. |
| `assigned_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `status` | `VARCHAR(50)` | CHECK IN ('Active' | 'Completed' | 'Revoked') | Tracks the current lifecycle or processing state. |
| `intern_name` | `VARCHAR(255)` |  | Stores the display name for intern. |
| `batch` | `VARCHAR(255)` |  | Used to store batch for this module. |
| `college` | `VARCHAR(255)` |  | Used to store college for this module. |
| `attendance_percent` | `NUMERIC` |  | Stores a calculated percentage or rate metric. |
| `assessment_percent` | `NUMERIC` |  | Stores a calculated percentage or rate metric. |
| `task_completion_percent` | `NUMERIC` |  | Stores a calculated percentage or rate metric. |
| `performance_score` | `NUMERIC` |  | Used to store performance score for this module. |
| `risk_level` | `VARCHAR(50)` | CHECK IN ('Low' | 'Medium' | 'High') | Used to store risk level for this module. |

### Table: `manager_evaluation`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `assignment_id` | `VARCHAR(255)` | FOREIGN KEY | References the related assignment record. |
| `manager_id` | `VARCHAR(255)` | FOREIGN KEY | References the related manager record. |
| `intern_id` | `VARCHAR(255)` | FOREIGN KEY | References the related intern record. |
| `evaluation_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `score` | `NUMERIC` |  | Used to store score for this module. |
| `feedback` | `VARCHAR(255)` |  | Used to store feedback for this module. |
| `status` | `VARCHAR(50)` | CHECK IN ('Draft' | 'Submitted') | Tracks the current lifecycle or processing state. |

## Role Schema

### Table: `role`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `code` | `VARCHAR(255)` |  | Used to store code for this module. |
| `desc` | `VARCHAR(255)` |  | Used to store desc for this module. |
| `status` | `VARCHAR(50)` | CHECK IN ('Active' | 'Inactive') | Tracks the current lifecycle or processing state. |
| `modules_count` | `NUMERIC` |  | Maps the item to a product module or feature area. |
| `users_count` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |
| `color` | `VARCHAR(255)` |  | Used to store color for this module. |
| `bg` | `VARCHAR(255)` |  | Used to store bg for this module. |
| `module_ids` | `JSONB` |  | Maps the item to a product module or feature area. |
| `permissions` | `JSONB` |  | Defines access rights available to the user or role. |

## Selfservice Schema

### Table: `document_request`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `type` | `VARCHAR(255)` |  | Used to store type for this module. |
| `status` | `VARCHAR(50)` | CHECK IN ('Pending' | 'Approved' | 'Rejected' | 'Ready') | Tracks the current lifecycle or processing state. |
| `request_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `completion_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `user_profile`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `name` | `VARCHAR(255)` |  | Stores the display name for name. |
| `email` | `VARCHAR(255)` | UNIQUE | Stores the email address used for communication or identification. |
| `phone` | `VARCHAR(255)` |  | Stores the contact phone number. |
| `address` | `VARCHAR(255)` |  | Used to store address for this module. |
| `role` | `VARCHAR(255)` |  | Defines the assigned role or role label for access control. |
| `join_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `self_service_dashboard`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `profile` | `VARCHAR(255)` |  | Used to store profile for this module. |
| `recent_requests` | `JSONB` |  | Collection of recent requests values used to render lists or related records. |
| `pending_actions` | `NUMERIC` |  | Used to store pending actions for this module. |

## Student Schema

### Table: `student_create`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `application_id` | `VARCHAR(255)` | FOREIGN KEY | References the related application record. |
| `program_id` | `VARCHAR(255)` | FOREIGN KEY | References the related program record. |

### Table: `student_response`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `application_id` | `VARCHAR(255)` | FOREIGN KEY | References the related application record. |
| `program_id` | `VARCHAR(255)` | FOREIGN KEY | References the related program record. |
| `intern_id` | `VARCHAR(255)` | FOREIGN KEY | References the related intern record. |
| `student_status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `joined_at` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `completed_at` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `created_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |
| `updated_at` | `VARCHAR(255)` | DEFAULT NOW() | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `student_update`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `student_status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |

## Submission Schema

### Table: `subtask`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `phase` | `NUMERIC` |  | Used to store phase for this module. |
| `task` | `VARCHAR(255)` |  | Used to store task for this module. |
| `completed` | `BOOLEAN` |  | Used to store completed for this module. |

### Table: `commit`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `commit` | `VARCHAR(255)` |  | Used to store commit for this module. |
| `message` | `VARCHAR(255)` |  | Stores the main content rendered or sent to the user. |
| `author` | `VARCHAR(255)` |  | Used to store author for this module. |
| `date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `guide_comment` | `VARCHAR(255)` |  | Used to store guide comment for this module. |

### Table: `submission`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `task_id` | `VARCHAR(255)` | FOREIGN KEY | References the related task record. |
| `assessment_id` | `VARCHAR(255)` | FOREIGN KEY | References the related assessment record. |
| `status` | `VARCHAR(50)` | CHECK IN ('PENDING' | 'APPROVED' | 'REJECTED') | Tracks the current lifecycle or processing state. |
| `repo_link` | `VARCHAR(255)` |  | Used to store repo link for this module. |
| `live_link` | `VARCHAR(255)` |  | Used to store live link for this module. |
| `subtasks` | `JSONB` |  | Collection of subtasks values used to render lists or related records. |
| `commits` | `JSONB` |  | Collection of commits values used to render lists or related records. |
| `submission_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `marks_obtained` | `NUMERIC` |  | Used to store marks obtained for this module. |
| `file_ids` | `JSONB` |  | Collection of file ids values used to render lists or related records. |

## Task Schema

### Table: `task`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `title` | `VARCHAR(255)` |  | Used to store title for this module. |
| `description` | `VARCHAR(255)` |  | Used to store description for this module. |
| `batch_id` | `VARCHAR(255)` | FOREIGN KEY | References the related batch record. |
| `assigned_by` | `VARCHAR(255)` |  | Used to store assigned by for this module. |
| `assigned_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `due_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `status` | `VARCHAR(50)` | CHECK IN ('pending' | 'review' | 'completed') | Tracks the current lifecycle or processing state. |
| `is_overdue` | `BOOLEAN` |  | Boolean flag used to control state, visibility, or validation. |
| `is_locked` | `BOOLEAN` |  | Boolean flag used to control state, visibility, or validation. |
| `alert` | `VARCHAR(255)` |  | Used to store alert for this module. |
| `file_ids` | `JSONB` |  | Collection of file ids values used to render lists or related records. |

### Table: `task_assignee`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `task_id` | `VARCHAR(255)` | FOREIGN KEY | References the related task record. |
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `status` | `VARCHAR(50)` | CHECK IN ('pending' | 'submitted' | 'graded') | Tracks the current lifecycle or processing state. |

## Verification Schema

### Table: `verification_request`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `certificate_number` | `VARCHAR(255)` |  | Used to store certificate number for this module. |
| `requested_by_ip` | `VARCHAR(255)` |  | Used to store requested by ip for this module. |
| `request_time` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `method` | `VARCHAR(50)` | CHECK IN ('Certificate Number' | 'QR Code' | 'Verification Token') | Used to store method for this module. |
| `result` | `VARCHAR(255)` |  | Used to store result for this module. |

### Table: `verification_result`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `student_name` | `VARCHAR(255)` |  | Stores the display name for student. |
| `program` | `VARCHAR(255)` |  | Used to store program for this module. |
| `batch` | `VARCHAR(255)` |  | Used to store batch for this module. |
| `issue_date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |
| `organization` | `VARCHAR(255)` |  | Used to store organization for this module. |
| `certificate_type` | `VARCHAR(255)` |  | Used to store certificate type for this module. |
| `message` | `VARCHAR(255)` |  | Stores the main content rendered or sent to the user. |
| `preview_url` | `VARCHAR(255)` |  | Used to store preview url for this module. |

## Wallet Schema

### Table: `wallet_transaction`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | `VARCHAR(255)` | PRIMARY KEY, UUID, DEFAULT uuid_generate_v4() | Unique identifier for this record. |
| `wallet_id` | `VARCHAR(255)` | FOREIGN KEY | References the related wallet record. |
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `student_name` | `VARCHAR(255)` |  | Stores the display name for student. |
| `type` | `VARCHAR(255)` |  | Used to store type for this module. |
| `amount` | `NUMERIC` |  | Used to store amount for this module. |
| `source` | `VARCHAR(255)` |  | Used to store source for this module. |
| `reference` | `VARCHAR(255)` |  | Used to store reference for this module. |
| `status` | `VARCHAR(255)` |  | Tracks the current lifecycle or processing state. |
| `date` | `VARCHAR(255)` |  | Stores the relevant date/time for sorting, auditing, or display. |

### Table: `wallet_summary`

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `wallet_id` | `VARCHAR(255)` | FOREIGN KEY | References the related wallet record. |
| `student_id` | `VARCHAR(255)` | FOREIGN KEY | References the related student record. |
| `student_name` | `VARCHAR(255)` |  | Stores the display name for student. |
| `balance` | `NUMERIC` |  | Used to store balance for this module. |
| `total_credits` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |
| `total_debits` | `NUMERIC` |  | Stores an aggregated numeric total used in stats or summaries. |

