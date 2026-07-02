import uuid
from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.core.responses import success_response
from app.core.security import hash_password
from app.models.alumni_placements.alumni import AlumniProfile, CareerProgress
from app.models.profiles.student_profile import StudentProfile
from app.models.authentication.user import User
from app.models.organizations.organization import Organization

router = APIRouter()

class AlumniCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    batch: Optional[str] = "Class of 2025"
    graduationYear: int = 2025
    currentCompany: Optional[str] = "Self-Employed"
    currentDesignation: Optional[str] = "Software Engineer"
    linkedInUrl: Optional[str] = None
    isMentoring: bool = False

@router.get("/")
async def list_alumni(db: AsyncSession = Depends(get_db)):
    try:
        # Fetch all alumni profiles joined with student profiles and users
        stmt = (
            select(AlumniProfile, StudentProfile, User)
            .join(StudentProfile, AlumniProfile.student_profile_id == StudentProfile.id)
            .join(User, StudentProfile.user_id == User.id)
        )
        result = await db.execute(stmt)
        records = result.all()
        
        data = []
        for alum, student, user in records:
            data.append({
                "id": str(alum.id),
                "name": user.username,  # User full name/display name stored in username
                "email": user.email,
                "phone": user.phone or "",
                "batch": f"Class of {int(alum.graduation_year)}",
                "graduationYear": int(alum.graduation_year),
                "currentCompany": alum.current_company or "Self-Employed",
                "currentDesignation": alum.current_designation or "Software Engineer",
                "linkedInUrl": student.linkedin_url or "",
                "isMentoring": alum.is_mentoring
            })
        return success_response(data=data)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return success_response(data=[])

@router.post("/")
async def create_alumni(payload: AlumniCreate, db: AsyncSession = Depends(get_db)):
    try:
        # 1. Resolve organization
        org_result = await db.execute(select(Organization).limit(1))
        org = org_result.scalars().first()
        if not org:
            raise HTTPException(status_code=404, detail="No organization found to attach alumnus to")
        
        # 2. Check or create User
        user_stmt = select(User).where(User.email == payload.email)
        user_res = await db.execute(user_stmt)
        user = user_res.scalars().first()
        
        if not user:
            user = User(
                username=payload.name,
                email=payload.email,
                phone=payload.phone,
                password_hash=hash_password("AlumniFallback@123"),
                account_status="ACTIVE",
                email_verified=True,
                phone_verified=True
            )
            db.add(user)
            await db.flush()
            
        # 3. Check or create StudentProfile
        stud_stmt = select(StudentProfile).where(StudentProfile.user_id == user.id)
        stud_res = await db.execute(stud_stmt)
        student = stud_res.scalars().first()
        
        if not student:
            student = StudentProfile(
                user_id=user.id,
                organization_id=org.id,
                enrollment_number=f"ALUM-{uuid.uuid4().hex[:6].upper()}",
                linkedin_url=payload.linkedInUrl
            )
            db.add(student)
            await db.flush()
            
        # 4. Check or create AlumniProfile
        alum_stmt = select(AlumniProfile).where(AlumniProfile.student_profile_id == student.id)
        alum_res = await db.execute(alum_stmt)
        alum = alum_res.scalars().first()
        
        if not alum:
            alum = AlumniProfile(
                student_profile_id=student.id,
                graduation_year=payload.graduationYear,
                current_company=payload.currentCompany,
                current_designation=payload.currentDesignation,
                is_mentoring=payload.isMentoring
            )
            db.add(alum)
            await db.flush()
            
            # Create associated CareerProgress
            career = CareerProgress(
                alumni_profile_id=alum.id,
                company_name=payload.currentCompany or "Self-Employed",
                designation=payload.currentDesignation or "Software Engineer",
                location="Bangalore",
                start_date=date(payload.graduationYear, 6, 1),
                is_current=True
            )
            db.add(career)
            await db.flush()

        await db.commit()
        
        return success_response(data={
            "id": str(alum.id),
            "name": user.username,
            "email": user.email,
            "phone": user.phone or "",
            "batch": f"Class of {int(alum.graduation_year)}",
            "graduationYear": int(alum.graduation_year),
            "currentCompany": alum.current_company,
            "currentDesignation": alum.current_designation,
            "linkedInUrl": student.linkedin_url or "",
            "isMentoring": alum.is_mentoring
        })
    except Exception as e:
        await db.rollback()
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{alumni_id}")
async def delete_alumni(alumni_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    try:
        stmt = select(AlumniProfile).where(AlumniProfile.id == alumni_id)
        res = await db.execute(stmt)
        alum = res.scalars().first()
        if not alum:
            raise HTTPException(status_code=404, detail="Alumnus profile not found")
        
        await db.delete(alum)
        await db.commit()
        return success_response(message="Alumnus successfully deleted")
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
