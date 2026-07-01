from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from typing import List
from app.core.database import get_db
from app.core.dependencies import require_permission
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
    status: str = 'active'
    active: bool = True

class ModuleUpdate(BaseModel):
    name: str = None
    code: str = None
    description: str = None
    icon: str = None
    route: str = None
    status: str = None
    active: bool = None

@router.get("/", response_model=APIResponse[List[dict]])
async def get_modules(
    # current_user: User = Depends(require_permission("modules", "read")),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Module))
    modules = result.scalars().all()
    # Serialize to match frontend expected Module interface
    data = [
        {
            "id": str(m.id),
            "name": m.name,
            "code": m.code,
            "description": m.description,
            "active": True # Add active flag if needed
        }
        for m in modules
    ]
    return success_response(data=data)

@router.get("/{id}", response_model=APIResponse[dict])
async def get_module(
    id: UUID,
    # current_user: User = Depends(require_permission("modules", "read")),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Module).where(Module.id == id))
    m = result.scalars().first()
    if not m:
        raise HTTPException(status_code=404, detail="Module not found")
    data = {
        "id": str(m.id),
        "name": m.name,
        "code": m.code,
        "description": m.description,
        "active": True
    }
    return success_response(data=data)

@router.post("/", response_model=APIResponse[dict])
async def create_module(
    data: ModuleCreate,
    # current_user: User = Depends(require_permission("modules", "create")),
    db: AsyncSession = Depends(get_db)
):
    m = Module(
        name=data.name,
        code=data.code,
        description=data.description
    )
    db.add(m)
    await db.commit()
    await db.refresh(m)
    res_data = {
        "id": str(m.id),
        "name": m.name,
        "code": m.code,
        "description": m.description,
        "active": True
    }
    return success_response(data=res_data, message="Module created successfully")

@router.patch("/{id}", response_model=APIResponse[dict])
async def update_module(
    id: UUID,
    data: ModuleUpdate,
    # current_user: User = Depends(require_permission("modules", "update")),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Module).where(Module.id == id))
    m = result.scalars().first()
    if not m:
        raise HTTPException(status_code=404, detail="Module not found")
    
    if data.name is not None: m.name = data.name
    if data.code is not None: m.code = data.code
    if data.description is not None: m.description = data.description

    await db.commit()
    await db.refresh(m)
    res_data = {
        "id": str(m.id),
        "name": m.name,
        "code": m.code,
        "description": m.description,
        "active": True
    }
    return success_response(data=res_data, message="Module updated successfully")

@router.delete("/{id}", response_model=APIResponse[dict])
async def delete_module(
    id: UUID,
    # current_user: User = Depends(require_permission("modules", "delete")),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Module).where(Module.id == id))
    m = result.scalars().first()
    if not m:
        raise HTTPException(status_code=404, detail="Module not found")
    
    await db.delete(m)
    await db.commit()
    
    return success_response(data={"deleted": True}, message="Module deleted successfully")
