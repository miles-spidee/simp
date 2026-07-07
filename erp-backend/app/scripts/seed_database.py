import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.models.rbac.module import Module
from app.models.rbac.role import Role
from app.models.rbac.action import Action
from app.models.rbac.feature import Feature
from app.models.rbac.permission import Permission
from app.models.rbac.role_permission import RolePermission
from app.models.rbac.role_module import RoleModule
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

MODULES_TO_CREATE = [
    ("Dashboard", "DASHBOARD", "/feature/dashboard"),
    ("Super Admin", "SUPER_ADMIN", "/feature/super_admin"),
    ("Identity User", "IDENTITY_USER", "/feature/identity/user"),
    ("Identity Roles", "IDENTITY_ROLES", "/feature/identity/roles"),
    ("Identity Module Registry", "MODULE_REGISTRY", "/feature/identity/module_registry"),
    ("Identity Module Security Center", "SECURITY_CENTER", "/feature/identity/security_center"),
    ("Employee", "EMPLOYEE_MANAGEMENT", "/feature/employee_management"),
    ("Organization", "ORGANIZATION_MANAGEMENT", "/feature/organization_management"),
    ("Program", "PROGRAM_MANAGEMENT", "/feature/program_management"),
    ("Opportunity", "OPPORTUNITY_MANAGEMENT", "/feature/opportunity_management"),
    ("Application", "APPLICATION_MANAGEMENT", "/feature/application_management"),
    ("Student", "STUDENT_MANAGEMENT", "/feature/student_management"),
    ("Batch", "BATCH_MANAGEMENT", "/feature/batch_management"),
    ("Allocation", "ALLOCATION", "/feature/allocation"),
    ("Mentor Profile", "MENTOR_PROFILE", "/feature/mentor_profile"),
    ("LMS Dashboard", "LMS_DASHBOARD", "/feature/lms_dashboard"),
    ("LMS Management", "LMS_MANAGEMENT", "/feature/lms_management"),
    ("LMS My Learning", "MY_LEARNING", "/feature/my_learning"),
    ("Attendance Dashboard", "ATTENDANCE_DASHBOARD", "/feature/attendance_dashboard"),
    ("Attendance Management", "ATTENDANCE_MANAGEMENT", "/feature/attendance_management"),
    ("Attendance My Attendance", "MY_ATTENDANCE", "/feature/my_attendance"),
    ("Task Dashboard", "TASK_DASHBOARD", "/feature/task_dashboard"),
    ("Task Management", "TASK_MANAGEMENT", "/feature/task_management"),
    ("Task My Task", "MY_TASK", "/feature/my_task"),
    ("Assessment Dashboard", "ASSESSMENT_DASHBOARD", "/feature/assessment_dashboard"),
    ("Assessment Management", "ASSESSMENT_MANAGEMENT", "/feature/assessment_management"),
    ("Assessment My Assessment", "MY_ASSESSMENT", "/feature/my_assessment"),
    ("Submission", "SUBMISSION", "/feature/submission"),
    ("Performance", "PERFORMANCE", "/feature/performance"),
    ("College Coordinator", "COLLEGE_COORDINATOR_MOD", "/feature/college_coordinator"),
    ("Common Files", "COMMON_FILES", "/feature/common_files"),
    ("Reporting Manager", "REPORTING_MANAGER_MOD", "/feature/reporting_manager"),
    ("Leave Management", "LEAVE_MANAGEMENT", "/feature/leave_management"),
    ("Activity Tracking", "ACTIVITY_TRACKING", "/feature/activity_tracking"),
    ("Escalation Engine", "ESCALATION_ENGINE", "/feature/escalation_engine"),
    ("Payment", "PAYMENT_MANAGEMENT", "/feature/payment_management"),
    ("Fee Structure", "FEE_STRUCTURE", "/feature/fee_structure"),
    ("Billing", "BILLING", "/feature/billing"),
    ("Wallet", "INTERNSHIP_WALLET", "/feature/internship_wallet"),
    ("Finance Dashboard", "FINANCE_DASHBOARD", "/feature/finance_dashboard"),
    ("Revenue Analytics", "REVENUE_ANALYTICS", "/feature/revenue_analytics"),
    ("Notification", "NOTIFICATION_CENTER", "/feature/notification_center"),
    ("Announcements", "ANNOUNCEMENT", "/feature/announcement"),
    ("Messages", "MESSAGE", "/feature/message"),
    ("Calendar", "CALENDAR", "/feature/calendar"),
    ("Email", "EMAIL", "/feature/email"),
    ("Certificates", "CERTIFICATE", "/feature/certificate"),
    ("College Certificates", "COLLEGE_CERTIFICATE_DASHBOARD", "/feature/college_certificate_dashboard"),
    ("Documents", "DOCUMENT", "/feature/documents"),
    ("Placement", "PLACEMENT_AND_HIRING", "/feature/placement_and_hiring"),
    ("Alumni", "ALUMNI_MANAGEMENT", "/feature/alumni_management"),
    ("Analytics", "ANALYTICS_DASHBOARD", "/feature/analytics_dashboard"),
    ("Reports", "REPORTS", "/feature/reports"),
    ("KPI", "KPI_MANAGEMENT", "/feature/kpi_management"),
    ("Executive Dashboard", "EXECUTIVE_DASHBOARD", "/feature/executive_dashboard"),
    ("Help Desk", "HELP_DESK", "/feature/help_desk"),
    ("Digital ID", "DIGITAL_ID", "/feature/digital-id"),
    ("Self Service", "SELF_SERVICE_PORTAL", "/feature/self_service_portal"),
    ("Productivity", "PRODUCTIVITY", "/feature/productivity"),
]

