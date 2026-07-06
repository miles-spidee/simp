from sqlalchemy import select
from app.models.profiles.employee_profile import EmployeeProfile
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_permission, get_current_user
from app.core.responses import APIResponse, success_response

from app.models.authentication.user import User

from app.modules.mentor.schemas import (
    MentorProfileCreate,
    MentorProfileUpdate,
    MentorProfileResponse,
)

from app.modules.mentor.service import MentorProfileService

router = APIRouter()


def map_response(profile, employee_name=None):
    return MentorProfileResponse(
        mentor_profile_id=profile.id,
        user_id=profile.user_id,
        employee_profile_id=profile.employee_profile_id,
        expertise=profile.expertise,
        years_of_experience=profile.years_of_experience,
        max_capacity=profile.max_capacity,
        is_available=profile.is_available,
        created_at=profile.created_at.isoformat() if profile.created_at else "",
        updated_at=profile.updated_at.isoformat() if profile.updated_at else "",
        employeeName=employee_name
    )


@router.get("", response_model=APIResponse[list[MentorProfileResponse]])
async def get_mentors(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = MentorProfileService(db)
    mentors = await service.get_multi(current_user=current_user)
    
    # Fetch employee names
    emp_ids = [m.employee_profile_id for m in mentors if m.employee_profile_id]
    emp_map = {}
    if emp_ids:
        res = await db.execute(select(EmployeeProfile).where(EmployeeProfile.id.in_(emp_ids)))
        emps = res.scalars().all()
        emp_map = {e.id: f"{e.first_name} {e.last_name}" for e in emps}

    # Fetch user names for fallback
    user_ids = [m.user_id for m in mentors if m.employee_profile_id not in emp_map]
    user_map = {}
    if user_ids:
        res = await db.execute(select(User).where(User.id.in_(user_ids)))
        users = res.scalars().all()
        user_map = {u.id: u.username for u in users}

    return success_response(
        data=[map_response(m, emp_map.get(m.employee_profile_id) or user_map.get(m.user_id) or "Unknown Mentor") for m in mentors]
    )


@router.get("/assignments", response_model=APIResponse[list])
async def get_assignments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return success_response(data=[])


from pydantic import BaseModel
class MentorBatchMappingCreate(BaseModel):
    mentor_id: UUID
    batch_id: UUID

class MentorBatchMappingResponse(BaseModel):
    mapping_id: str
    mentor_id: UUID
    batch_id: UUID
    assigned_at: str

@router.get("/batch-mappings", response_model=APIResponse[list[MentorBatchMappingResponse]])
async def get_batch_mappings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.models.core.allocation import Allocation
    from sqlalchemy import select
    stmt = select(Allocation).where(Allocation.source_type == "MENTOR", Allocation.target_type == "BATCH", Allocation.deleted_at.is_(None))
    result = await db.execute(stmt)
    allocations = result.scalars().all()
    
    data = []
    for alloc in allocations:
        data.append(MentorBatchMappingResponse(
            mapping_id=str(alloc.id),
            mentor_id=alloc.source_id,
            batch_id=alloc.target_id,
            assigned_at=alloc.start_date.isoformat() if alloc.start_date else ""
        ))
    return success_response(data=data)

@router.post("/batch-mappings", response_model=APIResponse[MentorBatchMappingResponse])
async def create_batch_mapping(
    payload: MentorBatchMappingCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.models.core.allocation import Allocation
    from sqlalchemy import select
    
    stmt = select(Allocation).where(
        Allocation.source_type == "MENTOR", 
        Allocation.target_type == "BATCH", 
        Allocation.target_id == payload.batch_id,
        Allocation.deleted_at.is_(None)
    )
    result = await db.execute(stmt)
    existing = result.scalars().first()
    
    if existing:
        if existing.source_id == payload.mentor_id:
            return success_response(data=MentorBatchMappingResponse(
                mapping_id=str(existing.id), mentor_id=existing.source_id, batch_id=existing.target_id, assigned_at=existing.start_date.isoformat()
            ))
        # Update existing
        existing.source_id = payload.mentor_id
        await db.commit()
        return success_response(data=MentorBatchMappingResponse(
            mapping_id=str(existing.id), mentor_id=existing.source_id, batch_id=existing.target_id, assigned_at=existing.start_date.isoformat()
        ))
    
    alloc = Allocation(
        source_type="MENTOR",
        source_id=payload.mentor_id,
        target_type="BATCH",
        target_id=payload.batch_id,
        role="LEAD_MENTOR",
        created_by=current_user.id,
        updated_by=current_user.id
    )
    db.add(alloc)
    await db.commit()
    await db.refresh(alloc)
    
    return success_response(data=MentorBatchMappingResponse(
        mapping_id=str(alloc.id), mentor_id=alloc.source_id, batch_id=alloc.target_id, assigned_at=alloc.start_date.isoformat()
    ))



async def get_emp_or_user_name(db, mentor):
    if mentor.employee_profile_id:
        res = await db.execute(select(EmployeeProfile).where(EmployeeProfile.id == mentor.employee_profile_id))
        emp = res.scalars().first()
        if emp:
            return f"{emp.first_name} {emp.last_name}"
    res = await db.execute(select(User).where(User.id == mentor.user_id))
    user = res.scalars().first()
    if user:
        return user.username
    return "Unknown Mentor"

@router.get("/{mentor_id}", response_model=APIResponse[MentorProfileResponse])
async def get_mentor(
    mentor_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = MentorProfileService(db)
    mentor = await service.get(mentor_id)
    emp_name = await get_emp_or_user_name(db, mentor)

    return success_response(
        data=map_response(mentor, emp_name)
    )


@router.post("", response_model=APIResponse[MentorProfileResponse])
async def create_mentor(
    payload: MentorProfileCreate,
    current_user: User = Depends(require_permission("mentor", "create")),
    db: AsyncSession = Depends(get_db),
):
    service = MentorProfileService(db)
    mentor = await service.create(obj_in=payload, user_id=current_user.id)
    emp_name = await get_emp_or_user_name(db, mentor)

    return success_response(
        data=map_response(mentor, emp_name),
        message="Mentor profile created successfully",
    )


@router.put("/{mentor_id}", response_model=APIResponse[MentorProfileResponse])
async def update_mentor(
    mentor_id: UUID,
    payload: MentorProfileUpdate,
    current_user: User = Depends(require_permission("mentor", "update")),
    db: AsyncSession = Depends(get_db),
):
    service = MentorProfileService(db)
    mentor = await service.update(id=mentor_id, obj_in=payload, user_id=current_user.id)
    emp_name = await get_emp_or_user_name(db, mentor)

    return success_response(
        data=map_response(mentor, emp_name),
        message="Mentor profile updated successfully",
    )


@router.delete("/{mentor_id}", response_model=APIResponse[dict])
async def delete_mentor(
    mentor_id: UUID,
    current_user: User = Depends(require_permission("mentor", "delete")),
    db: AsyncSession = Depends(get_db),
):
    service = MentorProfileService(db)

    await service.delete(
        id=mentor_id,
        user_id=current_user.id,
    )

    return success_response(
        data={},
        message="Mentor profile deleted successfully",
    )