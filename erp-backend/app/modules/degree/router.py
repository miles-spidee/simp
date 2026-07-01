from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_degree():
    return {"success": True, "message": "degree listing", "data": []}

@router.get("/{path:path}")
async def get_all_degree(path: str):
    return {"success": True, "message": f"degree get {path}", "data": []}

@router.post("/")
async def create_degree_root():
    return {"success": True, "message": "degree created", "data": {}}

@router.post("/{path:path}")
async def post_all_degree(path: str):
    return {"success": True, "message": f"degree post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_degree(path: str):
    return {"success": True, "message": f"degree put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_degree(path: str):
    return {"success": True, "message": f"degree patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_degree(path: str):
    return {"success": True, "message": f"degree delete {path}", "data": {}}
