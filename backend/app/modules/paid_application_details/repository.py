from sqlalchemy.ext.asyncio import AsyncSession


class PaidApplicationDetailsRepository:

    def __init__(
        self,
        db: AsyncSession
    ):
        self.db = db