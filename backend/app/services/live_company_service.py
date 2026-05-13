from __future__ import annotations

import time
from datetime import datetime, timezone
from typing import Any

from app.services.accessibility_service import get_access_scores, match_access_score
from app.services.company_rating_service import (
    average_work_env_for_company,
    compute_friendliness_and_breakdown,
)
from app.services.data_service import get_companies_data
from app.services.live_job_service import fetch_live_jobs_merged
from app.services.company_name_normalize import normalize_company_name_key
from app.services.standard_workplace_service import fetch_standard_workplaces


def _extract_location(address: str) -> str:
    tokens = [token for token in address.split(" ") if token]
    if len(tokens) >= 2:
        return f"{tokens[0]} {tokens[1]}"
    if len(tokens) == 1:
        return tokens[0]
    return "지역 미상"


def _grade_from_access(access_score: float) -> str:
    if access_score >= 0.8:
        return "A"
    if access_score >= 0.5:
        return "B"
    if access_score > 0:
        return "C"
    return "D"


def _clamp(value: int, low: int, high: int) -> int:
    return max(low, min(high, value))


_companies_payload_cache: dict[int, tuple[float, dict[str, Any]]] = {}
_COMPANIES_PAYLOAD_TTL_SEC = 90.0


def build_companies_payload(limit: int = 24) -> dict[str, Any]:
    now = time.monotonic()
    hit = _companies_payload_cache.get(limit)
    if hit and (now - hit[0]) < _COMPANIES_PAYLOAD_TTL_SEC:
        return hit[1]
    payload = _build_companies_payload_uncached(limit)
    _companies_payload_cache[limit] = (time.monotonic(), payload)
    return payload


def _build_companies_payload_uncached(limit: int = 24) -> dict[str, Any]:
    static_companies = get_companies_data()
    if not static_companies:
        static_companies = [
            {
                "companyName": "공공데이터 연동 대기 기업",
                "location": "경기",
                "disabledEmploymentRate": 3.0,
                "retentionRate": 75,
                "jobDiversity": 60,
                "friendlinessScore": 72,
            }
        ]

    try:
        standard = fetch_standard_workplaces(page_no=1, num_of_rows=200)
        standard_items = standard.get("data", [])
        if not standard_items:
            return {
                "source": "static",
                "syncedAt": datetime.now(timezone.utc).isoformat(),
                "data": static_companies,
            }

        live_jobs = fetch_live_jobs_merged(page_no=1, num_of_rows=200).get("data", [])
        job_count_by_company: dict[str, int] = {}
        employment_types_by_company: dict[str, set[str]] = {}
        for job in live_jobs:
            name = str(job.get("businessName", "")).strip()
            if not name:
                continue
            nk = normalize_company_name_key(name)
            if not nk:
                continue
            job_count_by_company[nk] = job_count_by_company.get(nk, 0) + 1
            employment = str(job.get("employmentType", "")).strip()
            if employment:
                employment_types_by_company.setdefault(nk, set()).add(employment)

        access_scores = get_access_scores()

        seen: set[str] = set()
        companies: list[dict[str, Any]] = []
        for item in standard_items:
            name = str(item.get("workplaceName", "")).strip()
            if not name:
                continue

            address = str(item.get("address", "")).strip()
            location = _extract_location(address)
            key = f"{name}|{location}"
            if key in seen:
                continue
            seen.add(key)

            name_key = normalize_company_name_key(name)
            job_count = job_count_by_company.get(name_key, 0)
            type_count = len(employment_types_by_company.get(name_key, set()))
            access_score = match_access_score(location, access_scores) if access_scores else 0.0

            disabled_rate = round(min(10.0, 2.0 + (job_count * 0.45)), 1)
            retention_r = _clamp(72 + job_count, 60, 95)
            diversity = _clamp(55 + type_count * 10, 35, 100)
            work_env_avg = average_work_env_for_company(live_jobs, name)

            friendliness, breakdown = compute_friendliness_and_breakdown(
                disabled_employment_rate=disabled_rate,
                retention_rate=float(retention_r),
                job_diversity=diversity,
                standard_workplace_certified=True,
                work_env_avg=work_env_avg,
                job_count=job_count,
                type_count=type_count,
            )

            companies.append(
                {
                    "companyName": name,
                    "location": location,
                    "industry": str(item.get("companyTypeName", "") or item.get("product", "")).strip() or None,
                    "disabledEmploymentRate": disabled_rate,
                    "retentionRate": retention_r,
                    "jobDiversity": diversity,
                    "friendlinessScore": friendliness,
                    "disabledEmployedCount": job_count if job_count > 0 else None,
                    "accessibilityGrade": _grade_from_access(access_score),
                    "standardWorkplaceCertified": True,
                    "monthlySupportLabel": "최대 80만원/월",
                    "annualSupportLabel": "최대 960만원/년",
                    "accessibilityScore": round(access_score, 4) if access_score else None,
                    "compositeScore": _clamp(
                        round((friendliness / 100 * 0.7 + access_score * 0.3) * 100), 0, 100
                    ),
                    "ratingBreakdown": breakdown,
                    "subScores": {
                        "accessibility": _clamp(
                            int(round(breakdown["workEnvironmentSixAvg"])), 0, 100
                        ),
                        "employment": _clamp(int(round(breakdown["employment"])), 0, 100),
                        "welfare": _clamp(int(round(breakdown["welfare"])), 0, 100),
                        "culture": _clamp(
                            int(
                                round(
                                    (breakdown["retention"] + breakdown["jobDiversity"]) / 2
                                )
                            ),
                            0,
                            100,
                        ),
                    },
                }
            )

        companies.sort(
            key=lambda company: (
                int(company.get("compositeScore") or company.get("friendlinessScore") or 0),
                int(company.get("disabledEmployedCount") or 0),
            ),
            reverse=True,
        )
        if not companies:
            return {
                "source": "static",
                "syncedAt": datetime.now(timezone.utc).isoformat(),
                "data": static_companies,
            }
        return {
            "source": "live",
            "syncedAt": datetime.now(timezone.utc).isoformat(),
            "data": companies[:limit],
        }
    except Exception:
        return {
            "source": "static",
            "syncedAt": datetime.now(timezone.utc).isoformat(),
            "data": static_companies,
        }
