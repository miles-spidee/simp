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

from app.modules.rbac.module_router import router as module_api_router
router.include_router(module_api_router, prefix="/modules", tags=["RBAC Modules"])

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
        is_system=result.is_system
    )
    return success_response(data=role_data.model_dump(), message="Role created successfully")

@router.post("/roles/assign-permissions", response_model=APIResponse[dict])
async def assign_permissions(
    data: PermissionAssign,
    # current_user: User = Depends(require_permission("roles", "update")),
    db: AsyncSession = Depends(get_db)
):
    service = RoleService(db)
    # Using dummy user_id if current_user is omitted for testing
    result = await service.assign_permissions(data, user_id=None)
    return success_response(data=result, message="Permissions assigned successfully")

@router.get("/roles", response_model=APIResponse[dict])
async def get_roles(
    db: AsyncSession = Depends(get_db)
):
    from sqlalchemy import select
    from app.models.rbac.role import Role
    result = await db.execute(select(Role))
    roles = result.scalars().all()
    data = [
        {
            "id": str(r.id),
            "name": r.name,
            "code": r.code,
            "description": r.description,
            "permissions": ["all"] if r.code == "SUPER_ADMIN" else [],
            "moduleIds": []
        } for r in roles
    ]
    return success_response(data=data)

@router.get("/roles/{id}", response_model=APIResponse[dict])
async def get_role(
    id: UUID,
    db: AsyncSession = Depends(get_db)
):
    service = RoleService(db)
    result = await service.get(id)
    data = {
        "id": str(result.id),
        "name": result.name,
        "code": result.code,
        "description": result.description,
        "permissions": ["all"] if result.code == "SUPER_ADMIN" else [],
        "moduleIds": []
    }
    return success_response(data=data)

@router.patch("/roles/{id}", response_model=APIResponse[dict])
async def update_role(
    id: UUID,
    data: RoleUpdate,
    db: AsyncSession = Depends(get_db)
):
    service = RoleService(db)
    result = await service.update(id=id, obj_in=data)
    data = {
        "id": str(result.id),
        "name": result.name,
        "code": result.code,
        "description": result.description
    }
    return success_response(data=data, message="Role updated successfully")

@router.delete("/roles/{id}", response_model=APIResponse[dict])
async def delete_role(
    id: UUID,
    db: AsyncSession = Depends(get_db)
):
    service = RoleService(db)
    await service.delete(id=id)
    return success_response(data={"deleted": True}, message="Role deleted successfully")
