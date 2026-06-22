# PINESPHERE ERP: MASTER SYSTEM BLUEPRINT & ARCHITECTURE DOCUMENTATION

*Version 1.0 - Comprehensive Technical & Functional Specification*

---

## SECTION 1: EXECUTIVE SUMMARY

### 1.1 Why Pinesphere Exists
Pinesphere ERP was conceived to solve the monolithic rigidity of traditional educational and organizational management systems. Historically, platforms force institutions into buying massive, tightly coupled suites where modules cannot operate independently. Pinesphere exists to decouple business capabilities into atomic, standalone nano-modules.

### 1.2 Business Goals
- Reduce software bloat by allowing institutions to selectively enable modules.
- Streamline the internship and academic lifecycle from application to graduation.
- Provide a single source of truth for HR, Mentors, Students, and Coordinators.
- Monetize modules via a future App Marketplace model.

### 1.3 Product Goals
- **Backendless UI-First**: UI components rely purely on a Service Layer.
- **Dynamic Platform Controller**: Navigation, dashboards, and views are generated purely based on assigned modules and permissions.
- **API Agnostic**: Capable of switching backend architectures seamlessly.

### 1.4 Long Term Vision
To evolve from an internship management system into a global enterprise OS consisting of 100+ deployable, version-controlled nano-modules.

### 1.5 Market Problem
Traditional ERPs (like SAP or Oracle for Education) are extremely expensive to customize. Upgrading one module (like Payroll) risks breaking another (like Attendance). Pinesphere solves this through **Composable Modular Architecture**.

---

## SECTION 2: SYSTEM PHILOSOPHY

### 2.1 Composable Modular Architecture
We rejected the traditional MVC monolith. In Pinesphere, the `Employee` capability has zero hardcoded dependencies on the `Payroll` capability. They interact purely through Database Foreign Keys and API Event Triggers. 

### 2.2 Independent Modules
Every module is treated like a microservice in the frontend. It has its own route, its own service class, and its own mock data registry. It can be disabled by simply flipping `active: false` in the Module Registry.

### 2.3 Rejection of Traditional ERP
Traditional ERPs use hardcoded sidebars and permission checks wrapped in dense `if/else` UI blocks. Pinesphere dynamically computes the entire UI based on a flat array of `userModules` returned during Authentication.

### 2.4 Future Marketplace Vision
Eventually, 3rd party developers will be able to build a "Module" (e.g., *Advanced Analytics*). Administrators can install it, assign it to the `HR` role, and the system will instantly generate the sidebar navigation and routing without core code changes.

---

## SECTION 3: USER HIERARCHY

### 3.1 Visitor
- **Purpose**: Public users looking at the company portal.
- **Responsibilities**: Viewing open programs and opportunities. Applying for internships.
- **Allowed Modules**: Opportunity, Application.
- **User Journey**: Visit Website -> View Opportunities -> Submit Application -> Await Auth Credentials.

### 3.2 Student
- **Purpose**: The primary consumer of the learning platform.
- **Responsibilities**: Consuming LMS content, submitting capstone tasks, marking attendance.
- **Restrictions**: Cannot view other students' grades or mentor details.
- **Allowed Modules**: LMS, Task, Assessment, Submission, Attendance.
- **User Journey**: Login -> View Student Dashboard -> Complete Daily Task -> Submit Github Link -> Mark Attendance.

### 3.3 Mentor
- **Purpose**: Academic guides and evaluators.
- **Responsibilities**: Grading student submissions, unlocking LMS modules, tracking performance.
- **Restrictions**: Limited only to students allocated to their specific Batch.
- **Allowed Modules**: Mentor, Task, Assessment, Submission, Attendance, Performance.
- **User Journey**: Login -> Mentor Dashboard -> View Allocated Batch -> Grade Pending Capstones.

### 3.4 HR
- **Purpose**: Internal organizational management.
- **Responsibilities**: Managing employee records, payroll, and internal hierarchy.
- **Allowed Modules**: Employee, Organization, Attendance, Performance.
- **User Journey**: Login -> HR Dashboard -> Add New Employee -> Monitor Staff Attendance.

### 3.5 College Coordinator
- **Purpose**: External stakeholders tracking their university's students.
- **Responsibilities**: Monitoring internship progress for students belonging to their specific college.
- **Restrictions**: Strict row-level security ensuring they only see their college's data.
- **Allowed Modules**: College Coordinator, Student, Attendance, Performance.
- **User Journey**: Login -> Coordinator Dashboard -> View College KPIs -> Identify At-Risk Students.

### 3.6 Super Admin
- **Purpose**: The Platform Controller.
- **Responsibilities**: System configuration, module registry management, role overriding.
- **Allowed Modules**: ALL MODULES.
- **User Journey**: Login -> Admin System Overview -> Assign new Module to Role -> Create new User.

---

## SECTION 4: COMPLETE MODULE BREAKDOWN

*(Representative sample of core modules due to scale)*

