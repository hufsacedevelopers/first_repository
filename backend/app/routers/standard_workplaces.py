from fastapi import APIRouter, Query

from app.schemas.standard_workplace import StandardWorkplaceResponse
from app.services.standard_workplace_service import fetch_standard_workplaces

router = APIRouter(prefix="/companies/standard-workplaces", tags=["companies"])


@router.get("/live", response_model=StandardWorkplaceResponse)
def get_standard_workplaces(
    pageNo: int = Query(default=1, ge=1),
    numOfRows: int = Query(default=20, ge=1, le=100),
) -> StandardWorkplaceResponse:
    result = fetch_standard_workplaces(page_no=pageNo, num_of_rows=numOfRows)
    return StandardWorkplaceResponse(**result)
