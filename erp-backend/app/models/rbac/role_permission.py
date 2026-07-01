import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UniqueConstraint
from app.models.core.mixins import BaseModel

class RolePermission(BaseModel):
    __tablename__ = 'rbac_role_permissions'
    __table_args__ = (
        UniqueConstraint('role_id', 'permission_id', name='uq_rbac_role_permission'),
        {'comment': 'Junction mapping roles directly to permissions'}
    )

    role_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('rbac_roles.id', ondelete='CASCADE'), index=True, nullable=False)
    permission_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('rbac_permissions.id', ondelete='CASCADE'), index=True, nullable=False)

    role: Mapped["Role"] = relationship("Role")
    permission: Mapped["Permission"] = relationship("Permission")


class RolePermissionGroup(BaseModel):
    __tablename__ = 'rbac_role_permission_groups'
    __table_args__ = (
        UniqueConstraint('role_id', 'permission_group_id', name='uq_rbac_role_permission_group'),
        {'comment': 'Junction mapping roles to permission groups'}
    )

    role_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('rbac_roles.id', ondelete='CASCADE'), index=True, nullable=False)
    permission_group_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('rbac_permission_groups.id', ondelete='CASCADE'), index=True, nullable=False)

    role: Mapped["Role"] = relationship("Role")
    permission_group: Mapped["PermissionGroup"] = relationship("PermissionGroup")
