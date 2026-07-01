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
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

ROLE_MODULES = {
    "SUPER_ADMIN": ["*"],
    "HR": [
        "employee", "organization", "program", "application", "batch", "communication",
        "notification", "calendar", "email", "certificate", "document", "placement",
        "alumni", "analytics", "reports", "helpdesk", "productivity", "idcard", "selfservice"
    ],
    "COLLEGE_COORDINATOR": [
        "organization", "program", "batch", "student", "attendance", "performance",
        "communication", "calendar", "reports"
    ],
    "MENTOR": [
        "mentor", "task", "assessment", "submission", "performance", "communication"
    ],
    "STUDENT": [
        "dashboard", "lms", "attendance", "task", "assessment", "submission",
        "calendar", "selfservice", "productivity", "idcard"
    ],
    "MANAGEMENT": [
        "dashboard", "organization", "program", "analytics", "executive",
        "reports", "kpi", "placement", "communication"
    ],
    "FINANCE_MANAGER": [
        "dashboard", "analytics", "reports", "executive"
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
        actions = ["read", "create", "update", "delete", "manage", "export"]
        for action in actions:
            res = await session.execute(text("SELECT id FROM rbac_actions WHERE code = :code"), {"code": action})
            if not res.first():
                new_action = Action(name=action.capitalize(), code=action, description=f"{action.capitalize()} records")
                session.add(new_action)
        await session.commit()
        
        # Get all actions
        res = await session.execute(text("SELECT id, code FROM rbac_actions"))
        action_map = {row[1]: row[0] for row in res.fetchall()}

        # Create Features and Permissions for every module
        res = await session.execute(text("SELECT id, code, name FROM rbac_modules"))
        modules = res.fetchall()
        
        module_permission_ids = {} # mod_code -> list of perm_ids
        
        for mod_id, mod_code, mod_name in modules:
            feature = Feature(module_id=mod_id, name=f"{mod_name} Access", code=f"{mod_code}_access", description="")
            session.add(feature)
            await session.flush()
            
            module_permission_ids[mod_code] = []
            
            for action_code in ["read", "create", "update", "delete", "manage", "export"]:
                if action_code in action_map:
                    perm_code = f"{mod_code}:{action_code}"
                    perm = Permission(feature_id=feature.id, action_id=action_map[action_code], name=perm_code, code=perm_code, description="")
                    session.add(perm)
                    await session.flush()
                    module_permission_ids[mod_code].append(perm.id)

        # Create Roles
        role_map = {}
        roles_to_create = [
            ("Super Admin", "SUPER_ADMIN"),
            ("HR", "HR"),
            ("College Coordinator", "COLLEGE_COORDINATOR"),
            ("Mentor", "MENTOR"),
            ("Student", "STUDENT"),
            ("Management", "MANAGEMENT"),
            ("Finance Manager", "FINANCE_MANAGER")
        ]
        
        for name, code in roles_to_create:
            role = Role(name=name, code=code, is_system=True)
            session.add(role)
            await session.flush()
            role_map[code] = role.id
            
            # Map permissions to this role
            assigned_modules = ROLE_MODULES.get(code, [])
            if "*" in assigned_modules:
                assigned_modules = module_permission_ids.keys()
                
            for mod_code in assigned_modules:
                if mod_code in module_permission_ids:
                    for perm_id in module_permission_ids[mod_code]:
                        rp = RolePermission(role_id=role.id, permission_id=perm_id)
                        session.add(rp)

        # Re-assign super admins
        for user_id in super_admin_user_ids:
            if "SUPER_ADMIN" in role_map:
                ur = UserRole(user_id=user_id, role_id=role_map["SUPER_ADMIN"])
                session.add(ur)

        await session.commit()
        print("Updated roles and permissions successfully.")

if __name__ == "__main__":
    asyncio.run(update_roles())
