from sqlalchemy.ext.asyncio import AsyncSession

from app.models.profiles.mentor_profile import MentorProfile
from app.modules.mentor.repository import MentorProfileRepository
from app.modules.mentor.schemas import (
    MentorProfileCreate,
    MentorProfileUpdate,
)
from app.services.base import BaseCRUDService


class MentorProfileService(
    BaseCRUDService[
        MentorProfile,
        MentorProfileCreate,
        MentorProfileUpdate,
    ]
):

    def __init__(self, db: AsyncSession):
        super().__init__(
            db=db,
            repository=MentorProfileRepository(),
        )