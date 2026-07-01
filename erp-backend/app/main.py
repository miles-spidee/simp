from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.exceptions import register_exception_handlers

setup_logging()
import app.models

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register exception handlers
register_exception_handlers(app)

# Register module routers
# Uncomment each line as you complete that module

from app.modules.identity.router import router as identity_router
app.include_router(identity_router, prefix="/api/v1/auth", tags=["Identity"])

from app.modules.users.router import router as users_router
app.include_router(users_router, prefix="/api/v1/users", tags=["Users"])

from app.modules.rbac.router import router as rbac_router
app.include_router(rbac_router, prefix="/api/v1/rbac", tags=["RBAC"])

from app.modules.employee.router import router as employee_router
from app.modules.organization.router import router as organization_router
from app.modules.program.router import router as program_router
from app.modules.opportunity.router import router as opportunity_router
from app.modules.application.router import router as application_router
from app.modules.student.router import router as student_router
from app.modules.batch.router import router as batch_router
from app.modules.allocation.router import router as allocation_router
from app.modules.mentor.router import router as mentor_router
from app.modules.lms.router import router as lms_router
from app.modules.task.router import router as task_router
from app.modules.assessment.router import router as assessment_router
from app.modules.submission.router import router as submission_router
from app.modules.attendance.router import router as attendance_router
from app.modules.performance.router import router as performance_router
from app.modules.coordinator.router import router as coordinator_router
from app.modules.super_admin.router import router as super_admin_router
from app.modules.files.router import router as files_router
from app.modules.dashboard.router import router as dashboard_router

app.include_router(employee_router, prefix='/api/v1/employee', tags=['Employee'])
app.include_router(organization_router, prefix='/api/v1/organization', tags=['Organization'])
app.include_router(program_router, prefix='/api/v1/program', tags=['Program'])
app.include_router(opportunity_router, prefix='/api/v1/opportunity', tags=['Opportunity'])
app.include_router(application_router, prefix='/api/v1/application', tags=['Application'])
app.include_router(student_router, prefix='/api/v1/student', tags=['Student'])
app.include_router(batch_router, prefix='/api/v1/batch', tags=['Batch'])
app.include_router(allocation_router, prefix='/api/v1/allocation', tags=['Allocation'])
app.include_router(mentor_router, prefix='/api/v1/mentor', tags=['Mentor'])
app.include_router(lms_router, prefix='/api/v1/lms', tags=['Lms'])
app.include_router(task_router, prefix='/api/v1/task', tags=['Task'])
app.include_router(assessment_router, prefix='/api/v1/assessment', tags=['Assessment'])
app.include_router(submission_router, prefix='/api/v1/submission', tags=['Submission'])
app.include_router(attendance_router, prefix='/api/v1/attendance', tags=['Attendance'])
app.include_router(performance_router, prefix='/api/v1/performance', tags=['Performance'])
app.include_router(coordinator_router, prefix='/api/v1/coordinator', tags=['Coordinator'])
app.include_router(super_admin_router, prefix='/api/v1/super_admin', tags=['Super_admin'])
app.include_router(files_router, prefix='/api/v1/files', tags=['Files'])
app.include_router(dashboard_router, prefix='/api/v1/dashboard', tags=['Dashboard'])

@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "ok", "app": settings.APP_NAME, "version": settings.APP_VERSION}
