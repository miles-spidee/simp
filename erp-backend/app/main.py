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
from app.modules.feedback.router import router as feedback_router
from app.modules.activity.router import router as activity_router
from app.modules.alumni.router import router as alumni_router
from app.modules.analytics.router import router as analytics_router
from app.modules.announcement.router import router as announcement_router
from app.modules.certificate.router import router as certificate_router
from app.modules.communication.router import router as communication_router
from app.modules.degree.router import router as degree_router
from app.modules.document.router import router as document_router
from app.modules.email.router import router as email_router
from app.modules.escalation.router import router as escalation_router
from app.modules.executive.router import router as executive_router
from app.modules.export.router import router as export_router
from app.modules.fee.router import router as fee_router
from app.modules.finance_analytics.router import router as finance_analytics_router
from app.modules.finance.router import router as finance_router
from app.modules.helpdesk.router import router as helpdesk_router
from app.modules.idcard.router import router as idcard_router
from app.modules.kpi.router import router as kpi_router
from app.modules.leave.router import router as leave_router
from app.modules.marketplace.router import router as marketplace_router
from app.modules.notification.router import router as notification_router
from app.modules.payment.router import router as payment_router
from app.modules.placement.router import router as placement_router
from app.modules.productivity.router import router as productivity_router
from app.modules.report.router import router as report_router
from app.modules.reporting_manager.router import router as reporting_manager_router
from app.modules.selfservice.router import router as selfservice_router
from app.modules.verification.router import router as verification_router
from app.modules.wallet.router import router as wallet_router

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
app.include_router(feedback_router, prefix='/api/v1/feedback', tags=['Feedback'])
app.include_router(activity_router, prefix='/api/v1/activity', tags=['Activity'])
app.include_router(alumni_router, prefix='/api/v1/alumni', tags=['Alumni'])
app.include_router(analytics_router, prefix='/api/v1/analytics', tags=['Analytics'])
app.include_router(announcement_router, prefix='/api/v1/announcement', tags=['Announcement'])
app.include_router(certificate_router, prefix='/api/v1/certificate', tags=['Certificate'])
app.include_router(communication_router, prefix='/api/v1/communication', tags=['Communication'])
app.include_router(degree_router, prefix='/api/v1/degree', tags=['Degree'])
app.include_router(document_router, prefix='/api/v1/document', tags=['Document'])
app.include_router(email_router, prefix='/api/v1/email', tags=['Email'])
app.include_router(escalation_router, prefix='/api/v1/escalation', tags=['Escalation'])
app.include_router(executive_router, prefix='/api/v1/executive', tags=['Executive'])
app.include_router(export_router, prefix='/api/v1/export', tags=['Export'])
app.include_router(fee_router, prefix='/api/v1/fee', tags=['Fee'])
app.include_router(finance_analytics_router, prefix='/api/v1/finance-analytics', tags=['Finance_analytics'])
app.include_router(finance_router, prefix='/api/v1/finance', tags=['Finance'])
app.include_router(helpdesk_router, prefix='/api/v1/helpdesk', tags=['Helpdesk'])
app.include_router(idcard_router, prefix='/api/v1/idcard', tags=['Idcard'])
app.include_router(kpi_router, prefix='/api/v1/kpi', tags=['Kpi'])
app.include_router(leave_router, prefix='/api/v1/leave', tags=['Leave'])
app.include_router(marketplace_router, prefix='/api/v1/marketplace', tags=['Marketplace'])
app.include_router(notification_router, prefix='/api/v1/notification', tags=['Notification'])
app.include_router(payment_router, prefix='/api/v1/payment', tags=['Payment'])
app.include_router(placement_router, prefix='/api/v1/placement', tags=['Placement'])
app.include_router(productivity_router, prefix='/api/v1/productivity', tags=['Productivity'])
app.include_router(report_router, prefix='/api/v1/report', tags=['Report'])
app.include_router(reporting_manager_router, prefix='/api/v1/reportingManager', tags=['Reporting_manager'])
app.include_router(selfservice_router, prefix='/api/v1/selfservice', tags=['Selfservice'])
app.include_router(verification_router, prefix='/api/v1/verification', tags=['Verification'])
app.include_router(wallet_router, prefix='/api/v1/wallet', tags=['Wallet'])

@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "ok", "app": settings.APP_NAME, "version": settings.APP_VERSION}
