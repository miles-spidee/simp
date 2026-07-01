from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Boolean
from app.models.core.mixins import BaseModel

class Currency(BaseModel):
    __tablename__ = 'ref_currencies'
    __table_args__ = {'comment': 'Master list of currencies for global support'}

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    code: Mapped[str] = mapped_column(String(3), unique=True, nullable=False)
    symbol: Mapped[str] = mapped_column(String(10), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class Language(BaseModel):
    __tablename__ = 'ref_languages'
    __table_args__ = {'comment': 'Master list of languages'}

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
