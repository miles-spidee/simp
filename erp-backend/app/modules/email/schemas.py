from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

class EmailTemplateBase(BaseModel):
    name: str
    category: str
    subject: str
    html_body: str = Field(alias='htmlBody')
    status: str
    variables: Optional[List[str]] = None

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class EmailTemplateCreate(EmailTemplateBase):
    pass

class EmailTemplateUpdate(EmailTemplateBase):
    pass

class EmailTemplateResponse(EmailTemplateBase):
    id: uuid.UUID
    created_at: datetime = Field(alias='lastUpdated')
    updated_at: datetime
    created_by: Optional[uuid.UUID] = Field(None, alias='createdBy')
    version: Optional[int] = 1

    class Config(EmailTemplateBase.Config):
        orm_mode = True
        from_attributes = True

class EmailHistoryBase(BaseModel):
    template_id: Optional[uuid.UUID] = Field(alias='templateId')
    recipient_email: str = Field(alias='recipientEmail')
    status: str

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class EmailHistoryResponse(EmailHistoryBase):
    id: uuid.UUID
    created_at: datetime = Field(alias='sentAt')

    class Config(EmailHistoryBase.Config):
        orm_mode = True
        from_attributes = True
