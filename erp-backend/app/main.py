from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.exceptions import register_exception_handlers
from app.core.database import get_db
from app.core.middleware import RLSMiddleware

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

app.add_middleware(RLSMiddleware)

# Register exception handlers
register_exception_handlers(app)

# Register module routers

@app.get("/api/v1/check-joshua")
async def check_joshua(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import text
    # Find Joshua by email pattern
    res = await db.execute(text("SELECT id, email, username FROM auth_users WHERE email ILIKE '%joshua%' OR username ILIKE '%joshua%'"))
    users = res.fetchall()
    if not users:
        return {"error": "No user named Joshua found. Try /api/v1/check-joshua/all to list all users"}
    
    results = []
    for uid, email, username in users:
        info = {"email": email, "username": username, "user_id": str(uid)}
        
        # Get employee profile
        emp_res = await db.execute(text("SELECT id FROM profiles_employees WHERE user_id = :uid"), {"uid": uid})
        emp_row = emp_res.first()
        info["employee_profile_id"] = str(emp_row[0]) if emp_row else None
        
        # Get roles
        role_res = await db.execute(text("SELECT r.code, r.name FROM rbac_user_roles ur JOIN rbac_roles r ON r.id = ur.role_id WHERE ur.user_id = :uid"), {"uid": uid})
        info["roles"] = [{"code": r[0], "name": r[1]} for r in role_res.fetchall()]
        
        # Check ALL allocations for this user_id as source
        alloc_res = await db.execute(text("SELECT a.source_id, a.source_type, a.target_id, a.target_type, a.status FROM core_allocations a WHERE a.source_id = :uid"), {"uid": uid})
        allocs_by_uid = alloc_res.fetchall()
        
        # Check ALL allocations for employee_profile_id as source
        allocs_by_empid = []
        if emp_row:
            alloc_res_emp = await db.execute(text("SELECT a.source_id, a.source_type, a.target_id, a.target_type, a.status FROM core_allocations a WHERE a.source_id = :eid"), {"eid": emp_row[0]})
            allocs_by_empid = alloc_res_emp.fetchall()
        
        info["allocations_by_user_id"] = [{"source_type": a[1], "target_type": a[3], "status": a[4]} for a in allocs_by_uid]
        info["allocations_by_employee_profile_id"] = [{"source_type": a[1], "target_type": a[3], "status": a[4]} for a in allocs_by_empid]
        
        # Also check ALL batch allocations to see source_types used
        alloc_res_batches = await db.execute(text("SELECT DISTINCT source_type, target_type FROM core_allocations WHERE target_type = 'BATCH' LIMIT 20"))
        info["all_batch_allocation_types"] = [{"source_type": r[0], "target_type": r[1]} for r in alloc_res_batches.fetchall()]
        
        results.append(info)
    
    return {"joshua": results}

@app.get("/api/v1/check-joshua/all")
async def list_all_users(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import text
    res = await db.execute(text("SELECT id, email, username FROM auth_users ORDER BY email LIMIT 50"))
    return {"users": [{"id": str(r[0]), "email": r[1], "username": r[2]} for r in res.fetchall()]}


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
from app.modules.billing.router import router as billing_router
from app.modules.calendar.router import router as calendar_router

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
app.include_router(billing_router, prefix='/api/v1/billing', tags=['Billing'])
app.include_router(calendar_router, prefix='/api/v1/calendar', tags=['Calendar'])

@app.on_event("startup")
async def startup_event():
    from app.core.database import engine
    from sqlalchemy import text
    import logging

    logger = logging.getLogger("app")
    logger.info("Verifying database connection...")
    try:
        try:
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            logger.info("Database connection verified successfully.")
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            raise e

        if settings.DB_CREATE_TABLES_ON_STARTUP:
            logger.info("Running Base.metadata.create_all (DB_CREATE_TABLES_ON_STARTUP is True)...")
            from app.models.core.base import Base
            import app.models
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("Database tables verified/created.")

        # Always ensure TNDCE colleges table exists and is seeded (safe with checkfirst)
        try:
            from app.models.organizations.tndce_college import TNDCECollege
            from app.models.core.base import Base
            from app.core.database import AsyncSessionLocal
            from sqlalchemy import select, func

            logger.info("Ensuring ref_tndce_colleges table exists...")
            async with engine.begin() as conn:
                await conn.run_sync(
                    lambda sync_conn: TNDCECollege.__table__.create(sync_conn, checkfirst=True)
                )

            # Seed if empty
            async with AsyncSessionLocal() as db:
                count_res = await db.execute(select(func.count()).select_from(TNDCECollege))
                count = count_res.scalar()
                if count == 0:
                    logger.info("Seeding TNDCE colleges...")
                    from app.modules.student.router import sync_colleges_task
                    await sync_colleges_task(db)
                    logger.info("TNDCE colleges seeded successfully.")
                else:
                    logger.info(f"TNDCE colleges table already has {count} records.")
        except Exception as e:
            logger.error(f"TNDCE colleges setup failed (non-critical): {e}")

    except Exception as e:
        if settings.APP_ENV == "development":
            logger.warning("WARNING: Database connection failed at startup. Continuing anyway in development mode.")
        else:
            raise e


    try:
        from app.core.database import AsyncSessionLocal
        import uuid
        logger.info("Applying REPORTING_MANAGER missing permissions...")
        async with AsyncSessionLocal() as db:
            res = await db.execute(text("SELECT id FROM rbac_roles WHERE code = 'REPORTING_MANAGER'"))
            row = res.first()
            if row:
                role_id = row[0]
                res = await db.execute(text("SELECT id FROM rbac_permissions WHERE code LIKE 'REPORTING_MANAGER_MOD.%'"))
                perm_ids = [r[0] for r in res.fetchall()]
                if perm_ids:
                    res = await db.execute(text("SELECT permission_id FROM rbac_role_permissions WHERE role_id = :rid"), {"rid": role_id})
                    existing_perm_ids = {r[0] for r in res.fetchall()}
                    added = 0
                    for pid in perm_ids:
                        if pid not in existing_perm_ids:
                            await db.execute(
                                text("INSERT INTO rbac_role_permissions (id, role_id, permission_id) VALUES (:id, :rid, :pid)"),
                                {"id": uuid.uuid4(), "rid": role_id, "pid": pid}
                            )
                            added += 1
                    await db.commit()
                    logger.info(f"Added {added} permissions to REPORTING_MANAGER")
                    
    except Exception as e:
        logger.error(f"Failed to apply REPORTING_MANAGER permissions: {e}")


@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "ok", "app": settings.APP_NAME, "version": settings.APP_VERSION}

@app.get("/api/v1/test-error")
async def test_error():
    raise ValueError("Test error")
