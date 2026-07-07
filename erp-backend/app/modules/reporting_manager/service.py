from uuid import UUID
from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.core.allocation import Allocation
from app.models.academic.batch import Batch
from app.models.academic.program import Program
from app.models.profiles.student_profile import StudentProfile
from app.models.profiles.mentor_profile import MentorProfile
from app.models.internships.mentor_assignment import MentorAssignment
from app.models.authentication.user import User
from app.models.profiles.employee_profile import EmployeeProfile

from fastapi import HTTPException

class ReportingManagerService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _get_employee_profile_id(self, user_id: UUID) -> Optional[UUID]:
        """Get the employee_profile_id for the current user (used as source_id in allocations)."""
        stmt = select(EmployeeProfile.id).where(
            EmployeeProfile.user_id == user_id,
            EmployeeProfile.deleted_at == None,
        )
        result = await self.db.scalar(stmt)
        return result

    async def _verify_batch_access(self, user_id: UUID, batch_id: UUID):
        """Verify that the user is allocated to the given batch."""
        source_ids = [user_id]
        emp_id = await self._get_employee_profile_id(user_id)
        if emp_id:
            source_ids.append(emp_id)

        stmt = select(Allocation).where(
            Allocation.source_type.in_(["REPORTING_MANAGER", "EMPLOYEE", "USER"]),
            Allocation.source_id.in_(source_ids),
            Allocation.target_type == "BATCH",
            Allocation.target_id == batch_id,
            Allocation.status == "ACTIVE",
            Allocation.deleted_at == None,
        )
        result = await self.db.scalar(stmt)
        if not result:
            raise HTTPException(status_code=403, detail="You do not have access to this batch.")

    async def get_allocated_batches(self, user_id: UUID) -> List[dict]:
        """
        Find batches allocated to the logged-in RM.
        Searches allocations by user_id directly (source_id = user_id, source_type = REPORTING_MANAGER)
        and also by employee_profile_id as a fallback.
        """
        source_ids = [user_id]
        emp_id = await self._get_employee_profile_id(user_id)
        if emp_id:
            source_ids.append(emp_id)

        stmt = (
            select(Allocation)
            .where(
                Allocation.source_type.in_(["REPORTING_MANAGER", "EMPLOYEE", "USER"]),
                Allocation.source_id.in_(source_ids),
                Allocation.target_type == "BATCH",
                Allocation.status == "ACTIVE",
                Allocation.deleted_at == None,
            )
        )
        result = await self.db.execute(stmt)
        allocations = result.scalars().all()

        if not allocations:
            return []

        batch_ids = [a.target_id for a in allocations]

        batch_stmt = (
            select(Batch, Program.name.label("program_name"))
            .join(Program, Batch.program_id == Program.id)
            .where(
                Batch.id.in_(batch_ids),
                Batch.deleted_at == None,
            )
        )
        batch_result = await self.db.execute(batch_stmt)
        rows = batch_result.all()

        batches = []
        for batch, program_name in rows:
            # Count students in this batch
            student_count_stmt = select(func.count()).select_from(StudentProfile).where(
                StudentProfile.batch_id == batch.id,
                StudentProfile.deleted_at == None,
            )
            student_count = await self.db.scalar(student_count_stmt)

            batches.append({
                "batch_id": batch.id,
                "batch_name": batch.name,
                "batch_code": batch.code,
                "program_id": batch.program_id,
                "program_name": program_name,
                "start_date": batch.start_date.isoformat() if batch.start_date else "",
                "end_date": batch.end_date.isoformat() if batch.end_date else "",
                "max_capacity": batch.max_capacity,
                "student_count": student_count or 0,
            })

        return batches

    async def get_students_in_batch(self, user_id: UUID, batch_id: UUID) -> List[dict]:
        """Return all students in the given batch with their user info.
        Enforces Row Level Security by checking if the batch is allocated to the user.
        """
        await self._verify_batch_access(user_id, batch_id)

        stmt = (
            select(StudentProfile, User)
            .join(User, StudentProfile.user_id == User.id, isouter=True)
            .where(
                StudentProfile.batch_id == batch_id,
                StudentProfile.deleted_at == None,
            )
        )
        result = await self.db.execute(stmt)
        rows = result.all()

        students = []
        for student, user in rows:
            name = ""
            email = ""
            phone = None
            if user:
                name = user.username or user.email.split("@")[0]
                email = user.email
                phone = user.phone

            students.append({
                "student_profile_id": student.id,
                "user_id": student.user_id,
                "enrollment_number": student.enrollment_number,
                "name": name,
                "email": email,
                "phone": phone,
                "github_url": student.github_url,
                "linkedin_url": student.linkedin_url,
            })

        return students

    async def get_mentors_in_batch(self, user_id: UUID, batch_id: UUID) -> List[dict]:
        """
        Return mentors who are assigned to at least one student in the given batch.
        Uses MentorAssignment -> StudentProfile (filtered by batch_id).
        Enforces Row Level Security by checking if the batch is allocated to the user.
        """
        await self._verify_batch_access(user_id, batch_id)

        # Subquery: student_profile_ids in this batch
        student_ids_stmt = (
            select(StudentProfile.id)
            .where(
                StudentProfile.batch_id == batch_id,
                StudentProfile.deleted_at == None,
            )
        )
        student_ids_result = await self.db.execute(student_ids_stmt)
        student_ids = [row[0] for row in student_ids_result.all()]

        if not student_ids:
            return []

        # Count assigned students per mentor
        count_stmt = (
            select(
                MentorAssignment.mentor_profile_id,
                func.count(MentorAssignment.student_profile_id).label("assigned_count"),
            )
            .where(
                MentorAssignment.student_profile_id.in_(student_ids),
                MentorAssignment.deleted_at == None,
            )
            .group_by(MentorAssignment.mentor_profile_id)
        )
        count_result = await self.db.execute(count_stmt)
        mentor_counts = {row.mentor_profile_id: row.assigned_count for row in count_result.all()}

        if not mentor_counts:
            return []

        mentor_ids = list(mentor_counts.keys())

        # Fetch mentor profiles + user info
        mentor_stmt = (
            select(MentorProfile, User)
            .join(User, MentorProfile.user_id == User.id, isouter=True)
            .where(
                MentorProfile.id.in_(mentor_ids),
                MentorProfile.deleted_at == None,
            )
        )
        mentor_result = await self.db.execute(mentor_stmt)
        mentor_rows = mentor_result.all()

        mentors = []
        for mentor, user in mentor_rows:
            name = ""
            email = ""
            if user:
                name = user.username or user.email.split("@")[0]
                email = user.email

            mentors.append({
                "mentor_profile_id": mentor.id,
                "user_id": mentor.user_id,
                "name": name,
                "email": email,
                "expertise": mentor.expertise,
                "years_of_experience": mentor.years_of_experience,
                "is_available": mentor.is_available,
                "assigned_student_count": mentor_counts.get(mentor.id, 0),
            })

        return mentors
