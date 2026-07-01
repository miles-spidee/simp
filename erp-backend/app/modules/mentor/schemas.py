from pydantic import BaseModel
from uuid import UUID

class MentorBase(BaseModel):
    pass

class MentorCreate(MentorBase):
    pass

class MentorUpdate(MentorBase):
    pass

class MentorResponse(MentorBase):
    id: UUID
    class Config:
        from_attributes = True
