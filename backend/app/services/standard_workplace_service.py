from __future__ import annotations

from typing import Any
from xml.etree import ElementTree

import requests
from fastapi import HTTPException

from app.core.config import settings


def _text(item: ElementTree.Element, *tags: str) -> str:
    for tag in tags:
        node = item.find(tag)
        if node is not None and node.text:
            return node.text.strip()
    return ""


def fetch_standard_workplaces(page_no: int = 1, num_of_rows: int = 20) -> dict[str, Any]:
    api_key = settings.data_go_api_key or settings.odcloud_api_key
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="DATA_GO_API_KEY(또는 ODCLOUD_API_KEY)가 설정되지 않았습니다.",
        )

    url = f"{settings.data_go_base_url}/comp_auth"
    params = {
        "serviceKey": api_key,
        "pageNo": page_no,
        "numOfRows": num_of_rows,
    }

    try:
        response = requests.get(url, params=params, timeout=20)
        response.raise_for_status()
    except requests.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"표준사업장 API HTTP 오류: {exc}") from exc
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=f"표준사업장 API 요청 실패: {exc}") from exc

    try:
        root = ElementTree.fromstring(response.content)
    except ElementTree.ParseError as exc:
        raise HTTPException(status_code=502, detail="표준사업장 API XML 파싱 실패") from exc

    # 공공데이터 XML 공통 구조(response/body/items/item)를 기준으로 파싱
    items = root.findall(".//item")
    parsed_data: list[dict[str, str]] = []
    for item in items:
        entry = {
            "certificationNumber": _text(
                item, "authNum", "authNo", "crtfcNo", "certNo", "stdEntrpsNo", "인증번호"
            ),
            "certificationDate": _text(
                item, "authDate", "authDt", "authYmd", "certDate", "인증일자"
            ),
            "businessRegistrationNumber": _text(
                item, "bizrno", "bizrNo", "bsno", "brno", "사업자등록번호"
            ),
            "workplaceName": _text(
                item, "cmpnm", "cmpnNm", "compNm", "wkplceNm", "compnm", "bizplcNm", "사업체명"
            ),
            "address": _text(
                item, "adres", "addr", "roadNmAddr", "lotNoAddr", "adrs", "사업체주소"
            ),
            "phoneNumber": _text(item, "telno", "telNo", "tel", "사업체연락처"),
        }
        parsed_data.append(entry)

    def _int_from_xml(path: str, fallback: int) -> int:
        value = root.findtext(path)
        if not value:
            return fallback
        try:
            return int(value)
        except ValueError:
            return fallback

    return {
        "pageNo": _int_from_xml(".//pageNo", page_no),
        "numOfRows": _int_from_xml(".//numOfRows", num_of_rows),
        "totalCount": _int_from_xml(".//totalCount", len(parsed_data)),
        "data": parsed_data,
    }
