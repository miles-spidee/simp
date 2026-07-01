# Migration Plan & Dependency Graph (V2)

Tables must be created in the following strict order to satisfy Foreign Key constraints:

## Phase 1
- `users`

## Phase 2
- `roles`
- `permissions`
- `organizations`
- `mentor_profiles`
- `companies`
- `leave_requests`
- `invoices`

## Phase 3
- `user_roles`
- `role_permissions`
- `departments`
- `employee_profiles`
- `opportunities`
- `leave_status_history`
- `payments`

## Phase 4
- `programs`
- `applications`

## Phase 5
- `batches`
- `application_status_history`
- `modules`

## Phase 6
- `student_profiles`
- `mentor_batch_assignments`
- `assessments`
- `attendance_sessions`

## Phase 7
- `assessment_submissions`
- `attendance_records`
