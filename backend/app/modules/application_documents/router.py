from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import (
    ApplicationDocumentCreate,
    ApplicationDocumentUpdate,
    ApplicationDocumentResponse
)

from .service import (
    ApplicationDocumentService
)

from app.core.database import (
    get_db_session
)

router = APIRouter(
    prefix="/application-documents",
    tags=["Application Documents"]
)


@router.get(
    "/",
    response_model=list[ApplicationDocumentResponse]
)
async def get_documents(
    db: AsyncSession = Depends(get_db_session)
):
    service = ApplicationDocumentService(db)

    return await service.get_all()


@router.get(
    "/{document_id}",
    response_model=ApplicationDocumentResponse
)
async def get_document(
    document_id: UUID,
    db: AsyncSession = Depends(get_db_session)
):
    service = ApplicationDocumentService(db)

    return await service.get_by_id(
        document_id
    )


@router.post(
    "/",
    response_model=ApplicationDocumentResponse
)
async def create_document(
    payload: ApplicationDocumentCreate,
    db: AsyncSession = Depends(get_db_session)
):
    service = ApplicationDocumentService(db)

    return await service.create(
        payload
    )


@router.put(
    "/{document_id}",
    response_model=ApplicationDocumentResponse
)
async def update_document(
    document_id: UUID,
    payload: ApplicationDocumentUpdate,
    db: AsyncSession = Depends(get_db_session)
):
    service = ApplicationDocumentService(db)

    return await service.update(
        document_id,
        payload
    )


@router.delete(
    "/{document_id}"
)
async def delete_document(
    document_id: UUID,
    db: AsyncSession = Depends(get_db_session)
):
    service = ApplicationDocumentService(db)

    return await service.delete(
        document_id
    )