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
    return success_response(data=result.model_dump())

@router.post("/", response_model=APIResponse[UserResponse])
async def create_user(
    data: UserCreate,
    current_user: User = Depends(require_permission("users", "create")),
    db: AsyncSession = Depends(get_db)
):
    service = UserService(db)
    result = await service.create(obj_in=data, user_id=current_user.id)
    # Serialize for response
    user_data = UserResponse(
        id=result.id,
        username=result.username,
        email=result.email,
        account_status=result.account_status
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
    user_data = UserResponse(
        id=result.id,
        username=result.username,
        email=result.email,
        account_status=result.account_status
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
    user_data = UserResponse(
        id=result.id,
        username=result.username,
        email=result.email,
        account_status=result.account_status
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
