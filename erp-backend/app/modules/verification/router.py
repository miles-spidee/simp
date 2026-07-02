import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from app.core.database import get_db
from app.models.certificate.certificate import Certificate
from app.models.certificate.verification import VerificationRequest
from .schemas import VerificationRequestResponse, VerificationResultSchema

router = APIRouter()

@router.get("/")
async def list_verification(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(VerificationRequest).order_by(desc(VerificationRequest.created_at)))
    requests = result.scalars().all()
    serialized = [VerificationRequestResponse.model_validate(req).model_dump(by_alias=True, mode='json') for req in requests]
    return {"data": serialized}

@router.get("/verify/{certificate_number}")
async def verify_certificate(certificate_number: str, request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Certificate).where(Certificate.certificate_number == certificate_number))
    db_cert = result.scalar_one_or_none()
    
    status = "Invalid"
    message = "Certificate not found on the Pinesphere network."
    student_name = None
    program = None
    batch = None
    issue_date = None
    certificate_type = None

    if db_cert:
        if db_cert.status == "Issued":
            status = "Valid"
            message = "Certificate is authentic."
            student_name = db_cert.student_name
            program = db_cert.program
            batch = db_cert.batch
            issue_date = db_cert.issue_date
            certificate_type = db_cert.type
        elif db_cert.status == "Revoked":
            status = "Revoked"
            message = "This certificate has been revoked by the issuer."
        else:
            status = "Invalid"
            message = f"Certificate is currently in '{db_cert.status}' state."
            
    # Log the request
    client_ip = request.client.host if request.client else "unknown"
    verify_req = VerificationRequest(
        certificate_number=certificate_number,
        requested_by_ip=client_ip,
        method="Certificate Number",
        result=status
    )
    db.add(verify_req)
    await db.commit()
    
    result_data = VerificationResultSchema(
        status=status,
        student_name=student_name,
        program=program,
        batch=batch,
        issue_date=issue_date,
        organization="Pinesphere Trust",
        certificate_type=certificate_type,
        message=message
    ).model_dump(by_alias=True, mode='json')
    
    return {"data": result_data}
