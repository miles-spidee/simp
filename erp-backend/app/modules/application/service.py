from datetime import UTC, datetime, timedelta

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.application.repository import ApplicationRepository
from app.modules.application.schemas import ApplicationCreate
from app.models.profiles.student_profile import StudentProfile
from app.models.system.verification import VerificationRecord
from app.services.base import BaseService


class ApplicationService(BaseService):
    def __init__(self, db: AsyncSession):
        super().__init__(db)
        self.repository = ApplicationRepository(db)

    async def create(self, obj_in: ApplicationCreate, user_id=None):
        student_profile = await self._get_student_profile(obj_in.student_profile_id)
        if user_id and student_profile.user_id != user_id:
            raise HTTPException(status_code=403, detail="You can only submit applications for your own student profile")

        await self._enforce_aadhaar_lockout(student_profile.id)
        application = await self.repository.create(self.db, obj_in=obj_in)
        await self.commit_transaction()
        return application

    async def _get_student_profile(self, student_profile_id):
        student_profile = await self.db.get(StudentProfile, student_profile_id)
        if not student_profile:
            raise HTTPException(status_code=404, detail="Student profile not found")
        return student_profile

    async def _enforce_aadhaar_lockout(self, student_profile_id):
        stmt = (
            select(VerificationRecord)
            .where(VerificationRecord.entity_id == str(student_profile_id))
            .where(VerificationRecord.entity_type == "StudentProfile")
            .where(VerificationRecord.aadhaar_verified.is_(True))
            .order_by(VerificationRecord.verification_date.desc())
        )
        result = await self.db.execute(stmt)
        verification = result.scalars().first()
        if not verification or not verification.verification_date:
            return

        lockout_ends = verification.verification_date + timedelta(days=180)
        if datetime.now(UTC) < lockout_ends:
            raise HTTPException(
                status_code=403,
                detail="Aadhaar verification lockout is active. The student cannot apply for another internship for 6 months.",
            )
