from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.dependencies import require_permission
from app.core.responses import APIResponse, success_response

from app.models.authentication.user import User
from app.models.profiles.mentor_profile import MentorProfile
from app.models.profiles.employee_profile import EmployeeProfile
from app.models.profiles.student_profile import StudentProfile
from app.models.academic.batch import Batch
from app.models.academic.program import Program
from app.models.internships.mentor_assignment import MentorAssignment
from app.models.internships.task import Task

from app.modules.mentor.schemas import (
    MentorProfileCreate,
    MentorProfileUpdate,
    MentorProfileResponse,
    MentorAssignmentCreate,
    MentorBatchMappingCreate,
)

router = APIRouter()


async def copy_existing_tasks_to_assignment(db: AsyncSession, assignment_id: UUID):
    # Find all unique task templates (grouping by title)
    stmt = (
        select(Task.title, Task.description, Task.due_date)
        .group_by(Task.title, Task.description, Task.due_date)
    )
    res = await db.execute(stmt)
    templates = res.all()
    
    for title, desc, due_date in templates:
        new_task = Task(
            assignment_id=assignment_id,
            title=title,
            description=desc,
            due_date=due_date,
            status="TODO"
        )
        db.add(new_task)


def map_single_response(m: MentorProfile, emp: EmployeeProfile | None, usr: User | None, count: int) -> MentorProfileResponse:
    emp_name = "Unknown Mentor"
    emp_code = None
    if emp:
        emp_name = f"{emp.first_name} {emp.last_name}"
        emp_code = emp.employee_code
    elif usr:
        emp_name = usr.username.title()
        emp_code = str(m.user_id)[:8]
        
    expertise_list = [e.strip() for e in m.expertise.split(",")] if m.expertise else []
    
    return MentorProfileResponse(
        mentor_profile_id=m.id,
        employee_id=emp_code or str(m.employee_profile_id or m.user_id),
        employeeName=emp_name,
        mentor_bio=m.expertise or "",
        mentor_expertise=expertise_list,
        years_of_experience=m.years_of_experience or 0,
        max_student_capacity=m.max_capacity,
        current_student_count=count,
        is_available=m.is_available,
        created_at=m.created_at.isoformat() if m.created_at else "",
        updated_at=m.updated_at.isoformat() if m.updated_at else "",
    )


@router.get("/", response_model=APIResponse[list[MentorProfileResponse]])
async def get_mentors(
    current_user: User = Depends(require_permission("mentor", "read")),
    db: AsyncSession = Depends(get_db),
):
    # Fetch all mentors
    stmt = (
        select(MentorProfile, EmployeeProfile, User)
        .outerjoin(EmployeeProfile, EmployeeProfile.id == MentorProfile.employee_profile_id)
        .outerjoin(User, User.id == MentorProfile.user_id)
        .where(MentorProfile.deleted_at.is_(None))
    )
    result = await db.execute(stmt)
    rows = result.all()

    # Fetch active student counts for each mentor
    stmt_count = (
        select(MentorAssignment.mentor_profile_id, func.count(MentorAssignment.id))
        .where(MentorAssignment.status == "ACTIVE")
        .group_by(MentorAssignment.mentor_profile_id)
    )
    res_count = await db.execute(stmt_count)
    counts = dict(res_count.all())

    data = []
    for m, emp, usr in rows:
        data.append(map_single_response(m, emp, usr, counts.get(m.id, 0)))

    return success_response(data=data)


@router.get("/assignments")
async def get_assignments(
    current_user: User = Depends(require_permission("mentor", "read")),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(MentorAssignment, MentorProfile, EmployeeProfile, StudentProfile, User, Batch)
        .join(MentorProfile, MentorProfile.id == MentorAssignment.mentor_profile_id)
        .outerjoin(EmployeeProfile, EmployeeProfile.id == MentorProfile.employee_profile_id)
        .join(StudentProfile, StudentProfile.id == MentorAssignment.student_profile_id)
        .join(User, User.id == StudentProfile.user_id)
        .outerjoin(Batch, Batch.id == StudentProfile.batch_id)
        .where(MentorAssignment.deleted_at.is_(None))
    )
    res = await db.execute(stmt)
    rows = res.all()

    data = []
    for ass, m, emp, stu, usr, batch in rows:
        mentor_name = "Unknown Mentor"
        emp_code = None
        if emp:
            mentor_name = f"{emp.first_name} {emp.last_name}"
            emp_code = emp.employee_code
        
        data.append({
            "id": str(ass.id),
            "mentorProfileId": str(ass.mentor_profile_id),
            "mentorName": mentor_name,
            "employeeId": emp_code or str(m.employee_profile_id or m.user_id),
            "studentId": str(stu.id),
            "studentName": f"{stu.first_name} {stu.last_name}" if hasattr(stu, "first_name") and stu.first_name else usr.username.title(),
            "internId": stu.enrollment_number or "",
            "batchId": str(stu.batch_id) if stu.batch_id else "",
            "batchName": batch.name if batch else "Unassigned",
            "assignedDate": ass.start_date.isoformat() if ass.start_date else "",
            "status": ass.status.title(),
            "assignedBy": "System"
        })
    return success_response(data=data)


