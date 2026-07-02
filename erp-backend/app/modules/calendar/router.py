from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from typing import List
from app.core.database import get_db
from app.models.communication.calendar import CalendarEvent
from app.modules.calendar.schemas import CalendarEventCreate, CalendarEventResponse

router = APIRouter()

@router.get("/events")
async def get_events(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CalendarEvent).order_by(CalendarEvent.start_time))
    events = result.scalars().all()
    # Serialize with aliases for camelCase
    serialized_events = [CalendarEventResponse.model_validate(e).model_dump(by_alias=True, mode='json') for e in events]
    return {"data": serialized_events}

@router.post("/events")
async def create_event(event: CalendarEventCreate, db: AsyncSession = Depends(get_db)):
    new_event = CalendarEvent(
        title=event.title,
        description=event.description,
        type=event.type,
        start_time=event.start_time,
        end_time=event.end_time,
        location=event.location,
        meeting_link=event.meeting_link,
        participants=event.participants,
        status=event.status
    )
    db.add(new_event)
    await db.commit()
    await db.refresh(new_event)
    serialized_event = CalendarEventResponse.model_validate(new_event).model_dump(by_alias=True, mode='json')
    return {"success": True, "message": "Event created", "data": serialized_event}
