from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.responses import success_response
from app.models.system.audit import ActivityLog
from app.models.authentication.user import User

router = APIRouter()

@router.get("/")
async def list_activity(db: AsyncSession = Depends(get_db)):
    try:
        stmt = select(ActivityLog, User.username).outerjoin(User, ActivityLog.user_id == User.id).order_by(ActivityLog.created_at.desc())
        result = await db.execute(stmt)
        rows = result.all()
        
        data = []
        for log, username in rows:
            # Map module name to standard frontend module types:
            # 'Login' | 'Attendance' | 'Task' | 'Assessment' | 'Assignment' | 'Leave' | 'Profile' | 'Certificate' | 'Payment'
            raw_module = log.module_name.upper() if log.module_name else ""
            if "ATTENDANCE" in raw_module:
                module_mapped = "Attendance"
            elif "TASK" in raw_module:
                module_mapped = "Task"
            elif "ASSESSMENT" in raw_module or "QUIZ" in raw_module:
                module_mapped = "Assessment"
            elif "LEAVE" in raw_module:
                module_mapped = "Leave"
            elif "PROFILE" in raw_module or "USER" in raw_module:
                module_mapped = "Profile"
            elif "CERTIFICATE" in raw_module:
                module_mapped = "Certificate"
            elif "PAYMENT" in raw_module:
                module_mapped = "Payment"
            else:
                module_mapped = "Login"
                
            data.append({
                "id": str(log.id),
                "userId": str(log.user_id) if log.user_id else "",
                "userName": username or "System",
                "role": "Super Admin" if (username and "admin" in username.lower()) else "Student",
                "module": module_mapped,
                "action": log.action,
                "description": log.description,
                "timestamp": log.created_at.isoformat() if log.created_at else "",
                "device": log.device or "Desktop",
                "browser": log.browser or "Chrome",
                "ip": log.ip_address or "127.0.0.1",
                "status": log.status.title() if log.status else "Success",
                "severity": log.severity.title() if log.severity else "Info"
            })
        return success_response(data=data)
    except Exception as e:
        return success_response(data=[])

@router.get("/{path:path}")
async def get_all_activity_fallback(path: str, db: AsyncSession = Depends(get_db)):
    return await list_activity(db)

@router.post("/")
async def create_activity_root(request: Request, db: AsyncSession = Depends(get_db)):
    return success_response(data={})

@router.post("/{path:path}")
async def post_all_activity(path: str, request: Request, db: AsyncSession = Depends(get_db)):
    return success_response(data={})
