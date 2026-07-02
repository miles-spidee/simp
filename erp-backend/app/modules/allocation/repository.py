from app.repositories.base import BaseRepository
from app.models.internships.mentor_assignment import MentorAssignment
from app.modules.allocation.schemas import (
    AllocationCreate,
    AllocationUpdate,
)


class AllocationRepository(
    BaseRepository[
        MentorAssignment,
        AllocationCreate,
        AllocationUpdate,
    ]
):
    def __init__(self):
        super().__init__(
            MentorAssignment,
            search_fields=[
                "status",
            ],
        )