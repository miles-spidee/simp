from pydantic import BaseModel
from uuid import UUID

class TaskBase(BaseModel):
    pass

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: UUID
    class Config:
        from_attributes = True
