# AGENTS.md

# ERP Database Team - AI Agent Operating Manual

> **Project:** Internship ERP
>
> **Team:** Database Team
>
> **Status:** Living Documentation
>
> This document is the primary operating guide for AI agents working on the ERP Backend Database. It should evolve as the repository evolves.

---

# Primary Objective

The Database Team is responsible for:

- Database Architecture
- Database Migration
- Database Initialization
- Database Seeding
- Database Maintenance
- Database Validation
- Mock Data Generation
- Database Reset Utilities

The goal is to maintain a production-quality PostgreSQL database suitable for development, testing, and demonstration.

---

# Tech Stack

Backend
- FastAPI

ORM
- SQLAlchemy

Database
- PostgreSQL

Hosting
- AWS PostgreSQL

Frontend
- Next.js

---

# Repository Structure

The repository contains two major directories.

```
erp-project/

├── erp-frontend/
│   └── Next.js

└── erp-backend/
    └── app/
        ├── models/
        │   ├── **/
        │   └── *.py
        │
        ├── modules/
        │   ├── **/
        │   └── *.py
        │
        └── ...
```

---

# Golden Rule

## NEVER GUESS.

If the repository contains the answer,
inspect the repository.

If the answer cannot be determined from the repository,

report the uncertainty.

Do NOT invent

- table names
- relationships
- permissions
- constraints
- APIs
- schemas

Always inspect first.

---

# Repository Exploration (Mandatory)

Before performing ANY database operation the AI Agent MUST explore the repository.

Checklist

- [ ] Explore entire backend
- [ ] Explore app/models recursively
- [ ] Explore app/modules recursively
- [ ] Identify every SQLAlchemy Model
- [ ] Identify every Enum
- [ ] Identify every Foreign Key
- [ ] Identify Constraints
- [ ] Identify Relationships
- [ ] Identify Association Tables
- [ ] Identify Configuration Tables
- [ ] Identify Seed Requirements
- [ ] Identify Migration Strategy
- [ ] Document discoveries in AGENTS.md

The agent should continuously improve this document whenever new knowledge is discovered.

Verified discoveries

- `app/models/` contains the ORM layer used for schema generation.
- `app/modules/` contains application services, routers, and schemas, but no SQLAlchemy ORM models were discovered there.
- 101 SQLAlchemy models are mapped in `app/models/`.
- 252 modules under `app.models` and `app.modules` were imported during discovery.
- The live AWS PostgreSQL database was verified with a successful `SELECT 1` connection test.
- Aadhaar verification metadata should be stored on `sys_verification_records` via `VerificationRecord`.
- Seeding completed successfully and a live count check confirmed 0 empty tables.
- `app/scripts/seed.py` is the current full-table mock-data seeder for the live AWS database.
- `fin_payment_transactions` is the existing payment record table and now carries Razorpay payment metadata.
- `order_id` in `fin_payment_transactions` is anchored to `intern_applications.id` because the repository does not define a separate order table.

---

# Database Connection

Task

Connect backend to AWS PostgreSQL.

Checklist

- [x] Read .env
- [x] Validate credentials
- [x] Connect to AWS PostgreSQL
- [x] Verify SQLAlchemy Connection
- [x] Verify Migration Connection

Notes

- The repository-local `.venv` was used for live database checks.
- The async SQLAlchemy connection succeeded once the local environment was used.

---

# Database Reset

The database should be completely rebuilt.

Workflow

- Drop every table
- Remove every constraint
- Remove every index if required
- Remove every sequence if required

After completion

AWS PostgreSQL should contain

ZERO TABLES

---

Checklist

- [x] Drop all tables
- [x] Verify empty database

Verified cleanup result

- The `public` schema was dropped and recreated.
- The database was confirmed empty after cleanup: 0 application tables, 0 views, 0 materialized views, 0 sequences.

---

# Database Initialization

After the database becomes empty

The agent should

- discover all models
- import all models
- execute migrations
- initialize tables

The agent MUST verify

every discovered model
has a corresponding table.

Checklist

- [x] Discover Models
- [x] Run Migration
- [x] Create Tables
- [x] Validate Tables
- [x] Validate Foreign Keys

Verified initialization result

- 101 SQLAlchemy tables were created from discovered ORM metadata.
- `alembic_version` is stamped to `b85d1d564f15`.
- Final live database counts: 102 tables total in `public` including `alembic_version`, 582 indexes, 0 sequences.
- Every discovered model has a corresponding table.

Migration notes

- `alembic upgrade head` via the async path stalled in a long transaction in this environment.
- The schema was successfully initialized by generating the Alembic SQL offline, then creating the ORM tables directly and stamping Alembic head.

---

# Model Discovery Rules

Primary location

```
erp-backend/app/models/
```

Explore recursively.

Every subfolder.

Every Python file.

Secondary location

```
erp-backend/app/modules/
```

Explore recursively.

Some SQLAlchemy Models may exist here.

Never assume only one models.py exists.

---

# Seeding

Create

```
seed.py
```

Purpose

Populate every business table with realistic ERP data.

