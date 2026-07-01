from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Numeric
from app.models.core.mixins import BaseModel

class AnalyticsSummary(BaseModel):
    __tablename__ = 'analytics_summaries'
    __table_args__ = {'comment': 'Aggregated snapshot metrics'}

    total_students: Mapped[int] = mapped_column(Numeric, default=0)
    active_interns: Mapped[int] = mapped_column(Numeric, default=0)
    completion_rate: Mapped[float] = mapped_column(Numeric(5, 2), default=0)
    attendance_rate: Mapped[float] = mapped_column(Numeric(5, 2), default=0)
    average_score: Mapped[float] = mapped_column(Numeric(5, 2), default=0)
    placement_rate: Mapped[float] = mapped_column(Numeric(5, 2), default=0)
    revenue: Mapped[float] = mapped_column(Numeric(15, 2), default=0)
    certificates_issued: Mapped[int] = mapped_column(Numeric, default=0)
