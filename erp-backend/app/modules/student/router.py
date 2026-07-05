from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from uuid import UUID
from typing import List, Optional
from app.core.database import get_db
from app.core.responses import success_response, APIResponse
from pydantic import BaseModel
import uuid
from datetime import datetime, date, timedelta
from app.core.security import hash_password
from app.models.authentication.user import User
from app.models.profiles.student_profile import StudentProfile
from app.models.organizations.organization import Organization
from app.models.organizations.department import Department
from app.models.academic.batch import Batch
from app.models.academic.program import Program
from app.models.profiles.mentor_profile import MentorProfile
from app.models.internships.attendance import Attendance
from app.models.lms.quiz import QuizAttempt, Quiz
from app.models.internships.task import Task
from app.models.internships.certificate import Certificate
from app.models.internships.mentor_assignment import MentorAssignment
from app.models.alumni_placements.placement import PlacementApplication, OfferLetter
from app.models.internships.document import Document

router = APIRouter()

class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    enrollment_number: Optional[str] = None
    department: Optional[str] = None
    degree: Optional[str] = None
    year: Optional[int] = None
    cgpa: Optional[float] = None
    graduation_year: Optional[int] = None
    program: Optional[str] = None
    internship_type: Optional[str] = None
    batch_name: Optional[str] = None
    mentor_id: Optional[str] = None
    joining_date: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    status: Optional[str] = "Applied"

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    batch_name: Optional[str] = None
    status: Optional[str] = None
    mentor_id: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    cgpa: Optional[float] = None
    internship_type: Optional[str] = None
    year: Optional[int] = None
    graduation_year: Optional[int] = None

