from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import (
    InternshipOpeningCreate,
    InternshipOpeningUpdate,
    InternshipOpeningResponse
)

from .service import InternshipOpeningService

# DB Team Dependency
from app.core.database import get_db_session

router = APIRouter(
    prefix="/internship-openings",
    tags=["Internship Openings"]
)


@router.get(
    "/",
    response_model=list[InternshipOpeningResponse]
)
async def get_openings(
    db: AsyncSession = Depends(get_db_session)
):
    service = InternshipOpeningService(db)
    return await service.get_all()


@router.get(
    "/{opening_id}",
    response_model=InternshipOpeningResponse
)
async def get_opening(
    opening_id: UUID,
    db: AsyncSession = Depends(get_db_session)
):
    service = InternshipOpeningService(db)
    return await service.get_by_id(opening_id)


@router.post(
    "/",
    response_model=InternshipOpeningResponse
)
async def create_opening(
    payload: InternshipOpeningCreate,
    db: AsyncSession = Depends(get_db_session)
):
    service = InternshipOpeningService(db)
    return await service.create(payload)


@router.put(
    "/{opening_id}",
    response_model=InternshipOpeningResponse
)
async def update_opening(
    opening_id: UUID,
    payload: InternshipOpeningUpdate,
    db: AsyncSession = Depends(get_db_session)
):
    service = InternshipOpeningService(db)
    return await service.update(
        opening_id,
        payload
    )


@router.delete("/{opening_id}")
async def delete_opening(
    opening_id: UUID,
    db: AsyncSession = Depends(get_db_session)
):
    service = InternshipOpeningService(db)
    return await service.delete(opening_id)