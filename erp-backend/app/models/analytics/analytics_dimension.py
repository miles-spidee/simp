from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Numeric
from app.models.core.mixins import BaseModel

class AnalyticsDimension(BaseModel):
    __tablename__ = 'analytics_dimensions'
    __table_args__ = {'comment': 'Dimensional metrics (e.g., Demographics, Module Usage)'}

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    value: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    percentage: Mapped[Optional[float]] = mapped_column(Numeric(5, 2))
