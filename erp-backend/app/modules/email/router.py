from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_email():
    return {"success": True, "message": "email listing", "data": []}

@router.get("/{path:path}")
async def get_all_email(path: str):
    return {"success": True, "message": f"email get {path}", "data": []}

@router.post("/")
async def create_email_root():
    return {"success": True, "message": "email created", "data": {}}

@router.post("/{path:path}")
async def post_all_email(path: str):
    return {"success": True, "message": f"email post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_email(path: str):
    return {"success": True, "message": f"email put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_email(path: str):
    return {"success": True, "message": f"email patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_email(path: str):
    return {"success": True, "message": f"email delete {path}", "data": {}}
