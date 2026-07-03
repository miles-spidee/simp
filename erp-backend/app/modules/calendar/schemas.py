from typing import List, Optional
from pydantic import BaseModel, Field, field_validator
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

    @field_validator('participants', mode='before')
    @classmethod
    def parse_participants(cls, v):
        if v is None:
            return []
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            v_stripped = v.strip()
            if not v_stripped:
                return []
            if v_stripped.startswith('[') and v_stripped.endswith(']'):
                import json
                try:
                    parsed = json.loads(v_stripped)
                    if isinstance(parsed, list):
                        return [str(item) for item in parsed]
                except Exception:
                    pass
            return [p.strip() for p in v_stripped.split(",") if p.strip()]
        return [str(v)]

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
