import csv
import io
from typing import Optional
from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
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

@router.get("/export")
async def export_activity(
    status: Optional[str] = None,
    module: Optional[str] = None,
    severity: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    try:
        stmt = select(ActivityLog, User.username).outerjoin(User, ActivityLog.user_id == User.id).order_by(ActivityLog.created_at.desc())
        result = await db.execute(stmt)
        rows = result.all()
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write headers
        writer.writerow([
            "ID", "User ID", "Username", "Role", "Module", 
            "Action", "Description", "Timestamp", "Device", 
            "Browser", "IP Address", "Status", "Severity"
        ])
        
        for log, username in rows:
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
                
            status_mapped = log.status.title() if log.status else "Success"
            severity_mapped = log.severity.title() if log.severity else "Info"
            username_val = username or "System"
            role = "Super Admin" if (username and "admin" in username.lower()) else "Student"
            
            # Check filters
            if status and status != "All" and status_mapped.lower() != status.lower():
                continue
            if module and module != "All" and module_mapped.lower() != module.lower():
                continue
            if severity and severity != "All" and severity_mapped.lower() != severity.lower():
                continue
            if search:
                search_lower = search.lower()
                matches_search = (
                    search_lower in username_val.lower() or
                    search_lower in (log.action or "").lower() or
                    search_lower in (log.description or "").lower()
                )
                if not matches_search:
                    continue
            
            writer.writerow([
                str(log.id),
                str(log.user_id) if log.user_id else "",
                username_val,
                role,
                module_mapped,
                log.action,
                log.description,
                log.created_at.isoformat() if log.created_at else "",
                log.device or "Desktop",
                log.browser or "Chrome",
                log.ip_address or "127.0.0.1",
                status_mapped,
                severity_mapped
            ])
            
        csv_data = output.getvalue()
        output.close()
        
        return StreamingResponse(
            io.BytesIO(csv_data.encode("utf-8")),
            media_type="text/csv",
            headers={"Content-Disposition": 'attachment; filename="activity_logs.csv"'}
        )
    except Exception as e:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Error exporting activity logs"])
        writer.writerow([str(e)])
        csv_data = output.getvalue()
        output.close()
        return StreamingResponse(
            io.BytesIO(csv_data.encode("utf-8")),
            media_type="text/csv",
            headers={"Content-Disposition": 'attachment; filename="activity_logs_error.csv"'}
        )

@router.get("/{path:path}")
async def get_all_activity_fallback(path: str, db: AsyncSession = Depends(get_db)):
    return await list_activity(db)

@router.post("/")
async def create_activity_root(request: Request, db: AsyncSession = Depends(get_db)):
    return success_response(data={})

@router.post("/{path:path}")
async def post_all_activity(path: str, request: Request, db: AsyncSession = Depends(get_db)):
    return success_response(data={})
