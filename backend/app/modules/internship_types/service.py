from sqlalchemy.ext.asyncio import AsyncSession

from .repository import InternshipTypeRepository


class InternshipTypeService:

    def __init__(
        self,
        db: AsyncSession
    ):
        self.db = db
        self.repo = InternshipTypeRepository(db)

    async def get_all(self):
        return await self.repo.get_all()

    async def get_by_id(
        self,
        internship_type_id
    ):
        return await self.repo.get_by_id(
            internship_type_id
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
        internship_type_id,
        payload
    ):
        return await self.repo.update(
            internship_type_id,
            payload
        )

    async def delete(
        self,
        internship_type_id
    ):
        return await self.repo.delete(
            internship_type_id
        )