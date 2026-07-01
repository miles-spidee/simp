import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, ForeignKey
from app.models.core.mixins import BaseModel

class Country(BaseModel):
    __tablename__ = 'ref_countries'
    __table_args__ = {'comment': 'Master list of countries'}

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    iso_code_2: Mapped[str] = mapped_column(String(2), unique=True, nullable=False)
    iso_code_3: Mapped[str] = mapped_column(String(3), unique=True, nullable=False)
    phone_code: Mapped[str] = mapped_column(String(20), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    states = relationship("State", back_populates="country", cascade="save-update, merge")


class State(BaseModel):
    __tablename__ = 'ref_states'
    __table_args__ = {'comment': 'Master list of states/provinces'}

    country_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('ref_countries.id', ondelete='RESTRICT'), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(10), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    country = relationship("Country", back_populates="states")
    cities = relationship("City", back_populates="state", cascade="save-update, merge")


class City(BaseModel):
    __tablename__ = 'ref_cities'
    __table_args__ = {'comment': 'Master list of cities'}

    state_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('ref_states.id', ondelete='RESTRICT'), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    state = relationship("State", back_populates="cities")


class Timezone(BaseModel):
    __tablename__ = 'ref_timezones'
    __table_args__ = {'comment': 'Master list of global timezones'}

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, comment="e.g., UTC, Asia/Kolkata")
    offset: Mapped[str] = mapped_column(String(10), nullable=False, comment="e.g., +05:30")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
