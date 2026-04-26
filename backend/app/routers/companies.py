from fastapi import APIRouter

from app.schemas.company import Company
from app.services.data_service import get_companies_data

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("", response_model=list[Company])
def list_companies() -> list[Company]:
    return [Company(**company) for company in get_companies_data()]