No business table should remain empty.

Seeding should be idempotent.

Configuration data should never duplicate.

---

# Mock Data Requirements

Minimum Dataset

## Users

- 1 Super Admin
- 5 Mentors
- 30 Students

---

Attendance

Generate

1 Month

Daily attendance

---

Tasks

Generate

- Pending
- In Progress
- Completed
- Overdue

---

Assessments

Generate realistic assessments.

---

Submissions

Generate submissions linked correctly.

---

Learning

Generate

- Courses
- Progress
- Learning Documents

---

Communication

Generate

- Messages
- Emails
- Notifications

---

Calendar

Generate

- Events
- Meetings
- Deadlines

---

Help Desk

Generate

- Tickets
- Open
- Closed
- In Progress

---

Performance

Generate

- KPIs
- Reports
- Performance Metrics

---

Documents

Generate

- Certificates
- Learning Documents
- Reports
- Exports

---

Dashboards

Generate dashboard statistics.

---

Every Foreign Key

MUST

reference valid data.

---

# Roles

## Super Admin

Modules

- Users
- Roles
- Module Registry
- Security Center
- Productivity
- Self Service
- Super Admin
- Digital ID
- Announcement
- Notification

---

## Student

Modules

- My Learning
- My Task
- My Attendance
- My Assessment
- Submission
- Message
- Calendar
- Email
- Document
- Report
- Export Center
- Help Desk
- Digital ID
- Self Service
- Productivity

---

## Mentor

Modules

- LMS Dashboard
- LMS Management
- Attendance Dashboard
- Attendance Management
- Assessment Dashboard
- Assessment Management
- Task Dashboard
- Task Management
- Performance
- Submission
- Leave Management
- Message
- Calendar
- Email
- Certificate
- Reports
- KPIs
- Help Desk
- Digital ID
- Self Service
- Productivity

---

# Permission Discovery

DO NOT assume

how permissions are stored.

Inspect repository.

Locate

- Role Model
- Module Registry
- Permission Tables
- Role Module Mapping
- Access Control Tables

Then

adapt to existing architecture.

Never redesign unless instructed.

---

# Flush Utility

Create

```
flush.py
```

Purpose

Reset development database.

---

Should Delete

- Students
- Mentors
- Attendance
- Tasks
- Assessments
- Submissions
- Emails
- Notifications
- Messages
- Reports
- Dashboards
- Documents
- Learning Records
- Calendar Events
- Help Desk
- Activity Logs
- Every Transaction Table

---

Should Preserve

- Roles
- Module Registry
- Role Module Mapping
- Permission Configuration
- System Configuration
- Default Super Admin (if present)

The repository should be explored first to determine additional configuration tables that should also be preserved.

Verified preserve set from the current ORM metadata:

- `ref_*` reference tables
- `rbac_actions`
- `rbac_features`
- `rbac_modules`
- `rbac_permission_groups`
- `rbac_permission_group_permissions`
- `rbac_permissions`
- `rbac_role_permissions`
- `rbac_role_permission_groups`
- `rbac_roles`
- `comm_email_templates`
- `sys_document_templates`
- `sys_idcard_templates`
- `sys_settings`
- `sup_faqs`

Flush deletes all other non-preserved tables in reverse foreign-key dependency order and keeps the default `SUPER_ADMIN` user row if it exists.

---

# Validation

After migration

Verify

- Every model has table
- No missing tables
- No migration failures
- No broken foreign keys

After seeding

Verify

- No business table empty
- No invalid references
- Dashboard loads successfully
- Every role has modules

---

# Knowledge Base

Whenever the AI discovers

- new models
- new tables
- new constraints
- new relationships
- new enums
- new configuration

Update this AGENTS.md.

This file is the living documentation of the ERP Database.

---

# Team Progress Checklist

## Repository Discovery

- [ ] Backend explored
- [ ] Models explored
- [ ] Modules explored
- [ ] Relationships documented
- [ ] Constraints documented

---

## Database

- [ ] AWS Connected
- [ ] Database Dropped
- [ ] Migration Completed
- [ ] Tables Verified

---

## Seeding

- [x] Roles Seeded
- [x] Modules Seeded
- [x] Users Seeded
- [x] Students Seeded
- [x] Mentors Seeded
- [x] Attendance Seeded
- [x] Assessments Seeded
- [x] Tasks Seeded
- [x] Dashboard Seeded
- [x] Notifications Seeded
- [x] Messages Seeded
- [x] Documents Seeded
- [x] Calendar Seeded
- [x] Reports Seeded
- [x] Help Desk Seeded
- [x] Performance Seeded
- [x] Every Table Populated

---

## Utilities

- [x] seed.py Completed
- [x] flush.py Completed
- [x] Validation Completed

---

# AI Principles

Always

✔ Explore before coding

✔ Inspect before modifying

✔ Preserve existing architecture

✔ Produce realistic data

✔ Validate every operation

✔ Keep AGENTS.md updated

✔ Never guess

✔ Never invent schema

✔ Prefer repository knowledge over assumptions

✔ Leave the repository in a working state