from pydantic import BaseModel
from uuid import UUID

class AllocationBase(BaseModel):
    pass

class AllocationCreate(AllocationBase):
    pass

class AllocationUpdate(AllocationBase):
    pass

class AllocationResponse(AllocationBase):
    id: UUID
    class Config:
        from_attributes = True
