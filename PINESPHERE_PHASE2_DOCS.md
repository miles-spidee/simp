# Pinesphere ERP - Phase 2: Internship Operations Documentation

## 1. Module Documentation
Phase 2 introduces four core modules to handle operations after interns are onboarded:
- **Reporting Manager Module**: Enables tracking and management of assigned interns, their performance, reviews, and evaluations.
- **Leave Management**: Manages leave requests for Students, Mentors, and Employees with an approval workflow.
- **Activity Tracking**: Provides a system-wide audit trail of all significant user actions, logins, submissions, and status changes.
- **Escalation Engine**: An automated rules-based engine that triggers notifications and escalates issues (e.g., consecutive absences, missed deadlines).

## 2. Folder Structure Updates
```text
simp/frontend/
├── app/
│   └── feature/
│       ├── activity/page.tsx
│       ├── escalation/page.tsx
│       ├── leave/page.tsx
│       └── reporting-manager/page.tsx
├── components/
│   └── admin/
│       ├── activity/ActivityDashboard.tsx
│       ├── escalation/EscalationDashboard.tsx
│       ├── leave/LeaveDashboard.tsx
│       └── reporting-manager/ReportingManagerDashboard.tsx
├── src/
│   ├── api/
│   │   ├── activity.api.ts
│   │   ├── escalation.api.ts
│   │   ├── leave.api.ts
│   │   └── reportingManager.api.ts
│   ├── data/
│   │   ├── mock-activities.ts
│   │   ├── mock-escalations.ts
│   │   ├── mock-leaves.ts
│   │   ├── mock-manager-assignments.ts
│   │   ├── mock-manager-evaluations.ts
│   │   └── mock-reporting-managers.ts
│   ├── services/
│   │   ├── activity.service.ts
│   │   ├── escalation.service.ts
│   │   ├── leave.service.ts
│   │   └── reportingManager.service.ts
│   └── types/
│       ├── activity.types.ts
│       ├── escalation.types.ts
│       ├── leave.types.ts
│       └── reporting-manager.types.ts
```

## 3. Permission Matrix
- **Reporting Manager (`reporting_manager.*`)**: `view`, `create`, `edit`, `review`, `approve`, `assign`
- **Leave Management (`leave.*`)**: `view`, `create`, `edit`, `delete`, `approve`, `reject`, `export`
- **Activity Tracking (`activity.*`)**: `view`
- **Escalation Engine (`escalation.*`)**: `view`, `edit`

Roles Updated:
- **Reporting Manager (New)**: Access to Reporting Manager, Leave, Attendance, Task, Assessment, Performance modules.
- **Student**: Granted `leave.view`, `leave.create`.
- **HR**: Granted full access to new modules.
- **College Coordinator**: Granted `leave.view`, `leave.approve`, `leave.reject`.
- **Super Admin**: Full access.

## 4. API Contracts
- **`reportingManagerApi`**: `getManagers`, `getManagerById`, `getAssignmentsByManager`, `getEvaluationsByManager`
- **`leaveApi`**: `getAllLeaves`, `getLeaveById`, `getLeavesByUser`, `createLeave`
- **`activityApi`**: `getAllActivities`, `getActivityById`, `getActivitiesByUser`
- **`escalationApi`**: `getRules`, `getEscalations`, `getEscalationById`, `updateEscalationStatus`

## 5. Mock Data Structure
- **Reporting Managers**: 20 records.
- **Manager Assignments**: 200 records simulating assigned interns, performance metrics, and risk levels.
- **Manager Evaluations**: 50 records of intern evaluations.
- **Leaves**: 50 records representing various leave types and statuses.
- **Activities**: 100 records simulating login, submission, and system audit logs.
- **Escalations**: 4 active rules, 25 log records detailing triggered notifications.

## 6. Workflow Diagrams
**Leave Workflow:**
Student/Mentor applies -> Pending State -> Reporting Manager/HR reviews -> Approved/Rejected State -> System updates Activity Log.

**Escalation Workflow:**
System Event (e.g., Absent 3 days) -> Engine checks Rule -> Rule matches -> Creates Escalation Log -> Notifies target roles -> Status becomes Pending -> HR/Manager resolves -> Status becomes Resolved.

## 7. ER Diagram Updates
- **`ReportingManager`** 1:N **`ManagerAssignment`** 1:1 **`Intern`**
- **`ManagerAssignment`** 1:N **`ManagerEvaluation`**
- **`User`** 1:N **`LeaveRequest`**
- **`User`** 1:N **`ActivityLog`**
- **`EscalationRule`** 1:N **`EscalationLog`**

## 8. Component Tree
- `ReportingManagerPage` -> `ReportingManagerDashboard` (contains KPI Cards, Assignment Table)
- `LeavePage` -> `LeaveDashboard` (contains KPI Cards, Leave Requests Table)
- `ActivityPage` -> `ActivityDashboard` (contains KPI Cards, Audit Trail Table)
- `EscalationPage` -> `EscalationDashboard` (contains KPI Cards, Escalation Logs Table with Resolution actions)

## 9. Service Flow
`Page Components` -> `Service Layer` (Handles filtering, statistics aggregations, KPI generation) -> `API Layer` (CRUD operations) -> `Mock Data Repository`

## 10. Implementation Summary
Phase 2 Internship Operations have been successfully integrated into the Pinesphere ERP system without modifying existing core modules. All architectural constraints were met by introducing standard Types, APIs, Services, and UI component structures. The registry (`feature-registry`, `mock-permissions`, `mock-roles`) was securely expanded to expose these modules. The application logic is fully decoupled from the UI, laying the groundwork for replacing mock data with a real backend integration in the future.
