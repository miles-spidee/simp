# Database Architecture (V2)

## Domain: Identity & RBAC

### `users`
*Central identity table for all users (students, mentors, admins, etc.)*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `username` | `VARCHAR(255)` | UNIQUE, NOT NULL |  |
| `email` | `VARCHAR(255)` | UNIQUE, NOT NULL |  |
| `password_hash` | `VARCHAR(255)` | NOT NULL |  |
| `is_active` | `BOOLEAN` | DEFAULT TRUE |  |
| `last_login_at` | `TIMESTAMP` |  |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `roles`
*RBAC Roles*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `name` | `VARCHAR(100)` | UNIQUE, NOT NULL |  |
| `code` | `VARCHAR(50)` | UNIQUE, NOT NULL |  |
| `description` | `TEXT` |  |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `user_roles`
*Junction table mapping users to roles*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `user_id` | `UUID` | PRIMARY KEY, FK -> users.id (CASCADE) |  |
| `role_id` | `UUID` | PRIMARY KEY, FK -> roles.id (CASCADE) |  |
| `assigned_at` | `TIMESTAMP` | DEFAULT NOW() |  |
| `assigned_by` | `UUID` | FK -> users.id (NO ACTION) |  |

### `permissions`
*RBAC Permissions*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `module` | `VARCHAR(50)` | NOT NULL |  |
| `action` | `VARCHAR(50)` | NOT NULL |  |
| `description` | `TEXT` |  |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `role_permissions`
*Junction table mapping roles to permissions*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `role_id` | `UUID` | PRIMARY KEY, FK -> roles.id (CASCADE) |  |
| `permission_id` | `UUID` | PRIMARY KEY, FK -> permissions.id (CASCADE) |  |
| `granted_at` | `TIMESTAMP` | DEFAULT NOW() |  |

## Domain: Organization Hierarchy

### `organizations`
*Top-level organizations or colleges*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `code` | `VARCHAR(50)` | UNIQUE, NOT NULL |  |
| `name` | `VARCHAR(255)` | NOT NULL |  |
| `type` | `VARCHAR(50)` | NOT NULL |  |
| `contact_email` | `VARCHAR(255)` |  |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `departments`
*Departments within organizations*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `organization_id` | `UUID` | FK -> organizations.id (RESTRICT) |  |
| `code` | `VARCHAR(50)` | NOT NULL |  |
| `name` | `VARCHAR(255)` | NOT NULL |  |
| `hod_user_id` | `UUID` | FK -> users.id (NO ACTION) |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `programs`
*Academic or Training programs*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `department_id` | `UUID` | FK -> departments.id (RESTRICT) |  |
| `code` | `VARCHAR(50)` | NOT NULL |  |
| `name` | `VARCHAR(255)` | NOT NULL |  |
| `duration_weeks` | `INTEGER` | NOT NULL |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `batches`
*Batches of programs*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `program_id` | `UUID` | FK -> programs.id (RESTRICT) |  |
| `code` | `VARCHAR(50)` | NOT NULL |  |
| `name` | `VARCHAR(255)` | NOT NULL |  |
| `start_date` | `DATE` | NOT NULL |  |
| `end_date` | `DATE` |  |  |
| `max_capacity` | `INTEGER` | NOT NULL |  |
| `status` | `VARCHAR(50)` | NOT NULL |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

## Domain: User Profiles

### `student_profiles`
*Student-specific data tied to a user*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `user_id` | `UUID` | PRIMARY KEY, FK -> users.id (CASCADE) |  |
| `organization_id` | `UUID` | FK -> organizations.id (RESTRICT) |  |
| `department_id` | `UUID` | FK -> departments.id (RESTRICT) |  |
| `batch_id` | `UUID` | FK -> batches.id (RESTRICT) |  |
| `enrollment_number` | `VARCHAR(100)` | UNIQUE, NOT NULL |  |
| `resume_url` | `VARCHAR(500)` |  |  |
| `github_url` | `VARCHAR(500)` |  |  |
| `linkedin_url` | `VARCHAR(500)` |  |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `employee_profiles`
*Employee-specific data (HR, Managers, Coordinators)*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `user_id` | `UUID` | PRIMARY KEY, FK -> users.id (CASCADE) |  |
| `organization_id` | `UUID` | FK -> organizations.id (RESTRICT) |  |
| `employee_code` | `VARCHAR(100)` | UNIQUE, NOT NULL |  |
| `designation` | `VARCHAR(255)` | NOT NULL |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `mentor_profiles`
*Mentor-specific data (can be employees or external)*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `user_id` | `UUID` | PRIMARY KEY, FK -> users.id (CASCADE) |  |
| `max_capacity` | `INTEGER` | DEFAULT 10 |  |
| `is_available` | `BOOLEAN` | DEFAULT TRUE |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `mentor_batch_assignments`
*Junction mapping mentors to batches*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `mentor_user_id` | `UUID` | PRIMARY KEY, FK -> users.id (CASCADE) |  |
| `batch_id` | `UUID` | PRIMARY KEY, FK -> batches.id (CASCADE) |  |
| `assigned_at` | `TIMESTAMP` | DEFAULT NOW() |  |

## Domain: Internships & Placements

