from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Boolean
from app.models.core.mixins import BaseModel

class Setting(BaseModel):
    __tablename__ = 'sys_settings'
    __table_args__ = {'comment': 'Global configuration settings'}

    key: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    is_system: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class DocumentType(BaseModel):
    __tablename__ = 'ref_document_types'
    __table_args__ = {'comment': 'Types of documents (Resume, ID, Certificate, etc)'}

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class NotificationType(BaseModel):
    __tablename__ = 'ref_notification_types'
    __table_args__ = {'comment': 'Channels for notifications (Email, SMS, Push)'}

    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
