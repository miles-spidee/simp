import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UniqueConstraint
from app.models.core.mixins import BaseModel

class UserModule(BaseModel):
    __tablename__ = 'rbac_user_modules'
    __table_args__ = (
        UniqueConstraint('user_id', 'module_id', name='uq_rbac_user_module'),
        {'comment': 'Junction mapping explicit module grants to users'}
    )

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('auth_users.id', ondelete='CASCADE'), index=True, nullable=False)
    module_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('rbac_modules.id', ondelete='CASCADE'), index=True, nullable=False)

    module: Mapped["Module"] = relationship("Module")
