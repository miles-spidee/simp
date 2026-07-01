from pydantic import BaseModel
from uuid import UUID

class FilesBase(BaseModel):
    pass

class FilesCreate(FilesBase):
    pass

class FilesUpdate(FilesBase):
    pass

class FilesResponse(FilesBase):
    id: UUID
    class Config:
        from_attributes = True
