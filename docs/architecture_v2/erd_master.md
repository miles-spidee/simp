# Master Entity Relationship Diagram

```mermaid
erDiagram
    users {
        UUID id PK
        VARCHAR username
        VARCHAR email
        VARCHAR password_hash
        BOOLEAN is_active
        TIMESTAMP last_login_at
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    users ||--o{ users : "has"
    users ||--o{ users : "has"
    roles {
        UUID id PK
        VARCHAR name
        VARCHAR code
        TEXT description
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    users ||--o{ roles : "has"
    users ||--o{ roles : "has"
    user_roles {
        UUID user_id PK FK
        UUID role_id PK FK
        TIMESTAMP assigned_at
        UUID assigned_by FK
    }
    users ||--o{ user_roles : "has"
    roles ||--o{ user_roles : "has"
    users ||--o{ user_roles : "has"
    permissions {
        UUID id PK
        VARCHAR module
        VARCHAR action
        TEXT description
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    users ||--o{ permissions : "has"
    users ||--o{ permissions : "has"
    role_permissions {
        UUID role_id PK FK
        UUID permission_id PK FK
        TIMESTAMP granted_at
    }
    roles ||--o{ role_permissions : "has"
    permissions ||--o{ role_permissions : "has"
    organizations {
        UUID id PK
        VARCHAR code
        VARCHAR name
        VARCHAR type
        VARCHAR contact_email
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    users ||--o{ organizations : "has"
    users ||--o{ organizations : "has"
    departments {
        UUID id PK
        UUID organization_id FK
        VARCHAR code
        VARCHAR name
        UUID hod_user_id FK
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    organizations ||--o{ departments : "has"
    users ||--o{ departments : "has"
    users ||--o{ departments : "has"
    users ||--o{ departments : "has"
    programs {
        UUID id PK
        UUID department_id FK
        VARCHAR code
        VARCHAR name
        INTEGER duration_weeks
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    departments ||--o{ programs : "has"
    users ||--o{ programs : "has"
    users ||--o{ programs : "has"
    batches {
        UUID id PK
        UUID program_id FK
        VARCHAR code
        VARCHAR name
        DATE start_date
        DATE end_date
        INTEGER max_capacity
        VARCHAR status
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    programs ||--o{ batches : "has"
    users ||--o{ batches : "has"
    users ||--o{ batches : "has"
    student_profiles {
        UUID user_id PK FK
        UUID organization_id FK
        UUID department_id FK
        UUID batch_id FK
        VARCHAR enrollment_number
        VARCHAR resume_url
        VARCHAR github_url
        VARCHAR linkedin_url
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    users ||--o{ student_profiles : "has"
    organizations ||--o{ student_profiles : "has"
    departments ||--o{ student_profiles : "has"
    batches ||--o{ student_profiles : "has"
    users ||--o{ student_profiles : "has"
    users ||--o{ student_profiles : "has"
    employee_profiles {
        UUID user_id PK FK
        UUID organization_id FK
        VARCHAR employee_code
        VARCHAR designation
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    users ||--o{ employee_profiles : "has"
    organizations ||--o{ employee_profiles : "has"
    users ||--o{ employee_profiles : "has"
    users ||--o{ employee_profiles : "has"
    mentor_profiles {
        UUID user_id PK FK
        INTEGER max_capacity
        BOOLEAN is_available
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    users ||--o{ mentor_profiles : "has"
    users ||--o{ mentor_profiles : "has"
    users ||--o{ mentor_profiles : "has"
    mentor_batch_assignments {
        UUID mentor_user_id PK FK
        UUID batch_id PK FK
        TIMESTAMP assigned_at
    }
    users ||--o{ mentor_batch_assignments : "has"
    batches ||--o{ mentor_batch_assignments : "has"
    companies {
        UUID id PK
        VARCHAR name
        VARCHAR industry
        VARCHAR website
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    users ||--o{ companies : "has"
    users ||--o{ companies : "has"
    opportunities {
        UUID id PK
        UUID company_id FK
        VARCHAR title
        VARCHAR type
        NUMERIC stipend_amount
        INTEGER total_openings
        VARCHAR status
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    companies ||--o{ opportunities : "has"
    users ||--o{ opportunities : "has"
    users ||--o{ opportunities : "has"
    applications {
        UUID id PK
        UUID opportunity_id FK
        UUID student_user_id FK
        VARCHAR status
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    opportunities ||--o{ applications : "has"
    users ||--o{ applications : "has"
    users ||--o{ applications : "has"
    users ||--o{ applications : "has"
    application_status_history {
        UUID id PK
        UUID application_id FK
        VARCHAR status
        TEXT remarks
        TIMESTAMP changed_at
        UUID changed_by FK
    }
    applications ||--o{ application_status_history : "has"
    users ||--o{ application_status_history : "has"
    modules {
        UUID id PK
        UUID program_id FK
        VARCHAR title
        INTEGER sequence_order
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    programs ||--o{ modules : "has"
    users ||--o{ modules : "has"
    users ||--o{ modules : "has"
    assessments {
        UUID id PK
        UUID batch_id FK
        UUID module_id FK
        VARCHAR title
        VARCHAR type
        NUMERIC total_marks
        NUMERIC passing_marks
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    batches ||--o{ assessments : "has"
    modules ||--o{ assessments : "has"
    users ||--o{ assessments : "has"
    users ||--o{ assessments : "has"
    assessment_submissions {
        UUID id PK
        UUID assessment_id FK
        UUID student_user_id FK
        NUMERIC score
        VARCHAR status
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    assessments ||--o{ assessment_submissions : "has"
    users ||--o{ assessment_submissions : "has"
    users ||--o{ assessment_submissions : "has"
    users ||--o{ assessment_submissions : "has"
    attendance_sessions {
        UUID id PK
        UUID batch_id FK
        DATE date
        VARCHAR status
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    batches ||--o{ attendance_sessions : "has"
    users ||--o{ attendance_sessions : "has"
    users ||--o{ attendance_sessions : "has"
    attendance_records {
        UUID id PK
        UUID session_id FK
        UUID student_user_id FK
        VARCHAR status
        TIMESTAMP clock_in
        TIMESTAMP clock_out
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    attendance_sessions ||--o{ attendance_records : "has"
    users ||--o{ attendance_records : "has"
    users ||--o{ attendance_records : "has"
    users ||--o{ attendance_records : "has"
    leave_requests {
        UUID id PK
        UUID user_id FK
        VARCHAR leave_type
        DATE start_date
        DATE end_date
        VARCHAR status
        TEXT reason
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    users ||--o{ leave_requests : "has"
    users ||--o{ leave_requests : "has"
    users ||--o{ leave_requests : "has"
    leave_status_history {
        UUID id PK
        UUID leave_request_id FK
        VARCHAR status
        TEXT remarks
        TIMESTAMP changed_at
        UUID changed_by FK
    }
    leave_requests ||--o{ leave_status_history : "has"
    users ||--o{ leave_status_history : "has"
    invoices {
        UUID id PK
        UUID user_id FK
        VARCHAR invoice_number
        NUMERIC amount
        VARCHAR status
        DATE due_date
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    users ||--o{ invoices : "has"
    users ||--o{ invoices : "has"
    users ||--o{ invoices : "has"
    payments {
        UUID id PK
        UUID invoice_id FK
        VARCHAR transaction_id
        NUMERIC amount_paid
        VARCHAR payment_method
        VARCHAR status
        TIMESTAMP paid_at
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
        UUID created_by FK
        UUID updated_by FK
    }
    invoices ||--o{ payments : "has"
    users ||--o{ payments : "has"
    users ||--o{ payments : "has"
```
