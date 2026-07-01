from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_verification():
    return {"success": True, "message": "verification listing", "data": []}

@router.get("/{path:path}")
async def get_all_verification(path: str):
    return {"success": True, "message": f"verification get {path}", "data": []}

@router.post("/")
async def create_verification_root():
    return {"success": True, "message": "verification created", "data": {}}

@router.post("/{path:path}")
async def post_all_verification(path: str):
    return {"success": True, "message": f"verification post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_verification(path: str):
    return {"success": True, "message": f"verification put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_verification(path: str):
    return {"success": True, "message": f"verification patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_verification(path: str):
    return {"success": True, "message": f"verification delete {path}", "data": {}}
