from fastapi import APIRouter

from app.schemas.company import CompanyListResponse
from app.services.live_company_service import build_companies_payload

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("", response_model=CompanyListResponse)
def list_companies() -> CompanyListResponse:
    payload = build_companies_payload(limit=24)
    return CompanyListResponse(**payload)
