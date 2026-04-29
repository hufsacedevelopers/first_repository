import json
from pathlib import Path
from typing import Any

from app.core.config import DATA_DIR

DEFAULT_COMPANIES: list[dict[str, Any]] = [
    {
        "companyName": "한빛IT솔루션",
        "location": "서울",
        "disabledEmploymentRate": 4.1,
        "retentionRate": 88,
        "jobDiversity": 78,
        "friendlinessScore": 86,
    },
    {
        "companyName": "다온서비스",
        "location": "경기",
        "disabledEmploymentRate": 3.2,
        "retentionRate": 81,
        "jobDiversity": 69,
        "friendlinessScore": 76,
    },
    {
        "companyName": "새론물류",
        "location": "부산",
        "disabledEmploymentRate": 4.8,
        "retentionRate": 92,
        "jobDiversity": 74,
        "friendlinessScore": 89,
    },
]

DEFAULT_JOBS: list[dict[str, Any]] = [
    {
        "title": "웹 접근성 QA 어시스턴트",
        "companyName": "한빛IT솔루션",
        "location": "서울",
        "employmentType": "정규직",
        "accessibilityTags": ["재택가능", "보조공학지원", "유연근무"],
    },
    {
        "title": "고객지원 코디네이터",
        "companyName": "다온서비스",
        "location": "경기",
        "employmentType": "계약직",
        "accessibilityTags": ["근무공간개선", "멘토링제도"],
    },
    {
        "title": "물류데이터 운영 담당",
        "companyName": "새론물류",
        "location": "부산",
        "employmentType": "정규직",
        "accessibilityTags": ["셔틀운영", "직무적응교육"],
    },
]

DEFAULT_SUPPORTS: list[dict[str, Any]] = [
    {
        "supportName": "장애인 신규고용 장려금",
        "target": "장애인 근로자를 신규 채용한 사업주",
        "amount": "월 최대 90만원",
        "description": "고용 유지 기간과 근로시간 조건에 따라 차등 지급되는 고용 장려금",
    },
    {
        "supportName": "근로환경 개선 지원",
        "target": "장애인 근로자 근무환경 개선이 필요한 기업",
        "amount": "최대 1,500만원",
        "description": "작업장 접근성 개선, 보조기기 도입, 안전 설비 보강 비용 지원",
    },
    {
        "supportName": "장애인 고용 컨설팅 지원",
        "target": "장애인 채용 체계를 도입하려는 중소기업",
        "amount": "전액 지원",
        "description": "직무 설계, 채용 프로세스 개선, 직장 내 적응 프로그램 컨설팅 제공",
    },
]


def _read_json_file(file_path: Path, fallback_data: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if not file_path.exists():
        return fallback_data
    with file_path.open("r", encoding="utf-8") as file:
        return json.load(file)


def get_companies_data() -> list[dict[str, Any]]:
    return _read_json_file(DATA_DIR / "companies.json", DEFAULT_COMPANIES)


def get_jobs_data() -> list[dict[str, Any]]:
    return _read_json_file(DATA_DIR / "jobs.json", DEFAULT_JOBS)


def get_supports_data() -> list[dict[str, Any]]:
    return _read_json_file(DATA_DIR / "supports.json", DEFAULT_SUPPORTS)
