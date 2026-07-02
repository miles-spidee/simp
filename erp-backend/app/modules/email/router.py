from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from typing import List
from app.core.database import get_db
from app.models.communication.email import EmailTemplate, EmailHistory
from app.modules.email.schemas import EmailTemplateCreate, EmailTemplateResponse, EmailHistoryResponse

router = APIRouter()

@router.get("/templates")
async def get_templates(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EmailTemplate).order_by(desc(EmailTemplate.created_at)))
    templates = result.scalars().all()
    serialized = [EmailTemplateResponse.model_validate(t).model_dump(by_alias=True, mode='json') for t in templates]
    return {"data": serialized}

@router.post("/templates")
async def create_template(template: EmailTemplateCreate, db: AsyncSession = Depends(get_db)):
    new_template = EmailTemplate(
        name=template.name,
        category=template.category,
        subject=template.subject,
        html_body=template.html_body,
        status=template.status,
        variables=template.variables
    )
    db.add(new_template)
    await db.commit()
    await db.refresh(new_template)
    serialized = EmailTemplateResponse.model_validate(new_template).model_dump(by_alias=True, mode='json')
    return {"success": True, "message": "Template created", "data": serialized}

@router.get("/history")
async def get_history(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EmailHistory).order_by(desc(EmailHistory.created_at)))
    history = result.scalars().all()
    serialized = [EmailHistoryResponse.model_validate(h).model_dump(by_alias=True, mode='json') for h in history]
    return {"data": serialized}
