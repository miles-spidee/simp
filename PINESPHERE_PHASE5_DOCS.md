# Pinesphere ERP - Phase 5: Certification & Placement Management

## Overview
Phase 5 completes the internship lifecycle within the Pinesphere ERP by implementing the **Certification & Placement Management System**. It brings 5 major modules into the platform: Certificate Management, Document Generation, Public Certificate Verification, Placement & Hiring, and Alumni Management. 

The implementation adheres to the existing architecture: `Registry -> Page -> Component -> Service -> API -> Mock Repository`.

---

## Architecture & Workflows

### 1. Certificate Management & Verification
**Workflow**: 
- HR selects students who have completed the internship and triggers a `Generate Certificate` action.
- The `CertificateService` assigns a unique `certificateNumber` and signs it with a `digitalSignatureId`.
- The certificate is moved to `Pending Approval`. Once approved, it is `Issued`.
- The `verify` route (`/verify`) operates outside the AuthContext, providing unauthenticated public access.
- Any external user (e.g. background verification agencies) can enter the `certificateNumber` to instantly view the VerificationResult payload.

### 2. Document Generation
**Workflow**:
- The `DocumentService` maintains a library of dynamic `DocumentTemplate` objects.
- Variables like `{{studentName}}`, `{{program}}`, and `{{stipend}}` are mapped during generation.
- Supports generating Offer Letters, Joining Letters, Internship Letters, etc.

### 3. Placement & Hiring Pipeline
**Workflow**:
- The `PlacementService` tracks a student's journey across companies.
- Stages move linearly: `Eligible -> Applied -> Shortlisted -> Technical Round -> HR Round -> Selected -> Offer Released -> Joined`.
- The service automatically calculates analytics like `students_hired` and `top_hiring_companies` for the dashboard.

### 4. Alumni Management
**Workflow**:
- Once a student graduates, their profile moves to the `AlumniService`.
- It tracks `CareerProgress` objects, establishing a timeline of their subsequent jobs and designations.
- Facilitates networking and mentorship mapping (`isMentoring: true`).

---

## Implementation Details

### Core Modifications
- **Feature Registry**: 4 new modules (`certificate`, `document`, `placement`, `alumni`) were appended to `FEATURE_REGISTRY` in `src/core/features/feature-registry.ts`.
- **Role & Permission Engine**: 25+ new granular permissions were injected into `MOCK_PERMISSIONS`. `MOCK_ROLES` mapping was expanded so Super Admins & HR have full CRUD, while lower-tier roles (Students, Mentors) only have `.view` bounds.
- **Widget Registry**: 9 new analytics widgets were mapped into the global `WIDGET_REGISTRY`.

### Data Layer
- **Mock Repositories**: 
  - `mock-certificates.ts`: 1000+ certificates
  - `mock-documents.ts`: 500+ generated documents
  - `mock-verifications.ts`: 500+ verification queries
  - `mock-placement.ts`: 200+ placement records across 100 mock companies
  - `mock-alumni.ts`: 500+ global alumni records with extensive career timelines

### Service Layer & APIs
- **Simulated Delays**: All `.api.ts` files utilize `setTimeout` to emulate network latency.
- **Business Logic Isolation**: React components never call the API directly. They strictly interface with the `.service.ts` files, enforcing a clean separation of concerns.

### Component Design
- Highly reusable UI modules residing in `src/components/admin/*` and `src/components/public/*`.
- Built on Tailwind CSS, employing responsive glassmorphic cards, intricate tables with action menus, Lucide icons, and grid-based metric dashboards.

---

## Future Backend Compatibility
The frontend services are built with dependency injection concepts in mind. When transitioning to a real backend, only the `.api.ts` files need to be modified (swapping Mock JSON with `fetch`/`axios`). The `.service.ts` logic and `.tsx` React layers will remain completely untouched.

**Future External Hooks**:
- **PDF Generation**: Ready to plug into Puppeteer/PDFKit via the Document service.
- **Digital Signatures**: Payload ready for integration with DocuSign/AdobeSign APIs.
- **QR Generation**: Supports replacing mock QR images with live QR generation microservices.
- **Job Portals**: Placement models can seamlessly sync with LinkedIn APIs.
