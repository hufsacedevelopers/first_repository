from fastapi import APIRouter, Query

from app.schemas.incentive import IncentiveCompanyStatResponse
from app.services.public_data_service import fetch_incentive_companies_by_year

router = APIRouter(prefix="/supports/incentives", tags=["supports"])


@router.get("/live", response_model=IncentiveCompanyStatResponse)
def get_live_incentive_stats(
    year: int = Query(default=2024, ge=2018, le=2025),
    page: int = Query(default=1, ge=1),
    perPage: int = Query(default=100, ge=1, le=1000),
) -> IncentiveCompanyStatResponse:
    result = fetch_incentive_companies_by_year(year=year, page=page, per_page=perPage)
    return IncentiveCompanyStatResponse(**result)
