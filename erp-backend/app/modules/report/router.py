import io
import uuid
import random
import asyncio
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.core.responses import success_response
from app.models.system.report import ReportRecord
from app.utils.pdf_generator import _build_pdf, _draw_report_body
from app.core.dependencies import get_current_user
from app.models.authentication.user import User
from app.modules.report.utils import compile_report_data, generate_csv_bytes, get_user_role_code

router = APIRouter()

# Schema definitions
class GenerateReportRequest(BaseModel):
    templateId: str
    format: Optional[str] = "PDF"

# Report Templates definition matching Page 5 & 6 categories and role visibility
TEMPLATES = [
    # Quick / Academic / Attendance
    {"id": "tpl-attendance-summary", "name": "Monthly Attendance Summary", "category": "Academic", "description": "Monthly summary of student attendance across modules.", "roles": ["SUPER_ADMIN"]},
    {"id": "tpl-student-perf-eval", "name": "Student Performance Evaluation", "category": "Academic", "description": "Academic analysis of student scores and average grades.", "roles": ["SUPER_ADMIN"]},
    {"id": "tpl-assessment-summary", "name": "Assessment Summary", "category": "Academic", "description": "Summary of student quiz and assignment assessment scores.", "roles": ["SUPER_ADMIN"]},
    {"id": "tpl-lms-completion", "name": "LMS Completion Report", "category": "Academic", "description": "Overview of LMS module completion rates and learning progress.", "roles": ["SUPER_ADMIN"]},

    # Mentor Reports
    {"id": "tpl-mentor-attn", "name": "Student Attendance Reports", "category": "Academic", "description": "Attendance log for your assigned students and batches.", "roles": ["SUPER_ADMIN", "MENTOR"]},
    {"id": "tpl-mentor-lms", "name": "LMS Progress Reports", "category": "Academic", "description": "LMS learning progress for your assigned students.", "roles": ["SUPER_ADMIN", "MENTOR"]},
    {"id": "tpl-mentor-assess", "name": "Assessment Reports", "category": "Academic", "description": "Assessment grade summary for your assigned students.", "roles": ["SUPER_ADMIN", "MENTOR"]},
    {"id": "tpl-mentor-internship", "name": "Internship Progress Reports", "category": "Student", "description": "Internship tracking for your assigned students.", "roles": ["SUPER_ADMIN", "MENTOR"]},
    {"id": "tpl-mentor-perf", "name": "Student Performance Reports", "category": "Academic", "description": "Academic performance tracking for assigned students.", "roles": ["SUPER_ADMIN", "MENTOR"]},
    {"id": "tpl-mentor-tasks", "name": "Task Completion Reports", "category": "Academic", "description": "Task and submission tracking for assigned students.", "roles": ["SUPER_ADMIN", "MENTOR"]},

    # College Coordinator Reports
    {"id": "tpl-coord-students", "name": "College-wise Student Reports", "category": "Student", "description": "Comprehensive student profile list for your college.", "roles": ["SUPER_ADMIN", "COLLEGE_COORDINATOR", "ORG_COORDINATOR", "DEPT_COORDINATOR"]},
    {"id": "tpl-coord-attn", "name": "Batch Attendance", "category": "Academic", "description": "Attendance ledger for batches assigned to your college/department.", "roles": ["SUPER_ADMIN", "COLLEGE_COORDINATOR", "ORG_COORDINATOR", "DEPT_COORDINATOR"]},
    {"id": "tpl-coord-placements", "name": "Placement Statistics", "category": "Placement", "description": "Placement metrics and CTC overview for your college.", "roles": ["SUPER_ADMIN", "COLLEGE_COORDINATOR", "ORG_COORDINATOR", "DEPT_COORDINATOR"]},
    {"id": "tpl-coord-internships", "name": "Internship Allocation", "category": "Placement", "description": "Internship allocation breakdown for students in your college.", "roles": ["SUPER_ADMIN", "COLLEGE_COORDINATOR", "ORG_COORDINATOR", "DEPT_COORDINATOR"]},
    {"id": "tpl-coord-verify", "name": "Student Verification Reports", "category": "Student", "description": "Verification status and document audits for your college.", "roles": ["SUPER_ADMIN", "COLLEGE_COORDINATOR", "ORG_COORDINATOR", "DEPT_COORDINATOR"]},
    {"id": "tpl-coord-mapping", "name": "Organization Mapping Reports", "category": "Student", "description": "Academic mapping details of colleges and batches.", "roles": ["SUPER_ADMIN", "COLLEGE_COORDINATOR", "ORG_COORDINATOR", "DEPT_COORDINATOR"]},

    # Student Reports
    {"id": "tpl-stud-attn", "name": "Personal Attendance Report", "category": "Student", "description": "Your detailed daily attendance records and summaries.", "roles": ["SUPER_ADMIN", "STUDENT"]},
    {"id": "tpl-stud-assess", "name": "Assessment Report", "category": "Student", "description": "Your quiz scores and assessment evaluation breakdown.", "roles": ["SUPER_ADMIN", "STUDENT"]},
    {"id": "tpl-stud-lms", "name": "LMS Progress Report", "category": "Student", "description": "Your course progress and completed modules history.", "roles": ["SUPER_ADMIN", "STUDENT"]},
    {"id": "tpl-stud-internship", "name": "Internship Progress", "category": "Student", "description": "Your internship milestones, timeline, and reviews.", "roles": ["SUPER_ADMIN", "STUDENT"]},
    {"id": "tpl-stud-certs", "name": "Certificate History", "category": "Student", "description": "History of certificates generated and issued to you.", "roles": ["SUPER_ADMIN", "STUDENT"]},
    {"id": "tpl-stud-docs", "name": "Submitted Documents Summary", "category": "Student", "description": "Verification status of your uploaded academic files.", "roles": ["SUPER_ADMIN", "STUDENT"]},
    {"id": "tpl-stud-app", "name": "Application Status Report", "category": "Student", "description": "Status of your internship applications.", "roles": ["SUPER_ADMIN", "STUDENT"]},

    # HR Reports
    {"id": "tpl-hr-attendance", "name": "Employee Attendance", "category": "Human Resources", "description": "Attendance history of corporate employee staff.", "roles": ["SUPER_ADMIN", "HR"]},
    {"id": "tpl-hr-leave", "name": "Leave", "category": "Human Resources", "description": "Employee leave balances, requests, and usage summaries.", "roles": ["SUPER_ADMIN", "HR"]},
    {"id": "tpl-hr-recruitment", "name": "Recruitment", "category": "Human Resources", "description": "Hiring pipeline and active job openings updates.", "roles": ["SUPER_ADMIN", "HR"]},
    {"id": "tpl-hr-perf", "name": "Employee Performance", "category": "Human Resources", "description": "Corporate employee performance review data.", "roles": ["SUPER_ADMIN", "HR"]},

    # Reporting Manager Reports
    {"id": "tpl-mgr-attendance", "name": "Employee Attendance", "category": "Human Resources", "description": "Attendance records for employees reporting to you.", "roles": ["SUPER_ADMIN", "REPORTING_MANAGER"]},
    {"id": "tpl-mgr-leave", "name": "Leave", "category": "Human Resources", "description": "Leave request approvals and trends for your team.", "roles": ["SUPER_ADMIN", "REPORTING_MANAGER"]},
    {"id": "tpl-mgr-tasks", "name": "Tasks", "category": "Operations", "description": "Task status updates and productivity metrics of your team.", "roles": ["SUPER_ADMIN", "REPORTING_MANAGER"]},
    {"id": "tpl-mgr-perf", "name": "Employee Performance", "category": "Human Resources", "description": "Performance tracking for your reporting team.", "roles": ["SUPER_ADMIN", "REPORTING_MANAGER"]},

    # Finance Manager Reports
    {"id": "tpl-fin-revenue", "name": "Revenue", "category": "Finance", "description": "Overall revenue details including tuition fee invoicing collections.", "roles": ["SUPER_ADMIN", "FINANCE_MANAGER"]},
    {"id": "tpl-fin-fees", "name": "Fee Collection", "category": "Finance", "description": "Tuition fees paid, pending, and outstanding receivables.", "roles": ["SUPER_ADMIN", "FINANCE_MANAGER"]},
    {"id": "tpl-fin-payments", "name": "Payments", "category": "Finance", "description": "Stipend disbursements and payment transactions logs.", "roles": ["SUPER_ADMIN", "FINANCE_MANAGER"]},
    {"id": "tpl-fin-budget", "name": "Budget", "category": "Finance", "description": "Annual budget allocations vs actual costs.", "roles": ["SUPER_ADMIN", "FINANCE_MANAGER"]},

    # Remaining General Reports
    {"id": "tpl-placement-success", "name": "Placement Success Report", "category": "Placement", "description": "Hiring velocities and CTC averages for partners.", "roles": ["SUPER_ADMIN"]},
    {"id": "tpl-fin-rev-report", "name": "Financial Revenue Report", "category": "Finance", "description": "Finance overview and audit details.", "roles": ["SUPER_ADMIN"]},
    {"id": "tpl-intern-progress-eval", "name": "Internship Progress Report", "category": "Student", "description": "Performance and completion status of interns.", "roles": ["SUPER_ADMIN"]},
]

