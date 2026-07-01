from pydantic import BaseModel
from uuid import UUID

class ApplicationBase(BaseModel):
    pass

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(ApplicationBase):
    pass

class ApplicationResponse(ApplicationBase):
    id: UUID
    class Config:
        from_attributes = True
