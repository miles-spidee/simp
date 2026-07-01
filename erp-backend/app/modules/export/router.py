from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_export():
    return {"success": True, "message": "export listing", "data": []}

@router.get("/{path:path}")
async def get_all_export(path: str):
    return {"success": True, "message": f"export get {path}", "data": []}

@router.post("/")
async def create_export_root():
    return {"success": True, "message": "export created", "data": {}}

@router.post("/{path:path}")
async def post_all_export(path: str):
    return {"success": True, "message": f"export post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_export(path: str):
    return {"success": True, "message": f"export put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_export(path: str):
    return {"success": True, "message": f"export patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_export(path: str):
    return {"success": True, "message": f"export delete {path}", "data": {}}
