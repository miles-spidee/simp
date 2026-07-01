import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, ForeignKey
from app.models.core.mixins import BaseModel

class Document(BaseModel):
    __tablename__ = 'intern_documents'
    __table_args__ = {'comment': 'Documents uploaded by students during internships (e.g., Reports, NOC)'}

    student_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('profile_students.id', ondelete='CASCADE'), index=True, nullable=False)
    document_type_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('ref_document_types.id', ondelete='RESTRICT'), index=True, nullable=False)
    
    file_url: Mapped[str] = mapped_column(String(500), nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    verified_by_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('auth_users.id', ondelete='SET NULL'), comment="User who verified the doc")
