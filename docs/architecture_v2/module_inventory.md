# Module Inventory (V2)

## Identity & RBAC
- **users**: Central identity table for all users (students, mentors, admins, etc.)
- **roles**: RBAC Roles
- **user_roles**: Junction table mapping users to roles
- **permissions**: RBAC Permissions
- **role_permissions**: Junction table mapping roles to permissions

## Organization Hierarchy
- **organizations**: Top-level organizations or colleges
- **departments**: Departments within organizations
- **programs**: Academic or Training programs
- **batches**: Batches of programs

## User Profiles
- **student_profiles**: Student-specific data tied to a user
- **employee_profiles**: Employee-specific data (HR, Managers, Coordinators)
- **mentor_profiles**: Mentor-specific data (can be employees or external)
- **mentor_batch_assignments**: Junction mapping mentors to batches

## Internships & Placements
- **companies**: Companies offering internships/placements
- **opportunities**: Internship or Job opportunities
- **applications**: Student applications to opportunities
- **application_status_history**: History table tracking application status changes

## Academics & LMS
- **modules**: Learning modules within a program
- **assessments**: Assessments tied to batches and modules
- **assessment_submissions**: Student submissions for assessments

## Operations
- **attendance_sessions**: Daily sessions for attendance tracking
- **attendance_records**: Individual student attendance records
- **leave_requests**: Leave applications by students or employees
- **leave_status_history**: Audit trail for leave approvals

## Finance
- **invoices**: Financial invoices (Fees, Programs)
- **payments**: Payment transactions against invoices
