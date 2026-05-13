from fastapi import APIRouter

from app.schemas.company import CompanyListResponse
from app.services.company_rating_service import build_rating_methodology
from app.services.live_company_service import build_companies_payload

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("", response_model=CompanyListResponse)
def list_companies() -> CompanyListResponse:
    payload = build_companies_payload(limit=24)
    return CompanyListResponse(**payload)


@router.get("/rating-methodology")
def rating_methodology() -> dict:
    """기업 장애 친화도 산출 가중치·근무환경 6축·종합식 공개."""
    return build_rating_methodology()
