"""생활 접근성 점수 API.

GET /accessibility  — 경기도 시군별 장애인활동 지원 기관 현황 API 연동, 기관 수·접근성 점수 반환
GET /accessibility/institutions — 시군별(선택) 기관 목록
"""
from typing import Any

from fastapi import APIRouter, HTTPException, Query

from app.schemas.accessibility import (
    AccessibilityResponse,
    ActivitySupportInstitution,
    RegionAccessibility,
)
from app.services.accessibility_service import (
    GYEONGGI_SIGUNS,
    aggregate_by_sigun,
    compute_access_scores,
    fetch_accessibility_institutions,
)

router = APIRouter(prefix="/accessibility", tags=["accessibility"])


def _row_to_institution(row: dict[str, Any]) -> ActivitySupportInstitution:
    return ActivitySupportInstitution(
        sigunCd=str(row.get("SIGUN_CD") or ""),
        sigunNm=str(row.get("SIGUN_NM") or ""),
        instNm=str(row.get("INST_NM") or ""),
        actAsstnSalaryDivNm=str(row.get("ACT_ASSTN_SALARY_DIV_NM") or ""),
        visitBathSalaryDivNm=str(row.get("VISIT_BATH_SALARY_DIV_NM") or ""),
        visitNurngSalaryDivNm=str(row.get("VISIT_NURNG_SALARY_DIV_NM") or ""),
        refineLotnoAddr=str(row.get("REFINE_LOTNO_ADDR") or ""),
        refineRoadnmAddr=str(row.get("REFINE_ROADNM_ADDR") or ""),
        refineZipCd=str(row.get("REFINE_ZIP_CD") or ""),
        refineWgs84Lat=str(row.get("REFINE_WGS84_LAT") or ""),
        refineWgs84Logt=str(row.get("REFINE_WGS84_LOGT") or ""),
        telno=str(row.get("TELNO") or ""),
        hmpgUrl=str(row.get("HMPG_URL") or ""),
    )


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


@router.get("/institutions", response_model=list[ActivitySupportInstitution])
def list_activity_support_institutions(
    sigun_nm: str | None = Query(
        default=None,
        alias="sigunNm",
        description="경기도 시군명(예: 수원시). 생략 시 전체(페이지 크기 한도 내).",
    ),
) -> list[ActivitySupportInstitution]:
    """경기도 Open API 기준 장애인활동 지원 기관 목록을 반환합니다."""
    if sigun_nm is not None and sigun_nm.strip():
        name = sigun_nm.strip()
        if name not in GYEONGGI_SIGUNS:
            raise HTTPException(
                status_code=400,
                detail="지원하지 않는 시군명입니다. 경기도 31개 시·군 이름을 사용하세요.",
            )
        rows = fetch_accessibility_institutions(sigun_nm=name)
    else:
        rows = fetch_accessibility_institutions()

    return [_row_to_institution(r) for r in rows]
