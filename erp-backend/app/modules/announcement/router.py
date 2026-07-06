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


@router.get("", response_model=APIResponse[List[dict]])
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
            
        return success_response(data=data)
    except Exception as e:
        return success_response(data=[])

@router.post("", response_model=APIResponse[dict])
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
        
        # Resolve recipient users based on audience
        audience = body.get("audience", ["All"])
        target_users = []
        try:
            from app.models.rbac.role import Role
            from app.models.rbac.user_role import UserRole

            if not audience or "All" in audience or "ALL" in audience:
                stmt = select(User)
                res = await db.execute(stmt)
                target_users = res.scalars().all()
            else:
                # Map frontend roles to backend role codes
                role_mappings = {
                    "Student": "STUDENT",
                    "Mentor": "MENTOR",
                    "HR": "HR",
                    "College Coordinator": "ORG_COORDINATOR"
                }
                codes = [role_mappings[r] for r in audience if r in role_mappings]
                if codes:
                    stmt = select(User).join(UserRole, UserRole.user_id == User.id).join(Role, Role.id == UserRole.role_id).where(Role.code.in_(codes))
                    res = await db.execute(stmt)
                    target_users = res.scalars().all()
        except Exception as err:
            print("Error resolving audience users:", err)

        # Trigger notification channels based on checklist
        channels = body.get("channels", [])
        from app.services.email_service import email_service
        from app.services.sms_service import sms_service
        from app.services.whatsapp_service import whatsapp_service

        # Collect email recipients and send as a single BCC broadcast
        email_recipients = [u.email for u in target_users if u.email]
        if "Email" in channels and email_recipients:
            try:
                await email_service.send_email(
                    email_recipients,
                    f"Announcement: {title}",
                    f"<h2>{title}</h2><p>{description}</p>"
                )
            except Exception as err:
                print("Error sending announcement email broadcast:", err)

        for u in target_users:
            if "SMS" in channels and u.phone:
                try:
                    await sms_service.send_sms(
                        u.phone,
                        f"Announcement: {title}. {description[:100]}"
                    )
                except Exception as err:
                    print("Error sending announcement SMS:", err)
            if "WhatsApp" in channels and u.phone:
                try:
                    await whatsapp_service.send_message(
                        u.phone,
                        f"Announcement: {title}. {description[:100]}"
                    )
                except Exception as err:
                    print("Error sending announcement WhatsApp:", err)

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
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{path:path}")
async def fallback_get_announcement(path: str, db: AsyncSession = Depends(get_db)):
    return await list_announcements(db)
