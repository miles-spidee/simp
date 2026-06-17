from sqlalchemy.ext.asyncio import AsyncSession

from .repository import (
    PaidApplicationDetailsRepository
)


class PaidApplicationDetailsService:

    def __init__(
        self,
        db: AsyncSession
    ):
        self.repo = (
            PaidApplicationDetailsRepository(db)
        )

    async def get_all(self):
        return await self.repo.get_all()

    async def get_by_id(
        self,
        paid_application_id
    ):
        return await self.repo.get_by_id(
            paid_application_id
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
        paid_application_id,
        payload
    ):
        return await self.repo.update(
            paid_application_id,
            payload
        )

    async def delete(
        self,
        paid_application_id
    ):
        return await self.repo.delete(
            paid_application_id
        )