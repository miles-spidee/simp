from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_permission, get_current_user
from app.core.responses import APIResponse, success_response

from app.models.authentication.user import User
from app.modules.reporting_manager.schemas import (
    RMBatchResponse,
    RMStudentResponse,
    RMMentorResponse,
)
from app.modules.reporting_manager.service import ReportingManagerService

router = APIRouter()


@router.get("/my-batches", response_model=APIResponse[list[RMBatchResponse]])
async def get_my_batches(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return all batches allocated to the currently logged-in Reporting Manager."""
    service = ReportingManagerService(db)
    
    # ------------------
    
    batches = await service.get_allocated_batches(current_user.id)
    return success_response(data=[RMBatchResponse(**b) for b in batches])


@router.get("/batch/{batch_id}/students", response_model=APIResponse[list[RMStudentResponse]])
async def get_batch_students(
    batch_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return all students enrolled in the given batch."""
    service = ReportingManagerService(db)
    students = await service.get_students_in_batch(current_user.id, batch_id)
    return success_response(data=[RMStudentResponse(**s) for s in students])


@router.get("/batch/{batch_id}/mentors", response_model=APIResponse[list[RMMentorResponse]])
async def get_batch_mentors(
    batch_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return all mentors assigned to students in the given batch."""
    service = ReportingManagerService(db)
    mentors = await service.get_mentors_in_batch(current_user.id, batch_id)
    return success_response(data=[RMMentorResponse(**m) for m in mentors])


# ── Legacy stub endpoints kept for backward compatibility ──────────────────

@router.get("")
async def list_reporting_manager():
    return {"success": True, "message": "reporting_manager listing", "data": []}
