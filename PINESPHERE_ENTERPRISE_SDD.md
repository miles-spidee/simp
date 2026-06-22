# PINESPHERE ERP: ENTERPRISE SOFTWARE DESIGN DOCUMENT (SDD) & FSD
*Version 2.0 - Comprehensive Master Blueprint*

This document serves as the absolute single source of truth. It consolidates the SDD, FSD, API Contracts, DDD, Frontend/Backend Architectures, and Middleware Designs. 

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

### 1.1 Composable Modular Monolith
Pinesphere operates as a modular monolith. Modules exist independently in the codebase but share a unified deployment and database instance for V1.
- **Frontend**: Next.js 14+ (App Router), React 18, TailwindCSS, Shadcn UI.
- **Backend**: FastAPI (Python 3.10+), SQLAlchemy (ORM).
- **Database**: PostgreSQL 15+.
- **Mobile**: Flutter (Dart) sharing the same REST APIs.
- **Event Bus**: Redis Pub/Sub for cross-module async communication.

---

## 2. GLOBAL SYSTEM VIEWS

### 2.1 Middleware Design Document
Middleware sits between the ASGI server and the FastAPI routing layer.

1. **Authentication Middleware**:
   - *Input*: `Authorization: Bearer <JWT>`
   - *Rules*: Validates RS256 signature. Decodes `user_id`, `role_id`, `tenant_id`.
   - *Failure Cases*: Returns `401 Unauthorized` for expired/invalid tokens.
   - *Output*: Attaches `CurrentUser` object to `request.state.user`.

2. **Authorization (RBAC) Middleware**:
   - *Input*: `request.state.user.role_id`, Route's required permission (e.g., `lms:write`).
   - *Rules*: Queries cached Permission Matrix. 
   - *Failure Cases*: Returns `403 Forbidden` if role lacks permission.

3. **Validation & Error Middleware**:
   - *Rules*: Catches `PydanticValidationError` and `SQLAlchemyError`. Formats into standardized JSON `{ "error": { "code": 422, "message": "...", "fields": [...] } }`.

4. **Audit Middleware**:
   - *Rules*: Asynchronously logs all `POST/PUT/DELETE` requests to `audit_logs` table (User ID, IP, Route, Payload Hash).

### 2.2 Global API Contract Standards
- **Protocol**: HTTPS / REST.
- **Response Standard**:
  ```json
  {
    "status": "success",
    "data": { ... },
    "meta": { "pagination": { "page": 1, "total": 45 } }
  }
  ```
- **Error Standard**:
  ```json
  {
    "status": "error",
    "error": { "code": "VALIDATION_FAILED", "message": "Email already exists" }
  }
  ```

---

## 3. CORE MODULE SPECIFICATIONS

*(Note: The following exhaustive blueprint is applied to the foundational modules that drive the ERP. All 20+ modules follow this exact structural template.)*

---

### MODULE 1: IDENTITY & ACCESS MANAGEMENT (IAM)

**1. Business View**
Manages who can access the platform and what they can do. Eliminates the need for hardcoded privileges by providing a dynamic Role and Module assignment system.

**2. Functional View**
Administrators can create Users, define Roles, select which Modules belong to a Role, and define explicit User-Level overrides.

**3. Frontend View**
- *Components*: `CreateUserWizard`, `CreateRoleWizard`, `PermissionsMatrix`.
- *State*: Consumes `identity.service.ts`.
- *UI Logic*: Renders a checkbox grid mapping `Modules` -> `Permissions (C/R/U/D)`.

**4. Backend View**
- *Folder*: `app/api/v1/identity`
- *Services*: `UserService`, `RoleService`, `AuthService`.
- *Hashing*: `bcrypt` for passwords.

**5. Database View (DDD)**
- `users`: `id(UUID)`, `email(VARCHAR)`, `password_hash(VARCHAR)`, `role_id(FK)`, `status(ENUM)`.
- `roles`: `id(UUID)`, `name(VARCHAR)`.
- `modules`: `id(UUID)`, `code(VARCHAR)`.
- `role_modules`: `role_id(FK)`, `module_id(FK)`.
- `permissions`: `id(UUID)`, `role_id(FK)`, `action(VARCHAR)`.

**6. API View (Contracts)**
- `POST /api/v1/identity/login`
  - *Request*: `{ "email": "...", "password": "..." }`
  - *Response*: `{ "data": { "token": "jwt...", "user": {...} } }`
- `POST /api/v1/identity/roles`
  - *Request*: `{ "name": "HR", "module_ids": ["m1", "m2"], "permissions": ["users:read"] }`

**7. URL Structure (Frontend)**
- `/admin/users`
- `/admin/roles`

**8. Event Flows & Sequence Diagrams**
- *Event*: `RoleUpdatedEvent`
- *Sequence*: `Admin -> Frontend (POST /roles) -> API -> RoleService -> DB(Commit) -> Redis(Publish RoleUpdatedEvent) -> Clear Cache`.

**9. Permissions**
- `identity:view`, `identity:create`, `identity:update`, `identity:delete`.

**10. User Journeys**
- *Admin creating a Coordinator*: Admin navigates to `/admin/users` -> Clicks "Add User" -> Fills form -> Selects "College Coordinator" role -> Submits -> System sends Welcome Email with OTP.

**11. Edge Cases & Validations**
- *Edge Case*: Deleting a Role currently assigned to active users.
- *Validation*: Backend must block deletion and return `409 Conflict: Reassign users before deleting role`.

**12. Dependencies**
- Does not depend on any other module. All other modules depend on Identity.

---

### MODULE 2: APPLICATION & ONBOARDING

**1. Business View**
Acts as the CRM/Funnel for incoming students. Tracks them from public website application to approved enrollment.

