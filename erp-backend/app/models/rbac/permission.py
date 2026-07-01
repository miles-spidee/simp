import uuid
from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, UniqueConstraint
from app.models.core.mixins import BaseModel

class Permission(BaseModel):
    __tablename__ = 'rbac_permissions'
    __table_args__ = (
        UniqueConstraint('feature_id', 'action_id', name='uq_rbac_permission_feature_action'),
        {'comment': 'Granular permissions combining a feature and an action'}
    )

    feature_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('rbac_features.id', ondelete='CASCADE'), index=True, nullable=False)
    action_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('rbac_actions.id', ondelete='CASCADE'), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(500))

    feature: Mapped["Feature"] = relationship("Feature", back_populates="permissions")
    action: Mapped["Action"] = relationship("Action", back_populates="permissions")
