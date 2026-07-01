from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_kpi():
    return {"success": True, "message": "kpi listing", "data": []}

@router.get("/{path:path}")
async def get_all_kpi(path: str):
    return {"success": True, "message": f"kpi get {path}", "data": []}

@router.post("/")
async def create_kpi_root():
    return {"success": True, "message": "kpi created", "data": {}}

@router.post("/{path:path}")
async def post_all_kpi(path: str):
    return {"success": True, "message": f"kpi post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_kpi(path: str):
    return {"success": True, "message": f"kpi put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_kpi(path: str):
    return {"success": True, "message": f"kpi patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_kpi(path: str):
    return {"success": True, "message": f"kpi delete {path}", "data": {}}
