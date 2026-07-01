from pydantic import BaseModel
from uuid import UUID

class ProgramBase(BaseModel):
    pass

class ProgramCreate(ProgramBase):
    pass

class ProgramUpdate(ProgramBase):
    pass

class ProgramResponse(ProgramBase):
    id: UUID
    class Config:
        from_attributes = True
