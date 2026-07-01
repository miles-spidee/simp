import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UniqueConstraint
from app.models.core.mixins import BaseModel

class UserRole(BaseModel):
    __tablename__ = 'rbac_user_roles'
    __table_args__ = (
        UniqueConstraint('user_id', 'role_id', name='uq_rbac_user_role'),
        {'comment': 'Junction mapping users to roles'}
    )

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True, nullable=False)
    role_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('rbac_roles.id', ondelete='CASCADE'), index=True, nullable=False)

    role: Mapped["Role"] = relationship("Role")
    # Note: user relationship will be configured in the auth module or dynamically loaded
