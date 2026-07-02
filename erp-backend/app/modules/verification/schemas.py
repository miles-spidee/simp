from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class VerificationRequestBase(BaseModel):
    certificate_number: str = Field(alias='certificateNumber')
    requested_by_ip: str = Field(alias='requestedByIp')
    method: str
    result: str

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class VerificationRequestCreate(VerificationRequestBase):
    pass

class VerificationRequestResponse(VerificationRequestBase):
    id: uuid.UUID
    created_at: datetime = Field(alias='requestTime')

    class Config(VerificationRequestBase.Config):
        from_attributes = True

class VerificationResultSchema(BaseModel):
    status: str
    student_name: Optional[str] = Field(None, alias='studentName')
    program: Optional[str] = None
    batch: Optional[str] = None
    issue_date: Optional[datetime] = Field(None, alias='issueDate')
    organization: Optional[str] = None
    certificate_type: Optional[str] = Field(None, alias='certificateType')
    message: str
    preview_url: Optional[str] = Field(None, alias='previewUrl')

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
