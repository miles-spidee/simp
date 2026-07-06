from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, text
from sqlalchemy.dialects.postgresql import insert as pg_insert
from uuid import UUID
from typing import List, Optional
from app.core.database import get_db
from app.core.responses import success_response, APIResponse
from pydantic import BaseModel
import uuid
from app.core.dependencies import require_permission
from datetime import datetime, date, timedelta
import asyncio
import time
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
from app.models.organizations.tndce_college import TNDCECollege

router = APIRouter()

COLLEGES_SEED = [
    {"college_code": "TNDCE-001", "name": "Presidency College, Chennai", "district": "Chennai", "region": "Chennai", "college_type": "Government"},
    {"college_code": "TNDCE-002", "name": "Government Arts College, Coimbatore", "district": "Coimbatore", "region": "Coimbatore", "college_type": "Government"},
    {"college_code": "TNDCE-003", "name": "Madras Christian College, Chennai", "district": "Chennai", "region": "Chennai", "college_type": "Aided"},
    {"college_code": "TNDCE-004", "name": "Loyola College, Chennai", "district": "Chennai", "region": "Chennai", "college_type": "Aided"},
    {"college_code": "TNDCE-005", "name": "PSG College of Arts and Science, Coimbatore", "district": "Coimbatore", "region": "Coimbatore", "college_type": "Aided"},
    {"college_code": "TNDCE-006", "name": "Government Arts College for Men, Nandanam", "district": "Chennai", "region": "Chennai", "college_type": "Government"},
    {"college_code": "TNDCE-007", "name": "Queen Mary's College, Chennai", "district": "Chennai", "region": "Chennai", "college_type": "Government"},
    {"college_code": "TNDCE-008", "name": "Stella Maris College, Chennai", "district": "Chennai", "region": "Chennai", "college_type": "Aided"},
    {"college_code": "TNDCE-009", "name": "St. Joseph's College, Trichy", "district": "Trichy", "region": "Trichy", "college_type": "Aided"},
    {"college_code": "TNDCE-010", "name": "Bishop Heber College, Trichy", "district": "Trichy", "region": "Trichy", "college_type": "Aided"},
    {"college_code": "TNDCE-011", "name": "American College, Madurai", "district": "Madurai", "region": "Madurai", "college_type": "Aided"},
    {"college_code": "TNDCE-012", "name": "Madura College, Madurai", "district": "Madurai", "region": "Madurai", "college_type": "Aided"},
    {"college_code": "TNDCE-013", "name": "Lady Doak College, Madurai", "district": "Madurai", "region": "Madurai", "college_type": "Aided"},
    {"college_code": "TNDCE-014", "name": "Government Arts College, Salem", "district": "Salem", "region": "Salem", "college_type": "Government"},
    {"college_code": "TNDCE-015", "name": "Government Arts College, Dharmapuri", "district": "Dharmapuri", "region": "Dharmapuri", "college_type": "Government"},
    {"college_code": "TNDCE-016", "name": "Government Arts College, Karur", "district": "Karur", "region": "Karur", "college_type": "Government"},
    {"college_code": "TNDCE-017", "name": "Government Arts College, Kumbakonam", "district": "Thanjavur", "region": "Trichy", "college_type": "Government"},
    {"college_code": "TNDCE-018", "name": "Government Arts College, Udhagamandalam", "district": "Nilgiris", "region": "Coimbatore", "college_type": "Government"},
    {"college_code": "TNDCE-019", "name": "Government Arts College, Ariyalur", "district": "Ariyalur", "region": "Trichy", "college_type": "Government"},
    {"college_code": "TNDCE-020", "name": "Government College for Women, Kumbakonam", "district": "Thanjavur", "region": "Trichy", "college_type": "Government"},
    {"college_code": "TNDCE-021", "name": "Government Arts College, Chidambaram", "district": "Cuddalore", "region": "Chennai", "college_type": "Government"},
    {"college_code": "TNDCE-022", "name": "Rajah Serfoji Government College, Thanjavur", "district": "Thanjavur", "region": "Trichy", "college_type": "Government"},
    {"college_code": "TNDCE-023", "name": "Government Arts College, Melur", "district": "Madurai", "region": "Madurai", "college_type": "Government"},
    {"college_code": "TNDCE-024", "name": "Government Arts College for Women, Nilakottai", "district": "Dindigul", "region": "Madurai", "college_type": "Government"},
    {"college_code": "TNDCE-025", "name": "Government Arts College, Paramakudi", "district": "Ramanathapuram", "region": "Madurai", "college_type": "Government"},
    {"college_code": "TNDCE-026", "name": "Alagappa Government Arts College, Karaikudi", "district": "Sivaganga", "region": "Madurai", "college_type": "Government"},
    {"college_code": "TNDCE-027", "name": "Government Arts College, Sivaganga", "district": "Sivaganga", "region": "Madurai", "college_type": "Government"},
    {"college_code": "TNDCE-028", "name": "Government Arts College, Udumalpet", "district": "Tiruppur", "region": "Coimbatore", "college_type": "Government"},
    {"college_code": "TNDCE-029", "name": "Government Arts & Science College, Valparai", "district": "Coimbatore", "region": "Coimbatore", "college_type": "Government"},
    {"college_code": "TNDCE-030", "name": "Government Arts & Science College, Kangeyam", "district": "Tiruppur", "region": "Coimbatore", "college_type": "Government"},
    {"college_code": "TNDCE-031", "name": "Government Arts & Science College, Gudalur", "district": "Nilgiris", "region": "Coimbatore", "college_type": "Government"},
    {"college_code": "TNDCE-032", "name": "Government Arts & Science College, Sathyamangalam", "district": "Erode", "region": "Coimbatore", "college_type": "Government"},
    {"college_code": "TNDCE-033", "name": "Government Arts & Science College, Hosur", "district": "Krishnagiri", "region": "Salem", "college_type": "Government"},
    {"college_code": "TNDCE-034", "name": "Government Arts & Science College, Komarapalayam", "district": "Namakkal", "region": "Salem", "college_type": "Government"},
    {"college_code": "TNDCE-035", "name": "Government Arts & Science College, Pennagaram", "district": "Dharmapuri", "region": "Salem", "college_type": "Government"},
    {"college_code": "TNDCE-036", "name": "Government Arts & Science College, Pappireddipatti", "district": "Dharmapuri", "region": "Salem", "college_type": "Government"},
    {"college_code": "TNDCE-037", "name": "Government Arts & Science College, Harur", "district": "Dharmapuri", "region": "Salem", "college_type": "Government"},
    {"college_code": "TNDCE-038", "name": "Government Arts & Science College, Mettur", "district": "Salem", "region": "Salem", "college_type": "Government"},
    {"college_code": "TNDCE-039", "name": "Government Arts & Science College, Edappadi", "district": "Salem", "region": "Salem", "college_type": "Government"},
    {"college_code": "TNDCE-040", "name": "Government Arts & Science College, Lalgudi", "district": "Trichy", "region": "Trichy", "college_type": "Government"},
    {"college_code": "TNDCE-041", "name": "Government Arts & Science College, Perambalur", "district": "Perambalur", "region": "Trichy", "college_type": "Government"},
    {"college_code": "TNDCE-042", "name": "Government Arts & Science College, Veppur", "district": "Perambalur", "region": "Trichy", "college_type": "Government"},
    {"college_code": "TNDCE-043", "name": "Government Arts & Science College, Thiruverumbur", "district": "Trichy", "region": "Trichy", "college_type": "Government"},
    {"college_code": "TNDCE-044", "name": "Government Arts & Science College, Jeyankondam", "district": "Ariyalur", "region": "Trichy", "college_type": "Government"},
    {"college_code": "TNDCE-045", "name": "Government Arts & Science College, Manalmedu", "district": "Nagapattinam", "region": "Trichy", "college_type": "Government"},
    {"college_code": "TNDCE-046", "name": "Government Arts & Science College, Thiruthuraipoondi", "district": "Tiruvarur", "region": "Trichy", "college_type": "Government"},
    {"college_code": "TNDCE-047", "name": "Kunthavai Naacchiyaar Government Arts College for Women, Thanjavur", "district": "Thanjavur", "region": "Trichy", "college_type": "Government"},
    {"college_code": "TNDCE-048", "name": "Government Arts & Science College, Veerapandi", "district": "Theni", "region": "Madurai", "college_type": "Government"},
    {"college_code": "TNDCE-049", "name": "Government Arts & Science College, Kovilpatti", "district": "Thoothukudi", "region": "Tirunelveli", "college_type": "Government"},
    {"college_code": "TNDCE-050", "name": "Government Arts & Science College, Sattur", "district": "Virudhunagar", "region": "Tirunelveli", "college_type": "Government"},
    {"college_code": "TNDCE-051", "name": "Government Arts & Science College, Aruppukottai", "district": "Virudhunagar", "region": "Tirunelveli", "college_type": "Government"},
    {"college_code": "TNDCE-052", "name": "Government Arts & Science College, Sivakasi", "district": "Virudhunagar", "region": "Tirunelveli", "college_type": "Government"},
    {"college_code": "TNDCE-053", "name": "Government Arts & Science College, Kadayanallur", "district": "Tenkasi", "region": "Tirunelveli", "college_type": "Government"},
    {"college_code": "TNDCE-054", "name": "Government Arts & Science College, Sankarankovil", "district": "Tenkasi", "region": "Tirunelveli", "college_type": "Government"},
    {"college_code": "TNDCE-055", "name": "Government Arts & Science College, Melur", "district": "Madurai", "region": "Madurai", "college_type": "Government"},
    {"college_code": "TNDCE-056", "name": "Government Arts & Science College, Theni", "district": "Theni", "region": "Madurai", "college_type": "Government"},
    {"college_code": "TNDCE-057", "name": "Government Arts & Science College, Karambakudi", "district": "Pudukkottai", "region": "Trichy", "college_type": "Government"},
    {"college_code": "TNDCE-058", "name": "Government Arts & Science College, Aranthangi", "district": "Pudukkottai", "region": "Trichy", "college_type": "Government"},
    {"college_code": "TNDCE-059", "name": "Government Arts & Science College, Kadaladi", "district": "Ramanathapuram", "region": "Madurai", "college_type": "Government"},
    {"college_code": "TNDCE-060", "name": "Government Arts & Science College, Tirupattur", "district": "Tirupattur", "region": "Vellore", "college_type": "Government"},
    {"college_code": "TNDCE-061", "name": "Government Arts & Science College, Vaniyambadi", "district": "Tirupattur", "region": "Vellore", "college_type": "Government"},
    {"college_code": "TNDCE-062", "name": "Government Arts & Science College, Arakkonam", "district": "Ranipet", "region": "Vellore", "college_type": "Government"},
    {"college_code": "TNDCE-063", "name": "Government Arts & Science College, Walajapet", "district": "Ranipet", "region": "Vellore", "college_type": "Government"},
    {"college_code": "TNDCE-064", "name": "Government Arts & Science College, Cheyyar", "district": "Tiruvannamalai", "region": "Vellore", "college_type": "Government"},
    {"college_code": "TNDCE-065", "name": "Government Arts & Science College, Polur", "district": "Tiruvannamalai", "region": "Vellore", "college_type": "Government"},
    {"college_code": "TNDCE-066", "name": "Government Arts & Science College, Chengam", "district": "Tiruvannamalai", "region": "Vellore", "college_type": "Government"},
    {"college_code": "TNDCE-067", "name": "Government Arts & Science College, Villupuram", "district": "Villupuram", "region": "Chennai", "college_type": "Government"},
    {"college_code": "TNDCE-068", "name": "Government Arts & Science College, Tindivanam", "district": "Villupuram", "region": "Chennai", "college_type": "Government"},
    {"college_code": "TNDCE-069", "name": "Government Arts & Science College, Kallakurichi", "district": "Kallakurichi", "region": "Chennai", "college_type": "Government"},
    {"college_code": "TNDCE-070", "name": "Government Arts & Science College, Tirukoilur", "district": "Kallakurichi", "region": "Chennai", "college_type": "Government"},
    {"college_code": "TNDCE-071", "name": "Government Arts & Science College, Pennadam", "district": "Cuddalore", "region": "Chennai", "college_type": "Government"},
    {"college_code": "TNDCE-072", "name": "Government Arts & Science College, Vridhachalam", "district": "Cuddalore", "region": "Chennai", "college_type": "Government"},
    {"college_code": "TNDCE-073", "name": "Government Arts & Science College, Kattumannarkoil", "district": "Cuddalore", "region": "Chennai", "college_type": "Government"},
    {"college_code": "TNDCE-074", "name": "Government Arts & Science College, Kurinjipadi", "district": "Cuddalore", "region": "Chennai", "college_type": "Government"},
    {"college_code": "TNDCE-075", "name": "Government Arts & Science College, Chengalpattu", "district": "Chengalpattu", "region": "Chennai", "college_type": "Government"},
    {"college_code": "TNDCE-076", "name": "Government Arts & Science College, Maduranthakam", "district": "Chengalpattu", "region": "Chennai", "college_type": "Government"},
    {"college_code": "TNDCE-077", "name": "Government Arts & Science College, Ponneri", "district": "Tiruvallur", "region": "Chennai", "college_type": "Government"},
    {"college_code": "TNDCE-078", "name": "Government Arts & Science College, Tiruttani", "district": "Tiruvallur", "region": "Chennai", "college_type": "Government"},
    {"college_code": "TNDCE-079", "name": "Government Arts & Science College, Sriperumbudur", "district": "Kanchipuram", "region": "Chennai", "college_type": "Government"}
]

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
    college_id: Optional[str] = None

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
    college_id: Optional[str] = None

