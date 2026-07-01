from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_permission
from app.core.responses import success_response, APIResponse
from app.core.schemas import PaginatedResponse, SearchParams
from app.modules.rbac.schemas import RoleCreate, RoleUpdate, RoleResponse, PermissionAssign
from app.modules.rbac.service import RoleService
from app.models.authentication.user import User

router = APIRouter()

@router.post("/roles/search", response_model=APIResponse[PaginatedResponse])
async def search_roles(
    params: SearchParams,
    current_user: User = Depends(require_permission("roles", "read")),
    db: AsyncSession = Depends(get_db)
):
    service = RoleService(db)
    result = await service.search_paginated(params)
    return success_response(data=result.model_dump())

@router.post("/roles", response_model=APIResponse[RoleResponse])
async def create_role(
    data: RoleCreate,
    current_user: User = Depends(require_permission("roles", "create")),
    db: AsyncSession = Depends(get_db)
):
    service = RoleService(db)
    result = await service.create(obj_in=data, user_id=current_user.id)
    role_data = RoleResponse(
        id=result.id,
        name=result.name,
        code=result.code,
        description=result.description,
        is_system_role=result.is_system_role
    )
    return success_response(data=role_data.model_dump(), message="Role created successfully")

@router.post("/roles/assign-permissions", response_model=APIResponse[dict])
async def assign_permissions(
    data: PermissionAssign,
    current_user: User = Depends(require_permission("roles", "update")),
    db: AsyncSession = Depends(get_db)
):
    service = RoleService(db)
    result = await service.assign_permissions(data, user_id=current_user.id)
    return success_response(data=result, message="Permissions assigned successfully")
