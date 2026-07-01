# Entity Inventory (V2)

### Table: `users`
- **Module**: Identity & RBAC
- **Columns Count**: 11
- **Purpose**: Central identity table for all users (students, mentors, admins, etc.)

### Table: `roles`
- **Module**: Identity & RBAC
- **Columns Count**: 9
- **Purpose**: RBAC Roles

### Table: `user_roles`
- **Module**: Identity & RBAC
- **Columns Count**: 4
- **Purpose**: Junction table mapping users to roles

### Table: `permissions`
- **Module**: Identity & RBAC
- **Columns Count**: 9
- **Purpose**: RBAC Permissions

### Table: `role_permissions`
- **Module**: Identity & RBAC
- **Columns Count**: 3
- **Purpose**: Junction table mapping roles to permissions

### Table: `organizations`
- **Module**: Organization Hierarchy
- **Columns Count**: 10
- **Purpose**: Top-level organizations or colleges

### Table: `departments`
- **Module**: Organization Hierarchy
- **Columns Count**: 10
- **Purpose**: Departments within organizations

### Table: `programs`
- **Module**: Organization Hierarchy
- **Columns Count**: 10
- **Purpose**: Academic or Training programs

### Table: `batches`
- **Module**: Organization Hierarchy
- **Columns Count**: 13
- **Purpose**: Batches of programs

### Table: `student_profiles`
- **Module**: User Profiles
- **Columns Count**: 13
- **Purpose**: Student-specific data tied to a user

### Table: `employee_profiles`
- **Module**: User Profiles
- **Columns Count**: 9
- **Purpose**: Employee-specific data (HR, Managers, Coordinators)

### Table: `mentor_profiles`
- **Module**: User Profiles
- **Columns Count**: 8
- **Purpose**: Mentor-specific data (can be employees or external)

### Table: `mentor_batch_assignments`
- **Module**: User Profiles
- **Columns Count**: 3
- **Purpose**: Junction mapping mentors to batches

### Table: `companies`
- **Module**: Internships & Placements
- **Columns Count**: 9
- **Purpose**: Companies offering internships/placements

### Table: `opportunities`
- **Module**: Internships & Placements
- **Columns Count**: 12
- **Purpose**: Internship or Job opportunities

### Table: `applications`
- **Module**: Internships & Placements
- **Columns Count**: 9
- **Purpose**: Student applications to opportunities

### Table: `application_status_history`
- **Module**: Internships & Placements
- **Columns Count**: 6
- **Purpose**: History table tracking application status changes

### Table: `modules`
- **Module**: Academics & LMS
- **Columns Count**: 9
- **Purpose**: Learning modules within a program

### Table: `assessments`
- **Module**: Academics & LMS
- **Columns Count**: 12
- **Purpose**: Assessments tied to batches and modules

### Table: `assessment_submissions`
- **Module**: Academics & LMS
- **Columns Count**: 10
- **Purpose**: Student submissions for assessments

### Table: `attendance_sessions`
- **Module**: Operations
- **Columns Count**: 9
- **Purpose**: Daily sessions for attendance tracking

### Table: `attendance_records`
- **Module**: Operations
- **Columns Count**: 11
- **Purpose**: Individual student attendance records

### Table: `leave_requests`
- **Module**: Operations
- **Columns Count**: 12
- **Purpose**: Leave applications by students or employees

### Table: `leave_status_history`
- **Module**: Operations
- **Columns Count**: 6
- **Purpose**: Audit trail for leave approvals

### Table: `invoices`
- **Module**: Finance
- **Columns Count**: 11
- **Purpose**: Financial invoices (Fees, Programs)

### Table: `payments`
- **Module**: Finance
- **Columns Count**: 12
- **Purpose**: Payment transactions against invoices
