from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from app.core.responses import error_response
import logging

logger = logging.getLogger(__name__)

class BusinessException(Exception):
    def __init__(self, message: str, status_code: int = 400, errors: dict = None):
        self.message = message
        self.status_code = status_code
        self.errors = errors

def register_exception_handlers(app: FastAPI):
    
    @app.exception_handler(BusinessException)
    async def business_exception_handler(request: Request, exc: BusinessException):
        logger.warning(f"BusinessException: {exc.message}")
        return error_response(
            message=exc.message,
            errors=exc.errors,
            status_code=exc.status_code
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.warning(f"Validation Error: {exc.errors()}")
        return error_response(
            message="Validation error",
            errors=exc.errors(),
            status_code=422
        )

    @app.exception_handler(SQLAlchemyError)
    async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
        logger.error(f"Database Error: {str(exc)}")
        return error_response(
            message="A database error occurred. Please try again later.",
            status_code=500
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
        return error_response(
            message="An unexpected error occurred.",
            status_code=500
        )
