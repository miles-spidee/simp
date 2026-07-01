from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_idcard():
    return {"success": True, "message": "idcard listing", "data": []}

@router.get("/{path:path}")
async def get_all_idcard(path: str):
    return {"success": True, "message": f"idcard get {path}", "data": []}

@router.post("/")
async def create_idcard_root():
    return {"success": True, "message": "idcard created", "data": {}}

@router.post("/{path:path}")
async def post_all_idcard(path: str):
    return {"success": True, "message": f"idcard post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_idcard(path: str):
    return {"success": True, "message": f"idcard put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_idcard(path: str):
    return {"success": True, "message": f"idcard patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_idcard(path: str):
    return {"success": True, "message": f"idcard delete {path}", "data": {}}
