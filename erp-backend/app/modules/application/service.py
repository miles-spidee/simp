from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.authentication.user import User
from app.models.internships.application import Application
from app.models.profiles.student_profile import StudentProfile
from app.models.system.verification import VerificationRecord

from app.modules.application.repository import ApplicationRepository
from app.modules.application.schemas import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationProfileResponse,
    ApplicationReviewRequest,
)

from app.services.base import BaseService


class ApplicationService(BaseService):

    def __init__(self, db: AsyncSession):
        super().__init__(db)
        self.repository = ApplicationRepository(db)

    # -------------------------------------------------------
    # Mapper
    # -------------------------------------------------------

    def _map_response(
        self,
        application: Application,
        student: StudentProfile,
        user: User,
    ) -> ApplicationResponse:

        return ApplicationResponse(
            application_id=application.id,
            opening_id=application.opportunity_id,
            applicant_user_id=user.id,
            application_status=application.status,
            applied_at=application.created_at,
            reviewed_at=application.updated_at,
            reviewed_by="",
            remarks=application.feedback,
            profile=ApplicationProfileResponse(
                first_name=user.username,
                last_name="",
                email=user.email,
                mobile_number=user.phone or "",
            ),
        )

    # -------------------------------------------------------
    # Get All
    # -------------------------------------------------------

    async def get_all(self):

        stmt = (
            select(Application)
            .options(
                joinedload(Application.student_profile).joinedload(StudentProfile.user)
            )
            .order_by(Application.created_at.desc())
        )

        result = await self.db.execute(stmt)

        applications = result.scalars().all()

        return [
            self._map_response(
                app,
                app.student_profile,
                app.student_profile.user,
            )
            for app in applications
        ]

    # -------------------------------------------------------
    # Get My Applications
    # -------------------------------------------------------

    async def get_my_applications(self, user_id: UUID):

        stmt = (
            select(Application)
            .join(StudentProfile)
            .where(StudentProfile.user_id == user_id)
            .options(
                joinedload(Application.student_profile).joinedload(StudentProfile.user)
            )
            .order_by(Application.created_at.desc())
        )

        result = await self.db.execute(stmt)

        applications = result.scalars().all()

        return [
            self._map_response(
                app,
                app.student_profile,
                app.student_profile.user,
            )
            for app in applications
        ]

    # -------------------------------------------------------
    # Get One
    # -------------------------------------------------------

    async def get(self, application_id: UUID):

        stmt = (
            select(Application)
            .where(Application.id == application_id)
            .options(
                joinedload(Application.student_profile).joinedload(StudentProfile.user)
            )
        )

        result = await self.db.execute(stmt)

        application = result.scalars().first()

        if not application:
            raise HTTPException(
                status_code=404,
                detail="Application not found",
            )

        return self._map_response(
            application,
            application.student_profile,
            application.student_profile.user,
        )

    # -------------------------------------------------------
    # Create
    # -------------------------------------------------------

    async def create(
        self,
        obj_in: ApplicationCreate,
        user_id=None,
    ):

        # Find user by email
        stmt = (
            select(User)
            .where(User.email == obj_in.email)
        )

        result = await self.db.execute(stmt)

        user = result.scalars().first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )

        # Find student profile
        stmt = (
            select(StudentProfile)
            .where(StudentProfile.user_id == user.id)
            .options(joinedload(StudentProfile.user))
        )

        result = await self.db.execute(stmt)

        student = result.scalars().first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student profile not found",
            )

        # Ensure logged-in user matches
        # if user_id and user.id != user_id:
        #     raise HTTPException(
        #         status_code=403,
        #         detail="You can only submit your own application",
        #     )

        # Aadhaar lock check
        await self._enforce_aadhaar_lockout(student.id)

        # Prevent duplicate application
        stmt = (
            select(Application)
            .where(Application.opportunity_id == obj_in.opening_id)
            .where(Application.student_profile_id == student.id)
        )

        result = await self.db.execute(stmt)

        existing = result.scalars().first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Application already submitted.",
            )

        application = await self.repository.create(
            self.db,
            obj_in={
                "opportunity_id": obj_in.opening_id,
                "student_profile_id": student.id,
            },
        )

        await self.commit_transaction()

        await self.db.refresh(application)

        return self._map_response(
            application,
            student,
            user,
        )

    # -------------------------------------------------------
    # Review
    # -------------------------------------------------------

    async def review(
        self,
        application_id: UUID,
        data: ApplicationReviewRequest,
    ):

        application = await self.db.get(
            Application,
            application_id,
        )

        if not application:
            raise HTTPException(
                status_code=404,
                detail="Application not found",
            )

        application.status = data.application_status
        application.feedback = data.remarks

        await self.commit_transaction()

        await self.db.refresh(application)

        # Send notification if selected!
        if application.status.upper() in ["SELECTED", "APPROVED", "HIRED"]:
            try:
                from sqlalchemy import select
                from app.models.authentication.user import User as DBUser
                from app.models.profiles.student_profile import StudentProfile
                from app.models.internships.opportunity import Opportunity
                from app.services.notification_service import notification_service
                
                # Fetch user details
                user_stmt = select(DBUser).join(StudentProfile, StudentProfile.user_id == DBUser.id).where(StudentProfile.id == application.student_profile_id)
                user_res = await self.db.execute(user_stmt)
                user_obj = user_res.scalars().first()
                
                # Fetch opportunity details
                opp_stmt = select(Opportunity).where(Opportunity.id == application.opportunity_id)
                opp_res = await self.db.execute(opp_stmt)
                opp_obj = opp_res.scalars().first()
                opp_title = opp_obj.title if opp_obj else "Opportunity"
                
                if user_obj:
                    await notification_service.send_application_selected(
                        username=user_obj.username.title(),
                        email=user_obj.email,
                        phone=user_obj.phone or "+919876543210",
                        opportunity_title=opp_title
                    )
            except Exception as e:
                print("Error sending application selected notification:", e)

        return await self.get(application.id)

    # -------------------------------------------------------
    # Withdraw
    # -------------------------------------------------------

    async def withdraw(self, application_id: UUID):

        application = await self.db.get(
            Application,
            application_id,
        )

        if not application:
            raise HTTPException(
                status_code=404,
                detail="Application not found",
            )

        application.status = "WITHDRAWN"

        await self.commit_transaction()

        await self.db.refresh(application)

        return await self.get(application.id)

    # -------------------------------------------------------
    # Aadhaar Lock Validation
    # -------------------------------------------------------

    async def _enforce_aadhaar_lockout(
        self,
        student_profile_id: UUID,
    ):

        stmt = (
            select(VerificationRecord)
            .where(
                VerificationRecord.entity_id == str(student_profile_id)
            )
            .where(
                VerificationRecord.entity_type == "StudentProfile"
            )
            .where(
                VerificationRecord.aadhaar_verified.is_(True)
            )
            .order_by(
                VerificationRecord.verification_date.desc()
            )
        )

        result = await self.db.execute(stmt)

        verification = result.scalars().first()

        if not verification or not verification.verification_date:
            return

        lockout_end = verification.verification_date + timedelta(days=180)

        if datetime.now(timezone.utc) < lockout_end:
            raise HTTPException(
                status_code=403,
                detail="Aadhaar verification lockout is active. Student cannot apply for another internship for 6 months.",
            )
        
