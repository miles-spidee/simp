from sqlalchemy.ext.asyncio import AsyncSession

from .repository import (
    StipendApplicationDetailsRepository
)


class StipendApplicationDetailsService:

    def __init__(
        self,
        db: AsyncSession
    ):
        self.repo = (
            StipendApplicationDetailsRepository(db)
        )

    async def get_all(self):
        return await self.repo.get_all()

    async def get_by_id(
        self,
        stipend_application_id
    ):
        return await self.repo.get_by_id(
            stipend_application_id
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
        stipend_application_id,
        payload
    ):
        return await self.repo.update(
            stipend_application_id,
            payload
        )

    async def delete(
        self,
        stipend_application_id
    ):
        return await self.repo.delete(
            stipend_application_id
        )