from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_notification():
    return {"success": True, "message": "notification listing", "data": []}

@router.get("/{path:path}")
async def get_all_notification(path: str):
    return {"success": True, "message": f"notification get {path}", "data": []}

@router.post("/")
async def create_notification_root():
    return {"success": True, "message": "notification created", "data": {}}

@router.post("/{path:path}")
async def post_all_notification(path: str):
    return {"success": True, "message": f"notification post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_notification(path: str):
    return {"success": True, "message": f"notification put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_notification(path: str):
    return {"success": True, "message": f"notification patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_notification(path: str):
    return {"success": True, "message": f"notification delete {path}", "data": {}}
