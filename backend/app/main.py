from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers.accessibility import router as accessibility_router
from app.routers.companies import router as companies_router
from app.routers.health import router as health_router
from app.routers.incentives import router as incentives_router
from app.routers.jobs import router as jobs_router
from app.routers.standard_workplaces import router as standard_workplaces_router
from app.routers.supports import router as supports_router

app = FastAPI(title="Employment Decision Platform API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(companies_router)
app.include_router(jobs_router)
app.include_router(standard_workplaces_router)
app.include_router(supports_router)
app.include_router(incentives_router)
app.include_router(accessibility_router)
