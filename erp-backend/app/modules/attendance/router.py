from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

from app.core.responses import success_response

router = APIRouter()

@router.get("/")
async def get_attendance_list(db: AsyncSession = Depends(get_db)):
    return success_response(data=[])
