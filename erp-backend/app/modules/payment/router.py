from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_payment():
    return {"success": True, "message": "payment listing", "data": []}

@router.get("/{path:path}")
async def get_all_payment(path: str):
    return {"success": True, "message": f"payment get {path}", "data": []}

@router.post("/")
async def create_payment_root():
    return {"success": True, "message": "payment created", "data": {}}

@router.post("/{path:path}")
async def post_all_payment(path: str):
    return {"success": True, "message": f"payment post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_payment(path: str):
    return {"success": True, "message": f"payment put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_payment(path: str):
    return {"success": True, "message": f"payment patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_payment(path: str):
    return {"success": True, "message": f"payment delete {path}", "data": {}}
