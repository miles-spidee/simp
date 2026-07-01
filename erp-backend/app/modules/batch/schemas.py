from pydantic import BaseModel
from uuid import UUID

class BatchBase(BaseModel):
    pass

class BatchCreate(BatchBase):
    pass

class BatchUpdate(BatchBase):
    pass

class BatchResponse(BatchBase):
    id: UUID
    class Config:
        from_attributes = True
