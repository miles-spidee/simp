from fastapi import APIRouter, Depends, Request
from app.core.responses import success_response, APIResponse
import datetime
import uuid
from typing import List

router = APIRouter()

NOTIFICATIONS = [
    {
        "id": "notif-1",
        "title": "Welcome to Pinesphere ERP",
        "message": "Your profile has been created successfully. Welcome aboard!",
        "recipient": "ananya.desai@gmail.com",
        "role": "Student",
        "module": "Profile",
        "channel": "In-App Notification",
        "priority": "Low",
        "status": "Delivered",
        "readStatus": False,
        "retryCount": 0,
        "createdTime": "2026-07-01T09:00:00.000Z"
    },
    {
        "id": "notif-2",
        "title": "Assignment Sprint 1 Due Tomorrow",
        "message": "Please submit your Sprint 1 task before tomorrow night.",
        "recipient": "ananya.desai@gmail.com",
        "role": "Student",
        "module": "Task",
        "channel": "In-App Notification",
        "priority": "High",
        "status": "Delivered",
        "readStatus": False,
        "retryCount": 0,
        "createdTime": "2026-07-02T10:00:00.000Z"
    }
]

@router.get("/", response_model=APIResponse[List[dict]])
async def list_notifications():
    return success_response(data=NOTIFICATIONS)

@router.post("/", response_model=APIResponse[dict])
async def create_notification(request: Request):
    try:
        body = await request.json()
        body["id"] = body.get("id") or f"notif-{uuid.uuid4().hex[:4]}"
        body["createdTime"] = datetime.datetime.now().isoformat()
        body["readStatus"] = False
        body["retryCount"] = 0
        
        NOTIFICATIONS.insert(0, body)
        return success_response(data=body)
    except Exception:
        return success_response(data={})

@router.patch("/{id}", response_model=APIResponse[dict])
async def update_notification_status(id: str, request: Request):
    try:
        body = await request.json()
        for n in NOTIFICATIONS:
            if n["id"] == id:
                n["readStatus"] = body.get("readStatus", True)
                n["status"] = body.get("status", "Read")
                return success_response(data=n)
        return success_response(data={})
    except Exception:
        return success_response(data={})
        
@router.get("/{path:path}")
async def fallback_get_notification(path: str):
    return await list_notifications()

@router.patch("/{path:path}")
async def fallback_patch_notification(path: str, request: Request):
    parts = path.split("/")
    id_val = parts[0] if parts else path
    return await update_notification_status(id_val, request)
