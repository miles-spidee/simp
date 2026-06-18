from sqlalchemy.ext.asyncio import AsyncSession

# DB Team Model
from .models import (
    StipendApplicationDetail
)


class StipendApplicationDetailsRepository:

    def __init__(
        self,
        db: AsyncSession
    ):
        self.db = db

    async def get_all(self):
        pass

    async def get_by_id(
        self,
        stipend_application_id
    ):
        pass

    async def create(
        self,
        payload
    ):
        pass

    async def update(
        self,
        stipend_application_id,
        payload
    ):
        pass

    async def delete(
        self,
        stipend_application_id
    ):
        pass