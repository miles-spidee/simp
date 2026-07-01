import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, ForeignKey
from app.models.core.mixins import BaseModel

class IdcardTemplate(BaseModel):
    __tablename__ = 'sys_idcard_templates'
    __table_args__ = {'comment': 'Templates for generating ID Cards'}

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    front_design_url: Mapped[Optional[str]] = mapped_column(String(500))
    back_design_url: Mapped[Optional[str]] = mapped_column(String(500))
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE")
