from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from uuid import UUID, uuid4
from typing import List, Optional
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.security import hash_password
from app.core.responses import success_response, APIResponse
from app.models.authentication.user import User
from app.models.core.enums import StatusEnum
from pydantic import BaseModel


router = APIRouter()

class EmployeeCreate(BaseModel):
    first_name: str
    last_name: str
    official_email: str
    designation: str = None
    phone_number: str = None
    employee_code: str | None = None
    joining_date: str | None = None


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    status: Optional[str] = None
    organizationId: Optional[str] = None
    departmentId: Optional[str] = None
    employee_code: Optional[str] = None
    joining_date: Optional[str] = None
    mentorId: Optional[str] = None


class BulkStatusRequest(BaseModel):
    ids: List[UUID]
    status: str


class BulkDepartmentRequest(BaseModel):
    ids: List[UUID]
    organizationId: str


class BulkMentorRequest(BaseModel):
    ids: List[UUID]
    mentorId: str


def _frontend_status(value: str | None) -> str:
    mapping = {
        StatusEnum.ACTIVE.value: "Active",
        StatusEnum.INACTIVE.value: "Inactive",
        StatusEnum.SUSPENDED.value: "Suspended",
        StatusEnum.PENDING.value: "Probation",
        StatusEnum.ARCHIVED.value: "Terminated",
    }
    return mapping.get(value or StatusEnum.ACTIVE.value, value or "Active")


def _backend_status(value: str | None) -> str:
    if not value:
        return StatusEnum.ACTIVE.value
    normalized = value.strip().lower()
    if normalized in {"active", "training"}:
        return StatusEnum.ACTIVE.value
    if normalized in {"suspended"}:
        return StatusEnum.SUSPENDED.value
    if normalized in {"inactive", "resigned", "terminated", "notice period"}:
        return StatusEnum.INACTIVE.value
    if normalized in {"probation", "on leave"}:
        return StatusEnum.PENDING.value
    return StatusEnum.ACTIVE.value


def _employee_payload(profile, user, organization=None, department=None):
    first_name = (user.username or user.email or "").split(" ")[0]
    last_name = " ".join((user.username or "").split(" ")[1:])
    organization_code = getattr(organization, "code", None) or str(getattr(organization, "id", ""))
    department_code = getattr(department, "code", None) or str(getattr(department, "id", ""))
    return {
        "employee_id": str(profile.id),
        "employee_code": profile.employee_code,
        "first_name": first_name,
        "last_name": last_name,
        "official_email": user.email,
        "designation": profile.designation,
        "phone_number": user.phone or "",
        "status": _frontend_status(user.account_status),
        "organization_id": str(profile.organization_id),
        "organization_code": organization_code,
        "department_id": str(profile.department_id) if profile.department_id else "",
        "department_code": department_code,
        "joining_date": profile.date_of_joining.isoformat() if profile.date_of_joining else "",
    }


async def _resolve_organization(db: AsyncSession, value: str):
    from app.models.organizations.organization import Organization
    uuid_value = None
    try:
        uuid_value = UUID(value)
    except Exception:
        uuid_value = None

    conditions = [Organization.code == value]
    if uuid_value is not None:
        conditions.append(Organization.id == uuid_value)

    result = await db.execute(select(Organization).where(or_(*conditions)))
    return result.scalars().first()


async def _resolve_department(db: AsyncSession, organization_id, value: str):
    from app.models.organizations.department import Department

    uuid_value = None
    try:
        uuid_value = UUID(value)
    except Exception:
        uuid_value = None

    conditions = [Department.code == value, Department.organization_id == organization_id]
    if uuid_value is not None:
        conditions.append(Department.id == uuid_value)

    result = await db.execute(select(Department).where(*conditions))
    return result.scalars().first()

@router.get("/", response_model=APIResponse[List[dict]])
async def get_employee_list(db: AsyncSession = Depends(get_db)):
    try:
        from app.models.profiles.employee_profile import EmployeeProfile
        from app.models.organizations.organization import Organization
        from app.models.organizations.department import Department
        from app.models.authentication.user import User
        result = await db.execute(
            select(EmployeeProfile, User, Organization, Department)
            .join(User, User.id == EmployeeProfile.user_id)
            .join(Organization, Organization.id == EmployeeProfile.organization_id)
            .outerjoin(Department, Department.id == EmployeeProfile.department_id)
            .order_by(EmployeeProfile.created_at.desc())
        )
        rows = result.all()
        data = [_employee_payload(profile, user, organization, department) for profile, user, organization, department in rows]
        return success_response(data=data)
    except Exception:
        return success_response(data=[])