# ─── In-process cache for colleges (5-minute TTL) ────────────────────────
_colleges_cache: list = []
_colleges_cache_ts: float = 0.0
_COLLEGES_CACHE_TTL = 300  # seconds

async def sync_colleges_task(db: AsyncSession):
    """Bulk-insert all seed colleges in ONE query using ON CONFLICT DO NOTHING."""
    global _colleges_cache, _colleges_cache_ts
    if not COLLEGES_SEED:
        return
    stmt = pg_insert(TNDCECollege).values([
        {
            "id": uuid.uuid4(),
            "college_code": item["college_code"],
            "name": item["name"],
            "district": item["district"],
            "region": item["region"],
            "college_type": item["college_type"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "version_id": 1,
        }
        for item in COLLEGES_SEED
    ]).on_conflict_do_nothing(index_elements=["college_code"])
    await db.execute(stmt)
    await db.commit()
    # Invalidate cache
    _colleges_cache = []
    _colleges_cache_ts = 0.0

@router.get("/colleges", response_model=APIResponse[List[dict]])
async def get_colleges(search: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    global _colleges_cache, _colleges_cache_ts

    # Use cache when no search filter and cache is fresh
    if not search and _colleges_cache and (time.monotonic() - _colleges_cache_ts) < _COLLEGES_CACHE_TTL:
        return success_response(data=_colleges_cache)

    count_stmt = select(func.count()).select_from(TNDCECollege)
    count_res = await db.execute(count_stmt)
    count = count_res.scalar()
    if count == 0:
        await sync_colleges_task(db)

    stmt = select(TNDCECollege)
    if search:
        search_term = f"%{search}%"
        stmt = stmt.where(
            TNDCECollege.name.ilike(search_term) |
            TNDCECollege.district.ilike(search_term) |
            TNDCECollege.region.ilike(search_term) |
            TNDCECollege.college_type.ilike(search_term)
        )
    stmt = stmt.order_by(TNDCECollege.name.asc())
    result = await db.execute(stmt)
    colleges = result.scalars().all()

    data = [{
        "id": str(c.id),
        "college_code": c.college_code,
        "name": c.name,
        "district": c.district,
        "region": c.region,
        "college_type": c.college_type
    } for c in colleges]

    # Store in cache if no search filter
    if not search:
        _colleges_cache = data
        _colleges_cache_ts = time.monotonic()

    return success_response(data=data)

@router.post("/colleges/sync", response_model=APIResponse[dict])
async def sync_colleges(db: AsyncSession = Depends(get_db)):
    await sync_colleges_task(db)
    return success_response(message="Colleges synchronized successfully")

async def _student_payload(profile: StudentProfile, user: User, organization: Optional[Organization], department: Optional[Department], batch: Optional[Batch], db: AsyncSession, is_list: bool = False):
    # Default values to avoid N+1 queries during list view
    mentor_user = None
    program_name = ""
    atts = []
    quizzes = []
    docs = []
    placement_status = "Eligible"
    company_name = ""
    package_val = ""
    college_id = ""

    attendance_pct = 90.0
    quiz_score = 82.5
    documents_list = []

    from app.models.core.allocation import Allocation
    from app.models.profiles.employee_profile import EmployeeProfile
    from app.models.academic.program import Program
    from app.models.academic.batch import Batch

    # 1. Fetch Mentor from MentorAssignment
    mentor_user = None
    mentor_alloc_stmt = select(User).join(
        MentorProfile, MentorProfile.user_id == User.id
    ).join(
        MentorAssignment, MentorAssignment.mentor_profile_id == MentorProfile.id
    ).where(
        MentorAssignment.student_profile_id == profile.id
    ).order_by(MentorAssignment.created_at.desc())
    mentor_alloc_res = await db.execute(mentor_alloc_stmt)
    mentor_user = mentor_alloc_res.scalars().first()

    # 2 & 3. Fetch Batch and Program
    alloc_batch_name = ""
    alloc_program_name = ""
    if profile.batch_id:
        batch_stmt = select(Batch).where(Batch.id == profile.batch_id)
        batch_res = await db.execute(batch_stmt)
        alloc_batch = batch_res.scalars().first()
        if alloc_batch:
            alloc_batch_name = alloc_batch.name
            prog_stmt = select(Program).where(Program.id == alloc_batch.program_id)
            prog_res = await db.execute(prog_stmt)
            alloc_prog = prog_res.scalars().first()
            if alloc_prog:
                alloc_program_name = alloc_prog.name

    if not is_list:

        # 3. Fetch attendance
        att_stmt = select(Attendance).where(Attendance.student_profile_id == profile.id)
        att_res = await db.execute(att_stmt)
        atts = att_res.scalars().all()
        present_days = sum(1 for a in atts if a.status == "PRESENT")
        absent_days = sum(1 for a in atts if a.status == "ABSENT")
        late_arrivals = sum(1 for a in atts if a.status == "LATE")
        total_days = present_days + absent_days
        if total_days > 0:
            attendance_pct = round((present_days / total_days * 100), 1)

        # 4. Fetch quiz score
        quiz_stmt = select(QuizAttempt).where(QuizAttempt.student_profile_id == profile.id)
        quiz_res = await db.execute(quiz_stmt)
        quizzes = quiz_res.scalars().all()
        if quizzes:
            quiz_score = round(sum(float(q.score) for q in quizzes) / len(quizzes), 1)

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
        
        # Map referential TNDCE college id
        if organization:
            col_rec_stmt = select(TNDCECollege).where(TNDCECollege.college_code == organization.code)
            col_rec_res = await db.execute(col_rec_stmt)
            col_rec = col_rec_res.scalars().first()
            if col_rec:
                college_id = str(col_rec.id)

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
    mapped_prog = skills_dict.get("program", alloc_program_name or "Summer Internship")

    # Generate timeline
    timeline_events = [
        {"date": profile.created_at.date().isoformat(), "title": "Student Enrolled", "description": "Profile registered in SLMS", "type": "registration"}
    ]
    for att in atts[:3]:
        timeline_events.append({"date": att.date.isoformat(), "title": "Attendance Marked", "description": f"Status: {att.status}", "type": "assessment"})
    for q in quizzes[:3]:
        timeline_events.append({"date": q.created_at.date().isoformat() if q.created_at else "", "title": "Assessment Completed", "description": f"Score: {q.score}%", "type": "assessment"})

    mentor_user_id = str(mentor_user.id) if mentor_user else ""
    mentor_user_name = mentor_user.username if mentor_user else "Unassigned"
    
    # Fallback to direct batch object if allocation is missing
    final_batch_name = alloc_batch_name or (batch.name if batch else "Unassigned")
    final_batch_id = str(profile.batch_id) if profile.batch_id else ""

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
        "email": user.email if user else "",
        "phone": (user.phone if user else "") or "",
        "enrollment_number": profile.enrollment_number,
        "college_id": college_id,
        "college_name": organization.name if organization else "",
        
        # Extended details
        "personal_info": {
            "name": user.username if user else "Unknown",
            "email": user.email if user else "",
            "phone": (user.phone if user else "") or "",
            "dob": dob,
            "gender": gender,
            "address": address,
            "avatar": "".join([part[0] for part in (user.username or "Unknown").split(" ") if part]).upper()[:2] if user and user.username else "UN"
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
            "batchName": final_batch_name,
            "mentorId": mentor_user_id,
            "mentorName": mentor_user_name,
            "joiningDate": profile.created_at.date().isoformat() if profile.created_at else "",
            "expectedCompletion": (profile.created_at.date() + timedelta(days=180)).isoformat() if profile.created_at else ""
        },
        "documents": documents_list,
        "credentials": {
            "username": user.email if user else "",
            "portalAccess": True,
            "lmsAccess": True,
            "assessmentAccess": True
        },
        "batch": {
            "id": final_batch_id,
            "name": final_batch_name,
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

@router.get("", response_model=APIResponse[List[dict]])
async def get_student_list(
    current_user: User = Depends(require_permission("students", "read")),
    db: AsyncSession = Depends(get_db)
):
    try:
        from app.core.security_filters import apply_student_filter
        
        base_stmt = (
            select(StudentProfile, User, Organization, Department, Batch)
            .join(User, User.id == StudentProfile.user_id)
            .outerjoin(Organization, Organization.id == StudentProfile.organization_id)
            .outerjoin(Department, Department.id == StudentProfile.department_id)
            .outerjoin(Batch, Batch.id == StudentProfile.batch_id)
            .where(StudentProfile.deleted_at.is_(None))
        )
        
        filtered_stmt = await apply_student_filter(base_stmt, db, current_user, StudentProfile)
        stmt = filtered_stmt.order_by(StudentProfile.created_at.desc())
        result = await db.execute(stmt)
        rows = result.all()
        data = []
        for p, u, o, d, b in rows:
            payload = await _student_payload(p, u, o, d, b, db, is_list=True)
            data.append(payload)
        return success_response(data=data)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return success_response(data=[], message=str(e))

@router.get("/{id}", response_model=APIResponse[dict])
async def get_student(
    id: UUID,
    current_user: User = Depends(require_permission("students", "read")),
    db: AsyncSession = Depends(get_db)
):
    from app.core.security_filters import apply_student_filter
    
    stmt = (
        select(StudentProfile, User, Organization, Department, Batch)
        .join(User, User.id == StudentProfile.user_id)
        .outerjoin(Organization, Organization.id == StudentProfile.organization_id)
        .outerjoin(Department, Department.id == StudentProfile.department_id)
        .outerjoin(Batch, Batch.id == StudentProfile.batch_id)
        .where(StudentProfile.id == id)
    )
    stmt = await apply_student_filter(stmt, db, current_user, StudentProfile)
    result = await db.execute(stmt)
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Student profile not found")
    profile, user, org, dept, batch = row
    payload = await _student_payload(profile, user, org, dept, batch, db)
    return success_response(data=payload)

@router.post("/bulk-credentials", response_model=APIResponse[dict])
async def generate_bulk_credentials(
    student_ids: List[str],
    db: AsyncSession = Depends(get_db)
):
    try:
        from app.models.authentication.user import User
        import uuid
        uuids = [uuid.UUID(sid) for sid in student_ids]

        stmt = select(User).join(StudentProfile, StudentProfile.user_id == User.id).where(StudentProfile.id.in_(uuids))
        res = await db.execute(stmt)
        users = res.scalars().all()

        for u in users:
            u.account_status = "ACTIVE"
        
        await db.commit()
        return success_response(message=f"Successfully generated credentials for {len(users)} students.")
    except Exception as e:
        import traceback
        traceback.print_exc()
        await db.rollback()
        from app.core.responses import error_response
        return error_response(message="Failed to generate credentials", status_code=500)

@router.post("", response_model=APIResponse[dict])
async def create_student(data: StudentCreate, db: AsyncSession = Depends(get_db)):
    # 1. Duplicate check for enrollment
    if data.enrollment_number:
        enroll_stmt = select(StudentProfile).where(StudentProfile.enrollment_number == data.enrollment_number)
        enroll_res = await db.execute(enroll_stmt)
        if enroll_res.scalars().first():
            raise HTTPException(status_code=409, detail="Student register number already exists")

    existing_user = None
    # 2. Duplicate check for email
    email_stmt = select(User).where(User.email == data.email)
    email_res = await db.execute(email_stmt)
    existing_user = email_res.scalars().first()
    
    # 3. Duplicate check for phone
    if data.phone and not existing_user:
        phone_stmt = select(User).where(User.phone == data.phone)
        phone_res = await db.execute(phone_stmt)
        existing_user = phone_res.scalars().first()

    # Resolve selected college to dynamic organization
    organization = None
    if data.college_id:
        from app.models.organizations.tndce_college import TNDCECollege
        college_uuid = UUID(data.college_id)
        col_stmt = select(TNDCECollege).where(TNDCECollege.id == college_uuid)
        col_res = await db.execute(col_stmt)
        college = col_res.scalars().first()
        if not college:
            raise HTTPException(status_code=400, detail="Invalid TNDCE College ID selected")
        
        # Check if corresponding Organization already exists in org_organizations
        org_stmt = select(Organization).where(Organization.code == college.college_code)
        org_res = await db.execute(org_stmt)
        organization = org_res.scalars().first()
        if not organization:
            organization = Organization(
                name=college.name,
                code=college.college_code,
                type=college.college_type,
                city=college.district,
                state=college.region,
                partnership_status="Active"
            )
            db.add(organization)
            await db.flush()

    if not organization:
        # Fall back to first organization as default
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

    full_name = f"{data.first_name.strip()} {data.last_name.strip()}".strip()
    
    if existing_user:
        new_user = existing_user
        new_user.phone = data.phone or new_user.phone
        # Find if student profile exists
        prof_stmt = select(StudentProfile).where(StudentProfile.user_id == new_user.id)
        prof_res = await db.execute(prof_stmt)
        new_student = prof_res.scalars().first()
        
        if new_student:
            new_student.organization_id = organization.id
            new_student.department_id = department.id if department else None
            new_student.enrollment_number = data.enrollment_number or new_student.enrollment_number
        else:
            new_student = StudentProfile(
                user_id=new_user.id,
                organization_id=organization.id,
                department_id=department.id if department else None,
                enrollment_number=data.enrollment_number or f"ENR-{uuid.uuid4().hex[:8].upper()}",
            )
            db.add(new_student)
    else:
        # Create User
        # Ensure username is unique
        base_username = full_name
        username = base_username
        counter = 1
        while True:
            dup_user_stmt = select(User).where(User.username == username)
            dup_user_res = await db.execute(dup_user_stmt)
            if not dup_user_res.scalars().first():
                break
            username = f"{base_username}{counter}"
            counter += 1

        new_user = User(
            email=data.email,
            phone=data.phone,
            username=username,
            password_hash=hash_password("ChangeMe@123"),
            account_status=data.status or "Applied",
            email_verified=True,
            phone_verified=False
        )
        db.add(new_user)
        await db.flush()

        # Create Student Profile
        new_student = StudentProfile(
            user_id=new_user.id,
            organization_id=organization.id,
            department_id=department.id if department else None,
            batch_id=batch.id if batch else None,
            enrollment_number=data.enrollment_number or f"ENR-{uuid.uuid4().hex[:8].upper()}",
        )
        db.add(new_student)
        await db.flush()

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

    new_student.skills = skills_data
    if not new_student.batch_id and batch:
        new_student.batch_id = batch.id

    await db.commit()
    await db.refresh(new_student)
    await db.refresh(new_user)

    # Handle optional initial mentor assignment
    if data.mentor_id:
        try:
            mentor_uuid = uuid.UUID(str(data.mentor_id))
            mentor_stmt = select(MentorProfile).where(
                (MentorProfile.user_id == mentor_uuid) | 
                (MentorProfile.id == mentor_uuid) | 
                (MentorProfile.employee_profile_id == mentor_uuid)
            )
            mentor_res = await db.execute(mentor_stmt)
            mentor_prof = mentor_res.scalars().first()
            if not mentor_prof:
                from app.models.profiles.employee_profile import EmployeeProfile
                emp_res = await db.execute(select(EmployeeProfile).where(EmployeeProfile.id == mentor_uuid))
                emp = emp_res.scalars().first()
                if emp:
                    mentor_prof = MentorProfile(
                        user_id=emp.user_id,
                        employee_profile_id=emp.id,
                        expertise="General",
                        max_capacity=10,
                        is_available=True
                    )
                    db.add(mentor_prof)
                    await db.flush()

            if mentor_prof:
                assignment = MentorAssignment(
                    student_profile_id=new_student.id,
                    mentor_profile_id=mentor_prof.id,
                    start_date=date.today(),
                    status="ACTIVE"
                )
                db.add(assignment)
                await db.commit()
        except Exception:
            pass

    payload = await _student_payload(new_student, new_user, organization, department, batch, db)
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

    # 7. Update College Selection
    if "college_id" in update_dict and update_dict["college_id"]:
        college_uuid = UUID(update_dict["college_id"])
        col_stmt = select(TNDCECollege).where(TNDCECollege.id == college_uuid)
        col_res = await db.execute(col_stmt)
        college = col_res.scalars().first()
        if college:
            org_stmt = select(Organization).where(Organization.code == college.college_code)
            org_res = await db.execute(org_stmt)
            organization_obj = org_res.scalars().first()
            if not organization_obj:
                organization_obj = Organization(
                    name=college.name,
                    code=college.college_code,
                    type=college.college_type,
                    city=college.district,
                    state=college.region,
                    partnership_status="Active"
                )
                db.add(organization_obj)
                await db.flush()
            profile.organization_id = organization_obj.id
            org = organization_obj

    # 8. Update Mentor Assignment
    if "mentor_id" in update_dict:
        # Delete old mentor assignments
        await db.execute(delete(MentorAssignment).where(MentorAssignment.student_profile_id == profile.id))
        if update_dict["mentor_id"]:
            m_id = update_dict["mentor_id"]
            try:
                m_uuid = UUID(str(m_id))
                mentor_stmt = select(MentorProfile).where(
                    (MentorProfile.user_id == m_uuid) | 
                    (MentorProfile.id == m_uuid) | 
                    (MentorProfile.employee_profile_id == m_uuid)
                )
                mentor_res = await db.execute(mentor_stmt)
                mentor_prof = mentor_res.scalars().first()
                if not mentor_prof:
                    # Look up the employee to get user_id
                    from app.models.profiles.employee_profile import EmployeeProfile
                    emp_res = await db.execute(select(EmployeeProfile).where(EmployeeProfile.id == m_uuid))
                    emp = emp_res.scalars().first()
                    if emp:
                        mentor_prof = MentorProfile(
                            user_id=emp.user_id,
                            employee_profile_id=emp.id,
                            expertise="General",
                            max_capacity=10,
                            is_available=True
                        )
                        db.add(mentor_prof)
                        await db.flush()
            except Exception:
                mentor_prof = None

            if mentor_prof:
                assignment = MentorAssignment(
                    student_profile_id=profile.id,
                    mentor_profile_id=mentor_prof.id,
                    start_date=date.today(),
                    status="ACTIVE"
                )
                db.add(assignment)

    # 9. Update extra fields in skills JSONB
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
