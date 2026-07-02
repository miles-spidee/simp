from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_wallet():
    return {"data": [
        {
            "id": "txn-1",
            "walletId": "W-ALL",
            "studentId": "STU-001",
            "studentName": "John Doe",
            "type": "Credit",
            "amount": 5000,
            "source": "Refund",
            "reference": "REF-12345",
            "status": "Completed",
            "date": "2026-07-01"
        },
        {
            "id": "txn-2",
            "walletId": "W-ALL",
            "studentId": "STU-002",
            "studentName": "Jane Smith",
            "type": "Debit",
            "amount": 1500,
            "source": "Fee Payment",
            "reference": "REF-67890",
            "status": "Completed",
            "date": "2026-07-02"
        }
    ]}
