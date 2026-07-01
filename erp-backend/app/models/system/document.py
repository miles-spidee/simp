import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from app.models.core.mixins import BaseModel

class DocumentTemplate(BaseModel):
    __tablename__ = 'sys_document_templates'
    __table_args__ = {'comment': 'Templates for generating official PDFs/Docs'}

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    document_type_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('ref_document_types.id', ondelete='RESTRICT'), index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    variables: Mapped[Optional[dict]] = mapped_column(JSONB, comment="Available dynamic placeholders")

class GeneratedDocument(BaseModel):
    __tablename__ = 'sys_generated_documents'
    __table_args__ = {'comment': 'Record of documents generated from templates'}

    template_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('sys_document_templates.id', ondelete='RESTRICT'), index=True, nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True, nullable=False)
    file_url: Mapped[str] = mapped_column(String(500), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="GENERATED")