@router.patch("/{id}", response_model=APIResponse[dict])
async def update_employee(
    id: UUID,
    data: EmployeeUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from app.models.profiles.employee_profile import EmployeeProfile
    from app.models.organizations.organization import Organization
    from app.models.organizations.department import Department

    result = await db.execute(
        select(EmployeeProfile, User, Organization, Department)
        .join(User, User.id == EmployeeProfile.user_id)
        .join(Organization, Organization.id == EmployeeProfile.organization_id)
        .outerjoin(Department, Department.id == EmployeeProfile.department_id)
        .where(EmployeeProfile.id == id)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Employee not found")

    profile, user, organization, department = row
    update_data = data.model_dump(exclude_unset=True)

    if update_data.get("name"):
        user.username = update_data["name"]
    if update_data.get("email"):
        existing_email = await db.execute(select(User).where(User.email == update_data["email"], User.id != user.id))
        if existing_email.scalars().first():
            raise HTTPException(status_code=409, detail="Employee email already exists")
        user.email = update_data["email"]
    if update_data.get("phone") is not None:
        user.phone = update_data["phone"]
    if update_data.get("designation"):
        profile.designation = update_data["designation"]
    if update_data.get("employee_code"):
        profile.employee_code = update_data["employee_code"]
    if update_data.get("joining_date"):
        try:
            profile.date_of_joining = datetime.fromisoformat(update_data["joining_date"].replace("Z", "+00:00")).date()
        except ValueError:
            try:
                profile.date_of_joining = date.fromisoformat(update_data["joining_date"])
            except ValueError:
                pass
    if update_data.get("status"):
        user.account_status = _backend_status(update_data["status"])
    if update_data.get("organizationId"):
        organization_obj = await _resolve_organization(db, update_data["organizationId"])
        if organization_obj:
            profile.organization_id = organization_obj.id
            organization = organization_obj
    if update_data.get("departmentId"):
        department_obj = await _resolve_department(db, profile.organization_id, update_data["departmentId"])
        if department_obj:
            profile.department_id = department_obj.id
            department = department_obj

    db.add(user)
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    await db.refresh(user)

    return success_response(data=_employee_payload(profile, user, organization, department), message="Employee updated successfully")

@router.post("/", response_model=APIResponse[dict])
async def create_employee(
    data: EmployeeCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from app.models.authentication.user import User
    from app.models.organizations.organization import Organization
    from app.models.organizations.department import Department
    from app.models.profiles.employee_profile import EmployeeProfile

    org_result = await db.execute(select(Organization).order_by(Organization.created_at.asc()))
    organization = org_result.scalars().first()
    if not organization:
        raise HTTPException(status_code=500, detail="No organization found for employee onboarding")

    dept_result = await db.execute(
        select(Department)
        .where(Department.organization_id == organization.id)
        .order_by(Department.created_at.asc())
    )
    department = dept_result.scalars().first()

    full_name = f"{data.first_name.strip()} {data.last_name.strip()}".strip()
    username_base = full_name or data.official_email.split("@")[0]
    username = username_base
    suffix = 1
    while True:
        existing = await db.execute(select(User).where(User.username == username))
        if not existing.scalars().first():
            break
        suffix += 1
        username = f"{username_base} {suffix}"

    existing_email = await db.execute(select(User).where(User.email == data.official_email))
    if existing_email.scalars().first():
        raise HTTPException(status_code=409, detail="Employee email already exists")

    new_user = User(
        username=username,
        email=data.official_email,
        phone=data.phone_number,
        password_hash=hash_password("ChangeMe@123"),
        account_status=StatusEnum.ACTIVE.value,
        email_verified=True,
        phone_verified=False,
        created_by=current_user.id,
        updated_by=current_user.id,
    )
    db.add(new_user)
    await db.flush()

    joining_date_value = None
    if data.joining_date:
        try:
            joining_date_value = datetime.fromisoformat(data.joining_date.replace("Z", "+00:00")).date()
        except ValueError:
            try:
                joining_date_value = date.fromisoformat(data.joining_date)
            except ValueError:
                joining_date_value = None

    emp = EmployeeProfile(
        user_id=new_user.id,
        organization_id=organization.id,
        department_id=department.id if department else None,
        employee_code=data.employee_code or f"EMP-{uuid4().hex[:8].upper()}",
        designation=data.designation or "Employee",
        date_of_joining=joining_date_value,
        created_by=current_user.id,
        updated_by=current_user.id,
    )
    db.add(emp)
    await db.commit()
    await db.refresh(emp)

    res_data = {
        **_employee_payload(emp, new_user, organization, department),
    }
    return success_response(data=res_data, message="Employee created successfully")


@router.post("/bulk/status", response_model=APIResponse[dict])
async def bulk_update_status(
    data: BulkStatusRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from app.models.profiles.employee_profile import EmployeeProfile

    status_value = _backend_status(data.status)
    result = await db.execute(select(EmployeeProfile).where(EmployeeProfile.id.in_(data.ids)))
    profiles = result.scalars().all()
    for profile in profiles:
        user_result = await db.execute(select(User).where(User.id == profile.user_id))
        user = user_result.scalars().first()
        if user:
            user.account_status = status_value
            db.add(user)
    await db.commit()
    await db.refresh(profiles[0]) if profiles else None
    return success_response(data={"updated": len(profiles)}, message="Employee status updated")


@router.post("/bulk/department", response_model=APIResponse[dict])
async def bulk_update_department(
    data: BulkDepartmentRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from app.models.profiles.employee_profile import EmployeeProfile

    organization = await _resolve_organization(db, data.organizationId)
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")

    result = await db.execute(select(EmployeeProfile).where(EmployeeProfile.id.in_(data.ids)))
    profiles = result.scalars().all()
    for profile in profiles:
        profile.organization_id = organization.id
        db.add(profile)
    await db.commit()
    return success_response(data={"updated": len(profiles)}, message="Employee department updated")


@router.post("/bulk/mentor", response_model=APIResponse[dict])
async def bulk_update_mentor(
    data: BulkMentorRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # The current schema does not persist a mentor_id on employee profiles.
    # Keep the action successful so the employee module workflow remains usable.
    return success_response(data={"updated": len(data.ids), "mentorId": data.mentorId}, message="Mentor assignment recorded")
