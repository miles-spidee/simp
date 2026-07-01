from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_feedback():
    return {"success": True, "message": "feedback listing", "data": []}

@router.get("/{path:path}")
async def get_all_feedback(path: str):
    return {"success": True, "message": f"feedback get {path}", "data": []}

@router.post("/")
async def create_feedback_root():
    return {"success": True, "message": "feedback created", "data": {}}

@router.post("/{path:path}")
async def post_all_feedback(path: str):
    return {"success": True, "message": f"feedback post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_feedback(path: str):
    return {"success": True, "message": f"feedback put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_feedback(path: str):
    return {"success": True, "message": f"feedback patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_feedback(path: str):
    return {"success": True, "message": f"feedback delete {path}", "data": {}}