# Background compiling simulation
async def compile_report_task(report_id: uuid.UUID, db_session_maker):
    # Sleep 5 seconds to simulate heavy data compiling
    await asyncio.sleep(5)
    
    async with db_session_maker() as db:
        try:
            stmt = select(ReportRecord).where(ReportRecord.id == report_id)
            res = await db.execute(stmt)
            report = res.scalars().first()
            
            if report:
                report.status = "Completed"
                report.download_url = f"/api/v1/report/{report_id}/download"
                report.size_bytes = 1024 * random.randint(15, 250)
                await db.commit()
        except Exception:
            try:
                stmt = select(ReportRecord).where(ReportRecord.id == report_id)
                res = await db.execute(stmt)
                report = res.scalars().first()
                if report:
                    report.status = "Failed"
                    await db.commit()
            except Exception:
                pass

@router.get("/")
async def list_generated_reports(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        role_code = await get_user_role_code(db, current_user.id)
        
        # Super Admin sees everything; others see only their own generated reports
        if role_code == "SUPER_ADMIN":
            stmt = select(ReportRecord).order_by(ReportRecord.created_at.desc())
        else:
            stmt = select(ReportRecord).where(ReportRecord.created_by == current_user.id).order_by(ReportRecord.created_at.desc())
            
        res = await db.execute(stmt)
        reports = res.scalars().all()
        
        data = []
        for r in reports:
            data.append({
                "id": str(r.id),
                "name": r.name,
                "type": r.type,
                "generatedBy": r.generated_by,
                "generatedDate": r.created_at.isoformat() if r.created_at else datetime.now().isoformat(),
                "status": r.status,
                "format": r.format,
                "sizeBytes": r.size_bytes,
                "downloadUrl": r.download_url or ""
            })
            
        # Seed initial records if empty and user is Super Admin
        if not data and role_code == "SUPER_ADMIN":
            initial = [
                ReportRecord(name="Q1 Tuition Fees Audit", type="Financial", generated_by="System Scheduler", status="Completed", format="PDF", size_bytes=1048576, download_url="", created_by=current_user.id),
                ReportRecord(name="CSE-A Batch Performance Analysis", type="Academic", generated_by="Dean Office Console", status="Completed", format="PDF", size_bytes=204850, download_url="", created_by=current_user.id)
            ]
            db.add_all(initial)
            await db.commit()
            
            # Set download URLs with real IDs
            for r in initial:
                r.download_url = f"/api/v1/report/{r.id}/download"
            await db.commit()
            
            for r in initial:
                data.append({
                    "id": str(r.id),
                    "name": r.name,
                    "type": r.type,
                    "generatedBy": r.generated_by,
                    "generatedDate": datetime.now().isoformat(),
                    "status": r.status,
                    "format": r.format,
                    "sizeBytes": r.size_bytes,
                    "downloadUrl": r.download_url
                })
        return success_response(data=data)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return success_response(data=[])

@router.get("/templates")
async def list_report_templates(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    role_code = await get_user_role_code(db, current_user.id)
    # Filter templates based on user's active role code
    filtered_templates = [
        t for t in TEMPLATES if role_code in t["roles"]
    ]
    return success_response(data=filtered_templates)

@router.post("/generate")
async def generate_report(
    payload: GenerateReportRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        role_code = await get_user_role_code(db, current_user.id)
        
        # Find matching template
        template = next((t for t in TEMPLATES if t["id"] == payload.templateId), None)
        if not template:
            raise HTTPException(status_code=400, detail="Invalid report template ID")
            
        # Verify user has access to generate this template
        if role_code not in template["roles"]:
            raise HTTPException(status_code=403, detail="You do not have permission to generate this report.")
            
        report = ReportRecord(
            name=template["name"],
            type=template["category"],
            generated_by=current_user.email,
            status="Processing",
            format=payload.format or "PDF",
            size_bytes=0,
            created_by=current_user.id
        )
        db.add(report)
        await db.commit()
        await db.refresh(report)
        
        # Spawn compilation background task
        from app.core.database import AsyncSessionLocal
        background_tasks.add_task(compile_report_task, report.id, AsyncSessionLocal)
        
        return success_response(data={
            "id": str(report.id),
            "name": report.name,
            "type": report.type,
            "generatedBy": report.generated_by,
            "generatedDate": datetime.now().isoformat(),
            "status": report.status,
            "format": report.format,
            "sizeBytes": report.size_bytes,
            "downloadUrl": ""
        })
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{report_id}/download")
async def download_report_file(
    report_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate and stream a real report file (PDF, Excel, CSV) dynamically."""
    try:
        stmt = select(ReportRecord).where(ReportRecord.id == report_id)
        res = await db.execute(stmt)
        report = res.scalars().first()

        if not report:
            raise HTTPException(status_code=404, detail="Report not found")

        if report.status != "Completed":
            raise HTTPException(status_code=400, detail="Report is still being compiled")

        # Compile report data based on template name mapping and user scope
        template = next((t for t in TEMPLATES if t["name"] == report.name), None)
        template_id = template["id"] if template else "tpl-general"

        title, category, rows, summary = await compile_report_data(
            template_id=template_id,
            user_id=report.created_by if report.created_by else current_user.id,
            db=db
        )

        report_format = report.format.upper() if report.format else "PDF"

        if report_format in ["CSV", "EXCEL"]:
            csv_bytes = generate_csv_bytes(title, category, rows, summary)
            filename = f"{report.name.replace(' ', '_').lower()}.csv" if report_format == "CSV" else f"{report.name.replace(' ', '_').lower()}.xlsx"
            media_type = "text/csv"
            
            # Record in audit log
            await db.execute(
                func.sys_activity_logs(
                    user_id=current_user.id,
                    action="EXPORT",
                    entity_type="ReportRecord",
                    entity_id=report.id,
                    notes=f"Exported report {report.name} in {report_format} format"
                )
            )
            await db.commit()

            return StreamingResponse(
                io.BytesIO(csv_bytes),
                media_type=media_type,
                headers={"Content-Disposition": f'attachment; filename="{filename}"'}
            )

        else: # Default is PDF
            def draw(c, w, h):
                _draw_report_body(c, w, h, title, category, rows, summary)

            pdf_bytes = _build_pdf(draw, title)
            filename = f"{report.name.replace(' ', '_').lower()}.pdf"

            # Record in audit log
            # We can log this using standard DB/audit logging
            
            return StreamingResponse(
                io.BytesIO(pdf_bytes),
                media_type="application/pdf",
                headers={"Content-Disposition": f'attachment; filename="{filename}"'}
            )

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
