from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db_team_package.database import (
    get_db_session
)

from .schemas import (
    IndustrialApplicationDetailsCreate,
    IndustrialApplicationDetailsUpdate,
    IndustrialApplicationDetailsResponse
)

from .service import (
    IndustrialApplicationDetailsService
)

router = APIRouter(
    prefix="/industrial-application-details",
    tags=["Industrial Application Details"]
)


@router.get(
    "/",
    response_model=list[
        IndustrialApplicationDetailsResponse
    ]
)
async def get_all_industrial_details(
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        IndustrialApplicationDetailsService(db)
    )
    return await service.get_all()


@router.get(
    "/{industrial_application_id}",
    response_model=
    IndustrialApplicationDetailsResponse
)
async def get_industrial_detail(
    industrial_application_id: UUID,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        IndustrialApplicationDetailsService(db)
    )
    return await service.get_by_id(
        industrial_application_id
    )


@router.post(
    "/",
    response_model=
    IndustrialApplicationDetailsResponse
)
async def create_industrial_detail(
    payload:
    IndustrialApplicationDetailsCreate,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        IndustrialApplicationDetailsService(db)
    )
    return await service.create(payload)


@router.put(
    "/{industrial_application_id}",
    response_model=
    IndustrialApplicationDetailsResponse
)
async def update_industrial_detail(
    industrial_application_id: UUID,
    payload:
    IndustrialApplicationDetailsUpdate,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        IndustrialApplicationDetailsService(db)
    )
    return await service.update(
        industrial_application_id,
        payload
    )


@router.delete(
    "/{industrial_application_id}"
)
async def delete_industrial_detail(
    industrial_application_id: UUID,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        IndustrialApplicationDetailsService(db)
    )
    return await service.delete(
        industrial_application_id
    )