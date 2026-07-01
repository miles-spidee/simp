# Enterprise RBAC Design

The RBAC implementation utilizes a fully normalized schema:
1. **users**: Central identity.
2. **roles**: Defines access levels (e.g., 'Super Admin', 'Student', 'Mentor').
3. **permissions**: Granular actions bound to modules (e.g., `module='Application', action='approve'`).
4. **role_permissions**: Junction table mapping roles to permissions.
5. **user_roles**: Junction table mapping users to roles.

This entirely replaces the frontend `permissions: string[]` JSONB approach, allowing for scalable SQL-based authorization checks and dynamic permission management.
