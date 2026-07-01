# Normalization Validation

## 1st Normal Form (1NF)
- **Compliance**: Yes. All JSONB arrays from the initial frontend mapping (e.g., `moduleIds`, `participants`) have been eliminated. Multi-valued attributes are now modeled via distinct junction tables (e.g., `user_roles`, `role_permissions`, `mentor_batch_assignments`).

## 2nd Normal Form (2NF)
- **Compliance**: Yes. Every table utilizes a surrogate `UUID` primary key. All non-key attributes are fully functionally dependent on the primary key.

## 3rd Normal Form (3NF) / BCNF
- **Compliance**: Yes. No transitive dependencies exist. For example, student details are not stored in the `applications` table; the application table relies on `student_user_id` linking to `users` and `student_profiles`.
