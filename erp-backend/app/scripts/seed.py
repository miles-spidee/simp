import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.authentication.user import User
from app.models.rbac.role import Role
from app.models.rbac.user_role import UserRole
from app.models.core.reference.demographics import Gender, BloodGroup
from app.models.core.reference.geography import Country, State, City, Timezone
from app.models.core.reference.localization import Currency, Language
from app.models.core.reference.system import DocumentType, NotificationType

async def seed_reference_data(db: AsyncSession):
    # 1. Genders
    genders = ["Male", "Female", "Non-Binary", "Other", "Prefer not to say"]
    for g in genders:
        if not (await db.execute(select(Gender).where(Gender.name == g))).scalars().first():
            db.add(Gender(name=g))
    
    # 2. Blood Groups
    blood_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    for bg in blood_groups:
        if not (await db.execute(select(BloodGroup).where(BloodGroup.name == bg))).scalars().first():
            db.add(BloodGroup(name=bg))

    # 3. Countries
    countries = {
        "United States": {"iso2": "US", "iso3": "USA", "phone": "+1"},
        "India": {"iso2": "IN", "iso3": "IND", "phone": "+91"},
        "United Kingdom": {"iso2": "GB", "iso3": "GBR", "phone": "+44"},
        "Australia": {"iso2": "AU", "iso3": "AUS", "phone": "+61"},
        "Canada": {"iso2": "CA", "iso3": "CAN", "phone": "+1"}
    }
    for c_name, c_data in countries.items():
        if not (await db.execute(select(Country).where(Country.name == c_name))).scalars().first():
            db.add(Country(name=c_name, iso_code_2=c_data["iso2"], iso_code_3=c_data["iso3"], phone_code=c_data["phone"]))

    # 4. Document Types
    doc_types = ["Resume", "Aadhar", "PAN", "Offer Letter", "Certificate", "Other"]
    for dt in doc_types:
        if not (await db.execute(select(DocumentType).where(DocumentType.name == dt))).scalars().first():
            db.add(DocumentType(name=dt))
            
    await db.commit()
    print("Reference data seeded successfully.")

async def seed_super_admin(db: AsyncSession):
    # 1. Check if SUPER_ADMIN role exists
    result = await db.execute(select(Role).where(Role.name == "SUPER_ADMIN"))
    role = result.scalars().first()
    if not role:
        print("Creating SUPER_ADMIN role...")
        role = Role(name="SUPER_ADMIN", code="SUPER_ADMIN", description="Master administrator with all permissions")
        db.add(role)
        await db.flush()

    # 2. Check if admin user exists
    result = await db.execute(select(User).where(User.email == "admin@pinesphere.com"))
    user = result.scalars().first()
    
    if not user:
        print("Creating superadmin user...")
        from app.core.security import hash_password
        user = User(
            username="superadmin",
            email="admin@pinesphere.com",
            password_hash=hash_password("ChangeMe@123"),
            account_status="ACTIVE",
            email_verified=True,
            phone_verified=True
        )
        db.add(user)
        await db.flush()
    else:
        print("Super admin user already exists.")

    # 3. Map user to SUPER_ADMIN role
    result = await db.execute(
        select(UserRole).where(
            UserRole.user_id == user.id,
            UserRole.role_id == role.id
        )
    )
    user_role = result.scalars().first()
    if not user_role:
        print("Assigning SUPER_ADMIN role to superadmin user...")
        user_role = UserRole(user_id=user.id, role_id=role.id)
        db.add(user_role)
    
    await db.commit()
    print("Seed completed successfully!")

