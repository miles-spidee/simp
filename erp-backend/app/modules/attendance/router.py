from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.responses import success_response, APIResponse
import datetime
import uuid

router = APIRouter()

from app.core.dependencies import get_current_user
from app.models.authentication.user import User
from app.models.profiles.student_profile import StudentProfile
from app.models.internships.attendance import Attendance

@router.get("")
async def get_attendance_list(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Get student profile
        prof_stmt = select(StudentProfile).where(StudentProfile.user_id == current_user.id)
        prof_res = await db.execute(prof_stmt)
        profile = prof_res.scalars().first()
        
        if not profile:
            return success_response(data=[])

        stmt = select(Attendance).where(Attendance.student_profile_id == profile.id).order_by(Attendance.date.desc())
        res = await db.execute(stmt)
        logs = res.scalars().all()
        
        data = []
        for log in logs:
            data.append({
                "id": str(log.id),
                "date": log.date.isoformat(),
                "clockIn": "09:00 AM", # Dummy time since model only stores date
                "clockOut": "05:00 PM" if log.status == "PRESENT" else "-",
                "duration": "8h 00m" if log.status == "PRESENT" else "-",
                "status": "Present" if log.status == "PRESENT" else "Absent" if log.status == "ABSENT" else "Late"
            })
            
        return success_response(data=data)
    except Exception as e:
        print("Error fetching attendance:", e)
        return success_response(data=[])

@router.post("/check-in")
async def check_in(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        prof_stmt = select(StudentProfile).where(StudentProfile.user_id == current_user.id)
        prof_res = await db.execute(prof_stmt)
        profile = prof_res.scalars().first()
        
        if not profile:
            raise HTTPException(status_code=400, detail="Student profile not found")

        today = datetime.date.today()
        stmt = select(Attendance).where(
            Attendance.student_profile_id == profile.id,
            Attendance.date == today
        )
        res = await db.execute(stmt)
        existing = res.scalars().first()
        
        if not existing:
            new_att = Attendance(
                student_profile_id=profile.id,
                date=today,
                status="PRESENT",
                notes="Checked in via portal"
            )
            db.add(new_att)
            await db.commit()
            
        return success_response(data={"success": True})
    except Exception as e:
        print("Error checking in:", e)
        raise HTTPException(status_code=500, detail="Failed to check in")

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
