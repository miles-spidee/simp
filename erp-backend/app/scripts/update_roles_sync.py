import sys
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.models.rbac.role import Role
from app.models.rbac.action import Action
from app.models.rbac.module import Module
from app.models.rbac.feature import Feature
from app.models.rbac.permission import Permission
from app.models.rbac.role_permission import RolePermission
from app.models.rbac.user_role import UserRole
import os
import uuid
from app.core.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

ROLE_MODULES = {
    "SUPER_ADMIN": ["*"],
    "STUDENT": [
        "dashboard", "my_learning", "my_task", "my_attendance", "my_assessment", 
        "submission", "message", "calendar", "email", "document", "reports", 
        "export_center", "help_desk", "digital_id", "self_service", "productivity"
    ],
    "MENTOR": [
        "dashboard", "lms_dashboard", "lms_management", "attendance_dashboard", 
        "attendance_management", "assessment_dashboard", "assessment_management", 
        "task_dashboard", "task_management", "performance", "submission", 
        "leave_management", "message", "calendar", "email", "certificate", 
        "reports", "kpis", "help_desk", "digital_id", "self_service", "productivity"
    ],
    "COLLEGE_COORDINATOR": [
        "dashboard", "lms_dashboard", "attendance_dashboard", "assessment_dashboard", 
        "task_dashboard", "performance", "college_certificate_dashboard", "reports"
    ],
    "HR": [
        "dashboard", "college_coordinator", "employee_management", "organization_management", 
        "program_management", "opportunity_management", "application_management", 
        "student_management", "batch_management", "allocation", "mentor_profile", 
        "alumni_management", "analytics_dashboard", "kpi_management", "help_desk", 
        "digital_id_card", "self_service_portal", "productivity", "announcement", 
        "notification", "calendar", "reports"
    ],
    "REPORTING_MANAGER": [
        "dashboard", "analytics_dashboard", "kpi_management", "executive_dashboard", 
        "help_desk", "digital_id_card", "self_service_portal", "productivity", 
        "announcement", "notification", "leave_management", "reporting_manager", 
        "activity_tracking", "escalation_engine", "message", "calendar", "email", "reports"
    ],
    "FINANCE_MANAGER": [
        "dashboard", "kpi_management", "help_desk", "digital_id_card", "self_service_portal", 
        "productivity", "payment_management", "message", "calendar", "email", 
        "fee_structure", "invoice_and_receipt", "internship_wallet", "finance_dashboard", 
        "revenue_analytics", "reports"
    ]
}

async def update_roles():
    async with AsyncSessionLocal() as session:
        # Fetch existing users linked to SUPER_ADMIN so we can re-link them
        res = await session.execute(text("SELECT user_id FROM rbac_user_roles ur JOIN rbac_roles r ON r.id = ur.role_id WHERE r.code = 'SUPER_ADMIN'"))
        super_admin_user_ids = [row[0] for row in res.fetchall()]

        # Drop everything except modules and actions
        await session.execute(text("DELETE FROM rbac_role_permissions"))
        await session.execute(text("DELETE FROM rbac_role_permission_groups"))
        await session.execute(text("DELETE FROM rbac_permission_group_permissions"))
        await session.execute(text("DELETE FROM rbac_permissions"))
        await session.execute(text("DELETE FROM rbac_permission_groups"))
        await session.execute(text("DELETE FROM rbac_features"))
        await session.execute(text("DELETE FROM rbac_user_roles"))
        await session.execute(text("DELETE FROM rbac_roles"))
        
        # Ensure standard actions exist
        actions = ["view", "create", "update", "delete", "manage", "export"]
        for action in actions:
            res = await session.execute(text("SELECT id FROM rbac_actions WHERE code = :code"), {"code": action})
            if not res.first():
                new_action = Action(id=uuid.uuid4(), name=action.capitalize(), code=action, description=f"{action.capitalize()} records")
                session.add(new_action)
        await session.commit()
        
        # Get all actions
        res = await session.execute(text("SELECT id, code FROM rbac_actions"))
        action_map = {row[1]: row[0] for row in res.fetchall()}

        # Create Features and Permissions for every module
        res = await session.execute(text("SELECT id, code, name FROM rbac_modules"))
        modules = res.fetchall()
        
        module_permission_ids = {} # mod_code -> list of perm_ids
        
        objects_to_add = []
        
        for mod_id, mod_code, mod_name in modules:
            feature_id = uuid.uuid4()
            feature = Feature(id=feature_id, module_id=mod_id, name=f"{mod_name} Access", code=f"{mod_code}_access", description="")
            objects_to_add.append(feature)
            
            module_permission_ids[mod_code] = []
            
            for action_code in ["view", "create", "update", "delete", "manage", "export"]:
                if action_code in action_map:
                    perm_id = uuid.uuid4()
                    perm_code = f"{mod_code}.{action_code}"
                    perm = Permission(id=perm_id, feature_id=feature_id, action_id=action_map[action_code], name=perm_code, code=perm_code, description="")
                    objects_to_add.append(perm)
                    module_permission_ids[mod_code].append(perm_id)

        # Create Roles
        role_map = {}
        roles_to_create = [
            ("Super Admin", "SUPER_ADMIN"),
            ("HR", "HR"),
            ("College Coordinator", "COLLEGE_COORDINATOR"),
            ("Mentor", "MENTOR"),
            ("Student", "STUDENT"),
            ("Reporting Manager", "REPORTING_MANAGER"),
            ("Finance Manager", "FINANCE_MANAGER")
        ]
        
        for name, code in roles_to_create:
            role_id = uuid.uuid4()
            role = Role(id=role_id, name=name, code=code, is_system=True)
            objects_to_add.append(role)
            role_map[code] = role_id
            
            # Map permissions to this role
            assigned_modules = ROLE_MODULES.get(code, [])
            if "*" in assigned_modules:
                assigned_modules = module_permission_ids.keys()
                
            for mod_code in assigned_modules:
                if mod_code in module_permission_ids:
                    for perm_id in module_permission_ids[mod_code]:
                        rp = RolePermission(id=uuid.uuid4(), role_id=role_id, permission_id=perm_id)
                        objects_to_add.append(rp)

        # Re-assign super admins
        for user_id in super_admin_user_ids:
            if "SUPER_ADMIN" in role_map:
                ur = UserRole(id=uuid.uuid4(), user_id=user_id, role_id=role_map["SUPER_ADMIN"])
                objects_to_add.append(ur)

        session.add_all(objects_to_add)
        await session.commit()
        print("Updated roles and permissions successfully.")

if __name__ == "__main__":
    asyncio.run(update_roles())
