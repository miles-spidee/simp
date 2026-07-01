from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_announcement():
    return {"success": True, "message": "announcement listing", "data": []}

@router.get("/{path:path}")
async def get_all_announcement(path: str):
    return {"success": True, "message": f"announcement get {path}", "data": []}

@router.post("/")
async def create_announcement_root():
    return {"success": True, "message": "announcement created", "data": {}}

@router.post("/{path:path}")
async def post_all_announcement(path: str):
    return {"success": True, "message": f"announcement post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_announcement(path: str):
    return {"success": True, "message": f"announcement put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_announcement(path: str):
    return {"success": True, "message": f"announcement patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_announcement(path: str):
    return {"success": True, "message": f"announcement delete {path}", "data": {}}
