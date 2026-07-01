from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean
from app.models.core.mixins import BaseModel

class Role(BaseModel):
    __tablename__ = 'rbac_roles'
    __table_args__ = {'comment': 'System roles for RBAC'}

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(500))
    is_system: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, comment="System roles cannot be deleted")
