"""경기도 장애인활동지원 기관 현황 기반 생활 접근성 점수 산출 서비스.

외부 API: 경기도 Open API (openapi.gg.go.kr)
데이터셋: 시군별 장애인활동지원 기관 현황
점수 로직: access_score = 시군 기관수 / 최대 기관수  (0~1 정규화)
종합 점수: composite = base_score * 0.7 + access_score * 0.3
"""
from __future__ import annotations

import logging
import time
from typing import Any

import requests

from app.core.config import settings

logger = logging.getLogger(__name__)

# ─── 경기도 31개 시군 목록 ──────────────────────────────────────────────────────
GYEONGGI_SIGUNS: frozenset[str] = frozenset({
    "수원시", "성남시", "의정부시", "안양시", "부천시", "광명시",
    "평택시", "동두천시", "안산시", "고양시", "과천시", "구리시",
    "남양주시", "오산시", "시흥시", "군포시", "의왕시", "하남시",
    "용인시", "파주시", "이천시", "안성시", "김포시", "화성시",
    "광주시", "양주시", "포천시", "여주시", "연천군", "가평군", "양평군",
})

# ─── 인메모리 캐시 (TTL: 1시간, 외부 API 호출 최소화) ────────────────────────────
_CACHE_TTL = 3600.0
_cache: dict[str, float] = {}
_cache_ts: float = 0.0


def fetch_accessibility_institutions(
    page_no: int = 1,
    page_size: int = 1000,
) -> list[dict[str, Any]]:
    """경기도 Open API에서 장애인활동지원 기관 목록을 가져옵니다.

    - API 키가 없거나 호출 실패 시 빈 리스트 반환 (graceful fallback)
    - 경기도 Open API 응답 구조: [{ServiceName: [{head: ...}, {row: [...]}]}]
    """
    if not settings.gg_api_key:
        logger.warning("GG_API_KEY가 설정되지 않아 접근성 데이터를 불러올 수 없습니다.")
        return []

    params = {
        "KEY": settings.gg_api_key,
        "Type": "json",
        "pIndex": page_no,
        "pSize": page_size,
    }
    try:
        resp = requests.get(settings.gg_api_base_url, params=params, timeout=20)
        resp.raise_for_status()
        raw: list[dict[str, Any]] = resp.json()
    except requests.RequestException as exc:
        logger.warning("경기도 API 요청 실패: %s", exc)
        return []
    except ValueError:
        logger.warning("경기도 API 응답 JSON 파싱 실패")
        return []

    # 응답 구조 파싱: [{서비스명: [{head}, {row: [...]}]}]
    try:
        service_data = raw[0]
        service_name = next(iter(service_data))          # 서비스명 키 동적 추출
        blocks: list[dict[str, Any]] = service_data[service_name]
        row_block = next((b for b in blocks if "row" in b), None)
        return row_block["row"] if row_block else []
    except (IndexError, KeyError, StopIteration, TypeError) as exc:
        logger.warning("경기도 API 응답 구조 파싱 실패: %s", exc)
        return []


def aggregate_by_sigun(institutions: list[dict[str, Any]]) -> dict[str, int]:
    """시군별 기관 수를 집계합니다.

    반환 예시: {"수원시": 18, "성남시": 25, "용인시": 12}
    """
    counts: dict[str, int] = {}
    for inst in institutions:
        sigun = str(inst.get("SIGUN_NM", "")).strip()
        if sigun:
            counts[sigun] = counts.get(sigun, 0) + 1
    return counts


def compute_access_scores(sigun_counts: dict[str, int]) -> dict[str, float]:
    """기관 수를 기준으로 0~1 사이 점수로 정규화합니다.

    access_score = 기관수 / 최대기관수
    최대 기관수를 가진 시군이 1.0, 나머지는 비율에 따라 0~1.
    """
    if not sigun_counts:
        return {}
    max_count = max(sigun_counts.values())
    if max_count == 0:
        return {k: 0.0 for k in sigun_counts}
    return {
        sigun: round(count / max_count, 4)
        for sigun, count in sigun_counts.items()
    }


def get_access_scores() -> dict[str, float]:
    """캐시를 활용하는 전체 파이프라인: API 호출 → 집계 → 정규화.

    TTL(1시간) 내에는 캐시된 결과를 반환하여 외부 API 호출을 최소화합니다.
    """
    global _cache, _cache_ts
    now = time.monotonic()
    if _cache and (now - _cache_ts) < _CACHE_TTL:
        return _cache

    institutions = fetch_accessibility_institutions()
    counts = aggregate_by_sigun(institutions)
    scores = compute_access_scores(counts)

    if scores:  # 성공한 경우만 캐시 갱신
        _cache = scores
        _cache_ts = now
    return scores


def extract_sigun(location: str) -> str | None:
    """주소 문자열에서 경기도 시군명을 추출합니다.

    예:
        "경기도 수원시 영통구 ..." → "수원시"
        "수원시"                  → "수원시"
        "서울특별시 강남구"        → None
    """
    for sigun in GYEONGGI_SIGUNS:
        if sigun in location:
            return sigun
    return None


def match_access_score(location: str, access_scores: dict[str, float]) -> float:
    """기업 위치(location)를 시군 점수에 매칭합니다.

    매칭 우선순위:
    1. 시군명 포함 → 해당 시군 점수
    2. '경기' 포함 (시군 불명) → 전체 경기도 시군 평균 점수
    3. 경기도 외 지역 → 0.0
    """
    sigun = extract_sigun(location)
    if sigun:
        return access_scores.get(sigun, 0.0)
    if "경기" in location and access_scores:
        # 시군 불명 경기도 기업에는 경기도 평균 접근성 점수 적용
        return round(sum(access_scores.values()) / len(access_scores), 4)
    return 0.0


def apply_accessibility_to_companies(
    companies: list[dict[str, Any]],
    access_scores: dict[str, float],
) -> list[dict[str, Any]]:
    """기업 목록에 생활 접근성 점수(accessibilityScore)와 종합 점수(compositeScore)를 추가합니다.

    종합 점수 산식:
        composite = round((friendlinessScore/100 * 0.7 + access_score * 0.3) * 100)

    Args:
        companies: 기업 딕셔너리 목록 (friendlinessScore 필드 필요)
        access_scores: compute_access_scores() 결과 (시군명 → 0~1 점수)

    Returns:
        accessibilityScore, compositeScore 필드가 추가된 기업 목록
    """
    result: list[dict[str, Any]] = []
    for company in companies:
        company = dict(company)  # 원본 변경 방지
        access_score = match_access_score(company.get("location", ""), access_scores)
        base_score = company.get("friendlinessScore", 0) / 100.0
        composite = round((base_score * 0.7 + access_score * 0.3) * 100)

        company["accessibilityScore"] = access_score
        company["compositeScore"] = composite
        result.append(company)
    return result
