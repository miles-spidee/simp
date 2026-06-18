from uuid import UUID

from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.ext.asyncio import (
    AsyncSession
)

from app.core.database import (
    get_db_session
)

from app.dependencies.auth_deps import (
    get_current_user
)

from .schemas import (
    PaidApplicationDetailsCreate,
    PaidApplicationDetailsUpdate,
    PaidApplicationDetailsResponse
)

from .service import (
    PaidApplicationDetailsService
)

router = APIRouter(
    prefix="/paid-application-details",
    tags=["Paid Application Details"]
)


@router.get(
    "/",
    response_model=list[
        PaidApplicationDetailsResponse
    ]
)
async def get_all_paid_details(
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        PaidApplicationDetailsService(db)
    )

    return await service.get_all()


@router.get(
    "/{paid_application_id}",
    response_model=
    PaidApplicationDetailsResponse
)
async def get_paid_detail(
    paid_application_id: UUID,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        PaidApplicationDetailsService(db)
    )

    return await service.get_by_id(
        paid_application_id
    )


@router.post(
    "/",
    response_model=
    PaidApplicationDetailsResponse
)
async def create_paid_detail(
    payload:
    PaidApplicationDetailsCreate,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        PaidApplicationDetailsService(db)
    )

    return await service.create(payload)


@router.put(
    "/{paid_application_id}",
    response_model=
    PaidApplicationDetailsResponse
)
async def update_paid_detail(
    paid_application_id: UUID,
    payload:
    PaidApplicationDetailsUpdate,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        PaidApplicationDetailsService(db)
    )

    return await service.update(
        paid_application_id,
        payload
    )


@router.delete(
    "/{paid_application_id}"
)
async def delete_paid_detail(
    paid_application_id: UUID,
    db: AsyncSession = Depends(
        get_db_session
    )
):
    service = (
        PaidApplicationDetailsService(db)
    )

    return await service.delete(
        paid_application_id
    )