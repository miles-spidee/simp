import asyncio
import os
from uuid import uuid4
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.models.rbac.role import Role
from app.models.rbac.module import Module
from app.models.rbac.feature import Feature
from app.models.rbac.permission import Permission
from app.models.rbac.role_permission import RolePermission

ROLE_DEFINITIONS = {
    "SUPER_ADMIN": {
        "name": "Super Admin",
        "description": "Full access to all modules and system settings",
        "modules": "ALL"
    },
    "STUDENT": {
        "name": "Student",
        "description": "Access to student learning, tasks, and self-service",
        "modules": [
            "dashboard", "my_learning", "my_attendance", "my_tasks", "my_assessments", 
            "submission", "common_file", "communication", "calendar", "email", 
            "document", "reports", "helpdesk", "idcard", "selfservice", "productivity"
        ]
    },
    "MENTOR": {
        "name": "Mentor",
        "description": "Access to LMS, attendance, tasks, and assessments for mentoring",
        "modules": [
            "dashboard", "lms", "lms_management", "attendance", "attendance_management", 
            "task", "task_management", "assessment", "assessment_management", 
            "submission", "performance", "leave", "common_file", "communication", 
            "calendar", "email", "certificate", "reports", "kpi", "helpdesk", "idcard", 
            "selfservice", "productivity"
        ]
    },
    "COLLEGE_COORDINATOR": {
        "name": "College Coordinator",
        "description": "Access to coordinate college activities, certificates, and reports",
        "modules": [
            "dashboard", "lms", "attendance", "task", "assessment", "performance", 
            "college_certificates", "common_file", "reports"
        ]
    },
    "HR": {
        "name": "HR",
        "description": "Access to employee management, recruitment, and organizational structure",
        "modules": [
            "dashboard", "employee", "organization", "program", "opportunity", 
            "application", "student", "batch", "allocation", "mentor", "college_coordinator", 
            "placement", "alumni", "analytics", "notification", "announcement", "kpi", 
            "helpdesk", "idcard", "selfservice", "productivity", "communication", 
            "calendar", "email"
        ]
    },
    "REPORTING_MANAGER": {
        "name": "Reporting Manager",
        "description": "Access to team reporting, leave approvals, and executive dashboards",
        "modules": [
            "dashboard", "reporting_manager", "executive", "analytics", "kpi", "leave", 
            "activity", "notification", "announcement", "helpdesk", "idcard", "selfservice", 
            "productivity", "communication", "calendar", "email"
        ]
    },
    "FINANCE_MANAGER": {
        "name": "Finance Manager",
        "description": "Access to financial operations, billing, and revenue analytics",
        "modules": [
            "dashboard", "finance", "payment", "fee", "billing", "wallet", 
            "finance_analytics", "kpi", "helpdesk", "idcard", "selfservice", 
            "productivity", "communication", "calendar", "email"
        ]
    }
}

async def upload_roles():
    async with AsyncSessionLocal() as db:
        print("Starting role upload and permission assignment...")
        
        for role_code, r_data in ROLE_DEFINITIONS.items():
            print(f"Processing Role: {r_data['name']} ({role_code})")
            
            # 1. Ensure Role Exists and is marked as system role
            role_obj = (await db.execute(select(Role).where(Role.code == role_code))).scalars().first()
            if not role_obj:
                role_obj = Role(
                    id=uuid4(),
                    name=r_data['name'],
                    code=role_code,
                    description=r_data['description'],
                    is_system=True,
                    is_active=True
                )
                db.add(role_obj)
                await db.flush()
            else:
                role_obj.is_system = True
                await db.flush()
            
            # 2. Get Module IDs for this role
            module_ids = []
            if r_data["modules"] == "ALL":
                all_mods = (await db.execute(select(Module.id))).scalars().all()
                module_ids = list(all_mods)
            else:
                mod_result = await db.execute(select(Module.id, Module.code).where(Module.code.in_(r_data["modules"])))
                found_mods = mod_result.all()
                module_ids = [m[0] for m in found_mods]
                found_codes = [m[1] for m in found_mods]
                
                # Check for missing modules that we attempted to map
                missing = set(r_data["modules"]) - set(found_codes)
                if missing:
                    print(f"  Warning: Modules not found in DB for {role_code}: {missing}")

            # 3. Clear existing role permissions
            await db.execute(delete(RolePermission).where(RolePermission.role_id == role_obj.id))
            
            # 4. Assign permissions for the selected modules
            if module_ids:
                perm_result = await db.execute(
                    select(Permission.id)
                    .join(Feature, Permission.feature_id == Feature.id)
                    .where(Feature.module_id.in_(module_ids))
                )
                perm_ids = perm_result.scalars().all()
                
                for pid in perm_ids:
                    rp = RolePermission(role_id=role_obj.id, permission_id=pid)
                    db.add(rp)
                
                print(f"  Assigned {len(perm_ids)} permissions across {len(module_ids)} modules.")
            
        await db.commit()
        print("Successfully uploaded all 7 roles and assigned their permissions!")

if __name__ == "__main__":
    asyncio.run(upload_roles())