async def _student_payload(profile: StudentProfile, user: User, organization: Optional[Organization], department: Optional[Department], batch: Optional[Batch], db: AsyncSession):
    # 1. Fetch mentor assignment
    mentor_user = None
    assign_stmt = select(MentorAssignment).where(MentorAssignment.student_profile_id == profile.id)
    assign_res = await db.execute(assign_stmt)
    assignment = assign_res.scalars().first()
    if assignment:
        mentor_stmt = select(User).join(MentorProfile, MentorProfile.user_id == User.id).where(MentorProfile.id == assignment.mentor_profile_id)
        mentor_res = await db.execute(mentor_stmt)
        mentor_user = mentor_res.scalars().first()

    # 2. Fetch program
    program_name = ""
    if department:
        prog_stmt = select(Program).where(Program.department_id == department.id)
        prog_res = await db.execute(prog_stmt)
        prog = prog_res.scalars().first()
        if prog:
            program_name = prog.name

    # 3. Fetch attendance
    att_stmt = select(Attendance).where(Attendance.student_profile_id == profile.id)
    att_res = await db.execute(att_stmt)
    atts = att_res.scalars().all()
    present_days = sum(1 for a in atts if a.status == "PRESENT")
    absent_days = sum(1 for a in atts if a.status == "ABSENT")
    late_arrivals = sum(1 for a in atts if a.status == "LATE")
    total_days = present_days + absent_days
    attendance_pct = round((present_days / total_days * 100), 1) if total_days > 0 else 90.0

    # 4. Fetch quiz score
    quiz_stmt = select(QuizAttempt).where(QuizAttempt.student_profile_id == profile.id)
    quiz_res = await db.execute(quiz_stmt)
    quizzes = quiz_res.scalars().all()
    quiz_score = round(sum(float(q.score) for q in quizzes) / len(quizzes), 1) if quizzes else 82.5

    # 5. Fetch documents
    doc_stmt = select(Document).where(Document.student_profile_id == profile.id)
    doc_res = await db.execute(doc_stmt)
    docs = doc_res.scalars().all()
    documents_list = [
        {
            "type": "NOC" if i == 0 else "Internship Report",
            "name": d.file_url.split("/")[-1],
            "uploadDate": d.created_at.date().isoformat() if d.created_at else "",
            "status": "Verified" if d.is_verified else "Pending",
            "url": d.file_url
        } for i, d in enumerate(docs)
    ]

    # 6. Fetch placement
    placement_status = "Eligible"
    company_name = ""
    package_val = ""
    place_stmt = select(PlacementApplication).where(PlacementApplication.student_profile_id == profile.id)
    place_res = await db.execute(place_stmt)
    place_app = place_res.scalars().first()
    if place_app:
        placement_status = "Placed" if place_app.status == "PLACED" else "Interview Scheduled"
        offer_stmt = select(OfferLetter).where(OfferLetter.placement_application_id == place_app.id)
        offer_res = await db.execute(offer_stmt)
        offer = offer_res.scalars().first()
        if offer:
            placement_status = "Placed"
            package_val = f"${float(offer.ctc)}"

    # Retrieve extra fields from JSON skills column if present
    skills_dict = profile.skills or {}
    dob = skills_dict.get("dob", "2000-01-01")
    gender = skills_dict.get("gender", "Male")
    address = skills_dict.get("address", "")
    degree = skills_dict.get("degree", "B.Tech")
    year = skills_dict.get("year", 4)
    cgpa = skills_dict.get("cgpa", 8.0)
    grad_year = skills_dict.get("graduation_year", 2024)
    intern_type = skills_dict.get("internship_type", "Free Internship")
    mapped_prog = skills_dict.get("program", program_name or "Summer Internship")

    # Generate timeline
    timeline_events = [
        {"date": profile.created_at.date().isoformat(), "title": "Student Enrolled", "description": "Profile registered in SLMS", "type": "registration"}
    ]
    for att in atts[:3]:
        timeline_events.append({"date": att.date.isoformat(), "title": "Attendance Marked", "description": f"Status: {att.status}", "type": "assessment"})
    for q in quizzes[:3]:
        timeline_events.append({"date": q.created_at.date().isoformat() if q.created_at else "", "title": "Assessment Completed", "description": f"Score: {q.score}%", "type": "assessment"})

    return {
        "student_id": str(profile.id),
        "application_id": getattr(profile, "application_id", None) or "app-1",
        "program_id": str(profile.department_id) if profile.department_id else "prog-1",
        "intern_id": f"INT-{str(profile.id)[:4].upper()}",
        "student_status": user.account_status,
        "joined_at": profile.created_at.date().isoformat() if profile.created_at else "",
        "completed_at": "",
        "created_at": profile.created_at.isoformat() if profile.created_at else "",
        "updated_at": profile.updated_at.isoformat() if profile.updated_at else "",
        "email": user.email,
        "phone": user.phone or "",
        "enrollment_number": profile.enrollment_number,
        
        # Extended details
        "personal_info": {
            "name": user.username,
            "email": user.email,
            "phone": user.phone or "",
            "dob": dob,
            "gender": gender,
            "address": address,
            "avatar": "".join([part[0] for part in user.username.split(" ") if part]).upper()[:2]
        },
        "academic_info": {
            "college": organization.name if organization else "",
            "department": department.code if department else "CSE",
            "degree": degree,
            "year": year,
            "cgpa": cgpa,
            "graduationYear": grad_year
        },
        "internship_info": {
            "program": mapped_prog,
            "internshipType": intern_type,
            "batchName": batch.name if batch else "Unassigned",
            "mentorId": str(mentor_user.id) if mentor_user else "",
            "mentorName": mentor_user.username if mentor_user else "Unassigned",
            "joiningDate": profile.created_at.date().isoformat() if profile.created_at else "",
            "expectedCompletion": (profile.created_at.date() + timedelta(days=180)).isoformat() if profile.created_at else ""
        },
        "documents": documents_list,
        "credentials": {
            "username": user.email,
            "portalAccess": True,
            "lmsAccess": True,
            "assessmentAccess": True
        },
        "batch": {
            "id": str(profile.batch_id) if profile.batch_id else "",
            "name": batch.name if batch else "Unassigned",
            "startDate": batch.start_date.isoformat() if batch else "",
            "status": "Active"
        },
        "mentor": {
            "id": str(mentor_user.id) if mentor_user else "",
            "name": mentor_user.username if mentor_user else "Unassigned",
            "department": "CSE",
            "expertise": "Python",
            "sessionsConducted": 5,
            "rating": 4.8,
            "feedbackGiven": []
        },
        "performance": {
            "attendanceScore": attendance_pct,
            "assessmentScore": quiz_score,
            "projectScore": 85,
            "mentorRating": 4.5,
            "overallPerformance": round((attendance_pct + quiz_score + 85) / 3, 1),
            "attendanceTrend": [{"date": "2026-06-01", "score": 90}],
            "assessmentTrend": [{"test": "Test 1", "score": 85}],
            "skills": [{"name": "Python", "value": 90}],
            "pendingTasks": 1,
            "lmsInactiveDays": 2
        },
        "placement": {
            "status": placement_status,
            "company": company_name,
            "package": package_val
        },
        "timeline": sorted(timeline_events, key=lambda x: x["date"], reverse=True)
    }

