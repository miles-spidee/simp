# Pinesphere ERP: Backend Integration & Architecture Guide

This document explains the core function of the Pinesphere ERP frontend architecture and provides a comprehensive blueprint for backend developers on how to design the Database (DB) and Middleware to seamlessly integrate with it.

---

## 1. Frontend Function & Architecture

The Pinesphere ERP frontend is built on a **Composable Modular Architecture**. The central philosophy is that **nothing is hardcoded**. 

### The Service Layer Pattern
The frontend separates UI components from data fetching logic.
1. **UI Components (`app/` & `components/`)**: Responsible only for rendering and local interaction state. They do not know where data comes from.
2. **Service Layer (`src/services/`)**: The bridge. Components call asynchronous methods here (e.g., `await moduleService.getModules()`). 
3. **Mock Data (`src/data/`)**: Currently, the service layer returns hardcoded JSON objects wrapped in `Promises` with simulated latency.

**To integrate the backend later**, the frontend developer will simply replace the `setTimeout` mock returns in the `src/services/` files with actual `fetch()` or `axios` API calls. **Zero changes will be required in the UI components.**

### Dynamic Routing & Navigation
- When a user logs in, the UI fetches their assigned **Role**.
- Based on the Role, the UI fetches assigned **Modules** and explicit **Permissions**.
- The Sidebar and Dashboards dynamically render *only* what the user has access to.

---

## 2. Database (DB) Schema Design Blueprint

To support the dynamic, composable nature of the frontend, the backend database (e.g., PostgreSQL, MySQL, or MongoDB) MUST be relational at its core.

### Core Identity Tables

#### 1. `Modules` Table
The central registry of every feature in the ERP.
- `id` (UUID / PK)
- `name` (String) - e.g., "Learning Management System"
- `code` (String) - e.g., "LMS" (Matches the frontend route `/admin/lms`)
- `description` (Text)
- `category` (String) - e.g., "Academic", "Operations"
- `status` (Boolean) - Active/Inactive

#### 2. `Roles` Table
Defines organizational titles.
- `id` (UUID / PK)
- `name` (String) - e.g., "Student", "Super Admin", "Mentor"
- `description` (Text)
- `status` (Boolean)

#### 3. `Role_Modules` (Join Table)
Maps which roles get access to which modules.
- `role_id` (FK)
- `module_id` (FK)

#### 4. `Users` Table
The identities of the people logging in.
- `id` (UUID / PK)
- `name` (String)
- `email` (String / Unique)
- `password_hash` (String)
- `role_id` (FK) - The user's primary role.
- `status` (Enum) - Active, Suspended, etc.

#### 5. `User_Module_Overrides` (Optional but Recommended)
If a specific user needs access to a module *outside* their standard Role.
- `user_id` (FK)
- `module_id` (FK)
- `type` (Enum) - 'GRANT' or 'DENY'

#### 6. `Permissions` Table
Granular actions (Create, Read, Update, Delete) mapped to Roles or Users.
- `id` (UUID)
- `action` (String) - e.g., `assessment:create`, `lms:view`
- `role_id` (FK)

---

## 3. Middleware Architecture

The middleware serves as the gatekeeper. It must enforce Authentication and Role-Based Access Control (RBAC).

### A. Authentication Middleware (e.g., JWT)
When a user logs in, generate a JSON Web Token (JWT).
**Payload should include:**
```json
{
  "userId": "uuid-123",
  "roleId": "uuid-456",
  "roleName": "Student"
}
```
**Function:** 
Verify the JWT signature on every protected API route. If missing or invalid, return `401 Unauthorized`.

### B. RBAC / Authorization Middleware
Because the frontend dynamically hides UI elements, the backend **must** double-check that the user actually has permission to execute an action.

**Flow:**
1. Request comes in to `POST /api/assessments`.
2. Auth Middleware decodes JWT -> `userId: 123, roleName: Student`.
3. RBAC Middleware checks the Database (or Redis cache): *Does the 'Student' role have the `assessment:create` permission?*
4. Result: `False`.
5. Middleware rejects request with `403 Forbidden`.

### C. Data Scoping Middleware (Multi-Tenant / Batch Scoping)
A Mentor should only see students in *their* assigned Batch.
**Function:**
- Middleware intercepts the request.
- Looks up `userId` -> finds assigned `batch_ids`.
- Injects `WHERE batch_id IN (...)` into the underlying database query.
- Returns only the scoped data to the frontend.

---

## 4. API Contract Examples

The backend must expose RESTful (or GraphQL) endpoints that map directly to the frontend's Service Layer.

### Module API
- `GET /api/modules` -> Returns array of all available modules.
- `GET /api/modules/user/:id` -> Returns array of modules specifically allowed for that user (merging Role modules + User overrides).

### Role API
- `GET /api/roles` -> Returns all roles.
- `POST /api/roles` -> Creates a new role, expecting `name` and an array of `moduleIds` in the request body.

### Execution APIs (Examples)
- `GET /api/tasks` -> Returns tasks scoped to the user.
- `POST /api/submissions` -> Accepts capstone/project links from students.

---

## 5. Next Steps for Integration

1. **Backend Dev:** Set up the database schema matching the structures found in `frontend/src/data/mock-*.ts`.
2. **Backend Dev:** Create the Auth and RBAC middlewares.
3. **Backend Dev:** Build the REST API endpoints.
4. **Frontend Dev:** Open `frontend/src/config/api.ts` (create this file) and define `API_BASE_URL`.
5. **Frontend Dev:** Go to `frontend/src/services/` and replace `setTimeout` logic with:
   ```typescript
   export const getModules = async () => {
     const response = await fetch(`${API_BASE_URL}/modules`, {
       headers: { Authorization: `Bearer ${token}` }
     });
     return response.json();
   }
   ```
6. **Frontend Dev:** Delete the `src/data/mock-*.ts` files entirely.
