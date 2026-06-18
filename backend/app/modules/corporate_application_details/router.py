from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import (
    get_db_session
)

from .schemas import (
    CorporateApplicationDetailsCreate,
    CorporateApplicationDetailsUpdate,
    CorporateApplicationDetailsResponse
)

from .service import (
    CorporateApplicationDetailsService
)

router = APIRouter(
    prefix="/corporate-application-details",
    tags=["Corporate Application Details"]
)


@router.get(
    "/",
    response_model=list[
        CorporateApplicationDetailsResponse
    ]
)
async def get_all_corporate_details(
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        CorporateApplicationDetailsService(db)
    )
    return await service.get_all()


@router.get(
    "/{corporate_application_id}",
    response_model=
    CorporateApplicationDetailsResponse
)
async def get_corporate_detail(
    corporate_application_id: UUID,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        CorporateApplicationDetailsService(db)
    )
    return await service.get_by_id(
        corporate_application_id
    )


@router.post(
    "/",
    response_model=
    CorporateApplicationDetailsResponse
)
async def create_corporate_detail(
    payload:
    CorporateApplicationDetailsCreate,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        CorporateApplicationDetailsService(db)
    )
    return await service.create(payload)


@router.put(
    "/{corporate_application_id}",
    response_model=
    CorporateApplicationDetailsResponse
)
async def update_corporate_detail(
    corporate_application_id: UUID,
    payload:
    CorporateApplicationDetailsUpdate,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        CorporateApplicationDetailsService(db)
    )
    return await service.update(
        corporate_application_id,
        payload
    )


@router.delete(
    "/{corporate_application_id}"
)
async def delete_corporate_detail(
    corporate_application_id: UUID,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        CorporateApplicationDetailsService(db)
    )
    return await service.delete(
        corporate_application_id
    )