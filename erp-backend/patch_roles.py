import asyncio
from app.core.database import AsyncSessionLocal
from sqlalchemy import select, delete
from app.models.rbac.role import Role
from app.models.rbac.role_permission import RolePermission
from app.models.rbac.permission import Permission
from app.models.rbac.feature import Feature
from app.models.rbac.module import Module

ROLE_MODULES = {
    "SUPER_ADMIN": None, # all
    "HR": [
        "IDENTITY_USER", "IDENTITY_ROLES", "MODULE_REGISTRY", "SECURITY_CENTER",
        "EMPLOYEE_MANAGEMENT", "ORGANIZATION_MANAGEMENT", "PROGRAM_MANAGEMENT",
        "BATCH_MANAGEMENT", "STUDENT_MANAGEMENT", "MENTOR_PROFILE", "REPORTS", "HELP_DESK"
    ],
    "COLLEGE_COORDINATOR": [
        "ORGANIZATION_MANAGEMENT", "PROGRAM_MANAGEMENT", "BATCH_MANAGEMENT",
        "STUDENT_MANAGEMENT", "MENTOR_PROFILE", "REPORTS", "HELP_DESK", "ALLOCATION"
    ],
    "MENTOR": [
        "MENTOR_PROFILE", "BATCH_MANAGEMENT", "STUDENT_MANAGEMENT", "LMS_DASHBOARD",
        "ATTENDANCE_DASHBOARD", "TASK_DASHBOARD", "ASSESSMENT_DASHBOARD", "SUBMISSION",
        "PERFORMANCE", "MESSAGE", "CALENDAR"
    ],
    "STUDENT": [
        "DASHBOARD", "MY_LEARNING", "MY_ATTENDANCE", "MY_TASK", "MY_ASSESSMENT",
        "SUBMISSION", "PERFORMANCE", "CALENDAR", "DIGITAL_ID", "SELF_SERVICE_PORTAL", "HELP_DESK"
    ],
    "MANAGEMENT": [
        "DASHBOARD", "ANALYTICS_DASHBOARD", "REPORTS", "ORGANIZATION_MANAGEMENT",
        "PROGRAM_MANAGEMENT", "BATCH_MANAGEMENT", "STUDENT_MANAGEMENT", "MENTOR_PROFILE", "EXECUTIVE_DASHBOARD"
    ],
    "FINANCE_MANAGER": [
        "DASHBOARD", "ANALYTICS_DASHBOARD", "REPORTS", "PAYMENT_MANAGEMENT",
        "FEE_STRUCTURE", "BILLING", "FINANCE_DASHBOARD", "REVENUE_ANALYTICS"
    ]
}

async def patch():
    async with AsyncSessionLocal() as db:
        roles = await db.execute(select(Role))
        roles = roles.scalars().all()
        
        all_perms_query = await db.execute(
            select(Permission.id, Feature.module_id, Module.code)
            .join(Feature, Permission.feature_id == Feature.id)
            .join(Module, Feature.module_id == Module.id)
        )
        all_perms = all_perms_query.all()
        
        for role in roles:
            # Clear existing
            await db.execute(delete(RolePermission).where(RolePermission.role_id == role.id))
            
            # Map old 'REPORTING_MANAGER' to MANAGEMENT for this patch if needed
            r_code = "MANAGEMENT" if role.code == "REPORTING_MANAGER" else role.code
            allowed_modules = ROLE_MODULES.get(r_code, [])
            
            role_perms = []
            for perm_id, mod_id, mod_code in all_perms:
                if r_code == "SUPER_ADMIN" or mod_code in allowed_modules:
                    role_perms.append(RolePermission(role_id=role.id, permission_id=perm_id))
            
            db.add_all(role_perms)
            print(f"Assigned {len(role_perms)} permissions to {role.code}")
            
        await db.commit()

asyncio.run(patch())
