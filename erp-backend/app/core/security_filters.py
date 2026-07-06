from typing import Optional, List
from uuid import UUID
from sqlalchemy import select, and_, exists
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.authentication.user import User
from app.models.core.allocation import Allocation
from app.models.rbac.user_role import UserRole
from app.models.rbac.role import Role

async def get_user_roles(db: AsyncSession, user_id: UUID) -> List[str]:
    """Fetch role codes for a user."""
    stmt = select(Role.code).join(UserRole, UserRole.role_id == Role.id).where(UserRole.user_id == user_id)
    result = await db.execute(stmt)
    return result.scalars().all()

async def get_allocated_target_ids(db: AsyncSession, user_id: UUID, target_type: str) -> List[UUID]:
    """Fetch all target IDs (e.g. program_ids) allocated to a user."""
    stmt = select(Allocation.target_id).where(
        and_(
            Allocation.source_type == 'USER',
            Allocation.source_id == user_id,
            Allocation.target_type == target_type,
            Allocation.status == 'ACTIVE'
        )
    )
    result = await db.execute(stmt)
    return result.scalars().all()

async def get_students_for_organization(db: AsyncSession, organization_id: UUID) -> List[UUID]:
    """Fetch all student user_ids belonging to an organization."""
    from app.models.profiles.student_profile import StudentProfile
    stmt = select(StudentProfile.user_id).where(StudentProfile.organization_id == organization_id)
    result = await db.execute(stmt)
    return result.scalars().all()

async def apply_program_filter(query, db: AsyncSession, user: User, program_model):
    """
    Apply RLS on Programs.
    - Super Admins / HR see all.
    - Mentors see only their allocated programs.
    - Finance / Report Managers see programs related to their allocated batches.
    - College Coordinators see programs that have their students.
    """
    roles = await get_user_roles(db, user.id)
    
    if "SUPER_ADMIN" in roles or "HR" in roles or "HR_MANAGER" in roles:
        return query
        
    if "MENTOR" in roles:
        from app.models.profiles.mentor_profile import MentorProfile
        from app.models.internships.mentor_assignment import MentorAssignment
        from app.models.profiles.student_profile import StudentProfile
        from app.models.academic.batch import Batch
        
        stmt = select(Batch.program_id).join(
            StudentProfile, StudentProfile.batch_id == Batch.id
        ).join(
            MentorAssignment, MentorAssignment.student_profile_id == StudentProfile.id
        ).join(
            MentorProfile, MentorProfile.id == MentorAssignment.mentor_profile_id
        ).where(
            MentorProfile.user_id == user.id
        ).distinct()
        
        result = await db.execute(stmt)
        program_ids = result.scalars().all()
        
        if program_ids:
            return query.where(program_model.id.in_(program_ids))
        return query.where(program_model.id.in_([]))

    if "STUDENT" in roles:
        from app.models.profiles.student_profile import StudentProfile
        from app.models.academic.batch import Batch
        stmt = select(Batch.program_id).join(
            StudentProfile, StudentProfile.batch_id == Batch.id
        ).where(
            StudentProfile.user_id == user.id
        )
        result = await db.execute(stmt)
        prog_id = result.scalars().first()
        if prog_id:
            return query.where(program_model.id == prog_id)
        return query.where(program_model.id.in_([]))

    if "COLLEGE_COORDINATOR" in roles:
        from app.models.profiles.employee_profile import EmployeeProfile
        from app.models.profiles.student_profile import StudentProfile
        from app.models.academic.batch import Batch
        emp_result = await db.execute(select(EmployeeProfile.organization_id).where(EmployeeProfile.user_id == user.id))
        org_id = emp_result.scalar_one_or_none()
        if org_id:
            stmt = select(Batch.program_id).join(StudentProfile, StudentProfile.batch_id == Batch.id).where(
                StudentProfile.organization_id == org_id
            )
            result = await db.execute(stmt)
            program_ids = result.scalars().all()
            if program_ids:
                return query.where(program_model.id.in_(program_ids))
        return query.where(program_model.id.in_([]))

    if "FINANCE_MANAGER" in roles or "REPORT_MANAGER" in roles:
        allocated_batches = await get_allocated_target_ids(db, user.id, "BATCH")
        if allocated_batches:
            from app.models.academic.batch import Batch
            # find program_ids for these batches
            stmt = select(Batch.program_id).where(Batch.id.in_(allocated_batches))
            result = await db.execute(stmt)
            program_ids = result.scalars().all()
            if program_ids:
                return query.where(program_model.id.in_(program_ids))
        return query.where(program_model.id.in_([]))

    # Default deny
    return query.where(program_model.id.in_([]))

