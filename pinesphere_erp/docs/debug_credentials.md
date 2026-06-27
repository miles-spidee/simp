# Pinesphere ERP Mobile Debug Credentials

These accounts are available only in Flutter debug builds through the **Development Mode** section on the login screen.

| Demo user | Username | Role | Destination |
| --- | --- | --- | --- |
| Student Demo | `student_demo` | `ROLE_STUDENT` | `/student` |
| HR Demo | `hr_demo` | `ROLE_HR` | `/hr` |
| Super Admin Demo | `super_admin_demo` | `ROLE_SUPER_ADMIN` | `/admin` |

## Important

- These users are for local development and QA only.
- The Development Mode login panel is guarded by Flutter `kDebugMode`.
- Release builds do not show the panel and do not allow the debug login bypass.
- Production authentication continues to use the existing backend login API contract.
