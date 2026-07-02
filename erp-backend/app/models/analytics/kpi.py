import uuid
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Numeric
from app.models.core.mixins import BaseModel

class KPIMetric(BaseModel):
    __tablename__ = 'analytics_kpis'
    __table_args__ = {'comment': 'Key Performance Indicators tracking'}

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    current_value: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False, default=0.0)
    target_value: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False, default=100.0)
    unit: Mapped[str] = mapped_column(String(50), nullable=False, default="%")
    trend: Mapped[str] = mapped_column(String(20), default="flat") # up, down, flat
    trend_percentage: Mapped[float] = mapped_column(Numeric(5, 2), default=0.0)
    status: Mapped[str] = mapped_column(String(50), default="on_track") # on_track, at_risk, behind
