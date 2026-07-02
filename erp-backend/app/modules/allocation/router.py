from uuid import UUID

from fastapi import APIRouter, Depends
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


@router.get("/", response_model=APIResponse[list[AllocationResponse]])
async def get_allocations(
    current_user: User = Depends(require_permission("allocation", "read")),
    db: AsyncSession = Depends(get_db),
):
    service = AllocationService(db)

    allocations = await service.get_allocations()

    data = [
        AllocationResponse(
            allocation_id=item.id,
            student_profile_id=item.student_profile_id,
            mentor_profile_id=item.mentor_profile_id,
            opportunity_id=item.opportunity_id,
            start_date=item.start_date,
            end_date=item.end_date,
            status=item.status,
            created_at=item.created_at.isoformat() if item.created_at else "",
            updated_at=item.updated_at.isoformat() if item.updated_at else "",
        )
        for item in allocations
    ]

    return success_response(data=data)


@router.get("/{allocation_id}", response_model=APIResponse[AllocationResponse])
async def get_allocation(
    allocation_id: UUID,
    current_user: User = Depends(require_permission("allocation", "read")),
    db: AsyncSession = Depends(get_db),
):
    service = AllocationService(db)

    item = await service.get_allocation(allocation_id)

    response = AllocationResponse(
        allocation_id=item.id,
        student_profile_id=item.student_profile_id,
        mentor_profile_id=item.mentor_profile_id,
        opportunity_id=item.opportunity_id,
        start_date=item.start_date,
        end_date=item.end_date,
        status=item.status,
        created_at=item.created_at.isoformat() if item.created_at else "",
        updated_at=item.updated_at.isoformat() if item.updated_at else "",
    )

    return success_response(data=response)


@router.post("/", response_model=APIResponse[AllocationResponse])
async def create_allocation(
    payload: AllocationCreate,
    current_user: User = Depends(require_permission("allocation", "create")),
    db: AsyncSession = Depends(get_db),
):
    service = AllocationService(db)

    allocation = await service.create_allocation(
        payload,
        current_user.id,
    )

    response = AllocationResponse(
        allocation_id=allocation.id,
        student_profile_id=allocation.student_profile_id,
        mentor_profile_id=allocation.mentor_profile_id,
        opportunity_id=allocation.opportunity_id,
        start_date=allocation.start_date,
        end_date=allocation.end_date,
        status=allocation.status,
        created_at=allocation.created_at.isoformat() if allocation.created_at else "",
        updated_at=allocation.updated_at.isoformat() if allocation.updated_at else "",
    )

    return success_response(
        data=response,
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

    allocation = await service.update_allocation(
        allocation_id,
        payload,
        current_user.id,
    )

    response = AllocationResponse(
        allocation_id=allocation.id,
        student_profile_id=allocation.student_profile_id,
        mentor_profile_id=allocation.mentor_profile_id,
        opportunity_id=allocation.opportunity_id,
        start_date=allocation.start_date,
        end_date=allocation.end_date,
        status=allocation.status,
        created_at=allocation.created_at.isoformat() if allocation.created_at else "",
        updated_at=allocation.updated_at.isoformat() if allocation.updated_at else "",
    )

    return success_response(
        data=response,
        message="Allocation updated successfully",
    )


@router.delete("/{allocation_id}", response_model=APIResponse[dict])
async def delete_allocation(
    allocation_id: UUID,
    current_user: User = Depends(require_permission("allocation", "delete")),
    db: AsyncSession = Depends(get_db),
):
    service = AllocationService(db)

    await service.delete_allocation(
        allocation_id,
        current_user.id,
    )

    return success_response(
        data={},
        message="Allocation deleted successfully",
    )