async def apply_batch_filter(query, db: AsyncSession, user: User, batch_model):
    """
    Apply RLS on Batches.
    """
    roles = await get_user_roles(db, user.id)
    if "SUPER_ADMIN" in roles or "HR" in roles or "HR_MANAGER" in roles:
        return query

    if "FINANCE_MANAGER" in roles or "REPORT_MANAGER" in roles:
        allocated_batches = await get_allocated_target_ids(db, user.id, "BATCH")
        if allocated_batches:
            return query.where(batch_model.id.in_(allocated_batches))
        return query.where(batch_model.id.in_([]))

    if "MENTOR" in roles:
        allocated_programs = await get_allocated_target_ids(db, user.id, "PROGRAM")
        if allocated_programs:
            return query.where(batch_model.program_id.in_(allocated_programs))
        return query.where(batch_model.id.in_([]))
        
    if "COLLEGE_COORDINATOR" in roles:
        from app.models.profiles.employee_profile import EmployeeProfile
        from app.models.profiles.student_profile import StudentProfile
        emp_result = await db.execute(select(EmployeeProfile.organization_id).where(EmployeeProfile.user_id == user.id))
        org_id = emp_result.scalar_one_or_none()
        if org_id:
            # batches where at least one student from org_id is present
            stmt = select(StudentProfile.batch_id).where(
                and_(StudentProfile.organization_id == org_id, StudentProfile.batch_id != None)
            )
            result = await db.execute(stmt)
            batch_ids = result.scalars().all()
            if batch_ids:
                return query.where(batch_model.id.in_(batch_ids))
        return query.where(batch_model.id.in_([]))

    return query.where(batch_model.id.in_([]))

async def apply_student_filter(query, db: AsyncSession, user: User, student_profile_model):
    """
    Apply RLS on Students.
    """
    roles = await get_user_roles(db, user.id)
    
    if "SUPER_ADMIN" in roles or "HR" in roles or "HR_MANAGER" in roles:
        return query
        
    if "COLLEGE_COORDINATOR" in roles:
        from app.models.profiles.employee_profile import EmployeeProfile
        emp_result = await db.execute(select(EmployeeProfile.organization_id).where(EmployeeProfile.user_id == user.id))
        org_id = emp_result.scalar_one_or_none()
        
        if org_id:
            return query.where(student_profile_model.organization_id == org_id)
        return query.where(student_profile_model.id == None)
            
    if "MENTOR" in roles:
        allocated_programs = await get_allocated_target_ids(db, user.id, "PROGRAM")
        if allocated_programs:
            # find student user_ids based on student->program allocation
            stmt = select(Allocation.source_id).where(
                and_(
                    Allocation.source_type == 'STUDENT',
                    Allocation.target_type == 'PROGRAM',
                    Allocation.target_id.in_(allocated_programs),
                    Allocation.status == 'ACTIVE'
                )
            )
            result = await db.execute(stmt)
            student_user_ids = result.scalars().all()
            if student_user_ids:
                return query.where(student_profile_model.user_id.in_(student_user_ids))
        return query.where(student_profile_model.id == None)

    if "FINANCE_MANAGER" in roles or "REPORT_MANAGER" in roles:
        allocated_batches = await get_allocated_target_ids(db, user.id, "BATCH")
        if allocated_batches:
            return query.where(student_profile_model.batch_id.in_(allocated_batches))
        return query.where(student_profile_model.id == None)

    if "STUDENT" in roles:
        return query.where(student_profile_model.user_id == user.id)

    return query.where(student_profile_model.id == None)

async def apply_program_scoped_filter(query, db: AsyncSession, user: User, model, program_id_field="program_id"):
    """
    Apply RLS on entities linked to a Program (e.g. Task, Assessment, Attendance).
    """
    roles = await get_user_roles(db, user.id)
    if "SUPER_ADMIN" in roles or "HR" in roles or "HR_MANAGER" in roles:
        return query

    model_prog_id = getattr(model, program_id_field, None)
    if not model_prog_id:
        return query

    if "MENTOR" in roles:
        from app.models.profiles.mentor_profile import MentorProfile
        from app.models.internships.mentor_assignment import MentorAssignment
        from app.models.profiles.student_profile import StudentProfile
        from app.models.academic.batch import Batch
        
        stmt = select(Batch.program_id).join(
            StudentProfile, StudentProfile.batch_id == Batch.id
        ).join(
            MentorAssignment, MentorAssignment.student_profile_id == StudentProfile.id
        ).join(
            MentorProfile, MentorProfile.id == MentorAssignment.mentor_profile_id
        ).where(
            MentorProfile.user_id == user.id
        ).distinct()
        
        result = await db.execute(stmt)
        program_ids = result.scalars().all()
        
        if program_ids:
            return query.where(model_prog_id.in_(program_ids))
        return query.where(model.id.in_([]))

    if "STUDENT" in roles:
        from app.models.profiles.student_profile import StudentProfile
        from app.models.academic.batch import Batch
        stmt = select(Batch.program_id).join(
            StudentProfile, StudentProfile.batch_id == Batch.id
        ).where(
            StudentProfile.user_id == user.id
        )
        result = await db.execute(stmt)
        prog_id = result.scalars().first()
        if prog_id:
            return query.where(model_prog_id == prog_id)
        return query.where(model.id.in_([]))

    if "COLLEGE_COORDINATOR" in roles:
        from app.models.profiles.employee_profile import EmployeeProfile
        from app.models.profiles.student_profile import StudentProfile
        from app.models.academic.batch import Batch
        emp_result = await db.execute(select(EmployeeProfile.organization_id).where(EmployeeProfile.user_id == user.id))
        org_id = emp_result.scalar_one_or_none()
        if org_id:
            # programs associated with batches where student is present
            stmt = select(Batch.program_id).join(StudentProfile, StudentProfile.batch_id == Batch.id).where(
                StudentProfile.organization_id == org_id
            )
            result = await db.execute(stmt)
            program_ids = result.scalars().all()
            if program_ids:
                return query.where(model_prog_id.in_(program_ids))
        return query.where(model.id.in_([]))

    # default deny
    return query.where(model.id.in_([]))
