from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.responses import success_response
from app.models.finance.fee import FeeStructure
from uuid import UUID

router = APIRouter()

@router.get("")
async def get_fees(db: AsyncSession = Depends(get_db)):
    try:
        stmt = select(FeeStructure)
        res = await db.execute(stmt)
        fees = res.scalars().all()
        
        data = []
        for f in fees:
            data.append({
                "id": str(f.id),
                "feeName": f.fee_name,
                "feeType": f.fee_type,
                "amount": float(f.amount),
                "program": "General Program", # Map correctly if needed via Joins
                "department": "General", 
                "duration": "1 Year",
                "applicableBatch": "All",
                "installments": f.installments,
                "lateFee": 0,
                "status": "Active"
            })
        return success_response(data=data)
    except Exception as e:
        return success_response(data=[])

@router.post("")
async def create_fee(data: dict, db: AsyncSession = Depends(get_db)):
    try:
        fee = FeeStructure(
            fee_name=data.get("feeName", "Unknown Fee"),
            fee_type=data.get("feeType", "Training"),
            amount=float(data.get("amount", 0)),
            installments=int(data.get("installments", 1))
        )
        db.add(fee)
        await db.commit()
        await db.refresh(fee)
        
        data["id"] = str(fee.id)
        return success_response(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{id}")
async def delete_fee(id: UUID, db: AsyncSession = Depends(get_db)):
    try:
        fee = await db.scalar(select(FeeStructure).where(FeeStructure.id == id))
        if fee:
            await db.delete(fee)
            await db.commit()
        return success_response(message="Deleted successfully")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
