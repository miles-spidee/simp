from app.repositories.base import BaseRepository
from app.models.profiles.mentor_profile import MentorProfile
from app.modules.mentor.schemas import MentorProfileCreate, MentorProfileUpdate


class MentorProfileRepository(
    BaseRepository[
        MentorProfile,
        MentorProfileCreate,
        MentorProfileUpdate,
    ]
):
    def __init__(self):
        super().__init__(
            MentorProfile,
            search_fields=[
                "expertise",
            ],
        )