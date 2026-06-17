from sqlalchemy.ext.asyncio import AsyncSession

from .repository import (
    IndustrialApplicationDetailsRepository
)


class IndustrialApplicationDetailsService:

    def __init__(
        self,
        db: AsyncSession
    ):
        self.repo = (
            IndustrialApplicationDetailsRepository(db)
        )

    async def get_all(self):
        return await self.repo.get_all()

    async def get_by_id(
        self,
        industrial_application_id
    ):
        return await self.repo.get_by_id(
            industrial_application_id
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
        industrial_application_id,
        payload
    ):
        return await self.repo.update(
            industrial_application_id,
            payload
        )

    async def delete(
        self,
        industrial_application_id
    ):
        return await self.repo.delete(
            industrial_application_id
        )