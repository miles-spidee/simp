import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey
from app.models.core.mixins import BaseModel

class PermissionGroup(BaseModel):
    __tablename__ = 'rbac_permission_groups'
    __table_args__ = {'comment': 'Logical groupings of permissions for easier assignment'}

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(500))


class PermissionGroupPermission(BaseModel):
    __tablename__ = 'rbac_permission_group_permissions'
    __table_args__ = {'comment': 'Junction mapping permissions to groups'}

    permission_group_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('rbac_permission_groups.id', ondelete='CASCADE'), index=True, nullable=False)
    permission_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('rbac_permissions.id', ondelete='CASCADE'), index=True, nullable=False)

    permission_group: Mapped["PermissionGroup"] = relationship("PermissionGroup")
    permission: Mapped["Permission"] = relationship("Permission")
