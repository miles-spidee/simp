from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_permission
from app.core.responses import APIResponse, success_response

from app.models.authentication.user import User

from app.modules.allocation.schemas import (
    AllocationCreate,
    AllocationUpdate,
    AllocationResponse,
)

from app.modules.allocation.service import AllocationService

router = APIRouter()

@router.post("/sync-applications", response_model=APIResponse[dict])
async def sync_applications(
    current_user: User = Depends(require_permission("allocation", "create")),
    db: AsyncSession = Depends(get_db),
):
    service = AllocationService(db)
    added = await service.sync_student_programs_from_applications()
    return success_response(
        data={"added": added},
        message=f"Successfully mapped {added} students to programs.",
    )

@router.get("/", response_model=APIResponse[list[AllocationResponse]])
async def get_allocations(
    target_type: Optional[str] = Query(None),
    target_id: Optional[UUID] = Query(None),
    current_user: User = Depends(require_permission("allocation", "read")),
    db: AsyncSession = Depends(get_db),
):
    service = AllocationService(db)
    allocations = await service.get_allocations(target_type, target_id)
    return success_response(data=[AllocationResponse.model_validate(a) for a in allocations])

@router.post("/", response_model=APIResponse[AllocationResponse])
async def create_allocation(
    payload: AllocationCreate,
    current_user: User = Depends(require_permission("allocation", "create")),
    db: AsyncSession = Depends(get_db),
):
    service = AllocationService(db)
    allocation = await service.create_allocation(payload, current_user.id)
    return success_response(
        data=AllocationResponse.model_validate(allocation),
        message="Allocation created successfully",
    )

@router.put("/{allocation_id}", response_model=APIResponse[AllocationResponse])
async def update_allocation(
    allocation_id: UUID,
    payload: AllocationUpdate,
    current_user: User = Depends(require_permission("allocation", "update")),
    db: AsyncSession = Depends(get_db),
):
    service = AllocationService(db)
    allocation = await service.update_allocation(allocation_id, payload, current_user.id)
    return success_response(
        data=AllocationResponse.model_validate(allocation),
        message="Allocation updated successfully",
    )

@router.delete("/{allocation_id}", response_model=APIResponse[dict])
async def delete_allocation(
    allocation_id: UUID,
    current_user: User = Depends(require_permission("allocation", "delete")),
    db: AsyncSession = Depends(get_db),
):
    service = AllocationService(db)
    await service.delete_allocation(allocation_id, current_user.id)
    return success_response(
        data={},
        message="Allocation deleted successfully",
    )