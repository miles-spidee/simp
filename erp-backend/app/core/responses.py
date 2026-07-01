from typing import Any, Generic, TypeVar, Optional
from pydantic import BaseModel
from fastapi.responses import JSONResponse

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: Optional[T] = None
    errors: Optional[Any] = None
    meta: Optional[dict[str, Any]] = None

from fastapi.encoders import jsonable_encoder

def success_response(
    data: Any = None, 
    message: str = "Operation successful", 
    meta: Optional[dict[str, Any]] = None,
    status_code: int = 200
) -> JSONResponse:
    content = {
        "success": True,
        "message": message,
        "data": jsonable_encoder(data),
        "errors": None,
        "meta": meta or {}
    }
    return JSONResponse(status_code=status_code, content=content)

def error_response(
    message: str = "An error occurred",
    errors: Any = None,
    status_code: int = 400,
    meta: Optional[dict[str, Any]] = None
) -> JSONResponse:
    content = {
        "success": False,
        "message": message,
        "data": None,
        "errors": errors,
        "meta": meta or {}
    }
    return JSONResponse(status_code=status_code, content=content)
