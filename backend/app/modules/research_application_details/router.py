from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import (
    get_db_session
)

from .schemas import (
    ResearchApplicationDetailsCreate,
    ResearchApplicationDetailsUpdate,
    ResearchApplicationDetailsResponse
)

from .service import (
    ResearchApplicationDetailsService
)

router = APIRouter(
    prefix="/research-application-details",
    tags=["Research Application Details"]
)


@router.get(
    "/",
    response_model=list[
        ResearchApplicationDetailsResponse
    ]
)
async def get_all_research_details(
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        ResearchApplicationDetailsService(db)
    )
    return await service.get_all()


@router.get(
    "/{research_application_id}",
    response_model=
    ResearchApplicationDetailsResponse
)
async def get_research_detail(
    research_application_id: UUID,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        ResearchApplicationDetailsService(db)
    )
    return await service.get_by_id(
        research_application_id
    )


@router.post(
    "/",
    response_model=
    ResearchApplicationDetailsResponse
)
async def create_research_detail(
    payload:
    ResearchApplicationDetailsCreate,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        ResearchApplicationDetailsService(db)
    )
    return await service.create(payload)


@router.put(
    "/{research_application_id}",
    response_model=
    ResearchApplicationDetailsResponse
)
async def update_research_detail(
    research_application_id: UUID,
    payload:
    ResearchApplicationDetailsUpdate,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        ResearchApplicationDetailsService(db)
    )
    return await service.update(
        research_application_id,
        payload
    )


@router.delete(
    "/{research_application_id}"
)
async def delete_research_detail(
    research_application_id: UUID,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        ResearchApplicationDetailsService(db)
    )
    return await service.delete(
        research_application_id
    )