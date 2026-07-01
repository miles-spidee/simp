from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_report():
    return {"success": True, "message": "report listing", "data": []}

@router.get("/{path:path}")
async def get_all_report(path: str):
    return {"success": True, "message": f"report get {path}", "data": []}

@router.post("/")
async def create_report_root():
    return {"success": True, "message": "report created", "data": {}}

@router.post("/{path:path}")
async def post_all_report(path: str):
    return {"success": True, "message": f"report post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_report(path: str):
    return {"success": True, "message": f"report put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_report(path: str):
    return {"success": True, "message": f"report patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_report(path: str):
    return {"success": True, "message": f"report delete {path}", "data": {}}