**2. Functional View**
Public users submit forms. Coordinators or HR review applications (Approve/Reject/Waitlist). Approved applications automatically convert into Student accounts.

**3. Database View (DDD)**
- `applications`: `id(UUID)`, `first_name`, `last_name`, `email`, `program_id(FK)`, `status(ENUM: Pending, Approved, Rejected)`.

**4. Event Flows (The Conversion Pipeline)**
- *Trigger*: `PUT /api/v1/applications/{id}/status` payload: `{"status": "Approved"}`
- *Middleware*: Validates user has `application:approve` permission.
- *Event*: `ApplicationApprovedEvent` is published.
- *Listener (Identity Module)*: Consumes event -> Creates User -> Assigns 'Student' Role.
- *Listener (Notification Module)*: Sends 'Welcome to Pinesphere' email.

**5. Edge Cases**
- *Edge Case*: Applicant applies twice with same email.
- *Validation*: `email` must be unique in `applications` table WHERE status = Pending.

---

### MODULE 3: LEARNING MANAGEMENT SYSTEM (LMS)

**1. Business View**
The core delivery mechanism for academic content.

**2. Frontend View**
- *Pages*: `/admin/lms/courses`, `/student/lms/player`
- *Components*: `VideoPlayerWidget`, `CourseProgressTracker`.

**3. Database View (DDD)**
- `courses`: `id(PK)`, `title`, `description`.
- `chapters`: `id(PK)`, `course_id(FK)`, `order(INT)`.
- `lessons`: `id(PK)`, `chapter_id(FK)`, `video_url`, `content_md`.
- `student_progress`: `student_id(FK)`, `lesson_id(FK)`, `completed(BOOL)`.

**4. API View**
- `GET /api/v1/lms/courses/{id}/progress`
  - *Middleware*: Scopes query to `request.state.user.id`.
  - *Response*: `{ "data": { "completed_lessons": 12, "total": 20, "percentage": 60 } }`

**5. Edge Cases & Validations**
- *Edge Case*: Student tries to skip ahead to Lesson 5 without completing Lesson 4.
- *Validation*: API validates `previous_lesson.completed == True` before returning Lesson 5 payload.

---

### MODULE 4: SUBMISSION & ASSESSMENT

**1. Business View**
Evaluates student competency via daily github submissions or timed quizzes.

**2. Backend View (Architecture)**
- Uses Strategy Pattern for evaluation. `ManualEvaluationStrategy` (Mentor reviews) vs `AutoEvaluationStrategy` (Quiz answers compared against DB).

**3. Database View (DDD)**
- `tasks`: `id(PK)`, `course_id(FK)`, `title`, `deadline`.
- `submissions`: `id(PK)`, `task_id(FK)`, `student_id(FK)`, `repo_url`, `status(ENUM: Pending, Graded)`.
- `grades`: `submission_id(FK)`, `mentor_id(FK)`, `score(INT)`, `feedback(TEXT)`.

**4. Event Flows**
- *Trigger*: Mentor submits grade.
- *Event*: `SubmissionGradedEvent(student_id, score)`.
- *Listener (Performance Module)*: Recalculates student's KPI Radar (Technical/Delivery scores) based on the new grade weight.

**5. Permissions**
- `submission:submit` (Students)
- `submission:grade` (Mentors)

---

### MODULE 5: BATCH & ALLOCATION

**1. Business View**
Groups students into cohorts and assigns them to specific mentors for personalized guidance.

**2. Middleware View (Row-Level Security / Data Isolation)**
This module powers the Multi-Tenant/Isolation middleware.
- When a Mentor calls `GET /api/v1/students`, the Middleware intercepts.
- It queries the `allocations` table to find all `batch_ids` assigned to `request.state.user.id`.
- It injects `WHERE batch_id IN (...)` into the SQL query. 

**3. Database View (DDD)**
- `batches`: `id(PK)`, `name`, `start_date`, `end_date`.
- `student_batch_mapping`: `student_id(FK)`, `batch_id(FK)`.
- `mentor_allocations`: `mentor_id(FK)`, `batch_id(FK)`.

---

## 4. SYSTEM FLOW DOCUMENT (SEQUENCE DIAGRAM LOGIC)

### The Golden Path: Application to Graduation
1. **Visitor** submits `/api/v1/applications`. (Status: Pending)
2. **HR** views application on Frontend. Clicks "Approve".
3. **Backend** updates Application Status. Emits `AppApproved`.
4. **Identity Service** intercepts event. Creates `User` account.
5. **Batch Service** automatically assigns User to open `Batch`.
6. **Student** logs in. JWT generated.
7. **Frontend Dynamic Router** parses JWT Role -> Loads `StudentDashboard`.
8. **Student** views `LMS`. Submits Github link to `Submissions`.
9. **Mentor** logs in. Dashboard queries isolated `allocations`. Mentor sees Student's submission.
10. **Mentor** grades submission. Emits `SubmissionGraded`.
11. **Performance Module** updates KPI.
12. **Coordinator** logs in. Views aggregated KPI of all students in their college.

---

## 5. FUTURE EXPANSION STRATEGY

Because Pinesphere relies entirely on Foreign Keys (DB) and Events (Backend) and a Service Layer (Frontend):
To add a **Placement Module** in V2:
1. *Database*: Create `placements` table linking `student_id(FK)`.
2. *Backend*: Build `/api/v1/placements`.
3. *Identity*: Add `Placement` to `modules` table.
4. *Frontend*: Add `PlacementService.ts` and `/admin/placements/page.tsx`.
5. *Result*: The system will automatically render the Placement icon in the Sidebar for anyone given the permission, completely isolated from LMS, Attendance, or HR logic.