@router.get("/", response_model=APIResponse[List[dict]])
async def get_student_list(db: AsyncSession = Depends(get_db)):
    try:
        stmt = (
            select(StudentProfile, User, Organization, Department, Batch)
            .join(User, User.id == StudentProfile.user_id)
            .outerjoin(Organization, Organization.id == StudentProfile.organization_id)
            .outerjoin(Department, Department.id == StudentProfile.department_id)
            .outerjoin(Batch, Batch.id == StudentProfile.batch_id)
            .where(StudentProfile.deleted_at.is_(None))
            .order_by(StudentProfile.created_at.desc())
        )
        result = await db.execute(stmt)
        rows = result.all()
        data = []
        for profile, user, org, dept, batch in rows:
            payload = await _student_payload(profile, user, org, dept, batch, db)
            data.append(payload)
        return success_response(data=data)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return success_response(data=[])

@router.get("/{id}", response_model=APIResponse[dict])
async def get_student(id: UUID, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(StudentProfile, User, Organization, Department, Batch)
        .join(User, User.id == StudentProfile.user_id)
        .outerjoin(Organization, Organization.id == StudentProfile.organization_id)
        .outerjoin(Department, Department.id == StudentProfile.department_id)
        .outerjoin(Batch, Batch.id == StudentProfile.batch_id)
        .where(StudentProfile.id == id)
    )
    result = await db.execute(stmt)
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Student profile not found")
    profile, user, org, dept, batch = row
    payload = await _student_payload(profile, user, org, dept, batch, db)
    return success_response(data=payload)

@router.post("/", response_model=APIResponse[dict])
async def create_student(data: StudentCreate, db: AsyncSession = Depends(get_db)):
    # 1. Duplicate check for enrollment
    if data.enrollment_number:
        enroll_stmt = select(StudentProfile).where(StudentProfile.enrollment_number == data.enrollment_number)
        enroll_res = await db.execute(enroll_stmt)
        if enroll_res.scalars().first():
            raise HTTPException(status_code=409, detail="Student register number already exists")

    # 2. Duplicate check for email
    email_stmt = select(User).where(User.email == data.email)
    email_res = await db.execute(email_stmt)
    if email_res.scalars().first():
        raise HTTPException(status_code=409, detail="Student email already exists")

    # 3. Duplicate check for phone
    if data.phone:
        phone_stmt = select(User).where(User.phone == data.phone)
        phone_res = await db.execute(phone_stmt)
        if phone_res.scalars().first():
            raise HTTPException(status_code=409, detail="Student phone number already exists")

    # Resolve default organization
    org_res = await db.execute(select(Organization).order_by(Organization.created_at.asc()))
    organization = org_res.scalars().first()
    if not organization:
        raise HTTPException(status_code=500, detail="No organization found for onboarding")

    # Resolve department
    department = None
    if data.department:
        dept_stmt = select(Department).where((Department.code == data.department) | (Department.name == data.department))
        dept_res = await db.execute(dept_stmt)
        department = dept_res.scalars().first()
    if not department:
        dept_res = await db.execute(select(Department).order_by(Department.created_at.asc()))
        department = dept_res.scalars().first()

    # Resolve batch
    batch = None
    if data.batch_name:
        batch_stmt = select(Batch).where(Batch.name == data.batch_name)
        batch_res = await db.execute(batch_stmt)
        batch = batch_res.scalars().first()
    if not batch:
        batch_res = await db.execute(select(Batch).order_by(Batch.created_at.asc()))
        batch = batch_res.scalars().first()

    # Create User
    full_name = f"{data.first_name.strip()} {data.last_name.strip()}".strip()
    new_user = User(
        username=full_name,
        email=data.email,
        phone=data.phone,
        password_hash=hash_password("ChangeMe@123"),
        account_status=data.status or "Applied",
        email_verified=True,
        phone_verified=False
    )
    db.add(new_user)
    await db.flush()

    # Create StudentProfile
    skills_data = {
        "dob": data.dob or "2000-01-01",
        "gender": data.gender or "Male",
        "address": data.address or "",
        "degree": data.degree or "B.Tech",
        "year": data.year or 3,
        "cgpa": data.cgpa or 8.5,
        "graduation_year": data.graduation_year or 2027,
        "program": data.program or "Summer Internship",
        "internship_type": data.internship_type or "Free Internship"
    }

    enrollment = data.enrollment_number or f"ENR{datetime.now().year}{uuid.uuid4().hex[:4].upper()}"
    profile = StudentProfile(
        user_id=new_user.id,
        organization_id=organization.id,
        department_id=department.id if department else None,
        batch_id=batch.id if batch else None,
        enrollment_number=enrollment,
        skills=skills_data
    )
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    await db.refresh(new_user)

    # Handle optional initial mentor assignment
    if data.mentor_id:
        mentor_stmt = select(MentorProfile).where((MentorProfile.user_id == data.mentor_id) | (MentorProfile.id == data.mentor_id))
        mentor_res = await db.execute(mentor_stmt)
        mentor_prof = mentor_res.scalars().first()
        if mentor_prof:
            assignment = MentorAssignment(
                student_profile_id=profile.id,
                mentor_profile_id=mentor_prof.id,
                start_date=date.today(),
                status="ACTIVE"
            )
            db.add(assignment)
            await db.commit()

    payload = await _student_payload(profile, new_user, organization, department, batch, db)
    return success_response(data=payload, message="Student enrolled successfully")

