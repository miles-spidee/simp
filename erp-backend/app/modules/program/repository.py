from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.academic.program import Program


class ProgramRepository(
    BaseRepository[
        Program,
        Any,
        Any
    ]
):
    def __init__(self):
        super().__init__(
            Program,
            search_fields=[
                "name",
                "code",
                "program_type"
            ]
        )