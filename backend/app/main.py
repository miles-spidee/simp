import app.models
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.modules.auth.router import router as auth_router
from app.modules.internship_types.router import router as internship_router
from app.modules.applications.router import router as applications_router
from app.modules.application_documents.router import router as application_documents_router
from app.modules.application_profiles.router import router as application_profiles_router
# from app.modules.corporate_application_details.router import router as corporate_application_details_router
from app.modules.industrial_application_details.router import router as industrial_application_details_router
from app.modules.paid_application_details.router import router as paid_application_details_router
from app.modules.research_application_details.router import router as research_application_details_router
from app.modules.stipend_application_details.router import router as stipend_application_details_router

app = FastAPI(
    title="Pinesphere ERP"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(internship_router)
app.include_router(applications_router)
app.include_router(application_documents_router)
app.include_router(application_profiles_router)
# app.include_router(corporate_application_details_router)
app.include_router(industrial_application_details_router)
app.include_router(paid_application_details_router)
app.include_router(research_application_details_router)
app.include_router(stipend_application_details_router)

# # Example Route
# @app.get("/check") # We can use app.post() also for POST requests
# def health_check():
#     return {"status": "ok !!"}