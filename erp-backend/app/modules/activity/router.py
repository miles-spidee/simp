from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_activity():
    return {"success": True, "message": "activity listing", "data": []}

@router.get("/{path:path}")
async def get_all_activity(path: str):
    return {"success": True, "message": f"activity get {path}", "data": []}

@router.post("/")
async def create_activity_root():
    return {"success": True, "message": "activity created", "data": {}}

@router.post("/{path:path}")
async def post_all_activity(path: str):
    return {"success": True, "message": f"activity post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_activity(path: str):
    return {"success": True, "message": f"activity put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_activity(path: str):
    return {"success": True, "message": f"activity patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_activity(path: str):
    return {"success": True, "message": f"activity delete {path}", "data": {}}
