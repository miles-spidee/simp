from sqlalchemy.ext.asyncio import AsyncSession

from .repository import (
    ResearchApplicationDetailsRepository
)


class ResearchApplicationDetailsService:

    def __init__(
        self,
        db: AsyncSession
    ):
        self.repo = (
            ResearchApplicationDetailsRepository(db)
        )

    async def get_all(self):
        return await self.repo.get_all()

    async def get_by_id(
        self,
        research_application_id
    ):
        return await self.repo.get_by_id(
            research_application_id
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
        research_application_id,
        payload
    ):
        return await self.repo.update(
            research_application_id,
            payload
        )

    async def delete(
        self,
        research_application_id
    ):
        return await self.repo.delete(
            research_application_id
        )