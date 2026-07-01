from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text
from app.models.core.mixins import BaseModel

class RiskIndicator(BaseModel):
    __tablename__ = 'analytics_risk_indicators'
    __table_args__ = {'comment': 'Identified institutional risks and mitigations'}

    department_name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    risk_level: Mapped[str] = mapped_column(String(50), nullable=False, comment="Low, Medium, High, Critical")
    description: Mapped[str] = mapped_column(Text, nullable=False)
    mitigation: Mapped[Optional[str]] = mapped_column(Text)
