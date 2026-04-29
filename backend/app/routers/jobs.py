from fastapi import APIRouter

from app.schemas.job import Job
from app.schemas.live_job import LiveJobResponse, LiveJobWithEnvResponse
from app.services.data_service import get_jobs_data
from app.services.live_job_service import fetch_live_jobs, fetch_live_jobs_with_env

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=list[Job])
def list_jobs() -> list[Job]:
    return [Job(**job) for job in get_jobs_data()]


@router.get("/live", response_model=LiveJobResponse)
def list_live_jobs(pageNo: int = 1, numOfRows: int = 20) -> LiveJobResponse:
    result = fetch_live_jobs(page_no=pageNo, num_of_rows=numOfRows)
    return LiveJobResponse(**result)


@router.get("/live-with-env", response_model=LiveJobWithEnvResponse)
def list_live_jobs_with_env(pageNo: int = 1, numOfRows: int = 20) -> LiveJobWithEnvResponse:
    result = fetch_live_jobs_with_env(page_no=pageNo, num_of_rows=numOfRows)
    return LiveJobWithEnvResponse(**result)
