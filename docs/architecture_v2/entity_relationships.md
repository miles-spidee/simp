# Entity Relationships (V2)

### `users`
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `roles`
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `user_roles`
- **Many-to-One**: Belongs to `users` via `user_id` (ON DELETE CASCADE)
- **Many-to-One**: Belongs to `roles` via `role_id` (ON DELETE CASCADE)
- **Many-to-One**: Belongs to `users` via `assigned_by` (ON DELETE undefined)

### `permissions`
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `role_permissions`
- **Many-to-One**: Belongs to `roles` via `role_id` (ON DELETE CASCADE)
- **Many-to-One**: Belongs to `permissions` via `permission_id` (ON DELETE CASCADE)

### `organizations`
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `departments`
- **Many-to-One**: Belongs to `organizations` via `organization_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `hod_user_id` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `programs`
- **Many-to-One**: Belongs to `departments` via `department_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `batches`
- **Many-to-One**: Belongs to `programs` via `program_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `student_profiles`
- **Many-to-One**: Belongs to `users` via `user_id` (ON DELETE CASCADE)
- **Many-to-One**: Belongs to `organizations` via `organization_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `departments` via `department_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `batches` via `batch_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `employee_profiles`
- **Many-to-One**: Belongs to `users` via `user_id` (ON DELETE CASCADE)
- **Many-to-One**: Belongs to `organizations` via `organization_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `mentor_profiles`
- **Many-to-One**: Belongs to `users` via `user_id` (ON DELETE CASCADE)
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `mentor_batch_assignments`
- **Many-to-One**: Belongs to `users` via `mentor_user_id` (ON DELETE CASCADE)
- **Many-to-One**: Belongs to `batches` via `batch_id` (ON DELETE CASCADE)

### `companies`
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `opportunities`
- **Many-to-One**: Belongs to `companies` via `company_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `applications`
- **Many-to-One**: Belongs to `opportunities` via `opportunity_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `student_user_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `application_status_history`
- **Many-to-One**: Belongs to `applications` via `application_id` (ON DELETE CASCADE)
- **Many-to-One**: Belongs to `users` via `changed_by` (ON DELETE undefined)

### `modules`
- **Many-to-One**: Belongs to `programs` via `program_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `assessments`
- **Many-to-One**: Belongs to `batches` via `batch_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `modules` via `module_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `assessment_submissions`
- **Many-to-One**: Belongs to `assessments` via `assessment_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `student_user_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `attendance_sessions`
- **Many-to-One**: Belongs to `batches` via `batch_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `attendance_records`
- **Many-to-One**: Belongs to `attendance_sessions` via `session_id` (ON DELETE CASCADE)
- **Many-to-One**: Belongs to `users` via `student_user_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `leave_requests`
- **Many-to-One**: Belongs to `users` via `user_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `leave_status_history`
- **Many-to-One**: Belongs to `leave_requests` via `leave_request_id` (ON DELETE CASCADE)
- **Many-to-One**: Belongs to `users` via `changed_by` (ON DELETE undefined)

### `invoices`
- **Many-to-One**: Belongs to `users` via `user_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)

### `payments`
- **Many-to-One**: Belongs to `invoices` via `invoice_id` (ON DELETE RESTRICT)
- **Many-to-One**: Belongs to `users` via `created_by` (ON DELETE undefined)
- **Many-to-One**: Belongs to `users` via `updated_by` (ON DELETE undefined)
