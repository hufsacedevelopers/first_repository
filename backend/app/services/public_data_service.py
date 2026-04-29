from __future__ import annotations

import json
from typing import Any

import requests
from fastapi import HTTPException

from app.core.config import settings

YEAR_TO_UDDI: dict[int, str] = {
    2025: "uddi:8dc5b7ce-f641-4cb4-a5b5-9a8876b01253",
    2024: "uddi:9741cfd1-ff55-4555-bf21-f59ead6bed36",
    2023: "uddi:eda3ce2c-4312-4a29-8a9d-ff0c33508008",
    2022: "uddi:58d80582-8386-43c8-b0ee-b3bcd6ccd4ec",
    2021: "uddi:fb2af9f6-49b4-4d1f-96b7-93e6d42b0e97",
    2020: "uddi:d2eda7f8-b10d-478b-b7c0-c9b71d60ddfa",
    2019: "uddi:3e728908-ac34-44f4-bb8f-86153a55bc63",
    2018: "uddi:a576a3fc-ac93-4728-bb24-9f11c66740d5",
}


def _parse_json_payload(response: requests.Response) -> dict[str, Any]:
    # API가 charset을 정확히 주지 않는 경우를 고려해 복수 인코딩을 시도합니다.
    for encoding in ("utf-8-sig", "utf-8", "cp949", "euc-kr"):
        try:
            return json.loads(response.content.decode(encoding))
        except (UnicodeDecodeError, json.JSONDecodeError):
            continue
    return response.json()


def _fix_mojibake(text: str) -> str:
    # "ê°..." 형태(UTF-8 문자열이 latin1로 잘못 해석된 경우)를 복구합니다.
    if not text:
        return text
    try:
        repaired = text.encode("latin1").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return text
    return repaired


def _normalize_row(row: dict[str, Any], year: int) -> dict[str, Any]:
    region = row.get("지역명") or row.get("지역") or ""
    industry = row.get("업종명") or row.get("업종") or ""
    raw_count = row.get("사업체수", 0)
    try:
        count = int(str(raw_count).replace(",", "").strip())
    except ValueError:
        count = 0

    return {
        "year": year,
        "region": _fix_mojibake(str(region)),
        "industry": _fix_mojibake(str(industry)),
        "businessCount": count,
    }


def fetch_incentive_companies_by_year(
    year: int,
    page: int = 1,
    per_page: int = 100,
) -> dict[str, Any]:
    uddi = YEAR_TO_UDDI.get(year)
    if not uddi:
        raise HTTPException(status_code=400, detail="지원하지 않는 연도입니다.")

    if not settings.odcloud_api_key:
        raise HTTPException(
            status_code=500,
            detail="ODCLOUD_API_KEY가 설정되지 않았습니다. backend/.env 를 확인하세요.",
        )

    url = f"{settings.odcloud_base_url}/15054713/v1/{uddi}"
    params = {
        "serviceKey": settings.odcloud_api_key,
        "page": page,
        "perPage": per_page,
        "returnType": "json",
    }
    # Swagger securityDefinitions에 query(serviceKey) + header(Authorization)가 함께 있어
    # 운영 환경별 인증 처리 차이를 줄이기 위해 둘 다 전달합니다.
    headers = {"Authorization": settings.odcloud_api_key}

    try:
        response = requests.get(url, params=params, headers=headers, timeout=15)
        response.raise_for_status()
        payload = _parse_json_payload(response)
    except requests.HTTPError as exc:
        status_code = exc.response.status_code if exc.response is not None else 502
        if status_code == 401:
            raise HTTPException(
                status_code=502,
                detail="외부 API 인증 실패(401): ODCLOUD_API_KEY 값 또는 인코딩/디코딩 키 유형을 확인하세요.",
            ) from exc
        raise HTTPException(status_code=502, detail=f"외부 API HTTP 오류: {exc}") from exc
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=f"외부 API 요청 실패: {exc}") from exc
    except ValueError as exc:
        raise HTTPException(status_code=502, detail="외부 API 응답(JSON) 파싱 실패") from exc

    rows = payload.get("data", [])
    normalized = [_normalize_row(row, year=year) for row in rows]
    return {
        "page": payload.get("page", page),
        "perPage": payload.get("perPage", per_page),
        "totalCount": payload.get("totalCount", len(normalized)),
        "currentCount": payload.get("currentCount", len(normalized)),
        "data": normalized,
    }
