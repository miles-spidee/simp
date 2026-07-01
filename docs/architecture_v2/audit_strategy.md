# Audit & History Strategy

## 1. Base Audit Fields
Every transactional and master table inherits the following fields:
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `deleted_at` (TIMESTAMP NULL)
- `created_by` (UUID FK -> users.id)
- `updated_by` (UUID FK -> users.id)

## 2. State Machine History Tables
Tables that represent a lifecycle (e.g., Applications, Leaves, Tickets) MUST have a corresponding `_status_history` table.
- These tables are **Append-Only**.
- They track the `status`, `changed_at`, `changed_by`, and optional `remarks`.
- Example: `application_status_history`, `leave_status_history`.
