import uuid
from typing import Optional, List
from datetime import date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Numeric, Date, ForeignKey
from app.models.core.mixins import BaseModel

class Invoice(BaseModel):
    __tablename__ = 'fin_invoices'
    __table_args__ = {'comment': 'Client or student invoices'}

    invoice_number: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    # Could be a student or a company. We use a generic reference or specific FKs.
    student_profile_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('profile_students.id', ondelete='CASCADE'), index=True)
    company_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('comp_companies.id', ondelete='CASCADE'), index=True)

    sub_total: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    tax_amount: Mapped[float] = mapped_column(Numeric(15, 2), default=0)
    discount: Mapped[float] = mapped_column(Numeric(15, 2), default=0)
    grand_total: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    
    payment_status: Mapped[str] = mapped_column(String(50), nullable=False, default="UNPAID", comment="UNPAID, PARTIAL, PAID")
    issue_date: Mapped[date] = mapped_column(Date, nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)

    items: Mapped[List["InvoiceItem"]] = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan")

class InvoiceItem(BaseModel):
    __tablename__ = 'fin_invoice_items'
    __table_args__ = {'comment': 'Line items for an invoice'}

    invoice_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('fin_invoices.id', ondelete='CASCADE'), index=True, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)

    invoice: Mapped["Invoice"] = relationship("Invoice", back_populates="items")
