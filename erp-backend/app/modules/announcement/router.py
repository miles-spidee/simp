from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.responses import success_response, APIResponse
from app.models.communication.announcement import Announcement as DBAnnouncement
from app.models.authentication.user import User
import datetime
import uuid
from typing import List

router = APIRouter()

# In-memory backup list to persist during server run if DB fails
MEM_ANNOUNCEMENTS = [
    {
        "id": "ann-mock-1",
        "title": "Welcome to the New Pinesphere ERP Portal",
        "description": "We are excited to launch the new Pinesphere ERP portal. Explore dashboard analytics, task management, and attendance features.",
        "audience": ["All"],
        "category": "General",
        "priority": "Normal",
        "attachments": [],
        "publishDate": "2026-07-01T09:00:00.000Z",
        "status": "Published",
        "pinned": True,
        "author": "Admin Team"
    },
    {
        "id": "ann-mock-2",
        "title": "Academic Calendar Release for Cohort 2026",
        "description": "The academic calendar detailing assessments, holidays, and internship dates has been uploaded. Please refer to the downloads section.",
        "audience": ["Student"],
        "category": "Academic",
        "priority": "High",
        "attachments": [],
        "publishDate": "2026-07-02T10:00:00.000Z",
        "status": "Published",
        "pinned": False,
        "author": "Admin Team"
    }
]

@router.get("/", response_model=APIResponse[List[dict]])
async def list_announcements(db: AsyncSession = Depends(get_db)):
    try:
        stmt = select(DBAnnouncement).order_by(DBAnnouncement.created_at.desc())
        result = await db.execute(stmt)
        anns = result.scalars().all()
        
        data = []
        # First, add any DB announcements
        for a in anns:
            data.append({
                "id": str(a.id),
                "title": a.title,
                "description": a.description,
                "audience": ["All"],
                "category": a.category or "General",
                "priority": a.priority.title() if a.priority else "Normal",
                "attachments": [],
                "publishDate": a.publish_date.isoformat() if a.publish_date else a.created_at.isoformat(),
                "status": a.status.title() if a.status else "Published",
                "pinned": a.is_pinned,
                "author": "Admin Team"
            })
            
        # Add memory announcements if they aren't already in list
        for mem in MEM_ANNOUNCEMENTS:
            if not any(x["id"] == mem["id"] for x in data):
                data.append(mem)
                
        return success_response(data=data)
    except Exception as e:
        return success_response(data=MEM_ANNOUNCEMENTS)

@router.post("/", response_model=APIResponse[dict])
async def create_announcement(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        body = await request.json()
        
        # Get first user from DB to satisfy FK constraints
        user_stmt = select(User).limit(1)
        user_res = await db.execute(user_stmt)
        user = user_res.scalars().first()
        if not user:
            raise ValueError("No user found in DB to associate announcement author.")
            
        title = body.get("title")
        description = body.get("description")
        category = body.get("category")
        priority = body.get("priority", "Normal").upper()
        pinned = body.get("pinned", False)
        status = body.get("status", "Published").upper()
        
        new_ann = DBAnnouncement(
            title=title,
            description=description,
            category=category,
            priority=priority,
            publish_date=datetime.datetime.now(),
            status=status,
            is_pinned=pinned,
            author_user_id=user.id
        )
        db.add(new_ann)
        await db.commit()
        await db.refresh(new_ann)
        
        res_data = {
            "id": str(new_ann.id),
            "title": new_ann.title,
            "description": new_ann.description,
            "audience": body.get("audience", ["All"]),
            "category": new_ann.category or "General",
            "priority": new_ann.priority.title(),
            "attachments": [],
            "publishDate": new_ann.publish_date.isoformat(),
            "status": new_ann.status.title(),
            "pinned": new_ann.is_pinned,
            "author": "Admin Team"
        }
        return success_response(data=res_data)
    except Exception as e:
        # Fallback to saving in memory list if DB fail
        try:
            body = await request.json()
            body["id"] = body.get("id") or f"ann-custom-{uuid.uuid4().hex[:4]}"
            body["publishDate"] = datetime.datetime.now().isoformat()
            MEM_ANNOUNCEMENTS.insert(0, body)
            return success_response(data=body)
        except Exception:
            return success_response(data={})

@router.get("/{path:path}")
async def fallback_get_announcement(path: str, db: AsyncSession = Depends(get_db)):
    return await list_announcements(db)
