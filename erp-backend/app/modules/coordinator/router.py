from fastapi import APIRouter

router = APIRouter()
mock_coordinators = [
    {
        "id": "c-1",
        "employeeId": "EMP-001",
        "collegeId": "COL-01",
        "name": "Jane Smith",
        "email": "jane@college.edu",
        "phone": "+1 555-1234",
        "assignedStudentsCount": 150,
        "activeBatchesCount": 4,
        "placementsCount": 45,
        "status": "Active"
    }
]

@router.get("/")
async def get_coordinators():
    return {"data": mock_coordinators}

@router.post("/")
async def create_coordinator(data: dict):
    new_id = f"c-{len(mock_coordinators)+1}"
    data["id"] = new_id
    mock_coordinators.append(data)
    return {"data": data}

mock_reports = {}

@router.get("/{id}/reports")
async def get_reports(id: str):
    return {"data": mock_reports.get(id, [])}

@router.post("/{id}/reports")
async def create_report(id: str, data: dict):
    if id not in mock_reports:
        mock_reports[id] = []
    mock_reports[id].append(data)
    return {"data": data}

@router.delete("/{id}")
async def delete_coordinator(id: str):
    global mock_coordinators
    mock_coordinators = [c for c in mock_coordinators if c["id"] != id]
    if id in mock_reports:
        del mock_reports[id]
    return {"status": "success"}
