import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
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
if DATABASE_URL and DATABASE_URL.startswith("postgresql+asyncpg://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://", 1)
if "?ssl=" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.split("?")[0]

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(engine, expire_on_commit=False)

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

def update_roles():
    with SessionLocal() as session:
        # Fetch existing users linked to SUPER_ADMIN so we can re-link them
        res = session.execute(text("SELECT user_id FROM rbac_user_roles ur JOIN rbac_roles r ON r.id = ur.role_id WHERE r.code = 'SUPER_ADMIN'"))
        super_admin_user_ids = [row[0] for row in res.fetchall()]

        # Drop everything except modules and actions
        session.execute(text("DELETE FROM rbac_role_permissions"))
        session.execute(text("DELETE FROM rbac_role_permission_groups"))
        session.execute(text("DELETE FROM rbac_permission_group_permissions"))
        session.execute(text("DELETE FROM rbac_permissions"))
        session.execute(text("DELETE FROM rbac_permission_groups"))
        session.execute(text("DELETE FROM rbac_features"))
        session.execute(text("DELETE FROM rbac_user_roles"))
        session.execute(text("DELETE FROM rbac_roles"))
        
        # Ensure standard actions exist
        actions = ["read", "create", "update", "delete", "manage", "export"]
        for action in actions:
            res = session.execute(text("SELECT id FROM rbac_actions WHERE code = :code"), {"code": action})
            if not res.first():
                new_action = Action(id=uuid.uuid4(), name=action.capitalize(), code=action, description=f"{action.capitalize()} records")
                session.add(new_action)
        session.commit()
        
        # Get all actions
        res = session.execute(text("SELECT id, code FROM rbac_actions"))
        action_map = {row[1]: row[0] for row in res.fetchall()}

        # Create Features and Permissions for every module
        res = session.execute(text("SELECT id, code, name FROM rbac_modules"))
        modules = res.fetchall()
        
        module_permission_ids = {} # mod_code -> list of perm_ids
        
        objects_to_add = []
        
        for mod_id, mod_code, mod_name in modules:
            feature_id = uuid.uuid4()
            feature = Feature(id=feature_id, module_id=mod_id, name=f"{mod_name} Access", code=f"{mod_code}_access", description="")
            objects_to_add.append(feature)
            
            module_permission_ids[mod_code] = []
            
            for action_code in ["read", "create", "update", "delete", "manage", "export"]:
                if action_code in action_map:
                    perm_id = uuid.uuid4()
                    perm_code = f"{mod_code}:{action_code}"
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
            ("Management", "MANAGEMENT"),
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
        session.commit()
        print("Updated roles and permissions successfully.")

if __name__ == "__main__":
    update_roles()
