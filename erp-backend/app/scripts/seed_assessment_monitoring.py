import asyncio
import uuid
from datetime import date
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
import os
from dotenv import load_dotenv

from app.models.authentication.user import User
from app.models.organizations.organization import Organization
from app.models.profiles.student_profile import StudentProfile
from app.models.profiles.mentor_profile import MentorProfile
from app.models.internships.mentor_assignment import MentorAssignment
from app.models.internships.quiz_assessment import QuizAssessment, QuizSubmission

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def seed_data():
    async with AsyncSessionLocal() as session:
        try:
            # 1. Clean up existing mock data
            print("Cleaning up old mock data...")
            await session.execute(text("DELETE FROM quiz_submissions"))
            await session.execute(text("DELETE FROM quiz_assessments"))
            await session.execute(text("DELETE FROM intern_mentor_assignments"))
            await session.execute(text("DELETE FROM profile_students"))
            await session.execute(text("DELETE FROM profile_mentors"))
            await session.execute(text("DELETE FROM auth_users WHERE email LIKE '%@mock.com'"))
            await session.execute(text("DELETE FROM org_organizations WHERE code = 'MOCK_UNI'"))
            
            # 2. Create basic Org
            org_id = uuid.uuid4()
            org = Organization(
                id=org_id,
                name="Mock University",
                code="MOCK_UNI",
                type="COLLEGE",
                email="admin@mockuni.edu"
            )
            session.add(org)

            from app.core.security import hash_password
            hashed_pwd = hash_password("password123")
            
            # 3. Create Users
            mentor_user_id = uuid.uuid4()
            mentor_user = User(
                id=mentor_user_id,
                username="mock_mentor",
                email="mentor@mock.com",
                password_hash=hashed_pwd,
                account_status="ACTIVE",
                email_verified=True
            )
            session.add(mentor_user)

            student_user_id_1 = uuid.uuid4()
            student_user_1 = User(
                id=student_user_id_1,
                username="alice_s",
                email="student1@mock.com",
                password_hash=hashed_pwd,
                account_status="ACTIVE",
                email_verified=True
            )
            session.add(student_user_1)

            student_user_id_2 = uuid.uuid4()
            student_user_2 = User(
                id=student_user_id_2,
                username="bob_j",
                email="student2@mock.com",
                password_hash=hashed_pwd,
                account_status="ACTIVE",
                email_verified=True
            )
            session.add(student_user_2)

            await session.flush()

            # 4. Create Profiles
            mentor_profile_id = uuid.uuid4()
            mentor_profile = MentorProfile(
                id=mentor_profile_id,
                user_id=mentor_user_id,
                expertise="Frontend React",
                years_of_experience=5,
                max_capacity=10,
                is_available=True
            )
            session.add(mentor_profile)

            student_profile_id_1 = uuid.uuid4()
            student_1 = StudentProfile(
                id=student_profile_id_1,
                user_id=student_user_id_1,
                organization_id=org_id,
                enrollment_number="ENR001",
                skills={}
            )
            session.add(student_1)

            student_profile_id_2 = uuid.uuid4()
            student_2 = StudentProfile(
                id=student_profile_id_2,
                user_id=student_user_id_2,
                organization_id=org_id,
                enrollment_number="ENR002",
                skills={}
            )
            session.add(student_2)

            await session.flush()

            # 5. Assign ONLY Alice to the Mentor
            assignment_1 = MentorAssignment(
                id=uuid.uuid4(),
                student_profile_id=student_profile_id_1,
                mentor_profile_id=mentor_profile_id,
                start_date=date(2024, 1, 1),
                status="ACTIVE"
            )
            session.add(assignment_1)

            # Bob is NOT assigned to a mentor, but IS in the college
            # (Coordinator sees Bob, Mentor does not)

            # 6. Create Assessments
            assessment_1 = QuizAssessment(
                id=uuid.uuid4(),
                batch_id="Batch 2024-A",
                frontend_id="asm_react_101",
                title="React Fundamentals",
                type="MCQ",
                duration=60,
                passing_marks=70,
                negative_marking=False,
                security_settings={},
                questions=[]
            )
            session.add(assessment_1)
            
            await session.flush()

            # 7. Create Submissions
            sub_1 = QuizSubmission(
                id=uuid.uuid4(),
                assessment_id=assessment_1.id,
                student_id=str(student_user_id_1), # Alice
                student_name="Alice Smith",
                attempts=1,
                score=85,
                status="Completed",
                passed=True,
                question_analysis={
                    "college": "Mock University",
                    "program": "Full Stack Engineering",
                    "completionTime": 45,
                    "sections": [
                        {"name": "Technical", "score": 30, "max": 40},
                        {"name": "Programming", "score": 35, "max": 40},
                        {"name": "Logical Reasoning", "score": 20, "max": 20}
                    ],
                    "questions": [
                        {"questionText": "What is virtual DOM?", "selectedAnswer": "In-memory", "correctAnswer": "In-memory", "marksAwarded": 5, "timeTaken": 30, "difficulty": "Medium", "topic": "React", "explanation": ""}
                    ]
                }
            )
            session.add(sub_1)

            sub_2 = QuizSubmission(
                id=uuid.uuid4(),
                assessment_id=assessment_1.id,
                student_id=str(student_user_id_2), # Bob
                student_name="Bob Johnson",
                attempts=1,
                score=35,
                status="Completed",
                passed=False,
                question_analysis={
                    "college": "Mock University",
                    "program": "Data Science",
                    "completionTime": 58,
                    "sections": [
                        {"name": "Technical", "score": 10, "max": 40},
                        {"name": "Programming", "score": 15, "max": 40},
                        {"name": "Logical Reasoning", "score": 10, "max": 20}
                    ],
                    "questions": [
                        {"questionText": "What is virtual DOM?", "selectedAnswer": "Physical", "correctAnswer": "In-memory", "marksAwarded": 0, "timeTaken": 60, "difficulty": "Medium", "topic": "React", "explanation": "It is in-memory."}
                    ]
                }
            )
            session.add(sub_2)

            await session.commit()
            print("Mock database seeding completed successfully!")

            print(f"--- MOCK IDs for Testing ---")
            print(f"Mentor User ID: {mentor_user_id}")
            print(f"Coordinator/Org ID: {org_id}")

        except Exception as e:
            await session.rollback()
            print(f"Error seeding data: {e}")

if __name__ == "__main__":
    asyncio.run(seed_data())
