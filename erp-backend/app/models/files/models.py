import uuid
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, ForeignKey, CheckConstraint, Boolean, Integer, BigInteger, DateTime, Enum as SQLEnum, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.core.mixins import BaseModel
from app.models.files.enums import FileStatusEnum, AccessLevelEnum

if TYPE_CHECKING:
    from app.models.authentication.user import User

class CommonFile(BaseModel):
    __tablename__ = 'file_records'
    __table_args__ = (
        CheckConstraint('version >= 1', name='chk_file_records_version_min'),
        CheckConstraint('download_count >= 0', name='chk_file_records_download_count_min'),
        Index('ix_file_records_tags', 'tags', postgresql_using='gin'),
        Index('ix_file_records_metadata', 'metadata', postgresql_using='gin'),
        {'comment': 'Central registry for all uploaded files and documents'}
    )

    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    display_name: Mapped[str] = mapped_column(String(255), nullable=False)
    unique_file_name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)

    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    file_type: Mapped[str] = mapped_column(String(100), nullable=False)
    file_extension: Mapped[str] = mapped_column(String(20), nullable=False)

    file_size: Mapped[int] = mapped_column(BigInteger, nullable=False)

    checksum: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)

    storage_provider: Mapped[str] = mapped_column(String(50), default="Local", index=True, nullable=False)
    storage_path: Mapped[str] = mapped_column(Text, nullable=False)

    public_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    preview_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    category: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    module_name: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    entity_name: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    entity_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True, nullable=False)

    folder_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    tags: Mapped[Optional[List[str]]] = mapped_column(ARRAY(Text), nullable=True)

    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    is_latest: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)

    status: Mapped[FileStatusEnum] = mapped_column(
        SQLEnum(FileStatusEnum, name="file_status_enum", inherit_schema=True),
        default=FileStatusEnum.DRAFT,
        index=True,
        nullable=False
    )

    uploaded_by: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='RESTRICT'), index=True, nullable=False)
    approved_by: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('auth_users.id', ondelete='SET NULL'), index=True, nullable=True)
    approved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    download_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_downloaded_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_downloadable: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_editable: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_confidential: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    access_level: Mapped[AccessLevelEnum] = mapped_column(
        SQLEnum(AccessLevelEnum, name="access_level_enum", inherit_schema=True),
        default=AccessLevelEnum.INTERNAL,
        index=True,
        nullable=False
    )

    remarks: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Map Python attribute `file_metadata` to PostgreSQL column name `metadata` to avoid conflicts with reserved words.
    file_metadata: Mapped[Optional[dict]] = mapped_column("metadata", JSONB, nullable=True)

    # Relationships
    uploaded_by_user: Mapped["User"] = relationship(
        "User", 
        foreign_keys=[uploaded_by], 
        back_populates="uploaded_files"
    )
    approved_by_user: Mapped[Optional["User"]] = relationship(
        "User", 
        foreign_keys=[approved_by], 
        back_populates="approved_files"
    )
