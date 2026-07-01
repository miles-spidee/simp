from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Boolean
from app.models.core.mixins import BaseModel

class Gender(BaseModel):
    __tablename__ = 'ref_genders'
    __table_args__ = {'comment': 'Master list of gender identities'}

    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class BloodGroup(BaseModel):
    __tablename__ = 'ref_blood_groups'
    __table_args__ = {'comment': 'Master list of blood groups for medical emergencies'}

    name: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
