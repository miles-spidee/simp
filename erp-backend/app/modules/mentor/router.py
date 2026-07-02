from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_permission
from app.core.responses import APIResponse, success_response

from app.models.authentication.user import User

from app.modules.mentor.schemas import (
    MentorProfileCreate,
    MentorProfileUpdate,
    MentorProfileResponse,
)

from app.modules.mentor.service import MentorProfileService

router = APIRouter()


def map_response(profile):
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
    )


@router.get("/", response_model=APIResponse[list[MentorProfileResponse]])
async def get_mentors(
    current_user: User = Depends(require_permission("mentor", "read")),
    db: AsyncSession = Depends(get_db),
):
    service = MentorProfileService(db)

    mentors = await service.get_multi()

    return success_response(
        data=[map_response(m) for m in mentors]
    )


@router.get("/{mentor_id}", response_model=APIResponse[MentorProfileResponse])
async def get_mentor(
    mentor_id: UUID,
    current_user: User = Depends(require_permission("mentor", "read")),
    db: AsyncSession = Depends(get_db),
):
    service = MentorProfileService(db)

    mentor = await service.get(mentor_id)

    return success_response(
        data=map_response(mentor)
    )


@router.post("/", response_model=APIResponse[MentorProfileResponse])
async def create_mentor(
    payload: MentorProfileCreate,
    current_user: User = Depends(require_permission("mentor", "create")),
    db: AsyncSession = Depends(get_db),
):
    service = MentorProfileService(db)

    mentor = await service.create(
        obj_in=payload,
        user_id=current_user.id,
    )

    return success_response(
        data=map_response(mentor),
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

    mentor = await service.update(
        id=mentor_id,
        obj_in=payload,
        user_id=current_user.id,
    )

    return success_response(
        data=map_response(mentor),
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