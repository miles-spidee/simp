from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_permission
from app.core.responses import success_response, APIResponse
from app.core.schemas import PaginatedResponse, SearchParams
from app.modules.users.schemas import UserCreate, UserUpdate, UserResponse
from app.modules.users.service import UserService
from app.models.authentication.user import User

router = APIRouter()

@router.post("/search", response_model=APIResponse[PaginatedResponse])
async def search_users(
    params: SearchParams,
    current_user: User = Depends(require_permission("users", "read")),
    db: AsyncSession = Depends(get_db)
):
    service = UserService(db)
    result = await service.search_paginated(params)
    
    # Fetch roles for all users in the page
    from app.models.rbac.user_role import UserRole
    from app.models.rbac.role import Role
    from sqlalchemy import select
    
    user_ids = [user.id for user in result.items]
    roles_map = {}
    if user_ids:
        roles_query = await db.execute(
            select(UserRole.user_id, Role.id, Role.name)
            .join(Role, UserRole.role_id == Role.id)
            .where(UserRole.user_id.in_(user_ids))
        )
        for row in roles_query:
            roles_map[row[0]] = {"roleId": row[1], "roleName": row[2]}
            
    # Serialize items
    items_dump = []
    for user in result.items:
        user_dict = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "account_status": user.account_status,
            "created_at": user.created_at,
        }
        role_info = roles_map.get(user.id)
        if role_info:
            user_dict["roleId"] = role_info["roleId"]
            user_dict["roleName"] = role_info["roleName"]
        items_dump.append(user_dict)
        
    return success_response(data={
        "items": items_dump,
        "total": result.total,
        "page": result.page,
        "page_size": result.page_size,
        "total_pages": result.total_pages
    })