async def seed_modules(db: AsyncSession):
    from app.models.rbac.module import Module
    
    modules_to_seed = [
  { "code": "dashboard", "name": "Dashboard" },
  { "code": "users", "name": "Users" },
  { "code": "roles", "name": "Roles" },
  { "code": "modules", "name": "Module Registry" },
  { "code": "security", "name": "Security Center" },
  { "code": "employee", "name": "Employee Management" },
  { "code": "organization", "name": "Organization Management" },
  { "code": "program", "name": "Program Management" },
  { "code": "opportunity", "name": "Opportunity Management" },
  { "code": "application", "name": "Application Management" },
  { "code": "student", "name": "Student Management" },
  { "code": "batch", "name": "Batch Management" },
  { "code": "allocation", "name": "Allocation" },
  { "code": "mentor", "name": "Mentor Profile" },
  { "code": "lms", "name": "LMS Dashboard" },
  { "code": "lms_management", "name": "LMS Management" },
  { "code": "my_learning", "name": "My Learning" },
  { "code": "attendance", "name": "Attendance Dashboard" },
  { "code": "attendance_management", "name": "Attendance Management" },
  { "code": "my_attendance", "name": "My Attendance" },
  { "code": "task", "name": "Task Dashboard" },
  { "code": "task_management", "name": "Task Management" },
  { "code": "my_tasks", "name": "My Tasks" },
  { "code": "assessment", "name": "Assessment Dashboard" },
  { "code": "assessment_management", "name": "Assessment Management" },
  { "code": "my_assessments", "name": "My Assessments" },
  { "code": "submission", "name": "Submissions" },
  { "code": "performance", "name": "Performance" },
  { "code": "college_coordinator", "name": "College Coordinator" },
  { "code": "common_file", "name": "Common Files" },
  { "code": "reporting_manager", "name": "Reporting Manager" },
  { "code": "leave", "name": "Leave Management" },
  { "code": "activity", "name": "Activity Tracking" },
  { "code": "escalation", "name": "Escalation Engine" },
  { "code": "payment", "name": "Payment Management" },
  { "code": "fee", "name": "Fee Structure" },
  { "code": "billing", "name": "Invoice & Receipt" },
  { "code": "wallet", "name": "Internship Wallet" },
  { "code": "finance", "name": "Finance Dashboard" },
  { "code": "finance_analytics", "name": "Revenue Analytics" },
  { "code": "notification", "name": "Notification Center" },
  { "code": "announcement", "name": "Announcement Management" },
  { "code": "communication", "name": "Communication Center" },
  { "code": "calendar", "name": "Calendar & Scheduler" },
  { "code": "email", "name": "Email & Template Management" },
  { "code": "certificate", "name": "Certificate Management" },
  { "code": "college_certificates", "name": "College Certificate Dashboard" },
  { "code": "document", "name": "Document Generation" },
  { "code": "placement", "name": "Placement & Hiring" },
  { "code": "alumni", "name": "Alumni Management" },
  { "code": "analytics", "name": "Analytics Dashboard" },
  { "code": "reports", "name": "Report Center" },
  { "code": "kpi", "name": "KPI Management" },
  { "code": "executive", "name": "Executive Dashboard" },
  { "code": "export", "name": "Data Export Center" },
  { "code": "helpdesk", "name": "Help Desk / Tickets" },
  { "code": "idcard", "name": "Digital ID Card" },
  { "code": "selfservice", "name": "Self-Service Portal" },
  { "code": "productivity", "name": "Productivity Center" },
  { "code": "super_admin", "name": "Super Admin Settings" }
]
    
    for mod in modules_to_seed:
        result = await db.execute(select(Module).where(Module.code == mod["code"]))
        if not result.scalars().first():
            db.add(Module(name=mod["name"], code=mod["code"], description=f"{mod['name']} Module"))
            
    await db.commit()
    print("Modules seeded successfully.")

async def seed_roles(db: AsyncSession):
    roles = [
        {"name": "Admin", "code": "ADMIN", "description": "Administrator with system access"},
        {"name": "Student", "code": "STUDENT", "description": "Standard student role"},
        {"name": "Teacher", "code": "TEACHER", "description": "Standard teacher role"},
        {"name": "HR", "code": "HR", "description": "Human Resources role"}
    ]
    from app.models.rbac.role import Role
    for r in roles:
        result = await db.execute(select(Role).where(Role.code == r["code"]))
        if not result.scalars().first():
            db.add(Role(name=r["name"], code=r["code"], description=r["description"]))
            
    await db.commit()
    print("Additional roles seeded successfully.")

async def main():
    async with AsyncSessionLocal() as session:
        await seed_reference_data(session)
        await seed_super_admin(session)
        await seed_modules(session)
        await seed_roles(session)

if __name__ == "__main__":
    asyncio.run(main())
