"""
Reusable mixins and the Enterprise BaseModel for all ERP entities.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import DateTime, String, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import mapped_column, Mapped
from .base import Base

def utcnow():
    return datetime.now(timezone.utc)

class UUIDPrimaryKeyMixin:
    """Provides a deterministic UUID4 primary key."""
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4, 
        comment="Unique identifier for the record"
    )

class TimeStampedMixin:
    """Provides standard audit timestamps."""
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=utcnow, 
        nullable=False, 
        comment="Timestamp when the record was created"
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=utcnow, 
        onupdate=utcnow, 
        nullable=False, 
        comment="Timestamp when the record was last updated"
    )

class AuditMixin:
    """Provides audit trails without enforcing hard cross-module foreign key constraints."""
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        nullable=True, 
        index=True, 
        comment="UUID of the user who created this record (Soft FK)"
    )
    updated_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        nullable=True, 
        index=True, 
        comment="UUID of the user who last updated this record (Soft FK)"
    )

class SoftDeleteMixin:
    """Provides soft deletion via timestamp (is_deleted boolean removed for normalization)."""
    deleted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=True, 
        index=True, 
        comment="Timestamp when the record was soft-deleted. NULL means active."
    )

class VersionMixin:
    """Provides optimistic concurrency control."""
    version_id: Mapped[int] = mapped_column(
        Integer, 
        nullable=False, 
        default=1, 
        comment="Optimistic locking version number"
    )


class BaseModel(Base, UUIDPrimaryKeyMixin, TimeStampedMixin, AuditMixin, SoftDeleteMixin, VersionMixin):
    """
    The unified Enterprise Base Model.
    Every entity in the ERP must inherit from this class.
    """
    __abstract__ = True

    @declared_attr
    def __mapper_args__(cls):
        """Enable optimistic locking for all inherited models."""
        return {
            "version_id_col": cls.version_id,
            "version_id_generator": False  # Use SQLAlchemy's default auto-increment
        }
