from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_wallet():
    return {"success": True, "message": "wallet listing", "data": []}

@router.get("/{path:path}")
async def get_all_wallet(path: str):
    return {"success": True, "message": f"wallet get {path}", "data": []}

@router.post("/")
async def create_wallet_root():
    return {"success": True, "message": "wallet created", "data": {}}

@router.post("/{path:path}")
async def post_all_wallet(path: str):
    return {"success": True, "message": f"wallet post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_wallet(path: str):
    return {"success": True, "message": f"wallet put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_wallet(path: str):
    return {"success": True, "message": f"wallet patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_wallet(path: str):
    return {"success": True, "message": f"wallet delete {path}", "data": {}}
