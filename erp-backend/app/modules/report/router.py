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
from app.utils.pdf_generator import REPORT_GENERATORS

router = APIRouter()

# Schema definitions
class GenerateReportRequest(BaseModel):
    templateId: str

# Report Templates definition
TEMPLATES = [
    {"id": "tpl-1", "name": "Quarterly Finance Audit", "category": "Financial", "description": "Quarterly summary of tuition invoicing, disbursements, and overall collections."},
    {"id": "tpl-2", "name": "Student Performance Report", "category": "Academic", "description": "Academic analysis of student course module scores, quiz attempts, and average grades."},
    {"id": "tpl-3", "name": "Batch Attendance Ledger", "category": "Attendance", "description": "Summary of overall student attendance rates, daily registers, and absence alerts."},
    {"id": "tpl-4", "name": "Placement Velocity Summary", "category": "Placement", "description": "KPI report on hiring velocities, top company partners, and average CTC levels."}
]

# Background compiling simulation
async def compile_report_task(report_id: uuid.UUID, db_session_maker):
    # Sleep 5 seconds to simulate heavy data compiling
    await asyncio.sleep(5)
    
    # We must construct a new session since the request session might be closed/expired
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
        except Exception as e:
            # Update to failed if something goes wrong
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
async def list_generated_reports(db: AsyncSession = Depends(get_db)):
    try:
        stmt = select(ReportRecord).order_by(ReportRecord.created_at.desc())
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
                "status": r.status, # Completed, Processing, Failed
                "format": r.format,
                "sizeBytes": r.size_bytes,
                "downloadUrl": r.download_url or ""
            })
            
        # Seed initial records if empty
        if not data:
            initial = [
                ReportRecord(name="Q1 Tuition Fees Audit", type="Financial", generated_by="System Scheduler", status="Completed", format="PDF", size_bytes=1048576, download_url=""),
                ReportRecord(name="CSE-A Batch Performance Analysis", type="Academic", generated_by="Dean Office Console", status="Completed", format="PDF", size_bytes=204850, download_url="")
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
async def list_report_templates():
    return success_response(data=TEMPLATES)

@router.post("/generate")
async def generate_report(payload: GenerateReportRequest, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    try:
        # Find matching template
        template = next((t for t in TEMPLATES if t["id"] == payload.templateId), None)
        if not template:
            raise HTTPException(status_code=400, detail="Invalid report template ID")
            
        report = ReportRecord(
            name=template["name"],
            type=template["category"],
            generated_by="Administrator Console",
            status="Processing",
            format="PDF",
            size_bytes=0
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
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{report_id}/download")
async def download_report_pdf(report_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Generate and stream a real PDF for the given report."""
    try:
        stmt = select(ReportRecord).where(ReportRecord.id == report_id)
        res = await db.execute(stmt)
        report = res.scalars().first()

        if not report:
            raise HTTPException(status_code=404, detail="Report not found")

        if report.status != "Completed":
            raise HTTPException(status_code=400, detail="Report is still being compiled")

        generator = REPORT_GENERATORS.get(report.type)
        if not generator:
            # Fallback to finance report
            generator = REPORT_GENERATORS["Financial"]

        pdf_bytes = generator(report_name=report.name)

        filename = f"{report.name.replace(' ', '_')}.pdf"

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

