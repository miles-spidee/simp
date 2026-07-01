from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Numeric
from app.models.core.mixins import BaseModel

class ExecutiveMetric(BaseModel):
    __tablename__ = 'analytics_executive_metrics'
    __table_args__ = {'comment': 'High-level executive dashboard metrics'}

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    value: Mapped[str] = mapped_column(String(255), nullable=False)
    change_value: Mapped[Optional[float]] = mapped_column(Numeric(10, 2))
    change_type: Mapped[Optional[str]] = mapped_column(String(50), comment="increase, decrease, neutral")
    timeframe: Mapped[Optional[str]] = mapped_column(String(255))
