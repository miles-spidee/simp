# Indexing Strategy (V2)

## 1. Primary Keys
- Every table utilizes a UUID Primary Key with an implicit unique B-Tree index.

## 2. Foreign Keys
- PostgreSQL does NOT index foreign keys automatically. Explicit B-Tree indexes MUST be created for every column ending in `_id` to prevent full table scans during JOINs and CASCADE deletes.

## 3. Partial Indexes (Soft Deletes)
- To ensure unique constraints ignore soft-deleted rows, partial indexes are utilized. Example:
  `CREATE UNIQUE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;`

## 4. Specific Defined Indexes:
### `users`
- `CREATE UNIQUE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL`

### `permissions`
- `CREATE UNIQUE INDEX idx_permissions_module_action ON permissions(module, action)`

### `applications`
- `CREATE UNIQUE INDEX idx_applications_student_opp ON applications(student_user_id, opportunity_id) WHERE deleted_at IS NULL`
