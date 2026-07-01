from datetime import date
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Numeric, Date
from app.models.core.mixins import BaseModel

class AnalyticsDataPoint(BaseModel):
    __tablename__ = 'analytics_data_points'
    __table_args__ = {'comment': 'Time-series data points for analytics charts'}

    record_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    value: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    category: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
