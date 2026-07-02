from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class CalendarEventBase(BaseModel):
    title: str
    description: Optional[str] = None
    type: str
    start_time: datetime = Field(alias='startTime')
    end_time: datetime = Field(alias='endTime')
    location: Optional[str] = None
    meeting_link: Optional[str] = Field(None, alias='meetingLink')
    participants: Optional[List[str]] = None
    status: str

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class CalendarEventCreate(CalendarEventBase):
    pass

class CalendarEventResponse(CalendarEventBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config(CalendarEventBase.Config):
        orm_mode = True
        from_attributes = True
