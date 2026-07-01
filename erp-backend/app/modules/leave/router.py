from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_leave():
    return {"success": True, "message": "leave listing", "data": []}

@router.get("/{path:path}")
async def get_all_leave(path: str):
    return {"success": True, "message": f"leave get {path}", "data": []}

@router.post("/")
async def create_leave_root():
    return {"success": True, "message": "leave created", "data": {}}

@router.post("/{path:path}")
async def post_all_leave(path: str):
    return {"success": True, "message": f"leave post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_leave(path: str):
    return {"success": True, "message": f"leave put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_leave(path: str):
    return {"success": True, "message": f"leave patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_leave(path: str):
    return {"success": True, "message": f"leave delete {path}", "data": {}}
