from __future__ import annotations

from typing import Any
from xml.etree import ElementTree

import requests
from fastapi import HTTPException

from app.core.config import settings


def _text(item: ElementTree.Element, tag: str) -> str:
    node = item.find(tag)
    if node is not None and node.text:
        return node.text.strip()
    return ""


def _int_from_xml(root: ElementTree.Element, path: str, fallback: int) -> int:
    value = root.findtext(path)
    if not value:
        return fallback
    try:
        return int(value)
    except ValueError:
        return fallback


def _request_job_api(path: str, page_no: int, num_of_rows: int) -> ElementTree.Element:
    api_key = settings.data_go_api_key or settings.odcloud_api_key
    if not api_key:
        raise HTTPException(status_code=500, detail="DATA_GO_API_KEY(또는 ODCLOUD_API_KEY)가 필요합니다.")

    url = f"{settings.data_go_job_base_url}{path}"
    params = {"serviceKey": api_key, "pageNo": str(page_no), "numOfRows": str(num_of_rows)}
    try:
        response = requests.get(url, params=params, timeout=20)
        response.raise_for_status()
        root = ElementTree.fromstring(response.content)
    except requests.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"구인 API HTTP 오류: {exc}") from exc
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=f"구인 API 요청 실패: {exc}") from exc
    except ElementTree.ParseError as exc:
        raise HTTPException(status_code=502, detail="구인 API XML 파싱 실패") from exc

    result_code = root.findtext(".//resultCode")
    if result_code and result_code != "00":
        result_msg = root.findtext(".//resultMsg") or "외부 API 오류"
        raise HTTPException(status_code=502, detail=f"구인 API 오류({result_code}): {result_msg}")
    return root


def fetch_live_jobs(page_no: int = 1, num_of_rows: int = 20) -> dict[str, Any]:
    root = _request_job_api("/job_list", page_no, num_of_rows)
    items = root.findall(".//item")
    data: list[dict[str, str]] = []
    for item in items:
        data.append(
            {
                "recruitmentPeriod": _text(item, "termDate"),
                "businessName": _text(item, "busplaName"),
                "contactNumber": _text(item, "cntctNo"),
                "companyAddress": _text(item, "compAddr"),
                "employmentType": _text(item, "empType"),
                "entryType": _text(item, "enterType"),
                "jobName": _text(item, "jobNm"),
                "applicationDate": _text(item, "offerregDt"),
                "registeredAt": _text(item, "regDt"),
                "agencyName": _text(item, "regagnName"),
                "requiredCareer": _text(item, "reqCareer"),
                "requiredEducation": _text(item, "reqEduc"),
                "salaryType": _text(item, "salaryType"),
                "salary": _text(item, "salary"),
            }
        )
    return {
        "pageNo": _int_from_xml(root, ".//pageNo", page_no),
        "numOfRows": _int_from_xml(root, ".//numOfRows", num_of_rows),
        "totalCount": _int_from_xml(root, ".//totalCount", len(data)),
        "data": data,
    }


def fetch_live_jobs_with_env(page_no: int = 1, num_of_rows: int = 20) -> dict[str, Any]:
    root = _request_job_api("/job_list_env", page_no, num_of_rows)
    items = root.findall(".//item")
    data: list[dict[str, str]] = []
    for item in items:
        data.append(
            {
                "recruitmentPeriod": _text(item, "termDate"),
                "businessName": _text(item, "busplaName"),
                "contactNumber": _text(item, "cntctNo"),
                "companyAddress": _text(item, "compAddr"),
                "employmentType": _text(item, "empType"),
                "entryType": _text(item, "enterType"),
                "jobName": _text(item, "jobNm"),
                "applicationDate": _text(item, "offerregDt"),
                "registeredAt": _text(item, "regDt"),
                "agencyName": _text(item, "regagnName"),
                "requiredCareer": _text(item, "reqCareer"),
                "requiredEducation": _text(item, "reqEduc"),
                "salaryType": _text(item, "salaryType"),
                "salary": _text(item, "salary"),
                "envBothHands": _text(item, "envBothHands"),
                "envEyesight": _text(item, "envEyesight"),
                "envHandwork": _text(item, "envHandwork"),
                "envLiftPower": _text(item, "envLiftPower"),
                "envLstnTalk": _text(item, "envLstnTalk"),
                "envStndWalk": _text(item, "envStndWalk"),
            }
        )
    return {
        "pageNo": _int_from_xml(root, ".//pageNo", page_no),
        "numOfRows": _int_from_xml(root, ".//numOfRows", num_of_rows),
        "totalCount": _int_from_xml(root, ".//totalCount", len(data)),
        "data": data,
    }
