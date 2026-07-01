import uuid
from typing import Optional
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Date, ForeignKey, Numeric
from app.models.core.mixins import BaseModel

class LeaveBalance(BaseModel):
    __tablename__ = 'hr_leave_balances'
    __table_args__ = {'comment': 'Annual leave quotas for employees'}

    employee_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('profile_employees.id', ondelete='CASCADE'), index=True, nullable=False)
    leave_type: Mapped[str] = mapped_column(String(50), nullable=False, comment="SICK, CASUAL, ANNUAL")
    total_days: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    used_days: Mapped[float] = mapped_column(Numeric(5, 2), default=0)

class LeaveRequest(BaseModel):
    __tablename__ = 'hr_leave_requests'
    __table_args__ = {'comment': 'Leave requests by employees'}

    employee_profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('profile_employees.id', ondelete='CASCADE'), index=True, nullable=False)
    leave_type: Mapped[str] = mapped_column(String(50), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="PENDING", comment="PENDING, APPROVED, REJECTED")
    approved_by_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('auth_users.id', ondelete='SET NULL'))