@router.post("/assignments")
async def create_assignment(
    payload: MentorAssignmentCreate,
    current_user: User = Depends(require_permission("mentor", "create")),
    db: AsyncSession = Depends(get_db)
):
    from datetime import date
    
    # Check if assignment already exists
    stmt = select(MentorAssignment).where(
        MentorAssignment.student_profile_id == payload.studentId,
        MentorAssignment.mentor_profile_id == payload.mentorProfileId
    )
    res = await db.execute(stmt)
    existing = res.scalars().first()
    if existing:
        if existing.status != "ACTIVE":
            existing.status = "ACTIVE"
            await db.commit()
        return success_response(data={"id": str(existing.id)})

    ass = MentorAssignment(
        student_profile_id=payload.studentId,
        mentor_profile_id=payload.mentorProfileId,
        start_date=date.today(),
        status="ACTIVE"
    )
    db.add(ass)
    await db.flush()
    
    # Copy existing unique tasks
    await copy_existing_tasks_to_assignment(db, ass.id)
    
    await db.commit()
    await db.refresh(ass)
    return success_response(data={"id": str(ass.id)})


@router.get("/batch-mappings")
async def get_batch_mappings(
    current_user: User = Depends(require_permission("mentor", "read")),
    db: AsyncSession = Depends(get_db)
):
    # We select all assignments and join profiles to group them dynamically
    stmt = (
        select(
            MentorAssignment.mentor_profile_id,
            StudentProfile.batch_id,
            func.count(StudentProfile.id).label("student_count"),
            func.min(MentorAssignment.id).label("mapping_id"),
            func.min(MentorAssignment.start_date).label("mapped_date")
        )
        .join(StudentProfile, StudentProfile.id == MentorAssignment.student_profile_id)
        .where(MentorAssignment.status == "ACTIVE")
        .group_by(MentorAssignment.mentor_profile_id, StudentProfile.batch_id)
    )
    res = await db.execute(stmt)
    groups = res.all()

    data = []
    for mentor_prof_id, batch_id, student_count, mapping_id, mapped_date in groups:
        if not batch_id:
            continue
            
        # Fetch Mentor & Employee name
        stmt_mentor = (
            select(MentorProfile, EmployeeProfile)
            .outerjoin(EmployeeProfile, EmployeeProfile.id == MentorProfile.employee_profile_id)
            .where(MentorProfile.id == mentor_prof_id)
        )
        res_mentor = await db.execute(stmt_mentor)
        mentor_row = res_mentor.first()
        if not mentor_row:
            continue
        m, emp = mentor_row
        mentor_name = f"{emp.first_name} {emp.last_name}" if emp else "Unknown Mentor"
        emp_code = emp.employee_code if emp else str(m.employee_profile_id or m.user_id)

        # Fetch Batch & Program details
        stmt_batch = (
            select(Batch, Program)
            .join(Program, Program.id == Batch.program_id)
            .where(Batch.id == batch_id)
        )
        res_batch = await db.execute(stmt_batch)
        batch_row = res_batch.first()
        if not batch_row:
            continue
        batch, prog = batch_row

        data.append({
            "id": str(mapping_id),
            "mentorProfileId": str(mentor_prof_id),
            "mentorName": mentor_name,
            "employeeId": emp_code,
            "batchId": str(batch.id),
            "batchName": batch.name,
            "batchCode": batch.code or batch.name[:5].upper(),
            "programName": prog.name,
            "studentCount": student_count,
            "batchCapacity": batch.max_capacity or 150,
            "mappedDate": mapped_date.isoformat() if mapped_date else "",
            "status": "Active",
            "mappedBy": "System"
        })

    return success_response(data=data)


