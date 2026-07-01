# System Analysis (V2)

## Executive Summary
This document analyzes the Pinesphere ERP system requirements strictly from a business perspective, normalizing the frontend interfaces into an enterprise-grade backend architecture. 

The system encompasses 7 core domains, ranging from Identity & RBAC, Organization Hierarchy, Academics, Operations, and Finance.

## Key Design Principles Applied
1. **Centralized Identity**: All entities (students, employees, mentors) resolve to a central `users` table.
2. **Normalized RBAC**: Roles and Permissions are handled via junction tables, eliminating JSON arrays.
3. **Strict Auditability**: Every transactional table contains `created_at`, `updated_at`, `deleted_at`, `created_by`, and `updated_by`.
4. **Append-Only History**: State machines (Applications, Leaves, Tickets) utilize history tables to prevent overwriting historical context.
