from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationResponse
)

from .service import ApplicationService

# DB Team Dependency
from app.core.database import (
    get_db_session
)

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


@router.get(
    "/",
    response_model=list[ApplicationResponse]
)
async def get_applications(
    db: AsyncSession = Depends(get_db_session)
):
    service = ApplicationService(db)

    return await service.get_all()


@router.get(
    "/{application_id}",
    response_model=ApplicationResponse
)
async def get_application(
    application_id: UUID,
    db: AsyncSession = Depends(get_db_session)
):
    service = ApplicationService(db)

    return await service.get_by_id(
        application_id
    )


@router.post(
    "/",
    response_model=ApplicationResponse
)
async def create_application(
    payload: ApplicationCreate,
    db: AsyncSession = Depends(get_db_session)
):
    service = ApplicationService(db)

    return await service.create(
        payload
    )


@router.put(
    "/{application_id}",
    response_model=ApplicationResponse
)
async def update_application(
    application_id: UUID,
    payload: ApplicationUpdate,
    db: AsyncSession = Depends(get_db_session)
):
    service = ApplicationService(db)

    return await service.update(
        application_id,
        payload
    )


@router.delete("/{application_id}")
async def delete_application(
    application_id: UUID,
    db: AsyncSession = Depends(get_db_session)
):
    service = ApplicationService(db)

    return await service.delete(
        application_id
    )