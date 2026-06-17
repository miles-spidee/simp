from sqlalchemy.ext.asyncio import AsyncSession

from .repository import (
    CorporateApplicationDetailsRepository
)


class CorporateApplicationDetailsService:

    def __init__(
        self,
        db: AsyncSession
    ):
        self.repo = (
            CorporateApplicationDetailsRepository(db)
        )

    async def get_all(self):
        return await self.repo.get_all()

    async def get_by_id(
        self,
        corporate_application_id
    ):
        return await self.repo.get_by_id(
            corporate_application_id
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
        corporate_application_id,
        payload
    ):
        return await self.repo.update(
            corporate_application_id,
            payload
        )

    async def delete(
        self,
        corporate_application_id
    ):
        return await self.repo.delete(
            corporate_application_id
        )