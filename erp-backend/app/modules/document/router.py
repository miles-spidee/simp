import io
import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.core.responses import success_response
from app.core.security import hash_password
from app.models.system.document import DocumentTemplate, GeneratedDocument
from app.models.authentication.user import User
from app.models.core.reference.system import DocumentType
from app.utils.pdf_generator import (
    generate_offer_letter,
    generate_joining_letter,
    generate_completion_certificate,
    generate_recommendation_letter
)

router = APIRouter()

# Schema definitions
class GenerateDocumentRequest(BaseModel):
    studentName: str
    program: str
    type: str # Document template type/name
    metadata: Optional[dict] = {}

class StatusUpdateRequest(BaseModel):
    status: str

@router.get("")
async def list_generated_documents(db: AsyncSession = Depends(get_db)):
    try:
        # Fetch generated documents
        stmt = select(GeneratedDocument, DocumentTemplate, User).join(
            DocumentTemplate, GeneratedDocument.template_id == DocumentTemplate.id
        ).join(
            User, GeneratedDocument.user_id == User.id
        )
        res = await db.execute(stmt)
        records = res.all()
        
        data = []
        for doc, tpl, user in records:
            data.append({
                "id": str(doc.id),
                "templateId": str(doc.template_id),
                "studentId": str(doc.user_id),
                "studentName": user.username,
                "program": "Full Stack Web Development",
                "type": tpl.name,
                "status": doc.status,
                "generatedDate": doc.created_at.isoformat() if doc.created_at else datetime.now().isoformat(),
                "version": "v1.2",
                "fileUrl": doc.file_url,
                "metadata": {
                    "generatedBy": "Administrator Console",
                    "stipend": "15000"
                }
            })
            
        # Seed default items if registry is empty
        if not data:
            # Let's seed a template and a default generated document
            tpl_stmt = select(DocumentTemplate).limit(1)
            tpl_res = await db.execute(tpl_stmt)
            tpl = tpl_res.scalars().first()
            
            user_stmt = select(User).limit(1)
            user_res = await db.execute(user_stmt)
            usr = user_res.scalars().first()
            
            if tpl and usr:
                doc = GeneratedDocument(
                    template_id=tpl.id,
                    user_id=usr.id,
                    file_url="https://example.com/docs/offer-letter-harin.pdf",
                    status="Generated"
                )
                db.add(doc)
                await db.commit()
                await db.refresh(doc)
                
                data.append({
                    "id": str(doc.id),
                    "templateId": str(doc.template_id),
                    "studentId": str(doc.user_id),
                    "studentName": usr.username,
                    "program": "Data Science & Machine Learning",
                    "type": tpl.name,
                    "status": doc.status,
                    "generatedDate": datetime.now().isoformat(),
                    "version": "v1.0",
                    "fileUrl": doc.file_url,
                    "metadata": {
                        "generatedBy": "System Admin",
                        "stipend": "18000"
                    }
                })
        return success_response(data=data)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return success_response(data=[])

@router.get("/templates")
async def list_document_templates(db: AsyncSession = Depends(get_db)):
    try:
        # If no templates, seed default ones
        count_stmt = select(func.count(DocumentTemplate.id))
        count_res = await db.execute(count_stmt)
        if count_res.scalar() == 0:
            # Get or create DocumentType reference
            type_stmt = select(DocumentType).limit(1)
            type_res = await db.execute(type_stmt)
            doc_type = type_res.scalars().first()
            if not doc_type:
                doc_type = DocumentType(name="Official Letter", is_active=True)
                db.add(doc_type)
                await db.flush()
                
            templates = [
                DocumentTemplate(name="Offer Letter", document_type_id=doc_type.id, description="Standard training offer letter with stipend terms and conditions.", variables=["student_name", "program", "stipend"]),
                DocumentTemplate(name="Joining Letter", document_type_id=doc_type.id, description="Formal joining confirmation letter indicating official start date.", variables=["student_name", "program"]),
                DocumentTemplate(name="Completion Certificate", document_type_id=doc_type.id, description="Official internship completion certificate.", variables=["student_name", "program", "duration"]),
                DocumentTemplate(name="Recommendation Letter", document_type_id=doc_type.id, description="Performance based candidate referral recommendation letter.", variables=["student_name", "program"]),
            ]
            db.add_all(templates)
            await db.commit()

        stmt = select(DocumentTemplate)
        res = await db.execute(stmt)
        templates = res.scalars().all()
        
        data = []
        for t in templates:
            data.append({
                "id": str(t.id),
                "name": t.name,
                "type": t.name,
                "description": t.description or "",
                "version": "v1.2",
                "variables": t.variables or ["student_name", "program", "stipend"],
                "lastUpdated": datetime.now().isoformat()
            })
        return success_response(data=data)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return success_response(data=[])

