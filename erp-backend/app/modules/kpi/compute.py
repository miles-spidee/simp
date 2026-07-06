from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.alumni_placements.placement import PlacementApplication
from app.models.lms.quiz import QuizAttempt
from app.models.internships.certificate import Certificate
from app.models.finance.invoice import Invoice
from app.models.internships.attendance import Attendance
from app.models.profiles.mentor_profile import MentorProfile
from app.models.profiles.student_profile import StudentProfile
from datetime import date

async def compute_kpis(db: AsyncSession):
    # Overall Placement Rate
    placed = await db.scalar(select(func.count(PlacementApplication.id)).where(PlacementApplication.status == "PLACED"))
    total_students = await db.scalar(select(func.count(StudentProfile.id)))
    placement_rate = (placed / total_students * 100) if total_students else 0.0

    # Average Course Score
    avg_score = await db.scalar(select(func.avg(QuizAttempt.score)))
    avg_score = float(avg_score) if avg_score else 0.0

    # Digital Certificates Issued
    certs = await db.scalar(select(func.count(Certificate.id)))
    
    # Total Invoice Collection
    collection = await db.scalar(select(func.sum(Invoice.amount_paid)).where(Invoice.status == "PAID"))
    collection = float(collection) if collection else 0.0

    # Daily Student Attendance
    today = date.today()
    present_today = await db.scalar(select(func.count(Attendance.id)).where(Attendance.date == today, Attendance.status == "PRESENT"))
    total_attendance_today = await db.scalar(select(func.count(Attendance.id)).where(Attendance.date == today))
    attendance_rate = (present_today / total_attendance_today * 100) if total_attendance_today else 0.0

    # Peer Mentor Coverage
    mentors = await db.scalar(select(func.count(MentorProfile.id)))
    mentor_coverage = (mentors / total_students * 100) if total_students else 0.0

    return {
        "Overall Placement Rate": placement_rate,
        "Average Course Score": avg_score,
        "Digital Certificates Issued": certs,
        "Total Invoice Collection": collection,
        "Daily Student Attendance": attendance_rate,
        "Peer Mentor Coverage": mentor_coverage,
    }
