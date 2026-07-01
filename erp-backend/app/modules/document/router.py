from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_document():
    return {"success": True, "message": "document listing", "data": []}

@router.get("/{path:path}")
async def get_all_document(path: str):
    return {"success": True, "message": f"document get {path}", "data": []}

@router.post("/")
async def create_document_root():
    return {"success": True, "message": "document created", "data": {}}

@router.post("/{path:path}")
async def post_all_document(path: str):
    return {"success": True, "message": f"document post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_document(path: str):
    return {"success": True, "message": f"document put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_document(path: str):
    return {"success": True, "message": f"document patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_document(path: str):
    return {"success": True, "message": f"document delete {path}", "data": {}}
