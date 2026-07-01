from typing import Optional, List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String
from app.models.core.mixins import BaseModel

class Action(BaseModel):
    __tablename__ = 'rbac_actions'
    __table_args__ = {'comment': 'Standardized system actions (e.g., CREATE, READ, UPDATE, DELETE)'}

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(500))

    permissions: Mapped[List["Permission"]] = relationship("Permission", back_populates="action")