@router.get("/patch-db-temp")
async def patch_db_temp(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import text
    try:
        await db.execute(text("ALTER TABLE auth_users ADD COLUMN IF NOT EXISTS force_password_change BOOLEAN NOT NULL DEFAULT FALSE;"))
        await db.commit()
        return {"status": "patched"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

@router.post("/", response_model=APIResponse[UserResponse])
async def create_user(
    data: UserCreate,
    current_user: User = Depends(require_permission("users", "create")),
    db: AsyncSession = Depends(get_db)
):
    service = UserService(db)
    result = await service.create(obj_in=data, user_id=current_user.id)
    
    from sqlalchemy import select
    from app.models.rbac.user_role import UserRole
    from app.models.rbac.role import Role
    from app.models.rbac.user_module import UserModule
    
    # Fetch Role
    role_query = await db.execute(
        select(Role.id, Role.name)
        .join(UserRole, UserRole.role_id == Role.id)
        .where(UserRole.user_id == result.id)
    )
    role_row = role_query.first()
    
    # Fetch Module Overrides
    module_query = await db.execute(select(UserModule.module_id).where(UserModule.user_id == result.id))
    module_overrides = [m for m in module_query.scalars().all()]
    
    # Serialize for response
    user_data = UserResponse(
        id=result.id,
        username=result.username,
        email=result.email,
        account_status=result.account_status,
        roleId=role_row[0] if role_row else None,
        roleName=role_row[1] if role_row else None,
        moduleOverrides=module_overrides if module_overrides else []
    )
    return success_response(data=user_data.model_dump(), message="User created successfully")

@router.get("/{id}", response_model=APIResponse[UserResponse])
async def get_user(
    id: UUID,
    current_user: User = Depends(require_permission("users", "read")),
    db: AsyncSession = Depends(get_db)
):
    service = UserService(db)
    result = await service.get(id)
    
    from sqlalchemy import select
    from app.models.rbac.user_role import UserRole
    from app.models.rbac.role import Role
    from app.models.rbac.user_module import UserModule
    
    # Fetch Role
    role_query = await db.execute(
        select(Role.id, Role.name)
        .join(UserRole, UserRole.role_id == Role.id)
        .where(UserRole.user_id == id)
    )
    role_row = role_query.first()
    
    # Fetch Module Overrides
    module_query = await db.execute(select(UserModule.module_id).where(UserModule.user_id == id))
    module_overrides = [m for m in module_query.scalars().all()]
    
    user_data = UserResponse(
        id=result.id,
        username=result.username,
        email=result.email,
        account_status=result.account_status,
        roleId=role_row[0] if role_row else None,
        roleName=role_row[1] if role_row else None,
        moduleOverrides=module_overrides if module_overrides else []
    )
    return success_response(data=user_data.model_dump())

@router.patch("/{id}", response_model=APIResponse[UserResponse])
async def update_user(
    id: UUID,
    data: UserUpdate,
    current_user: User = Depends(require_permission("users", "update")),
    db: AsyncSession = Depends(get_db)
):
    service = UserService(db)
    result = await service.update(id=id, obj_in=data, user_id=current_user.id)
    
    from sqlalchemy import select
    from app.models.rbac.user_role import UserRole
    from app.models.rbac.role import Role
    from app.models.rbac.user_module import UserModule
    
    # Fetch Role
    role_query = await db.execute(
        select(Role.id, Role.name)
        .join(UserRole, UserRole.role_id == Role.id)
        .where(UserRole.user_id == id)
    )
    role_row = role_query.first()
    
    # Fetch Module Overrides
    module_query = await db.execute(select(UserModule.module_id).where(UserModule.user_id == id))
    module_overrides = [m for m in module_query.scalars().all()]
    
    user_data = UserResponse(
        id=result.id,
        username=result.username,
        email=result.email,
        account_status=result.account_status,
        roleId=role_row[0] if role_row else None,
        roleName=role_row[1] if role_row else None,
        moduleOverrides=module_overrides if module_overrides else []
    )
    return success_response(data=user_data.model_dump(), message="User updated successfully")

@router.post("/{id}/lock", response_model=APIResponse[UserResponse])
async def lock_user_account(
    id: UUID,
    current_user: User = Depends(require_permission("users", "update")),
    db: AsyncSession = Depends(get_db)
):
    service = UserService(db)
    result = await service.lock_account(id, current_user.id)
    user_data = UserResponse(
        id=result.id,
        username=result.username,
        email=result.email,
        account_status=result.account_status
    )
    return success_response(data=user_data.model_dump(), message="Account locked successfully")

@router.delete("/{id}", response_model=APIResponse[dict])
async def delete_user(
    id: UUID,
    current_user: User = Depends(require_permission("users", "delete")),
    db: AsyncSession = Depends(get_db)
):
    service = UserService(db)
    await service.delete(id=id, user_id=current_user.id)
    return success_response(data={"deleted": True}, message="User deleted successfully")

@router.get("/registered/employees", response_model=APIResponse[list])
async def get_registered_employees(
    current_user: User = Depends(require_permission("users", "read")),
    db: AsyncSession = Depends(get_db)
):
    from sqlalchemy import select
    from app.models.profiles.employee_profile import EmployeeProfile
    from app.models.authentication.user import User
    
    query = select(EmployeeProfile.id, EmployeeProfile.first_name, EmployeeProfile.last_name, EmployeeProfile.email, EmployeeProfile.phone, EmployeeProfile.employee_code, EmployeeProfile.department_id, EmployeeProfile.designation, EmployeeProfile.user_id, User.username).outerjoin(User, EmployeeProfile.user_id == User.id)
    result = await db.execute(query)
    
    items = []
    for row in result:
        items.append({
            "id": row.id,
            "name": f"{row.first_name} {row.last_name}",
            "email": row.email,
            "phone": row.phone,
            "employee_code": row.employee_code,
            "department_id": row.department_id,
            "designation": row.designation,
            "has_account": row.user_id is not None,
            "username": row.username,
            "account_status": "Linked" if row.user_id else "No Account"
        })
        
    return success_response(data=items)

@router.get("/registered/students", response_model=APIResponse[list])
async def get_registered_students(
    current_user: User = Depends(require_permission("users", "read")),
    db: AsyncSession = Depends(get_db)
):
    from sqlalchemy import select
    from app.models.profiles.student_profile import StudentProfile
    from app.models.authentication.user import User
    
    query = select(StudentProfile.id, StudentProfile.enrollment_number, StudentProfile.user_id, User.username, User.email).outerjoin(User, StudentProfile.user_id == User.id)
    result = await db.execute(query)
    
    items = []
    for row in result:
        items.append({
            "id": row.id,
            "enrollment_number": row.enrollment_number,
            "email": getattr(row, 'email', None),
            "has_account": row.user_id is not None,
            "username": getattr(row, 'username', None),
            "account_status": "Linked" if row.user_id else "No Account"
        })
        
    return success_response(data=items)

@router.get("/registered/organizations", response_model=APIResponse[list])
async def get_registered_organizations(
    current_user: User = Depends(require_permission("users", "read")),
    db: AsyncSession = Depends(get_db)
):
    from sqlalchemy import select
    from app.models.organizations.organization import Organization
    from app.models.authentication.user import User
    
    query = select(Organization.id, Organization.name, Organization.code, Organization.email, Organization.phone, Organization.user_id, User.username).outerjoin(User, Organization.user_id == User.id)
    result = await db.execute(query)
    
    items = []
    for row in result:
        items.append({
            "id": row.id,
            "name": row.name,
            "code": row.code,
            "email": row.email,
            "phone": row.phone,
            "has_account": getattr(row, 'user_id', None) is not None,
            "username": getattr(row, 'username', None),
            "account_status": "Linked" if getattr(row, 'user_id', None) else "No Account"
        })
        
    return success_response(data=items)

@router.get("/registered/{entity_type}/{id}", response_model=APIResponse[dict])
async def get_registered_entity(
    entity_type: str,
    id: UUID,
    current_user: User = Depends(require_permission("users", "read")),
    db: AsyncSession = Depends(get_db)
):
    from sqlalchemy import select
    from fastapi import HTTPException
    
    if entity_type == "employee":
        from app.models.profiles.employee_profile import EmployeeProfile
        profile = await db.scalar(select(EmployeeProfile).where(EmployeeProfile.id == id))
        if not profile: raise HTTPException(404, "Employee not found")
        return success_response(data={
            "id": profile.id,
            "name": f"{profile.first_name} {profile.last_name}",
            "email": profile.email,
            "phone": profile.phone,
            "department_id": profile.department_id,
            "designation": profile.designation,
            "code": profile.employee_code,
            "has_account": profile.user_id is not None
        })
    elif entity_type == "student":
        from app.models.profiles.student_profile import StudentProfile
        from app.models.authentication.user import User
        query = select(StudentProfile, User).outerjoin(User, StudentProfile.user_id == User.id).where(StudentProfile.id == id)
        result = await db.execute(query)
        row = result.first()
        if not row: raise HTTPException(404, "Student not found")
        profile, user = row
        return success_response(data={
            "id": profile.id,
            "enrollment_number": profile.enrollment_number,
            "email": user.email if user else "",
            "phone": user.phone if user else "",
            "department_id": profile.department_id,
            "has_account": profile.user_id is not None
        })
    elif entity_type == "organization":
        from app.models.organizations.organization import Organization
        profile = await db.scalar(select(Organization).where(Organization.id == id))
        if not profile: raise HTTPException(404, "Organization not found")
        return success_response(data={
            "id": profile.id,
            "name": profile.name,
            "code": profile.code,
            "email": profile.email,
            "phone": profile.phone,
            "has_account": getattr(profile, 'user_id', None) is not None
        })
    else:
        raise HTTPException(400, "Invalid entity type")
