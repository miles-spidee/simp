from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class CertificateBase(BaseModel):
    certificate_number: str = Field(alias='certificateNumber')
    student_id: str = Field(alias='studentId')
    student_name: str = Field(alias='studentName')
    program: str
    batch: str
    mentor_name: str = Field(alias='mentorName')
    type: str
    issue_date: Optional[datetime] = Field(None, alias='issueDate')
    expiry_date: Optional[datetime] = Field(None, alias='expiryDate')
    status: str
    generated_by: str = Field(alias='generatedBy')
    approved_by: Optional[str] = Field(None, alias='approvedBy')
    qr_code_url: str = Field(alias='qrCodeUrl')
    verification_url: str = Field(alias='verificationUrl')
    digital_signature_id: Optional[str] = Field(None, alias='digitalSignatureId')

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class CertificateCreate(BaseModel):
    student_name: str = Field(alias='studentName')
    student_id: str = Field(alias='studentId')
    program: str
    batch: str
    mentor_name: str = Field(alias='mentorName')
    type: str
    status: str
    issue_date: Optional[datetime] = Field(None, alias='issueDate')
    
    class Config:
        populate_by_name = True

class CertificateUpdateStatus(BaseModel):
    status: str
    approved_by: Optional[str] = Field(None, alias='approvedBy')

    class Config:
        populate_by_name = True

class CertificateResponse(CertificateBase):
    id: uuid.UUID
    created_at: datetime = Field(alias='createdTime')

    class Config(CertificateBase.Config):
        from_attributes = True
