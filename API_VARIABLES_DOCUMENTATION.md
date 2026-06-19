# Pinesphere ERP System - API & Variables Documentation

This document outlines all variables, functions, API requests (GET, POST, PUT, DELETE, PATCH), payload schemas, response structures, and state management destinations across all modules of the Pinesphere ERP application.

---

## Table of Contents
1. [Public / Guest Pages](#1-public--guest-pages)
   - [Landing Page (`/`)](#landing-page-)
   - [Internship Application Form (`/apply`)](#internship-application-form-apply)
   - [Application Success Page (`/success`)](#application-success-page-success)
2. [Authentication Pages](#2-authentication-pages)
   - [Sign In Page (`/login`)](#sign-in-page-login)
   - [Forgot Password Recovery (`/forgot-password`)](#forgot-password-recovery-forgot-password)
3. [Student Portal Dashboard (`/dashboard`)](#3-student-portal-dashboard-dashboard)
   - [General Context Data Sync](#general-context-data-sync)
   - [Attendance Tracker (`/dashboard/attendance`)](#attendance-tracker-dashboardattendance)
   - [Agenda Scheduler](#agenda-scheduler)
   - [LMS & Course Progress (`/dashboard/lms`)](#lms--course-progress-dashboardlms)
   - [Tasks & Deliverables (`/dashboard/tasks`)](#tasks--deliverables-dashboardtasks)
   - [Capstone Project Coordinator (`/dashboard/capstone`)](#capstone-project-coordinator-dashboardcapstone)
   - [Online Assessment Panel (`/dashboard/assessment`)](#online-assessment-panel-dashboardassessment)
   - [Financials & Online Payments (`/dashboard/financials`)](#financials--online-payments-dashboardfinancials)
   - [Documents Vault (`/dashboard/documents`)](#documents-vault-dashboarddocuments)
   - [Support & Mentor Chat (`/dashboard/chat`)](#support--mentor-chat-dashboardchat)
   - [Performance KPI Radar (`/dashboard/kpi`)](#performance-kpi-radar-dashboardkpi)
   - [Profile Details (`/dashboard/profile`)](#profile-details-dashboardprofile)
4. [HR Administration Dashboard (`/hr-dashboard`)](#4-hr-administration-dashboard-hr-dashboard)
   - [Initial Context Refresh](#initial-context-refresh)
   - [Students & Registration (`/hr-dashboard/students`)](#students--registration-hr-dashboardstudents)
   - [Programs Coordinator (`/hr-dashboard/programs`)](#programs-coordinator-hr-dashboardprograms)
   - [Colleges & Staging Audit (`/hr-dashboard/audit`)](#colleges--staging-audit-hr-dashboardaudit)
   - [Payments Ledger Management](#payments-ledger-management)
   - [Certifications Desk](#certifications-desk)
   - [Broadcast & Notifications Hub](#broadcast--notifications-hub)
   - [Escalations Manager](#escalations-manager)

---

## 1. Public / Guest Pages

### Landing Page (`/`)
Displays current internship listings and opportunities.

* **API Endpoints Call**:
  * **Endpoint**: `API_ENDPOINTS.OPPORTUNITIES` &rarr; `/api/opportunities`
  * **HTTP Method**: `GET`
  * **Parameters Sent**: None
* **Response Received**:
  * **Format**: `JSON` (Array of objects)
  * **Variables & Types**:
    ```typescript
    interface Opportunity {
      title: string;       // Name of internship role
      type: string;        // Payment category (e.g. Free, Paid, Stipend)
      value: string;       // Route parameter (e.g. free, research, stipend)
      description: string; // Long description of internship requirements
      duration: string;    // Duration in weeks/months
      mode: string;        // Mode (e.g. Remote, Hybrid, On-site)
      seats: string;       // Available intake seats
      eligibility: string; // Degree / graduation criteria
      startDate: string;   // Program kick-off date
      color: string;       // Badge border and color styling classes
    }
    ```
* **Frontend Storage State**:
  * Stored in component React state `opportunities` (`setOpportunities()`).
  * Triggers loading indicator state `loading` (`setLoading()`) boolean.

---

### Internship Application Form (`/apply`)
Multi-step onboarding form for candidates applying to various tracks.

* **API Endpoints Call**:
  * **Endpoint**: `API_ENDPOINTS.APPLY` &rarr; `/api/apply`
  * **HTTP Method**: `POST`
  * **Headers**: `Content-Type: application/json`
  * **Payload Data Format Sent**:
    ```json
    {
      "internshipType": "free" | "paid" | "stipend" | "industrial" | "corporate" | "research",
      "personalInformation": {
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "mobileNumber": "string",
        "dateOfBirth": "string (YYYY-MM-DD)",
        "gender": "string",
        "city": "string",
        "state": "string"
      },
      "academicInformation": {
        "collegeName": "string",
        "department": "string",
        "degree": "string",
        "currentYear": "string",
        "cgpaPercentage": "string",
        "graduationYear": "string"
      },
      "professionalInformation": {
        "skills": "string",
        "githubUrl": "string",
        "linkedinUrl": "string",
        "portfolioUrl": "string",
        "projectExperience": "string"
      },
      "internshipSpecificData": {
        "feeAcceptance": "boolean",
        "paymentMode": "string",
        "transactionId": "string",
        "paymentScreenshot": {
          "name": "string",
          "size": "number",
          "type": "string",
          "base64": "string"
        } | null,
        "relevantExperience": "string",
        "preferredTechStack": "string",
        "relevantTechnicalExperience": "string",
        "researchAreaOfInterest": "string",
        "researchInterestStatement": "string",
        "publicationsAvailable": "Yes" | "No",
        "publicationLinks": "string"
      },
      "documents": {
        "resume": {
          "name": "string",
          "size": "number",
          "type": "string",
          "base64": "string"
        } | null
      },
      "motivation": {
        "whyInternship": "string"
      }
    }
    ```
* **Response Received**: HTTP `200 OK` or `201 Created` status check.
* **Frontend Actions / Storage**:
  * Toggles loader state `isSubmitting` to `false`.
  * Deletes localStorage draft object: key `pinesphere_internship_draft_${internshipType}`.
  * Navigates routing path to `/success?type=${internshipType}`.
* **Local Drafting Offline Cache**:
  * While user types, component state `formState` is written to `localStorage` under: `pinesphere_internship_draft_${internshipType}`.

---

### Application Success Page (`/success`)
Confirmation page rendering success summary telemetry.

* **API Endpoints Call**:
  * **Endpoint**: `API_ENDPOINTS.SUCCESS_DATA` &rarr; `/api/success?type=${type}`
  * **HTTP Method**: `GET`
  * **Query Parameters**: `type` (taken from search query param string, e.g., `free`, `login`, `paid`)
* **Response Received**:
  * HTTP Status check (`ok`).
* **Frontend Storage State**:
  * Toggles state `toastConfig` (`show: boolean`, `title: string`, `message: string`, `type: 'success' | 'warning' | 'error' | 'info'`) to show telemetry synchronization statuses.

---

## 2. Authentication Pages

### Sign In Page (`/login`)
User authentication utilizing local cache parameters.

* **API Endpoints Call**:
  * **Endpoint**: `API_ENDPOINTS.LOGIN` &rarr; `/api/auth/login`
  * **HTTP Method**: `POST`
  * **Payload Data Format Sent**:
    ```json
    {
      "username": "string (trimmed)",
      "password": "string"
    }
    ```
* **Response Received**: HTTP `200 OK` authentication success check.
* **Frontend Storage State**:
  * Sets user details globally: `localStorage.setItem('pinesphere_username', username.trim())`.
  * Triggers state `toastConfig` to render welcome message alerts.
  * Router transitions dashboard to `/dashboard` after a `800ms` window.

---

### Forgot Password Recovery (`/forgot-password`)
Recovery wizard separated into verification stages.

#### A. Step 1: Send Username (Request OTP Code)
* **Endpoint**: `API_ENDPOINTS.FORGOT_PASSWORD_REQUEST` &rarr; `/api/auth/forgot-password/request`
* **HTTP Method**: `POST`
* **Payload**: `{ "username": "string" }`
* **Frontend State**: Transitions wizard step state `step` to `'ENTER_OTP'`, resets verification countdown state `timerCount` to `120` seconds.

#### B. Step 2: Verification (Verify OTP Code)
* **Endpoint**: `API_ENDPOINTS.FORGOT_PASSWORD_VERIFY` &rarr; `/api/auth/forgot-password/verify`
* **HTTP Method**: `POST`
* **Payload**: `{ "username": "string", "otp": "string (6-digit numeric)" }`
* **Frontend State**: Transitions wizard step state `step` to `'RESET_PASSWORD'`.

#### C. Step 3: Submission (Update/Reset Password)
* **Endpoint**: `API_ENDPOINTS.FORGOT_PASSWORD_RESET` &rarr; `/api/auth/forgot-password/reset`
* **HTTP Method**: `POST`
* **Payload**: `{ "username": "string", "otp": "string", "newPassword": "string" }`
* **Frontend State**: Toggles flow state `step` to `'SUCCESS'`, displays completion animation, and initiates router redirection back to `/login` after `2.5 seconds`.

---

## 3. Student Portal Dashboard (`/dashboard`)
All child views located inside `/dashboard` use variables retrieved and updated by `DashboardContext.tsx` via the custom React hook `useDashboard()`.

### General Context Data Sync
Initiated on page mount (`useEffect`) to load initial datasets.

* **API Endpoints Call**:
  * **Endpoint**: `API_ENDPOINTS.DASHBOARD_DATA` &rarr; `/api/dashboard`
  * **HTTP Method**: `GET`
* **Response Received**:
  ```json
  {
    "agenda": [
      { "id": 1, "task": "string", "time": "string", "completed": false }
    ],
    "courses": [
      {
        "id": "string",
        "title": "string",
        "category": "string",
        "progress": 75,
        "image": "string (image asset path)",
        "lectures": [
          { "title": "string", "duration": "string", "completed": true, "videoUrl": "string", "notes": "string" }
        ]
      }
    ],
    "assignments": [
      {
        "id": "string",
        "title": "string",
        "category": "string",
        "assignedBy": "string",
        "dueDate": "string",
        "isOverdue": false,
        "status": "pending" | "review" | "completed",
        "code": "string (code template snippet)",
        "isLocked": false
      }
    ],
    "capstoneStatus": "Not Submitted" | "Under Review" | "Approved",
    "capstoneSubtasks": [
      { "id": 1, "phase": 1, "task": "string", "completed": false }
    ],
    "announcements": [
      { "date": "string (YYYY-MM-DD)", "title": "string", "content": "string" }
    ]
  }
  ```
* **Frontend Storage State**: Maps JSON outputs to:
  * `agenda` (`setAgenda()`)
  * `courses` (`setCourses()`)
  * `assignments` (`setAssignments()`)
  * `capstoneStatus` (`setCapstoneStatus()`)
  * `capstoneSubtasks` (`setCapstoneSubtasks()`)
  * `announcements` (`setAnnouncements()`)
  * Sets overall workspace loading variable `isDashboardLoading` to `false`.

---

### Attendance Tracker (`/dashboard/attendance`)
Manages clock-in status, duration, and tracking history lists.

* **GET Check Attendance Status**:
  * **Endpoint**: `API_ENDPOINTS.ATTENDANCE` &rarr; `/api/attendance`
  * **HTTP Method**: `GET`
  * **Response Format**:
    ```json
    {
      "isCheckedIn": "boolean",
      "clockInTime": "string | null",
      "attendanceLogs": [
        { "date": "string", "clockIn": "string", "clockOut": "string", "duration": "string", "status": "Present" | "Checked In" | "Absent" }
      ]
    }
    ```
  * **Frontend State**: Sets `isCheckedIn`, `clockInTime`, and `attendanceLogs` context states. Falls back to offline values stored in `localStorage` under `pinesphere_isCheckedIn`, `pinesphere_clockInTime`, and `pinesphere_attendanceLogs`.
* **POST Clock In/Out Trigger**:
  * **Endpoint**: `API_ENDPOINTS.ATTENDANCE` &rarr; `/api/attendance`
  * **HTTP Method**: `POST`
  * **Payload Data Format Sent**:
    ```json
    {
      "isCheckedIn": "boolean",
      "clockInTime": "string | null",
      "logs": [ ... ] // Full updated logs array
    }
    ```
  * **Frontend State Action**: Performs optimistic updates immediately in local states, writes values locally using keys `pinesphere_isCheckedIn`, `pinesphere_clockInTime`, `pinesphere_attendanceLogs`, and fires the POST request to synchronize status.

---

### Agenda Scheduler
Interactive task agenda check toggles.

* **API Endpoints Call**:
  * **Endpoint**: `${API_ENDPOINTS.AGENDA}/${id}` &rarr; `/api/agenda/${id}`
  * **HTTP Method**: `PATCH`
  * **Payload**: `{ "completed": "boolean" }`
* **Response**: HTTP OK.
* **Frontend State Action**: Modifies the matching element in context array state `agenda`. Triggers `showToastNotification()` indicator.

---

### LMS & Course Progress (`/dashboard/lms`)
Marks lecture tracks completed and monitors course progress.

* **API Endpoints Call**:
  * **Endpoint**: `${API_ENDPOINTS.COURSES}/${courseId}/lecture/${lectureIndex}` &rarr; `/api/courses/${courseId}/lecture/${lectureIndex}`
  * **HTTP Method**: `POST`
  * **Payload Data Format Sent**:
    ```json
    {
      "completed": "boolean",
      "progress": "number (0 - 100)"
    }
    ```
* **Response**: HTTP OK status.
* **Frontend State Action**: Updates individual lecture attributes inside the `courses` state object array. If progress is 100%, triggers completed pathway alerts allowing cert access in Documents.

---

### Tasks & Deliverables (`/dashboard/tasks`)
Submit documents/files for review evaluations.

* **GET Check Latest Tasks Dynamic Load**:
  * **Endpoint**: `API_ENDPOINTS.TASKS` &rarr; `/api/tasks`
  * **HTTP Method**: `GET`
  * **Response**: `{ "assignments": [...] }` (maps array to `assignments` state)
* **POST Upload Deliverable Zip/Pdf**:
  * **Endpoint**: `${API_ENDPOINTS.ASSIGNMENTS}/${asgId}/submit` &rarr; `/api/assignments/${asgId}/submit`
  * **HTTP Method**: `POST`
  * **Payload**: `{ "file": "string (filename)" }`
  * **Frontend State Action**: Flags target task status to `'review'` inside `assignments` array state. Removes item from active uploads state (`setActiveUploadAssignmentId(null)`).

---

### Capstone Project Coordinator (`/dashboard/capstone`)
Repository registration and preview deployment checkers.

* **API Endpoints Call**:
  * **Endpoint**: `API_ENDPOINTS.CAPSTONE` &rarr; `/api/capstone`
  * **HTTP Method**: `PUT`
  * **Payload**:
    ```json
    {
      "repoLink": "string (e.g. github.com/...)",
      "liveLink": "string (deployment preview)",
      "status": "Under Review"
    }
    ```
* **Response**: HTTP OK.
* **Frontend State Action**: Saves strings in `capstoneRepoLink`, `capstoneLiveLink` states. Sets context `capstoneStatus` state to `'Under Review'`.

---

### Online Assessment Panel (`/dashboard/assessment`)
Integrates diagnostic exams, camera/mic pre-checks, and proctoring locks.

* **GET Exams History & Mock Configurations**:
  * **Endpoint**: `API_ENDPOINTS.ASSESSMENT` &rarr; `/api/assessment`
  * **HTTP Method**: `GET`
  * **Response Format**:
    ```json
    {
      "pastExamResults": [
        { "id": "string", "title": "string", "date": "string", "score": number, "status": "Passed" | "Failed" }
      ],
      "mockExamQuestions": [
        { "id": number, "question": "string", "options": ["string"], "correctAnswer": "string" }
      ]
    }
    ```
  * **Frontend State**: Binds parameters to context variables `pastExamResults` and `mockExamQuestions`. (Falls back to local key `pinesphere_past_exam_results` if offline).
* **POST Log Exam Submission Result**:
  * **Endpoint**: `API_ENDPOINTS.ASSESSMENT` &rarr; `/api/assessment`
  * **HTTP Method**: `POST`
  * **Payload Data Format Sent**:
    ```json
    {
      "score": number,
      "answers": {
        "0": "string (Answer Chosen)",
        "1": "string (Answer Chosen)"
      },
      "result": {
        "id": "string (generated ex-timestamp)",
        "title": "string (React Architecture Prep)",
        "date": "string (current localized date)",
        "score": number,
        "status": "Passed" | "Failed"
      }
    }
    ```
  * **Frontend State Action**: Prepends the result to `pastExamResults` array, writes to `localStorage` under `pinesphere_past_exam_results`, and launches Exam HUD overlays.

---

### Financials & Online Payments (`/dashboard/financials`)
Monitors outstanding balances and executes payments via credit card or UPI pay flows.

* **GET Fetch Balance Details & Receipts**:
  * **Endpoint**: `API_ENDPOINTS.FINANCIALS` &rarr; `/api/financials`
  * **HTTP Method**: `GET`
  * **Response Format**:
    ```json
    {
      "fees": { "total": number, "paid": number, "balance": number },
      "paymentHistory": [
        { "id": "string", "date": "string", "amount": number, "method": "string", "status": "Cleared" }
      ]
    }
    ```
  * **Frontend State**: Sets context states `fees` and `paymentHistory`. (Falls back to local keys `pinesphere_fees` and `pinesphere_payment_history`).
* **POST Log Clearance Ledger**:
  * **Endpoint**: `API_ENDPOINTS.FINANCIALS` &rarr; `/api/financials`
  * **HTTP Method**: `POST`
  * **Payload Data Format Sent**:
    ```json
    {
      "id": "string (generated invoice ID)",
      "date": "string (YYYY-MM-DD)",
      "amount": number,
      "method": "Credit Card" | "UPI Pay",
      "status": "Cleared"
    }
    ```
  * **Response**: HTTP OK confirmation.
  * **Frontend State Action**: Updates `fees` total values (paid increments, balance decrements). Adds row to `paymentHistory` state list, writes to `localStorage` using keys `pinesphere_fees` and `pinesphere_payment_history`, closes active payment processing scanner timers and modals.

---

### Documents Vault (`/dashboard/documents`)
Access certificates and upload proof archives.

* **GET Check Safe Vault Files**:
  * **Endpoint**: `API_ENDPOINTS.DOCUMENTS` &rarr; `/api/documents`
  * **HTTP Method**: `GET`
  * **Response Format**:
    ```json
    {
      "vaultFiles": [
        { "id": "string", "name": "string", "size": "string", "category": "string", "date": "string", "verified": boolean, "downloadable": boolean }
      ]
    }
    ```
  * **Frontend State**: Maps arrays to context state `vaultFiles`. (Falls back to local key `pinesphere_vault_files`).
* **POST Upload Document**:
  * **Endpoint**: `API_ENDPOINTS.DOCUMENTS` &rarr; `/api/documents`
  * **HTTP Method**: `POST`
  * **Payload Data Format Sent**:
    ```json
    {
      "id": "string (generated doc-timestamp)",
      "name": "string (filename.pdf)",
      "size": "string (e.g. '1.5 MB')",
      "category": "string (e.g. 'Academics')",
      "date": "string (YYYY-MM-DD)",
      "verified": false,
      "downloadable": false
    }
    ```
  * **Frontend State Action**: Prepends the item to the `vaultFiles` state array. Saves the updated array to `localStorage` key `pinesphere_vault_files`.

---

### Support & Mentor Chat (`/dashboard/chat`)
Sends instant messages and handles AI responses.

* **API Endpoints Call**:
  * **Endpoint**: `API_ENDPOINTS.CHAT` &rarr; `/api/chat`
  * **HTTP Method**: `POST`
  * **Payload**:
    ```json
    {
      "thread": "mentor" | "support",
      "message": "string"
    }
    ```
* **Response Received**:
  ```json
  {
    "reply": "string (chat reply message)"
  }
  ```
* **Frontend Storage State**: Appends user message object and the response reply object in React context states:
  * Thread `'mentor'` &rarr; `mentorMessages` (`setMentorMessages()`)
  * Thread `'support'` &rarr; `supportMessages` (`setSupportMessages()`)

---

### Performance KPI Radar (`/dashboard/kpi`)
Retransfers KPI grade points.

* **API Endpoints Call**:
  * **Endpoint**: `API_ENDPOINTS.KPI` &rarr; `/api/kpi`
  * **HTTP Method**: `GET`
* **Response Received**:
  ```json
  {
    "kpiStats": {
      "technical": 90,
      "delivery": 85,
      "communication": 95,
      "attendance": 100,
      "collaboration": 88
    }
  }
  ```
* **Frontend Storage State**: Triggers context state `kpiStats` (`setKpiStats()`) which feeds directly into the dashboard radar visualization chart.

---

### Profile Details (`/dashboard/profile`)
Monitors and updates user profile configurations.

* **GET Check Full Settings Profile Details**:
  * **Endpoint**: `API_ENDPOINTS.PROFILE` &rarr; `/api/profile`
  * **HTTP Method**: `GET`
  * **Response Format**:
    ```json
    {
      "profile": {
        "personalInformation": { "firstName": "string", "lastName": "string", "email": "string", "mobileNumber": "string", "dateOfBirth": "string", "gender": "string", "city": "string", "state": "string" },
        "academicInformation": { "collegeName": "string", "department": "string", "degree": "string", "currentYear": "string", "cgpaPercentage": "string", "graduationYear": "string" },
        "professionalInformation": { "skills": "string", "githubUrl": "string", "linkedinUrl": "string", "portfolioUrl": "string", "projectExperience": "string" },
        "internshipSpecificData": { "internshipType": "string", "preferredTechStack": "string", "relevantExperience": "string" },
        "documents": { "resumeName": "string", "resumeBase64": "string" }
      }
    }
    ```
  * **Frontend State**: Binds parameters to state `profile`. (Falls back to local key `pinesphere_user_profile` if error occurs).
* **PUT Save New Profile Changes**:
  * **Endpoint**: `API_ENDPOINTS.PROFILE` &rarr; `/api/profile`
  * **HTTP Method**: `PUT`
  * **Payload Data Format Sent**: Full `profile` object (matches structure above).
  * **Response**: HTTP OK.
  * **Frontend State Action**: Updates `profile` state array, saves string to `localStorage` key `pinesphere_user_profile`, updates `username` state to display full name, and displays synchronization toast.

---

## 4. HR Administration Dashboard (`/hr-dashboard`)
Governance parameters inside the `/hr-dashboard` directory use states governed by `HRDashboardContext.tsx` via the custom React hook `useHRDashboard()`.

### Initial Context Refresh
Triggered on Mount. Loads all HR datasets in parallel via `Promise.all`.

1. **`API_ENDPOINTS.HR_METRICS` &rarr; `/api/hr/metrics` (GET)**:
   * Gets stats counts: active interns, registrations, completion rate, hiring rate, total revenue, certificates issued.
   * Stores in context `metrics` state & `localStorage` key `pinesphere_hr_metrics`.
2. **`API_ENDPOINTS.HR_STUDENTS` &rarr; `/api/hr/students` (GET)**:
   * Gets directory listing.
   * Stores in context `students` state & `localStorage` key `pinesphere_hr_students`.
3. **`API_ENDPOINTS.HR_PROGRAMS` &rarr; `/api/hr/programs` (GET)**:
   * Gets curriculum configurations.
   * Stores in context `programs` state & `localStorage` key `pinesphere_hr_programs`.
4. **`API_ENDPOINTS.HR_COLLEGES` &rarr; `/api/hr/colleges` (GET)**:
   * Gets partner institutions.
   * Stores in context `colleges` state & `localStorage` key `pinesphere_hr_colleges`.
5. **`API_ENDPOINTS.HR_ESCALATIONS` &rarr; `/api/hr/escalations` (GET)**:
   * Gets critical alerts.
   * Stores in context `escalations` state & `localStorage` key `pinesphere_hr_escalations`.
6. **`API_ENDPOINTS.HR_NOTIFICATIONS` &rarr; `/api/hr/notifications` (GET)**:
   * Gets `{ stats: [...], log: [...] }`.
   * Stores in context `notificationStats` and `notificationsLog` states & `localStorage` key `pinesphere_hr_notifications`.
7. **`API_ENDPOINTS.HR_ATTENDANCE` &rarr; `/api/hr/attendance` (GET)**:
   * Gets `{ stats: [...], alert: {...} }`.
   * Stores in context `attendanceStats` and `attendanceAlert` states & `localStorage` key `pinesphere_hr_attendance`.
8. **`API_ENDPOINTS.HR_PAYMENTS` &rarr; `/api/hr/payments` (GET)**:
   * Gets `{ stats: [...], list: [...] }`.
   * Stores in context `paymentsStats` and `payments` states & `localStorage` key `pinesphere_hr_payments`.
9. **`API_ENDPOINTS.HR_CERTIFICATES` &rarr; `/api/hr/certificates` (GET)**:
   * Gets `{ stats: [...], list: [...] }`.
   * Stores in context `certificatesStats` and `certificates` states & `localStorage` key `pinesphere_hr_certificates`.
10. **`API_ENDPOINTS.HR_PLACEMENTS` &rarr; `/api/hr/placements` (GET)**:
    * Gets `{ stats: [...], list: [...] }`.
    * Stores in context `placementsStats` and `placements` states & `localStorage` key `pinesphere_hr_placements`.
11. **`API_ENDPOINTS.HR_ASSESSMENTS` &rarr; `/api/hr/assessments` (GET)**:
    * Gets `{ stats: [...], list: [...] }`.
    * Stores in context `assessmentsStats` and `assessments` states & `localStorage` key `pinesphere_hr_assessments`.

---

### Students & Registration (`/hr-dashboard/students`)
Registers candidates and adds profile logs.

* **API Endpoints Call**:
  * **Endpoint**: `API_ENDPOINTS.HR_STUDENTS` &rarr; `/api/hr/students`
  * **HTTP Method**: `POST`
  * **Payload Data Format Sent**:
    ```json
    {
      "id": "string (STU-2024-XXXX)",
      "name": "string",
      "college": "string",
      "email": "string",
      "createdDate": "string (MMM DD, YYYY)",
      "performance": "number",
      "status": "Active" | "Hired" | "Screening" | "Completed",
      "department": "string",
      "dept": "string",
      "prog": "string",
      "batch": "string",
      "manager": "string",
      "initials": "string"
    }
    ```
* **Response**: HTTP OK status.
* **Frontend State Action**: Prepends the student object to the `students` list, increments registration metric counts, adjusts enrollment numbers, and writes the update to `localStorage`.

---

### Programs Coordinator (`/hr-dashboard/programs`)
Establishes new program terms and lists student rosters.

* **CREATE Program API**:
  * **Endpoint**: `API_ENDPOINTS.HR_PROGRAMS` &rarr; `/api/hr/programs`
  * **HTTP Method**: `POST`
  * **Payload Data Format Sent**:
    ```json
    {
      "id": "string (PRG-X)",
      "name": "string",
      "department": "string",
      "dept": "string",
      "type": "string",
      "duration": "string",
      "manager": "string",
      "filled": 0,
      "capacity": 100,
      "total": 100,
      "status": "Active",
      "mentors": "string"
    }
    ```
  * **Response**: HTTP OK.
  * **Frontend State Action**: Optimistically appends the program object to the `programs` array, writes to `localStorage` key `pinesphere_hr_programs`, and inserts the item in the Activity Log history list.
* **LIST Enrolled Students in Modal**:
  * **Endpoint**: `API_ENDPOINTS.APPLY` &rarr; `/api/apply`
  * **HTTP Method**: `GET`
  * **Response**: Array of candidate application objects.
  * **Frontend State Action**: Component details panel `ProgramDetailsModal` filters all applications matching this program category, writing the filtered list to component state `enrolledStudents`.

---

### Colleges & Staging Audit (`/hr-dashboard/audit`)
Reviews partner metrics. Evaluates completion/placement ratios.

* Data is handled during the initial mount sync ([Initial Context Refresh](#initial-context-refresh)) under key `pinesphere_hr_colleges`. No auxiliary post queries are bound inside `/audit`.

---

### Payments Ledger Management
Adds transaction logs manually to clear student pending dues.

* **API Endpoints Call**:
  * **Endpoint**: `API_ENDPOINTS.HR_PAYMENTS` &rarr; `/api/hr/payments`
  * **HTTP Method**: `POST`
  * **Payload Data Format Sent**:
    ```json
    {
      "name": "string (student name)",
      "prog": "string (program tracking name)",
      "fee": number,
      "paid": number,
      "pending": number,
      "date": "string (Paid or due date)",
      "status": "Cleared" | "Partially Paid" | "Overdue"
    }
    ```
* **Response**: HTTP OK.
* **Frontend State Action**: Inserts item inside context `payments` state array, increases metric `totalRevenue` by the paid amount, updates status stats in `paymentsStats`, writes to `localStorage`, and logs activity metrics.

---

### Certifications Desk
Generates completions and credentials.

* **API Endpoints Call**:
  * **Endpoint**: `API_ENDPOINTS.HR_CERTIFICATES` &rarr; `/api/hr/certificates`
  * **HTTP Method**: `POST`
  * **Payload Data Format Sent**:
    ```json
    {
      "code": "string (generated CERT-2026-XXXX)",
      "name": "string (student)",
      "type": "string (e.g. AI Internship)",
      "date": "string (Issue date)",
      "status": "Issued"
    }
    ```
* **Response**: HTTP OK.
* **Frontend State Action**: Appends cert to `certificates` list, increments certificates metric counts, updates parameters inside `certificatesStats`, writes to `localStorage`, and records activity logs.

---

### Broadcast & Notifications Hub
Dispatches broadcast alerts.

* **API Endpoints Call**:
  * **Endpoint**: `API_ENDPOINTS.HR_NOTIFICATIONS` &rarr; `/api/hr/notifications`
  * **HTTP Method**: `POST`
  * **Payload Data Format Sent**:
    ```json
    {
      "title": "string (headline description)",
      "target": "string (target recipients, e.g. CS students)",
      "channels": ["Email", "Portal", "SMS"]
    }
    ```
* **Response**: HTTP OK.
* **Frontend State Action**: Logs details inside `notificationsLog` array state. Increments channel delivery counters in state `notificationStats`. Saves parameters to `localStorage` and logs dispatcher activities.

---

### Escalations Manager
Resolves critical flags manually.

* **API Endpoints Call**:
  * **Endpoint**: `${API_ENDPOINTS.HR_ESCALATIONS}/${encodeURIComponent(studentName)}` &rarr; `/api/hr/escalations/${studentName}`
  * **HTTP Method**: `DELETE`
* **Response**: HTTP OK.
* **Frontend State Action**: Filters the student from context array state `escalations`. Toggles localStorage updates, and logs supervisor action updates in the activity feed.
