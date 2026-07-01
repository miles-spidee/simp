import uuid
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Numeric, ForeignKey
from app.models.core.mixins import BaseModel

class FeeStructure(BaseModel):
    __tablename__ = 'fin_fee_structures'
    __table_args__ = {'comment': 'Master fee definitions per program or batch'}

    fee_name: Mapped[str] = mapped_column(String(255), nullable=False)
    fee_type: Mapped[str] = mapped_column(String(100), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    
    program_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('acad_programs.id', ondelete='CASCADE'), index=True)
    batch_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('acad_batches.id', ondelete='CASCADE'), index=True)
    
    installments: Mapped[int] = mapped_column(Numeric, default=1)
