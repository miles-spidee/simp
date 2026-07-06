from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_permission
from app.core.responses import success_response, APIResponse
from app.core.schemas import PaginatedResponse, SearchParams
from app.modules.rbac.schemas import (
    RoleCreate,
    RoleCreateWithModules,
    RoleUpdate,
    RoleUpdateWithModules,
    RoleResponse,
    PermissionAssign,
)
from app.modules.rbac.service import RoleService
from app.models.authentication.user import User

router = APIRouter()

from app.modules.rbac.module_router import router as module_api_router

router.include_router(module_api_router, prefix="/modules", tags=["RBAC Modules"])


@router.post("/roles/search", response_model=APIResponse[dict])
async def search_roles(
    params: SearchParams,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.modules.identity.repository import PermissionRepository
    repo = PermissionRepository(db)
    has_roles = await repo.user_has_permission(db, current_user.id, "roles.view")
    has_users = await repo.user_has_permission(db, current_user.id, "users.create")
    if not has_roles and not has_users:
        raise HTTPException(status_code=403, detail="Permission denied: requires roles.view or users.create")
    service = RoleService(db)
    result = await service.search_paginated(params, current_user=current_user)

    from sqlalchemy import select, func
    from app.models.rbac.role_permission import RolePermission
    from app.models.rbac.permission import Permission
    from app.models.rbac.feature import Feature
    from app.models.rbac.module import Module
    from app.models.rbac.user_role import UserRole

    role_ids = [item.id for item in result.items]
    new_items = []

    if role_ids:
        role_modules_result = await db.execute(
            select(RolePermission.role_id, Feature.module_id)
            .join(Permission, RolePermission.permission_id == Permission.id)
            .join(Feature, Permission.feature_id == Feature.id)
            .where(RolePermission.role_id.in_(role_ids))
        )
        role_modules = {}
        for r_id, m_id in role_modules_result:
            r_id_str = str(r_id)
            if r_id_str not in role_modules:
                role_modules[r_id_str] = set()
            role_modules[r_id_str].add(str(m_id))

        # Get user counts for each role
        user_counts_result = await db.execute(
            select(UserRole.role_id, func.count(UserRole.user_id))
            .where(UserRole.role_id.in_(role_ids))
            .group_by(UserRole.role_id)
        )
        user_counts = {str(r_id): count for r_id, count in user_counts_result}

        all_module_ids = []
        if any(item.code == "SUPER_ADMIN" for item in result.items):
            all_modules = await db.execute(select(Module.id))
            all_module_ids = [str(m) for m in all_modules.scalars().all()]

        for r in result.items:
            r_dict = {
                "id": str(r.id),
                "name": r.name,
                "code": r.code,
                "description": r.description,
                "is_system": r.is_system,
                "is_active": r.is_active,
                "icon": r.icon,
                "moduleIds": all_module_ids
                if r.code == "SUPER_ADMIN"
                else sorted(list(role_modules.get(str(r.id), set()))),
                "usersCount": user_counts.get(str(r.id), 0),
            }
            new_items.append(r_dict)

    res_dict = result.model_dump()
    res_dict["items"] = new_items
    return success_response(data=res_dict)


@router.post("/roles", response_model=APIResponse[dict])
async def create_role(
    data: RoleCreateWithModules,
    current_user: User = Depends(require_permission("roles", "create")),
    db: AsyncSession = Depends(get_db),
):
    service = RoleService(db)

    # Validate role name and code uniqueness
    existing_role_name = await service.get_by_name(data.name)
    if existing_role_name:
        raise HTTPException(status_code=400, detail="Role name already exists")

    existing_role_code = await service.get_by_code(data.code)
    if existing_role_code:
        raise HTTPException(status_code=400, detail="Role code already exists")

    role_create = RoleCreate(
        name=data.name,
        code=data.code,
        description=data.description,
        is_system=data.is_system,
        is_active=data.is_active,
        icon=data.icon,
    )
    result = await service.create(obj_in=role_create, user_id=current_user.id)

    if data.module_ids is not None:
        await service.assign_modules(result.id, data.module_ids, current_user.id)

    role_data = {
        "id": str(result.id),
        "name": result.name,
        "code": result.code,
        "description": result.description,
        "is_system": result.is_system,
        "is_active": result.is_active,
        "icon": result.icon,
        "moduleIds": [str(m) for m in data.module_ids] if data.module_ids else [],
    }
    return success_response(data=role_data, message="Role created successfully")


@router.post("/roles/assign-permissions", response_model=APIResponse[dict])
async def assign_permissions(
    data: PermissionAssign,
    current_user: User = Depends(require_permission("roles", "update")),
    db: AsyncSession = Depends(get_db),
):
    service = RoleService(db)
    result = await service.assign_permissions(data, user_id=current_user.id)
    return success_response(data=result, message="Permissions assigned successfully")


@router.get("/roles", response_model=APIResponse[dict])
async def get_roles(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from app.modules.identity.repository import PermissionRepository
    repo = PermissionRepository(db)
    has_roles = await repo.user_has_permission(db, current_user.id, "roles.view")
    has_users = await repo.user_has_permission(db, current_user.id, "users.create")
    if not has_roles and not has_users:
        raise HTTPException(status_code=403, detail="Permission denied: requires roles.view or users.create")
    from sqlalchemy import select
    from app.models.rbac.role import Role
    from app.models.rbac.role_permission import RolePermission
    from app.models.rbac.permission import Permission
    from app.models.rbac.feature import Feature
    from app.models.rbac.module import Module

    result = await db.execute(select(Role))
    roles = result.scalars().all()

    role_modules_result = await db.execute(
        select(RolePermission.role_id, Feature.module_id)
        .join(Permission, RolePermission.permission_id == Permission.id)
        .join(Feature, Permission.feature_id == Feature.id)
    )

    role_modules = {}
    for r_id, m_id in role_modules_result:
        r_id_str = str(r_id)
        if r_id_str not in role_modules:
            role_modules[r_id_str] = set()
        role_modules[r_id_str].add(str(m_id))

    all_module_ids = []
    if any(r.code == "SUPER_ADMIN" for r in roles):
        all_modules = await db.execute(select(Module.id))
        all_module_ids = [str(m) for m in all_modules.scalars().all()]

    data = [
        {
            "id": str(r.id),
            "name": r.name,
            "code": r.code,
            "description": r.description,
            "permissions": ["all"] if r.code == "SUPER_ADMIN" else [],
            "moduleIds": all_module_ids
            if r.code == "SUPER_ADMIN"
            else list(role_modules.get(str(r.id), [])),
        }
        for r in roles
    ]
    return success_response(data=data)


@router.get("/roles/{id}", response_model=APIResponse[dict])
async def get_role(
    id: UUID, 
    current_user: User = Depends(require_permission("roles", "read")),
    db: AsyncSession = Depends(get_db)
):
    service = RoleService(db)
    result = await service.get(id)

    from sqlalchemy import select, func
    from app.models.rbac.role_permission import RolePermission
    from app.models.rbac.permission import Permission
    from app.models.rbac.feature import Feature
    from app.models.rbac.module import Module
    from app.models.rbac.user_role import UserRole

    if result.code == "SUPER_ADMIN":
        all_modules = await db.execute(select(Module.id))
        module_ids = [str(m) for m in all_modules.scalars().all()]
    else:
        role_modules_result = await db.execute(
            select(Feature.module_id)
            .select_from(RolePermission)
            .join(Permission, RolePermission.permission_id == Permission.id)
            .join(Feature, Permission.feature_id == Feature.id)
            .where(RolePermission.role_id == id)
        )
        module_ids = list({str(m) for m in role_modules_result.scalars().all()})

    # Get user count for this role
    user_count_result = await db.execute(
        select(func.count(UserRole.user_id)).where(UserRole.role_id == id)
    )
    users_count = user_count_result.scalar() or 0

    data = {
        "id": str(result.id),
        "name": result.name,
        "code": result.code,
        "description": result.description,
        "is_system": result.is_system,
        "is_active": result.is_active,
        "icon": result.icon,
        "permissions": ["all"] if result.code == "SUPER_ADMIN" else [],
        "moduleIds": module_ids,
        "usersCount": users_count,
    }
    return success_response(data=data)


@router.patch("/roles/{id}", response_model=APIResponse[dict])
async def update_role(
    id: UUID,
    data: RoleUpdateWithModules,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("roles", "update")),
):
    service = RoleService(db)

    # Validate role name uniqueness if being updated
    if data.name:
        existing_role = await service.get_by_name(data.name)
        if existing_role and existing_role.id != id:
            raise HTTPException(status_code=400, detail="Role name already exists")

    role_update = RoleUpdate(
        name=data.name, description=data.description, is_active=data.is_active, icon=data.icon
    )
    result = await service.update(id=id, obj_in=role_update, user_id=current_user.id)

    if data.module_ids is not None:
        await service.assign_modules(result.id, data.module_ids, current_user.id)

    response_data = {
        "id": str(result.id),
        "name": result.name,
        "code": result.code,
        "description": result.description,
        "is_system": result.is_system,
        "is_active": result.is_active,
        "icon": result.icon,
        "moduleIds": [str(m) for m in data.module_ids] if data.module_ids is not None else [],
    }
    return success_response(data=response_data, message="Role updated successfully")


@router.delete("/roles/{id}", response_model=APIResponse[dict])
async def delete_role(
    id: UUID, 
    current_user: User = Depends(require_permission("roles", "delete")),
    db: AsyncSession = Depends(get_db)
):
    from sqlalchemy import select, func
    from app.models.rbac.user_role import UserRole
    from app.models.rbac.role import Role

    service = RoleService(db)

    # Check if role is a system role
    role = await service.get(id)
    if role.is_system:
        raise HTTPException(status_code=400, detail="Cannot delete system role")

    # Check if role has assigned users
    user_count_result = await db.execute(
        select(func.count(UserRole.user_id)).where(UserRole.role_id == id)
    )
    users_count = user_count_result.scalar() or 0

    if users_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete role with {users_count} assigned users. Reassign or remove users first.",
        )

    await service.delete(id=id)
    return success_response(data={"deleted": True}, message="Role deleted successfully")
