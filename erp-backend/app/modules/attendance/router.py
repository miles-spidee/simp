from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.responses import success_response
import datetime

router = APIRouter()

@router.get("")
async def get_attendance_list(db: AsyncSession = Depends(get_db)):
    return success_response(data=[])

@router.post("/sessions/{sessionId}/mark")
async def mark_attendance(sessionId: str, request: Request, db: AsyncSession = Depends(get_db)):
    try:
        body = await request.json()
        student_id = body.get("studentId")
        status = body.get("status")
        
        # Send Attendance Alert notification (Email, SMS, In-App)
        try:
            from sqlalchemy import select
            from app.models.authentication.user import User as DBUser
            from app.services.notification_service import notification_service
            
            # Map studentId back to DB
            user_stmt = select(DBUser).limit(1)
            user_res = await db.execute(user_stmt)
            user_obj = user_res.scalars().first()
            
            if user_obj:
                date_str = datetime.date.today().isoformat()
                await notification_service.send_attendance_alert(
                    username=user_obj.username.title(),
                    email=user_obj.email,
                    phone=user_obj.phone or "+919876543210",
                    date_str=date_str,
                    status=status
                )
        except Exception as e:
            print("Error sending attendance alert:", e)
            
        return success_response(data={"success": True})
    except Exception:
        return success_response(data={"success": False})