ROLE_MODULES = {
    "SUPER_ADMIN": ["*"],
    "HR": [
        "EMPLOYEE_MANAGEMENT", "ORGANIZATION_MANAGEMENT", "PROGRAM_MANAGEMENT", 
        "APPLICATION_MANAGEMENT", "BATCH_MANAGEMENT", "MESSAGE",
        "NOTIFICATION_CENTER", "CALENDAR", "EMAIL", "CERTIFICATE", "DOCUMENT", 
        "PLACEMENT_AND_HIRING", "ALUMNI_MANAGEMENT", "ANALYTICS_DASHBOARD", "REPORTS", 
        "HELP_DESK", "PRODUCTIVITY", "DIGITAL_ID", "SELF_SERVICE_PORTAL",
        "ALLOCATION", "OPPORTUNITY_MANAGEMENT", "STUDENT_MANAGEMENT", "IDENTITY_USER"
    ],
    "COLLEGE_COORDINATOR": [
        "ORGANIZATION_MANAGEMENT", "PROGRAM_MANAGEMENT", "BATCH_MANAGEMENT", "STUDENT_MANAGEMENT", 
        "ATTENDANCE_MANAGEMENT", "PERFORMANCE",
        "MESSAGE", "CALENDAR", "REPORTS", "COLLEGE_COORDINATOR_MOD"
    ],
    "MENTOR": [
        "MENTOR_PROFILE", "TASK_MANAGEMENT", "ASSESSMENT_MANAGEMENT", "SUBMISSION", 
        "PERFORMANCE", "MESSAGE"
    ],
    "STUDENT": [
        "DASHBOARD", "LMS_DASHBOARD", "MY_LEARNING", "MY_ATTENDANCE", 
        "MY_TASK", "MY_ASSESSMENT", "SUBMISSION",
        "CALENDAR", "SELF_SERVICE_PORTAL", "PRODUCTIVITY", "DIGITAL_ID"
    ],
    "MANAGEMENT": [
        "DASHBOARD", "ORGANIZATION_MANAGEMENT", "PROGRAM_MANAGEMENT", "ANALYTICS_DASHBOARD", 
        "EXECUTIVE_DASHBOARD",
        "REPORTS", "KPI_MANAGEMENT", "PLACEMENT_AND_HIRING", "MESSAGE"
    ],
    "FINANCE_MANAGER": [
        "DASHBOARD", "FINANCE_DASHBOARD", "REVENUE_ANALYTICS", "PAYMENT_MANAGEMENT", 
        "FEE_STRUCTURE", "BILLING", "ANALYTICS_DASHBOARD", "REPORTS", "EXECUTIVE_DASHBOARD"
    ],
    "REPORTING_MANAGER": [
        "DASHBOARD", "REPORTING_MANAGER_MOD", "EXECUTIVE_DASHBOARD", "ANALYTICS_DASHBOARD", "KPI_MANAGEMENT", 
        "LEAVE_MANAGEMENT", "ACTIVITY_TRACKING", "NOTIFICATION_CENTER", "ANNOUNCEMENT", "HELP_DESK", 
        "DIGITAL_ID", "SELF_SERVICE_PORTAL", "PRODUCTIVITY", "MESSAGE", "CALENDAR", "EMAIL"
    ]
}

