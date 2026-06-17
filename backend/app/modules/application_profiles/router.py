from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import (
    ApplicationProfileCreate,
    ApplicationProfileUpdate,
    ApplicationProfileResponse
)

from .service import (
    ApplicationProfileService
)

from app.db_team_package.database import (
    get_db_session
)

router = APIRouter(
    prefix="/application-profiles",
    tags=["Application Profiles"]
)


@router.get(
    "/",
    response_model=list[ApplicationProfileResponse]
)
async def get_profiles(
    db: AsyncSession = Depends(get_db_session)
):
    service = ApplicationProfileService(db)
    return await service.get_all()


@router.get(
    "/{application_profile_id}",
    response_model=ApplicationProfileResponse
)
async def get_profile(
    application_profile_id: UUID,
    db: AsyncSession = Depends(get_db_session)
):
    service = ApplicationProfileService(db)

    return await service.get_by_id(
        application_profile_id
    )


@router.post(
    "/",
    response_model=ApplicationProfileResponse
)
async def create_profile(
    payload: ApplicationProfileCreate,
    db: AsyncSession = Depends(get_db_session)
):
    service = ApplicationProfileService(db)

    return await service.create(
        payload
    )


@router.put(
    "/{application_profile_id}",
    response_model=ApplicationProfileResponse
)
async def update_profile(
    application_profile_id: UUID,
    payload: ApplicationProfileUpdate,
    db: AsyncSession = Depends(get_db_session)
):
    service = ApplicationProfileService(db)

    return await service.update(
        application_profile_id,
        payload
    )


@router.delete(
    "/{application_profile_id}"
)
async def delete_profile(
    application_profile_id: UUID,
    db: AsyncSession = Depends(get_db_session)
):
    service = ApplicationProfileService(db)

    return await service.delete(
        application_profile_id
    )