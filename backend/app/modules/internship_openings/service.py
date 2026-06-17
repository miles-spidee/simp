from sqlalchemy.ext.asyncio import AsyncSession

from .repository import (
    InternshipOpeningRepository
)


class InternshipOpeningService:

    def __init__(
        self,
        db: AsyncSession
    ):
        self.repo = InternshipOpeningRepository(db)

    async def get_all(self):
        return await self.repo.get_all()

    async def get_by_id(
        self,
        opening_id
    ):
        return await self.repo.get_by_id(
            opening_id
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
        opening_id,
        payload
    ):
        return await self.repo.update(
            opening_id,
            payload
        )

    async def delete(
        self,
        opening_id
    ):
        return await self.repo.delete(
            opening_id
        )