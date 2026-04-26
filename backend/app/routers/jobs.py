from fastapi import APIRouter

from app.schemas.job import Job
from app.services.data_service import get_jobs_data

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=list[Job])
def list_jobs() -> list[Job]:
    return [Job(**job) for job in get_jobs_data()]