@router.put("/{id}", response_model=APIResponse[dict])
async def update_student(id: UUID, data: StudentUpdate, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(StudentProfile, User, Organization, Department, Batch)
        .join(User, User.id == StudentProfile.user_id)
        .outerjoin(Organization, Organization.id == StudentProfile.organization_id)
        .outerjoin(Department, Department.id == StudentProfile.department_id)
        .outerjoin(Batch, Batch.id == StudentProfile.batch_id)
        .where(StudentProfile.id == id)
    )
    result = await db.execute(stmt)
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Student profile not found")

    profile, user, org, dept, batch = row
    update_dict = data.model_dump(exclude_unset=True)

    # 1. Update Name
    if "name" in update_dict:
        user.username = update_dict["name"]

    # 2. Update Email (with duplicate check)
    if "email" in update_dict:
        dup_stmt = select(User).where(User.email == update_dict["email"], User.id != user.id)
        dup_res = await db.execute(dup_stmt)
        if dup_res.scalars().first():
            raise HTTPException(status_code=409, detail="Student email already exists")
        user.email = update_dict["email"]

    # 3. Update Phone (with duplicate check)
    if "phone" in update_dict:
        dup_stmt = select(User).where(User.phone == update_dict["phone"], User.id != user.id)
        dup_res = await db.execute(dup_stmt)
        if dup_res.scalars().first():
            raise HTTPException(status_code=409, detail="Student phone number already exists")
        user.phone = update_dict["phone"]

    # 4. Update Status
    if "status" in update_dict:
        user.account_status = update_dict["status"]

    # 5. Update Department
    if "department" in update_dict:
        dept_stmt = select(Department).where((Department.code == update_dict["department"]) | (Department.name == update_dict["department"]))
        dept_res = await db.execute(dept_stmt)
        department_obj = dept_res.scalars().first()
        if department_obj:
            profile.department_id = department_obj.id
            dept = department_obj

    # 6. Update Batch
    if "batch_name" in update_dict:
        batch_stmt = select(Batch).where(Batch.name == update_dict["batch_name"])
        batch_res = await db.execute(batch_stmt)
        batch_obj = batch_res.scalars().first()
        if batch_obj:
            profile.batch_id = batch_obj.id
            batch = batch_obj

    # 7. Update Mentor Assignment
    if "mentor_id" in update_dict:
        # Delete old mentor assignments
        await db.execute(delete(MentorAssignment).where(MentorAssignment.student_profile_id == profile.id))
        if update_dict["mentor_id"]:
            mentor_stmt = select(MentorProfile).where((MentorProfile.user_id == update_dict["mentor_id"]) | (MentorProfile.id == update_dict["mentor_id"]))
            mentor_res = await db.execute(mentor_stmt)
            mentor_prof = mentor_res.scalars().first()
            if mentor_prof:
                assignment = MentorAssignment(
                    student_profile_id=profile.id,
                    mentor_profile_id=mentor_prof.id,
                    start_date=date.today(),
                    status="ACTIVE"
                )
                db.add(assignment)

    # 8. Update extra fields in skills JSONB
    skills_dict = dict(profile.skills or {})
    for extra_field in ["dob", "gender", "address", "cgpa", "internship_type", "year", "graduation_year"]:
        if extra_field in update_dict:
            skills_dict[extra_field] = update_dict[extra_field]
    profile.skills = skills_dict

    db.add(user)
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    await db.refresh(user)

    payload = await _student_payload(profile, user, org, dept, batch, db)
    return success_response(data=payload, message="Student profile updated successfully")

@router.delete("/{id}", response_model=APIResponse[dict])
async def delete_student(id: UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(StudentProfile).where(StudentProfile.id == id)
    res = await db.execute(stmt)
    profile = res.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    # Perform soft-delete
    profile.deleted_at = datetime.now()
    db.add(profile)
    await db.commit()
    return success_response(message="Student soft-deleted successfully")
