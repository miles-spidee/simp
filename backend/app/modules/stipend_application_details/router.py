from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db_team_package.database import (
    get_db_session
)

from .schemas import (
    StipendApplicationDetailsCreate,
    StipendApplicationDetailsUpdate,
    StipendApplicationDetailsResponse
)

from .service import (
    StipendApplicationDetailsService
)

router = APIRouter(
    prefix="/stipend-application-details",
    tags=["Stipend Application Details"]
)


@router.get(
    "/",
    response_model=list[
        StipendApplicationDetailsResponse
    ]
)
async def get_all_stipend_details(
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        StipendApplicationDetailsService(db)
    )

    return await service.get_all()


@router.get(
    "/{stipend_application_id}",
    response_model=
    StipendApplicationDetailsResponse
)
async def get_stipend_detail(
    stipend_application_id: UUID,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        StipendApplicationDetailsService(db)
    )

    return await service.get_by_id(
        stipend_application_id
    )


@router.post(
    "/",
    response_model=
    StipendApplicationDetailsResponse
)
async def create_stipend_detail(
    payload:
    StipendApplicationDetailsCreate,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        StipendApplicationDetailsService(db)
    )

    return await service.create(payload)


@router.put(
    "/{stipend_application_id}",
    response_model=
    StipendApplicationDetailsResponse
)
async def update_stipend_detail(
    stipend_application_id: UUID,
    payload:
    StipendApplicationDetailsUpdate,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        StipendApplicationDetailsService(db)
    )

    return await service.update(
        stipend_application_id,
        payload
    )


@router.delete(
    "/{stipend_application_id}"
)
async def delete_stipend_detail(
    stipend_application_id: UUID,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        StipendApplicationDetailsService(db)
    )

    return await service.delete(
        stipend_application_id
    )