async def seed_db():
    async with AsyncSessionLocal() as session:
        # Fetch existing users linked to SUPER_ADMIN so we can re-link them
        res = await session.execute(text("SELECT user_id FROM rbac_user_roles ur JOIN rbac_roles r ON r.id = ur.role_id WHERE r.code = 'SUPER_ADMIN'"))
        super_admin_user_ids = [row[0] for row in res.fetchall()]

        # Drop everything
        await session.execute(text("DELETE FROM rbac_role_permissions"))
        await session.execute(text("DELETE FROM rbac_role_permission_groups"))
        await session.execute(text("DELETE FROM rbac_permission_group_permissions"))
        await session.execute(text("DELETE FROM rbac_permissions"))
        await session.execute(text("DELETE FROM rbac_permission_groups"))
        await session.execute(text("DELETE FROM rbac_features"))
        await session.execute(text("DELETE FROM rbac_role_modules"))
        await session.execute(text("DELETE FROM rbac_user_roles"))
        await session.execute(text("DELETE FROM rbac_roles"))
        await session.execute(text("DELETE FROM rbac_modules"))
        
        # Insert Modules
        module_permission_ids = {} # mod_code -> list of perm_ids
        module_map = {} # mod_code -> mod_id

        # Ensure standard actions exist
        actions = ["read", "create", "update", "delete", "manage", "export"]
        for action in actions:
            res = await session.execute(text("SELECT id FROM rbac_actions WHERE code = :code"), {"code": action})
            if not res.first():
                new_action = Action(id=uuid.uuid4(), name=action.capitalize(), code=action, description=f"{action.capitalize()} records")
                session.add(new_action)
        await session.flush()
        
        # Get all actions
        res = await session.execute(text("SELECT id, code FROM rbac_actions"))
        action_map = {row[1]: row[0] for row in res.fetchall()}
        
        objects_to_add = []
        
        for name, code, route in MODULES_TO_CREATE:
            mod_id = uuid.uuid4()
            mod = Module(id=mod_id, name=name, code=code, description=f"{name} Module", route_path=route)
            objects_to_add.append(mod)
            module_map[code] = mod.id
            
            feat_id = uuid.uuid4()
            feature = Feature(id=feat_id, module_id=mod.id, name=f"{name} Access", code=f"{code}_access", description="")
            objects_to_add.append(feature)
            
            module_permission_ids[code] = []
            for action_code in ["read", "create", "update", "delete", "manage", "export"]:
                if action_code in action_map:
                    mapped_action = "view" if action_code == "read" else action_code
                    perm_code = f"{code}.{mapped_action}"
                    perm_id = uuid.uuid4()
                    perm = Permission(id=perm_id, feature_id=feature.id, action_id=action_map[action_code], name=perm_code, code=perm_code, description="")
                    objects_to_add.append(perm)
                    module_permission_ids[code].append(perm.id)
                    
        session.add_all(objects_to_add)
                    
        # Create Roles
        role_map = {}
        roles_to_create = [
            ("Super Admin", "SUPER_ADMIN"),
            ("HR", "HR"),
            ("College Coordinator", "COLLEGE_COORDINATOR"),
            ("Mentor", "MENTOR"),
            ("Student", "STUDENT"),
            ("Management", "MANAGEMENT"),
            ("Finance Manager", "FINANCE_MANAGER"),
            ("Reporting Manager", "REPORTING_MANAGER")
        ]
        
        roles_objects = []
        for name, code in roles_to_create:
            role_id = uuid.uuid4()
            role = Role(id=role_id, name=name, code=code, is_system=True)
            roles_objects.append(role)
            role_map[code] = role.id
            
            # Map permissions to this role
            assigned_modules = ROLE_MODULES.get(code, [])
            if "*" in assigned_modules:
                assigned_modules = module_permission_ids.keys()
                
            for mod_code in assigned_modules:
                if mod_code in module_permission_ids:
                    for perm_id in module_permission_ids[mod_code]:
                        rp = RolePermission(id=uuid.uuid4(), role_id=role.id, permission_id=perm_id)
                        roles_objects.append(rp)
                    
                    # Add to RoleModule mapping
                    rm = RoleModule(id=uuid.uuid4(), role_id=role.id, module_id=module_map[mod_code])
                    roles_objects.append(rm)

        session.add_all(roles_objects)

        # Re-assign super admins
        super_admin_objects = []
        for user_id in super_admin_user_ids:
            if "SUPER_ADMIN" in role_map:
                ur = UserRole(id=uuid.uuid4(), user_id=user_id, role_id=role_map["SUPER_ADMIN"])
                super_admin_objects.append(ur)
                
        session.add_all(super_admin_objects)

        await session.commit()
        print("Updated modules, roles and permissions successfully.")

if __name__ == "__main__":
    asyncio.run(seed_db())