### 4.1 Identity Module
- **Purpose / Business Goal**: Manage platform access and RBAC.
- **Nano Modules**: Users, Roles, Permissions, Overrides.
- **Data Ownership**: `users`, `roles`, `role_modules` tables.
- **Events Produced**: `UserCreated`, `RoleUpdated`.
- **Components/Pages**: `CreateUserWizard`, `CreateRoleWizard`, `/admin/users`, `/admin/roles`.
- **Permissions**: `identity:view`, `identity:create`, `identity:delete`.

### 4.2 Application Module
- **Purpose / Business Goal**: Ingest potential students from public forms.
- **Data Ownership**: `applications` table.
- **Events Produced**: `ApplicationApproved` -> Triggers `StudentCreated`.
- **Components/Pages**: Kanban board for application stages. `/admin/application`.

### 4.3 Learning Management (LMS) Module
- **Purpose / Business Goal**: Deliver video/text content sequentially.
- **Nano Modules**: Courses, Chapters, Lessons, Progress Tracking.
- **Data Ownership**: `courses`, `lessons`, `student_progress`.
- **Events Consumed**: `TaskCompleted` (to unlock next lesson).

### 4.4 Submission Module
- **Purpose / Business Goal**: Track student code/Github submissions for capstones.
- **Data Ownership**: `submissions`, `reviews`.
- **Events Produced**: `SubmissionGraded` -> Updates `Performance` module.

---

## SECTION 5: COMPLETE USER JOURNEY FLOWS

### 5.1 Visitor Flow
`Visit Public Site` -> `Browse Opportunities` -> `Fill Application Form` -> `Application Module (Pending)`

### 5.2 Application to Student Conversion Flow
`HR Reviews Application` -> `Status = Approved` -> `Event: ApplicationApproved` -> `Identity Module generates User` -> `Email Credentials to User` -> `Student logs into LMS`

### 5.3 Daily Student Execution Flow
`Login` -> `Dynamic Router loads StudentDashboard` -> `Student clicks LMS` -> `Watches Video` -> `Navigates to Tasks` -> `Uploads Github URL to Submission Module` -> `Marks Attendance` -> `Logout`

### 5.4 Mentor Evaluation Flow
`Login` -> `Dynamic Router loads MentorDashboard` -> `Notification: Pending Submissions` -> `Clicks Submission` -> `Grades 85/100` -> `Event: SubmissionGraded` -> `Student KPI Radar Updates`

---

## SECTION 6: URL ARCHITECTURE

- `/` : Public landing page.
- `/auth/login` : JWT authentication entry point.
- `/auth/forgot-password` : OTP based recovery.
- `/dashboard` : The Dynamic Role-Evaluating Router. Decides where to send the user based on their JWT.
- `/admin` : Super Admin Dashboard (Platform Overview).
- `/admin/users` : Identity Module -> User Management.
- `/admin/roles` : Identity Module -> Role & Permission Matrix.
- `/admin/employee` : Employee Module grid.
- `/admin/organization` : Org hierarchy tree.
- `/admin/program` : Internship program creation.
- `/admin/batch` : Grouping students into cohorts.
- `/admin/lms` : Learning management course builder/viewer.
- `/admin/task` : Daily task assignments.
- `/admin/submission` : Grading interfaces.
- `/admin/attendance` : Check-in logs.

*Expected Response*: Protected routes return HTTP 200 if JWT is valid and Role has assigned `ModuleID`. Else HTTP 403 Forbidden.

---

## SECTION 7: FRONTEND ARCHITECTURE

### 7.1 Folder Structure
- `src/app`: Next.js 16 App Router pages.
- `src/components/ui`: Atomic Shadcn components.
- `src/components/admin`: Smart module layouts and wizards.
- `src/components/dashboards`: Role-specific widgets (`StudentDashboard.tsx`).
- `src/services`: The asynchronous API wrapper.
- `src/data`: Relational mock data (PostgreSQL simulation).

### 7.2 Service & Mock Layer Architecture
Components call `await moduleService.getModules()`. Currently, the service responds with a `Promise` wrapping `src/data/mock-modules.ts`. Upon backend completion, we swap the internal logic of the service to `axios.get('/api/modules')`.

### 7.3 Dynamic Navigation & Role Rendering
1. `AuthContext` decodes JWT.
2. Sidebar component triggers `userService.getUserModules(user.id)`.
3. System maps user's `roleId` to `MOCK_ROLES`, extracts `moduleIds`.
4. Merges with `moduleOverrides`.
5. Maps against `MOCK_MODULES` to generate visual Sidebar links.

---

## SECTION 8: BACKEND ARCHITECTURE (FastAPI)

### 8.1 Modular Monolith in FastAPI
The backend mimics the frontend's independence using FastAPI `APIRouter`.

### 8.2 Folder Structure
- `app/api/v1/identity`
- `app/api/v1/lms`
- `app/api/v1/attendance`
- `app/core` (Security, JWT, Config)
- `app/db` (SQLAlchemy models)
- `app/services` (Business logic)

### 8.3 Layers
- **Repository Pattern**: Abstracts SQLAlchemy calls (`db.query(User).all()`).
- **Service Layer**: Business rules (`if student_has_unpaid_fees: raise Error`).
- **Auth Layer**: JWT encoding/decoding via `PyJWT`.

