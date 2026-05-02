import logging

from fastapi import APIRouter

from app.schemas.company import Company
from app.services.accessibility_service import (
    apply_accessibility_to_companies,
    get_access_scores,
)
from app.services.data_service import get_companies_data

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("", response_model=list[Company])
def list_companies() -> list[Company]:
    """전체 기업 목록을 생활 접근성 점수와 함께 반환합니다.

    GG_API_KEY가 설정된 경우 경기도 장애인활동지원 기관 데이터를 바탕으로
    accessibilityScore와 compositeScore를 계산해 포함합니다.
    API 키가 없거나 호출 실패 시 두 필드는 null로 반환됩니다.
    """
    raw_companies = get_companies_data()

    # 생활 접근성 점수 적용 (API 키 없거나 오류 시 graceful fallback)
    try:
        access_scores = get_access_scores()
        if access_scores:
            raw_companies = apply_accessibility_to_companies(raw_companies, access_scores)
    except Exception:
        logger.warning("생활 접근성 점수 적용 실패 — accessibilityScore/compositeScore를 null로 반환합니다.")

    return [Company(**company) for company in raw_companies]
