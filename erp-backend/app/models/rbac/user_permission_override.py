import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Boolean, ForeignKey, UniqueConstraint
from app.models.core.mixins import BaseModel

class UserPermissionOverride(BaseModel):
    __tablename__ = 'rbac_user_permission_overrides'
    __table_args__ = (
        UniqueConstraint('user_id', 'permission_id', name='uq_rbac_user_permission_override'),
        {'comment': 'Explicitly grant or deny a permission for a specific user'}
    )

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True, nullable=False)
    permission_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('rbac_permissions.id', ondelete='CASCADE'), index=True, nullable=False)
    is_granted: Mapped[bool] = mapped_column(Boolean, nullable=False, comment="True = Explicit Grant, False = Explicit Deny")

    permission: Mapped["Permission"] = relationship("Permission")
