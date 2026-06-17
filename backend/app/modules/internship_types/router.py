from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import (
    InternshipTypeCreate,
    InternshipTypeUpdate,
    InternshipTypeResponse
)

from .service import InternshipTypeService

# DB Team Imports
from app.db.database import get_db_session

router = APIRouter(
    prefix="/internship-types",
    tags=["Internship Types"]
)


@router.get(
    "/",
    response_model=list[InternshipTypeResponse]
)
async def get_all_types(
    db: AsyncSession = Depends(get_db_session)
):
    service = InternshipTypeService(db)

    return await service.get_all()


@router.get(
    "/{internship_type_id}",
    response_model=InternshipTypeResponse
)
async def get_type_by_id(
    internship_type_id: UUID,
    db: AsyncSession = Depends(get_db_session)
):
    service = InternshipTypeService(db)

    return await service.get_by_id(
        internship_type_id
    )


@router.post(
    "/",
    response_model=InternshipTypeResponse
)
async def create_type(
    payload: InternshipTypeCreate,
    db: AsyncSession = Depends(get_db_session)
):
    service = InternshipTypeService(db)

    return await service.create(
        payload
    )


@router.put(
    "/{internship_type_id}",
    response_model=InternshipTypeResponse
)
async def update_type(
    internship_type_id: UUID,
    payload: InternshipTypeUpdate,
    db: AsyncSession = Depends(get_db_session)
):
    service = InternshipTypeService(db)

    return await service.update(
        internship_type_id,
        payload
    )


@router.delete("/{internship_type_id}")
async def delete_type(
    internship_type_id: UUID,
    db: AsyncSession = Depends(get_db_session)
):
    service = InternshipTypeService(db)

    return await service.delete(
        internship_type_id
    )