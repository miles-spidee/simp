from fastapi import APIRouter, Request
import uuid

router = APIRouter()

# In-memory store for leaves to persist during backend run
LEAVES = [
    {
        "id": "leave-mock-1",
        "userId": "user-1",
        "userName": "Ananya Desai",
        "role": "Student",
        "leaveType": "Medical",
        "startDate": "2026-07-10T00:00:00.000Z",
        "endDate": "2026-07-12T00:00:00.000Z",
        "reason": "Doctor advised rest due to fever.",
        "status": "Approved",
        "appliedOn": "2026-07-02T10:00:00.000Z"
    },
    {
        "id": "leave-mock-2",
        "userId": "user-1",
        "userName": "Ananya Desai",
        "role": "Student",
        "leaveType": "Casual",
        "startDate": "2026-07-15T00:00:00.000Z",
        "endDate": "2026-07-16T00:00:00.000Z",
        "reason": "Unavoidable family event.",
        "status": "Pending",
        "appliedOn": "2026-07-02T12:00:00.000Z"
    }
]

@router.get("/")
async def list_leave():
    return LEAVES

@router.get("/{path:path}")
async def get_all_leave(path: str):
    return LEAVES

@router.post("/")
async def create_leave_root(request: Request):
    body = await request.json()
    if "id" not in body:
        body["id"] = f"leave-{uuid.uuid4().hex[:8]}"
    LEAVES.insert(0, body)
    return body

@router.post("/{path:path}")
async def post_all_leave(path: str, request: Request):
    body = await request.json()
    if "id" not in body:
        body["id"] = f"leave-{uuid.uuid4().hex[:8]}"
    LEAVES.insert(0, body)
    return body

@router.put("/{path:path}")
async def put_all_leave(path: str, request: Request):
    body = await request.json()
    return body

@router.patch("/{path:path}")
async def patch_all_leave(path: str, request: Request):
    body = await request.json()
    return body

@router.delete("/{path:path}")
async def delete_all_leave(path: str):
    return {"status": "deleted"}
