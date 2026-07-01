from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/")
async def list_reporting_manager():
    return {"success": True, "message": "reporting_manager listing", "data": []}

@router.get("/{path:path}")
async def get_all_reporting_manager(path: str):
    return {"success": True, "message": f"reporting_manager get {path}", "data": []}

@router.post("/")
async def create_reporting_manager_root():
    return {"success": True, "message": "reporting_manager created", "data": {}}

@router.post("/{path:path}")
async def post_all_reporting_manager(path: str):
    return {"success": True, "message": f"reporting_manager post {path}", "data": {}}

@router.put("/{path:path}")
async def put_all_reporting_manager(path: str):
    return {"success": True, "message": f"reporting_manager put {path}", "data": {}}

@router.patch("/{path:path}")
async def patch_all_reporting_manager(path: str):
    return {"success": True, "message": f"reporting_manager patch {path}", "data": {}}

@router.delete("/{path:path}")
async def delete_all_reporting_manager(path: str):
    return {"success": True, "message": f"reporting_manager delete {path}", "data": {}}
