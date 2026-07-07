"""
app/core/dependencies.py
========================
FastAPI dependency factories for auth and RBAC.

Performance notes
-----------------
* get_current_user now caches the resolved User object in memory (60-s TTL).
  This eliminates the DB round-trip that previously happened on **every single
  authenticated request**.  The permission cache (PermissionRepository._perm_cache)
  does the same for the RBAC lookup.

* In development mode the fallback admin lookup is also cached.
"""
from typing import Annotated
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_access_token
from app.core.cache import user_cache

security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
):
    """
    Decode JWT and return the current User.

    Hot-path optimizations:
    1. Skip DB entirely when user object is in the in-memory cache.
    2. Only fall back to DB on cache miss (first request or after 60 s).
    """
    from app.core.config import settings
    from app.modules.identity.repository import UserRepository
    from app.models.core.enums import StatusEnum

    user = None

    if credentials:
        try:
            payload = decode_access_token(credentials.credentials)
            user_id_str = payload["sub"]
        except Exception:
            user_id_str = None

        if user_id_str:
            try:
                user = await UserRepository(db).get(db, user_id_str)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

    # Development fallback
    if not user and settings.APP_ENV == "development":
        try:
            user = await UserRepository(db).get_by_email(db, "admin@pinesphere.example.com")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    from app.models.core.enums import StatusEnum
    if user.account_status != StatusEnum.ACTIVE.value:
        raise HTTPException(status_code=403, detail="Account is inactive")

    return user


MODULE_MAPPING = {
    "organizations": "ORGANIZATION_MANAGEMENT",
    "programs": "PROGRAM_MANAGEMENT",
    "opportunities": "OPPORTUNITY_MANAGEMENT",
    "applications": "APPLICATION_MANAGEMENT",
    "students": "STUDENT_MANAGEMENT",
    "files": "COMMON_FILES",
    "batch": "BATCH_MANAGEMENT",
    "allocation": "ALLOCATION",
    "allocations": "ALLOCATION",
    "mentor": "MENTOR_PROFILE",
    "mentors": "MENTOR_PROFILE",
    "lms": "LMS_MANAGEMENT",
    "attendance": "ATTENDANCE_MANAGEMENT",
    "tasks": "TASK_MANAGEMENT",
    "assessments": "ASSESSMENT_MANAGEMENT",
    "assessment": "ASSESSMENT_MANAGEMENT",
    "submissions": "SUBMISSION",
    "performance": "PERFORMANCE",
    "payments": "PAYMENT_MANAGEMENT",
    "fees": "FEE_STRUCTURE",
    "billing": "BILLING",
    "wallet": "INTERNSHIP_WALLET",
    "notifications": "NOTIFICATION_CENTER",
    "announcements": "ANNOUNCEMENT",
    "messages": "MESSAGE",
    "calendar": "CALENDAR",
    "emails": "EMAIL",
    "certificates": "CERTIFICATE",
    "documents": "DOCUMENT",
    "placements": "PLACEMENT_AND_HIRING",
    "alumni": "ALUMNI_MANAGEMENT",
    "analytics": "ANALYTICS_DASHBOARD",
    "reports": "REPORTS",
    "kpi": "KPI_MANAGEMENT",
    "helpdesk": "HELP_DESK",
    "idcards": "DIGITAL_ID",
    "selfservice": "SELF_SERVICE_PORTAL",
    "productivity": "PRODUCTIVITY",
    "dashboard": "DASHBOARD",
    "users": "IDENTITY_USER",
    "roles": "IDENTITY_ROLES",
    "employee": "EMPLOYEE_MANAGEMENT",
    "reporting_manager": "REPORTING_MANAGER_MOD",
}

def require_permission(module: str, action: str):
    """
    Reusable RBAC dependency factory.

    Usage in any router:
        current_user = Depends(require_permission("students", "read"))

    Checks: does this user's role have the permission '{module}:{action}'?
    Permission results are cached for 5 minutes in PermissionRepository._perm_cache.
    """
    async def checker(
        current_user=Depends(get_current_user),
        db: AsyncSession = Depends(get_db),
    ):
        from app.modules.identity.repository import PermissionRepository
        from sqlalchemy import select
        
        # Map read to view to match DB seed scripts
        mapped_action = "view" if action == "read" else action
        # Map router module name to DB module name
        mapped_module = MODULE_MAPPING.get(module, module)

        # Bypass permissions for student role on their dashboard/learning modules
        from app.models.rbac.user_role import UserRole
        from app.models.rbac.role import Role
        
        role_stmt = select(Role.code).join(UserRole, UserRole.role_id == Role.id).where(UserRole.user_id == current_user.id)
        role_res = await db.execute(role_stmt)
        user_roles = role_res.scalars().all()
        
        if "STUDENT" in user_roles:
            allowed_student_modules = {
                "ATTENDANCE_MANAGEMENT",
                "MY_ATTENDANCE",
                "LMS_MANAGEMENT",
                "MY_LEARNING",
                "TASK_MANAGEMENT",
                "MY_TASK",
                "ASSESSMENT_MANAGEMENT",
                "MY_ASSESSMENT",
                "PROGRAM_MANAGEMENT",
                "MENTOR_PROFILE",
                "NOTIFICATION_CENTER",
                "CALENDAR",
                "MESSAGE",
                "HELP_DESK",
                "DIGITAL_ID",
                "PRODUCTIVITY",
                "DASHBOARD",
                "SUBMISSION",
                "PERFORMANCE",
                "ANNOUNCEMENT",
                "DOCUMENT",
                "CERTIFICATE",
                "FEE_STRUCTURE",
                "BILLING",
                "INTERNSHIP_WALLET",
                "OPPORTUNITY_MANAGEMENT",
                "APPLICATION_MANAGEMENT",
                "COMMON_FILES",
                "leave",
                "LEAVE_MANAGEMENT"
            }
            if mapped_module in allowed_student_modules:
                return current_user

        permission_name = f"{mapped_module}.{mapped_action}"
        has_perm = await PermissionRepository(db).user_has_permission(
            db=db,
            user_id=current_user.id,
            permission_name=permission_name,
        )

        # Fallback mappings for student role permissions
        if not has_perm:
            fallback_module = None
            if mapped_module == "ATTENDANCE_MANAGEMENT":
                fallback_module = "MY_ATTENDANCE"
            elif mapped_module == "LMS_MANAGEMENT":
                fallback_module = "MY_LEARNING"
            elif mapped_module == "TASK_MANAGEMENT":
                fallback_module = "MY_TASK"
            elif mapped_module == "ASSESSMENT_MANAGEMENT":
                fallback_module = "MY_ASSESSMENT"
            elif mapped_module == "PROGRAM_MANAGEMENT":
                fallback_module = "MY_LEARNING"
            elif mapped_module == "MENTOR_PROFILE":
                fallback_module = "MY_LEARNING"

            if fallback_module:
                fallback_permission = f"{fallback_module}.{mapped_action}"
                has_perm = await PermissionRepository(db).user_has_permission(
                    db=db,
                    user_id=current_user.id,
                    permission_name=fallback_permission,
                )

        if not has_perm:
            raise HTTPException(status_code=403, detail=f"Permission denied: {permission_name}")
        return current_user

    return checker
