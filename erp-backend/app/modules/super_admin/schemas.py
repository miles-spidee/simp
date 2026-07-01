from pydantic import BaseModel
from uuid import UUID

class Super_adminBase(BaseModel):
    pass

class Super_adminCreate(Super_adminBase):
    pass

class Super_adminUpdate(Super_adminBase):
    pass

class Super_adminResponse(Super_adminBase):
    id: UUID
    class Config:
        from_attributes = True
