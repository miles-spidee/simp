from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_fee():
    return {"success": True, "message": "fee listing", "data": []}

@router.get("/{path:path}")
async def get_all_fee(path: str):
    return {"success": True, "message": f"fee get {path}", "data": []}

@router.post("/")
async def create_fee_root():
    return {"success": True, "message": "fee created", "data": {}}

@router.post("/{path:path}")
async def post_all_fee(path: str):
    return {"success": True, "message": f"fee post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_fee(path: str):
    return {"success": True, "message": f"fee put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_fee(path: str):
    return {"success": True, "message": f"fee patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_fee(path: str):
    return {"success": True, "message": f"fee delete {path}", "data": {}}
