from sqlalchemy.ext.asyncio import AsyncSession

from .repository import (
    ApplicationDocumentRepository
)


class ApplicationDocumentService:

    def __init__(
        self,
        db: AsyncSession
    ):
        self.repo = ApplicationDocumentRepository(db)

    async def get_all(self):
        return await self.repo.get_all()

    async def get_by_id(
        self,
        document_id
    ):
        return await self.repo.get_by_id(
            document_id
        )

    async def create(
        self,
        payload
    ):
        return await self.repo.create(
            payload
        )

    async def update(
        self,
        document_id,
        payload
    ):
        return await self.repo.update(
            document_id,
            payload
        )

    async def delete(
        self,
        document_id
    ):
        return await self.repo.delete(
            document_id
        )