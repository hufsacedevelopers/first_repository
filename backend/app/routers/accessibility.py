"""생활 접근성 점수 API.

GET /accessibility  — 경기도 시군별 장애인활동지원 기관 수 및 접근성 점수 반환
"""
from fastapi import APIRouter

from app.schemas.accessibility import AccessibilityResponse, RegionAccessibility
from app.services.accessibility_service import (
    aggregate_by_sigun,
    compute_access_scores,
    fetch_accessibility_institutions,
)

router = APIRouter(prefix="/accessibility", tags=["accessibility"])


@router.get("", response_model=AccessibilityResponse)
def get_accessibility() -> AccessibilityResponse:
    """경기도 시군별 장애인활동지원 기관 수 및 생활 접근성 점수를 반환합니다.

    - 점수 산출: access_score = 시군 기관수 / 최대 기관수
    - 결과는 기관 수 내림차순으로 정렬됩니다.
    - GG_API_KEY 미설정 시 빈 목록을 반환합니다.
    """
    institutions = fetch_accessibility_institutions()
    counts = aggregate_by_sigun(institutions)
    scores = compute_access_scores(counts)

    max_count = max(counts.values()) if counts else 0
    total = sum(counts.values())

    regions = [
        RegionAccessibility(
            sigunNm=sigun,
            institutionCount=counts[sigun],
            accessScore=scores[sigun],
        )
        for sigun in sorted(counts, key=lambda k: -counts[k])
    ]

    return AccessibilityResponse(
        regions=regions,
        maxCount=max_count,
        totalInstitutions=total,
    )
