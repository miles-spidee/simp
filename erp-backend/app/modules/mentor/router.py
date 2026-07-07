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

    from app.models.core.allocation import Allocation
    from sqlalchemy import or_

    # Fetch active student counts for each mentor
    counts = {}
    for m, _, _ in rows:
        stmt_count = select(func.count(func.distinct(StudentProfile.id))).select_from(StudentProfile).where(
            or_(
                StudentProfile.id.in_(
                    select(MentorAssignment.student_profile_id).where(
                        MentorAssignment.mentor_profile_id == m.id,
                        MentorAssignment.status == "ACTIVE"
                    )
                ),
                StudentProfile.batch_id.in_(
                    select(Allocation.target_id).where(
                        Allocation.source_type == "MENTOR",
                        Allocation.target_type == "BATCH",
                        Allocation.source_id == m.id,
                        Allocation.deleted_at.is_(None)
                    )
                )
            )
        )
        res_count = await db.execute(stmt_count)
        counts[m.id] = res_count.scalar() or 0

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
    from app.models.core.allocation import Allocation
    
    stmt = (
        select(Allocation, MentorProfile, EmployeeProfile, User, Batch, Program)
        .join(MentorProfile, MentorProfile.id == Allocation.source_id)
        .outerjoin(EmployeeProfile, EmployeeProfile.id == MentorProfile.employee_profile_id)
        .outerjoin(User, User.id == MentorProfile.user_id)
        .join(Batch, Batch.id == Allocation.target_id)
        .join(Program, Program.id == Batch.program_id)
        .where(
            Allocation.source_type == "MENTOR",
            Allocation.target_type == "BATCH",
            Allocation.deleted_at.is_(None)
        )
    )
    res = await db.execute(stmt)
    rows = res.all()
    
    batch_ids = [batch.id for _, _, _, _, batch, _ in rows]
    counts_map = {}
    if batch_ids:
        stmt_counts = select(StudentProfile.batch_id, func.count(StudentProfile.id)).where(StudentProfile.batch_id.in_(batch_ids)).group_by(StudentProfile.batch_id)
        res_counts = await db.execute(stmt_counts)
        counts_map = {b_id: count for b_id, count in res_counts.all()}
        
    data = []
    for alloc, m, emp, usr, batch, prog in rows:
        mentor_name = f"{emp.first_name} {emp.last_name}" if emp else (usr.username.title() if usr else "Unknown Mentor")
        emp_code = emp.employee_code if emp else str(m.employee_profile_id or m.user_id)
        
        data.append({
            "id": str(alloc.id),
            "mentorProfileId": str(m.id),
            "mentorName": mentor_name,
            "employeeId": emp_code,
            "batchId": str(batch.id),
            "batchName": batch.name,
            "batchCode": batch.code or batch.name[:5].upper(),
            "programName": prog.name,
            "studentCount": counts_map.get(batch.id, 0),
            "batchCapacity": batch.max_capacity or 150,
            "mappedDate": alloc.start_date.isoformat() if alloc.start_date else "",
            "status": alloc.status.title(),
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
    from app.models.core.allocation import Allocation
    
    # 1. Create or update Allocation
    stmt_alloc = select(Allocation).where(
        Allocation.source_type == "MENTOR",
        Allocation.target_type == "BATCH",
        Allocation.target_id == payload.batchId,
        Allocation.deleted_at.is_(None)
    )
    res_alloc = await db.execute(stmt_alloc)
    existing_alloc = res_alloc.scalars().first()
    
    if existing_alloc:
        existing_alloc.source_id = payload.mentorProfileId
        db.add(existing_alloc)
    else:
        alloc = Allocation(
            source_type="MENTOR",
            source_id=payload.mentorProfileId,
            target_type="BATCH",
            target_id=payload.batchId,
            role="LEAD_MENTOR",
            status="ACTIVE",
            allocated_by=current_user.id
        )
        db.add(alloc)
    
    # 2. Fetch all students currently in the batch
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
    
    from app.models.core.allocation import Allocation
    from sqlalchemy import or_

    # Fetch count
    stmt_count = select(func.count(func.distinct(StudentProfile.id))).select_from(StudentProfile).where(
        or_(
            StudentProfile.id.in_(
                select(MentorAssignment.student_profile_id).where(
                    MentorAssignment.mentor_profile_id == m.id,
                    MentorAssignment.status == "ACTIVE"
                )
            ),
            StudentProfile.batch_id.in_(
                select(Allocation.target_id).where(
                    Allocation.source_type == "MENTOR",
                    Allocation.target_type == "BATCH",
                    Allocation.source_id == m.id,
                    Allocation.deleted_at.is_(None)
                )
            )
        )
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