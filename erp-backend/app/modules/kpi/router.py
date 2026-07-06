import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.core.responses import success_response
from app.models.analytics.kpi import KPIMetric
from app.modules.kpi.compute import compute_kpis

router = APIRouter()

# Schema definitions
class KPICreate(BaseModel):
    name: str
    category: str
    currentValue: float
    targetValue: float
    unit: str = "%"
    status: str = "on_track"
    trend: str = "flat"
    trendPercentage: float = 0.0

class KPIUpdate(BaseModel):
    currentValue: Optional[float] = None
    targetValue: Optional[float] = None
    status: Optional[str] = None
    trend: Optional[str] = None
    trendPercentage: Optional[float] = None

@router.get("/")
async def list_kpis(db: AsyncSession = Depends(get_db)):
    try:
        # Check if empty, and auto-seed default metrics or update existing standard metrics
        computed_values = await compute_kpis(db)

        # Standard definitions
        standard_kpis = [
            {"name": "Overall Placement Rate", "category": "Placement", "target_value": 85.0, "unit": "%"},
            {"name": "Average Course Score", "category": "Performance", "target_value": 80.0, "unit": "%"},
            {"name": "Digital Certificates Issued", "category": "Retention", "target_value": 150.0, "unit": " Certs"},
            {"name": "Total Invoice Collection", "category": "Finance", "target_value": 500000.0, "unit": " INR"},
            {"name": "Daily Student Attendance", "category": "Attendance", "target_value": 95.0, "unit": "%"},
            {"name": "Peer Mentor Coverage", "category": "General", "target_value": 80.0, "unit": "%"},
        ]

        stmt = select(KPIMetric)
        res = await db.execute(stmt)
        existing_metrics = {m.name: m for m in res.scalars().all()}

        new_metrics_to_add = []
        for std in standard_kpis:
            name = std["name"]
            val = computed_values.get(name, 0.0)
            
            # Basic status logic
            status = "on_track"
            if name in ["Overall Placement Rate", "Daily Student Attendance", "Peer Mentor Coverage", "Average Course Score"]:
                if val < std["target_value"] * 0.8:
                    status = "at_risk"
                elif val < std["target_value"]:
                    status = "behind"
            elif name in ["Digital Certificates Issued", "Total Invoice Collection"]:
                if val < std["target_value"] * 0.5:
                    status = "behind"

            if name in existing_metrics:
                m = existing_metrics[name]
                m.current_value = val
                m.status = status
            else:
                new_kpi = KPIMetric(
                    name=name,
                    category=std["category"],
                    current_value=val,
                    target_value=std["target_value"],
                    unit=std["unit"],
                    status=status,
                    trend="flat",
                    trend_percentage=0.0
                )
                new_metrics_to_add.append(new_kpi)

        if new_metrics_to_add:
            db.add_all(new_metrics_to_add)
        
        await db.commit()

        # Re-fetch after updates
        stmt = select(KPIMetric)
        res = await db.execute(stmt)
        metrics = res.scalars().all()
        
        data = []
        for m in metrics:
            data.append({
                "id": str(m.id),
                "name": m.name,
                "category": m.category,
                "currentValue": float(m.current_value),
                "targetValue": float(m.target_value),
                "unit": m.unit,
                "trend": m.trend,
                "trendPercentage": float(m.trend_percentage),
                "status": m.status,
                "lastUpdated": m.updated_at.isoformat() if m.updated_at else datetime.now().isoformat()
            })
        return success_response(data=data)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return success_response(data=[])

@router.post("/")
async def create_kpi(payload: KPICreate, db: AsyncSession = Depends(get_db)):
    try:
        kpi = KPIMetric(
            name=payload.name,
            category=payload.category,
            current_value=payload.currentValue,
            target_value=payload.targetValue,
            unit=payload.unit,
            status=payload.status,
            trend=payload.trend,
            trend_percentage=payload.trendPercentage
        )
        db.add(kpi)
        await db.commit()
        await db.refresh(kpi)
        
        return success_response(data={
            "id": str(kpi.id),
            "name": kpi.name,
            "category": kpi.category,
            "currentValue": float(kpi.current_value),
            "targetValue": float(kpi.target_value),
            "unit": kpi.unit,
            "trend": kpi.trend,
            "trendPercentage": float(kpi.trend_percentage),
            "status": kpi.status,
            "lastUpdated": datetime.now().isoformat()
        })
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{kpi_id}")
async def update_kpi(kpi_id: uuid.UUID, payload: KPIUpdate, db: AsyncSession = Depends(get_db)):
    try:
        stmt = select(KPIMetric).where(KPIMetric.id == kpi_id)
        res = await db.execute(stmt)
        kpi = res.scalars().first()
        if not kpi:
            raise HTTPException(status_code=404, detail="KPI metric not found")
            
        if payload.currentValue is not None:
            kpi.current_value = payload.currentValue
        if payload.targetValue is not None:
            kpi.target_value = payload.targetValue
        if payload.status is not None:
            kpi.status = payload.status
        if payload.trend is not None:
            kpi.trend = payload.trend
        if payload.trendPercentage is not None:
            kpi.trend_percentage = payload.trendPercentage
            
        await db.commit()
        await db.refresh(kpi)
        
        return success_response(data={
            "id": str(kpi.id),
            "name": kpi.name,
            "category": kpi.category,
            "currentValue": float(kpi.current_value),
            "targetValue": float(kpi.target_value),
            "unit": kpi.unit,
            "trend": kpi.trend,
            "trendPercentage": float(kpi.trend_percentage),
            "status": kpi.status,
            "lastUpdated": datetime.now().isoformat()
        })
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
