from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class ApplicationDocumentCreate(BaseModel):
    application_id: UUID
    document_type: str
    file_name: str
    mime_type: str
    file_size: int


class ApplicationDocumentUpdate(BaseModel):
    document_type: Optional[str] = None
    file_name: Optional[str] = None
    mime_type: Optional[str] = None


class ApplicationDocumentResponse(BaseModel):
    document_id: UUID
    application_id: UUID

    document_type: str
    file_name: str
    mime_type: str
    file_size: int

    uploaded_at: datetime

    class Config:
        from_attributes = True