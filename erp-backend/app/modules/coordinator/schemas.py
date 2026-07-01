from pydantic import BaseModel
from uuid import UUID

class CoordinatorBase(BaseModel):
    pass

class CoordinatorCreate(CoordinatorBase):
    pass

class CoordinatorUpdate(CoordinatorBase):
    pass

class CoordinatorResponse(CoordinatorBase):
    id: UUID
    class Config:
        from_attributes = True
