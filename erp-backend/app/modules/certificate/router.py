import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from app.core.database import get_db
from app.models.certificate.certificate import Certificate
from .schemas import CertificateCreate, CertificateUpdateStatus, CertificateResponse

router = APIRouter()

@router.get("/")
async def list_certificates(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Certificate).order_by(desc(Certificate.created_at)))
    certificates = result.scalars().all()
    serialized = [CertificateResponse.model_validate(c).model_dump(by_alias=True, mode='json') for c in certificates]
    return {"data": serialized}

@router.post("/")
async def create_certificate(cert: CertificateCreate, db: AsyncSession = Depends(get_db)):
    from datetime import datetime
    import random
    import string
    
    # Generate unique certificate number
    random_suffix = ''.join(random.choices(string.digits, k=5))
    cert_number = f"PS-CERT-2026-{random_suffix}"
    
    # Generate other missing fields
    digital_signature = f"DSIG-{uuid.uuid4().hex[:8].upper()}"
    qr_url = f"https://pinesphere.com/verify/{cert_number}/qr"
    verify_url = f"https://pinesphere.com/verify/{cert_number}"

    new_cert = Certificate(
        certificate_number=cert_number,
        student_id=cert.student_id,
        student_name=cert.student_name,
        program=cert.program,
        batch=cert.batch,
        mentor_name=cert.mentor_name,
        type=cert.type,
        issue_date=cert.issue_date or datetime.now(),
        expiry_date=None,
        status=cert.status,
        generated_by="System",
        approved_by=None,
        qr_code_url=qr_url,
        verification_url=verify_url,
        digital_signature_id=digital_signature
    )
    db.add(new_cert)
    await db.commit()
    await db.refresh(new_cert)

    # Send Certificate Generated notification (Email, In-App)
    try:
        from app.models.authentication.user import User as DBUser
        from app.models.profiles.student_profile import StudentProfile
        from app.services.notification_service import notification_service
        
        user_stmt = select(DBUser).join(StudentProfile, StudentProfile.user_id == DBUser.id).where(StudentProfile.id == cert.student_id)
        user_res = await db.execute(user_stmt)
        user_obj = user_res.scalars().first()
        
        if user_obj:
            await notification_service.send_certificate_generated(
                username=user_obj.username.title(),
                email=user_obj.email,
                cert_name=cert.type or "Internship Completion"
            )
    except Exception as e:
        print("Error sending certificate generated notification:", e)

    serialized = CertificateResponse.model_validate(new_cert).model_dump(by_alias=True, mode='json')
    return {"success": True, "message": "Certificate created", "data": serialized}

@router.patch("/{cert_id}")
async def patch_certificate(cert_id: uuid.UUID, cert_update: CertificateUpdateStatus, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Certificate).where(Certificate.id == cert_id))
    db_cert = result.scalar_one_or_none()
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    db_cert.status = cert_update.status
    if cert_update.approved_by:
        db_cert.approved_by = cert_update.approved_by
        
    await db.commit()
    await db.refresh(db_cert)
    serialized = CertificateResponse.model_validate(db_cert).model_dump(by_alias=True, mode='json')
    return {"success": True, "message": "Certificate updated", "data": serialized}
