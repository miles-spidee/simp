# Backend Implementation Plan (V2)

## 1. ORM Configuration
- Use SQLAlchemy 2.0 (or Django ORM) configured with PostgreSQL.
- Base Model must inject `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by` automatically.

## 2. Model Generation Order
Follow the exact order specified in `migration_plan.md` to avoid circular import dependencies in Python/Node.

## 3. Query Guidelines
- Override default querysets/managers to always append `WHERE deleted_at IS NULL`.
- All updates must automatically refresh `updated_at`.