### `companies`
*Companies offering internships/placements*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `name` | `VARCHAR(255)` | NOT NULL |  |
| `industry` | `VARCHAR(255)` |  |  |
| `website` | `VARCHAR(500)` |  |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `opportunities`
*Internship or Job opportunities*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `company_id` | `UUID` | FK -> companies.id (RESTRICT) |  |
| `title` | `VARCHAR(255)` | NOT NULL |  |
| `type` | `VARCHAR(50)` | NOT NULL |  |
| `stipend_amount` | `NUMERIC(10,2)` |  |  |
| `total_openings` | `INTEGER` | NOT NULL |  |
| `status` | `VARCHAR(50)` | NOT NULL |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `applications`
*Student applications to opportunities*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `opportunity_id` | `UUID` | FK -> opportunities.id (RESTRICT) |  |
| `student_user_id` | `UUID` | FK -> users.id (RESTRICT) |  |
| `status` | `VARCHAR(50)` | NOT NULL |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `application_status_history`
*History table tracking application status changes*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `application_id` | `UUID` | FK -> applications.id (CASCADE) |  |
| `status` | `VARCHAR(50)` | NOT NULL |  |
| `remarks` | `TEXT` |  |  |
| `changed_at` | `TIMESTAMP` | DEFAULT NOW() |  |
| `changed_by` | `UUID` | FK -> users.id (NO ACTION) |  |

## Domain: Academics & LMS

### `modules`
*Learning modules within a program*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `program_id` | `UUID` | FK -> programs.id (RESTRICT) |  |
| `title` | `VARCHAR(255)` | NOT NULL |  |
| `sequence_order` | `INTEGER` | NOT NULL |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `assessments`
*Assessments tied to batches and modules*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `batch_id` | `UUID` | FK -> batches.id (RESTRICT) |  |
| `module_id` | `UUID` | FK -> modules.id (RESTRICT) |  |
| `title` | `VARCHAR(255)` | NOT NULL |  |
| `type` | `VARCHAR(50)` | NOT NULL |  |
| `total_marks` | `NUMERIC(5,2)` | NOT NULL |  |
| `passing_marks` | `NUMERIC(5,2)` | NOT NULL |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `assessment_submissions`
*Student submissions for assessments*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `assessment_id` | `UUID` | FK -> assessments.id (RESTRICT) |  |
| `student_user_id` | `UUID` | FK -> users.id (RESTRICT) |  |
| `score` | `NUMERIC(5,2)` |  |  |
| `status` | `VARCHAR(50)` | NOT NULL |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

## Domain: Operations

### `attendance_sessions`
*Daily sessions for attendance tracking*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `batch_id` | `UUID` | FK -> batches.id (RESTRICT) |  |
| `date` | `DATE` | NOT NULL |  |
| `status` | `VARCHAR(50)` | NOT NULL |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `attendance_records`
*Individual student attendance records*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `session_id` | `UUID` | FK -> attendance_sessions.id (CASCADE) |  |
| `student_user_id` | `UUID` | FK -> users.id (RESTRICT) |  |
| `status` | `VARCHAR(50)` | NOT NULL |  |
| `clock_in` | `TIMESTAMP` |  |  |
| `clock_out` | `TIMESTAMP` |  |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `leave_requests`
*Leave applications by students or employees*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `user_id` | `UUID` | FK -> users.id (RESTRICT) |  |
| `leave_type` | `VARCHAR(50)` | NOT NULL |  |
| `start_date` | `DATE` | NOT NULL |  |
| `end_date` | `DATE` | NOT NULL |  |
| `status` | `VARCHAR(50)` | NOT NULL |  |
| `reason` | `TEXT` | NOT NULL |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `leave_status_history`
*Audit trail for leave approvals*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `leave_request_id` | `UUID` | FK -> leave_requests.id (CASCADE) |  |
| `status` | `VARCHAR(50)` | NOT NULL |  |
| `remarks` | `TEXT` |  |  |
| `changed_at` | `TIMESTAMP` | DEFAULT NOW() |  |
| `changed_by` | `UUID` | FK -> users.id (NO ACTION) |  |

## Domain: Finance

### `invoices`
*Financial invoices (Fees, Programs)*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `user_id` | `UUID` | FK -> users.id (RESTRICT) |  |
| `invoice_number` | `VARCHAR(100)` | UNIQUE, NOT NULL |  |
| `amount` | `NUMERIC(10,2)` | NOT NULL |  |
| `status` | `VARCHAR(50)` | NOT NULL |  |
| `due_date` | `DATE` | NOT NULL |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |

### `payments`
*Payment transactions against invoices*

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PRIMARY KEY, DEFAULT uuid_generate_v4() |  |
| `invoice_id` | `UUID` | FK -> invoices.id (RESTRICT) |  |
| `transaction_id` | `VARCHAR(255)` | UNIQUE |  |
| `amount_paid` | `NUMERIC(10,2)` | NOT NULL |  |
| `payment_method` | `VARCHAR(50)` | NOT NULL |  |
| `status` | `VARCHAR(50)` | NOT NULL |  |
| `paid_at` | `TIMESTAMP` |  |  |
| `created_at` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updated_at` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |
| `deleted_at` | `TIMESTAMP` | DEFAULT NULL | Soft delete timestamp |
| `created_by` | `UUID` | FK -> users.id (NO ACTION) | User who created record |
| `updated_by` | `UUID` | FK -> users.id (NO ACTION) | User who last updated record |
