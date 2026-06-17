from sqlalchemy.ext.asyncio import AsyncSession

from .repository import ApplicationRepository


class ApplicationService:

    def __init__(self, db: AsyncSession):
        self.repo = ApplicationRepository(db)

    async def get_all(self):
        return await self.repo.get_all()

    async def get_by_id(
        self,
        application_id
    ):
        return await self.repo.get_by_id(
            application_id
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
        application_id,
        payload
    ):
        return await self.repo.update(
            application_id,
            payload
        )

    async def delete(
        self,
        application_id
    ):
        return await self.repo.delete(
            application_id
        )