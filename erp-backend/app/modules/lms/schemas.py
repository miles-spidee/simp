from pydantic import BaseModel
from uuid import UUID

class LmsBase(BaseModel):
    pass

class LmsCreate(LmsBase):
    pass

class LmsUpdate(LmsBase):
    pass

class LmsResponse(LmsBase):
    id: UUID
    class Config:
        from_attributes = True
