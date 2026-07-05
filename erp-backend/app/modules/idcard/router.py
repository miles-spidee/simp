from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.responses import success_response
from app.core.dependencies import get_current_user
from app.models.authentication.user import User
from app.models.profiles.student_profile import StudentProfile
from app.models.profiles.employee_profile import EmployeeProfile
from app.models.core.reference.demographics import BloodGroup
from app.models.academic.batch import Batch
from app.models.academic.program import Program
from app.models.organizations.department import Department
import uuid
import datetime

router = APIRouter()


async def _resolve_blood_group(db: AsyncSession, blood_group_id) -> str:
    """Look up blood group name from ref table, return '—' if missing."""
    if not blood_group_id:
        return "—"
    bg = await db.get(BloodGroup, blood_group_id)
    return bg.name if bg else "—"


def _build_card(
    user: User,
    profile_type: str,
    enrollment_or_code: str,
    department: str = "—",
    program: str = "—",
    batch: str = "—",
    blood_group: str = "—",
    emergency_contact: str = "—",
) -> dict:
    """Build a DigitalIDCard dict from user + profile data."""
    uid_int = int(str(user.id).replace("-", "")[:8], 16) % 10000
    card_number = f"ID-2026-{1000 + uid_int}"
    student_id = enrollment_or_code or (
        f"STU-{100 + uid_int}" if profile_type == "student" else f"EMP-{500 + uid_int}"
    )
    issue_date = user.created_at or datetime.datetime.now(datetime.timezone.utc)
    expiry_date = issue_date + datetime.timedelta(days=365)

    # Derive status from the user's actual account_status
    status = "Active" if (user.account_status or "").upper() == "ACTIVE" else "Inactive"

    return {
        "id": f"IDC-{user.id}",
        "cardNumber": card_number,
        "studentId": student_id,
        "studentName": user.username or "User",
        "department": department,
        "program": program,
        "batch": batch,
        "photoUrl": user.profile_image_url
        or f"https://api.dicebear.com/7.x/initials/svg?seed={user.username}&backgroundColor=0d9488,14b8a6,0f172a",
        "qrCodeData": f"https://pinesphere.com/verify/{card_number}",
        "issueDate": issue_date.isoformat(),
        "expiryDate": expiry_date.isoformat(),
        "status": status,
        "bloodGroup": blood_group,
        "emergencyContact": emergency_contact,
    }


async def _build_card_for_user(db: AsyncSession, user: User) -> dict:
    """Build a complete ID card for a user, loading the correct profile."""

    # ── Try student profile first ──
    stu_result = await db.execute(
        select(StudentProfile).where(
            StudentProfile.user_id == user.id,
            StudentProfile.deleted_at.is_(None),
        )
    )
    stu = stu_result.scalars().first()
    if stu:
        # Department
        dept_name = "—"
        if stu.department_id:
            dept = await db.get(Department, stu.department_id)
            if dept:
                dept_name = dept.name

        # Batch + Program (Batch → Program)
        batch_name = "—"
        program_name = "—"
        if stu.batch_id:
            batch_obj = await db.get(Batch, stu.batch_id)
            if batch_obj:
                batch_name = batch_obj.name
                if batch_obj.program_id:
                    program_obj = await db.get(Program, batch_obj.program_id)
                    if program_obj:
                        program_name = program_obj.name

        # Blood group + Emergency contact
        blood_group = await _resolve_blood_group(db, stu.blood_group_id)
        emergency_contact = stu.emergency_contact or "—"

        return _build_card(
            user,
            profile_type="student",
            enrollment_or_code=stu.enrollment_number,
            department=dept_name,
            program=program_name,
            batch=batch_name,
            blood_group=blood_group,
            emergency_contact=emergency_contact,
        )

    # ── Try employee profile ──
    emp_result = await db.execute(
        select(EmployeeProfile).where(
            EmployeeProfile.user_id == user.id,
            EmployeeProfile.deleted_at.is_(None),
        )
    )
    emp = emp_result.scalars().first()
    if emp:
        dept_name = "—"
        if emp.department_id:
            dept = await db.get(Department, emp.department_id)
            if dept:
                dept_name = dept.name

        blood_group = await _resolve_blood_group(db, emp.blood_group_id)
        emergency_contact = emp.emergency_contact or "—"

        return _build_card(
            user,
            profile_type="employee",
            enrollment_or_code=emp.employee_code,
            department=dept_name,
            program=emp.designation or "Employee",
            batch="Staff",
            blood_group=blood_group,
            emergency_contact=emergency_contact,
        )

    # ── Fallback — generate from user data only ──
    return _build_card(user, profile_type="general", enrollment_or_code="")


@router.get("/my")
async def get_my_idcard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the digital ID card for the currently authenticated user."""
    card = await _build_card_for_user(db, current_user)
    return success_response(data=card)


@router.get("/verify/{card_number}")
async def verify_card(card_number: str, db: AsyncSession = Depends(get_db)):
    """Verify a card by its card number."""
    if not card_number.startswith("ID-"):
        return success_response(
            data={"verified": False, "cardNumber": card_number, "status": "Unknown"}
        )

    # Reverse-lookup: scan active users and find the one whose UUID hashes to
    # this card number. This is a lightweight check — only active users are
    # candidates and we stop on first match.
    result = await db.execute(
        select(User).where(User.deleted_at.is_(None))
    )
    for user in result.scalars():
        uid_int = int(str(user.id).replace("-", "")[:8], 16) % 10000
        expected = f"ID-2026-{1000 + uid_int}"
        if expected == card_number:
            status = "Active" if (user.account_status or "").upper() == "ACTIVE" else "Inactive"
            return success_response(
                data={
                    "verified": True,
                    "cardNumber": card_number,
                    "status": status,
                    "studentName": user.username,
                }
            )

    return success_response(
        data={"verified": False, "cardNumber": card_number, "status": "Not Found"}
    )


@router.get("/")
async def list_idcards(db: AsyncSession = Depends(get_db)):
    """List all users who have ID cards (i.e., all active users)."""
    result = await db.execute(
        select(User).where(User.deleted_at.is_(None)).limit(100)
    )
    users = result.scalars().all()
    cards = []
    for u in users:
        card = await _build_card_for_user(db, u)
        cards.append(card)
    return success_response(data=cards)


@router.get("/{path:path}")
async def fallback_get_idcard(path: str, db: AsyncSession = Depends(get_db)):
    return await list_idcards(db)