@router.post("/batch-mappings")
async def create_batch_mapping(
    payload: MentorBatchMappingCreate,
    current_user: User = Depends(require_permission("mentor", "create")),
    db: AsyncSession = Depends(get_db)
):
    from datetime import date
    
    # Fetch all students in the batch
    stmt_students = select(StudentProfile).where(StudentProfile.batch_id == payload.batchId)
    res_students = await db.execute(stmt_students)
    students = res_students.scalars().all()
    
    # Assign mentor to each student
    for stu in students:
        stmt_exist = select(MentorAssignment).where(
            MentorAssignment.student_profile_id == stu.id,
            MentorAssignment.mentor_profile_id == payload.mentorProfileId
        )
        res_exist = await db.execute(stmt_exist)
        existing = res_exist.scalars().first()
        if not existing:
            ass = MentorAssignment(
                student_profile_id=stu.id,
                mentor_profile_id=payload.mentorProfileId,
                start_date=date.today(),
                status="ACTIVE"
            )
            db.add(ass)
            await db.flush()
            
            # Copy existing unique tasks
            await copy_existing_tasks_to_assignment(db, ass.id)
            
    await db.commit()
    return success_response(data={"success": True})


@router.get("/{mentor_id}", response_model=APIResponse[MentorProfileResponse])
async def get_mentor(
    mentor_id: UUID,
    current_user: User = Depends(require_permission("mentor", "read")),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(MentorProfile, EmployeeProfile, User)
        .outerjoin(EmployeeProfile, EmployeeProfile.id == MentorProfile.employee_profile_id)
        .outerjoin(User, User.id == MentorProfile.user_id)
        .where(MentorProfile.id == mentor_id)
        .where(MentorProfile.deleted_at.is_(None))
    )
    result = await db.execute(stmt)
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Mentor profile not found")

    m, emp, usr = row
    
    # Fetch count
    stmt_count = select(func.count(MentorAssignment.id)).where(
        MentorAssignment.mentor_profile_id == m.id,
        MentorAssignment.status == "ACTIVE"
    )
    res_count = await db.execute(stmt_count)
    count = res_count.scalar() or 0

    return success_response(data=map_single_response(m, emp, usr, count))


@router.patch("/{mentor_id}", response_model=APIResponse[MentorProfileResponse])
async def patch_mentor(
    mentor_id: UUID,
    payload: MentorProfileUpdate,
    current_user: User = Depends(require_permission("mentor", "update")),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(MentorProfile).where(MentorProfile.id == mentor_id)
    res = await db.execute(stmt)
    mentor = res.scalars().first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found")

    if payload.mentor_expertise is not None:
        mentor.expertise = ", ".join(payload.mentor_expertise)
    if payload.years_of_experience is not None:
        mentor.years_of_experience = payload.years_of_experience
    if payload.max_student_capacity is not None:
        mentor.max_capacity = payload.max_student_capacity
    if payload.is_available is not None:
        mentor.is_available = payload.is_available

    await db.commit()
    await db.refresh(mentor)

    stmt_emp = select(EmployeeProfile).where(EmployeeProfile.id == mentor.employee_profile_id)
    res_emp = await db.execute(stmt_emp)
    emp = res_emp.scalars().first()

    stmt_usr = select(User).where(User.id == mentor.user_id)
    res_usr = await db.execute(stmt_usr)
    usr = res_usr.scalars().first()

    stmt_count = select(func.count(MentorAssignment.id)).where(
        MentorAssignment.mentor_profile_id == mentor.id,
        MentorAssignment.status == "ACTIVE"
    )
    res_count = await db.execute(stmt_count)
    count = res_count.scalar() or 0

    return success_response(
        data=map_single_response(mentor, emp, usr, count),
        message="Mentor profile updated successfully"
    )


@router.put("/{mentor_id}", response_model=APIResponse[MentorProfileResponse])
async def update_mentor(
    mentor_id: UUID,
    payload: MentorProfileUpdate,
    current_user: User = Depends(require_permission("mentor", "update")),
    db: AsyncSession = Depends(get_db),
):
    return await patch_mentor(mentor_id=mentor_id, payload=payload, db=db)


@router.delete("/{mentor_id}", response_model=APIResponse[dict])
async def delete_mentor(
    mentor_id: UUID,
    current_user: User = Depends(require_permission("mentor", "delete")),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(MentorProfile).where(MentorProfile.id == mentor_id)
    res = await db.execute(stmt)
    mentor = res.scalars().first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found")

    # Soft delete
    mentor.deleted_at = func.now()
    await db.commit()

    return success_response(
        data={},
        message="Mentor profile deleted successfully"
    )