---

## SECTION 9: DATABASE ARCHITECTURE (PostgreSQL)

### 9.1 Core Identity Schema
- `users`: `id (PK)`, `email`, `password_hash`, `role_id (FK)`
- `roles`: `id (PK)`, `name`
- `modules`: `id (PK)`, `code`, `route`
- `role_modules` (Junction): `role_id (FK)`, `module_id (FK)`
- `user_module_overrides` (Junction): `user_id (FK)`, `module_id (FK)`

### 9.2 Execution Schema
- `programs`: `id (PK)`, `name`
- `batches`: `id (PK)`, `program_id (FK)`
- `student_allocations`: `student_id (FK)`, `batch_id (FK)`, `mentor_id (FK)`
- `submissions`: `id (PK)`, `task_id (FK)`, `student_id (FK)`, `repo_url`, `grade`
- `attendance_logs`: `id (PK)`, `user_id (FK)`, `date`, `status`

*Ownership*: The Identity Module owns the `users` table. The LMS Module owns the `courses` table.

---

## SECTION 10: API SPECIFICATION

### Identity Module APIs
- `GET /api/v1/users` (RBAC: `identity:view`) -> Returns array of users.
- `POST /api/v1/users` (RBAC: `identity:create`) -> Creates user.
- `GET /api/v1/users/{id}/modules` -> Joins `role_modules` and `user_module_overrides` to return dynamic navigation array.

### Execution Module APIs
- `POST /api/v1/submissions` (RBAC: `submission:create`) -> Payload: `{ task_id, repo_url }`.
- `PUT /api/v1/submissions/{id}/grade` (RBAC: `submission:grade`) -> Payload: `{ grade, feedback }`.

---

## SECTION 11: MIDDLEWARE RESPONSIBILITIES

### 11.1 Authentication Middleware
- **Input**: HTTP Header `Authorization: Bearer <token>`
- **Rules**: Validate signature, check expiration.
- **Output**: Attach `user_id` and `role_id` to `request.state`.
- **Failure**: HTTP 401 Unauthorized.

### 11.2 Authorization (RBAC) Middleware
- **Input**: `request.state.role_id`, Required Permission (e.g., `lms:edit`)
- **Rules**: Query Redis/DB to check if `role_id` possesses `lms:edit`.
- **Failure**: HTTP 403 Forbidden.

### 11.3 Data Isolation (Row-Level) Middleware
- **Rules**: If user is `Mentor`, auto-append `WHERE mentor_id = X` to SQLAlchemy queries. If user is `College Coordinator`, auto-append `WHERE college_id = Y`.

---

## SECTION 12: MODULE COMMUNICATION

Modules communicate via asynchronous events (e.g., using RabbitMQ, Redis PubSub, or FastAPI BackgroundTasks).

**Event Flow Example**:
1. HR approves application via `PUT /api/v1/applications/{id}/approve`.
2. Application Module publishes `ApplicationApprovedEvent`.
3. Identity Module listens, creates a new `User` record, assigns `Student` role.
4. Notification Module listens, sends Welcome Email with JWT password reset link.

---

## SECTION 13: DASHBOARD ARCHITECTURE

Dashboards are read-only aggregation views.

### 13.1 Student Dashboard
- **Widgets**: Daily Agenda, LMS Progress Bar, Fees Outstanding, KPI Radar.
- **API**: `GET /api/v1/dashboard/student/{id}` (Aggregates across LMS, Finance, Tasks).

### 13.2 Mentor Dashboard
- **Widgets**: Batch Performance Matrix, Pending Submissions queue, At-Risk Students list.

### 13.3 Coordinator Dashboard
- **Widgets**: Aggregated College Attendance Averages, Placements tracking.

---

## SECTION 14: SECURITY MODEL

### 14.1 JWT & RBAC
Stateless authentication. Tokens carry role claims. The backend validates claims against a master Permission Matrix.

### 14.2 Multi-Tenant Isolation
Colleges and Mentors are strictly isolated at the database query level. A Mentor calling `GET /api/v1/students` will mathematically only receive students in their `student_allocations` table.

---

## SECTION 15: VERSION PLANNING

### 15.1 V1 Scope (Current)
Foundation Identity, Student Onboarding, Core LMS, Task Submission, Attendance Tracking, Basic Mentorship.

### 15.2 V2 Modules (Scaling)
- **Analytics Module**: Advanced data warehousing for Coordinator reports.
- **Notification Module**: Centralized WebSocket & Email dispatching.
- **Certificate Module**: Blockchain/PDF generation upon graduation.

### 15.3 V3 Modules (Enterprise Ecosystem)
- **AI Mentor Module**: LLM integration to pre-grade basic submissions.
- **AI Interview Module**: Automated technical screening.
- **Placement Module**: Connecting graduated students directly to enterprise clients.

---
*End of Blueprint. This document guarantees total alignment between Frontend React architecture, Backend FastAPI infrastructure, and PostgreSQL Database design.*
