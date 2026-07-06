from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from typing import List
from app.core.database import get_db
from app.core.dependencies import require_permission, get_current_user
from app.core.responses import success_response, APIResponse
from app.models.authentication.user import User
from app.models.rbac.module import Module
from pydantic import BaseModel

router = APIRouter()


class ModuleCreate(BaseModel):
    name: str
    code: str
    description: str = None
    icon: str = None
    route: str = None
    status: str = "active"
    active: bool = True


class ModuleUpdate(BaseModel):
    name: str = None
    code: str = None
    description: str = None
    icon: str = None
    route: str = None
    status: str = None
    active: bool = None


def _module_display_id(index: int) -> str:
    return f"MID{index + 1:03d}"


def _serialize_module(module: Module, index: int | None = None) -> dict:
    return {
        "id": str(module.id),
        "displayId": _module_display_id(index) if index is not None else None,
        "name": module.name,
        "code": module.code,
        "description": module.description,
        "desc": module.description,
        "route": module.route_path,
        "active": True,
    }


async def _module_display_index(db: AsyncSession, module_id: UUID) -> int | None:
    result = await db.execute(select(Module.id).order_by(Module.created_at, Module.name))
    ordered_ids = list(result.scalars().all())
    return ordered_ids.index(module_id) if module_id in ordered_ids else None


@router.get("/", response_model=APIResponse[List[dict]])
async def get_modules(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.modules.identity.repository import PermissionRepository
    repo = PermissionRepository(db)
    has_modules = await repo.user_has_permission(db, current_user.id, "MODULE_REGISTRY.view")
    has_users = await repo.user_has_permission(db, current_user.id, "IDENTITY_USER.create")
    if not has_modules and not has_users:
        raise HTTPException(status_code=403, detail="Permission denied: requires modules.view or users.create")
    result = await db.execute(select(Module).order_by(Module.created_at, Module.name))
    modules = result.scalars().all()
    data = [_serialize_module(module, index) for index, module in enumerate(modules)]
    return success_response(data=data)


@router.get("/{id}", response_model=APIResponse[dict])
async def get_module(
    id: UUID,
    current_user: User = Depends(require_permission("modules", "read")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Module).where(Module.id == id))
    module = result.scalars().first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    display_index = await _module_display_index(db, module.id)
    return success_response(data=_serialize_module(module, display_index))


@router.post("/", response_model=APIResponse[dict])
async def create_module(
    data: ModuleCreate,
    current_user: User = Depends(require_permission("modules", "create")),
    db: AsyncSession = Depends(get_db),
):
    module = Module(
        name=data.name,
        code=data.code,
        description=data.description,
        route_path=data.route,
    )
    db.add(module)
    await db.commit()
    await db.refresh(module)

    display_index = await _module_display_index(db, module.id)
    res_data = _serialize_module(module, display_index)
    return success_response(data=res_data, message="Module created successfully")


@router.patch("/{id}", response_model=APIResponse[dict])
async def update_module(
    id: UUID,
    data: ModuleUpdate,
    current_user: User = Depends(require_permission("modules", "update")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Module).where(Module.id == id))
    module = result.scalars().first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    if data.name is not None:
        module.name = data.name
    if data.code is not None:
        module.code = data.code
    if data.description is not None:
        module.description = data.description
    if data.route is not None:
        module.route_path = data.route

    await db.commit()
    await db.refresh(module)

    display_index = await _module_display_index(db, module.id)
    res_data = _serialize_module(module, display_index)
    return success_response(data=res_data, message="Module updated successfully")


@router.delete("/{id}", response_model=APIResponse[dict])
async def delete_module(
    id: UUID,
    current_user: User = Depends(require_permission("modules", "delete")),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Module).where(Module.id == id))
    module = result.scalars().first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    await db.delete(module)
    await db.commit()

    return success_response(data={"deleted": True}, message="Module deleted successfully")
