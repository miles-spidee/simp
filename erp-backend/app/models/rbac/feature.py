import uuid
from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, UniqueConstraint
from app.models.core.mixins import BaseModel

class Feature(BaseModel):
    __tablename__ = 'rbac_features'
    __table_args__ = (
        UniqueConstraint('module_id', 'code', name='uq_rbac_feature_module_code'),
        {'comment': 'Features belonging to a specific module'}
    )

    module_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('rbac_modules.id', ondelete='CASCADE'), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(500))

    module: Mapped["Module"] = relationship("Module", back_populates="features")
    permissions: Mapped[List["Permission"]] = relationship("Permission", back_populates="feature", cascade="all, delete-orphan")