@router.post("")
async def generate_document(payload: GenerateDocumentRequest, db: AsyncSession = Depends(get_db)):
    try:
        # Resolve user
        user_stmt = select(User).where(User.username == payload.studentName)
        user_res = await db.execute(user_stmt)
        user = user_res.scalars().first()
        if not user:
            user = User(
                username=payload.studentName,
                email=f"{payload.studentName.lower().replace(' ', '.')}@example.com",
                password_hash=hash_password("UserFallback@123"),
                account_status="ACTIVE",
                email_verified=True,
                phone_verified=True
            )
            db.add(user)
            await db.flush()
            
        # Resolve template
        tpl_stmt = select(DocumentTemplate).where(DocumentTemplate.name == payload.type)
        tpl_res = await db.execute(tpl_stmt)
        template = tpl_res.scalars().first()
        if not template:
            # Fallback to first template or create
            tpl_all = await db.execute(select(DocumentTemplate).limit(1))
            template = tpl_all.scalars().first()
            if not template:
                # Create default
                type_res = await db.execute(select(DocumentType).limit(1))
                doc_type = type_res.scalars().first()
                if not doc_type:
                    doc_type = DocumentType(name="Official Letter", is_active=True)
                    db.add(doc_type)
                    await db.flush()
                template = DocumentTemplate(
                    name=payload.type,
                    document_type_id=doc_type.id,
                    description=f"{payload.type} Template",
                    variables=["student_name", "program", "stipend"]
                )
                db.add(template)
                await db.flush()
        
        doc = GeneratedDocument(
            template_id=template.id,
            user_id=user.id,
            file_url="",  # Will be set after commit with real ID
            status="Generated"
        )
        db.add(doc)
        await db.commit()
        await db.refresh(doc)
        
        # Set download URL to real backend endpoint
        doc.file_url = f"/api/v1/document/{doc.id}/download"
        await db.commit()
        
        return success_response(data={
            "id": str(doc.id),
            "templateId": str(doc.template_id),
            "studentId": str(doc.user_id),
            "studentName": user.username,
            "program": payload.program,
            "type": template.name,
            "status": doc.status,
            "generatedDate": datetime.now().isoformat(),
            "version": "v1.2",
            "fileUrl": doc.file_url,
            "metadata": payload.metadata or {}
        })
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{doc_id}/status")
async def update_document_status(doc_id: uuid.UUID, payload: StatusUpdateRequest, db: AsyncSession = Depends(get_db)):
    try:
        stmt = select(GeneratedDocument).where(GeneratedDocument.id == doc_id)
        res = await db.execute(stmt)
        doc = res.scalars().first()
        if not doc:
            raise HTTPException(status_code=404, detail="Generated document not found")
        
        doc.status = payload.status
        await db.commit()
        await db.refresh(doc)
        
        # Get template and user info for the response mapping
        tpl_stmt = select(DocumentTemplate).where(DocumentTemplate.id == doc.template_id)
        tpl_res = await db.execute(tpl_stmt)
        tpl = tpl_res.scalars().first()
        
        user_stmt = select(User).where(User.id == doc.user_id)
        user_res = await db.execute(user_stmt)
        user = user_res.scalars().first()
        
        return success_response(data={
            "id": str(doc.id),
            "templateId": str(doc.template_id),
            "studentId": str(doc.user_id),
            "studentName": user.username if user else "Unknown Student",
            "program": "Full Stack Web Development",
            "type": tpl.name if tpl else "Document",
            "status": doc.status,
            "generatedDate": doc.created_at.isoformat() if doc.created_at else datetime.now().isoformat(),
            "version": "v1.2",
            "fileUrl": doc.file_url,
            "metadata": {}
        })
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{doc_id}/download")
async def download_document_pdf(doc_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Generate and stream a real PDF for the given document."""
    try:
        stmt = select(GeneratedDocument, DocumentTemplate, User).join(
            DocumentTemplate, GeneratedDocument.template_id == DocumentTemplate.id
        ).join(
            User, GeneratedDocument.user_id == User.id
        ).where(GeneratedDocument.id == doc_id)
        res = await db.execute(stmt)
        row = res.first()

        if not row:
            raise HTTPException(status_code=404, detail="Document not found")

        doc, tpl, user = row
        doc_type = tpl.name
        student_name = user.username
        program = "Full Stack Web Development"  # Could be dynamic later
        stipend = "15000"

        # Determine kwargs based on doc type
        if doc_type in ("Offer Letter", "Internship Letter"):
            pdf_bytes = generate_offer_letter(student_name=student_name, program=program, stipend=stipend)
        elif doc_type == "Joining Letter":
            pdf_bytes = generate_joining_letter(student_name=student_name, program=program)
        elif doc_type == "Completion Certificate":
            pdf_bytes = generate_completion_certificate(student_name=student_name, program=program, duration="6 Months")
        elif doc_type == "Recommendation Letter":
            pdf_bytes = generate_recommendation_letter(student_name=student_name, program=program)
        else:
            pdf_bytes = generate_offer_letter(student_name=student_name, program=program, stipend=stipend)

        filename = f"{doc_type.replace(' ', '_')}_{student_name.replace(' ', '_')}.pdf"

        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

