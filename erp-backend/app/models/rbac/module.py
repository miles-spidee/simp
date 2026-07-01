import uuid
from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from app.models.core.mixins import BaseModel

class Module(BaseModel):
    __tablename__ = 'rbac_modules'
    __table_args__ = {'comment': 'Top-level system modules and submodules'}

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(500))
    route_path: Mapped[Optional[str]] = mapped_column(String(255))
    
    # Self-referential for submodules
    parent_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('rbac_modules.id', ondelete='CASCADE'), index=True)

    parent: Mapped[Optional["Module"]] = relationship("Module", remote_side="Module.id", back_populates="submodules")
    submodules: Mapped[List["Module"]] = relationship("Module", back_populates="parent", cascade="all, delete-orphan")
    features: Mapped[List["Feature"]] = relationship("Feature", back_populates="module", cascade="all, delete-orphan")
