from sqlalchemy.ext.asyncio import AsyncSession


class ApplicationDocumentRepository:

    def __init__(
        self,
        db: AsyncSession
    ):
        self.db = db